import { Eye, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BuilderLayout from "../components/BuilderLayout";
import { templates } from "../data/templates";
import { useBuilderStore } from "../store/useBuilderStore";

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { category, templateId, setTemplateId } = useBuilderStore();

  const visibleTemplates = templates.filter(
    (item) => item.category === "all" || item.category === category,
  );

  return (
    <BuilderLayout
      step={2}
      title="Choose your starting design"
      description="Pick a template. You can personalize its colors, fonts and content later."
      backTo="/category"
      nextDisabled={!templateId}
      onNext={() => navigate("/business-details")}
    >
      <div className="template-grid">
        {visibleTemplates.map((template) => {
          const selected = templateId === template.id;
          return (
            <article className={`template-card ${selected ? "selected" : ""}`} key={template.id}>
              <div className="template-art" style={{ background: template.accent }}>
                <span className="template-badge">{template.badge}</span>
                <div className="mock-browser">
                  <div className="mock-header">
                    <i /><span /><span /><span />
                  </div>
                  <div className="mock-hero">
                    <div>
                      <i className="mock-line short" />
                      <i className="mock-line long" />
                      <i className="mock-line medium" />
                      <button />
                    </div>
                    <div className="mock-image" />
                  </div>
                  <div className="mock-blocks"><i /><i /><i /></div>
                </div>
              </div>
              <div className="template-info">
                <div>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
                <button
                  className={`choose-template ${selected ? "chosen" : ""}`}
                  onClick={() => setTemplateId(template.id)}
                >
                  {selected ? <><Check size={16} /> Selected</> : <><Eye size={16} /> Choose design</>}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </BuilderLayout>
  );
}
