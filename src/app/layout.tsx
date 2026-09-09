import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Editorial display serif for headlines.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Clean grotesque for body copy.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Mono for eyebrows / labels / meta.
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nihal Avulan — Product Engineer",
  description:
    "Nihal Avulan builds products by starting from the problem, not the technology. Selected work: GroupyGo, CapMyLead, Prime Circle, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${mono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
