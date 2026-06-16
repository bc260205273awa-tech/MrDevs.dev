import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";

export const metadata = {
  title: "Content writing company in Pakistan | MrDevs",
  description: "Speak directly to your target audience with a content writing company in Pakistan. High-converting scripts and captions for your social media videos and posts.",
};

const pageData: ServicePageProps = {
  title: "Content writing company in Pakistan | MrDevs",
  metaDescription: "Speak directly to your target audience with a content writing company in Pakistan. High-converting scripts and captions for your social media videos and posts.",
  keyword: "Content writing company in Pakistan",
  h1Outcome: "Words that convince people to buy from your business",
  subhead: "We write clear, simple scripts for your social media videos, reels, and product descriptions that make clients want to hire you.",
  deliverables: [
    {
      title: "Video script writing",
      description: "Engaging outlines and hook-sentences for your TikToks, Instagram reels, and YouTube promotions to prevent users from scrolling away.",
    },
    {
      title: "Sleek social media captions",
      description: "Short, clean descriptions and calls-to-action to put below your Facebook, Instagram, and LinkedIn posts.",
    },
    {
      title: "Simple product details description",
      description: "Clear and straightforward text descriptions that explain exactly what your products do and why clients should buy them.",
    },
    {
      title: "Clear website text copywriting",
      description: "Non-technical, friendly descriptions for your homepage, services listing, and about pages that turn visitors into leads.",
    }
  ],
  whoThisIsFor: "For business founders, local agencies, eCommerce brands, and creators who need high-converting, professional English text to represent their business services.",
  faqs: [
    {
      question: "What does content scripting mean?",
      answer: "It means writing the exact words and hook phrases spoken in your videos, or the text captions below your posts, structured specifically to make viewers interested in your services.",
    },
    {
      question: "Do you write in English and Urdu?",
      answer: "We write premium English scripts, and can provide easy Roman-Urdu transliterated versions for video speaking so you can speak naturally to local Pakistani audiences.",
    },
    {
      question: "How do you learn about our specific business to write scripts?",
      answer: "We send you a simple list of questions about your services, target audience, and goals. We use your answers to write authentic scripts matching your business tone.",
    },
    {
      question: "Can we request edits to the scripts you write?",
      answer: "Yes, we work closely with you. We offer revision rounds to tweak the words, tone, or structure until the text matches your requirements.",
    }
  ],
  nextServices: [
    { title: "Graphic design", href: "/services/social-media/graphic-design" },
    { title: "Video editing", href: "/services/social-media/video-editing" },
    { title: "Web development", href: "/services/web-development" }
  ],
  schemaUrl: "https://mrdevs.dev/services/social-media/content-scripting"
};

export default function ContentScripting() {
  return <ServicePageLayout data={pageData} />;
}
