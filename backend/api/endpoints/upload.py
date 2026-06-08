import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from core.minio_client import (
    minio_client,
    MINIO_BUCKET_NAME,
    MINIO_PUBLIC_ENDPOINT,
    MINIO_SECURE,
)
from models.user import User
from api.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter()


class UploadResponse(BaseModel):
    url: str


@router.post("/", response_model=UploadResponse)
async def upload_image(
    file: UploadFile = File(...), current_user: User = Depends(get_current_user)
):
    # Strict extension validation
    allowed_extensions = {"jpg", "jpeg", "png", "webp"}
    file_extension = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Invalid file extension. Allowed: {', '.join(allowed_extensions)}")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    object_name = f"{uuid.uuid4()}.{file_extension}"

    try:
        # Read the file to get its size, enforce 5MB limit
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
        contents = await file.read()
        file_size = len(contents)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File size exceeds the 5MB limit")

        # Reset file cursor
        await file.seek(0)

        minio_client.put_object(
            bucket_name=MINIO_BUCKET_NAME,
            object_name=object_name,
            data=file.file,
            length=file_size,
            content_type=file.content_type,
        )

        protocol = "https" if MINIO_SECURE else "http"
        # URL format: http://127.0.0.1:9000/bookmyvenue-images/object_name.jpg
        url = f"{protocol}://{MINIO_PUBLIC_ENDPOINT}/{MINIO_BUCKET_NAME}/{object_name}"

        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
