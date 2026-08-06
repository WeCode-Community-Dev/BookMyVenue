import django.contrib.postgres.indexes
from django.contrib.postgres.operations import TrigramExtension
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("venues", "0009_add_venue_google_maps_url"),
    ]

    operations = [
        TrigramExtension(),
        migrations.AddIndex(
            model_name="venue",
            index=django.contrib.postgres.indexes.GinIndex(
                fields=["name"],
                name="ix_venues_name_trgm",
                opclasses=["gin_trgm_ops"],
            ),
        ),
    ]
