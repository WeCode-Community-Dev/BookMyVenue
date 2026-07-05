from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class CurrentUserAPITests(APITestCase):
    def test_returns_fullname_for_authenticated_user(self):
        user = get_user_model().objects.create_user(
            username="alan",
            fullname="Alan Thomas",
            email="alan@example.com",
            password="test-password",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get(reverse("me"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "alan")
        self.assertEqual(response.data["fullname"], "Alan Thomas")
