import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";

export const metadata = {
  title: "Custom software developer Pakistan | MrDevs",
  description: "Manage your clinic, hospital, or enterprise effortlessly with a custom software developer Pakistan. Simplify booking, patient billing, and staff records today.",
};

const pageData: ServicePageProps = {
  title: "Custom software developer Pakistan | MrDevs",
  metaDescription: "Manage your clinic, hospital, or enterprise effortlessly with a custom software developer Pakistan. Simplify booking, patient billing, and staff records today.",
  keyword: "Custom software developer Pakistan",
  h1Outcome: "Software that runs your hospital or business on autopilot",
  subhead: "We build custom systems that coordinate your staff, patient visits, and bills in one clean dashboard so you can focus on care.",
  deliverables: [
    {
      title: "Clean patient and customer logs",
      description: "Keep track of doctor bookings, history files, prescriptions, and checkups in a highly organized secure database.",
    },
    {
      title: "Automatic invoice and bills",
      description: "Generate bills instantly, calculate staff payrolls, and track clinic income without relying on messy spreadsheets.",
    },
    {
      title: "Multi-branch connectivity",
      description: "Link multiple clinic branches, warehouses, or offices together so you can monitor operations from any laptop.",
    },
    {
      title: "Secure access levels",
      description: "Protect sensitive patient files by choosing what information doctors, accountants, and assistants can see.",
    }
  ],
  whoThisIsFor: "For clinics, medium-scale private hospitals, pharmacy networks, and businesses looking to replace manual paper sheets with custom booking and database software.",
  proof: {
    title: "The engine behind KhanHub ERP",
    text: "We are the creators of KhanHub (khanhub.com.pk) — a custom software platform running 16+ healthcare and welfare departments. It handles secure login, finance bookkeeping, and staff assignments for over 50,000 members daily."
  },
  faqs: [
    {
      question: "Can we migrate our old paper files or Excel sheets into the new software?",
      answer: "Yes, we handle the importing process. We clean up your Excel tables and paper lists and load them directly into your new digital database.",
    },
    {
      question: "Is our clinic patient data secure from hackers?",
      answer: "Security is our main focus. We use modern encryption and custom security rules to make sure only authorized staff with direct logins can see your records.",
    },
    {
      question: "Do you offer training for our hospital staff?",
      answer: "Yes. Once the software is ready, we do screen recordings and live training sessions to show your doctors, receptionists, and managers exactly how to use it.",
    },
    {
      question: "What happens if we need new features in the future?",
      answer: "Since we build your software completely from scratch, we can easily add new modules, payment options, or department tabs whenever your business expands.",
    }
  ],
  nextServices: [
    { title: "Web development", href: "/services/web-development" },
    { title: "WhatsApp & automation", href: "/services/whatsapp-automation" },
    { title: "Google Maps optimization", href: "/services/maps-optimization" }
  ],
  schemaUrl: "https://mrdevs.dev/services/hospital-software-systems"
};

export default function HospitalSoftwareSystems() {
  return <ServicePageLayout data={pageData} />;
}
