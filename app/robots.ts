import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL =
    process.env.BASE_URL ?? "err:Environment_Variable_Is_Not_Defined";

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: "",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
