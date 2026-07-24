const isValidPrice = (price) =>
  price != null && price !== "" && !Number.isNaN(Number(price));

export const formatPrice = (price) => {
  if (!isValidPrice(price)) {
    return { amount: "N/A" };
  }

  return { amount: `₹${Number(price).toLocaleString("en-IN")}` };
};

/** Customer-facing and booking-path price label (slot-based backend). */
export const formatBookingPriceDisplay = (price) => {
  const { amount } = formatPrice(price);
  if (amount === "N/A") return "N/A";
  return `${amount} per slot`;
};

/** @deprecated Use formatBookingPriceDisplay for marketplace display */
export const formatPriceDisplay = (price, _pricingUnit) =>
  formatBookingPriceDisplay(price);
