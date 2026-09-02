import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "La Verde · Descubre los mejores lugares de Cuba",
    template: "%s · La Verde"
  },
  description:
    "La Verde te pasa el dato: el lugar correcto cerca de ti, para compartir, visitar o comprar. Le preguntas con tus palabras y te dice a dónde ir, con el contexto real.",
  keywords: [
    "La Verde",
    "negocios locales Santiago de Cuba",
    "restaurantes Santiago de Cuba",
    "mapa Santiago de Cuba",
    "que hacer en Santiago de Cuba",
    "negocios locales Cuba",
    "guía Santiago de Cuba"
  ],
  authors: [{ name: "La Verde" }],
  openGraph: {
    type: "website",
    locale: "es",
    url: SITE_URL,
    siteName: "La Verde",
    title: "La Verde · El lugar que necesitas, cerca de ti",
    description:
      "Encuentra el lugar correcto para compartir, visitar o comprar. La Verde te dice qué hay cerca de ti y si vale la pena."
  },
  twitter: {
    card: "summary_large_image",
    title: "La Verde · El lugar que necesitas, cerca de ti",
    description: "La Verde te pasa el dato: el lugar correcto cerca de ti."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: "#06211a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={cn(plusJakarta.variable, spaceGrotesk.variable)}>
      <body className="grain min-h-[100dvh] font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}