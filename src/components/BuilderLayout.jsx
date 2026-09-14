import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  "Category",
  "Template",
  "Business",
  "Pages",
  "Logo",
  "Branding",
  "Review",
];

export default function BuilderLayout({
  step,
  title,
  description,
  children,
  backTo,
  nextLabel = "Continue",
  onNext,
  nextDisabled = false,
}) {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={() => navigate("/")}>
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>OneClick</span>
        </button>
        <span className="save-status">Saved automatically</span>
      </header>

      <div className="builder-progress-wrap">
        <div className="builder-progress">
          {steps.map((label, index) => {
            const number = index + 1;
            const active = number === step;
            const complete = number < step;
            return (
              <div className={`progress-item ${active ? "active" : ""} ${complete ? "complete" : ""}`} key={label}>
                <span className="progress-number">{complete ? "✓" : number}</span>
                <span className="progress-label">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <main className="builder-main">
        <div className="page-heading">
          <span className="eyebrow">Step {step} of 7</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {children}
      </main>

      <footer className="builder-footer">
        <div className="footer-inner">
          <button className="btn btn-secondary" onClick={() => navigate(backTo)}>
            <ArrowLeft size={17} />
            Back
          </button>

          <button
            className="btn btn-primary"
            disabled={nextDisabled}
            onClick={onNext}
          >
            {nextLabel}
            <ChevronRight size={17} />
          </button>
        </div>
      </footer>
    </div>
  );
}
