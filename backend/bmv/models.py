from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('owner', 'Owner'),
    )
    role = models.CharField(max_length=10,choices=ROLE_CHOICES)
    phNo= models.CharField(max_length=15)

    def __str__(self):
        return self.username

class Venues(models.Model):
    venueID=models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    location =  models.CharField(max_length=100)
    capacity =  models.IntegerField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE,
                              limit_choices_to={'role':'owner'}
                              )
    def __str__(self):
        return self.name

class Bookings(models.Model):
    bookingID = models.IntegerField(primary_key=True)
    date = models.DateField()
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    bookingTime = models.DateTimeField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE,
                              related_name='bookings',
                              limit_choices_to={'role':'owner'}

    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE,
                              related_name='owner_bookings',
                              limit_choices_to={'role':'owner'})
    venue = models.ForeignKey(Venues,on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Booking {self.bookingID} - {self.user}"
    
class Payment(models.Model):
    paymentID = models.IntegerField(primary_key=True)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    method = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    booking = models.ForeignKey(Bookings,on_delete=models.CASCADE)
    def __str__(self):
        return f"Payment {self.paymentID} - {self.status}"

