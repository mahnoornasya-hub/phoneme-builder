"use client";

import { useMemo, useState } from "react";

const GRID_SIZE = 10;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Direction = "horizontal" | "vertical";

function normaliseWords(value: string) {
  return value
    .split("\n")
    .map((word) =>
      word
        .trim()
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase()
    )
    .filter(Boolean)
    .filter((word) => word.length <= GRID_SIZE)
    .slice(0, GRID_SIZE);
}

function canPlaceWord(
  grid: string[][],
  word: string,
  startRow: number,
  startColumn: number,
  direction: Direction
) {
  for (let index = 0; index < word.length; index++) {
    const row =
      direction === "vertical"
        ? startRow + index
        : startRow;

    const column =
      direction === "horizontal"
        ? startColumn + index
        : startColumn;

    if (row >= GRID_SIZE || column >= GRID_SIZE) {
      return false;
    }

    const currentLetter = grid[row][column];

    if (
      currentLetter !== "" &&
      currentLetter !== word[index]
    ) {
      return false;
    }
  }

  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  startRow: number,
  startColumn: number,
  direction: Direction
) {
  for (let index = 0; index < word.length; index++) {
    const row =
      direction === "vertical"
        ? startRow + index
        : startRow;

    const column =
      direction === "horizontal"
        ? startColumn + index
        : startColumn;

    grid[row][column] = word[index];
  }
}

function generateGrid(words: string[]) {
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => "")
  );

  const sortedWords = [...words].sort(
    (firstWord, secondWord) =>
      secondWord.length - firstWord.length
  );

  sortedWords.forEach((word) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const direction: Direction =
        Math.random() < 0.5
          ? "horizontal"
          : "vertical";

      const maximumRow =
        direction === "vertical"
          ? GRID_SIZE - word.length
          : GRID_SIZE - 1;

      const maximumColumn =
        direction === "horizontal"
          ? GRID_SIZE - word.length
          : GRID_SIZE - 1;

      const startRow = Math.floor(
        Math.random() * (maximumRow + 1)
      );

      const startColumn = Math.floor(
        Math.random() * (maximumColumn + 1)
      );

      if (
        canPlaceWord(
          grid,
          word,
          startRow,
          startColumn,
          direction
        )
      ) {
        placeWord(
          grid,
          word,
          startRow,
          startColumn,
          direction
        );

        placed = true;
      }

      attempts++;
    }
  });

  for (let row = 0; row < GRID_SIZE; row++) {
    for (
      let column = 0;
      column < GRID_SIZE;
      column++
    ) {
      if (grid[row][column] === "") {
        const randomIndex = Math.floor(
          Math.random() * ALPHABET.length
        );

        grid[row][column] =
          ALPHABET[randomIndex];
      }
    }
  }

  return grid;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function WordSearchPage() {
  const [title, setTitle] = useState(
    "Phoneme Word Search"
  );

  const [instructions, setInstructions] = useState(
    "Find and circle all the hidden words."
  );

  const [words, setWords] = useState(
    "ship\nshop\nshoe\nfish\nbrush"
  );

  const [message, setMessage] = useState(
    "The preview updates automatically as you change the settings."
  );

  const [gridVersion, setGridVersion] = useState(0);

  const wordList = useMemo(
    () => normaliseWords(words),
    [words]
  );

  const grid = useMemo(
    () => generateGrid(wordList),
    [wordList, gridVersion]
  );

  function handleGeneratePreview() {
    if (!title.trim()) {
      setMessage("Please enter an activity title.");
      return;
    }

    if (wordList.length === 0) {
      setMessage("Please enter at least one valid word.");
      return;
    }

    setGridVersion((currentVersion) => currentVersion + 1);
    setMessage("A new word-search preview has been generated.");
  }

  function handleDownloadHtml() {
    if (!title.trim()) {
      setMessage(
        "Please enter an activity title before downloading."
      );

      return;
    }

    if (wordList.length === 0) {
      setMessage(
        "Please enter at least one valid word before downloading."
      );

      return;
    }

    const safeTitle = escapeHtml(title.trim());

    const safeInstructions = escapeHtml(
      instructions.trim() ||
        "Find all the hidden words."
    );

    const wordListHtml = wordList
      .map(
        (word) =>
          `<span class="word">${escapeHtml(
            word
          )}</span>`
      )
      .join("");

    const gridHtml = grid
      .flat()
      .map(
        (letter) =>
          `<div class="cell">${escapeHtml(
            letter
          )}</div>`
      )
      .join("");

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${safeTitle}</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      padding: 24px;
      font-family: Arial, Helvetica, sans-serif;
      color: #0f172a;
      background: #f8fafc;
    }

    main {
      width: min(760px, 100%);
      margin: 0 auto;
      padding: 32px;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 12px 30px
        rgba(15, 23, 42, 0.08);
    }

    h1 {
      margin: 0;
      text-align: center;
      font-size: 32px;
    }

    .instructions {
      margin: 14px auto 0;
      max-width: 620px;
      color: #475569;
      text-align: center;
      line-height: 1.6;
    }

    .details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 28px;
    }

    .line {
      min-height: 34px;
      border-bottom: 1px solid #64748b;
    }

    .line-label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 700;
    }

    .grid-wrapper {
      overflow-x: auto;
      margin-top: 32px;
    }

    .letter-grid {
      display: grid;
      grid-template-columns: repeat(10, 48px);
      justify-content: center;
      gap: 4px;
      width: fit-content;
      margin: 0 auto;
    }

    .cell {
      display: grid;
      width: 48px;
      height: 48px;
      place-items: center;
      border: 1px solid #94a3b8;
      border-radius: 5px;
      background: #ffffff;
      font-size: 19px;
      font-weight: 700;
    }

    .word-section {
      margin-top: 30px;
      padding: 20px;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      background: #eff6ff;
    }

    .word-section h2 {
      margin: 0;
      text-align: center;
      font-size: 20px;
    }

    .word-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 16px;
    }

    .word {
      padding: 7px 13px;
      border-radius: 999px;
      color: #1d4ed8;
      background: #dbeafe;
      font-size: 14px;
      font-weight: 700;
    }

    .actions {
      display: flex;
      justify-content: center;
      margin-top: 28px;
    }

    button {
      padding: 12px 22px;
      border: 0;
      border-radius: 8px;
      color: white;
      background: #2563eb;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
    }

    button:hover,
    button:focus-visible {
      background: #1d4ed8;
      outline: 3px solid #93c5fd;
      outline-offset: 2px;
    }

    @media (max-width: 620px) {
      body {
        padding: 10px;
      }

      main {
        padding: 20px 12px;
      }

      .details {
        grid-template-columns: 1fr;
        gap: 18px;
      }

      .letter-grid {
        grid-template-columns:
          repeat(10, 34px);
      }

      .cell {
        width: 34px;
        height: 34px;
        font-size: 14px;
      }
    }

    @media print {
      @page {
        size: A4;
        margin: 12mm;
      }

      body {
        padding: 0;
        background: white;
      }

      main {
        width: 100%;
        padding: 0;
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }

      .actions {
        display: none;
      }

      .letter-grid {
        grid-template-columns:
          repeat(10, 42px);
      }

      .cell {
        width: 42px;
        height: 42px;
      }
    }
  </style>
