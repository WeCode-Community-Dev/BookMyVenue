from rest_framework import serializers


class VenueRatingUpdateSerializer(serializers.Serializer):
    average_rating = serializers.DecimalField(
        max_digits=2,
        decimal_places=1,
        min_value=0,
        max_value=5,
    )
    review_count = serializers.IntegerField(min_value=0)
