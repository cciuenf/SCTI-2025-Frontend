import { Inter, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

// const inter = Inter({
//   weight: ["400", "500", "600"],
//   subsets: ["latin"]
// })

const spartan = localFont({
  src: "./fonts/LeagueSpartan.ttf",
  variable: "--font-league-spartan",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontClass = cn(geistSans.variable, geistMono.variable, spartan.variable);