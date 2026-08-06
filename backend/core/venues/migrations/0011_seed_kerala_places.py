from django.db import migrations

from venues.location_seed import seed_kerala_places


def seed_places(apps, schema_editor):
    District = apps.get_model("venues", "District")
    City = apps.get_model("venues", "City")
    seed_kerala_places(District=District, City=City)


class Migration(migrations.Migration):
    dependencies = [
        ("venues", "0010_add_venue_name_trigram_index"),
    ]

    operations = [
        migrations.RunPython(seed_places, migrations.RunPython.noop),
    ]
