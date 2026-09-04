"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="relative bg-blue-700 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* Logo and site name */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <Image
            src="/phoneme-logo.png"
            alt="Phoneme Activity Builder"
            width={230}
            height={150}
            className="h-[72px] w-auto object-contain"
            priority
          />

          <span className="hidden text-xl font-bold lg:block">
            Phoneme Activity Builder
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Main navigation"
          >
            <Link href="/" className="hover:underline">
              Home
            </Link>

            <Link href="/wordle" className="hover:underline">
              Wordle
            </Link>

            <Link href="/word-search" className="hover:underline">
              Word Search
            </Link>
          </nav>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            className="rounded-md border border-white px-3 py-2 text-xl transition hover:bg-blue-600"
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="compact-navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <nav
          id="compact-navigation"
          className="absolute right-6 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-blue-500 bg-blue-700 shadow-xl"
          aria-label="Compact navigation"
        >
          <div className="flex flex-col">
            <Link
              href="/"
              onClick={closeMenu}
              className="px-5 py-3 transition hover:bg-blue-600"
            >
              Home
            </Link>

            <Link
              href="/wordle"
              onClick={closeMenu}
              className="px-5 py-3 transition hover:bg-blue-600"
            >
              Wordle
            </Link>

            <Link
              href="/word-search"
              onClick={closeMenu}
              className="px-5 py-3 transition hover:bg-blue-600"
            >
              Word Search
            </Link>

            <Link
              href="/manage-words"
              onClick={closeMenu}
              className="px-5 py-3 transition hover:bg-blue-600"
            >
              Manage Words
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className="border-t border-blue-600 px-5 py-3 transition hover:bg-blue-600"
            >
              About
            </Link>

            <Link
              href="/settings"
              onClick={closeMenu}
              className="px-5 py-3 transition hover:bg-blue-600"
            >
              Settings
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}