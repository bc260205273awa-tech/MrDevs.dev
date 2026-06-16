import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";
import { Image as ImageIcon, Video, FileText } from "lucide-react";

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
  return (
    <ServicePageLayout data={pageData}>
      <div className="mt-8 flex flex-col items-center gap-6">
        <h3 className="text-[10px] font-medium text-[#888780] tracking-[0.15em] uppercase select-none text-center">
          our specialized design services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1: Graphic Design */}
          <a
            href="/services/social-media/graphic-design"
            className="group flex flex-col items-center text-center p-6 border border-[#7C3AED]/25 bg-[#7C3AED]/10 rounded-xl hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/15 hover:-translate-y-1 active:scale-[0.97] transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center mb-4 group-hover:bg-[#7C3AED]/30 transition-colors">
              <ImageIcon size={18} strokeWidth={1.5} />
            </div>
            <h4 className="font-sans font-medium text-[13px] text-[#A78BFA] mb-1.5 group-hover:brightness-110 transition-all">
              graphic design
            </h4>
            <p className="text-[11px] text-[#888780] leading-relaxed">
              stunning banners and brand visual layouts.
            </p>
          </a>

          {/* Card 2: Video Editing */}
          <a
            href="/services/social-media/video-editing"
            className="group flex flex-col items-center text-center p-6 border border-[#E11D48]/25 bg-[#E11D48]/10 rounded-xl hover:border-[#E11D48]/50 hover:bg-[#E11D48]/15 hover:-translate-y-1 active:scale-[0.97] transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-[#E11D48]/20 text-[#F43F5E] flex items-center justify-center mb-4 group-hover:bg-[#E11D48]/30 transition-colors">
              <Video size={18} strokeWidth={1.5} />
            </div>
            <h4 className="font-sans font-medium text-[13px] text-[#F43F5E] mb-1.5 group-hover:brightness-110 transition-all">
              video editing
            </h4>
            <p className="text-[11px] text-[#888780] leading-relaxed">
              engaging promotional reels and business edits.
            </p>
          </a>

          {/* Card 3: Content Scripting */}
          <a
            href="/services/social-media/content-scripting"
            className="group flex flex-col items-center text-center p-6 border border-[#059669]/25 bg-[#059669]/10 rounded-xl hover:border-[#059669]/50 hover:bg-[#059669]/15 hover:-translate-y-1 active:scale-[0.97] transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-[#059669]/20 text-[#34D399] flex items-center justify-center mb-4 group-hover:bg-[#059669]/30 transition-colors">
              <FileText size={18} strokeWidth={1.5} />
            </div>
            <h4 className="font-sans font-medium text-[13px] text-[#34D399] mb-1.5 group-hover:brightness-110 transition-all">
              content scripting
            </h4>
            <p className="text-[11px] text-[#888780] leading-relaxed">
              compelling scripts that turn viewers into clients.
            </p>
          </a>
        </div>
      </div>
    </ServicePageLayout>
  );
}
