import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

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
  title: "Breizh Cola - Boissons Originales",
  description:
    "Breizh Cola - Découvrez nos boissons originales: Cherry, Zero, Lime et plus encore.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body
        className={`${poppins.variable} ${creamCake.variable} bg-primary text-secondary flex min-h-full flex-col overflow-x-hidden`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
