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
    <div className="relative z-5 w-full pt-24">
      <HeroSingle variant={slug} />
      <Nutriments variant={slug} />
      <MatterMarquee />
    </div>
  );
}
