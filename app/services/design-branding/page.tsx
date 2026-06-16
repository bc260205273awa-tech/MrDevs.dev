import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";

export const metadata = {
  title: "Branding agency in Pakistan | MrDevs",
  description: "Stand out from competitors with a branding agency in Pakistan. We design professional logos, posters, and visual guides that make your business instantly recognizable.",
};

const pageData: ServicePageProps = {
  title: "Branding agency in Pakistan | MrDevs",
  metaDescription: "Stand out from competitors with a branding agency in Pakistan. We design professional logos, posters, and visual guides that make your business instantly recognizable.",
  keyword: "Branding agency in Pakistan",
  h1Outcome: "A brand design that makes you the first choice",
  subhead: "We create professional logos, colors, and graphics that make your business look like the industry leader it is.",
  deliverables: [
    {
      title: "Unique logo design",
      description: "A professional and simple logo that stands out, works on all backgrounds, and stays memorable to customers.",
    },
    {
      title: "Consistent business colors",
      description: "A set of colors and text styles selected to match your industry, used on all your banners, flyers, and website pages.",
    },
    {
      title: "Social media templates",
      description: "Pre-made layouts for your Facebook and Instagram posts, so you can share updates that look clean and unified.",
    },
    {
      title: "Print-ready print designs",
      description: "Beautifully styled layouts for business cards, flyers, envelopes, and store banners, ready to send directly to the printer.",
    }
  ],
  whoThisIsFor: "For startups, local shop owners, and service businesses who want to replace low-quality templates with a high-end, custom brand look that builds instant buyer trust.",
  faqs: [
    {
      question: "What is included in a branding package?",
      answer: "We design your main logo, select your official business colors and fonts, build social media template files, and design your stationary items like business cards and letterheads.",
    },
    {
      question: "Do I own the rights to the designed logo?",
      answer: "Yes, once we finish, you own the full copyright to the logo and all visual elements. We send you the source files and high-resolution images for your records.",
    },
    {
      question: "Can we redesign our existing business logo?",
      answer: "Absolutely. We can take your current logo concept and modernize it, cleaning up the lines and colors while keeping your brand name recognizable.",
    },
    {
      question: "How long does the branding design process take?",
      answer: "Our creative branding agency in Pakistan usually takes about 10 to 14 days to craft and refine your brand system, including presentation mockups and files output.",
    }
  ],
  nextServices: [
    { title: "Web development", href: "/services/web-development" },
    { title: "App development", href: "/services/app-development" },
    { title: "Google Maps optimization", href: "/services/maps-optimization" }
  ],
  schemaUrl: "https://mrdevs.dev/services/design-branding"
};

export default function DesignBranding() {
  return <ServicePageLayout data={pageData} />;
}
