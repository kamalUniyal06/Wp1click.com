import { ArrowRight, CheckCircle2, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBuilderStore } from "../store/useBuilderStore";

export default function SuccessPage() {
  const navigate = useNavigate();
  const { business, generation, resetBuilder } = useBuilderStore();

  const provision = generation?.provision;
  const siteUrl = provision?.siteUrl || "";
  const adminUrl = provision?.adminUrl || (siteUrl ? `${siteUrl.replace(/\/$/, "")}/wp-admin/` : "");
  const adminUser = provision?.adminUser || "oneclick_admin";
  const adminPassword = provision?.adminPassword || "";
  const generatedImages = Number(generation?.generatedImages || 0);
  const pageCount = Number(generation?.pages || 0);

  const startAgain = () => {
    resetBuilder();
    navigate("/category");
  };

  if (!provision || generation?.status !== "provisioned") {
    return (
      <div className="success-page">
        <div className="success-card">
          <span className="success-icon"><CheckCircle2 size={42} /></span>
          <span className="eyebrow">Generation status</span>
          <h1>{business.companyName || "Your website"} is not provisioned yet.</h1>
          <p>
            The builder has not received the final WordPress provisioning result. Go back to the review step and run the generation again.
          </p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate("/review")}>
              Continue generation <ArrowRight size={17} />
            </button>
            <button className="btn btn-secondary" onClick={startAgain}>
              <RotateCcw size={17} /> Start another website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <span className="success-icon"><CheckCircle2 size={42} /></span>
        <span className="eyebrow">Website created successfully</span>
        <h1>{business.companyName || "Your website"} has been created.</h1>
        <p>
          The AI content and generated images were sent to the WordPress provisioner, and the live website is now ready.
        </p>

        <div className="generation-result-card">
          <div className="generation-result-heading">
            <div>
              <strong>Website details</strong>
              <span>Your generated WordPress installation.</span>
            </div>
          </div>

          <dl className="generation-result-list">
            <div>
              <dt>Website</dt>
              <dd>
                {siteUrl ? (
                  <a href={siteUrl} target="_blank" rel="noreferrer">
                    {siteUrl} <ExternalLink size={15} />
                  </a>
                ) : "—"}
              </dd>
            </div>
            <div>
              <dt>WordPress admin</dt>
              <dd>
                {adminUrl ? (
                  <a href={adminUrl} target="_blank" rel="noreferrer">
                    Open wp-admin <ExternalLink size={15} />
                  </a>
                ) : "—"}
              </dd>
            </div>
            <div><dt>Username</dt><dd><code>{adminUser}</code></dd></div>
            <div><dt>Password</dt><dd><code>{adminPassword || "—"}</code></dd></div>
            <div><dt>Images generated</dt><dd>{generatedImages}</dd></div>
            <div><dt>Pages</dt><dd>{pageCount}</dd></div>
          </dl>
        </div>

        <div className="success-actions">
          {siteUrl && (
            <a className="btn btn-primary" href={siteUrl} target="_blank" rel="noreferrer">
              Visit website <ArrowRight size={17} />
            </a>
          )}
          {adminUrl && (
            <a className="btn btn-secondary" href={adminUrl} target="_blank" rel="noreferrer">
              Open WordPress admin <ExternalLink size={17} />
            </a>
          )}
          <button className="btn btn-secondary" onClick={startAgain}>
            <RotateCcw size={17} /> Start another website
          </button>
        </div>

        <div className="success-note">
          <Sparkles size={18} />
          <span>The generated WebsiteDocument, image assets and WordPress credentials are stored in the current builder session.</span>
        </div>
      </div>
    </div>
  );
}
