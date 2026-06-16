import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";

export const metadata = {
  title: "Professional graphic design services",
  description: "Attract more followers and buyers with graphic design services in Pakistan. We craft beautiful social media posts, ads, flyers, and banners for your brand.",
  alternates: {
    canonical: "/services/social-media/graphic-design",
  },
  openGraph: {
    title: "Professional graphic design services",
    description: "Attract more followers and buyers with graphic design services in Pakistan. We craft beautiful social media posts, ads, flyers, and banners for your brand.",
    url: "/services/social-media/graphic-design",
  },
};

const pageData: ServicePageProps = {
  title: "Graphic design services in Pakistan | MrDevs",
  metaDescription: "Attract more followers and buyers with graphic design services in Pakistan. We craft beautiful social media posts, ads, flyers, and banners for your brand.",
  keyword: "Graphic design services in Pakistan",
  h1Outcome: "Stunning graphics that show your clients you mean business",
  subhead: "We design beautiful, custom social media posts and banners that help you build trust and attract local buyers online.",
  deliverables: [
    {
      title: "Social posts and ads layout",
      description: "Clean templates for Instagram, Facebook, and local digital advertisements that match your company styling.",
    },
    {
      title: "Custom posters and flyers",
      description: "Eye-catching visual posters to promote sales, local product launches, or company announcements.",
    },
    {
      title: "Business profile covers",
      description: "Sleek banner graphics optimized to fit your Facebook business page, LinkedIn headers, and YouTube profile.",
    },
    {
      title: "Infographics and diagrams",
      description: "Simple visual charts that break down your business statistics, product guides, or prices for clients.",
    }
  ],
  whoThisIsFor: "For local store owners, real estate agents, doctors, and online shops looking to upgrade their generic visual posts for a professional brand appearance.",
  faqs: [
    {
      question: "What formats do you deliver the graphics in?",
      answer: "We send you high-resolution PNG and JPEG files ready to post, along with the print-ready files and original designs if you want to edit them later.",
    },
    {
      question: "Do you write the text inside the graphics as well?",
      answer: "Yes. We can write simple, clear text captions that grab attention and fit perfectly on the designed banner.",
    },
    {
      question: "How many revisions can we request?",
      answer: "We want you to love your designs. We offer unlimited review rounds during the design phase to make sure everything matches your requirements.",
    },
    {
      question: "Can you design matching templates for Canva?",
      answer: "Yes, we can build custom layout assets and share them with you as editable links so you can change the text easily whenever you need.",
    }
  ],
  nextServices: [
    { title: "Video editing", href: "/services/social-media/video-editing" },
    { title: "Content scripting", href: "/services/social-media/content-scripting" },
    { title: "Design & branding", href: "/services/design-branding" }
  ],
  schemaUrl: "https://mrdevs.dev/services/social-media/graphic-design"
};

export default function GraphicDesign() {
  return <ServicePageLayout data={pageData} />;
}
