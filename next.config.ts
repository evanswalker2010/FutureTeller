import type { NextConfig } from "next";

const desktop = process.env.DESKTOP_EXPORT === "1";

const nextConfig: NextConfig = desktop
  ? {
      output: "export",
      distDir: ".next-desktop",
      images: { unoptimized: true },
      trailingSlash: true,
    }
  : {};

export default nextConfig;
