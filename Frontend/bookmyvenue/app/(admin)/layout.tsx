import { Geist, Geist_Mono, Figtree, Roboto } from "next/font/google"

import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/ui/navbar";

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading'});

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", figtree.variable, robotoHeading.variable)}
    >
      <body className="min-h-svh overflow-x-scroll no-scrollbar">
        <ThemeProvider>
          <Navbar type="owner"/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
