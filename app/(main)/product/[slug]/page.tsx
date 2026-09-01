import Marquee from "@/components/Marquee";

import HeroSingle from "./components/HeroSingle";
import MatterMarquee from "./components/MatterMarquee";
import Nutriments from "./components/Nutriments";

interface PageProps {
  params: Promise<{ slug: string }>;
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
