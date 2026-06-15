import "../styles/global.css";

import Header from "@/components/global/header/Header";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SidebarWrapper from "@/components/global/sidebarwrapper";
import StoreProvider from "@/components/global/StoreProvider";

const plusJakarta = Plus_Jakarta_Sans({
    subsets: [
        "latin"
    ],
    display: "swap",
});

export const metadata: Metadata = {
    title: "BookMyVenue",
    description: "Venue booking platform",
};

export default function RootLayout({ children, }: { children: React.ReactNode;}) {
    return (
        <html lang="en" className="h-full antialiased">
            <body className={`${plusJakarta.className} min-h-screen`}>
                <StoreProvider>
                    <Header />
                    <div className="flex">
                        <SidebarWrapper />
                        <main className="flex-1">
                            {children}
                        </main>
                    </div>
                </StoreProvider>
            </body>
        </html>
    );
}
