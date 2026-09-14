import { useNavigate } from "react-router-dom";
import BuilderLayout from "../components/BuilderLayout";
import { useBuilderStore } from "../store/useBuilderStore";

export default function BusinessDetailsPage() {
  const navigate = useNavigate();
  const { business, updateBusiness } = useBuilderStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateBusiness({ [name]: value });
  };

  return (
    <BuilderLayout
      step={3}
      title="Tell us about your business"
      description="We will use this information to personalize your website preview."
      backTo="/templates"
      nextDisabled={!business.companyName.trim() || !business.email.trim()}
      onNext={() => navigate("/pages")}
    >
      <div className="form-card">
        <div className="form-section-heading">
          <span>Basic information</span>
          <p>Start with the main details your customers should know.</p>
        </div>

        <div className="form-grid">
          <label>
            Company name <b>*</b>
            <input
              name="companyName"
              value={business.companyName}
              onChange={handleChange}
              placeholder="e.g. Acme Technologies"
            />
          </label>
          <label>
            Industry
            <input
              name="industry"
              value={business.industry}
              onChange={handleChange}
              placeholder="e.g. CRM software"
            />
          </label>
          <label className="full">
            Tagline
            <input
              name="tagline"
              value={business.tagline}
              onChange={handleChange}
              placeholder="A short statement that describes your business"
            />
          </label>
          <label className="full">
            Company description
            <textarea
              name="description"
              value={business.description}
              onChange={handleChange}
              placeholder="Describe what your company does, what makes it different and who it serves."
              rows={5}
            />
          </label>
          <label>
            Business / WordPress admin email
            <input
              name="email"
              type="email"
              value={business.email}
              onChange={handleChange}
              placeholder="hello@company.com"
            />
          </label>
          <label>
            Phone number
            <input
              name="phone"
              value={business.phone}
              onChange={handleChange}
              placeholder="+1 555 123 4567"
            />
          </label>
          <label className="full">
            Address
            <input
              name="address"
              value={business.address}
              onChange={handleChange}
              placeholder="Business address"
            />
          </label>
          <label>
            Target audience
            <textarea
              name="targetAudience"
              value={business.targetAudience}
              onChange={handleChange}
              placeholder="Who are your ideal customers?"
              rows={4}
            />
          </label>
          <label>
            Primary website goal
            <textarea
              name="primaryGoal"
              value={business.primaryGoal}
              onChange={handleChange}
              placeholder="Generate enquiries, sell products, book appointments..."
              rows={4}
            />
          </label>
          <label className="full">
            Main services or products
            <textarea
              name="services"
              value={business.services}
              onChange={handleChange}
              placeholder="List your main products or services"
              rows={4}
            />
          </label>
        </div>
      </div>
    </BuilderLayout>
  );
}
