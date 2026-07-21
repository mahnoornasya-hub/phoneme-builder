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

      {/* Activity Cards */}
      <section className="grid gap-6 md:grid-cols-2">

        <div className="rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="mb-2 text-2xl font-semibold">
            Wordle Builder
          </h2>

          <p className="mb-6 text-gray-600">
            Create phoneme-based Wordle classroom activities.
          </p>

          <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
            Open Builder
          </button>
        </div>

        <div className="rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="mb-2 text-2xl font-semibold">
            Word Search Builder
          </h2>

          <p className="mb-6 text-gray-600">
            Create printable phoneme word searches.
          </p>

          <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
            Open Builder
          </button>
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