const STORAGE_KEY = "bmv_saved_venues";

const readSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isVenueSaved = (venueId) => {
  if (!venueId) return false;
  return readSaved().includes(venueId);
};

export const toggleSavedVenue = (venueId) => {
  if (!venueId) return false;

  const saved = readSaved();
  const isSaved = saved.includes(venueId);
  const next = isSaved
    ? saved.filter((id) => id !== venueId)
    : [...saved, venueId];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return !isSaved;
};
