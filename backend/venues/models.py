from django.db import models


class Venue(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    capacity = models.PositiveIntegerField(default=1)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="venues/", blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
