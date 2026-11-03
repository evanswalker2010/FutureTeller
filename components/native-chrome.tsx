"use client";

import { useEffect } from "react";

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
};

export function NativeChrome() {
  useEffect(() => {
    const cap = (window as Window & { Capacitor?: CapacitorGlobal }).Capacitor;
    if (!cap?.isNativePlatform?.()) return;
    document.documentElement.dataset.shell = "phone-app";
    const platform = cap.getPlatform?.();
    import("@capacitor/status-bar")
      .then(({ StatusBar, Style }) => {
        const style = StatusBar.setStyle({ style: Style.Dark });
        if (platform !== "android") return style;
        return style
          .then(() => StatusBar.setBackgroundColor({ color: "#14110e" }))
          .then(() => StatusBar.setOverlaysWebView({ overlay: false }));
      })
      .catch(() => undefined);
  }, []);

  return null;
}
