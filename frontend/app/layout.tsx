import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "BookMyVenue - Find & Book the Perfect Venue Near You",
  description: "Discover and book wedding halls, birthday venues, auditoriums, resorts, cafes and more. Modern event discovery and booking platform.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans text-slate-800">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
