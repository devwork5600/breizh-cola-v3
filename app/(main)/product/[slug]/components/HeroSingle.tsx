type Variant = "original" | "cherry" | "zero" | "lime" | "coffee";

const accentClass: Record<Variant, string> = {
  original: "text-secondary",
  zero: "text-secondary",
  cherry: "text-cherry",
  lime: "text-lime",
  coffee: "text-coffee",
};

export default function HeroSingle({ variant }: { variant: Variant }) {
  return (
    <section className="flex h-screen w-full items-center justify-center">
      <h1
        className={`font-cream-cake text-5xl capitalize ${accentClass[variant]}`}
      >
        Breizh Cola {variant}
      </h1>
    </section>
  );
}
