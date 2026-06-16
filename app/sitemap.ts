import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mrdevs.dev";
  
  const routes = [
    "",
    "/services/web-development",
    "/services/app-development",
    "/services/social-media",
    "/services/social-media/graphic-design",
    "/services/social-media/video-editing",
    "/services/social-media/content-scripting",
    "/services/hospital-software-systems",
    "/services/whatsapp-automation",
    "/services/maps-optimization",
    "/services/design-branding",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
