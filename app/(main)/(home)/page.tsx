import Marquee from "@/components/Marquee";

import Carousel from "./components/carousel/Carousel";
import Hero from "./components/hero/Hero";
import ProductCherry from "./components/productCherry/ProductCherry";
import ProductLime from "./components/productLime/ProductLime";

export default function Home() {
  return (
    <div className="relative z-5 w-full">
      <Hero />
      <Marquee
        initialDirection={1}
        speed={1}
        sentence="Une brise iodée venue de l’océan traverse la Bretagne, apportant fraîcheur, caractère et authenticité."
      />
      <Marquee
        initialDirection={-1}
        speed={0.7}
        sentence="Breizh Cola incarne l’esprit breton : une terre de caractère, des saveurs authentiques et une fraîcheur qui se partage, face à l’océan et sous un ciel ouvert."
      />
      <Marquee
        initialDirection={1}
        speed={0.9}
        sentence="Breizh Cola Cherry revisite l’esprit breton avec une touche fruitée : des bulles de caractère, une cerise intense et une fraîcheur venue de l’Ouest."
      />
      <ProductCherry />
      <Marquee
        initialDirection={1}
        speed={1.1}
        sentence="Lime affirme sa fraîcheur avec caractère : toute la vivacité du citron vert, toute l’intensité du goût, et une énergie acidulée qui claque comme une vague au grand large."
      />
      <ProductLime />
      <Marquee
        initialDirection={1}
        speed={1.1}
        sentence="Notre histoire s’inscrit dans le temps avec constance et ambition : chaque année, chaque étape, chaque image révèle une évolution portée par l’audace et la passion."
      />
      <Carousel />
    </div>
  );
}
