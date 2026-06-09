from rest_framework.serializers import ModelSerializer

from .models import State,District,City

class StateSerializer(ModelSerializer):

    class Meta:
        model = State
        fields = '__all__'