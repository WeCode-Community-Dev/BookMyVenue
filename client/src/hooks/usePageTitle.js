import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | BookMyVenue` : "BookMyVenue";

    return () => {
      document.title = "BookMyVenue";
    };
  }, [title]);
}