"use client";

import { useEffect, useState } from "react";

type TileStatus =
  | "correct"
  | "present"
  | "incorrect"
  | "empty";

type Phoneme = {
  symbol: string;
  label: string;
  example: string;
  group: "Consonants" | "Vowels";
};

type DatabasePhoneme = {
  id: number;
  symbol: string;
  position: number;
};

type DatabaseWord = {
  id: number;
  englishWord: string;
  hint: string | null;
  wordListId: number | null;
  wordList: {
    id: number;
    name: string;
  } | null;
  phonemes: DatabasePhoneme[];
};

type WordList = {
  id: number;
  name: string;
  description: string | null;
};

const phonemeKeyboard: Phoneme[] = [
  // Consonants
  { symbol: "p", label: "P", example: "P as in pin", group: "Consonants" },
  { symbol: "t", label: "T", example: "T as in tin", group: "Consonants" },
  { symbol: "k", label: "K", example: "K as in kin", group: "Consonants" },

  { symbol: "b", label: "B", example: "B as in bed", group: "Consonants" },
  { symbol: "d", label: "D", example: "D as in dog", group: "Consonants" },
  { symbol: "ɡ", label: "G", example: "G as in gum", group: "Consonants" },

  { symbol: "n", label: "N", example: "N as in net", group: "Consonants" },
  { symbol: "m", label: "M", example: "M as in map", group: "Consonants" },
  { symbol: "ŋ", label: "NG", example: "NG as in ring", group: "Consonants" },

  { symbol: "f", label: "F", example: "F as in fan", group: "Consonants" },
  { symbol: "s", label: "S", example: "S as in sun", group: "Consonants" },
  { symbol: "θ", label: "TH", example: "TH as in thin", group: "Consonants" },
  { symbol: "ʃ", label: "SH", example: "SH as in ship", group: "Consonants" },

  { symbol: "v", label: "V", example: "V as in van", group: "Consonants" },
  { symbol: "z", label: "Z", example: "Z as in zip", group: "Consonants" },
  { symbol: "ð", label: "TH", example: "TH as in then", group: "Consonants" },
  { symbol: "ʒ", label: "ZH", example: "ZH sound", group: "Consonants" },

  { symbol: "l", label: "L", example: "L as in log", group: "Consonants" },
  { symbol: "ɹ", label: "R", example: "R as in ring", group: "Consonants" },
  { symbol: "w", label: "W", example: "W as in win", group: "Consonants" },
  { symbol: "j", label: "Y", example: "Y as in yes", group: "Consonants" },

  { symbol: "h", label: "H", example: "H as in hat", group: "Consonants" },
  { symbol: "tʃ", label: "CH", example: "CH as in chin", group: "Consonants" },
  { symbol: "dʒ", label: "J", example: "J as in jam", group: "Consonants" },

  // Vowels
  { symbol: "iː", label: "EE", example: "Long EE vowel", group: "Vowels" },
  { symbol: "ɪ", label: "I", example: "I as in bid", group: "Vowels" },
  { symbol: "e", label: "E", example: "E as in bed", group: "Vowels" },
  { symbol: "eː", label: "E", example: "Long E vowel", group: "Vowels" },

  { symbol: "æ", label: "A", example: "A as in bad", group: "Vowels" },
  { symbol: "ɐ", label: "UH", example: "UH as in bud", group: "Vowels" },
  { symbol: "ɐː", label: "AR", example: "AR as in bark", group: "Vowels" },
  { symbol: "ɜː", label: "ER", example: "ER as in bird", group: "Vowels" },

  { symbol: "ʉː", label: "OO", example: "OO as in boot", group: "Vowels" },
  { symbol: "ɔ", label: "O", example: "O as in log", group: "Vowels" },
  { symbol: "oː", label: "OR", example: "OR as in fork", group: "Vowels" },
  { symbol: "ʊ", label: "OO", example: "OO as in book", group: "Vowels" },

  { symbol: "æɪ", label: "AY", example: "AY as in bait", group: "Vowels" },
  { symbol: "ɑe", label: "EYE", example: "EYE as in bike", group: "Vowels" },
  { symbol: "oɪ", label: "OY", example: "OY as in boil", group: "Vowels" },
  { symbol: "əʉ", label: "OH", example: "OH as in boat", group: "Vowels" },

  { symbol: "æɔ", label: "OW", example: "OW vowel", group: "Vowels" },
  { symbol: "ɪə", label: "EAR", example: "EAR as in beard", group: "Vowels" },
  { symbol: "ə", label: "UH", example: "Schwa sound", group: "Vowels" },
];

