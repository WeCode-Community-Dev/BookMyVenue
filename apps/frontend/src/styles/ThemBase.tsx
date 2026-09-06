import { THEME } from "@/lib/Constants";
import { useConfigTheme } from "@/store/AppConfigReducer";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeBase = () => {
    const appTheme = useSelector(useConfigTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-bookMyVenu-theme", appTheme);
        if (appTheme === THEME.DARK) {
            document.documentElement.classList.add(THEME.DARK);
        } else {
            document.documentElement.classList.remove(THEME.DARK);
        }
    }, [
        appTheme
    ]);

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "development") {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (const registration of registrations) {
                    registration.unregister();
                }
            });
        }
    }, []);

    return <></>;
};

export default ThemeBase;
