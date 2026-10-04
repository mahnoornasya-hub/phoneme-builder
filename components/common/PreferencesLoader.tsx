"use client";

import { useEffect } from "react";

function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");

  const cookie = cookies.find((item) =>
    item.startsWith(`${name}=`)
  );

  return cookie
    ? decodeURIComponent(cookie.split("=")[1])
    : null;
}

export default function PreferencesLoader() {
  useEffect(() => {
    const theme = getCookie("theme");
    const layout = getCookie("layoutPreference");
    const largeText = getCookie("largeText");

    document.documentElement.dataset.theme =
      theme === "dark" ? "dark" : "light";

    document.documentElement.dataset.layout =
      layout === "compact" ? "compact" : "comfortable";

    if (largeText === "true") {
      document.documentElement.dataset.largeText = "true";
    } else {
      delete document.documentElement.dataset.largeText;
    }
  }, []);

  return null;
}