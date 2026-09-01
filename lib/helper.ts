import { productsDetails } from "./data";

export function getProductByVariant(variant: string) {
  return productsDetails.find(
    (product) => product.name === variant || product.slug === variant
  );
}
