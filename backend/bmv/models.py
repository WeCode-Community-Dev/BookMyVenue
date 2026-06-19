from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class Venues(models.Model):
    venueID=models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    location =  models.CharField(max_length=100)
    capacity =  models.IntegerField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    owner_uid = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Bookings(models.Model):
    bookingID = models.IntegerField(primary_key=True)
    date = models.DateField()
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    bookingTime = models.DateTimeField()
    user_uid = models.CharField(max_length=255)
    owner_uid = models.CharField(max_length=255)
    venue = models.ForeignKey(Venues,on_delete=models.CASCADE)    
    def __str__(self):
        return f"Booking {self.bookingID}"
    
class Payment(models.Model):
    paymentID = models.IntegerField(primary_key=True)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    method = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    booking = models.ForeignKey(Bookings,on_delete=models.CASCADE)
    def __str__(self):
        return f"Payment {self.paymentID}"

