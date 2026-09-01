# Breizh Cola

Site vitrine pour une marque fictive de sodas bretons — projet de portfolio axé sur l'animation et la 3D en temps réel dans le navigateur.

**Démo :** [breizh-cola-v3.vercel.app](https://breizh-cola-v3.vercel.app)

<!-- Remplacer par un GIF ou une capture d'écran du site (hero + carousel + page produit) -->

## Aperçu

Chaque canette (5 goûts) est un modèle 3D texturé, mise en scène avec des animations pilotées au scroll : entrée séquencée en intro, carousel 3D interactif, révélation de sections au scroll, et un mini-jeu de physique (canon à autocollants) sur la page produit. L'ensemble tourne sur un seul contexte WebGL partagé entre toutes les scènes de la page, pour rester fluide même avec plusieurs animations 3D simultanées.

## Stack technique

- **[Next.js 16](https://nextjs.org/)** (App Router) + **React 19** + **TypeScript**
- **[React Three Fiber](https://r3f.docs.pmnd.rs/) / [Three.js](https://threejs.org/)** — scènes 3D, shaders GLSL custom (fond animé, particules de bulles)
- **[GSAP](https://gsap.com/)** (`ScrollTrigger`, `Observer`) — toutes les animations et la choreographie de scroll
- **[Lenis](https://lenis.darkroom.engineering/)** — smooth scroll, synchronisé avec GSAP sur le même ticker
- **[Matter.js](https://brm.io/matter-js/)** — moteur physique 2D pour le mini-jeu de la page produit
- **[Zustand](https://zustand-demo.pmnd.rs/)** — état partagé léger (menu, bulles, animation d'intro)
- **[Tailwind CSS v4](https://tailwindcss.com/)**
- **ESLint + Prettier + Husky/lint-staged** — qualité de code et hooks pre-commit

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

```bash
npm run lint          # ESLint
npm run format:check  # Prettier
npm run build          # build de production
```
