from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from contact.serializers import ContactMessageSerializer
from contact.services.contact_service import ContactService


class ContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ContactService.submit_message(payload=serializer.validated_data)

        return Response(
            {"message": "Your message has been sent. We'll get back to you soon."},
            status=status.HTTP_201_CREATED,
        )
