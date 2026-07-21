"use client";

import { useState } from "react";

export default function WordlePage() {
  const [phonemeWord, setPhonemeWord] = useState("/θɪŋ/");
  const [englishWord, setEnglishWord] = useState("Thing");
  const [difficulty, setDifficulty] = useState("Easy");
  const [hint, setHint] = useState("TH as in thin");
  const [numberOfGuesses, setNumberOfGuesses] = useState(6);
  const [showHints, setShowHints] = useState(true);
  const [previewMessage, setPreviewMessage] = useState(
    "The preview updates automatically as you change the settings.",
  );

  /*
   * Supports either:
   * /θɪŋ/
   * or individually separated phonemes such as:
   * /θ/ /ɪ/ /ŋ/
   */
  function getPreviewPhonemes(value: string): string[] {
    const individualPhonemes = value.match(/\/[^/]+\//g);

    if (individualPhonemes && individualPhonemes.length > 1) {
      return individualPhonemes;
    }

    const cleanedWord = value.replaceAll("/", "").trim();

    if (!cleanedWord) {
      return ["?"];
    }

    return Array.from(cleanedWord);
  }

  const previewPhonemes = getPreviewPhonemes(phonemeWord);
  const previewRows = numberOfGuesses;
  const previewColumns = previewPhonemes.length;

  function handleGeneratePreview() {
    if (!phonemeWord.trim()) {
      setPreviewMessage("Please enter a phoneme word.");
      return;
    }

    if (!englishWord.trim()) {
      setPreviewMessage("Please enter the English equivalence.");
      return;
    }

    setPreviewMessage(
      `Preview generated for ${phonemeWord} — ${englishWord}.`,
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Activity Builder
        </p>

        <h1 className="text-4xl font-bold text-slate-900">
          Phoneme Wordle Builder
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Create a phoneme-based Wordle activity, preview the result, and
          prepare it for download as a standalone HTML file.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Activity Settings
          </h2>

          <p className="mt-2 text-slate-600">
            Configure the target phoneme word and classroom settings.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="phoneme-word"
                className="mb-2 block font-medium text-slate-900"
              >
                Phoneme Word
              </label>

              <input
                id="phoneme-word"
                type="text"
                value={phonemeWord}
                onChange={(event) => setPhonemeWord(event.target.value)}
                placeholder="/θɪŋ/"
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                Enter the word using phoneme symbols, for example /θɪŋ/ or
                /θ/ /ɪ/ /ŋ/.
              </p>
            </div>

            <div>
              <label
                htmlFor="english-word"
                className="mb-2 block font-medium text-slate-900"
              >
                English Equivalence
              </label>

              <input
                id="english-word"
                type="text"
                value={englishWord}
                onChange={(event) => setEnglishWord(event.target.value)}
                placeholder="Thing"
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="mb-2 block font-medium text-slate-900"
              >
                Difficulty
              </label>

              <select
                id="difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="hint"
                className="mb-2 block font-medium text-slate-900"
              >
                Hint
              </label>

              <input
                id="hint"
                type="text"
                value={hint}
                onChange={(event) => setHint(event.target.value)}
                placeholder="TH as in thin"
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="number-of-guesses"
                className="mb-2 block font-medium text-slate-900"
              >
                Number of Guesses
              </label>

              <select
                id="number-of-guesses"
                value={numberOfGuesses}
                onChange={(event) =>
                  setNumberOfGuesses(Number(event.target.value))
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value={4}>4 Guesses</option>
                <option value={5}>5 Guesses</option>
                <option value={6}>6 Guesses</option>
              </select>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={showHints}
                onChange={(event) => setShowHints(event.target.checked)}
                className="mt-1 h-4 w-4"
              />

              <span>
                <span className="block font-medium text-slate-900">
                  Show Phoneme Hints
                </span>

                <span className="block text-sm text-slate-500">
                  Display phoneme-to-English sound guidance in the activity.
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={handleGeneratePreview}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            >
              Generate Preview
            </button>

            <p
              className="text-center text-sm text-slate-500"
              role="status"
              aria-live="polite"
            >
              {previewMessage}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Live Preview
              </h2>

              <p className="mt-2 text-slate-600">
                Preview of the phoneme Wordle classroom activity.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {difficulty}
            </span>
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Phoneme Wordle
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Select the Correct Phonemes
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {previewColumns} phoneme
                {previewColumns === 1 ? "" : "s"} · {numberOfGuesses} guesses
              </p>
            </div>

            <div
              className="mt-6 space-y-2 overflow-x-auto pb-2"
              aria-label="Wordle preview grid"
            >
              {Array.from({ length: previewRows }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex min-w-max justify-center gap-2"
                >
                  {Array.from({ length: previewColumns }).map(
                    (_, columnIndex) => (
                      <div
                        key={columnIndex}
                        className="grid h-12 w-12 place-items-center rounded-md border-2 border-slate-300 bg-white px-1 text-center text-sm font-bold text-slate-900"
                      >
                        {rowIndex === 0
                          ? previewPhonemes[columnIndex]
                          : ""}
                      </div>
                    ),
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-500">
                Correct English equivalence
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {englishWord.trim() || "Not entered"}
              </p>
            </div>

            {showHints && (
              <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <h4 className="font-semibold text-slate-900">
                  Phoneme Hint
                </h4>

                <p className="mt-1 text-sm text-slate-600">
                  {hint.trim() || "No hint entered."}
                </p>
              </div>
            )}

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-slate-900">
                Phoneme Keyboard
              </p>

              <div className="flex flex-wrap gap-2">
                {["/θ/", "/ɪ/", "/ŋ/", "/ʃ/", "/tʃ/", "/f/", "/k/", "/æ/"].map(
                  (phoneme) => (
                    <button
                      key={phoneme}
                      type="button"
                      title={`${phoneme} phoneme sound`}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:border-blue-500 hover:bg-blue-50"
                    >
                      {phoneme}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Clear
              </button>

              <button
                type="button"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Enter Guess
              </button>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-lg border border-blue-600 px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Generate and Download HTML
          </button>
        </div>
      </section>
    </div>
  );
}