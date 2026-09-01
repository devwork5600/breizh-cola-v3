export interface Nutritionel {
  energie: number;
  graisses: number;
  glucides: number;
  proteines: number;
  sel: number;
}

export interface ProductDetail {
  slug: string;
  name: string;
  description: string[];
  ingredients: string;
  nutritionel: Nutritionel;
}

export const productsDetails: ProductDetail[] = [
  {
    slug: "breizh-cola-original",
    name: "original",
    description: [
      "Breizh Cola Original, lancé en 2002, offre un mélange parfait d’ingrédients, avec des bulles fines et un goût rafraîchissant. Apprécié pour son caractère authentique et breton, il reste un favori indétrônable après plus de 20 ans.",
    ],
    ingredients:
      "Eau, gaz carbonique, colorant : E150d, acidifiants : acide citrique, acide phosphorique et citrate de sodium, caféine, arôme naturel de cola et autres arômes naturels, édulcorants : aspartame et acésulfame K.",
    nutritionel: {
      energie: 11,
      graisses: 0.1,
      glucides: 0.3,
      proteines: 0.1,
      sel: 0,
    },
  },
  {
    slug: "breizh-cola-zero",
    name: "zero",
    description: [
      "Avec Breizh Cola Zéro, savourez l’authenticité d’un cola breton sans aucune calorie. Conçu pour ceux qui veulent profiter d’un goût riche sans le sucre, il allie plaisir et bien-être sans compromis.",
    ],
    ingredients:
      "Eau, gaz carbonique, colorant : E150d, acidifiants : acide citrique, acide phosphorique et citrate de sodium, caféine, arôme naturel de cola et autres arômes naturels, édulcorants : aspartame, acésulfame K et sucralose.",
    nutritionel: {
      energie: 0,
      graisses: 0.1,
      glucides: 0.3,
      proteines: 0.1,
      sel: 0,
    },
  },
  {
    slug: "breizh-cola-cherry",
    name: "cherry",
    description: [
      "Breizh Cola Cherry apporte une touche fruitée à la gamme avec son goût de cerise. Ce cola breton audacieux associe la saveur classique avec un zeste de cerise, créant une expérience gourmande et rafraîchissante.",
    ],
    ingredients:
      "Eau, gaz carbonique, colorant : E150d, acidifiants : acide citrique, acide phosphorique et citrate de sodium, caféine, arôme naturel de cola et autres arômes naturels, édulcorants : aspartame et acésulfame K.",
    nutritionel: {
      energie: 42,
      graisses: 0.1,
      glucides: 9.8,
      proteines: 0.3,
      sel: 0,
    },
  },
  {
    slug: "breizh-cola-lime",
    name: "lime",
    description: [
      "Breizh Cola Lime combine l’intensité du cola breton avec une touche vive et acidulée de citron vert. Cette alliance rafraîchissante apporte une sensation de fraîcheur immédiate et un équilibre parfait entre douceur et vivacité.",
    ],
    ingredients:
      "Eau, gaz carbonique, colorant : E150d, acidifiants : acide citrique et citrate de sodium, caféine, arôme naturel de cola, arôme naturel de citron vert, édulcorants : aspartame et acésulfame K.",
    nutritionel: {
      energie: 38,
      graisses: 0,
      glucides: 9.2,
      proteines: 0,
      sel: 0,
    },
  },
  {
    slug: "breizh-cola-coffee",
    name: "coffee",
    description: [
      "Breizh Cola Coffee propose une fusion audacieuse entre le cola breton et des notes riches de café. Cette combinaison unique offre une profondeur aromatique intense, parfaite pour les amateurs de saveurs plus corsées.",
    ],
    ingredients:
      "Eau, gaz carbonique, colorant : E150d, acidifiants : acide phosphorique et citrate de sodium, caféine, arôme naturel de cola, extrait de café, édulcorants : aspartame et acésulfame K.",
    nutritionel: {
      energie: 45,
      graisses: 0,
      glucides: 10.5,
      proteines: 0.2,
      sel: 0,
    },
  },
];
