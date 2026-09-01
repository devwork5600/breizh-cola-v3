import { getProductByVariant } from "@/lib/helper";

export default function Nutriments({
  variant,
}: {
  variant: "original" | "cherry" | "zero" | "lime" | "coffee";
}) {
  const product = getProductByVariant(variant);

  if (!product) {
    return null;
  }

  const n = product.nutritionel;

  return (
    <section className="text-secondary mx-auto mt-6 mb-12 flex w-full max-w-4xl flex-col justify-center px-3 lg:mb-24 lg:max-w-none">
      <div className="my-6 flex w-full flex-col gap-24 lg:gap-3 xl:flex-row">
        <div className="grid w-full gap-4 text-xl lg:p-3 lg:text-2xl 2xl:p-12 2xl:text-3xl">
          <Nutrient label="Énergie" value={`${n.energie} kcal`} />
          <Nutrient label="Graisses" value={`${n.graisses} g`} />
          <Nutrient label="Glucides" value={`${n.glucides} g`} />
          <Nutrient label="Protéines" value={`${n.proteines} g`} />
          <Nutrient label="Sel" value={`${n.sel} g`} />
        </div>

        <div className="lg:p-3 2xl:p-12">
          <h3 className="mb-6 text-2xl font-semibold lg:text-3xl 2xl:text-4xl">
            Ingrédients :
          </h3>
          <p className="text-xl opacity-80 lg:text-2xl 2xl:text-3xl">
            {product.ingredients}
          </p>
        </div>
      </div>
    </section>
  );
}

function Nutrient({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
