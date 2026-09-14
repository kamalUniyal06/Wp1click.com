import {
  Building2,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  Laptop,
  Scale,
  Shirt,
  ShoppingBag,
  Sparkles,
  Utensils,
  Plane,
  Camera,
} from "lucide-react";

export const categories = [
  { id: "fashion", name: "Fashion", description: "Clothing, accessories and lifestyle brands", icon: Shirt },
  { id: "technology", name: "Technology", description: "SaaS, software and technology companies", icon: Laptop },
  { id: "education", name: "Education", description: "Schools, institutes and online courses", icon: GraduationCap },
  { id: "healthcare", name: "Healthcare", description: "Clinics, doctors and healthcare services", icon: HeartPulse },
  { id: "restaurant", name: "Restaurant", description: "Restaurants, cafés and food businesses", icon: Utensils },
  { id: "fitness", name: "Fitness", description: "Gyms, trainers and wellness businesses", icon: Dumbbell },
  { id: "real-estate", name: "Real Estate", description: "Property agencies and real estate businesses", icon: Building2 },
  { id: "legal", name: "Legal", description: "Law firms, attorneys and consultants", icon: Scale },
  { id: "travel", name: "Travel", description: "Travel agencies and tourism companies", icon: Plane },
  { id: "ecommerce", name: "E-commerce", description: "Online stores and product businesses", icon: ShoppingBag },
  { id: "portfolio", name: "Portfolio", description: "Designers, photographers and freelancers", icon: Camera },
  { id: "agency", name: "Creative Agency", description: "Marketing, branding and creative agencies", icon: Sparkles },
];
