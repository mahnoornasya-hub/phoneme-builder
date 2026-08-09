"use client";

import { useEffect, useMemo, useState } from "react";

type Direction = {
  row: number;
  column: number;
};

type Phoneme = {
  symbol: string;
  label: string;
  group: "Consonants" | "Vowels";
};

const MAX_WORDS = 10;

const DIRECTIONS: Direction[] = [
  { row: 0, column: 1 },   // right
  { row: 0, column: -1 },  // left
  { row: 1, column: 0 },   // down
  { row: -1, column: 0 },  // up
  { row: 1, column: 1 },   // down-right
  { row: 1, column: -1 },  // down-left
  { row: -1, column: 1 },  // up-right
  { row: -1, column: -1 }, // up-left
];

const PHONEME_KEYBOARD: Phoneme[] = [
  // Consonants
  { symbol: "p", label: "P", group: "Consonants" },
  { symbol: "t", label: "T", group: "Consonants" },
  { symbol: "k", label: "K", group: "Consonants" },
  { symbol: "b", label: "B", group: "Consonants" },
  { symbol: "d", label: "D", group: "Consonants" },
  { symbol: "ɡ", label: "G", group: "Consonants" },
  { symbol: "n", label: "N", group: "Consonants" },
  { symbol: "m", label: "M", group: "Consonants" },
  { symbol: "ŋ", label: "NG", group: "Consonants" },
  { symbol: "f", label: "F", group: "Consonants" },
  { symbol: "s", label: "S", group: "Consonants" },
  { symbol: "θ", label: "TH", group: "Consonants" },
  { symbol: "ʃ", label: "SH", group: "Consonants" },
  { symbol: "v", label: "V", group: "Consonants" },
  { symbol: "z", label: "Z", group: "Consonants" },
  { symbol: "ð", label: "TH", group: "Consonants" },
  { symbol: "ʒ", label: "ZH", group: "Consonants" },
  { symbol: "l", label: "L", group: "Consonants" },
  { symbol: "ɹ", label: "R", group: "Consonants" },
  { symbol: "w", label: "W", group: "Consonants" },
  { symbol: "j", label: "Y", group: "Consonants" },
  { symbol: "h", label: "H", group: "Consonants" },
  { symbol: "tʃ", label: "CH", group: "Consonants" },
  { symbol: "dʒ", label: "J", group: "Consonants" },

  // Vowels
  { symbol: "iː", label: "EE", group: "Vowels" },
  { symbol: "ɪ", label: "I", group: "Vowels" },
  { symbol: "e", label: "E", group: "Vowels" },
  { symbol: "eː", label: "E", group: "Vowels" },
  { symbol: "æ", label: "A", group: "Vowels" },
  { symbol: "ɐ", label: "UH", group: "Vowels" },
  { symbol: "ɐː", label: "AR", group: "Vowels" },
  { symbol: "ɜː", label: "ER", group: "Vowels" },
  { symbol: "ʉː", label: "OO", group: "Vowels" },
  { symbol: "ɔ", label: "O", group: "Vowels" },
  { symbol: "oː", label: "OR", group: "Vowels" },
  { symbol: "ʊ", label: "OO", group: "Vowels" },
  { symbol: "æɪ", label: "AY", group: "Vowels" },
  { symbol: "ɑe", label: "EYE", group: "Vowels" },
  { symbol: "oɪ", label: "OY", group: "Vowels" },
  { symbol: "əʉ", label: "OH", group: "Vowels" },
  { symbol: "æɔ", label: "OW", group: "Vowels" },
  { symbol: "ɪə", label: "EAR", group: "Vowels" },
  { symbol: "ə", label: "UH", group: "Vowels" },
];

function parsePhonemeSequences(
  value: string,
  rows: number,
  columns: number
): string[][] {
  const longestPossibleWord = Math.max(rows, columns);

  return value
    .split("\n")
    .map((line) =>
      line
        .trim()
        .split(/\s+/)
        .map((phoneme) => phoneme.trim())
        .filter(Boolean)
    )
    .filter((word) => word.length > 0)
    .filter((word) => word.length <= longestPossibleWord)
    .slice(0, MAX_WORDS);
}

function isInsideGrid(
  row: number,
  column: number,
  rows: number,
  columns: number
) {
  return (
    row >= 0 &&
    row < rows &&
    column >= 0 &&
    column < columns
  );
}

