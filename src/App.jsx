import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CategoryPage from "./pages/CategoryPage";
import TemplatesPage from "./pages/TemplatesPage";
import BusinessDetailsPage from "./pages/BusinessDetailsPage";
import PagesPage from "./pages/PagesPage";
import LogoPage from "./pages/LogoPage";
import BrandingPage from "./pages/BrandingPage";
import ReviewPage from "./pages/ReviewPage";
import SuccessPage from "./pages/SuccessPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/business-details" element={<BusinessDetailsPage />} />
      <Route path="/pages" element={<PagesPage />} />
      <Route path="/logo" element={<LogoPage />} />
      <Route path="/branding" element={<BrandingPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
