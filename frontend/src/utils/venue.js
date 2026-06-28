const resolveOwnerRecord = (venue) => {
  if (!venue) return null;

  if (venue.owner?.name?.trim()) return venue.owner;
  if (venue.provider?.name?.trim()) return venue.provider;

  const { ownerId } = venue;
  if (ownerId && typeof ownerId === "object" && ownerId.name?.trim()) {
    return ownerId;
  }

  return null;
};

export const getVenueProvider = (venue) => {
  const owner = resolveOwnerRecord(venue);
  if (!owner?.name?.trim()) return null;

  const trustIndicators = [];

  if (owner.isEmailVerified === true || owner.isVerified === true) {
    trustIndicators.push({ key: "verified", label: "Verified provider" });
  }

  if (owner.isActive === true) {
    trustIndicators.push({ key: "active-host", label: "Active host" });
  }

  return {
    name: owner.name.trim(),
    initial: owner.name.trim().charAt(0).toUpperCase(),
    profileImage: owner.profileImage || null,
    trustIndicators,
  };
};

export const formatVenueLocation = (venue) => {
  if (!venue) return "";

  const fullAddress = [venue.address, venue.city, venue.state, venue.pincode]
    .filter(Boolean)
    .join(", ");

  if (fullAddress) return fullAddress;

  const region = [venue.city, venue.state].filter(Boolean).join(", ");
  return region ? `${region}, India` : "Location not specified";
};

export const getVenueCoverUrl = (venue) => {
  if (!venue) return null;
  return venue.coverImage?.url || venue.images?.[0]?.url || null;
};

export const getVenueImages = (venue) => {
  if (!venue) return [];

  const urls = [];

  const addUrl = (url) => {
    if (url && !urls.includes(url)) {
      urls.push(url);
    }
  };

  addUrl(venue.coverImage?.url);
  (venue.images ?? []).forEach((image) => addUrl(image?.url));

  return urls;
};
