import Carousel from "./components/carousel/Carousel";
import Hero from "./components/hero/Hero";
import ProductCherry from "./components/productCherry/ProductCherry";
import ProductLime from "./components/productLime/ProductLime";

export default function Home() {
  return (
    <div className="relative w-full">
      <Hero />
      <ProductCherry />
      <ProductLime />
      <Carousel />
    </div>
  );
}
