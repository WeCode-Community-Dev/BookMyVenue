from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response  # type: ignore[import]
from rest_framework.views import APIView

from .serializers import UserSerializers


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializers
    permission_classes = [AllowAny]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "fullname": user.fullname,
            "email": user.email,
            "account_type": user.account_type,
        })
