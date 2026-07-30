import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-xl bg-blue-600 p-10 text-white shadow-lg">
        <h1 className="mb-4 text-4xl font-bold">
          Phoneme Activity Builder
        </h1>

        <p className="max-w-2xl text-lg">
          Create phoneme-based classroom activities for Speech Pathology
          students. Build Wordle and Word Search games, preview them,
          and generate downloadable HTML activities.
        </p>
      </section>

      {/* Navigation */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-6 shadow-sm transition hover:shadow-md">
          <h2 className="mb-2 text-2xl font-semibold">
            Wordle Builder
          </h2>

          <p className="mb-6 text-gray-600">
            Create phoneme-based Wordle classroom activities.
          </p>

          <Link
            href="/wordle"
            className="inline-block rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Open Builder
          </Link>
        </div>

        <div className="rounded-xl border p-6 shadow-sm transition hover:shadow-md">
          <h2 className="mb-2 text-2xl font-semibold">
            Word Search Builder
          </h2>

          <p className="mb-6 text-gray-600">
            Create printable phoneme word searches.
          </p>

          <Link
            href="/word-search"
            className="inline-block rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Open Builder
          </Link>
        </div>

        <div className="rounded-xl border p-6 shadow-sm transition hover:shadow-md">
          <h2 className="mb-2 text-2xl font-semibold">
            Settings
          </h2>

          <p className="mb-6 text-gray-600">
            Configure default titles, instructions and activity preferences.
          </p>

          <Link
            href="/settings"
            className="inline-block rounded-lg border border-blue-600 px-5 py-2 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Open Settings
          </Link>
        </div>

        <div className="rounded-xl border p-6 shadow-sm transition hover:shadow-md">
          <h2 className="mb-2 text-2xl font-semibold">
            About
          </h2>

          <p className="mb-6 text-gray-600">
            Learn more about the Phoneme Activity Builder and its purpose.
          </p>

          <Link
            href="/about"
            className="inline-block rounded-lg border border-blue-600 px-5 py-2 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-6 text-3xl font-bold">
          Features
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-5">
            Responsive Design
          </div>

          <div className="rounded-xl border p-5">
            HTML Export
          </div>

          <div className="rounded-xl border p-5">
            Phoneme Support
          </div>
        </div>
      </section>
    </div>
  );
}