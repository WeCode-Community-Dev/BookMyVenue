from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional
from enum import Enum


class UploadFolder(str, Enum):
    PROFILE = "profiles"
    VENUE = "venues"
    TEMP = "temp"


class UploadRequest(BaseModel):
    folder: UploadFolder = Field(
        default=UploadFolder.TEMP, description="Destination folder in Cloudinary"
    )

    entity_id: Optional[str] = Field(
        default=None, description="Optional entity identifier (user_id, venue_id, etc.)"
    )


class UploadedImageResponse(BaseModel):
    public_id: str = Field(..., description="Cloudinary public ID")
    url: HttpUrl = Field(..., description="Secure Cloudinary URL")
    original_filename: Optional[str] = Field(
        None, description="Original uploaded file name"
    )
    width: Optional[int] = Field(None, description="Image width in pixels")
    height: Optional[int] = Field(None, description="Image height in pixels")
    format: Optional[str] = Field(
        None, description="Image format (jpg, png, webp, etc.)"
    )
    bytes: Optional[int] = Field(None, description="Image size in bytes")


# class UploadImagesResponse(BaseModel):
#     success: bool = True
#     message: str = "Images uploaded successfully"
#     data: List[UploadedImageResponse]
