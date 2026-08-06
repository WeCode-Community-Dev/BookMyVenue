from django.core.management.base import BaseCommand

from accounts.models import User, UserRole
from venues.category_seed import seed_venue_categories
from venues.location_seed import seed_kerala_places
from venues.models import City, District, VenueCategory


class Command(BaseCommand):
    help = "Seed demo users, venue categories, and Kerala location data for local development."

    def handle(self, *args, **options):
        location_stats = seed_kerala_places(District=District, City=City)
        self.stdout.write(
            self.style.SUCCESS(
                f"Location seed complete. "
                f"{location_stats['created_districts']} district(s), "
                f"{location_stats['created_cities']} city/cities created, "
                f"{location_stats['updated_cities']} city/cities updated with coordinates."
            )
        )

        category_stats = seed_venue_categories(VenueCategory=VenueCategory)
        self.stdout.write(
            self.style.SUCCESS(
                f"Category seed complete. "
                f"{category_stats['created']} created, "
                f"{category_stats['updated']} updated."
            )
        )

        demo_users = [
            {
                "email": "admin@bookmyvenue.local",
                "full_name": "BookMyVenue Admin",
                "role": UserRole.ADMIN,
                "password": "admin12345",
                "is_email_verified": True,
            },
            {
                "email": "user@bookmyvenue.local",
                "full_name": "Demo User",
                "role": UserRole.USER,
                "password": "user12345",
                "is_email_verified": True,
            },
            {
                "email": "venue@bookmyvenue.local",
                "full_name": "Demo Venue Owner",
                "role": UserRole.VENUE,
                "password": "venue12345",
                "is_email_verified": True,
            },
        ]

        created = 0
        for data in demo_users:
            password = data.pop("password")
            email = data["email"]
            user, was_created = User.objects.get_or_create(email=email, defaults=data)
            if was_created:
                user.set_password(password)
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Created user: {email}"))
            else:
                self.stdout.write(f"Skipped existing user: {email}")

        self.stdout.write(
            self.style.SUCCESS(f"Seed complete. {created} user(s) created.")
        )
