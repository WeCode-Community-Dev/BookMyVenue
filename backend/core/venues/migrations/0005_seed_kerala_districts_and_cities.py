from django.db import migrations

from venues.data.kerala_places import KERALA_PLACES

LEGACY_DISTRICT_MAP = {
    "Trivandrum": "Thiruvananthapuram",
}

LEGACY_CITY_MAP = {
    "Trivandrum": "Thiruvananthapuram",
}


def seed_kerala_districts_and_cities(apps, schema_editor):
    District = apps.get_model("venues", "District")
    City = apps.get_model("venues", "City")

    for entry in KERALA_PLACES:
        district, _ = District.objects.get_or_create(name=entry["district"])
        City.objects.get_or_create(district=district, name=entry["name"])


def merge_legacy_districts(apps, schema_editor):
    District = apps.get_model("venues", "District")
    City = apps.get_model("venues", "City")
    Venue = apps.get_model("venues", "Venue")

    for old_district_name, new_district_name in LEGACY_DISTRICT_MAP.items():
        old_district = District.objects.filter(name=old_district_name).first()
        if not old_district:
            continue

        new_district, _ = District.objects.get_or_create(name=new_district_name)

        for old_city in City.objects.filter(district=old_district):
            new_city_name = LEGACY_CITY_MAP.get(old_city.name, old_city.name)
            new_city, _ = City.objects.get_or_create(
                district=new_district,
                name=new_city_name,
            )
            Venue.objects.filter(city=old_city).update(city=new_city)
            if old_city.pk != new_city.pk:
                old_city.delete()

        old_district.delete()


class Migration(migrations.Migration):
    dependencies = [
        ("venues", "0004_seed_districts_and_cities"),
    ]

    operations = [
        migrations.RunPython(seed_kerala_districts_and_cities, migrations.RunPython.noop),
        migrations.RunPython(merge_legacy_districts, migrations.RunPython.noop),
    ]
