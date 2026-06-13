"use client"

import { Footer } from "@/src/components/shared/footer";
import { Navbar } from "@/src/components/shared/navbar";
import { Banner } from "@/src/components/venues/banner";
import { usePathname } from "next/navigation";

export default function VenueLayout({ children }: any) {
    const pathname = usePathname();
    const isMainVenuesPage = pathname === "/";
    console.log(pathname)
    return (
        <div className="font-raleway flex flex-col">
            {isMainVenuesPage ? (
                <div
                    style={{
                        backgroundImage: "url('/images/banner-bg.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="flex flex-col gap-10 pb-20 max-h-[90vh]">
                    <Navbar />
                    <Banner />
                </div>
            ) : (
                    <Navbar />
            )}

            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}