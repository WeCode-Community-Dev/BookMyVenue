from django.db import models
from django.contrib.auth.models import User
from venues.models import Venue


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    booking_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.venue.name}"