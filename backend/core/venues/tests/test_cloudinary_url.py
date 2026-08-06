from django.test import TestCase

from venues.cloudinary_url import CloudinaryImagePreset, transform_cloudinary_url
from venues.models import VenueCategory, VenueImage
from venues.serializers import VenueCategorySerializer, VenueImageSerializer


class TransformCloudinaryUrlTests(TestCase):
    def test_returns_none_and_empty_unchanged(self):
        self.assertIsNone(
            transform_cloudinary_url(None, CloudinaryImagePreset.LIST_COVER),
        )
        self.assertEqual(
            transform_cloudinary_url("", CloudinaryImagePreset.LIST_COVER),
            "",
        )

    def test_leaves_non_cloudinary_urls_unchanged(self):
        url = "https://example.com/images/cover.jpg"
        self.assertEqual(
            transform_cloudinary_url(url, CloudinaryImagePreset.LIST_COVER),
            url,
        )

    def test_leaves_local_media_urls_unchanged(self):
        url = "/media/venue_images/cover.jpg"
        self.assertEqual(
            transform_cloudinary_url(url, CloudinaryImagePreset.DETAIL_HERO),
            url,
        )

    def test_inserts_transform_before_versioned_public_id(self):
        url = (
            "https://res.cloudinary.com/demo/image/upload/"
            "v1783536632/venue_images/abc123.jpg"
        )
        expected = (
            "https://res.cloudinary.com/demo/image/upload/"
            "w_800,h_520,c_fill,f_auto,q_auto/"
            "v1783536632/venue_images/abc123.jpg"
        )
        self.assertEqual(
            transform_cloudinary_url(url, CloudinaryImagePreset.LIST_COVER),
            expected,
        )

    def test_inserts_transform_when_folder_has_underscore(self):
        url = (
            "https://res.cloudinary.com/demo/image/upload/"
            "venue_images/abc123.jpg"
        )
        expected = (
            "https://res.cloudinary.com/demo/image/upload/"
            "w_480,h_288,c_fill,f_auto,q_auto/"
            "venue_images/abc123.jpg"
        )
        self.assertEqual(
            transform_cloudinary_url(url, CloudinaryImagePreset.CATEGORY_ICON),
            expected,
        )

    def test_replaces_existing_transform_segment(self):
        url = (
            "https://res.cloudinary.com/demo/image/upload/"
            "w_100,h_100,c_fill/"
            "v1/venue_images/abc123.jpg"
        )
        expected = (
            "https://res.cloudinary.com/demo/image/upload/"
            "w_1600,h_900,c_fill,f_auto,q_auto/"
            "v1/venue_images/abc123.jpg"
        )
        self.assertEqual(
            transform_cloudinary_url(url, CloudinaryImagePreset.DETAIL_HERO),
            expected,
        )

    def test_preserves_query_and_fragment(self):
        url = (
            "https://res.cloudinary.com/demo/image/upload/"
            "v1/venue_images/abc123.jpg?foo=1#bar"
        )
        result = transform_cloudinary_url(url, CloudinaryImagePreset.LIST_COVER)
        self.assertTrue(result.endswith("?foo=1#bar"))
        self.assertIn("w_800,h_520,c_fill,f_auto,q_auto/", result)


class SerializerCloudinaryTransformTests(TestCase):
    def test_category_serializer_transforms_icon_url(self):
        category = VenueCategory(
            name="Turf",
            icon_url=(
                "https://res.cloudinary.com/demo/image/upload/"
                "v1/venue_images/turf.jpg"
            ),
        )
        data = VenueCategorySerializer(category).data
        self.assertEqual(
            data["icon_url"],
            "https://res.cloudinary.com/demo/image/upload/"
            "w_480,h_288,c_fill,f_auto,q_auto/"
            "v1/venue_images/turf.jpg",
        )

    def test_category_serializer_leaves_non_cloudinary_icon(self):
        category = VenueCategory(
            name="Local",
            icon_url="/media/icons/local.png",
        )
        data = VenueCategorySerializer(category).data
        self.assertEqual(data["icon_url"], "/media/icons/local.png")

    def test_venue_image_serializer_transforms_image_url(self):
        image = VenueImage(
            image_url=(
                "https://res.cloudinary.com/demo/image/upload/"
                "v1/venue_images/hall.jpg"
            ),
            is_cover=True,
            sort_order=0,
        )
        data = VenueImageSerializer(image).data
        self.assertEqual(
            data["image_url"],
            "https://res.cloudinary.com/demo/image/upload/"
            "w_1600,h_900,c_fill,f_auto,q_auto/"
            "v1/venue_images/hall.jpg",
        )
