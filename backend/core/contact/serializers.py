from rest_framework import serializers


class ContactMessageSerializer(serializers.Serializer):
    ROLE_GUEST = "guest"
    ROLE_OWNER = "owner"
    ROLE_CHOICES = [ROLE_GUEST, ROLE_OWNER]

    role = serializers.ChoiceField(choices=ROLE_CHOICES)
    full_name = serializers.CharField(max_length=120, trim_whitespace=True)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True, default="")
    city = serializers.CharField(max_length=120, required=False, allow_blank=True, default="")
    venue_name = serializers.CharField(
        max_length=200,
        required=False,
        allow_blank=True,
        default="",
    )
    message = serializers.CharField(max_length=5000, trim_whitespace=True)

    def validate_full_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("This field is required.")
        return value.strip()

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("This field is required.")
        return value.strip()

    def validate(self, attrs):
        role = attrs.get("role")
        city = (attrs.get("city") or "").strip()
        venue_name = (attrs.get("venue_name") or "").strip()

        if role == self.ROLE_GUEST and not city:
            raise serializers.ValidationError({"city": "This field is required."})
        if role == self.ROLE_OWNER and not venue_name:
            raise serializers.ValidationError({"venue_name": "This field is required."})

        attrs["city"] = city
        attrs["venue_name"] = venue_name
        attrs["phone"] = (attrs.get("phone") or "").strip()
        return attrs
