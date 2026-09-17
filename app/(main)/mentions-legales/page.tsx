import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <main className="text-primary mx-auto min-h-screen w-full max-w-2xl px-6 py-24 pb-32">
      <h1 className="font-cream-cake mb-2 text-4xl capitalize">
        Mentions légales
      </h1>
      <p className="mb-8 text-sm opacity-60">
        Dernière mise à jour : {new Date().getFullYear()}
      </p>

      <div className="space-y-8 text-sm leading-relaxed opacity-90">
        <section>
          <h2 className="mb-2 font-semibold">Projet de démonstration</h2>
          <p>
            Breizh Cola est un projet de portfolio à but de démonstration
            technique. La marque, ses produits et les coordonnées présentées sur
            ce site sont fictifs et n&apos;identifient aucune entreprise réelle.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">Éditeur du site</h2>
          <p>
            Ce site est édité à titre personnel et non professionnel par Adrien
            Delagneau. En tant qu&apos;éditeur non professionnel, conformément à
            l&apos;article 6-III-1 de la loi n° 2004-575 du 21 juin 2004 pour la
            confiance dans l&apos;économie numérique, l&apos;adresse postale
            n&apos;est pas rendue publique.
          </p>
          <p className="mt-2">Contact : devwork5600@gmail.com</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">Directeur de la publication</h2>
          <p>Adrien Delagneau.</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
            CA 91789, États-Unis (
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              vercel.com
            </a>
            ).
          </p>
        </section>
      </div>
    </main>
  );
}
