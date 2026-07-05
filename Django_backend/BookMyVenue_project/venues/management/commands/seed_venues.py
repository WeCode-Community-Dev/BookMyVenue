from itertools import cycle

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from venues.models import Amenity, Venue, VenuePackage


AMENITIES = {
    "parking": ("Parking", "bi bi-p-circle"),
    "air-conditioning": ("Air Conditioning", "bi bi-snow"),
    "wi-fi": ("Wi-Fi", "bi bi-wifi"),
    "catering": ("Catering", "bi bi-cup-hot"),
    "stage": ("Stage", "bi bi-mic"),
    "sound-system": ("Sound System", "bi bi-speaker"),
    "projector": ("Projector", "bi bi-camera-video"),
    "decoration": ("Decoration", "bi bi-flower1"),
    "security": ("Security", "bi bi-shield-check"),
}


VENUES = [
    {
        "slug": "grand-orchid-hall",
        "name": "Grand Orchid Hall",
        "venue_type": Venue.VenueType.WEDDING_HALL,
        "description": (
            "A premium event hall in central Kochi with elegant interiors, "
            "a spacious dining area, professional lighting, and flexible seating."
        ),
        "max_capacity": 300,
        "base_price_per_day": "25000.00",
        "address": "MG Road",
        "city": "Kochi",
        "state": "Kerala",
        "postal_code": "682016",
        "latitude": "9.968500",
        "longitude": "76.285900",
        "contact_phone": "+91 90000 10001",
        "amenities": [
            "parking",
            "air-conditioning",
            "wi-fi",
            "catering",
            "stage",
            "sound-system",
            "decoration",
            "security",
        ],
        "featured": True,
        "packages": [
            ("Basic Hall Booking", "Hall, seating, and basic lighting.", "25000.00"),
            ("Wedding Package", "Hall, stage decoration, catering support, and sound system.", "55000.00"),
            ("Corporate Package", "Hall, projector, microphones, Wi-Fi, tea, and snacks.", "35000.00"),
        ],
    },
    {
        "slug": "royal-pearl-auditorium",
        "name": "Royal Pearl Auditorium",
        "venue_type": Venue.VenueType.AUDITORIUM,
        "description": (
            "A large modern auditorium suited to conferences, performances, "
            "award ceremonies, weddings, and community events."
        ),
        "max_capacity": 500,
        "base_price_per_day": "40000.00",
        "address": "Palayam",
        "city": "Thiruvananthapuram",
        "state": "Kerala",
        "postal_code": "695033",
        "latitude": "8.506900",
        "longitude": "76.956900",
        "contact_phone": "+91 90000 10002",
        "amenities": [
            "parking",
            "air-conditioning",
            "wi-fi",
            "sound-system",
            "projector",
            "stage",
            "security",
        ],
        "featured": True,
        "packages": [
            ("Auditorium Booking", "Auditorium, seating, stage, and house lighting.", "40000.00"),
            ("Performance Package", "Auditorium, stage lighting, and sound system.", "60000.00"),
        ],
    },
    {
        "slug": "blue-lagoon-banquet",
        "name": "Blue Lagoon Banquet",
        "venue_type": Venue.VenueType.BANQUET_HALL,
        "description": (
            "An intimate banquet venue for birthdays, engagements, receptions, "
            "and family celebrations with catering support."
        ),
        "max_capacity": 180,
        "base_price_per_day": "18000.00",
        "address": "Mavoor Road",
        "city": "Kozhikode",
        "state": "Kerala",
        "postal_code": "673004",
        "latitude": "11.258800",
        "longitude": "75.780400",
        "contact_phone": "+91 90000 10003",
        "amenities": [
            "parking",
            "air-conditioning",
            "catering",
            "stage",
            "decoration",
        ],
        "featured": True,
        "packages": [
            ("Banquet Hall", "Hall, tables, chairs, and standard lighting.", "18000.00"),
            ("Celebration Package", "Hall, themed decoration, stage, and catering support.", "32000.00"),
        ],
    },
    {
        "slug": "emerald-garden-lawn",
        "name": "Emerald Garden Lawn",
        "venue_type": Venue.VenueType.OUTDOOR_LAWN,
        "description": (
            "A landscaped outdoor lawn for weddings, receptions, exhibitions, "
            "and relaxed evening celebrations."
        ),
        "max_capacity": 400,
        "base_price_per_day": "22000.00",
        "address": "Kumaranalloor",
        "city": "Kottayam",
        "state": "Kerala",
        "postal_code": "686016",
        "latitude": "9.591600",
        "longitude": "76.522200",
        "contact_phone": "+91 90000 10004",
        "amenities": [
            "parking",
            "catering",
            "stage",
            "sound-system",
            "decoration",
            "security",
        ],
        "featured": False,
        "packages": [
            ("Lawn Booking", "Exclusive lawn access with basic lighting.", "22000.00"),
            ("Garden Wedding", "Lawn, stage, decorative lighting, and catering area.", "48000.00"),
        ],
    },
    {
        "slug": "skyline-conference-hall",
        "name": "Skyline Conference Hall",
        "venue_type": Venue.VenueType.CONFERENCE_HALL,
        "description": (
            "A practical city-centre conference hall for workshops, training, "
            "business meetings, presentations, and networking events."
        ),
        "max_capacity": 120,
        "base_price_per_day": "12000.00",
        "address": "Kaloor",
        "city": "Kochi",
        "state": "Kerala",
        "postal_code": "682017",
        "latitude": "9.994200",
        "longitude": "76.291300",
        "contact_phone": "+91 90000 10005",
        "amenities": [
            "parking",
            "air-conditioning",
            "wi-fi",
            "sound-system",
            "projector",
        ],
        "featured": False,
        "packages": [
            ("Meeting Package", "Hall, projector, Wi-Fi, and microphones.", "12000.00"),
            ("Full-day Conference", "Conference setup, AV equipment, tea, and snacks.", "20000.00"),
        ],
    },
    {
        "slug": "coral-crown-wedding-centre",
        "name": "Coral Crown Wedding Centre",
        "venue_type": Venue.VenueType.WEDDING_HALL,
        "description": (
            "A stylish wedding centre with a dedicated dining hall, decorated "
            "stage, guest facilities, and convenient city access."
        ),
        "max_capacity": 250,
        "base_price_per_day": "30000.00",
        "address": "Punkunnam",
        "city": "Thrissur",
        "state": "Kerala",
        "postal_code": "680002",
        "latitude": "10.533300",
        "longitude": "76.201400",
        "contact_phone": "+91 90000 10006",
        "amenities": [
            "parking",
            "air-conditioning",
            "wi-fi",
            "catering",
            "stage",
            "decoration",
            "security",
        ],
        "featured": False,
        "packages": [
            ("Hall Booking", "Wedding hall, dining area, seating, and lighting.", "30000.00"),
            ("Premium Wedding", "Hall, dining, decoration, sound, and catering support.", "65000.00"),
        ],
    },
]


