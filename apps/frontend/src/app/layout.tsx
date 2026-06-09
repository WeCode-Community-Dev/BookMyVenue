import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/global/header";
import Sidebar from "@/components/global/sidebar";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookMyVenue",
  description: "Venue booking platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${plusJakarta.className} min-h-screen`}>
        <Header />

        <div className="flex">
          <Sidebar />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// import { Plus_Jakarta_Sans } from "next/font/google";
// import "./globals.css";

// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "BookMyVenue",
//   description: "Venue booking platform",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className="h-full antialiased">
//       <body className={`${plusJakarta.className} min-h-full flex flex-col`}>
//         {children}
//       </body>
//     </html>
//   );
// }
