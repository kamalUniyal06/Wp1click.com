import { ArrowRight, CheckCircle2, Menu, Star } from "lucide-react";
import { useBuilderStore } from "../store/useBuilderStore";

export default function WebsitePreview({ compact = false }) {
  const { business, branding, logo, pages, templateProfile } = useBuilderStore();
  const companyName = business.companyName || "Your Company";
  const tagline = business.tagline || "Build a stronger digital presence";
  const description =
    business.description ||
    "A professional website experience designed around your business, audience and goals.";

  const vars = {
    "--preview-primary": branding.colors.primary,
    "--preview-secondary": branding.colors.secondary,
    "--preview-accent": branding.colors.accent,
    "--preview-bg": branding.colors.background,
    "--preview-surface": branding.colors.surface,
    "--preview-text": branding.colors.text,
    "--preview-radius": `${branding.radius}px`,
    "--heading-font": branding.headingFont,
    "--body-font": branding.bodyFont,
    "--preview-template": templateProfile || "modern",
  };

  return (
    <div className={`website-preview ${compact ? "compact" : ""}`} style={vars}>
      <div className="preview-browser">
        <div className="browser-dots"><i /><i /><i /></div>
        <div className="browser-address">yourwebsite.com</div>
      </div>

      <div className="preview-site">
        <header className="preview-header">
          <div className="preview-logo">
            {logo.previewUrl ? (
              <img src={logo.previewUrl} alt="Business logo" />
            ) : (
              <span>{companyName.slice(0, 1).toUpperCase()}</span>
            )}
            <b>{companyName}</b>
          </div>
          <nav>
            {pages.filter((page) => page.enabled !== false).map((page) => (
              <a key={page.id}>{page.title}</a>
            ))}
          </nav>
          <button className="preview-menu"><Menu size={18} /></button>
          <button className="preview-header-button">Get started</button>
        </header>

        <section className="preview-hero">
          <div className="preview-copy">
            <div className="preview-pill">
              <Star size={14} fill="currentColor" />
              Designed for your business
            </div>
            <h2>{tagline}</h2>
            <p>{description}</p>
            <div className="preview-actions">
              <button>Start today <ArrowRight size={16} /></button>
              <button className="outline">Learn more</button>
            </div>
            <div className="preview-trust">
              <span><CheckCircle2 size={15} /> Professional design</span>
              <span><CheckCircle2 size={15} /> Mobile ready</span>
            </div>
          </div>

          <div className="preview-visual">
            <div className="visual-card large">
              <span>Business growth</span>
              <strong>+64%</strong>
              <div className="mini-chart">
                <i style={{ height: "35%" }} />
                <i style={{ height: "52%" }} />
                <i style={{ height: "43%" }} />
                <i style={{ height: "72%" }} />
                <i style={{ height: "88%" }} />
              </div>
            </div>
            <div className="visual-card small top">
              <span>New enquiries</span>
              <strong>128</strong>
            </div>
            <div className="visual-card small bottom">
              <span>Customer rating</span>
              <strong>4.9 ★</strong>
            </div>
          </div>
        </section>

        <section className="preview-features">
          {["Professional strategy", "Custom experience", "Built to convert"].map((item, index) => (
            <article key={item}>
              <span>0{index + 1}</span>
              <h3>{item}</h3>
              <p>Clear messaging and modern design tailored to your audience.</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
