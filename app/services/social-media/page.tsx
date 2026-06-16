import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Image as ImageIcon, Video, FileText } from "lucide-react";

export const metadata = {
  title: "Social media agency in Pakistan | MrDevs",
  description: "Grow your online presence with a premium social media agency in Pakistan. Learn about our graphic design, video editing, and content scripting services.",
};

const SUB_SERVICES = [
  {
    icon: ImageIcon,
    title: "Graphic design",
    description: "Stunning images and banners that show customers you are a professional business.",
    href: "/services/social-media/graphic-design",
  },
  {
    icon: Video,
    title: "Video editing",
    description: "Engaging short videos and reels that capture attention and promote your sales.",
    href: "/services/social-media/video-editing",
  },
  {
    icon: FileText,
    title: "Content scripting",
    description: "Clear and convincing scripts that explain your business services in simple words.",
    href: "/services/social-media/content-scripting",
  },
];

export default function SocialMediaHub() {
  return (
    <>
      <Navbar />
      <main className="bg-[#0a0f1a] text-[#f1efe8] font-sans min-h-screen pt-24">
        
        {/* Hero */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto px-6 flex flex-col items-center gap-6">
            <span className="text-[10px] font-medium text-[#378ADD] tracking-[0.15em] uppercase select-none">
              social media agency in Pakistan
            </span>
            <h1 className="text-3xl md:text-5xl font-medium text-[#f1efe8] leading-[1.15] tracking-tight max-w-xl">
              Grow your audience and drive business sales
            </h1>
            <p className="text-[15px] text-[#888780] max-w-md leading-relaxed">
              We create social media graphics, high-quality video edits, and clear scripts that showcase your services and bring you more customers locally.
            </p>
          </div>
          <div className="section-divider mt-20" />
        </section>

        {/* Sub-services Grid */}
        <section className="py-16 bg-[#0a0f1a]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8] mb-10 text-center">
              Our social media services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUB_SERVICES.map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <a
                    key={idx}
                    href={sub.href}
                    className="group bg-[#0f1729] border border-[rgba(133,183,235,0.15)] rounded-xl p-6 hover:border-[rgba(133,183,235,0.3)] hover:-translate-y-1 active:scale-[0.97] transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg bg-[#378ADD]/10 flex items-center justify-center mb-6 group-hover:bg-[#378ADD]/20 transition-colors duration-200">
                        <Icon size={18} className="text-[#378ADD]" strokeWidth={1.5} />
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-sans font-medium text-sm text-[#f1efe8] mb-2">
                        {sub.title.toLowerCase()}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-[#888780] text-xs leading-relaxed mb-6">
                        {sub.description}
                      </p>
                    </div>

                    {/* Learn More Link */}
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#378ADD] group-hover:text-[#f1efe8] transition-colors font-medium">
                      <span>Learn more</span>
                      <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </a>
                );
              })}
            </div>
            
            <div className="section-divider mt-24" />
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 bg-[#0a0f1a] text-center">
          <div className="max-w-xl mx-auto px-6 flex flex-col items-center gap-6">
            <h2 className="text-lg md:text-xl font-medium text-[#f1efe8]">
              Ready to start your social campaign?
            </h2>
            <p className="text-xs text-[#888780] leading-relaxed max-w-sm">
              Connect with us directly on WhatsApp to discuss custom social templates, content creation, and posting schedules.
            </p>
            <a
              href="https://wa.me/923218492868"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#378ADD] text-[#042C53] font-medium text-xs rounded hover:bg-[#378ADD]/90 hover:scale-[0.98] active:scale-[0.95] transition-all duration-200 shadow"
            >
              Message us on WhatsApp
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