class Command(BaseCommand):
    help = "Create or update the six sample venues used by the frontend."

    @transaction.atomic
    def handle(self, *args, **options):
        user_model = get_user_model()
        owners = list(
            user_model.objects.filter(account_type="venue_owner").order_by("id")
        )
        if not owners:
            raise CommandError("Create at least one venue-owner account first.")

        amenities = {}
        for slug, (name, icon) in AMENITIES.items():
            amenity, _ = Amenity.objects.update_or_create(
                slug=slug,
                defaults={"name": name, "icon": icon},
            )
            amenities[slug] = amenity

        owner_cycle = cycle(owners)
        created_count = 0
        updated_count = 0

        for sample in VENUES:
            owner = next(owner_cycle)
            contact_email = owner.email or f"{owner.username}@example.com"
            venue, created = Venue.objects.update_or_create(
                slug=sample["slug"],
                defaults={
                    "owner": owner,
                    "name": sample["name"],
                    "venue_type": sample["venue_type"],
                    "description": sample["description"],
                    "max_capacity": sample["max_capacity"],
                    "base_price_per_day": sample["base_price_per_day"],
                    "address": sample["address"],
                    "city": sample["city"],
                    "state": sample["state"],
                    "postal_code": sample["postal_code"],
                    "country": "India",
                    "latitude": sample["latitude"],
                    "longitude": sample["longitude"],
                    "contact_phone": sample["contact_phone"],
                    "contact_email": contact_email,
                    "status": Venue.Status.APPROVED,
                    "is_verified": True,
                    "is_featured": sample["featured"],
                },
            )
            venue.amenities.set(amenities[slug] for slug in sample["amenities"])

            package_names = []
            for name, description, price in sample["packages"]:
                VenuePackage.objects.update_or_create(
                    venue=venue,
                    name=name,
                    defaults={
                        "description": description,
                        "price_per_day": price,
                        "is_active": True,
                    },
                )
                package_names.append(name)

            venue.packages.exclude(name__in=package_names).delete()

            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Sample venues ready: {created_count} created, "
                f"{updated_count} updated."
            )
        )
