from django.db import migrations

from venues.category_seed import seed_venue_categories


def seed_categories(apps, schema_editor):
    VenueCategory = apps.get_model("venues", "VenueCategory")
    seed_venue_categories(VenueCategory=VenueCategory)


class Migration(migrations.Migration):
    dependencies = [
        ("venues", "0011_seed_kerala_places"),
    ]

    operations = [
        migrations.RunPython(seed_categories, migrations.RunPython.noop),
    ]
