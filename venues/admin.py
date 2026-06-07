from django.contrib import admin
from .models import Venue, VenueImage,Facility

# Register your models here.
admin.site.register(Venue)
admin.site.register(Facility)
admin.site.register(VenueImage)

