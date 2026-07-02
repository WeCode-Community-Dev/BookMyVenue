import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BookMyVenue",
    description: "Book your dream Venues easily.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <ClerkProvider>
                <QueryProvider>
                    <body className="min-h-full flex flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </body>
                </QueryProvider>
            </ClerkProvider>
            <Toaster position="top-right" richColors />
        </html>
    );
}
