"use client";

import { FormEvent, useEffect, useState } from "react";

type Phoneme = {
  id: number;
  symbol: string;
  position: number;
};

type WordList = {
  id: number;
  name: string;
};

type Word = {
  id: number;
  englishWord: string;
  hint: string | null;
  wordListId: number | null;
  wordList: WordList | null;
  phonemes: Phoneme[];
};

export default function ManageWordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [loading, setLoading] = useState(true);

  const [englishWord, setEnglishWord] = useState("");
  const [phonemes, setPhonemes] = useState("");
  const [hint, setHint] = useState("");
  const [wordListId, setWordListId] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteWord, setDeleteWord] = useState<Word | null>(null);

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadWords() {
    const response = await fetch("/api/words");

    if (!response.ok) {
      throw new Error("Failed to load words.");
    }

    const data = await response.json();
    setWords(data);
  }

  async function loadWordLists() {
    const response = await fetch("/api/word-lists");

    if (!response.ok) {
      throw new Error("Failed to load word lists.");
    }

    const data = await response.json();
    setWordLists(data);
  }

  useEffect(() => {
    async function loadData() {
      try {
        await Promise.all([
          loadWords(),
          loadWordLists(),
        ]);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load saved data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function resetForm() {
    setEnglishWord("");
    setPhonemes("");
    setHint("");
    setWordListId("");
    setEditingId(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setSaving(true);

    try {
      const phonemeArray = phonemes
        .split(",")
        .map((phoneme) => phoneme.trim())
        .filter((phoneme) => phoneme.length > 0);

      const wasEditing = editingId !== null;

      const url = wasEditing
        ? `/api/words/${editingId}`
        : "/api/words";

      const method = wasEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          englishWord,
          hint,
          phonemes: phonemeArray,
          wordListId: wordListId
            ? Number(wordListId)
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Failed to save word."
        );
        return;
      }

      resetForm();
      await loadWords();

      setMessage(
        wasEditing
          ? "Word updated successfully."
          : "Word saved successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while saving the word."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(word: Word) {
    setEditingId(word.id);
    setEnglishWord(word.englishWord);

    setPhonemes(
      word.phonemes
        .map((phoneme) => phoneme.symbol)
        .join(", ")
    );

    setHint(word.hint || "");

    setWordListId(
      word.wordListId !== null
        ? String(word.wordListId)
        : ""
    );

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openDeleteModal(word: Word) {
    setDeleteWord(word);
    setMessage("");
  }

  function closeDeleteModal() {
    if (!deleting) {
      setDeleteWord(null);
    }
  }

  async function confirmDelete() {
    if (!deleteWord) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/words/${deleteWord.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Failed to delete word."
        );
        return;
      }

      if (editingId === deleteWord.id) {
        resetForm();
      }

      await loadWords();

      setDeleteWord(null);

      setMessage(
        "Word deleted successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while deleting the word."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="space-y-8">
        {/* Page Heading */}
        <section>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
            Database Management
          </p>

          <h1 className="text-4xl font-bold text-slate-900">
            Manage Words
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Create, update, and delete words and phoneme
            sequences stored in the activity database.
          </p>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Add / Edit Word */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              {editingId
                ? "Edit Word"
                : "Add Word"}
            </h2>

            <p className="mt-2 text-slate-600">
              Store a word, its phonemes, hint, and word
              list.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="englishWord"
                  className="mb-2 block font-medium text-slate-900"
                >
                  English Word
                </label>

                <input
                  id="englishWord"
                  value={englishWord}
                  onChange={(event) =>
                    setEnglishWord(
                      event.target.value
                    )
                  }
                  placeholder="e.g. ship"
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phonemes"
                  className="mb-2 block font-medium text-slate-900"
                >
                  Phonemes
                </label>

                <input
                  id="phonemes"
                  value={phonemes}
                  onChange={(event) =>
                    setPhonemes(
                      event.target.value
                    )
                  }
                  placeholder="e.g. ʃ, ɪ, p"
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-sm text-slate-500">
                  Separate each phoneme with a comma.
                  Multi-character phonemes remain one
                  phoneme.
                </p>
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
                  value={hint}
                  onChange={(event) =>
                    setHint(event.target.value)
                  }
                  placeholder="e.g. A large boat"
                  className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="wordList"
                  className="mb-2 block font-medium text-slate-900"
                >
                  Word List
                </label>

                <select
                  id="wordList"
                  value={wordListId}
                  onChange={(event) =>
                    setWordListId(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    No Word List
                  </option>

                  {wordLists.map(
                    (wordList) => (
                      <option
                        key={wordList.id}
                        value={wordList.id}
                      >
                        {wordList.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Word"
                      : "Save Word"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {message && (
              <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-800">
                {message}
              </div>
            )}
          </div>

          {/* Saved Words */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Saved Words
            </h2>

            <p className="mt-2 text-slate-600">
              Words currently stored in the database.
            </p>

            {loading ? (
              <p className="mt-6 text-slate-500">
                Loading words...
              </p>
            ) : words.length === 0 ? (
              <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
                No Saved Words Yet.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {words.map((word) => (
                  <div
                    key={word.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <h3 className="text-xl font-bold text-slate-900">
                      {word.englishWord}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        Phonemes:
                      </span>{" "}
                      {word.phonemes
                        .map(
                          (phoneme) =>
                            phoneme.symbol
                        )
                        .join(" · ")}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        Hint:
                      </span>{" "}
                      {word.hint ||
                        "No Hint"}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        Word List:
                      </span>{" "}
                      {word.wordList?.name ||
                        "None"}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(word)
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Edit Word
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openDeleteModal(
                            word
                          )
                        }
                        className="rounded-lg border border-red-300 bg-white px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete Word
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Delete Word Modal */}
      {deleteWord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-word-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
              !
            </div>

            <h2
              id="delete-word-title"
              className="mt-4 text-2xl font-bold text-slate-900"
            >
              Delete Word?
            </h2>

            <p className="mt-3 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                “{deleteWord.englishWord}”
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Word"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}