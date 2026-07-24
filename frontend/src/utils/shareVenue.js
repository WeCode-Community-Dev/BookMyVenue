export const shareVenue = async ({ title, url }) => {
  const shareData = {
    title: title || "Book My Venue",
    text: `Check out ${title || "this venue"} on Book My Venue`,
    url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { method: "share" };
    } catch (error) {
      if (error?.name === "AbortError") {
        return { method: "cancelled" };
      }
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return { method: "clipboard" };
  }

  throw new Error("Sharing is not supported on this device.");
};
