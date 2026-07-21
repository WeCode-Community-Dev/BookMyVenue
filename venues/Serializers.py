from rest_framework.serializers import ModelSerializer

from .models import Venue,Service,Facility,Price,VenueMedia


class ServiceSerializer(ModelSerializer):

    class Meta:
        model = Service
        fields = '__all__'

class FacilitySerializer(ModelSerializer):

    class Meta:
        model = Service
        fields = '__all__'

class VenueMediaSerializer(ModelSerializer):

    class Meta:
        model = Service
        fields = '__all__'

class PriceSerializer(ModelSerializer):

    class Meta:
        model = Service
        fields = '__all__'


class VenueSerializer(ModelSerializer):
    
    media    = VenueMediaSerializer(many=True, read_only=True)
    services   = ServiceSerializer(many=True, read_only=True)
    facilities = FacilitySerializer(many=True, read_only=True)
    prices     = PriceSerializer(many=True, read_only=True)

    class Meta:
        model = Venue
        fields = '__all__'