function canPlaceWord(
  grid: string[][],
  word: string[],
  startRow: number,
  startColumn: number,
  direction: Direction,
  rows: number,
  columns: number
) {
  for (let index = 0; index < word.length; index++) {
    const row =
      startRow + direction.row * index;

    const column =
      startColumn + direction.column * index;

    if (!isInsideGrid(row, column, rows, columns)) {
      return false;
    }

    const currentValue = grid[row][column];

    if (
      currentValue !== "" &&
      currentValue !== word[index]
    ) {
      return false;
    }
  }

  return true;
}

function placeWord(
  grid: string[][],
  word: string[],
  startRow: number,
  startColumn: number,
  direction: Direction
) {
  word.forEach((phoneme, index) => {
    const row =
      startRow + direction.row * index;

    const column =
      startColumn + direction.column * index;

    grid[row][column] = phoneme;
  });
}

function generateGrid(
  words: string[][],
  rows: number,
  columns: number
) {
  const grid = Array.from(
    { length: rows },
    () =>
      Array.from(
        { length: columns },
        () => ""
      )
  );

  const sortedWords = [...words].sort(
    (firstWord, secondWord) =>
      secondWord.length - firstWord.length
  );

  sortedWords.forEach((word) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 300) {
      const direction =
        DIRECTIONS[
          Math.floor(
            Math.random() * DIRECTIONS.length
          )
        ];

      const startRow = Math.floor(
        Math.random() * rows
      );

      const startColumn = Math.floor(
        Math.random() * columns
      );

      if (
        canPlaceWord(
          grid,
          word,
          startRow,
          startColumn,
          direction,
          rows,
          columns
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

  /*
    Use phonemes from the entered words as filler.

    If no phonemes are available, fall back to the
    complete HCE keyboard.
  */
  const enteredPhonemes = Array.from(
    new Set(words.flat())
  );

  const fillerPool =
    enteredPhonemes.length > 0
      ? enteredPhonemes
      : PHONEME_KEYBOARD.map(
          (phoneme) => phoneme.symbol
        );

  for (let row = 0; row < rows; row++) {
    for (
      let column = 0;
      column < columns;
      column++
    ) {
      if (grid[row][column] === "") {
        grid[row][column] =
          fillerPool[
            Math.floor(
              Math.random() *
                fillerPool.length
            )
          ];
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

  const [instructions, setInstructions] =
    useState(
      "Find and circle all the hidden phoneme sequences."
    );

  const [words, setWords] = useState(
    "tʃ ɪ n\nb æɪ t\ndʒ æ m\nb æ d\nb ʉː t"
  );

  const [rows, setRows] = useState(10);

  const [columns, setColumns] =
    useState(10);

  const [message, setMessage] = useState(
    "The preview updates automatically as you change the settings."
  );

  const [gridVersion, setGridVersion] =
    useState(0);

  const [grid, setGrid] = useState<
    string[][]
  >([]);

  const wordList = useMemo(
    () =>
      parsePhonemeSequences(
        words,
        rows,
        columns
      ),
    [words, rows, columns]
  );

  const consonants =
    PHONEME_KEYBOARD.filter(
      (phoneme) =>
        phoneme.group === "Consonants"
    );

  const vowels =
    PHONEME_KEYBOARD.filter(
      (phoneme) =>
        phoneme.group === "Vowels"
    );

  useEffect(() => {
    setGrid(
      generateGrid(
        wordList,
        rows,
        columns
      )
    );
  }, [
    wordList,
    rows,
    columns,
    gridVersion,
  ]);

  function appendPhoneme(
    phoneme: string
  ) {
    setWords((currentWords) => {
      if (!currentWords.trim()) {
        return phoneme;
      }

      if (currentWords.endsWith("\n")) {
        return currentWords + phoneme;
      }

      if (currentWords.endsWith(" ")) {
        return currentWords + phoneme;
      }

      return currentWords + " " + phoneme;
    });
  }

  function startNewWord() {
    setWords((currentWords) => {
      if (!currentWords.trim()) {
        return currentWords;
      }

      if (currentWords.endsWith("\n")) {
        return currentWords;
      }

      return currentWords + "\n";
    });
  }

  function handleGeneratePreview() {
    if (!title.trim()) {
      setMessage(
        "Please enter an activity title."
      );
      return;
    }

    if (wordList.length === 0) {
      setMessage(
        "Please enter at least one valid phoneme sequence."
      );
      return;
    }

    setGridVersion(
      (currentVersion) =>
        currentVersion + 1
    );

    setMessage(
      "A new phoneme word-search grid has been generated."
    );
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
        "Please enter at least one valid phoneme sequence before downloading."
      );
      return;
    }

    if (grid.length === 0) {
      setMessage(
        "Please wait for the grid to generate."
      );
      return;
    }

    const safeTitle =
      escapeHtml(title.trim());

    const safeInstructions =
      escapeHtml(
        instructions.trim() ||
          "Find all the hidden phoneme sequences."
      );

    const wordListHtml = wordList
      .map(
        (word) =>
          `<span class="word">${escapeHtml(
            word.join(" ")
          )}</span>`
      )
      .join("");

    const gridHtml = grid
      .flat()
      .map(
        (phoneme) =>
          `<div class="cell">${escapeHtml(
            phoneme
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
      width: min(900px, 100%);
      margin: 0 auto;
      padding: 32px;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    }

    h1 {
      margin: 0;
      text-align: center;
      font-size: 32px;
    }

    .instructions {
      margin: 14px auto 0;
      max-width: 650px;
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
      padding-bottom: 8px;
    }

    .phoneme-grid {
      display: grid;
      grid-template-columns: repeat(${columns}, 46px);
      justify-content: center;
      gap: 4px;
      width: fit-content;
      margin: 0 auto;
    }

    .cell {
      display: grid;
      width: 46px;
      height: 46px;
      place-items: center;
      border: 1px solid #94a3b8;
      border-radius: 5px;
      background: #ffffff;
      font-size: 15px;
      font-weight: 700;
      text-align: center;
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

    .note {
      margin-top: 24px;
      padding: 14px;
      border-radius: 10px;
      color: #475569;
      background: #f1f5f9;
      font-size: 14px;
      line-height: 1.5;
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

      .phoneme-grid {
        grid-template-columns: repeat(${columns}, 36px);
      }

      .cell {
        width: 36px;
        height: 36px;
        font-size: 12px;
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

      .phoneme-grid {
        grid-template-columns: repeat(${columns}, 40px);
      }

      .cell {
        width: 40px;
        height: 40px;
        font-size: 13px;
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
        <span class="line-label">
          Name
        </span>

        <div class="line"></div>
      </div>

      <div>
        <span class="line-label">
          Date
        </span>

        <div class="line"></div>
      </div>
    </section>

    <div
      class="grid-wrapper"
      aria-label="Phoneme word search grid"
    >
      <div class="phoneme-grid">
        ${gridHtml}
      </div>
    </div>

    <section class="word-section">
      <h2>Phoneme Sequences to Find</h2>

      <div class="word-list">
        ${wordListHtml}
      </div>
    </section>

    <div class="note">
      Sequences may appear horizontally,
      vertically or diagonally, forwards or
      backwards.
    </div>

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

    const file = new Blob(
      [htmlContent],
      {
        type: "text/html;charset=utf-8",
      }
    );

    const downloadUrl =
      URL.createObjectURL(file);

    const downloadLink =
      document.createElement("a");

    downloadLink.href = downloadUrl;

    downloadLink.download =
      "phoneme-word-search.html";

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();

    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);

    setMessage(
      "The standalone phoneme word-search HTML file has been downloaded."
    );
  }

  function renderKeyboardGroup(
    heading: string,
    phonemes: Phoneme[]
  ) {
    return (
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">
          {heading}
        </p>

        <div className="flex flex-wrap gap-2">
          {phonemes.map((phoneme) => (
            <button
              key={phoneme.symbol}
              type="button"
              onClick={() =>
                appendPhoneme(
                  phoneme.symbol
                )
              }
              title={`Add ${phoneme.symbol}`}
              className="min-w-12 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-semibold text-slate-900 transition hover:border-blue-500 hover:bg-blue-50"
            >
              <span className="block text-base">
                {phoneme.symbol}
              </span>

              <span className="block text-[10px] text-slate-500">
                {phoneme.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Heading */}
      <section>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Activity Builder
        </p>

        <h1 className="text-4xl font-bold text-slate-900">
          Phoneme Word Search Builder
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Create an HCE phoneme-based word search,
          preview the result, and prepare it for
          download as a standalone HTML worksheet.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {/* SETTINGS */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Activity Settings
          </h2>

          <p className="mt-2 text-slate-600">
            Configure the worksheet, HCE phoneme
            sequences and grid size.
          </p>

          <div className="mt-6 space-y-5">
            {/* Title */}
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
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Phoneme Word Search"
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Instructions */}
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
                onChange={(event) =>
                  setInstructions(
                    event.target.value
                  )
                }
                rows={3}
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Grid Size */}
            <div>
              <p className="mb-2 block font-medium text-slate-900">
                Grid Size
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="rows"
                    className="mb-2 block text-sm text-slate-600"
                  >
                    Rows
                  </label>

                  <select
                    id="rows"
                    value={rows}
                    onChange={(event) =>
                      setRows(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {Array.from(
                      { length: 8 },
                      (_, index) =>
                        index + 8
                    ).map((size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size} Rows
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="columns"
                    className="mb-2 block text-sm text-slate-600"
                  >
                    Columns
                  </label>

                  <select
                    id="columns"
                    value={columns}
                    onChange={(event) =>
                      setColumns(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {Array.from(
                      { length: 8 },
                      (_, index) =>
                        index + 8
                    ).map((size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size} Columns
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Word List */}
            <div>
              <label
                htmlFor="word-list"
                className="mb-2 block font-medium text-slate-900"
              >
                Phoneme Sequences
              </label>

              <textarea
                id="word-list"
                value={words}
                onChange={(event) =>
                  setWords(
                    event.target.value
                  )
                }
                rows={8}
                className="w-full rounded-lg border border-slate-300 p-3 font-mono text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                Enter one phoneme sequence on each
                line. Separate each HCE phoneme with
                a space.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Example:{" "}
                <span className="font-mono">
                  b æɪ t
                </span>{" "}
                contains 3 phonemes and therefore
                uses 3 grid cells.
              </p>
            </div>

            {/* HCE Keyboard */}
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">
                HCE Phoneme Keyboard
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Select a phoneme to add it to the
                current sequence.
              </p>

              <div className="mt-4 space-y-4">
                {renderKeyboardGroup(
                  "Consonants",
                  consonants
                )}

                {renderKeyboardGroup(
                  "Vowels",
                  vowels
                )}
              </div>

              <button
                type="button"
                onClick={startNewWord}
                className="mt-4 w-full rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Start New Sequence
              </button>
            </div>

            {/* Placement Information */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="font-medium text-slate-900">
                Phoneme Placement
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Sequences can be placed
                horizontally, vertically or
                diagonally, forwards or backwards.
              </p>

              <p className="mt-2 text-sm font-semibold text-blue-700">
                Valid sequences:{" "}
                {wordList.length} / {MAX_WORDS}
              </p>
            </div>

            {/* Generate */}
            <button
              type="button"
              onClick={
                handleGeneratePreview
              }
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

        {/* PREVIEW */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Live Preview
            </h2>

            <p className="mt-2 text-slate-600">
              Preview of the printable HCE phoneme
              word-search activity.
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Phoneme Word Search
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {title.trim() ||
                  "Untitled Activity"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {instructions.trim() ||
                  "No instructions added."}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {rows} rows × {columns} columns
              </p>
            </div>

            {/* Words */}
            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <h4 className="text-center font-semibold text-slate-900">
                Phoneme Sequences to Find
              </h4>

              {wordList.length > 0 ? (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {wordList.map(
                    (word, index) => (
                      <span
                        key={`${word.join(
                          "-"
                        )}-${index}`}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
                      >
                        {word.join(" ")}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="mt-3 text-center text-sm text-slate-500">
                  No valid phoneme sequences have
                  been added.
                </p>
              )}
            </div>

            {/* Grid */}
            <div
              className="mt-6 overflow-x-auto pb-2"
              aria-label="Phoneme word search preview grid"
            >
              {grid.length > 0 ? (
                <div
                  className="mx-auto grid w-fit gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, 2.5rem)`,
                  }}
                >
                  {grid.flat().map(
                    (phoneme, index) => (
                      <div
                        key={`${phoneme}-${index}`}
                        className="grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white px-1 text-center text-xs font-bold text-slate-900"
                      >
                        {phoneme}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-slate-500">
                  Generating phoneme word search...
                </div>
              )}
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-3 text-center text-xs text-slate-600">
              Sequences may run in any of 8
              directions.
            </div>
          </div>

          {/* Download */}
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