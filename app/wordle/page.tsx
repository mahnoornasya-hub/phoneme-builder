"use client";

import { useState } from "react";

type TileStatus = "correct" | "present" | "incorrect" | "empty";

export default function WordlePage() {
  const [phonemeWord, setPhonemeWord] = useState("/θ/ /ɪ/ /ŋ/");
  const [englishWord, setEnglishWord] = useState("Thing");
  const [difficulty, setDifficulty] = useState("Easy");
  const [hint, setHint] = useState("TH as in thin");
  const [numberOfGuesses, setNumberOfGuesses] = useState(6);
  const [showHints, setShowHints] = useState(true);

  const [previewMessage, setPreviewMessage] = useState(
    "The preview updates automatically as you change the settings.",
  );

  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [submittedGuesses, setSubmittedGuesses] = useState<string[][]>([]);
  const [gameFinished, setGameFinished] = useState(false);

  const phonemeKeyboard = [
    { symbol: "/θ/", label: "TH", example: "TH as in thin" },
    { symbol: "/ɪ/", label: "I", example: "I as in sit" },
    { symbol: "/ŋ/", label: "NG", example: "NG as in sing" },
    { symbol: "/ʃ/", label: "SH", example: "SH as in ship" },
    { symbol: "/tʃ/", label: "CH", example: "CH as in chip" },
    { symbol: "/f/", label: "F", example: "F as in fish" },
    { symbol: "/k/", label: "K", example: "K as in cat" },
    { symbol: "/æ/", label: "A", example: "A as in cat" },
  ];

  /*
   * Supports:
   * /θɪŋ/
   * or individually separated phonemes:
   * /θ/ /ɪ/ /ŋ/
   */
  function getPreviewPhonemes(value: string): string[] {
    const individualPhonemes = value.match(/\/[^/]+\//g);

    if (individualPhonemes && individualPhonemes.length > 1) {
      return individualPhonemes;
    }

    const cleanedWord = value.replaceAll("/", "").replaceAll(" ", "").trim();

    if (!cleanedWord) {
      return ["?"];
    }

    return Array.from(cleanedWord).map((symbol) => `/${symbol}/`);
  }

  const previewPhonemes = getPreviewPhonemes(phonemeWord);
  const previewRows = numberOfGuesses;
  const previewColumns = previewPhonemes.length;

  function resetGame(message?: string) {
    setCurrentGuess([]);
    setSubmittedGuesses([]);
    setGameFinished(false);

    if (message) {
      setPreviewMessage(message);
    }
  }

  function handlePhonemeWordChange(value: string) {
    setPhonemeWord(value);
    resetGame("The target word changed. The preview game has been reset.");
  }

  function handleNumberOfGuessesChange(value: number) {
    setNumberOfGuesses(value);
    resetGame("The number of guesses changed. The preview game has been reset.");
  }

  function handleGeneratePreview() {
    if (!phonemeWord.trim()) {
    setPreviewMessage("Please enter a phoneme word.");
    return;
  }

  if (!englishWord.trim()) {
    setPreviewMessage("Please enter the English equivalence.");
    return;
  }

  const phonemes = phonemeWord.match(/\/[^/]+\//g);

  if (!phonemes || phonemes.length === 0) {
    setPreviewMessage(
      "Please enter phonemes like /θ/ /ɪ/ /ŋ/ instead of normal English."
    );
    return;
  }

  resetGame(
    `Preview generated for ${phonemeWord} — ${englishWord}.`
  );
  }

  function handleKeyboardClick(phoneme: string) {
    if (gameFinished) {
      setPreviewMessage(
        "The preview game has finished. Select Generate Preview to restart.",
      );
      return;
    }

    if (submittedGuesses.length >= previewRows) {
      setPreviewMessage("No guesses remain.");
      return;
    }

    if (currentGuess.length >= previewColumns) {
      setPreviewMessage(
        `This word contains ${previewColumns} phonemes. Press Enter Guess or Clear.`,
      );
      return;
    }

    const updatedGuess = [...currentGuess, phoneme];

    setCurrentGuess(updatedGuess);
    setPreviewMessage(
      `${updatedGuess.length} of ${previewColumns} phonemes selected.`,
    );
  }

  function handleClear() {
    if (gameFinished) {
      setPreviewMessage(
        "The preview game has finished. Select Generate Preview to restart.",
      );
      return;
    }

    setCurrentGuess([]);
    setPreviewMessage("The current guess has been cleared.");
  }

  function handleEnterGuess() {
    if (gameFinished) {
      setPreviewMessage(
        "The preview game has finished. Select Generate Preview to restart.",
      );
      return;
    }

    if (currentGuess.length !== previewColumns) {
      setPreviewMessage(
        `Please select exactly ${previewColumns} phonemes before submitting.`,
      );
      return;
    }

    const submittedGuess = [...currentGuess];
    const updatedGuesses = [...submittedGuesses, submittedGuess];

    setSubmittedGuesses(updatedGuesses);
    setCurrentGuess([]);

    const isCorrect = submittedGuess.every(
      (phoneme, index) => phoneme === previewPhonemes[index],
    );

    if (isCorrect) {
      setGameFinished(true);
      setPreviewMessage(
        `Correct! ${phonemeWord} is the English word “${englishWord}”.`,
      );
      return;
    }

    if (updatedGuesses.length >= previewRows) {
      setGameFinished(true);
      setPreviewMessage(
        `No guesses remain. The correct answer was ${phonemeWord} — ${englishWord}.`,
      );
      return;
    }

    const guessesRemaining = previewRows - updatedGuesses.length;

    setPreviewMessage(
      `Guess submitted. ${guessesRemaining} ${
        guessesRemaining === 1 ? "guess" : "guesses"
      } remaining.`,
    );
  }

  function getTileStatus(
    guess: string[],
    columnIndex: number,
  ): TileStatus {
    const selectedPhoneme = guess[columnIndex];

    if (!selectedPhoneme) {
      return "empty";
    }

    if (selectedPhoneme === previewPhonemes[columnIndex]) {
      return "correct";
    }

    if (previewPhonemes.includes(selectedPhoneme)) {
      return "present";
    }

    return "incorrect";
  }

  function getTileClasses(status: TileStatus): string {
    const baseClasses =
      "grid h-12 w-12 place-items-center rounded-md border-2 px-1 text-center text-sm font-bold transition";

    if (status === "correct") {
      return `${baseClasses} border-green-600 bg-green-600 text-white`;
    }

    if (status === "present") {
      return `${baseClasses} border-amber-500 bg-amber-500 text-white`;
    }

    if (status === "incorrect") {
      return `${baseClasses} border-slate-500 bg-slate-500 text-white`;
    }

    return `${baseClasses} border-slate-300 bg-white text-slate-900`;
  }

  function getTileValue(
    rowIndex: number,
    columnIndex: number,
  ): string {
    if (submittedGuesses[rowIndex]) {
      return submittedGuesses[rowIndex][columnIndex] ?? "";
    }

    if (rowIndex === submittedGuesses.length) {
      return currentGuess[columnIndex] ?? "";
    }

    return "";
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
                onChange={(event) =>
                  handlePhonemeWordChange(event.target.value)
                }
                placeholder="/θ/ /ɪ/ /ŋ/"
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                Enter each phoneme separately. Example: /θ/ /ɪ/ /ŋ/
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
                  handleNumberOfGuessesChange(Number(event.target.value))
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
                    (_, columnIndex) => {
                      const guess = submittedGuesses[rowIndex];
                      const status = guess
                        ? getTileStatus(guess, columnIndex)
                        : "empty";

                      return (
                        <div
                          key={columnIndex}
                          className={getTileClasses(status)}
                        >
                          {getTileValue(rowIndex, columnIndex)}
                        </div>
                      );
                    },
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-green-600" />
                Correct Position
              </span>

              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-amber-500" />
                Included Elsewhere
              </span>

              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-slate-500" />
                Not Included
              </span>
            </div>

            {gameFinished && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p className="font-semibold text-green-800">
                  Answer: {phonemeWord}
                </p>

                <p className="mt-1 text-sm text-green-700">
                  English equivalence: {englishWord}
                </p>
              </div>
            )}

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
                {phonemeKeyboard.map((phoneme) => (
                  <button
                    key={phoneme.symbol}
                    type="button"
                    title={phoneme.example}
                    aria-label={`${phoneme.symbol}, ${phoneme.example}`}
                    onClick={() =>
                      handleKeyboardClick(phoneme.symbol)
                    }
                    disabled={gameFinished}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="block">{phoneme.symbol}</span>
                    <span className="block text-xs text-slate-500">
                      {phoneme.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleClear}
                disabled={gameFinished || currentGuess.length === 0}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleEnterGuess}
                disabled={gameFinished}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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