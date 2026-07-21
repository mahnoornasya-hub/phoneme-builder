export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
          About the project
        </p>

        <h1 className="text-4xl font-bold text-slate-900">
          Phoneme Activity Builder
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Phoneme Activity Builder is a classroom tool designed for Speech
          Pathology students and teachers. It allows teachers to create,
          preview, and download phoneme-based Wordle and Word Search
          activities.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Assessment 1 Scope
        </h2>

        <p className="mt-3 text-slate-600">
          Assessment 1 focuses on frontend design and usability. This current
          version does not use a database or dynamic word-list management.
          Backend and database features will be added in later assessments.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Phoneme Wordle
          </h2>

          <p className="mt-3 text-slate-600">
            Teachers can create a Wordle-style activity that uses phoneme
            symbols instead of standard spelling.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Phoneme Word Search
          </h2>

          <p className="mt-3 text-slate-600">
            Teachers can create a Word Search activity using a small list of
            phoneme-based words.
          </p>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Student Information
        </h2>

        <dl className="mt-4 space-y-3">
          <div>
            <dt className="font-semibold text-slate-900">Name</dt>
            <dd className="text-slate-600">Mahnoor Anasyabila Sohail</dd>
          </div>

          <div>
            <dt className="font-semibold text-slate-900">Student number</dt>
            <dd className="text-slate-600">21981775</dd>
          </div>

          <div>
            <dt className="font-semibold text-slate-900">Subject</dt>
            <dd className="text-slate-600">
              CSE3CWA — Cloud Web Application
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Website Demonstration Video
        </h2>

        <p className="mt-3 text-slate-600">
          A short video explaining how to use the website will be added here
          before submission.
        </p>
      </section>
    </div>
  );
}