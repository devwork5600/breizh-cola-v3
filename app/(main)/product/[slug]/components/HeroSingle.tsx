type Variant = "original" | "cherry" | "zero" | "lime" | "coffee";

export default function HeroSingle({ variant }: { variant: Variant }) {
  return (
    <section className="flex h-screen w-full items-center justify-center">
      <h1>Breizh Cola {variant}</h1>
    </section>
  );
}
