from rest_framework.generics import CreateAPIView

from .models import User
from .Serializers import RegisterSerializer


class RegisterCreateView(CreateAPIView):
    serializer_class = RegisterSerializer

    
