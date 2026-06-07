import type { Metadata } from "next";
import "./globals.css";
import { Raleway, Fraunces } from 'next/font/google';

const raleway = Raleway({
 weight: ['400', '600'],
 subsets: ['latin'],
 display: 'swap',
 variable: "--font-raleway",
})
const fraunces = Fraunces({
  weight: ['200','300'],
 subsets: ['latin'],
 display: 'swap',
 variable: "--font-fraunces",
})

export const metadata: Metadata = {
  title: "Book My Venue",
  description: "Application for booking venues created using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  );
}
