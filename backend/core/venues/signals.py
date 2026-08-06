from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from venues.models import City, District, VenueCategory
from venues.services.category_cache_service import CategoryCacheService
from venues.services.location_group_cache_service import LocationGroupCacheService


@receiver(post_save, sender=VenueCategory)
@receiver(post_delete, sender=VenueCategory)
def invalidate_venue_category_cache(sender, **kwargs):
    CategoryCacheService.invalidate()


@receiver(post_save, sender=District)
@receiver(post_delete, sender=District)
@receiver(post_save, sender=City)
@receiver(post_delete, sender=City)
def invalidate_venue_location_group_cache(sender, **kwargs):
    LocationGroupCacheService.invalidate()
