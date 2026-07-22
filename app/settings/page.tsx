"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
type LayoutPreference = "comfortable" | "compact";

function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");

  const cookie = cookies.find((item) =>
    item.startsWith(`${name}=`)
  );

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

function saveCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [layoutPreference, setLayoutPreference] =
    useState<LayoutPreference>("comfortable");
  const [largeText, setLargeText] = useState(false);
  const [message, setMessage] = useState(
    "Your preferences are saved automatically.",
  );

  useEffect(() => {
    const savedTheme = getCookie("theme");
    const savedLayout = getCookie("layoutPreference");
    const savedLargeText = getCookie("largeText");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    }

    if (
      savedLayout === "comfortable" ||
      savedLayout === "compact"
    ) {
      setLayoutPreference(savedLayout);
      document.documentElement.dataset.layout = savedLayout;
    }

    if (savedLargeText === "true") {
      setLargeText(true);
      document.documentElement.dataset.largeText = "true";
    }
  }, []);

  function handleThemeChange(selectedTheme: Theme) {
    setTheme(selectedTheme);
    saveCookie("theme", selectedTheme);

    document.documentElement.dataset.theme = selectedTheme;

    setMessage(
      `${selectedTheme === "dark" ? "Dark" : "Light"} mode saved.`,
    );
  }

  function handleLayoutChange(
    selectedLayout: LayoutPreference,
  ) {
    setLayoutPreference(selectedLayout);
    saveCookie("layoutPreference", selectedLayout);

    document.documentElement.dataset.layout = selectedLayout;

    setMessage(
      `${
        selectedLayout === "compact"
          ? "Compact"
          : "Comfortable"
      } layout saved.`,
    );
  }

  function handleLargeTextChange(enabled: boolean) {
    setLargeText(enabled);
    saveCookie("largeText", String(enabled));

    if (enabled) {
      document.documentElement.dataset.largeText = "true";
    } else {
      delete document.documentElement.dataset.largeText;
    }

    setMessage(
      enabled
        ? "Large text enabled."
        : "Large text disabled.",
    );
  }

  function resetSettings() {
    handleThemeChange("light");
    handleLayoutChange("comfortable");
    handleLargeTextChange(false);

    setMessage("Settings restored to their defaults.");
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Preferences
        </p>

        <h1 className="text-4xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Adjust the appearance and layout of the Phoneme
          Activity Builder. Your choices are stored in cookies
          on this device.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Appearance
          </h2>

          <p className="mt-2 text-slate-600">
            Choose between light and dark mode.
          </p>

          <fieldset className="mt-6 space-y-3">
            <legend className="mb-3 font-semibold text-slate-900">
              Colour theme
            </legend>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => handleThemeChange("light")}
                className="h-4 w-4"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Light mode
                </span>

                <span className="text-sm text-slate-500">
                  Use a bright background with dark text.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => handleThemeChange("dark")}
                className="h-4 w-4"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Dark mode
                </span>

                <span className="text-sm text-slate-500">
                  Use a dark background with light text.
                </span>
              </span>
            </label>
          </fieldset>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Layout
          </h2>

          <p className="mt-2 text-slate-600">
            Choose how much spacing appears between page
            elements.
          </p>

          <fieldset className="mt-6 space-y-3">
            <legend className="mb-3 font-semibold text-slate-900">
              Layout preference
            </legend>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
              <input
                type="radio"
                name="layout"
                value="comfortable"
                checked={layoutPreference === "comfortable"}
                onChange={() =>
                  handleLayoutChange("comfortable")
                }
                className="h-4 w-4"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Comfortable
                </span>

                <span className="text-sm text-slate-500">
                  Uses more spacing for easier reading.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
              <input
                type="radio"
                name="layout"
                value="compact"
                checked={layoutPreference === "compact"}
                onChange={() => handleLayoutChange("compact")}
                className="h-4 w-4"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Compact
                </span>

                <span className="text-sm text-slate-500">
                  Uses less spacing to show more content.
                </span>
              </span>
            </label>
          </fieldset>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Accessibility
        </h2>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4">
          <input
            type="checkbox"
            checked={largeText}
            onChange={(event) =>
              handleLargeTextChange(event.target.checked)
            }
            className="mt-1 h-4 w-4"
          />

          <span>
            <span className="block font-semibold text-slate-900">
              Use larger text
            </span>

            <span className="block text-sm text-slate-500">
              Increase the default text size to improve
              readability.
            </span>
          </span>
        </label>
      </section>

      <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        <p
          className="text-sm font-medium text-blue-800"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </section>

      <button
        type="button"
        onClick={resetSettings}
        className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
      >
        Restore default settings
      </button>
    </div>
  );
}