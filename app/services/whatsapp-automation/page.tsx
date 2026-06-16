import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";

export const metadata = {
  title: "Business automation company in Pakistan | MrDevs",
  description: "Save hours of manual messaging with a business automation company in Pakistan. Automatically reply to customers on WhatsApp and notify them about orders instantly.",
};

const pageData: ServicePageProps = {
  title: "Business automation company in Pakistan | MrDevs",
  metaDescription: "Save hours of manual messaging with a business automation company in Pakistan. Automatically reply to customers on WhatsApp and notify them about orders instantly.",
  keyword: "Business automation company in Pakistan",
  h1Outcome: "Automate your customer replies and run your business 24/7",
  subhead: "We connect automatic messaging tools to your phone so you can send orders, respond to queries, and book sales even while you sleep.",
  deliverables: [
    {
      title: "Automatic FAQ replies",
      description: "Instantly answer common questions about your prices, location, and hours when customers text your WhatsApp.",
    },
    {
      title: "Instant billing notifications",
      description: "Send receipt alerts, invoice details, and delivery tracking codes automatically after a buyer completes a purchase.",
    },
    {
      title: "Smart customer routing",
      description: "Send conversations to the right team member automatically, keeping support fast and customers happy.",
    },
    {
      title: "System notifications",
      description: "Receive immediate admin alerts on your phone whenever someone registers on your site or places an order.",
    }
  ],
  whoThisIsFor: "For online store owners, delivery services, clinics, and customer support agencies who are overwhelmed by manual customer messages and want to save hours daily.",
  faqs: [
    {
      question: "Do I need to pay monthly fees for WhatsApp automation?",
      answer: "We focus on building cost-effective setups. While official commercial channels have tiny fees per conversation, we help you select the most affordable plans and configure them to keep costs minimal.",
    },
    {
      question: "Will my WhatsApp number get blocked?",
      answer: "No. As a professional business automation company in Pakistan, we configure your system according to official rules, avoiding spam practices so your phone number stays 100% safe.",
    },
    {
      question: "Can we connect this automation to our existing website?",
      answer: "Yes, we can link automatic alerts directly to your current website, online store, or customer database so customer messages trigger naturally.",
    },
    {
      question: "Can we still text customers manually if we want to?",
      answer: "Absolutely. The system answers basic queries automatically, but you and your staff can jump into the chat at any time to message buyers personally.",
    }
  ],
  nextServices: [
    { title: "Web development", href: "/services/web-development" },
    { title: "App development", href: "/services/app-development" },
    { title: "Google Maps optimization", href: "/services/maps-optimization" }
  ],
  schemaUrl: "https://mrdevs.dev/services/whatsapp-automation"
};

export default function WhatsappAutomation() {
  return <ServicePageLayout data={pageData} />;
}
