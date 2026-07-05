from rest_framework import serializers
from ..models import User, UserProfile,OwnerProfile
from django.db import transaction

class UserSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True)
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "fullname",
            "email",
            "password",
            "account_type",
            "terms_privacy",
            "address",
            "phone_number",
        ]

    def validate_terms_privacy(self,value):
        if value is not True:
            raise serializers.ValidationError("You must accept terms and privacy policy.")
        return value
    
    @transaction.atomic
    def create(self, validated_data):
        address = validated_data.pop("address", "")
        
        phone_number = validated_data.pop("phone_number", "")

        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if user.account_type == "venue_owner":
            OwnerProfile.objects.create(
                user=user,
                address=address,
                phone_number=phone_number,
            )
        elif user.account_type == "venue_user":
            UserProfile.objects.create(
                user=user,
                address=address,
                phone_number=phone_number,
            )

        return user