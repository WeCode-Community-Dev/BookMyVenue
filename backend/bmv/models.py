from django.db import models

class User(models.Model):
    userID = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phNo= models.CharField(max_length=15)
    password=models.CharField(max_length=100)

class Owner(models.Model):
    ownerID = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phNo= models.CharField(max_length=15)
    password=models.CharField(max_length=100)

class Venues(models.Model):
    venueID=models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    location =  models.CharField(max_length=100)
    capacity =  models.IntegerField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    owner = models.ForeignKey(Owner,on_delete=models.CASCADE)

class Bookings(models.Model):
    bookingID = models.IntegerField(primary_key=True)
    date = models.DateField()
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    bookingTime = models.DateTimeField()
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    owner = models.ForeignKey(Owner,on_delete=models.CASCADE)
    venue = models.ForeignKey(Venues,on_delete=models.CASCADE)

class Payment(models.Model):
    paymentID = models.IntegerField(primary_key=True)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    method = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    booking = models.ForeignKey(Bookings,on_delete=models.CASCADE)

class Admin(models.Model):
    adminID = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password=models.CharField(max_length=100)
