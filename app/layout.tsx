import type { Metadata } from "next";
import { Inter, Playfair_Display, Kalam } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reliaa — Contemporary Furniture",
  description:
    "Reliaa crafts a curated collection of contemporary sofas, chairs and furniture. Explore our showroom collection.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${kalam.variable}`}>
      <body>{children}</body>
    </html>
  );
}
