import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";

export const metadata = {
  title: "Mobile app development company in Pakistan",
  description: "Bring your business directly to your customers' phones with our mobile app development Pakistan services. Easy to use, fast, and designed to increase your sales.",
  alternates: {
    canonical: "/services/app-development",
  },
  openGraph: {
    title: "Mobile app development company in Pakistan",
    description: "Bring your business directly to your customers' phones with our mobile app development Pakistan services. Easy to use, fast, and designed to increase your sales.",
    url: "/services/app-development",
  },
};

const pageData: ServicePageProps = {
  title: "Mobile app development Pakistan | MrDevs",
  metaDescription: "Bring your business directly to your customers' phones with our mobile app development Pakistan services. Easy to use, fast, and designed to increase your sales.",
  keyword: "Mobile app development Pakistan",
  h1Outcome: "A mobile app that keeps your customers coming back",
  subhead: "We build easy-to-use mobile apps for Android and iPhones that let your customers buy from you with a single tap.",
  deliverables: [
    {
      title: "Works on Android and iPhones",
      description: "We publish your app on the Google Play Store and Apple App Store so anyone can find and install it easily.",
    },
    {
      title: "Instant push notifications",
      description: "Send reminders, sales discounts, and order updates directly to your customers' lock screens for free.",
    },
    {
      title: "Fast mobile checkout",
      description: "A super quick shopping experience that saves buyer details, making repeat orders quick and effortless.",
    },
    {
      title: "Offline performance",
      description: "Your customers can still view your products, price lists, and contact info even when their internet is slow or off.",
    }
  ],
  whoThisIsFor: "For retail stores, food delivery businesses, clinic systems, and subscription businesses looking to build customer loyalty and command a professional presence on phone screens.",
  proof: {
    title: "Proven engineering background",
    text: "Our team built KhanHub (khanhub.com.pk) — a massive custom web and mobile network serving over 50,000 users with full database integrations and real-time welfare updates."
  },
  faqs: [
    {
      question: "Will my app work on both Apple and Android phones?",
      answer: "Yes, we build apps that work perfectly on both Android devices and iPhones, using a unified codebase to save you time and launch costs.",
    },
    {
      question: "How do you help get my app on the App Store?",
      answer: "We handle the entire approval process, helping you register developer accounts and uploading the app package until it gets approved and published on both Google and Apple stores.",
    },
    {
      question: "How do customers get updates when I change a price or product?",
      answer: "We build a simple web dashboard for you. When you change a product details or price there, your mobile app updates instantly for all users.",
    },
    {
      question: "Can I send notifications to users for free?",
      answer: "Yes, once customers download your app, you can send unlimited push notifications directly to their phones without paying any SMS fees.",
    }
  ],
  nextServices: [
    { title: "Web development", href: "/services/web-development" },
    { title: "WhatsApp & automation", href: "/services/whatsapp-automation" },
    { title: "Design & branding", href: "/services/design-branding" }
  ],
  schemaUrl: "https://mrdevs.dev/services/app-development"
};

export default function AppDevelopment() {
  return <ServicePageLayout data={pageData} />;
}
