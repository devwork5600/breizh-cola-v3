import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-secondary/70 text-sm tracking-widest uppercase">
        Erreur 404
      </p>
      <h1 className="font-cream-cake text-4xl normal-case sm:text-5xl md:text-6xl">
        Cette bouteille est vide
      </h1>
      <p className="text-secondary/70 max-w-md">
        La page que tu cherches n&apos;existe pas. Retourne explorer nos
        boissons.
      </p>
      <Link
        href="/"
        className="border-secondary text-secondary hover:bg-secondary hover:text-primary rounded-full border-2 px-6 py-3 transition-colors duration-300"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
