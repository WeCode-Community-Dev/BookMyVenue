export const VENUE_TYPES = [
    {
        value: 'BANQUET_HALL',
        label: 'Banquet Hall',
    },
    {
        value: 'BIRTHDAY_PARTY_HALL',
        label: 'Birthday Party Hall',
    },
    {
        value: 'WEDDING_HALL',
        label: 'Wedding Hall',
    },
    {
        value: 'AUDITORIUM',
        label: 'Auditorium',
    },
    {
        value: 'CONVENTION_CENTER',
        label: 'Convention Center',
    },
    {
        value: 'MEETING_ROOM',
        label: 'Meeting Room',
    },
    {
        value: 'CONFERENCE_HALL',
        label: 'Conference Hall',
    },
    {
        value: 'SEMINAR_HALL',
        label: 'Seminar Hall',
    },
    {
        value: 'TRAINING_ROOM',
        label: 'Training Room',
    },
    {
        value: 'WORKSHOP_SPACE',
        label: 'Workshop Space',
    },
    {
        value: 'CO_WORKING_SPACE',
        label: 'Co-working Space',
    },
    {
        value: 'EVENT_SPACE',
        label: 'Event Space',
    },
    {
        value: 'EXHIBITION_HALL',
        label: 'Exhibition Hall',
    },
    {
        value: 'COMMUNITY_HALL',
        label: 'Community Hall',
    },
    {
        value: 'CLUB_HOUSE',
        label: 'Club House',
    },
    {
        value: 'PARTY_HALL',
        label: 'Party Hall',
    },
    {
        value: 'ROOFTOP_VENUE',
        label: 'Rooftop Venue',
    },
    {
        value: 'OPEN_GROUND',
        label: 'Open Ground',
    },
    {
        value: 'OUTDOOR_VENUE',
        label: 'Outdoor Venue',
    },
    {
        value: 'GARDEN_VENUE',
        label: 'Garden Venue',
    },
    {
        value: 'BEACH_VENUE',
        label: 'Beach Venue',
    },
    {
        value: 'RESORT',
        label: 'Resort',
    },
    {
        value: 'HOTEL',
        label: 'Hotel',
    },
    {
        value: 'HOTEL_BANQUET_HALL',
        label: 'Hotel Banquet Hall',
    },
    {
        value: 'RESTAURANT_PARTY_SPACE',
        label: 'Restaurant Party Space',
    },
    {
        value: 'CAFE_EVENT_SPACE',
        label: 'Cafe Event Space',
    },
    {
        value: 'VILLA',
        label: 'Villa',
    },
    {
        value: 'FARM_HOUSE',
        label: 'Farm House',
    },
    {
        value: 'PRIVATE_HOME',
        label: 'Private Home',
    },
    {
        value: 'SPORTS_VENUE',
        label: 'Sports Venue',
    },
    {
        value: 'TURF',
        label: 'Turf',
    },
    {
        value: 'STADIUM',
        label: 'Stadium',
    },
    {
        value: 'ART_GALLERY',
        label: 'Art Gallery',
    },
    {
        value: 'PHOTO_STUDIO',
        label: 'Photo Studio',
    },
    {
        value: 'FILM_SHOOT_LOCATION',
        label: 'Film Shoot Location',
    },
    {
        value: 'OTHER',
        label: 'Other',
    },
] as const;

export type VenueType = typeof VENUE_TYPES[number]['value'];