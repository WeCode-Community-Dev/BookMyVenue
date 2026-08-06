from django.contrib.gis.geos import Point

from venues.data.kerala_places import KERALA_PLACES


def seed_kerala_places(*, District, City):
    """Create or update Kerala districts and cities with WGS84 point locations."""
    created_districts = 0
    created_cities = 0
    updated_cities = 0

    for entry in KERALA_PLACES:
        district, district_created = District.objects.get_or_create(
            name=entry["district"],
        )
        if district_created:
            created_districts += 1

        location = Point(entry["longitude"], entry["latitude"], srid=4326)
        city, city_created = City.objects.get_or_create(
            district=district,
            name=entry["name"],
            defaults={"location": location},
        )
        if city_created:
            created_cities += 1
        else:
            city.location = location
            city.save(update_fields=["location"])
            updated_cities += 1

    return {
        "created_districts": created_districts,
        "created_cities": created_cities,
        "updated_cities": updated_cities,
    }
