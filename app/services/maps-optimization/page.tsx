import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";

export const metadata = {
  title: "Google maps SEO services Pakistan | MrDevs",
  description: "Rank higher on local searches with google maps SEO services Pakistan. Get more phone calls, web clicks, and store visits from customers near you.",
};

const pageData: ServicePageProps = {
  title: "Google maps SEO services Pakistan | MrDevs",
  metaDescription: "Rank higher on local searches with google maps SEO services Pakistan. Get more phone calls, web clicks, and store visits from customers near you.",
  keyword: "Google maps SEO services Pakistan",
  h1Outcome: "Get found on Google Maps by local customers in Pakistan",
  subhead: "We optimize your business profile map pin so you appear at the top when people search for your services nearby.",
  deliverables: [
    {
      title: "Top local search placement",
      description: "We rewrite your profile details, category tags, and keywords so you appear in Google's top 3 map results.",
    },
    {
      title: "More calls and store visits",
      description: "We set up clear action buttons on your profile, making it easy for customers to call you or get driving directions.",
    },
    {
      title: "Clean customer reviews setup",
      description: "We provide you with quick-sharing links and templates that make it simple to collect positive ratings from happy clients.",
    },
    {
      title: "Spam profile removal",
      description: "We report fake and duplicate profiles of competitors who are unfairly stealing customers from your local area.",
    }
  ],
  whoThisIsFor: "For clinics, restaurants, supermarkets, hardware stores, and local agencies who rely on physical walk-in customers and phone inquiries from their local city.",
  faqs: [
    {
      question: "What does Google Maps optimization mean?",
      answer: "It means editing your business profile map pin with the right keywords, photos, and settings so Google displays your business first when local people search for what you offer.",
    },
    {
      question: "How long does it take to see results on local searches?",
      answer: "Most local business profiles see an increase in call volume, map views, and website clicks within 3 to 4 weeks of completing our Google maps SEO services Pakistan setup.",
    },
    {
      question: "What if my business profile is currently suspended?",
      answer: "We inspect your business details, ensure they match Google's official policies, and submit a reinstatement request to get your listing restored and active again.",
    },
    {
      question: "Do I need a physical office address to rank on maps?",
      answer: "Yes, you need a verifiable physical address in Pakistan. If you deliver services directly to clients, we can set up a service-area profile that hides your exact home address while still ranking in your target cities.",
    }
  ],
  nextServices: [
    { title: "Web development", href: "/services/web-development" },
    { title: "Design & branding", href: "/services/design-branding" },
    { title: "WhatsApp & automation", href: "/services/whatsapp-automation" }
  ],
  schemaUrl: "https://mrdevs.dev/services/maps-optimization"
};

export default function MapsOptimization() {
  return <ServicePageLayout data={pageData} />;
}
