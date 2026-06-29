import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookMyVenue | Find the Perfect Venue for Every Occasion",
  description: "Browse, filter, and book premium wedding halls, conference rooms, rooftops, and banquets across 18+ cities.",
  keywords: ["venue booking", "wedding halls", "conference rooms", "banquet halls", "rooftop venues", "event venues"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(playfairDisplay.variable, "font-sans", geist.variable)}>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
