from django.contrib import admin
from .models import Venue,Facility,Service,Price

# Register your models here.
admin.site.register(Venue)
admin.site.register(Facility)
admin.site.register(Service)
admin.site.register(Price)


