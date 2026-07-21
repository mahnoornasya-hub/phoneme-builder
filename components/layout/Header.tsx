export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">
          Phoneme Activity Builder
        </h1>

        <nav className="hidden gap-6 md:flex">
          <a href="/">Home</a>
          <a href="/wordle">Wordle</a>
          <a href="/word-search">Word Search</a>
          <a href="/about">About</a>
          <a href="/settings">Settings</a>
        </nav>

        <button className="rounded-md border border-white px-3 py-2 md:hidden">
          ☰
        </button>
      </div>
    </header>
  );
}