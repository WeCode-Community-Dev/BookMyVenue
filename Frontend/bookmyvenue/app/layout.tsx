import { Geist, Geist_Mono, Figtree, Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/sonner"

import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { ReduxProvider } from "@/lib/redux/provider";

const robotoHeading = Roboto({ subsets: ['latin'], variable: '--font-heading' });

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })

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
          <ClerkProvider>
            <ReduxProvider>
            {children}
            </ReduxProvider>
            <Toaster richColors />
            <Footer />
          </ClerkProvider>

        </ThemeProvider>
      </body>
    </html>
  )
}
