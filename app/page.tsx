export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="rounded-xl bg-blue-600 p-10 text-white shadow-lg">
        <h1 className="mb-3 text-4xl font-bold">
          Phoneme Activity Builder
        </h1>

        <p className="max-w-2xl text-lg">
          Create phoneme-based classroom activities for Speech Pathology
          students. Build Wordle and Word Search games, preview them and
          generate a downloadable HTML activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold">
            Wordle Builder
          </h2>

          <p className="mb-4 text-slate-600">
            Create phoneme Wordle activities using custom words and hints.
          </p>

          <a
            href="/wordle"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Open Builder
          </a>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold">
            Word Search Builder
          </h2>

          <p className="mb-4 text-slate-600">
            Build phoneme-based word search activities for the classroom.
          </p>

          <a
            href="/word-search"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Open Builder
          </a>
        </div>
      </div>
    </section>
  );
}