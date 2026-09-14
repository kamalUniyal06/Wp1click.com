import { useNavigate } from "react-router-dom";
import BuilderLayout from "../components/BuilderLayout";
import { categories } from "../data/categories";
import { useBuilderStore } from "../store/useBuilderStore";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { category, setCategory, setTemplateId } = useBuilderStore();

  return (
    <BuilderLayout
      step={1}
      title="What kind of website are you creating?"
      description="Select the category that most closely matches your business."
      backTo="/"
      nextDisabled={!category}
      onNext={() => navigate("/templates")}
    >
      <div className="category-grid">
        {categories.map((item) => {
          const Icon = item.icon;
          const selected = category === item.id;
          return (
            <button
              key={item.id}
              className={`selection-card category-card ${selected ? "selected" : ""}`}
              onClick={() => {
                setCategory(item.id);
                setTemplateId("");
              }}
            >
              <span className="selection-icon"><Icon size={23} /></span>
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <span className="radio-circle">{selected ? "✓" : ""}</span>
            </button>
          );
        })}
      </div>
    </BuilderLayout>
  );
}
