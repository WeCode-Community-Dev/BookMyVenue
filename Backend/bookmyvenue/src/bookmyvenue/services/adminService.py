from typing import List, Optional
import uuid

from fastapi import File, HTTPException, UploadFile, status
import structlog
from sqlalchemy.orm import Session


from src.bookmyvenue.schema.common.common import ImageKitVenueUrls
from src.bookmyvenue.utils.image_kit import imagekit
from src.bookmyvenue.schema.admin import admin
from src.bookmyvenue.models.owners import Owner
from src.bookmyvenue.models.user import User
from src.bookmyvenue.repositories.users.repository import userRepository
from src.bookmyvenue.repositories.owner.repository import ownerRepository
from src.bookmyvenue.repositories.admin.repository import adminRepository
from src.bookmyvenue.schema.user import user
from src.bookmyvenue.schema.owner import owner


logger = structlog.get_logger()

class AdminService:
    def add_category(self, db:Session, categories: List[admin.CategorySchema]) :
        #check if that same category exists , if so raise error

        existing_categories = adminRepository.check_the_existing_category(db, categories)  
        if existing_categories:
            logger.error("some of the categories already exists" ,exisiting_categories=existing_categories)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="some of the categories already exists")
        
        return adminRepository.add_the_categories(db, categories)
    
    def add_amenity(self, db:Session, amenities: List[admin.AmenitySchema]):
        #check if that same category exists , if so raise error

        existing_categories = adminRepository.check_the_existing_amenity(db, amenities)  
        if existing_categories:
            logger.error("some of the amenities already exists" ,exisiting_categories=existing_categories)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="some of the amenities already exists")
        
        return adminRepository.add_the_amenities(db, amenities)
    
    async def upload_venue_images(self,cover_image: UploadFile = File(...),gallery: List[UploadFile] = File(...)) -> ImageKitVenueUrls:
        cover_image_url = ''
        gallery_urls = []
        #First we upload the images to the imagekit storage and then return the urls to the route control
        try:
            logger.info("trying to upload the cover image")
            cover_image_data = await cover_image.read()
            uploaded_media =  imagekit.files.upload(
                file=cover_image_data,
                file_name=cover_image.filename or '',
                folder='/covers'
            )
            if uploaded_media.url:
                logger.info("successfully uploaded the cover image" , url = uploaded_media.url)
                cover_image_url = uploaded_media.url
            

            for img in gallery:
                img_bytes = await img.read()
                uploaded_media_gallery =  imagekit.files.upload(
                    file=img_bytes,
                    file_name=img.filename or '',
                    folder='/gallery'
                )   
                if uploaded_media_gallery.url:
                    logger.info("successfully uploaded the cover image" , url = uploaded_media_gallery.url)
                    gallery_urls.append(uploaded_media_gallery.url) ## appending the gallery urls back.

        except Exception as e:
            logger.error("some error occured while dealing with image upload" , e)

        return ImageKitVenueUrls(
            cover_image_url=cover_image_url,
            gallery_images=gallery_urls,
        )
       
    

adminservice = AdminService()