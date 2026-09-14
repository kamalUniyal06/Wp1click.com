import { ImagePlus, Loader2, Sparkles, Type, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuilderLayout from "../components/BuilderLayout";
import { useBuilderStore } from "../store/useBuilderStore";

export default function LogoPage() {
  const navigate = useNavigate();
  const { logo, business, updateLogo } = useBuilderStore();
  const [uploading, setUploading] = useState(false);

  const handleGenerate = async () => {
    setUploading(true);
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "../api";
      const response = await fetch(`${base}/generate-logo.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          companyName: business.companyName,
          industry: business.industry,
          style: "modern premium",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.error || "Logo generation failed.");
      updateLogo({ mode: "upload", previewUrl: data.url, attachmentUrl: data.url, fileName: data.file, requested: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Logo generation failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("logo", file);
      const base = import.meta.env.VITE_API_BASE_URL || "../api";
      const response = await fetch(`${base}/upload-logo.php`, { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.error || "Logo upload failed.");
      updateLogo({ mode: "upload", previewUrl: data.url, attachmentUrl: data.url, fileName: file.name, requested: false });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Logo upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <BuilderLayout
      step={5}
      title="Add your business logo"
      description="Upload an existing logo, use a temporary text logo or request a new logo."
      backTo="/pages"
      onNext={() => navigate("/branding")}
    >
      <div className="logo-options">
        <button
          className={`logo-option ${logo.mode === "upload" ? "selected" : ""}`}
          onClick={() => document.getElementById("logo-file").click()}
        >
          <span><UploadCloud size={24} /></span>
          <h3>Upload my logo</h3>
          <p>Use your existing PNG, JPG, SVG or WebP logo.</p>
          <b>{uploading ? <><Loader2 size={14} className="spin" /> Uploading...</> : "Choose file"}</b>
        </button>
        <input id="logo-file" hidden type="file" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={handleUpload} />

        <button
          className={`logo-option ${logo.mode === "text" ? "selected" : ""}`}
          onClick={() => updateLogo({ mode: "text", previewUrl: "", requested: false })}
        >
          <span><Type size={24} /></span>
          <h3>Use a text logo</h3>
          <p>We will display your company name as a clean temporary logo.</p>
          <b>Use company name</b>
        </button>

        <button
          className={`logo-option ${logo.mode === "request" ? "selected" : ""}`}
          onClick={handleGenerate}
        >
          <span><Sparkles size={24} /></span>
          <h3>Create a logo for me</h3>
          <p>Save a logo creation request to connect with your future AI service.</p>
          <b>{uploading ? "Creating logo..." : "Generate logo"}</b>
        </button>
      </div>

      <div className="logo-preview-card">
        <div>
          <span className="eyebrow">Logo preview</span>
          <h3>{business.companyName || "Your Company"}</h3>
          <p>This is how your logo will be displayed inside the website header.</p>
        </div>
        <div className="logo-preview-box">
          {logo.previewUrl ? (
            <>
              <img src={logo.previewUrl} alt="Uploaded logo" />
              <button
                className="remove-logo"
                onClick={() => updateLogo({ mode: "text", previewUrl: "", requested: false })}
              >
                <X size={15} />
              </button>
            </>
          ) : (
            <div className="text-logo">
              <span>{(business.companyName || "Y").slice(0, 1).toUpperCase()}</span>
              <b>{business.companyName || "Your Company"}</b>
            </div>
          )}
        </div>
      </div>
    </BuilderLayout>
  );
}
