from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.authentication import InternalAPIKeyAuthentication
from accounts.permissions import IsInternalService
from venues.internal.serializers import VenueRatingUpdateSerializer
from venues.services.rating_service import VenueNotFoundError, VenueRatingService


class InternalVenueRatingView(APIView):
    authentication_classes = [InternalAPIKeyAuthentication]
    permission_classes = [IsInternalService]

    def post(self, request, venue_id):
        serializer = VenueRatingUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            venue = VenueRatingService.update_rating(
                venue_id=venue_id,
                average_rating=serializer.validated_data["average_rating"],
                review_count=serializer.validated_data["review_count"],
            )
        except VenueNotFoundError:
            return Response(
                {"detail": "Venue not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "venue_id": venue.id,
                "average_rating": venue.average_rating,
                "review_count": venue.review_count,
            },
            status=status.HTTP_200_OK,
        )
