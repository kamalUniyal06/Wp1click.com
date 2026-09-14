import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuilderLayout from "../components/BuilderLayout";
import WebsitePreview from "../components/WebsitePreview";
import { fonts, palettes } from "../data/branding";
import { useBuilderStore } from "../store/useBuilderStore";

export default function BrandingPage() {
  const navigate = useNavigate();
  const { branding, updateBranding } = useBuilderStore();
  const [device, setDevice] = useState("desktop");

  const setPalette = (palette) => {
    updateBranding({ paletteId: palette.id, colors: palette.colors });
  };

  const setFont = (font) => {
    updateBranding({
      fontId: font.id,
      headingFont: font.headingFont,
      bodyFont: font.bodyFont,
    });
  };

  return (
    <BuilderLayout
      step={6}
      title="Create your visual style"
      description="Choose colors and typography while viewing every change instantly."
      backTo="/logo"
      nextLabel="Review website"
      onNext={() => navigate("/review")}
    >
      <div className="branding-layout">
        <aside className="branding-controls">
          <section className="control-section">
            <div className="control-heading">
              <span>Color palette</span>
              <small>Choose a ready-made palette</small>
            </div>
            <div className="palette-list">
              {palettes.map((palette) => (
                <button
                  className={`palette-option ${branding.paletteId === palette.id ? "selected" : ""}`}
                  key={palette.id}
                  onClick={() => setPalette(palette)}
                >
                  <div className="palette-colors">
                    {Object.values(palette.colors).slice(0, 5).map((color) => (
                      <i key={color} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span>{palette.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="control-section">
            <div className="control-heading">
              <span>Typography</span>
              <small>Select a font personality</small>
            </div>
            <div className="font-list">
              {fonts.map((font) => (
                <button
                  className={`font-option ${branding.fontId === font.id ? "selected" : ""}`}
                  key={font.id}
                  onClick={() => setFont(font)}
                >
                  <strong style={{ fontFamily: font.headingFont }}>Aa</strong>
                  <span>
                    <b>{font.name}</b>
                    <small>{font.headingFont} + {font.bodyFont}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="control-section">
            <div className="control-heading">
              <span>Corner style</span>
              <small>{branding.radius}px radius</small>
            </div>
            <input
              className="range-input"
              type="range"
              min="0"
              max="32"
              value={branding.radius}
              onChange={(event) => updateBranding({ radius: Number(event.target.value) })}
            />
          </section>
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div>
              <strong>Live preview</strong>
              <span>Changes appear instantly</span>
            </div>
            <div className="device-switcher">
              <button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}><Monitor size={17} /></button>
              <button className={device === "tablet" ? "active" : ""} onClick={() => setDevice("tablet")}><Tablet size={17} /></button>
              <button className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")}><Smartphone size={17} /></button>
            </div>
          </div>
          <div className={`device-frame ${device}`}>
            <WebsitePreview />
          </div>
        </section>
      </div>
    </BuilderLayout>
  );
}
