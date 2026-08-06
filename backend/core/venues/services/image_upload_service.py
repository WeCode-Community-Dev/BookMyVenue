import logging
import os
import uuid

import cloudinary
import cloudinary.uploader
from django.conf import settings
from django.core.files.storage import default_storage

logger = logging.getLogger(__name__)


class ImageUploadError(Exception):
    pass


class ImageUploadService:
    VENUE_IMAGE_FOLDER = "venue_images"

    @staticmethod
    def is_cloudinary_configured() -> bool:
        return bool(
            settings.CLOUDINARY_CLOUD_NAME
            and settings.CLOUDINARY_API_KEY
            and settings.CLOUDINARY_API_SECRET
        )

    @classmethod
    def upload_venue_image(cls, file, *, request=None) -> dict:
        if cls.is_cloudinary_configured():
            return cls._upload_to_cloudinary(file)
        return cls._upload_to_local(file, request=request)

    @classmethod
    def _configure_cloudinary(cls) -> None:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )

    @classmethod
    def _upload_to_cloudinary(cls, file) -> dict:
        cls._configure_cloudinary()
        public_id = uuid.uuid4().hex

        try:
            result = cloudinary.uploader.upload(
                file,
                folder=cls.VENUE_IMAGE_FOLDER,
                public_id=public_id,
                overwrite=False,
                resource_type="image",
            )
        except Exception as exc:
            logger.exception("Cloudinary upload failed")
            raise ImageUploadError(
                "Failed to upload image. Please try again.",
            ) from exc

        return {
            "public_id": result["public_id"],
            "url": result.get("url"),
            "secure_url": result["secure_url"],
        }

    @classmethod
    def _upload_to_local(cls, file, *, request=None) -> dict:
        extension = os.path.splitext(file.name)[1] or ".jpg"
        filename = f"{cls.VENUE_IMAGE_FOLDER}/{uuid.uuid4().hex}{extension}"
        saved_path = default_storage.save(filename, file)

        if request is not None:
            image_url = request.build_absolute_uri(
                settings.MEDIA_URL + saved_path.replace("\\", "/"),
            )
        else:
            image_url = settings.MEDIA_URL + saved_path.replace("\\", "/")

        return {
            "public_id": saved_path,
            "url": image_url,
            "secure_url": image_url,
        }
