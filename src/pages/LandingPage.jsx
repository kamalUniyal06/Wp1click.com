import { ArrowRight, CheckCircle2, Palette, Sparkles, WandSparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>OneClick</span>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/category")}>
          Start building
        </button>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-glow one" />
          <div className="hero-glow two" />
          <div className="hero-content">
            <div className="hero-badge"><WandSparkles size={15} /> Website creation, simplified</div>
            <h1>Your business website, created in a few simple steps.</h1>
            <p>
              Choose your industry, select a design, add your business information
              and personalize the colors and typography with a live preview.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-large" onClick={() => navigate("/category")}>
                Create my website <ArrowRight size={19} />
              </button>
              <span>No technical knowledge required</span>
            </div>
            <div className="hero-checks">
              <span><CheckCircle2 size={17} /> Professional templates</span>
              <span><CheckCircle2 size={17} /> Live brand preview</span>
              <span><CheckCircle2 size={17} /> Mobile responsive</span>
            </div>
          </div>

          <div className="hero-product-card">
            <div className="product-window">
              <div className="product-sidebar">
                <div className="tiny-logo" />
                <i /><i /><i /><i />
              </div>
              <div className="product-content">
                <div className="product-top"><i /><i /></div>
                <div className="product-banner">
                  <span>Build your next website</span>
                  <b>Beautiful. Fast. Effortless.</b>
                  <button>Get started</button>
                </div>
                <div className="product-grid"><i /><i /><i /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <article>
            <span><Sparkles size={22} /></span>
            <h3>Choose a template</h3>
            <p>Select a ready-made design created for your business category.</p>
          </article>
          <article>
            <span><Palette size={22} /></span>
            <h3>Build your brand</h3>
            <p>Choose colors, typography and your preferred visual personality.</p>
          </article>
          <article>
            <span><WandSparkles size={22} /></span>
            <h3>Preview instantly</h3>
            <p>See every branding change immediately before completing your setup.</p>
          </article>
        </section>
      </main>
    </div>
  );
}
