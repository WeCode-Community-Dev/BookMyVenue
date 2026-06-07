from django.db import models
from account.models import User
from locations.models import City

# Create your models here.
class Venue(models.Model):
    owner = models.ForeignKey(User,on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    address = models.TextField()
    description = models.TextField()
    capacity = models.IntegerField()
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    facilities = models.ManyToManyField('Facility')

    def __str__(self):
        return self.name
    
class VenueImage(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='venues/')

    def __str__(self):
        return self.venue.name



class Facility(models.Model):
    name = models.CharField(max_length=225)

    def __str__(self):
        return self.name