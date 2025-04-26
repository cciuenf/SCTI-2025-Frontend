import { Inter, League_Spartan } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"]
})

const spartan = League_Spartan({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"]
})

export const fontClass = cn(spartan.className);
