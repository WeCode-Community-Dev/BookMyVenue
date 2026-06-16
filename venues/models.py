from django.db import models
from account.models import User
from locations.models import City

# Create your models here.
class Venue(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    City = models.ForeignKey(City,on_delete=models.CASCADE)
    name = models.CharField(max_length=225)
    address = models.TextField()
    # price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
   

class Image(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='images')
    venue_image = models.ImageField(upload_to='media/')


class Service(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=225)
    capacity = models.IntegerField()
    choice = models.BooleanField()
    amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)


    def __str__(self):
        return self.name

class Facility(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='facilities')
    name = models.CharField(max_length=225)
    choice = models.BooleanField()
    amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)


    def __str__(self):
        return self.name

class Price(models.Model):
    venue = models.ForeignKey(Venue,on_delete=models.CASCADE,related_name='prices')
    price_verision = models.CharField(max_length=225)
    amount = models.DecimalField(max_digits=10, decimal_places=5)
    choice = models.BooleanField()

     
    def __str__(self):
        return f"{self.price_verision}-{self.venue.name} - ₹{self.amount}"

   




    