import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";
import Loader from "@/components/Loader";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { SITE_URL } from "@/lib/seo";

const creamCake = localFont({
  variable: "--font-cream-cake",
  src: "../public/font/Cream Cake.otf",
  display: "swap",
});

const poppins = localFont({
  variable: "--font-poppins",
  src: "../public/font/poppins-extrabold.ttf",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f5ddd2",
};

export const metadata: Metadata = {
  title: {
    default: "Breizh Cola - Boissons Originales",
    template: "%s | Breizh Cola",
  },
  description:
    "Breizh Cola - Découvrez nos boissons originales: Cherry, Zero, Lime et plus encore. Des saveurs uniques pour tous les goûts.",
  keywords: [
    "Breizh Cola",
    "boissons",
    "soda",
    "cherry",
    "zero",
    "lime",
    "coffee",
    "bretagne",
  ],
  authors: [{ name: "Breizh Cola" }],
  creator: "Breizh Cola",
  publisher: "Breizh Cola",
  generator: "Next.js",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Breizh Cola",
    title: "Breizh Cola - Boissons Originales",
    description:
      "Découvrez nos boissons originales: Cherry, Zero, Lime et plus encore.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Breizh Cola - Boissons Originales",
    description:
      "Découvrez nos boissons originales: Cherry, Zero, Lime et plus encore.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body
        className={`${poppins.variable} ${creamCake.variable} bg-primary text-secondary flex min-h-full flex-col overflow-x-hidden`}
      >
        <Loader />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
