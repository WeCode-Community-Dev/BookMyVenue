from typing import Annotated, List, Optional

from fastapi import (
    APIRouter,
    File,
    Form,
    Request,
    UploadFile,
    status,
)


from app.schema.base_schema import SuccessResponse
from app.schema.media_upload_scheme import UploadFolder, UploadedImageResponse
from app.service.upload_media_service import upload_media_service

router = APIRouter()


@router.post(
    "/images",
    response_model=SuccessResponse[List[UploadedImageResponse]],
    status_code=status.HTTP_201_CREATED,
)
def upload_images(
    # TODO(Jiyad): Add token to validate this later
    # folder: UploadFolder = Form(UploadFolder.TEMP),
    # entity_id: Optional[str] = Form(None),
    # files: list[UploadFile] = File(...),
    files: Annotated[list[UploadFile], File(...)],
    folder: Annotated[UploadFolder, Form()] = UploadFolder.TEMP,
    entity_id: Annotated[str | None, Form()] = None,
):

    result = upload_media_service.upload_images(
        folder=folder,
        entity_id=entity_id,
        files=files,
    )

    return SuccessResponse(message="Image uploaded Successfully", data=result)


@router.post("/single")
def upload_single(file: UploadFile = File(...)):
    return {"filename": file.filename}
