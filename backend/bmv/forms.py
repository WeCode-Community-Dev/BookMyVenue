from django import forms
from .models import Venues

class VenueForm(forms.ModelForm):
    class Meta:
        model = Venues
        fields = ['name','category','location','capacity','price']