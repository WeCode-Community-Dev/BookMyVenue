from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from .models import User
from .Serializers import RegisterSerializer,LoginUserSerializer


class RegisterCreateView(CreateAPIView):
    serializer_class = RegisterSerializer
    queryset = User.objects.all()    

class LoginUserView(APIView):

    def post(self, request):
        log_serializer = LoginUserSerializer(data=request.data)
        print(LoginUserSerializer(data=request.data))

        if log_serializer.is_valid():
            return Response(
                {
                    "access": log_serializer.validated_data["access"],
                    "refresh": log_serializer.validated_data["refresh"],
                    "username": log_serializer.validated_data["user"].username,
                },
                status=status.HTTP_200_OK,
            )
        return Response(log_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

 

   

    
