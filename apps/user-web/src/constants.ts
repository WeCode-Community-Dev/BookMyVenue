export const CATEGORIES: { label: string; icon: string; venue_type: string }[] = [
  { label: 'Wedding Halls',    icon: '💒', venue_type: 'wedding_hall' },
  { label: 'Banquet Halls',    icon: '🏛️', venue_type: 'banquet_hall' },
  { label: 'Event Spaces',     icon: '🎉', venue_type: 'event_space' },
  { label: 'Rooftops',         icon: '🌆', venue_type: 'rooftop' },
  { label: 'Conference Rooms', icon: '🏢', venue_type: 'conference_room' },
  { label: 'Outdoor Lawns',    icon: '🌿', venue_type: 'lawn' },
]

export const VENUE_TYPE_LABELS: Record<string, string> = {
  banquet_hall:    'Banquet Hall',
  wedding_hall:    'Wedding Hall',
  auditorium:      'Auditorium',
  conference_room: 'Conference Room',
  club:            'Club',
  rooftop:         'Rooftop',
  resort:          'Resort',
  lawn:            'Lawn',
  event_space:     'Event Space',
  meeting_room:    'Meeting Room',
}

export const TRUST_STATS = [
  { stat: '500+', label: 'Verified venues' },
  { stat: '12,000+', label: 'Bookings completed' },
  { stat: '4.8 ★', label: 'Average rating' },
]
