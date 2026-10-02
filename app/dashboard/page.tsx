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
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
          <p className="mt-4 text-slate-600">
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

  const summaryCards = [
    {
      label: "Total Activities",
      value: data.activities.total,
      description: "Saved configurations",
    },
    {
      label: "Success Rate",
      value: `${data.generation.successRate}%`,
      description: `${data.generation.successful} of ${data.generation.totalAttempts} successful`,
    },
    {
      label: "Average Time",
      value: `${data.usage.averageTimeOnPage}s`,
      description: "Average page duration",
    },
    {
      label: "Most Used",
      value: data.activities.mostUsedType,
      description: "Most-used builder",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <section className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Monitor activity usage, generation performance and application
              health.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
            <span
              className="h-2.5 w-2.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold text-emerald-800">
              {data.health}
            </span>
          </div>
        </section>

        {/* Summary */}
        <section
          className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Dashboard summary"
        >
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {card.label}
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {card.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {card.description}
              </p>
            </article>
          ))}
        </section>

        {/* Activity overview */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Activity Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current saved activities and generation usage.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Wordle",
                value: data.activities.wordle,
                description: `${data.usage.wordleUsage} generation events`,
              },
              {
                label: "Word Search",
                value: data.activities.wordSearch,
                description: `${data.usage.wordSearchUsage} generation events`,
              },
              {
                label: "Generation Attempts",
                value: data.generation.totalAttempts,
                description: `${data.generation.failed} failed attempts`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-5"
              >
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Performance */}
        <section className="mt-8">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Activity Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Compare generation performance between the two activity builders.
            </p>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {[
              {
                name: "Wordle",
                performance: data.activityPerformance.wordle,
                averageTime: data.usage.wordleAverageTime,
              },
              {
                name: "Word Search",
                performance: data.activityPerformance.wordSearch,
                averageTime: data.usage.wordSearchAverageTime,
              },
            ].map((builder) => (
              <article
                key={builder.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Builder
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-slate-950">
                      {builder.name}
                    </h3>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                    {builder.performance.successRate}%
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-600">
                      Success Rate
                    </span>

                    <span className="font-semibold text-slate-950">
                      {builder.performance.successRate}%
                    </span>
                  </div>

                  <div
                    className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={`${builder.name} generation success rate`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={builder.performance.successRate}
                  >
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${builder.performance.successRate}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      label: "Successful",
                      value: builder.performance.successful,
                    },
                    {
                      label: "Failed",
                      value: builder.performance.failed,
                    },
                    {
                      label: "Attempts",
                      value: builder.performance.totalAttempts,
                    },
                    {
                      label: "Avg Time",
                      value: `${builder.averageTime}s`,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {stat.label}
                      </p>

                      <p className="mt-2 text-xl font-bold text-slate-950">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Reporting */}
        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          {/* Generation Activity */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Generation Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Successful and failed generation attempts over time.
            </p>

            <div className="mt-5 flex gap-5 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-sm bg-blue-600"
                  aria-hidden="true"
                />
                <span className="text-slate-600">Successful</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-sm bg-slate-400"
                  aria-hidden="true"
                />
                <span className="text-slate-600">Failed</span>
              </div>
            </div>

            {data.generationActivity.length === 0 ? (
              <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                No generation activity has been recorded yet.
              </div>
            ) : (
              <div className="mt-7 space-y-7">
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
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-semibold text-slate-950">
                          {formattedDate}
                        </p>

                        <p className="text-sm text-slate-500">
                          {item.total} attempts
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-[72px_minmax(0,1fr)_28px] items-center gap-3">
                          <span className="text-sm text-slate-600">
                            Successful
                          </span>

                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${successfulWidth}%`,
                              }}
                            />
                          </div>

                          <span className="text-right text-sm font-semibold text-slate-950">
                            {item.successful}
                          </span>
                        </div>

                        <div className="grid grid-cols-[72px_minmax(0,1fr)_28px] items-center gap-3">
                          <span className="text-sm text-slate-600">
                            Failed
                          </span>

                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-slate-400"
                              style={{
                                width: `${failedWidth}%`,
                              }}
                            />
                          </div>

                          <span className="text-right text-sm font-semibold text-slate-950">
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

          {/* Difficulty */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Difficulty Distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Saved activities grouped by difficulty level.
            </p>

            <div className="mt-7 space-y-6">
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
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium text-slate-700">
                      {item.label}
                    </span>

                    <span className="font-bold text-slate-950">
                      {item.value}
                    </span>
                  </div>

                  <div
                    className="h-3 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={`${item.label} activities`}
                    aria-valuemin={0}
                    aria-valuemax={maxDifficulty}
                    aria-valuenow={item.value}
                  >
                    <div
                      className={`h-full rounded-full ${item.colour}`}
                      style={{
                        width: `${(item.value / maxDifficulty) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Total Saved Activities
              </p>

              <p className="text-2xl font-bold text-slate-950">
                {data.activities.total}
              </p>
            </div>
          </article>
        </section>

        {/* Operational Details */}
        <details
          open
          className="group mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Operational Details
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                Monitoring alerts and stored content statistics.
              </p>
            </div>

            <span
              className="text-xl text-slate-400 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ⌄
            </span>
          </summary>

          <div className="border-t border-slate-200 p-5 sm:p-6">
            <section className="grid gap-5 lg:grid-cols-2">
              {/* Alerts */}
              <article>
                <h3 className="text-lg font-bold text-slate-950">
                  Operational Alerts
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Current application monitoring messages.
                </p>

                <div className="mt-5 space-y-3">
                  {data.alerts.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-5">
                      <p className="text-sm text-slate-600">
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
                                card: "border-emerald-200 bg-emerald-50",
                                icon: "bg-emerald-600",
                                symbol: "✓",
                                label: "Success",
                              };

                      return (
                        <div
                          key={`${alert.title}-${index}`}
                          className={`rounded-xl border p-4 ${alertStyle.card}`}
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

                              <h4 className="font-semibold text-slate-950">
                                {alert.title}
                              </h4>

                              <p className="mt-1 text-sm leading-6 text-slate-600">
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

              {/* Content */}
              <article>
                <h3 className="text-lg font-bold text-slate-950">
                  Content Overview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Summary of stored application content.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Word Lists",
                      value: data.content.wordLists,
                    },
                    {
                      label: "Words",
                      value: data.content.words,
                    },
                    {
                      label: "Phonemes",
                      value: data.content.phonemes,
                    },
                    {
                      label: "Avg Words / List",
                      value: data.content.averageWordsPerList,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-slate-50 p-5"
                    >
                      <p className="text-sm font-medium text-slate-500">
                        {item.label}
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </details>

        {/* Recent Activities */}
        <details className="group mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Recent Activities
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                {data.recentActivities.length} recently updated saved
                configurations.
              </p>
            </div>

            <span
              className="text-xl text-slate-400 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ⌄
            </span>
          </summary>

          <div className="border-t border-slate-200 p-5 sm:p-6">
            {data.recentActivities.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                No saved activities are available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Recently updated saved activity configurations
                  </caption>

                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Activity
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Difficulty
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Word List
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Words
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Last Updated
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.recentActivities.map((activity) => {
                      const activityType =
                        activity.type === "WORD_SEARCH"
                          ? "Word Search"
                          : "Wordle";

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
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-4 py-4 font-semibold text-slate-950">
                            {activity.name}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {activityType}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {difficulty}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {activity.wordList?.name ?? "—"}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {activity._count.words}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {updatedDate}
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

        {/* Recent Events */}
        <details className="group mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Recent Events
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                {data.recentEvents.length} latest operational and usage events.
              </p>
            </div>

            <span
              className="text-xl text-slate-400 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ⌄
            </span>
          </summary>

          <div className="border-t border-slate-200 p-5 sm:p-6">
            {data.recentEvents.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                No recent events have been recorded.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Recent operational and usage events
                  </caption>

                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
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
                          className="border-b border-slate-100 align-top last:border-b-0"
                        >
                          <td className="px-4 py-4 font-semibold text-slate-950">
                            {eventLabels[event.eventType]}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {builder}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {event.page ?? "—"}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {event.durationSeconds !== null
                              ? `${event.durationSeconds}s`
                              : "—"}
                          </td>

                          <td className="max-w-sm px-4 py-4 text-slate-600">
                            {event.message ?? "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-slate-600">
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