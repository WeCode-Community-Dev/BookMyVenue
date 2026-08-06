from venues.data.venue_categories import VENUE_CATEGORIES


def seed_venue_categories(*, VenueCategory):
    """Create or update venue categories with optional Cloudinary icon URLs."""
    created = 0
    updated = 0

    for entry in VENUE_CATEGORIES:
        name = entry["name"]
        icon_url = entry.get("icon_url") or None

        category, was_created = VenueCategory.objects.get_or_create(
            name=name,
            defaults={"is_active": True, "icon_url": icon_url},
        )
        if was_created:
            created += 1
            continue

        fields_to_update = []
        if icon_url and category.icon_url != icon_url:
            category.icon_url = icon_url
            fields_to_update.append("icon_url")
        if not category.is_active:
            category.is_active = True
            fields_to_update.append("is_active")
        if fields_to_update:
            category.save(update_fields=fields_to_update)
            updated += 1

    return {"created": created, "updated": updated}
