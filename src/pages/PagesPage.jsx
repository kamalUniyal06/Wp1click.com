import { BookOpen, Check, FileText, Home, Info, Mail, Plus, Settings2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BuilderLayout from "../components/BuilderLayout";
import { templates } from "../data/templates";
import { useBuilderStore } from "../store/useBuilderStore";

const PAGE_OPTIONS = [
  { id: "about", title: "About", icon: Info },
  { id: "services", title: "Services", icon: Settings2 },
  { id: "blog", title: "Blog", icon: BookOpen },
  { id: "contact", title: "Contact", icon: Mail },
];

const SECTION_OPTIONS = [
  ["stats", "Stats / numbers"],
  ["features", "Features / benefits"],
  ["testimonials", "Testimonials"],
  ["gallery", "Image gallery"],
  ["faq", "FAQ"],
  ["about", "About story"],
  ["services", "Services"],
  ["cta", "Conversion CTA"],
  ["contact", "Contact block"],
];

export default function PagesPage() {
  const navigate = useNavigate();
  const { pages, updatePage, templateId, homeSections, setHomeSections } = useBuilderStore();
  const selectedTemplate = templates.find((t) => t.id === templateId);

  const enabled = (id) => pages.some((p) => p.id === id && p.enabled);

  const toggle = (id, title) => {
    const existing = pages.find((p) => p.id === id);
    if (existing) updatePage(id, { enabled: !existing.enabled });
  };

  const toggleSection = (id) => {
    const next = homeSections.includes(id)
      ? homeSections.filter((item) => item !== id)
      : [...homeSections, id];
    setHomeSections(next);
  };

  return (
    <BuilderLayout
      step={4}
      title="Shape your website"
      description="Choose the pages you want and the sections that should make the homepage feel complete."
      backTo="/business-details"
      nextLabel="Add your logo"
      onNext={() => navigate("/logo")}
    >
      <div className="pages-v2-grid">
        <section className="form-card">
          <div className="form-section-heading">
            <span>Pages & navigation</span>
            <p>Home is always included. Turn the other pages on or off.</p>
          </div>
          <div className="page-option-grid">
            <div className="page-option selected"><span><Home size={20} /></span><div><b>Home</b><small>Always included</small></div><Check size={18} /></div>
            {PAGE_OPTIONS.map(({ id, title, icon: Icon }) => (
              <button key={id} className={`page-option ${enabled(id) ? "selected" : ""}`} onClick={() => toggle(id, title)}>
                <span><Icon size={20} /></span><div><b>{title}</b><small>{id === "blog" ? "Articles and updates" : "AI-generated page"}</small></div>{enabled(id) ? <Check size={18} /> : <Plus size={18} />}
              </button>
            ))}
          </div>
        </section>

        <section className="form-card">
          <div className="form-section-heading">
            <span>Homepage sections</span>
            <p>{selectedTemplate?.name || "Your template"} gives the AI a starting composition. You can add more sections here.</p>
          </div>
          <div className="section-option-grid">
            {SECTION_OPTIONS.map(([id, label]) => (
              <button key={id} className={`section-option ${homeSections.includes(id) ? "selected" : ""}`} onClick={() => toggleSection(id)}>
                <span>{homeSections.includes(id) ? <Check size={16} /> : <Plus size={16} />}</span>{label}
              </button>
            ))}
          </div>
          <div className="section-count"><Sparkles size={17} /> {homeSections.length + 2} planned homepage sections including hero and final CTA.</div>
        </section>
      </div>
    </BuilderLayout>
  );
}
