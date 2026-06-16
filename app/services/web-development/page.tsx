import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";

export const metadata = {
  title: "Web development company in Pakistan",
  description: "Looking for an affordable web development company in Pakistan? We build custom websites that look great on every device and turn visitors into regular customers.",
  alternates: {
    canonical: "/services/web-development",
  },
  openGraph: {
    title: "Web development company in Pakistan",
    description: "Looking for an affordable web development company in Pakistan? We build custom websites that look great on every device and turn visitors into regular customers.",
    url: "/services/web-development",
  },
};

const pageData: ServicePageProps = {
  title: "Web development company in Pakistan | MrDevs",
  metaDescription: "Looking for an affordable web development company in Pakistan? We build custom websites that look great on every device and turn visitors into regular customers.",
  keyword: "Web development company in Pakistan",
  h1Outcome: "A website that brings you customers, not just visitors",
  subhead: "We build you a website that looks great on every phone and computer, and that shows up when people search for you on Google.",
  deliverables: [
    {
      title: "Looks great on all screens",
      description: "Your site will be fast and beautiful on iPhones, Android devices, tablets, and desktop computers alike.",
    },
    {
      title: "Found on Google search",
      description: "We set up your website structure so Google can read it easily, helping local buyers find your business first.",
    },
    {
      title: "Simple booking and forms",
      description: "We add contact boxes, booking forms, and chat links to make it super easy for clients to reach you.",
    },
    {
      title: "Easy updates by you",
      description: "We build a simple backend dashboard so you can change text, upload photos, and update prices on your own.",
    }
  ],
  whoThisIsFor: "For local store owners, professional doctors, consultants, and growing agencies who need a clean, premium online presence to build credibility and get more client leads.",
  proof: {
    title: "Tested for high performance and scale",
    text: "We built KhanHub (khanhub.com.pk) — a custom website and web system that manages 16+ healthcare departments and serves over 50,000 people across Pakistan with high speed and zero downtime."
  },
  faqs: [
    {
      question: "How long does it take to build a website with you?",
      answer: "A standard website for a small business takes about 2 to 3 weeks from start to finish. More complex online stores or custom portals can take 4 to 6 weeks.",
    },
    {
      question: "Will my website show up on Google search?",
      answer: "Yes. As a leading web development company in Pakistan, we optimize every page structure, heading, and image tag so search engines like Google can rank your site easily.",
    },
    {
      question: "Can I edit the website content on my own later?",
      answer: "Absolutely. We set up an easy administration panel for you. You don't need any coding skills to update pictures, write news articles, or change service prices.",
    },
    {
      question: "Do you offer web hosting and domain registration?",
      answer: "Yes, we handle the technical setup. We configure your domain (web address) and secure hosting so your site is always active and safe from hackers.",
    }
  ],
  nextServices: [
    { title: "App development", href: "/services/app-development" },
    { title: "WhatsApp & automation", href: "/services/whatsapp-automation" },
    { title: "Google Maps optimization", href: "/services/maps-optimization" }
  ],
  schemaUrl: "https://mrdevs.dev/services/web-development"
};

export default function WebDevelopment() {
  return <ServicePageLayout data={pageData} />;
}
