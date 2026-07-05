from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):  # to store data when user signup
    ACCOUNT_TYPES = [
        ("venue_user", "Venue User"),
        ("venue_owner","Venue Owner")
    ]
    account_type = models.CharField(
        max_length = 20,
        choices = ACCOUNT_TYPES,
        default = "venue_user"
    )
    fullname = models.CharField(max_length=150,blank=True)

    terms_privacy = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.username

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.TextField(blank=True,max_length=300)
    phone_number = models.CharField(max_length=20, blank=True)

     
    def __str__(self) -> str:
        return self.user.username
    
class OwnerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.TextField(blank=True,max_length=300)
    phone_number = models.CharField(max_length=20, blank=True)

    def __str__(self) -> str:
        return self.user.username
    
  



    

