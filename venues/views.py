from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView

from .Serializers import VenueSerializer
from .models import Venue


# Create your views here.

class VenueListCreateView(ListCreateAPIView):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer

class VenueDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer

class VenueMediaListCreateView(ListCreateAPIView):
    pass
