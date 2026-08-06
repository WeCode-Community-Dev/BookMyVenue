import django.db.models.deletion
from django.db import migrations, models


def migrate_locations_to_districts_and_cities(apps, schema_editor):
    Location = apps.get_model("venues", "Location")
    District = apps.get_model("venues", "District")
    City = apps.get_model("venues", "City")
    Venue = apps.get_model("venues", "Venue")

    location_to_city = {}

    for location in Location.objects.all().order_by("id"):
        district, _ = District.objects.get_or_create(name=location.district)
        city, _ = City.objects.get_or_create(
            district=district,
            name=location.city,
        )
        location_to_city[location.id] = city.id

    for venue in Venue.objects.all():
        city_id = location_to_city.get(venue.location_id)
        if city_id is not None:
            venue.city_id = city_id
            venue.save(update_fields=["city_id"])


class Migration(migrations.Migration):
    dependencies = [
        ("venues", "0002_add_venue_slug"),
    ]

    operations = [
        migrations.CreateModel(
            name="District",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100, unique=True)),
            ],
            options={
                "db_table": "districts",
            },
        ),
        migrations.CreateModel(
            name="City",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "district",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="cities",
                        to="venues.district",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "cities",
                "db_table": "cities",
            },
        ),
        migrations.AddConstraint(
            model_name="city",
            constraint=models.UniqueConstraint(
                fields=("district", "name"),
                name="uq_cities_district_name",
            ),
        ),
        migrations.AddIndex(
            model_name="city",
            index=models.Index(fields=["district"], name="ix_cities_district_id"),
        ),
        migrations.AddField(
            model_name="venue",
            name="city",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="venues",
                to="venues.city",
            ),
        ),
        migrations.RunPython(
            migrate_locations_to_districts_and_cities,
            migrations.RunPython.noop,
        ),
        migrations.RemoveIndex(
            model_name="venue",
            name="ix_venues_location_id",
        ),
        migrations.RemoveIndex(
            model_name="venue",
            name="ix_venues_location_status",
        ),
        migrations.RemoveField(
            model_name="venue",
            name="location",
        ),
        migrations.AlterField(
            model_name="venue",
            name="city",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="venues",
                to="venues.city",
            ),
        ),
        migrations.AddIndex(
            model_name="venue",
            index=models.Index(fields=["city"], name="ix_venues_city_id"),
        ),
        migrations.AddIndex(
            model_name="venue",
            index=models.Index(
                fields=["city", "status"],
                name="ix_venues_city_status",
            ),
        ),
        migrations.DeleteModel(
            name="Location",
        ),
    ]
