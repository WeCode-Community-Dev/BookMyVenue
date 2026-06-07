from django.db import models

from account.models import User
from venues.models import Venue

class Review(models.Model):

    venue = models.ForeignKey(Venue,on_delete=models.CASCADE)
    customer = models.ForeignKey(User,on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer} - {self.venue}"
