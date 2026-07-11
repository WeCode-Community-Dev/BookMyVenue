import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VenueFlow | Premium Space & Venue Booking Platform",
  description: "Book beautiful corporate boardrooms, elegant ballrooms, creative photography studios, and open-air rooftop lounges instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <footer className="border-t border-border bg-card py-8 mt-auto">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-muted-foreground text-sm space-y-4 sm:space-y-0">
                <div>
                  <span className="font-semibold text-foreground">VenueFlow</span> &copy; 2026. All rights reserved.
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                  <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-foreground transition-colors">Support</a>
                </div>
              </div>
            </footer>
            <Toaster position="top-right" closeButton richColors />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
