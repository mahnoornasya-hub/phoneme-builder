"use client";

import { FormEvent, useEffect, useState } from "react";

type Phoneme = {
  id: number;
  symbol: string;
  position: number;
};

type Word = {
  id: number;
  englishWord: string;
  hint: string | null;
  wordListId: number | null;
  wordList: {
    id: number;
    name: string;
  } | null;
  phonemes: Phoneme[];
};

type WordList = {
  id: number;
  name: string;
  description: string | null;
  words?: {
    id: number;
    englishWord: string;
  }[];
};

type DeleteTarget =
  | {
      type: "word";
      item: Word;
    }
  | {
      type: "wordList";
      item: WordList;
    }
  | null;

export default function ManageWordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [loading, setLoading] = useState(true);

  // Word List form
  const [wordListName, setWordListName] = useState("");
  const [wordListDescription, setWordListDescription] =
    useState("");
  const [editingWordListId, setEditingWordListId] = useState<
    number | null
  >(null);

  // Word form
  const [englishWord, setEnglishWord] = useState("");
  const [phonemes, setPhonemes] = useState("");
  const [hint, setHint] = useState("");
  const [wordListId, setWordListId] = useState("");
  const [editingWordId, setEditingWordId] = useState<number | null>(
    null
  );

  // Status
  const [message, setMessage] = useState("");
  const [savingWordList, setSavingWordList] = useState(false);
  const [savingWord, setSavingWord] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] =
    useState<DeleteTarget>(null);

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

  async function reloadData() {
    await Promise.all([loadWords(), loadWordLists()]);
  }

  useEffect(() => {
    async function loadData() {
      try {
        await reloadData();
      } catch (error) {
        console.error(error);
        setMessage("Failed to load saved data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ---------------------------------------
  // WORD LIST FUNCTIONS
  // ---------------------------------------

  function resetWordListForm() {
    setWordListName("");
    setWordListDescription("");
    setEditingWordListId(null);
  }

  async function handleWordListSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setSavingWordList(true);

    try {
      const wasEditing = editingWordListId !== null;

      const url = wasEditing
        ? `/api/word-lists/${editingWordListId}`
        : "/api/word-lists";

      const method = wasEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: wordListName,
          description: wordListDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to save Word List.");
        return;
      }

      resetWordListForm();
      await reloadData();

      setMessage(
        wasEditing
          ? "Word List updated successfully."
          : "Word List saved successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while saving the Word List."
      );
    } finally {
      setSavingWordList(false);
    }
  }

  function handleEditWordList(wordList: WordList) {
    setEditingWordListId(wordList.id);
    setWordListName(wordList.name);
    setWordListDescription(wordList.description || "");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ---------------------------------------
  // WORD FUNCTIONS
  // ---------------------------------------

  function resetWordForm() {
    setEnglishWord("");
    setPhonemes("");
    setHint("");
    setWordListId("");
    setEditingWordId(null);
  }

  async function handleWordSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setSavingWord(true);

    try {
      const phonemeArray = phonemes
        .split(",")
        .map((phoneme) => phoneme.trim())
        .filter((phoneme) => phoneme.length > 0);

      const wasEditing = editingWordId !== null;

      const url = wasEditing
        ? `/api/words/${editingWordId}`
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
          wordListId: wordListId ? Number(wordListId) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to save Word.");
        return;
      }

      resetWordForm();
      await reloadData();

      setMessage(
        wasEditing
          ? "Word updated successfully."
          : "Word saved successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage("Something went wrong while saving the Word.");
    } finally {
      setSavingWord(false);
    }
  }

  function handleEditWord(word: Word) {
    setEditingWordId(word.id);
    setEnglishWord(word.englishWord);

    setPhonemes(
      word.phonemes.map((phoneme) => phoneme.symbol).join(", ")
    );

    setHint(word.hint || "");

    setWordListId(
      word.wordListId !== null ? String(word.wordListId) : ""
    );

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ---------------------------------------
  // DELETE FUNCTIONS
  // ---------------------------------------

  function openWordDeleteModal(word: Word) {
    setDeleteTarget({
      type: "word",
      item: word,
    });

    setMessage("");
  }

  function openWordListDeleteModal(wordList: WordList) {
    setDeleteTarget({
      type: "wordList",
      item: wordList,
    });

    setMessage("");
  }

  function closeDeleteModal() {
    if (!deleting) {
      setDeleteTarget(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const isWord = deleteTarget.type === "word";

      const url = isWord
        ? `/api/words/${deleteTarget.item.id}`
        : `/api/word-lists/${deleteTarget.item.id}`;

      const response = await fetch(url, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to delete item.");
        return;
      }

      if (
        deleteTarget.type === "word" &&
        editingWordId === deleteTarget.item.id
      ) {
        resetWordForm();
      }

      if (
        deleteTarget.type === "wordList" &&
        editingWordListId === deleteTarget.item.id
      ) {
        resetWordListForm();
      }

      await reloadData();

      setDeleteTarget(null);

      setMessage(
        isWord
          ? "Word deleted successfully."
          : "Word List deleted successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage("Something went wrong while deleting the item.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="space-y-10">
        {/* PAGE HEADING */}
        <section>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
            Database Management
          </p>

          <h1 className="text-4xl font-bold text-slate-900">
            Manage Words
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Create and manage Word Lists, Words, phoneme sequences,
            and hints stored in the activity database.
          </p>
        </section>

        {/* STATUS MESSAGE */}
        {message && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-800">
            {message}
          </div>
        )}

        {/* WORD LISTS */}
        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Word Lists
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Manage Word Lists
            </h2>

            <p className="mt-2 text-slate-600">
              Create Word Lists to organise Words for different
              phoneme activities.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* CREATE / EDIT WORD LIST */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">
                {editingWordListId
                  ? "Edit Word List"
                  : "Create Word List"}
              </h3>

              <p className="mt-2 text-slate-600">
                Give the Word List a name and optional description.
              </p>

              <form
                onSubmit={handleWordListSubmit}
                className="mt-6 space-y-5"
              >
                <div>
                  <label
                    htmlFor="wordListName"
                    className="mb-2 block font-medium text-slate-900"
                  >
                    Word List Name
                  </label>

                  <input
                    id="wordListName"
                    value={wordListName}
                    onChange={(event) =>
                      setWordListName(event.target.value)
                    }
                    placeholder="e.g. Animal Words"
                    required
                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wordListDescription"
                    className="mb-2 block font-medium text-slate-900"
                  >
                    Description
                  </label>

                  <textarea
                    id="wordListDescription"
                    value={wordListDescription}
                    onChange={(event) =>
                      setWordListDescription(event.target.value)
                    }
                    placeholder="e.g. Common animal Words for phoneme activities"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={savingWordList}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingWordList
                      ? "Saving..."
                      : editingWordListId
                        ? "Update Word List"
                        : "Save Word List"}
                  </button>

                  {editingWordListId && (
                    <button
                      type="button"
                      onClick={resetWordListForm}
                      className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* SAVED WORD LISTS */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">
                Saved Word Lists
              </h3>

              <p className="mt-2 text-slate-600">
                Word Lists currently stored in the database.
              </p>

              {loading ? (
                <p className="mt-6 text-slate-500">
                  Loading Word Lists...
                </p>
              ) : wordLists.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
                  No Saved Word Lists Yet.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {wordLists.map((wordList) => (
                    <div
                      key={wordList.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <h4 className="text-xl font-bold text-slate-900">
                        {wordList.name}
                      </h4>

                      <p className="mt-2 text-sm text-slate-600">
                        {wordList.description || "No Description"}
                      </p>

                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">
                          Words:
                        </span>{" "}
                        {wordList.words?.length ?? 0}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditWordList(wordList)}
                          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                        >
                          Edit Word List
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openWordListDeleteModal(wordList)
                          }
                          className="rounded-lg border border-red-300 bg-white px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete Word List
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* WORDS */}
        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Words
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Manage Words
            </h2>

            <p className="mt-2 text-slate-600">
              Add Words and phoneme sequences to your saved Word
              Lists.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* ADD / EDIT WORD */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">
                {editingWordId ? "Edit Word" : "Add Word"}
              </h3>

              <p className="mt-2 text-slate-600">
                Store a Word, its phonemes, hint, and Word List.
              </p>

              <form
                onSubmit={handleWordSubmit}
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
                      setEnglishWord(event.target.value)
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
                      setPhonemes(event.target.value)
                    }
                    placeholder="e.g. ʃ, ɪ, p"
                    required
                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Separate each phoneme with a comma. Multi-character
                    phonemes remain one phoneme.
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
                    onChange={(event) => setHint(event.target.value)}
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
                      setWordListId(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">No Word List</option>

                    {wordLists.map((wordList) => (
                      <option key={wordList.id} value={wordList.id}>
                        {wordList.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={savingWord}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingWord
                      ? "Saving..."
                      : editingWordId
                        ? "Update Word"
                        : "Save Word"}
                  </button>

                  {editingWordId && (
                    <button
                      type="button"
                      onClick={resetWordForm}
                      className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* SAVED WORDS */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">
                Saved Words
              </h3>

              <p className="mt-2 text-slate-600">
                Words currently stored in the database.
              </p>

              {loading ? (
                <p className="mt-6 text-slate-500">
                  Loading Words...
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
                      <h4 className="text-xl font-bold text-slate-900">
                        {word.englishWord}
                      </h4>

                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">
                          Phonemes:
                        </span>{" "}
                        {word.phonemes
                          .map((phoneme) => phoneme.symbol)
                          .join(" · ")}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">
                          Hint:
                        </span>{" "}
                        {word.hint || "No Hint"}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">
                          Word List:
                        </span>{" "}
                        {word.wordList?.name || "None"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditWord(word)}
                          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                        >
                          Edit Word
                        </button>

                        <button
                          type="button"
                          onClick={() => openWordDeleteModal(word)}
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
          </div>
        </section>
      </div>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
              !
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              {deleteTarget.type === "word"
                ? "Delete Word?"
                : "Delete Word List?"}
            </h2>

            <p className="mt-3 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                “
                {deleteTarget.type === "word"
                  ? deleteTarget.item.englishWord
                  : deleteTarget.item.name}
                ”
              </span>
              ? This action cannot be undone.
            </p>

            {deleteTarget.type === "wordList" && (
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                Words assigned to this Word List will remain in the
                database, but they will no longer belong to this list.
              </p>
            )}

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
                  : deleteTarget.type === "word"
                    ? "Delete Word"
                    : "Delete Word List"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}