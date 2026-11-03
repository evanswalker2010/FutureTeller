import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "易经算卦",
    short_name: "易经算卦",
    description: "以后天八卦与三枚铜钱起卦。此为周易文化体验，不是对人事的断言。",
    start_url: "/",
    display: "standalone",
    background_color: "#14110e",
    theme_color: "#14110e",
    lang: "zh-CN",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
