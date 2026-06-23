from rest_framework.generics import CreateAPIView

from .models import State
from .serializers import StateSerializer


class StateCreateView(CreateAPIView):
    queryset = State
    serializer_class = StateSerializer
