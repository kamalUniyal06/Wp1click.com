import { CheckCircle2, Edit3, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BuilderLayout from "../components/BuilderLayout";
import WebsitePreview from "../components/WebsitePreview";
import { categories } from "../data/categories";
import { templates } from "../data/templates";
import { useBuilderStore } from "../store/useBuilderStore";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "../api";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getDocument(response) {

  return response?.document || response?.websiteDocument || response?.data?.document || response?.data || null;
}

function mergeGeneratedImageAssets(document, imageAssets) {
  if (!document || !Array.isArray(imageAssets) || imageAssets.length === 0) {
    return document;
  }

  const assets = new Map(
    imageAssets
      .filter((asset) => asset && asset.url)
      .map((asset) => [String(asset.asset || ""), asset]),
  );

  const pages = document.pages && typeof document.pages === "object"
    ? document.pages
    : {};

  for (const [pageKey, page] of Object.entries(pages)) {
    if (!page || !Array.isArray(page.sections)) continue;

    for (const section of page.sections) {
      if (!section || typeof section !== "object") continue;

      const asset = assets.get(String(section.id || ""));
      if (asset) {
        section.data = {
          ...(section.data || {}),
          imageUrl: asset.url,
          imageAlt: section.data?.imageAlt || "AI-generated website visual",
        };
      }

      // Also support asset IDs that are page/section based even when the
      // generator returned a slightly different section id.
      const fallbackAsset = assets.get(`${pageKey}-${section.id || ""}`);
      if (fallbackAsset && !section.data?.imageUrl) {
        section.data = {
          ...(section.data || {}),
          imageUrl: fallbackAsset.url,
        };
      }
    }
  }

  return document;
}


function buildNavigation(pages) {
  const labels = { home: "Home", about: "About", services: "Services", blog: "Blog", contact: "Contact" };
  const items = pages
    .filter((page) => page.enabled !== false)
    .map((page) => ({ label: page.title || labels[page.slug] || page.slug, url: page.slug === "home" ? "/" : `/${page.slug}/` }));
  return { header: items, footer: items.filter((item) => item.url !== "/") };
}

function ensureRequestedPages(document, selectedPages) {
  if (!document?.pages || !Array.isArray(selectedPages)) return document;
  const pages = { ...document.pages };
  for (const page of selectedPages.filter((item) => item.enabled !== false)) {
    const slug = String(page.slug || page.id || "").toLowerCase();
    if (!slug || pages[slug]) continue;
    if (slug === "blog") continue;
    {
      pages[slug] = {
        slug,
        title: page.title || slug.charAt(0).toUpperCase() + slug.slice(1),
        isFrontPage: false,
        sections: [{ id: `${slug}-hero`, type: "hero", variant: "centered", enabled: true, style: { tone: "soft", spacing: "loose", width: "normal" }, data: { eyebrow: page.title || slug, title: page.title || slug, text: "", imageUrl: "", imageAlt: "", mediaBadge: "", mediaPosition: "", number: "", email: "", phone: "", address: "", cardTitle: "", cardText: "", buttonLabel: "", primaryButton: { label: "", url: "" }, secondaryButton: { label: "", url: "" }, button: { label: "", url: "" }, items: [], bullets: [], proof: [] } }]
      };
    }
  }
  return { ...document, pages };
}

async function postJson(path, body) {
  const response = await fetch(`${API_BASE}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const raw = await response.text();
  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    throw new Error(`Server returned invalid JSON (${response.status}).`);
  }

  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || data?.message || `Request failed (${response.status}).`);
  }

  return data;
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const {
    category,
    templateId,
    business,
    branding,
    logo,
    getWordPressConfiguration,
    initializeProject,
    setGenerationResult,
    setBuilderStatus,
  } = useBuilderStore();

  const categoryName = categories.find((item) => item.id === category)?.name || "Not selected";
  const templateName = templates.find((item) => item.id === templateId)?.name || "Not selected";
  const isGenerating = useBuilderStore((state) => state.builder.isGenerating);
  const generationError = useBuilderStore((state) => state.builder.error);

  const generateAndProvision = async () => {
    if (isGenerating) return;

    if (!business.companyName.trim()) {
      setBuilderStatus({ error: "Company name is required." });
      return;
    }

    if (!business.email.trim()) {
      setBuilderStatus({ error: "Business/admin email is required." });
      return;
    }

    initializeProject();
    setBuilderStatus({ isGenerating: true, error: "" });
    setGenerationResult({
      status: "generating",
      generatedAt: "",
      responseId: "",
      generatedImages: 0,
      pages: 0,
      document: null,
      provision: null,
      error: "",
    });

    try {
      const state = useBuilderStore.getState();
      const config = state.getWordPressConfiguration();
      const baseSlug = slugify(business.companyName) || "oneclick-site";
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36).slice(-6)}`;
      const siteTitle = state.seo.siteTitle?.trim() || business.companyName.trim();

      const generationPayload = {
        ...config,
        slug: uniqueSlug,
        siteTitle,
        adminEmail: business.email.trim(),
        ownerKey: state.project.id || crypto.randomUUID(),
        templateId: templateId || "ai-dynamic",
        templateProfile: state.templateProfile || templateId || "modern",
        homeSections: state.homeSections,
        requestedPages: state.pages.filter((page) => page.enabled),
        logo: {
          mode: state.logo.mode === "upload" ? "image" : "text",
          text: state.logo.text || state.business.companyName,
          url: state.logo.attachmentUrl || state.logo.previewUrl || "",
          alt: state.business.companyName || "Business logo",
          attachmentId: 0,
        },
      };

      // First: AI generation + image generation.
      const generated = await postJson("generate-site.php", generationPayload);
      let document = getDocument(generated);

      if (!document || typeof document !== "object") {
        throw new Error("The AI engine did not return a WebsiteDocument.");
      }

      // The generator currently returns generated image URLs in meta.imageAssets.
      // Make sure those URLs are actually written into section.data.imageUrl.
      document = mergeGeneratedImageAssets(
        document,
        generated?.meta?.imageAssets || generated?.imageAssets || [],
      );

      document = ensureRequestedPages(document, state.pages.filter((page) => page.enabled));
      document = {
        ...document,
        navigation: buildNavigation(state.pages.filter((page) => page.enabled)),
        logo: {
          ...(document.logo || {}),
          mode: state.logo.mode === "upload" ? "image" : "text",
          text: state.logo.text || state.business.companyName,
          url: state.logo.attachmentUrl || state.logo.previewUrl || document.logo?.url || "",
          alt: state.business.companyName || "Business logo",
          attachmentId: Number(document.logo?.attachmentId || 0),
        },
      };

      // The AI model must not be trusted to remember provisioning metadata.
      // Re-inject it server/client-side before the provisioning request.
      document = {
        ...document,
        slug: uniqueSlug,
        siteTitle,
        adminEmail: business.email.trim(),
        ownerKey: generationPayload.ownerKey,
        templateId: templateId || document.templateId || "ai-dynamic",
      };

      setGenerationResult({
        status: "generated",
        generatedAt: new Date().toISOString(),
        responseId: generated?.meta?.responseId || generated?.responseId || "",
        generatedImages:
          Number(generated?.meta?.generatedImages ?? generated?.generatedImages ?? 0),
        pages: document?.pages && typeof document.pages === "object"
          ? Object.keys(document.pages).length
          : 0,
        document,
      });

      // Second: create the actual WordPress installation.
      const provision = await postJson("provision-site.php", document);

      if (!provision?.success) {
        throw new Error(provision?.error || "WordPress provisioning failed.");
      }

      setGenerationResult({
        status: "provisioned",
        provision,
        generatedAt: new Date().toISOString(),
      });

      setBuilderStatus({
        isGenerating: false,
        isPublishing: false,
        error: "",
      });

      navigate("/success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Website generation failed.";

      setGenerationResult({
        status: "failed",
        error: message,
      });

      setBuilderStatus({
        isGenerating: false,
        isPublishing: false,
        error: message,
      });
    }
  };

  return (
    <BuilderLayout
      step={7}
      title="Review your website setup"
      description="Check your selected design, business information and branding choices. Completing this step generates the site and provisions WordPress automatically."
      backTo="/branding"
      nextLabel={isGenerating ? "Generating website..." : "Generate & create website"}
      onNext={generateAndProvision}
      nextDisabled={isGenerating || !business.companyName.trim() || !business.email.trim()}
    >
      <div className="review-layout">
        <section className="review-summary">
          <div className="review-card">
            <div className="review-card-heading">
              <div><span>Design</span><p>Your selected category and template.</p></div>
              <button onClick={() => navigate("/category")} disabled={isGenerating}><Edit3 size={16} /> Edit</button>
            </div>
            <dl>
              <div><dt>Category</dt><dd>{categoryName}</dd></div>
              <div><dt>Template</dt><dd>{templateName}</dd></div>
            </dl>
          </div>

          <div className="review-card">
            <div className="review-card-heading">
              <div><span>Business details</span><p>The information used throughout your website.</p></div>
              <button onClick={() => navigate("/business-details")} disabled={isGenerating}><Edit3 size={16} /> Edit</button>
            </div>
            <dl>
              <div><dt>Company</dt><dd>{business.companyName || "Not provided"}</dd></div>
              <div><dt>Tagline</dt><dd>{business.tagline || "Not provided"}</dd></div>
              <div><dt>Email / admin</dt><dd>{business.email || "Not provided"}</dd></div>
              <div><dt>Phone</dt><dd>{business.phone || "Not provided"}</dd></div>
            </dl>
          </div>

          <div className="review-card">
            <div className="review-card-heading">
              <div><span>Brand identity</span><p>Your logo, colors and typography.</p></div>
              <button onClick={() => navigate("/branding")} disabled={isGenerating}><Edit3 size={16} /> Edit</button>
            </div>
            <dl>
              <div><dt>Logo</dt><dd>{logo.mode === "upload" ? "Uploaded logo" : logo.mode === "request" ? "Logo requested" : "Text logo"}</dd></div>
              <div><dt>Typography</dt><dd>{branding.headingFont} / {branding.bodyFont}</dd></div>
              <div>
                <dt>Colors</dt>
                <dd className="review-colors">
                  {Object.values(branding.colors).slice(0, 5).map((color) => <i key={color} style={{ background: color }} />)}
                </dd>
              </div>
            </dl>
          </div>

          {generationError ? (
            <div className="ready-box" role="alert">
              <CheckCircle2 size={22} />
              <div>
                <strong>Generation failed</strong>
                <p>{generationError}</p>
              </div>
            </div>
          ) : (
            <div className="ready-box">
              {isGenerating ? <Loader2 size={22} className="spin" /> : <CheckCircle2 size={22} />}
              <div>
                <strong>{isGenerating ? "Generating and provisioning your website..." : "Ready to generate your website."}</strong>
                <p>{isGenerating ? "The AI engine is creating the content and images, then WordPress will be created automatically." : "Click Generate & create website to run the complete AI → images → WordPress flow."}</p>
              </div>
            </div>
          )}
        </section>

        <section className="review-preview">
          <WebsitePreview compact />
        </section>
      </div>
    </BuilderLayout>
  );
}
