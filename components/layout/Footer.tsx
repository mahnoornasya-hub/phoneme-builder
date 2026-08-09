import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <p className="text-sm text-gray-600">
          © 2026 Mahnoor Anasyabila Sohail | CSE3CWA - Cloud Web Application
        </p>

        <Image
          src="/ltu-logo.png"
          alt="La Trobe University"
          width={100}
          height={40}
          className="h-auto w-20 object-contain"
        />

      </div>
    </footer>
  );
}