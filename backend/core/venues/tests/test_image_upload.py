from io import BytesIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from accounts.models import UserRole

User = get_user_model()


class ImageUploadViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="owner@example.com",
            password="password123",
            full_name="Venue Owner",
            role=UserRole.VENUE,
        )
        self.client.force_authenticate(user=self.user)
        self.image = SimpleUploadedFile(
            "venue.jpg",
            BytesIO(b"fake-image-data").getvalue(),
            content_type="image/jpeg",
        )

    @override_settings(
        CLOUDINARY_CLOUD_NAME="test-cloud",
        CLOUDINARY_API_KEY="test-key",
        CLOUDINARY_API_SECRET="test-secret",
    )
    @patch("venues.services.image_upload_service.cloudinary.uploader.upload")
    def test_uploads_to_cloudinary_when_configured(self, mock_upload):
        mock_upload.return_value = {
            "public_id": "venue_images/abc123",
            "url": "http://res.cloudinary.com/test-cloud/image/upload/v1/venue_images/abc123.jpg",
            "secure_url": "https://res.cloudinary.com/test-cloud/image/upload/v1/venue_images/abc123.jpg",
        }

        response = self.client.post(
            "/uploads/image",
            {"file": self.image},
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["public_id"], "venue_images/abc123")
        self.assertTrue(response.data["secure_url"].startswith("https://res.cloudinary.com/"))
        mock_upload.assert_called_once()

    @override_settings(
        CLOUDINARY_CLOUD_NAME="",
        CLOUDINARY_API_KEY="",
        CLOUDINARY_API_SECRET="",
    )
    def test_falls_back_to_local_storage_when_cloudinary_not_configured(self):
        response = self.client.post(
            "/uploads/image",
            {"file": self.image},
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("/media/venue_images/", response.data["secure_url"])
        self.assertEqual(response.data["public_id"], response.data["secure_url"].split("/media/")[-1])

    def test_rejects_non_image_files(self):
        file = SimpleUploadedFile(
            "notes.txt",
            b"not an image",
            content_type="text/plain",
        )

        response = self.client.post(
            "/uploads/image",
            {"file": file},
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "Only image files are allowed.")
