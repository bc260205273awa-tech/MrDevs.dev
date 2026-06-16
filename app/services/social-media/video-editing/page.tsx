import ServicePageLayout, { ServicePageProps } from "@/components/ServicePageLayout";

export const metadata = {
  title: "Video editing services in Pakistan | MrDevs",
  description: "Tell your business story with high-quality video editing services in Pakistan. Professional edits for social media reels, TikTok, YouTube, and business promo videos.",
};

const pageData: ServicePageProps = {
  title: "Video editing services in Pakistan | MrDevs",
  metaDescription: "Tell your business story with high-quality video editing services in Pakistan. Professional edits for social media reels, TikTok, YouTube, and business promo videos.",
  keyword: "Video editing services in Pakistan",
  h1Outcome: "Videos that catch attention and turn viewers into buyers",
  subhead: "We edit raw camera shots into clean, high-impact social media videos, reels, and product ads that showcase your services.",
  deliverables: [
    {
      title: "Social media reels and TikToks",
      description: "Quick-paced video edits with clean text subtitles, transitions, and sounds designed to keep viewers engaged.",
    },
    {
      title: "Corporate business presentations",
      description: "Polished promotional videos that explain what your company does and introduce your team to prospective clients.",
    },
    {
      title: "Product demos and review videos",
      description: "Close-up product showcases highlighting features, and showing buyers how your products work in real life.",
    },
    {
      title: "Professional color and sound",
      description: "We clean up background microphone noise, adjust the video lighting, and add background music overlays.",
    }
  ],
  whoThisIsFor: "For content creators, local businesses, schools, clinics, and online store brands who have raw videos but need professional editing to look polished.",
  faqs: [
    {
      question: "Do you shoot the raw video footage for us?",
      answer: "We focus completely on professional editing. You send us the raw video recorded on your phone or camera, and we edit it into a polished commercial video.",
    },
    {
      question: "Can you edit videos specifically for TikTok and Reels?",
      answer: "Yes, we crop and edit videos into vertical mobile dimensions (9:16 layout) with dynamic subtitles and trends tailored for mobile platforms.",
    },
    {
      question: "How do we share the large video files with you?",
      answer: "You can upload them to free storage links like Google Drive, Dropbox, or WeTransfer and share the link with us. We download and edit them from there.",
    },
    {
      question: "What is the average turnaround time for a video edit?",
      answer: "Short reels and ads usually take 2 to 3 days to deliver, while longer business walkthroughs or YouTube edits take 4 to 5 days.",
    }
  ],
  nextServices: [
    { title: "Graphic design", href: "/services/social-media/graphic-design" },
    { title: "Content scripting", href: "/services/social-media/content-scripting" },
    { title: "Web development", href: "/services/web-development" }
  ],
  schemaUrl: "https://mrdevs.dev/services/social-media/video-editing"
};

export default function VideoEditing() {
  return <ServicePageLayout data={pageData} />;
}
