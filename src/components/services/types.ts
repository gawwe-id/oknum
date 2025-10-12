// Service types and constants

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  illustration: string;
  color: string;
  description: string;
  includes: string[];
  technologies: string[];
}

export const services: Service[] = [
  {
    id: "web-mobile",
    title: "Web & Mobile Apps",
    subtitle: "Konsultasi & Development End-to-End",
    illustration: "/illustrations/progressive-app.svg",
    color: "fuchsia",
    description:
      "Dari konsultasi perencanaan hingga deployment. Kami guide bisnis Kamu di setiap tahap pengembangan aplikasi web dan mobile.",
    includes: [
      "Konsultasi strategi digital gratis",
      "UI/UX design responsif & modern",
      "Frontend & backend development",
      "Database setup & optimization",
      "SEO & performance optimization",
      "Testing & quality assurance",
      "Deployment & maintenance support",
      "Workshop untuk tim internal",
    ],
    technologies: [
      "React",
      "Next.js",
      "TanStack",
      "Tailwind",
      "Expo",
      "React Native",
      "Node.js",
      "PostgreSQL",
      "Hono",
      "Convex",
      "Vercel",
      "Supabase",
      "Prisma",
      "Railway",
    ],
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    subtitle: "Efisiensi Operasional dengan AI",
    illustration: "/illustrations/artificial-intelligence.svg",
    color: "sky",
    description:
      "Audit proses bisnis untuk identifikasi area automasi. Tingkatkan efisiensi UMKM dengan AI dan workflow automation.",
    includes: [
      "Audit proses bisnis gratis",
      "Chatbot & AI assistant custom",
      "Otomasi workflow repetitif",
      "AI untuk analisis data & laporan",
      "Integrasi dengan tools existing",
      "Custom AI integration",
      "ROI tracking & optimization",
    ],
    technologies: [
      "OpenAI",
      "Gemini",
      "n8n",
      "Zapier",
      "Make",
      "Python",
      "Langchain",
      "RAG",
      "MCP",
    ],
  },
  {
    id: "digital-ads",
    title: "Digital Ads",
    subtitle: "Konsultasi Strategi + Setup & Management",
    illustration: "/illustrations/email-campaign.svg",
    color: "orange",
    description:
      "Strategi iklan digital yang terukur untuk UMKM. Dari planning, execution, hingga optimization berkelanjutan.",
    includes: [
      "Konsultasi strategi iklan gratis",
      "Campaign setup & configuration",
      "Audience research & targeting",
      "Creative & copywriting support",
      "Budget optimization",
      "A/B testing & experiments",
      "Performance tracking & reporting",
      "Monthly optimization review",
    ],
    technologies: ["Google Ads", "Meta Ads", "TikTok Ads", "Analytics"],
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    subtitle: "Online Store Development",
    illustration: "/illustrations/add-to-cart.svg",
    color: "green",
    description:
      "Platform toko online lengkap untuk UMKM. Dari konsultasi, development, hingga integrasi payment dan shipping.",
    includes: [
      "Konsultasi e-commerce strategy",
      "Custom storefront design",
      "Payment gateway integration",
      "Inventory management system",
      "Order & shipping management",
      "Customer management (CRM)",
      "Marketing tools integration",
      "Training & support lengkap",
    ],
    technologies: ["Shopify", "WooCommerce", "Custom", "Midtrans", "Xendit"],
  },
];

export const colorClasses: Record<
  string,
  {
    bgGradient: string;
    iconBg: string;
    borderColor: string;
    textColor: string;
    lightTextColor: string;
    tagBg: string;
  }
> = {
  fuchsia: {
    bgGradient: "bg-gradient-to-br from-fuchsia-50 to-fuchsia-100",
    iconBg: "bg-fuchsia-600",
    borderColor: "border-fuchsia-200",
    textColor: "text-fuchsia-900",
    lightTextColor: "text-fuchsia-700",
    tagBg: "bg-fuchsia-600/10 text-fuchsia-700",
  },
  sky: {
    bgGradient: "bg-gradient-to-br from-sky-50 to-sky-100",
    iconBg: "bg-sky-600",
    borderColor: "border-sky-200",
    textColor: "text-sky-900",
    lightTextColor: "text-sky-700",
    tagBg: "bg-sky-600/10 text-sky-700",
  },
  orange: {
    bgGradient: "bg-gradient-to-br from-orange-50 to-orange-100",
    iconBg: "bg-orange-600",
    borderColor: "border-orange-200",
    textColor: "text-orange-900",
    lightTextColor: "text-orange-700",
    tagBg: "bg-orange-600/10 text-orange-700",
  },
  green: {
    bgGradient: "bg-gradient-to-br from-green-50 to-green-100",
    iconBg: "bg-green-600",
    borderColor: "border-green-200",
    textColor: "text-green-900",
    lightTextColor: "text-green-700",
    tagBg: "bg-green-600/10 text-green-700",
  },
};
