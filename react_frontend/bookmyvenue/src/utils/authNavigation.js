export function getSafeReturnTo(locationState) {
  const returnTo = locationState?.returnTo;

  if (
    typeof returnTo === "string"
    && returnTo.startsWith("/")
    && !returnTo.startsWith("//")
  ) {
    return returnTo;
  }

  return null;
}
