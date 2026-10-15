import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wolf – Your One Stop Shop",
    short_name: "Wolf",
    description: "Gippsland’s award-winning Telstra Partner – phones, accessories and business telecommunications.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