</head>

<body>
  <main>
    <h1>${safeTitle}</h1>

    <p class="instructions">
      ${safeInstructions}
    </p>

    <section class="details">
      <div>
        <span class="line-label">Name</span>
        <div class="line"></div>
      </div>

      <div>
        <span class="line-label">Date</span>
        <div class="line"></div>
      </div>
    </section>

    <div
      class="grid-wrapper"
      aria-label="Word search letter grid"
    >
      <div class="letter-grid">
        ${gridHtml}
      </div>
    </div>

    <section class="word-section">
      <h2>Words to Find</h2>

      <div class="word-list">
        ${wordListHtml}
      </div>
    </section>

    <div class="actions">
      <button
        type="button"
        onclick="window.print()"
      >
        Print Worksheet
      </button>
    </div>
  </main>
</body>
</html>`;

    const file = new Blob([htmlContent], {
      type: "text/html;charset=utf-8",
    });

    const downloadUrl =
      URL.createObjectURL(file);

    const downloadLink =
      document.createElement("a");

    downloadLink.href = downloadUrl;

    downloadLink.download =
      "phoneme-word-search.html";

    document.body.appendChild(downloadLink);

    downloadLink.click();

    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);

    setMessage(
      "The standalone word-search HTML file has been downloaded."
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Activity Builder
        </p>

        <h1 className="text-4xl font-bold text-slate-900">
          Phoneme Word Search Builder
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Create a phoneme-based word search activity, preview the result, and
          prepare it for download as a standalone HTML worksheet.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Activity Settings
          </h2>

          <p className="mt-2 text-slate-600">
            Configure the worksheet title, instructions, and target words.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="activity-title"
                className="mb-2 block font-medium text-slate-900"
              >
                Activity Title
              </label>

              <input
                id="activity-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Phoneme Word Search"
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="instructions"
                className="mb-2 block font-medium text-slate-900"
              >
                Instructions
              </label>

              <textarea
                id="instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="word-list"
                className="mb-2 block font-medium text-slate-900"
              >
                Word List
              </label>

              <textarea
                id="word-list"
                value={words}
                onChange={(event) => setWords(event.target.value)}
                rows={8}
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                Enter one word on each line. Use up to 10 words, with no more
                than 10 letters in each word.
              </p>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="font-medium text-slate-900">
                Word Placement
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Words are placed horizontally or vertically in random
                positions.
              </p>

              <p className="mt-2 text-sm font-semibold text-blue-700">
                Valid words: {wordList.length} / {GRID_SIZE}
              </p>
            </div>

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
              {message}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Live Preview
            </h2>

            <p className="mt-2 text-slate-600">
              Preview of the printable phoneme word-search activity.
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Phoneme Word Search
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {title.trim() || "Untitled Activity"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {instructions.trim() || "No instructions added."}
              </p>
            </div>

            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <h4 className="text-center font-semibold text-slate-900">
                Words to Find
              </h4>

              {wordList.length > 0 ? (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {wordList.map((word, index) => (
                    <span
                      key={`${word}-${index}`}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-center text-sm text-slate-500">
                  No valid words have been added.
                </p>
              )}
            </div>

            <div
              className="mt-6 overflow-x-auto pb-2"
              aria-label="Word search preview grid"
            >
              <div className="mx-auto grid w-fit grid-cols-10 gap-1">
                {grid.flat().map((letter, index) => (
                  <div
                    key={`${letter}-${index}`}
                    className="grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white text-sm font-bold text-slate-900"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadHtml}
            className="mt-6 w-full rounded-lg border border-blue-600 px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Generate and Download HTML
          </button>
        </div>
      </section>
    </div>
  );
}