function getPreviewPhonemes(value: string): string[] {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return [];
  }

  // Supports the original format:
  // /θ/ /ɪ/ /ŋ/
  const slashPhonemes = trimmedValue.match(/\/[^/]+\//g);

  if (slashPhonemes && slashPhonemes.length > 0) {
    return slashPhonemes.map((phoneme) =>
      phoneme.replaceAll("/", "").trim()
    );
  }

  // Lecturer format:
  // θ ɪ ŋ
  // b æɪ t
  // dʒ æ m
  return trimmedValue
    .split(/\s+/)
    .map((phoneme) => phoneme.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function WordlePage() {
  const [savedWords, setSavedWords] =
    useState<DatabaseWord[]>([]);

  const [wordLists, setWordLists] =
    useState<WordList[]>([]);

  const [selectedWordListId, setSelectedWordListId] =
    useState("");

  const [selectedWordId, setSelectedWordId] =
    useState("");

  const [databaseLoading, setDatabaseLoading] =
    useState(true);

  const [databaseMessage, setDatabaseMessage] =
    useState("");

  const [phonemeWord, setPhonemeWord] =
    useState("θ ɪ ŋ");

  const [englishWord, setEnglishWord] =
    useState("Thing");

  const [difficulty, setDifficulty] =
    useState("Easy");

  const [hint, setHint] =
    useState("TH as in thin");

  const [numberOfGuesses, setNumberOfGuesses] =
    useState(6);

  const [showHints, setShowHints] =
    useState(true);

  const [previewMessage, setPreviewMessage] =
    useState(
      "The preview updates automatically as you change the settings."
    );

  const [currentGuess, setCurrentGuess] =
    useState<string[]>([]);

  const [submittedGuesses, setSubmittedGuesses] =
    useState<string[][]>([]);

  const [gameFinished, setGameFinished] =
    useState(false);

  useEffect(() => {
    async function loadDatabaseData() {
      try {
        setDatabaseLoading(true);

        const [wordsResponse, wordListsResponse] =
          await Promise.all([
            fetch("/api/words"),
            fetch("/api/word-lists"),
          ]);

        if (!wordsResponse.ok || !wordListsResponse.ok) {
          throw new Error(
            "Failed to load saved database data."
          );
        }

        const wordsData: DatabaseWord[] =
          await wordsResponse.json();

        const wordListsData: WordList[] =
          await wordListsResponse.json();

        setSavedWords(wordsData);
        setWordLists(wordListsData);

        setDatabaseMessage(
          "Saved words loaded from the database."
        );
      } catch (error) {
        console.error(
          "Failed to load Wordle database data:",
          error
        );

        setDatabaseMessage(
          "Unable to load saved words."
        );
      } finally {
        setDatabaseLoading(false);
      }
    }

    loadDatabaseData();
  }, []);

  const previewPhonemes =
    getPreviewPhonemes(phonemeWord);

  const previewRows = numberOfGuesses;
  const previewColumns = previewPhonemes.length;

  const consonants = phonemeKeyboard.filter(
    (phoneme) => phoneme.group === "Consonants"
  );

  const vowels = phonemeKeyboard.filter(
    (phoneme) => phoneme.group === "Vowels"
  );

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

    resetGame(
      "The target word changed. The preview game has been reset."
    );
  }

  function handleNumberOfGuessesChange(
    value: number
  ) {
    setNumberOfGuesses(value);

    resetGame(
      "The number of guesses changed. The preview game has been reset."
    );
  }

  const filteredSavedWords =
    selectedWordListId
      ? savedWords.filter(
          (word) =>
            word.wordListId === Number(selectedWordListId)
        )
      : savedWords;

  function handleWordListSelection(value: string) {
    setSelectedWordListId(value);
    setSelectedWordId("");

    setDatabaseMessage(
      value
        ? "Word List selected. Choose a saved word."
        : "Showing words from all Word Lists."
    );
  }

  function handleSavedWordSelection(value: string) {
    setSelectedWordId(value);

    if (!value) {
      return;
    }

    const selectedWord = savedWords.find(
      (word) => word.id === Number(value)
    );

    if (!selectedWord) {
      setDatabaseMessage(
        "The selected word could not be found."
      );
      return;
    }

    const orderedPhonemes = [...selectedWord.phonemes].sort(
      (firstPhoneme, secondPhoneme) =>
        firstPhoneme.position - secondPhoneme.position
    );

    setEnglishWord(selectedWord.englishWord);
    setPhonemeWord(
      orderedPhonemes
        .map((phoneme) => phoneme.symbol)
        .join(" ")
    );
    setHint(selectedWord.hint ?? "");

    if (selectedWord.wordListId) {
      setSelectedWordListId(
        String(selectedWord.wordListId)
      );
    }

    resetGame(
      `Loaded "${selectedWord.englishWord}" from the database.`
    );

    setDatabaseMessage(
      `"${selectedWord.englishWord}" loaded successfully from the database.`
    );
  }

  function handleGeneratePreview() {
    if (!phonemeWord.trim()) {
      setPreviewMessage(
        "Please enter a phoneme word."
      );
      return;
    }

    if (!englishWord.trim()) {
      setPreviewMessage(
        "Please enter the English equivalence."
      );
      return;
    }

    const phonemes =
      getPreviewPhonemes(phonemeWord);

    if (phonemes.length === 0) {
      setPreviewMessage(
        "Please enter HCE phonemes separated by spaces. Example: θ ɪ ŋ"
      );
      return;
    }

    resetGame(
      `Preview generated for ${phonemeWord} — ${englishWord}.`
    );
  }

  function handleKeyboardClick(
    phoneme: string
  ) {
    if (gameFinished) {
      setPreviewMessage(
        "The preview game has finished. Select Generate Preview to restart."
      );
      return;
    }

    if (previewColumns === 0) {
      setPreviewMessage(
        "Enter a target phoneme word first."
      );
      return;
    }

    if (
      submittedGuesses.length >= previewRows
    ) {
      setPreviewMessage(
        "No guesses remain."
      );
      return;
    }

    if (
      currentGuess.length >= previewColumns
    ) {
      setPreviewMessage(
        `This word contains ${previewColumns} phonemes. Press Enter Guess or Clear.`
      );
      return;
    }

    const updatedGuess = [
      ...currentGuess,
      phoneme,
    ];

    setCurrentGuess(updatedGuess);

    setPreviewMessage(
      `${updatedGuess.length} of ${previewColumns} phonemes selected.`
    );
  }

  function handleClear() {
    if (gameFinished) {
      setPreviewMessage(
        "The preview game has finished. Select Generate Preview to restart."
      );
      return;
    }

    setCurrentGuess([]);

    setPreviewMessage(
      "The current guess has been cleared."
    );
  }

  function handleEnterGuess() {
    if (gameFinished) {
      setPreviewMessage(
        "The preview game has finished. Select Generate Preview to restart."
      );
      return;
    }

    if (previewColumns === 0) {
      setPreviewMessage(
        "Enter a target phoneme word first."
      );
      return;
    }

    if (
      currentGuess.length !== previewColumns
    ) {
      setPreviewMessage(
        `Please select exactly ${previewColumns} phonemes before submitting.`
      );
      return;
    }

    const submittedGuess = [
      ...currentGuess,
    ];

    const updatedGuesses = [
      ...submittedGuesses,
      submittedGuess,
    ];

    setSubmittedGuesses(updatedGuesses);
    setCurrentGuess([]);

    const isCorrect =
      submittedGuess.every(
        (phoneme, index) =>
          phoneme ===
          previewPhonemes[index]
      );

    if (isCorrect) {
      setGameFinished(true);

      setPreviewMessage(
        `Correct! ${phonemeWord} is the English word “${englishWord}”.`
      );

      return;
    }

    if (
      updatedGuesses.length >= previewRows
    ) {
      setGameFinished(true);

      setPreviewMessage(
        `No guesses remain. The correct answer was ${phonemeWord} — ${englishWord}.`
      );

      return;
    }

    const guessesRemaining =
      previewRows - updatedGuesses.length;

    setPreviewMessage(
      `Guess submitted. ${guessesRemaining} ${
        guessesRemaining === 1
          ? "guess"
          : "guesses"
      } remaining.`
    );
  }

  function getTileStatus(
    guess: string[],
    columnIndex: number
  ): TileStatus {
    const selectedPhoneme =
      guess[columnIndex];

    if (!selectedPhoneme) {
      return "empty";
    }

    if (
      selectedPhoneme ===
      previewPhonemes[columnIndex]
    ) {
      return "correct";
    }

    if (
      previewPhonemes.includes(
        selectedPhoneme
      )
    ) {
      return "present";
    }

    return "incorrect";
  }

  function getTileClasses(
    status: TileStatus
  ): string {
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
    columnIndex: number
  ): string {
    if (submittedGuesses[rowIndex]) {
      return (
        submittedGuesses[rowIndex][
          columnIndex
        ] ?? ""
      );
    }

    if (
      rowIndex ===
      submittedGuesses.length
    ) {
      return (
        currentGuess[columnIndex] ?? ""
      );
    }

    return "";
  }

  function handleDownloadHtml() {
    if (!phonemeWord.trim()) {
      setPreviewMessage(
        "Please enter a phoneme word before downloading."
      );
      return;
    }

    if (!englishWord.trim()) {
      setPreviewMessage(
        "Please enter the English equivalence before downloading."
      );
      return;
    }

    if (previewPhonemes.length === 0) {
      setPreviewMessage(
        "Please enter valid HCE phonemes before downloading."
      );
      return;
    }

    const safeEnglishWord =
      escapeHtml(englishWord);

    const safeHint = escapeHtml(hint);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Phoneme Wordle</title>

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
      padding: 28px;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    }

    h1 {
      margin-top: 0;
      text-align: center;
    }

    .description {
      color: #475569;
      text-align: center;
    }

    .badge {
      display: block;
      width: fit-content;
      margin: 16px auto;
      padding: 6px 12px;
      border-radius: 999px;
      color: #1d4ed8;
      background: #dbeafe;
      font-size: 14px;
      font-weight: 700;
    }

    .grid {
      display: grid;
      gap: 8px;
      margin: 28px 0;
    }

    .row {
      display: flex;
      justify-content: center;
      gap: 8px;
    }

    .tile {
      display: grid;
      width: 56px;
      height: 56px;
      place-items: center;
      border: 2px solid #cbd5e1;
      border-radius: 8px;
      background: white;
      font-size: 16px;
      font-weight: 700;
    }

    .correct {
      color: white;
      border-color: #16a34a;
      background: #16a34a;
    }

    .present {
      color: white;
      border-color: #f59e0b;
      background: #f59e0b;
    }

    .incorrect {
      color: white;
      border-color: #64748b;
      background: #64748b;
    }

    .hint {
      margin-top: 20px;
      padding: 14px;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      background: #eff6ff;
    }

    .keyboard-section {
      margin-top: 22px;
    }

    .keyboard-section h2 {
      margin: 0 0 10px;
      font-size: 15px;
    }

    .keyboard {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 7px;
    }

    .phoneme-button {
      min-width: 48px;
      min-height: 48px;
      padding: 7px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      color: #0f172a;
      background: white;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
    }

    .phoneme-button:hover,
    .phoneme-button:focus-visible {
      border-color: #2563eb;
      background: #eff6ff;
      outline: 3px solid #bfdbfe;
      outline-offset: 1px;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .actions button {
      flex: 1;
      min-height: 48px;
      padding: 10px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
    }

    .clear {
      border: 1px solid #cbd5e1;
      color: #0f172a;
      background: white;
    }

    .primary {
      border: 1px solid #2563eb;
      color: white;
      background: #2563eb;
    }

    .primary:hover {
      background: #1d4ed8;
    }

    .message {
      margin-top: 18px;
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      background: #f1f5f9;
      font-weight: 700;
    }

    @media (max-width: 520px) {
      body {
        padding: 12px;
      }

      main {
        padding: 18px 12px;
      }

      .tile {
        width: 48px;
        height: 48px;
      }

      .phoneme-button {
        min-width: 44px;
      }
    }
  </style>
</head>

<body>
  <main>
    <h1>Phoneme Wordle</h1>

    <p class="description">
      Select the HCE phonemes in the correct order and submit your guess.
    </p>

    <span class="badge">
      ${escapeHtml(difficulty)}
    </span>

    <div
      id="grid"
      class="grid"
      aria-label="Phoneme Wordle grid"
    ></div>

    ${
      showHints
        ? `<section class="hint">
             <strong>Hint:</strong> ${safeHint}
           </section>`
        : ""
    }

    <section class="keyboard-section">
      <h2>Consonants</h2>

      <div
        id="consonant-keyboard"
        class="keyboard"
      ></div>
    </section>

    <section class="keyboard-section">
      <h2>Vowels</h2>

      <div
        id="vowel-keyboard"
        class="keyboard"
      ></div>
    </section>

    <div class="actions">
      <button
        id="clear-button"
        class="clear"
        type="button"
      >
        Clear
      </button>

      <button
        id="enter-button"
        class="primary"
        type="button"
      >
        Enter Guess
      </button>
    </div>

    <p
      id="message"
      class="message"
      role="status"
      aria-live="polite"
    >
      Select your first phoneme.
    </p>
  </main>

  <script>
    const targetPhonemes =
      ${JSON.stringify(previewPhonemes)};

    const englishWord =
      ${JSON.stringify(safeEnglishWord)};

    const maximumGuesses =
      ${numberOfGuesses};

    const keyboardPhonemes =
      ${JSON.stringify(phonemeKeyboard)};

    let currentGuess = [];
    let submittedGuesses = [];
    let gameFinished = false;

    const grid =
      document.getElementById("grid");

    const consonantKeyboard =
      document.getElementById(
        "consonant-keyboard"
      );

    const vowelKeyboard =
      document.getElementById(
        "vowel-keyboard"
      );

    const message =
      document.getElementById("message");

    function getTileStatus(
      guess,
      columnIndex
    ) {
      const selectedPhoneme =
        guess[columnIndex];

      if (
        selectedPhoneme ===
        targetPhonemes[columnIndex]
      ) {
        return "correct";
      }

      if (
        targetPhonemes.includes(
          selectedPhoneme
        )
      ) {
        return "present";
      }

      return "incorrect";
    }

    function buildGrid() {
      grid.innerHTML = "";

      for (
        let rowIndex = 0;
        rowIndex < maximumGuesses;
        rowIndex += 1
      ) {
        const row =
          document.createElement("div");

        row.className = "row";

        for (
          let columnIndex = 0;
          columnIndex <
          targetPhonemes.length;
          columnIndex += 1
        ) {
          const tile =
            document.createElement("span");

          tile.className = "tile";

          if (
            submittedGuesses[rowIndex]
          ) {
            const guess =
              submittedGuesses[rowIndex];

            tile.textContent =
              guess[columnIndex] || "";

            tile.classList.add(
              getTileStatus(
                guess,
                columnIndex
              )
            );
          } else if (
            rowIndex ===
            submittedGuesses.length
          ) {
            tile.textContent =
              currentGuess[columnIndex] ||
              "";
          }

          row.appendChild(tile);
        }

        grid.appendChild(row);
      }
    }

    function createKeyboard(
      container,
      group
    ) {
      container.innerHTML = "";

      keyboardPhonemes
        .filter(
          (phoneme) =>
            phoneme.group === group
        )
        .forEach((phoneme) => {
          const button =
            document.createElement(
              "button"
            );

          button.type = "button";
          button.className =
            "phoneme-button";

          button.textContent =
            phoneme.symbol;

          button.title =
            phoneme.example;

          button.setAttribute(
            "aria-label",
            phoneme.symbol +
              ", " +
              phoneme.example
          );

          button.addEventListener(
            "click",
            () => {
              if (gameFinished) {
                return;
              }

              if (
                currentGuess.length >=
                targetPhonemes.length
              ) {
                message.textContent =
                  "Press Enter Guess or Clear the current row.";

                return;
              }

              currentGuess.push(
                phoneme.symbol
              );

              message.textContent =
                currentGuess.length +
                " of " +
                targetPhonemes.length +
                " phonemes selected.";

              buildGrid();
            }
          );

          container.appendChild(
            button
          );
        });
    }

    function clearGuess() {
      if (gameFinished) {
        return;
      }

      currentGuess = [];

      message.textContent =
        "Current guess cleared.";

      buildGrid();
    }

    function submitGuess() {
      if (gameFinished) {
        return;
      }

      if (
        currentGuess.length !==
        targetPhonemes.length
      ) {
        message.textContent =
          "Select exactly " +
          targetPhonemes.length +
          " phonemes before submitting.";

        return;
      }

      const guess = [
        ...currentGuess
      ];

      submittedGuesses.push(guess);

      currentGuess = [];

      const correct =
        guess.every(
          (phoneme, index) =>
            phoneme ===
            targetPhonemes[index]
        );

      buildGrid();

      if (correct) {
        gameFinished = true;

        message.textContent =
          "Correct! The English word is " +
          englishWord.toUpperCase() +
          ".";

        return;
      }

      if (
        submittedGuesses.length >=
        maximumGuesses
      ) {
        gameFinished = true;

        message.textContent =
          "No guesses remain. The correct answer was " +
          targetPhonemes.join(" ") +
          ", meaning " +
          englishWord.toUpperCase() +
          ".";

        return;
      }

      const remaining =
        maximumGuesses -
        submittedGuesses.length;

      message.textContent =
        "Try again. " +
        remaining +
        " guess" +
        (remaining === 1
          ? ""
          : "es") +
        " remaining.";
    }

    document
      .getElementById(
        "clear-button"
      )
      .addEventListener(
        "click",
        clearGuess
      );

    document
      .getElementById(
        "enter-button"
      )
      .addEventListener(
        "click",
        submitGuess
      );

    buildGrid();

    createKeyboard(
      consonantKeyboard,
      "Consonants"
    );

    createKeyboard(
      vowelKeyboard,
      "Vowels"
    );
  </script>
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
      "phoneme-wordle.html";

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(
      downloadUrl
    );

    setPreviewMessage(
      "The standalone Wordle HTML file has been downloaded."
    );
  }

  function renderKeyboardGroup(
    title: string,
    phonemes: Phoneme[]
  ) {
    return (
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">
          {title}
        </p>

        <div className="flex flex-wrap gap-2">
          {phonemes.map((phoneme) => (
            <button
              key={phoneme.symbol}
              type="button"
              title={phoneme.example}
              aria-label={`${phoneme.symbol}, ${phoneme.example}`}
              onClick={() =>
                handleKeyboardClick(
                  phoneme.symbol
                )
              }
              disabled={gameFinished}
              className="min-w-12 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-semibold text-slate-900 transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          Phoneme Wordle Builder
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Create a phoneme-based Wordle activity,
          preview the result, and prepare it for
          download as a standalone HTML file.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {/* SETTINGS */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Activity Settings
          </h2>

          <p className="mt-2 text-slate-600">
            Configure the target phoneme word and
            classroom settings.
          </p>

          <div className="mt-6 space-y-5">
            {/* Database word selection */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-semibold text-slate-900">
                Load Saved Word
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Select a Word List and word stored in the database.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="saved-word-list"
                    className="mb-2 block text-sm font-medium text-slate-900"
                  >
                    Word List
                  </label>

                  <select
                    id="saved-word-list"
                    value={selectedWordListId}
                    onChange={(event) =>
                      handleWordListSelection(
                        event.target.value
                      )
                    }
                    disabled={databaseLoading}
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                  >
                    <option value="">
                      All Word Lists
                    </option>

                    {wordLists.map((wordList) => (
                      <option
                        key={wordList.id}
                        value={wordList.id}
                      >
                        {wordList.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="saved-word"
                    className="mb-2 block text-sm font-medium text-slate-900"
                  >
                    Saved Word
                  </label>

                  <select
                    id="saved-word"
                    value={selectedWordId}
                    onChange={(event) =>
                      handleSavedWordSelection(
                        event.target.value
                      )
                    }
                    disabled={
                      databaseLoading ||
                      filteredSavedWords.length === 0
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                  >
                    <option value="">
                      Select a Saved Word
                    </option>

                    {filteredSavedWords.map((word) => (
                      <option
                        key={word.id}
                        value={word.id}
                      >
                        {word.englishWord}
                      </option>
                    ))}
                  </select>
                </div>

                <p
                  className="text-sm text-blue-700"
                  role="status"
                  aria-live="polite"
                >
                  {databaseLoading
                    ? "Loading database..."
                    : databaseMessage}
                </p>
              </div>
            </div>

            {/* Phoneme word */}
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
                  handlePhonemeWordChange(
                    event.target.value
                  )
                }
                placeholder="θ ɪ ŋ"
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                Enter each HCE phoneme separated by a
                space. Example: θ ɪ ŋ
              </p>
            </div>

            {/* English word */}
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
                onChange={(event) =>
                  setEnglishWord(
                    event.target.value
                  )
                }
                placeholder="Thing"
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Difficulty */}
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
                onChange={(event) =>
                  setDifficulty(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>
              </select>
            </div>

            {/* Hint */}
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
                onChange={(event) =>
                  setHint(event.target.value)
                }
                placeholder="TH as in thin"
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Guesses */}
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
                  handleNumberOfGuessesChange(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value={4}>
                  4 Guesses
                </option>

                <option value={5}>
                  5 Guesses
                </option>

                <option value={6}>
                  6 Guesses
                </option>
              </select>
            </div>

            {/* Hints */}
            <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={showHints}
                onChange={(event) =>
                  setShowHints(
                    event.target.checked
                  )
                }
                className="mt-1 h-4 w-4"
              />

              <span>
                <span className="block font-medium text-slate-900">
                  Show Phoneme Hints
                </span>

                <span className="block text-sm text-slate-500">
                  Display phoneme-to-English sound
                  guidance in the activity.
                </span>
              </span>
            </label>

            {/* Generate */}
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

        {/* PREVIEW */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Live Preview
              </h2>

              <p className="mt-2 text-slate-600">
                Preview of the phoneme Wordle classroom
                activity.
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
                {previewColumns === 1
                  ? ""
                  : "s"}{" "}
                · {numberOfGuesses} guesses
              </p>
            </div>

            {/* Wordle grid */}
            <div
              className="mt-6 space-y-2 overflow-x-auto pb-2"
              aria-label="Wordle preview grid"
            >
              {Array.from({
                length: previewRows,
              }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex min-w-max justify-center gap-2"
                >
                  {Array.from({
                    length:
                      previewColumns,
                  }).map(
                    (_, columnIndex) => {
                      const guess =
                        submittedGuesses[
                          rowIndex
                        ];

                      const status =
                        guess
                          ? getTileStatus(
                              guess,
                              columnIndex
                            )
                          : "empty";

                      return (
                        <div
                          key={
                            columnIndex
                          }
                          className={getTileClasses(
                            status
                          )}
                        >
                          {getTileValue(
                            rowIndex,
                            columnIndex
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              ))}
            </div>

            {/* Colour legend */}
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

            {/* Answer */}
            {gameFinished && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p className="font-semibold text-green-800">
                  Answer:{" "}
                  {previewPhonemes.join(
                    " "
                  )}
                </p>

                <p className="mt-1 text-sm text-green-700">
                  English Equivalence:{" "}
                  {englishWord}
                </p>
              </div>
            )}

            {/* Hint */}
            {showHints && (
              <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <h4 className="font-semibold text-slate-900">
                  Phoneme Hint
                </h4>

                <p className="mt-1 text-sm text-slate-600">
                  {hint.trim() ||
                    "No hint entered."}
                </p>
              </div>
            )}

            {/* Keyboard */}
            <div className="mt-6 space-y-5">
              <p className="text-sm font-semibold text-slate-900">
                HCE Phoneme Keyboard
              </p>

              {renderKeyboardGroup(
                "Consonants",
                consonants
              )}

              {renderKeyboardGroup(
                "Vowels",
                vowels
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleClear}
                disabled={
                  gameFinished ||
                  currentGuess.length === 0
                }
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