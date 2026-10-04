import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}