import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.yijing.divination",
  appName: "易经算卦",
  webDir: ".next-desktop",
  appendUserAgent: "YijingApp",
  backgroundColor: "#14110e",
  android: {
    backgroundColor: "#14110e",
    allowMixedContent: false,
  },
  ios: {
    backgroundColor: "#14110e",
    contentInset: "never",
  },
};

export default config;
