export const getSafeRedirectUrl = (url: string | null, fallback = '/'): string => {
  if (!url) return fallback;

  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin === window.location.origin) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // URL parsing failed
  }

  return fallback;
};
