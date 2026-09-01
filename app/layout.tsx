import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Breizh Cola - Boissons Originales",
  description:
    "Breizh Cola - Découvrez nos boissons originales: Cherry, Zero, Lime et plus encore.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
