from django.db import models
from account.models import User
from locations.models import District,State


# Create your models here.
class Venue(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING"
        ACCEPTED = "ACCEPTED"
        REJECTED = "REJECTED"

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()


    state = models.ForeignKey(State, on_delete=models.PROTECT)
    district = models.ForeignKey(District, on_delete=models.PROTECT)
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)


    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.PENDING,
    )

    created_at = models.DateTimeField(auto_now_add=True)


class VenueMedia(models.Model):
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="media"
    )
    file = models.FileField(upload_to="venues/")



class Service(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="services")
    name = models.CharField(max_length=225)
    capacity = models.IntegerField()
    choice = models.BooleanField()
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)




class Facility(models.Model):
    venue = models.ForeignKey(
        Venue, on_delete=models.CASCADE, related_name="facilities"
    )
    name = models.CharField(max_length=225)
    choice = models.BooleanField()
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)




class Price(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="prices")
    price_verision = models.CharField(max_length=225)
    amount = models.DecimalField(max_digits=10, decimal_places=5)
    choice = models.BooleanField()

