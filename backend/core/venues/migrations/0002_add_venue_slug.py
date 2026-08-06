from django.db import migrations, models
from django.utils.text import slugify


def populate_venue_slugs(apps, schema_editor):
    Venue = apps.get_model("venues", "Venue")
    used_slugs = set()

    for venue in Venue.objects.all().order_by("id"):
        base_slug = slugify(venue.name)[:200] or "venue"
        slug = base_slug
        counter = 1

        while slug in used_slugs:
            suffix = f"-{counter}"
            slug = f"{base_slug[: 200 - len(suffix)]}{suffix}"
            counter += 1

        used_slugs.add(slug)
        venue.slug = slug
        venue.save(update_fields=["slug"])


class Migration(migrations.Migration):
    dependencies = [
        ("venues", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="venue",
            name="slug",
            field=models.SlugField(max_length=220, null=True),
        ),
        migrations.RunPython(populate_venue_slugs, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="venue",
            name="slug",
            field=models.SlugField(max_length=220),
        ),
        migrations.AddConstraint(
            model_name="venue",
            constraint=models.UniqueConstraint(fields=["slug"], name="unique_venue_slug"),
        ),
    ]
