# app/services/cloudinary_service.py

import uuid
from typing import Optional

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

from app.core.config import settings


class CloudinaryService:
    """
    Reusable Cloudinary upload service.
    """

    # Configure Cloudinary once
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )

    @staticmethod
    def upload_image(
        file: UploadFile,
        folder: str,
        entity_id: Optional[str] = None,
    ) -> dict:
        """
        Upload an image to Cloudinary.

        Args:
            file: FastAPI UploadFile
            folder: Cloudinary folder (profiles, venues, etc.)
            entity_id: Optional entity identifier

        Returns:
            Cloudinary upload response (simplified)
        """

        try:
            # Build folder path
            if entity_id:
                upload_folder = f"{folder}/{entity_id}"
            else:
                upload_folder = folder

            # Generate unique public id
            public_id = str(uuid.uuid4())

            result = cloudinary.uploader.upload(
                file.file,
                folder=upload_folder,
                public_id=public_id,
                overwrite=False,
                resource_type="image",
                quality="auto",
                fetch_format="auto",
            )

            return {
                "public_id": result["public_id"],
                "secure_url": result["secure_url"],
                "width": result.get("width"),
                "height": result.get("height"),
                "format": result.get("format"),
                "bytes": result.get("bytes"),
            }

        finally:
            file.close()
