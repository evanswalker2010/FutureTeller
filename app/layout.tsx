import type { Metadata, Viewport } from "next";
import "@fontsource/noto-sans-sc/chinese-simplified-400.css";
import "@fontsource/noto-sans-sc/chinese-simplified-500.css";
import "@fontsource/noto-sans-sc/chinese-simplified-700.css";
import "@fontsource/noto-sans-sc/latin-400.css";
import "@fontsource/noto-sans-sc/latin-500.css";
import "@fontsource/noto-sans-sc/latin-700.css";
import "@fontsource/noto-serif-sc/chinese-simplified-500.css";
import "@fontsource/noto-serif-sc/chinese-simplified-600.css";
import "@fontsource/noto-serif-sc/chinese-simplified-700.css";
import "@fontsource/noto-serif-sc/latin-500.css";
import "@fontsource/noto-serif-sc/latin-600.css";
import "@fontsource/noto-serif-sc/latin-700.css";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14110e",
};

export const metadata: Metadata = {
  title: "易经算卦",
  description: "以后天八卦与三枚铜钱起卦，阅读卦辞、象辞与卦批。此为周易文化体验，不是对人事的断言。",
  applicationName: "易经算卦",
  appleWebApp: {
    capable: true,
    title: "易经算卦",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
