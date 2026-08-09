import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Layout from "@/components/layout/Layout";
import PreferencesLoader from "@/components/common/PreferencesLoader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phoneme Activity Builder",
  description:
    "Create phoneme-based Wordle and Word Search classroom activities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PreferencesLoader />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}