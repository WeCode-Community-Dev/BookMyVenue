export const AMENITIES = [
  'WiFi',
  'Parking',
  'Air Conditioning',
  'Projector & Screen',
  'Catering Services',
  'Sound System',
  'Fully Equipped Kitchen',
  'Stage & Podium',
  '24/7 Security',
  'Swimming Pool',
  'Generator Backup',
  'Wheelchair Access',
  'Valet Parking',
  'Bridal Suite',
  'Locker Rooms',
  'Dance Floor',
  'Open Bar',
  'Photo Booth Area',
  'Outdoor Terrace',
  'Green Room / Dressing Room',
] as const;

export type Amenity = (typeof AMENITIES)[number];
