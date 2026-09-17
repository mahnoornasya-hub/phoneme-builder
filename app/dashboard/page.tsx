"use client";

import { useEffect, useState } from "react";

type PerformanceData = {
  successful: number;
  failed: number;
  totalAttempts: number;
  successRate: number;
};

type GenerationActivityData = {
  date: string;
  successful: number;
  failed: number;
  total: number;
};

type AlertData = {
  level: string;
  title: string;
  message: string;
};

type RecentActivityData = {
  id: number;
  name: string;
  type: "WORDLE" | "WORD_SEARCH";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdAt: string;
  updatedAt: string;
  wordList: {
    id: number;
    name: string;
  } | null;
  _count: {
    words: number;
  };
};

type RecentEventData = {
  id: number;
  eventType:
    | "PAGE_VIEW"
    | "ACTIVITY_CREATED"
    | "GENERATION_SUCCESS"
    | "GENERATION_FAILED";
  activityType: "WORDLE" | "WORD_SEARCH" | null;
  page: string | null;
  durationSeconds: number | null;
  message: string | null;
  createdAt: string;
};

type DashboardData = {
  health: string;

  activities: {
    total: number;
    wordle: number;
    wordSearch: number;
    mostUsedType: string;
  };

  generation: {
    successful: number;
    failed: number;
    totalAttempts: number;
    successRate: number;
  };

  activityPerformance: {
    wordle: PerformanceData;
    wordSearch: PerformanceData;
  };

  usage: {
    averageTimeOnPage: number;
    wordleAverageTime: number;
    wordSearchAverageTime: number;
    wordleUsage: number;
    wordSearchUsage: number;
  };

  content: {
    wordLists: number;
    words: number;
    phonemes: number;
    averageWordsPerList: number;
  };

  difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };

  generationActivity: GenerationActivityData[];

  alerts: AlertData[];

  recentActivities: RecentActivityData[];

  recentEvents: RecentEventData[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Unable to load dashboard data.");
        }

        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-4">
            {error || "Dashboard data is unavailable."}
          </p>
        </div>
      </main>
    );
  }

  const maxGenerationTotal = Math.max(
    ...data.generationActivity.map((item) => item.total),
    1
  );

  const maxDifficulty = Math.max(
    data.difficulty.easy,
    data.difficulty.medium,
    data.difficulty.hard,
    1
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Assessment 3 Reporting
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-950">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Monitor activity usage, generation performance and
            application health.
          </p>
        </section>

        {/* Summary cards */}
        <section
          className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5"
          aria-label="Dashboard summary"
        >
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              System Status
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full bg-green-500"
                aria-hidden="true"
              />

              <p className="text-2xl font-bold text-gray-950">
                {data.health}
              </p>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Application health
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Activities
            </p>

            <p className="mt-4 text-3xl font-bold text-gray-950">
              {data.activities.total}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Saved configurations
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Success Rate
            </p>

            <p className="mt-4 text-3xl font-bold text-gray-950">
              {data.generation.successRate}%
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {data.generation.successful} of{" "}
              {data.generation.totalAttempts} successful
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Average Time
            </p>

            <p className="mt-4 text-3xl font-bold text-gray-950">
              {data.usage.averageTimeOnPage}s
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Average page duration
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Most Used
            </p>

            <p className="mt-4 text-2xl font-bold text-gray-950">
              {data.activities.mostUsedType}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Most-used builder
            </p>
          </article>
        </section>

        {/* Activity overview */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-950">
            Activity Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current saved activity configurations.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm font-medium text-gray-500">
                Wordle
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-950">
                {data.activities.wordle}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm font-medium text-gray-500">
                Word Search
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-950">
                {data.activities.wordSearch}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm font-medium text-gray-500">
                Generation Attempts
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-950">
                {data.generation.totalAttempts}
              </p>
            </div>
          </div>
        </section>

        {/* Activity performance */}
        <section className="mt-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">
              Activity Performance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Compare generation performance between the two
              activity builders.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Wordle */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                    Builder
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-gray-950">
                    Wordle
                  </h3>
                </div>

                <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {data.activityPerformance.wordle.successRate}%
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">
                    Success Rate
                  </span>
                  <span className="font-semibold text-gray-950">
                    {data.activityPerformance.wordle.successRate}%
                  </span>
                </div>

                <div
                  className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200"
                  role="progressbar"
                  aria-label="Wordle generation success rate"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={
                    data.activityPerformance.wordle.successRate
                  }
                >
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${data.activityPerformance.wordle.successRate}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Successful
                  </p>
                  <p className="mt-2 text-xl font-bold text-gray-950">
                    {data.activityPerformance.wordle.successful}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Failed
                  </p>
                  <p className="mt-2 text-xl font-bold text-gray-950">
                    {data.activityPerformance.wordle.failed}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Attempts
                  </p>
                  <p className="mt-2 text-xl font-bold text-gray-950">
                    {data.activityPerformance.wordle.totalAttempts}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Avg Time
                  </p>
                  <p className="mt-2 text-xl font-bold text-gray-950">
                    {data.usage.wordleAverageTime}s
                  </p>
                </div>
              </div>
            </article>

            {/* Word Search */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                    Builder
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-gray-950">
                    Word Search
                  </h3>
                </div>

                <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {data.activityPerformance.wordSearch.successRate}%
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">
                    Success Rate
                  </span>
                  <span className="font-semibold text-gray-950">
                    {data.activityPerformance.wordSearch.successRate}%
                  </span>
                </div>

                <div
                  className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200"
                  role="progressbar"
                  aria-label="Word Search generation success rate"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={
                    data.activityPerformance.wordSearch.successRate
                  }
                >
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${data.activityPerformance.wordSearch.successRate}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Successful
                  </p>
                  <p className="mt-2 text-xl font-bold text-gray-950">
                    {data.activityPerformance.wordSearch.successful}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Failed
                  </p>
                  <p className="mt-2 text-xl font-bold text-gray-950">
                    {data.activityPerformance.wordSearch.failed}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Attempts
                  </p>
                  <p className="mt-2 text-xl font-bold text-gray-950">
                    {data.activityPerformance.wordSearch.totalAttempts}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Avg Time
                  </p>
                  <p className="mt-2 text-xl font-bold text-gray-950">
                    {data.usage.wordSearchAverageTime}s
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Reporting charts */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Generation activity */}
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-950">
              Generation Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Successful and failed generation attempts over time.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm bg-blue-600"
                  aria-hidden="true"
                />
                <span className="text-gray-600">Successful</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm bg-gray-400"
                  aria-hidden="true"
                />
                <span className="text-gray-600">Failed</span>
              </div>
            </div>

            {data.generationActivity.length === 0 ? (
              <div className="mt-6 rounded-xl bg-gray-50 p-6 text-sm text-gray-500">
                No generation activity has been recorded yet.
              </div>
            ) : (
              <div className="mt-8 space-y-7">
                {data.generationActivity.map((item) => {
                  const successfulWidth =
                    (item.successful / maxGenerationTotal) * 100;

                  const failedWidth =
                    (item.failed / maxGenerationTotal) * 100;

                  const formattedDate = new Date(
                    `${item.date}T00:00:00`
                  ).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                  });

                  return (
                    <div key={item.date}>
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <p className="font-semibold text-gray-950">
                          {formattedDate}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.total} attempts
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-[72px_minmax(0,1fr)_28px] items-center gap-3">
                          <span className="text-sm text-gray-600">
                            Successful
                          </span>

                          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${successfulWidth}%`,
                              }}
                            />
                          </div>

                          <span className="text-right text-sm font-semibold text-gray-950">
                            {item.successful}
                          </span>
                        </div>

                        <div className="grid grid-cols-[72px_minmax(0,1fr)_28px] items-center gap-3">
                          <span className="text-sm text-gray-600">
                            Failed
                          </span>

                          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-gray-400"
                              style={{
                                width: `${failedWidth}%`,
                              }}
                            />
                          </div>

                          <span className="text-right text-sm font-semibold text-gray-950">
                            {item.failed}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          {/* Difficulty distribution */}
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-950">
              Difficulty Distribution
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Saved activities grouped by difficulty level.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  label: "Easy",
                  value: data.difficulty.easy,
                  colour: "bg-blue-300",
                },
                {
                  label: "Medium",
                  value: data.difficulty.medium,
                  colour: "bg-blue-600",
                },
                {
                  label: "Hard",
                  value: data.difficulty.hard,
                  colour: "bg-blue-900",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>

                    <span className="font-bold text-gray-950">
                      {item.value}
                    </span>
                  </div>

                  <div
                    className="h-4 overflow-hidden rounded-full bg-gray-100"
                    role="progressbar"
                    aria-label={`${item.label} activities`}
                    aria-valuemin={0}
                    aria-valuemax={maxDifficulty}
                    aria-valuenow={item.value}
                  >
                    <div
                      className={`h-full rounded-full ${item.colour}`}
                      style={{
                        width: `${
                          (item.value / maxDifficulty) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Total Saved Activities
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-950">
                {data.activities.total}
              </p>
            </div>
          </article>
        </section>

        {/* Collapsible operational details */}
        <details
          open
          className="group mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">
                Operational Details
              </h2>
              <p className="mt-1 text-sm font-normal text-gray-500">
                Monitoring alerts and stored content statistics.
              </p>
            </div>
            <span
              className="text-2xl text-gray-500 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ⌄
            </span>
          </summary>

          <div className="border-t border-gray-200 p-4 sm:p-6">
            <section className="grid gap-6 lg:grid-cols-2">
            {/* Operational alerts */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-950">
                Operational Alerts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current application monitoring messages.
              </p>

              <div className="mt-6 space-y-4">
                {data.alerts.length === 0 ? (
                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-sm text-gray-600">
                      No operational alerts are available.
                    </p>
                  </div>
                ) : (
                  data.alerts.map((alert, index) => {
                    const alertStyle =
                      alert.level === "warning"
                        ? {
                            card: "border-amber-200 bg-amber-50",
                            icon: "bg-amber-600",
                            symbol: "!",
                            label: "Warning",
                          }
                        : alert.level === "info"
                          ? {
                              card: "border-blue-200 bg-blue-50",
                              icon: "bg-blue-600",
                              symbol: "i",
                              label: "Information",
                            }
                          : {
                              card: "border-green-200 bg-green-50",
                              icon: "bg-green-600",
                              symbol: "✓",
                              label: "Success",
                            };

                    return (
                      <div
                        key={`${alert.title}-${index}`}
                        className={`rounded-xl border p-5 ${alertStyle.card}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${alertStyle.icon}`}
                            aria-hidden="true"
                          >
                            {alertStyle.symbol}
                          </div>

                          <div>
                            <p className="sr-only">{alertStyle.label}</p>
                            <h3 className="font-bold text-gray-950">
                              {alert.title}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              {alert.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </article>

            {/* Content overview */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-950">
                Content Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Summary of stored application content.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-sm font-medium text-gray-500">
                    Word Lists
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-950">
                    {data.content.wordLists}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-sm font-medium text-gray-500">
                    Words
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-950">
                    {data.content.words}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-sm font-medium text-gray-500">
                    Phonemes
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-950">
                    {data.content.phonemes}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-sm font-medium text-gray-500">
                    Avg Words / List
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-950">
                    {data.content.averageWordsPerList}
                  </p>
                </div>
              </div>
            </article>
          </section>

          </div>
        </details>

        {/* Collapsible recent activities */}
        <details className="group mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">
                Recent Activities
              </h2>
              <p className="mt-1 text-sm font-normal text-gray-500">
                {data.recentActivities.length} recently updated saved configurations.
              </p>
            </div>
            <span
              className="text-2xl text-gray-500 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ⌄
            </span>
          </summary>

          <div className="border-t border-gray-200 p-4 sm:p-6">
            {data.recentActivities.length === 0 ? (
            <div className="mt-6 rounded-xl bg-gray-50 p-6 text-sm text-gray-500">
            No saved activities are available.
            </div>
            ) : (
            <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <caption className="sr-only">
            Recently updated saved activity configurations
            </caption>
            <thead>
            <tr className="border-b border-gray-200 text-gray-500">
            <th scope="col" className="px-4 py-3 font-semibold">Activity</th>
            <th scope="col" className="px-4 py-3 font-semibold">Type</th>
            <th scope="col" className="px-4 py-3 font-semibold">Difficulty</th>
            <th scope="col" className="px-4 py-3 font-semibold">Word List</th>
            <th scope="col" className="px-4 py-3 font-semibold">Words</th>
            <th scope="col" className="px-4 py-3 font-semibold">Last Updated</th>
            </tr>
            </thead>
            <tbody>
            {data.recentActivities.map((activity) => {
            const activityType =
            activity.type === "WORD_SEARCH" ? "Word Search" : "Wordle";

            const difficulty =
            activity.difficulty.charAt(0) +
            activity.difficulty.slice(1).toLowerCase();

            const updatedDate = new Date(
            activity.updatedAt
            ).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
            });

            return (
            <tr
            key={activity.id}
            className="border-b border-gray-100 last:border-b-0"
            >
            <td className="px-4 py-4 font-semibold text-gray-950">
            {activity.name}
            </td>
            <td className="px-4 py-4 text-gray-600">{activityType}</td>
            <td className="px-4 py-4 text-gray-600">{difficulty}</td>
            <td className="px-4 py-4 text-gray-600">
            {activity.wordList?.name ?? "—"}
            </td>
            <td className="px-4 py-4 text-gray-600">
            {activity._count.words}
            </td>
            <td className="px-4 py-4 text-gray-600">{updatedDate}</td>
            </tr>
            );
            })}
            </tbody>
            </table>
            </div>
            )}
          </div>
        </details>

        {/* Collapsible recent events */}
        <details className="group mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">
                Recent Events
              </h2>
              <p className="mt-1 text-sm font-normal text-gray-500">
                {data.recentEvents.length} latest operational and usage events.
              </p>
            </div>
            <span
              className="text-2xl text-gray-500 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ⌄
            </span>
          </summary>

          <div className="border-t border-gray-200 p-4 sm:p-6">
            {data.recentEvents.length === 0 ? (
            <div className="mt-6 rounded-xl bg-gray-50 p-6 text-sm text-gray-500">
            No recent events have been recorded.
            </div>
            ) : (
            <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <caption className="sr-only">
            Recent operational and usage events
            </caption>

            <thead>
            <tr className="border-b border-gray-200 text-gray-500">
            <th scope="col" className="px-4 py-3 font-semibold">
            Event
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
            Builder
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
            Page
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
            Duration
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
            Message
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
            Recorded
            </th>
            </tr>
            </thead>

            <tbody>
            {data.recentEvents.map((event) => {
            const eventLabels: Record<
            RecentEventData["eventType"],
            string
            > = {
            PAGE_VIEW: "Page View",
            ACTIVITY_CREATED: "Activity Created",
            GENERATION_SUCCESS: "Generation Success",
            GENERATION_FAILED: "Generation Failed",
            };

            const builder =
            event.activityType === "WORD_SEARCH"
            ? "Word Search"
            : event.activityType === "WORDLE"
            ? "Wordle"
            : "—";

            const recordedDate = new Date(
            event.createdAt
            ).toLocaleString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            });

            return (
            <tr
            key={event.id}
            className="border-b border-gray-100 align-top last:border-b-0"
            >
            <td className="px-4 py-4 font-semibold text-gray-950">
            {eventLabels[event.eventType]}
            </td>

            <td className="px-4 py-4 text-gray-600">
            {builder}
            </td>

            <td className="px-4 py-4 text-gray-600">
            {event.page ?? "—"}
            </td>

            <td className="px-4 py-4 text-gray-600">
            {event.durationSeconds !== null
            ? `${event.durationSeconds}s`
            : "—"}
            </td>

            <td className="max-w-sm px-4 py-4 text-gray-600">
            {event.message ?? "—"}
            </td>

            <td className="whitespace-nowrap px-4 py-4 text-gray-600">
            {recordedDate}
            </td>
            </tr>
            );
            })}
            </tbody>
            </table>
            </div>
            )}
          </div>
        </details>
      </div>
    </main>
  );
}