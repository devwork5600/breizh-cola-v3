import type { Metadata } from "next";

import Marquee from "@/components/Marquee";
import { getProductByVariant } from "@/lib/helper";
import { PRODUCT_SLUGS } from "@/lib/seo";

import HeroSingle from "./components/HeroSingle";
import MatterMarquee from "./components/MatterMarquee";
import Nutriments from "./components/Nutriments";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const product = getProductByVariant(slug);

  if (!product) return {};

  // Root layout's title template appends " | Breizh Cola" — just the
  // flavor name here avoids "Breizh Cola Original | Breizh Cola".
  const title = `${product.name.charAt(0).toUpperCase()}${product.name.slice(1)}`;
  const description = product.description[0];

  return {
    title,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function Page({ params }: PageProps) {
  const slug = (await params).slug as
    "original" | "cherry" | "zero" | "lime" | "coffee";

  return (
    <div className="relative z-5 min-h-screen w-full pt-24">
      <HeroSingle variant={slug} />
      <Nutriments variant={slug} />
      <Marquee
        initialDirection={-1}
        speed={1.1}
        sentence="Notre histoire s’inscrit dans le temps avec constance et ambition : chaque année, chaque étape, chaque image révèle une évolution portée par l’audace et la passion."
      />
      <MatterMarquee />
    </div>
  );
}
