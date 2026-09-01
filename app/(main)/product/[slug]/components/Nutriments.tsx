type Variant = "original" | "cherry" | "zero" | "lime" | "coffee";

export default function Nutriments({ variant }: { variant: Variant }) {
  return (
    <section className="flex min-h-[50vh] w-full items-center justify-center">
      <h2>Valeurs nutritionnelles — {variant}</h2>
    </section>
  );
}
