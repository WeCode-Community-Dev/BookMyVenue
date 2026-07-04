from typing import List, Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)


from app.service.cloudinary_service import CloudinaryService
from app.schema.media_upload_scheme import UploadFolder, UploadedImageResponse


class UploadMediaService:

    def upload_images(
        self,
        folder: UploadFolder,
        entity_id: Optional[str],
        files: List[UploadFile],
    ) -> List[UploadedImageResponse]:

        try:

            """
            Generic image upload endpoint.

            Can be used for:
            - Profile Image
            - Venue Cover Image
            - Venue Gallery
            """

            if not files:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No files were uploaded.",
                )

            uploaded_files: List[UploadedImageResponse] = []

            for file in files:

                # Validate content type
                if not file.content_type.startswith("image/"):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"{file.filename} is not a valid image.",
                    )

                # Upload to Cloudinary
                result = CloudinaryService.upload_image(
                    file=file,
                    folder=folder.value,
                    entity_id=entity_id,
                )

                uploaded_files.append(
                    UploadedImageResponse(
                        public_id=result["public_id"],
                        url=result["secure_url"],
                        original_filename=file.filename,
                        width=result.get("width"),
                        height=result.get("height"),
                        format=result.get("format"),
                        bytes=result.get("bytes"),
                    )
                )

            return uploaded_files

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=str(e),
            )


upload_media_service = UploadMediaService()
