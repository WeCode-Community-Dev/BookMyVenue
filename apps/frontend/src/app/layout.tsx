import "../styles/global.css";

import { LANGUAGE, LOCAL_STORAGE, THEME } from "@/lib/Constants";

import AppShell from "./AppShell";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
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
    icons: {
        icon: "/icon.png",
        apple: "/apple-icon.png",
    },
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
    const themeThemeInitializerScript = `
    (function() {
      try {
        var storedTheme = localStorage.getItem('${LOCAL_STORAGE.APP_THEME}');
        var theme = storedTheme || '${THEME.LIGHT}';
        document.documentElement.setAttribute('data-bookMyVenu-theme', theme);
        var storedLang = localStorage.getItem('${LOCAL_STORAGE.APP_LANG}');
        var lang = storedLang || '${LANGUAGE.ENGLISH}';
        if(lang){
        setLanguage(lang)
        }
        if (theme === '${THEME.DARK}') {
          document.documentElement.classList.add('${THEME.DARK}');
        } else {
          document.documentElement.classList.remove('${THEME.DARK}');
        }
      } catch (e) {}
    })();
  `;
    return (
        <html lang="en" className="h-full antialiased" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeThemeInitializerScript }} />
            </head>
            <body className={`${plusJakarta.className} min-h-screen`}>
                <StoreProvider>
                    <AppShell>
                        {children}
                    </AppShell>
                </StoreProvider>
            </body>
        </html>
    );
}
