from django.db import migrations

DISTRICT_CITIES = {
    "Ernakulam": ["Kochi", "Aluva", "Kalamassery", "Perumbavoor"],
    "Thrissur": ["Thrissur", "Guruvayur"],
    "Trivandrum": ["Trivandrum"],
    "Kozhikode": ["Kozhikode"],
}


def seed_districts_and_cities(apps, schema_editor):
    District = apps.get_model("venues", "District")
    City = apps.get_model("venues", "City")

    for district_name, city_names in DISTRICT_CITIES.items():
        district, _ = District.objects.get_or_create(name=district_name)
        for city_name in city_names:
            City.objects.get_or_create(district=district, name=city_name)


class Migration(migrations.Migration):
    dependencies = [
        ("venues", "0003_split_location_into_district_city"),
    ]

    operations = [
        migrations.RunPython(seed_districts_and_cities, migrations.RunPython.noop),
    ]
