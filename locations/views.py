from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from account.permissions import IsAdminRole
from .models import State, District
from .serializers import StateSerializer,DistrictSerializer


class StateListCreateView(ListCreateAPIView):
    permission_classes = [IsAdminRole]
    queryset = State.objects.all()
    serializer_class = StateSerializer


class StateDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminRole]
    queryset = State.objects.all()
    serializer_class = StateSerializer


class DistrictListCreateView(ListCreateAPIView):
    permission_classes = [IsAdminRole]
    queryset = District.objects.all()
    serializer_class = DistrictSerializer


class DistrictDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminRole]
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
