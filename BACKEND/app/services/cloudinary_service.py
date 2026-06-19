import cloudinary
import os
from cloudinary.uploader import upload
from fastapi import HTTPException, status, UploadFile
from app.core.config import settings
from typing import List

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

async def upload_images(    
    images: List[UploadFile],
    venue_id: int 
):
    try:

        folder = settings.CLOUDINARY_FOLDER_NAME

        uploaded_files = []

        for image in images:
            result = upload(
                image.file,
                folder=f"{folder}/{venue_id}"
            )

            uploaded_files.append({
                "file_name": image.filename,
                "url": result["secure_url"],
                "public_id": result["public_id"]
            })

        return uploaded_files

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading image: {e}"
        )