export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          About the Project
        </p>

        <h1 className="mt-1 text-4xl font-bold text-slate-900">
          Phoneme Activity Builder
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Phoneme Activity Builder is a classroom tool designed for Speech
          Pathology students and teachers. It allows users to create, manage,
          preview and generate phoneme-based Wordle and Word Search activities.
        </p>
      </section>

      {/* Project Overview */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Current Version
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          Full-Stack Web Application
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          The application has progressed from its original frontend prototype
          into a data-driven web application. It now supports persistent word
          and word list management, saved activity configurations, usage
          monitoring, operational reporting and automated testing.
        </p>
      </section>

      {/* Activities */}
      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Activity Builders
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
            Create Phoneme Activities
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-600">
              W
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Phoneme Wordle
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Create Wordle-style activities using phoneme symbols instead of
              standard spelling. Configure activity settings, preview the
              activity and generate a playable version.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-600">
              WS
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Phoneme Word Search
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Build phoneme-based Word Search activities from stored words,
              customise the puzzle dimensions and generate a classroom-ready
              activity.
            </p>
          </article>
        </div>
      </section>

      {/* Application Features */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Application Features
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          Built for Activity Management
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Word Management",
              description:
                "Create, update and organise phoneme words and reusable word lists.",
            },
            {
              title: "Saved Activities",
              description:
                "Store activity configurations so generated activities can be managed and reused.",
            },
            {
              title: "Reporting Dashboard",
              description:
                "View activity usage, generation performance and operational statistics.",
            },
            {
              title: "Application Monitoring",
              description:
                "Track successful and failed generations, page usage and application health.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Technology
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          Application Stack
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          The application uses Next.js and TypeScript for the web application,
          Tailwind CSS for the interface, Prisma for database access and SQLite
          for persistent application data.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Prisma",
            "SQLite",
            "Playwright",
            "JMeter",
            "Lighthouse",
          ].map((technology) => (
            <span
              key={technology}
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
            >
              {technology}
            </span>
          ))}
        </div>
      </section>

      {/* Student Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Project Information
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          Student Information
        </h2>

        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Name</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              Mahnoor Anasyabila Sohail
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-500">
              Student Number
            </dt>
            <dd className="mt-1 font-semibold text-slate-900">21981775</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-500">Subject</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              CSE3CWA — Cloud Web Application
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-500">
              Current Stage
            </dt>
            <dd className="mt-1 font-semibold text-slate-900">
              Assessment 3
            </dd>
          </div>
        </dl>
      </section>

      {/* Demonstration */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Demonstration
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          Website Demonstration Video
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          Watch the demonstration to see the main features and workflows of the
          Phoneme Activity Builder.
        </p>

        <video
          controls
          playsInline
          preload="metadata"
          className="mt-5 w-full rounded-lg border border-slate-300 bg-black"
        >
          <source src="/website-demo.mp4" type="video/mp4" />
          Your browser does not support the video element.
        </video>
      </section>
    </div>
  );
}