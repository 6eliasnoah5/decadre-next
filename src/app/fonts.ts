import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";

// Schriften ueber next/font/google: werden beim Build heruntergeladen und
// selbst ausgeliefert, im Browser gibt es keine Anfrage an Google.
// Gemeinsam genutzt von den Root-Layouts (site) und (legal).
//
// Die CSS-Variablen heissen *-src, damit sie nicht mit den Tokens
// --font-display / --font-body / --font-mono in :root kollidieren. Die
// Tokens verweisen auf diese Variablen und haengen die Fallback-Kette an.

export const interTight = Inter_Tight({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display-src",
  display: "swap",
});

export const inter = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-body-src",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono-src",
  display: "swap",
});

export const fontVariables = `${interTight.variable} ${inter.variable} ${jetbrainsMono.variable}`;
