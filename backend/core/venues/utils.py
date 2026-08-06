from django.utils.text import slugify


def generate_unique_venue_slug(name: str, *, exclude_pk=None) -> str:
    from venues.models import Venue

    base_slug = slugify(name)[:200] or "venue"
    slug = base_slug
    counter = 1

    while Venue.objects.filter(slug=slug).exclude(pk=exclude_pk).exists():
        suffix = f"-{counter}"
        slug = f"{base_slug[: 200 - len(suffix)]}{suffix}"
        counter += 1

    return slug
