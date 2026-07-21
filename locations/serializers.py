from rest_framework.serializers import ModelSerializer

from .models import State, District


class StateSerializer(ModelSerializer):

    class Meta:
        model = State
        fields = "__all__"


class DistrictSerializer(ModelSerializer):

    class Meta:
        model = District
        fields = "__all__"
