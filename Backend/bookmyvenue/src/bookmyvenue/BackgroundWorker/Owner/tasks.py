import random

import structlog
from typing import List

from celery import shared_task
from sqlalchemy import select
from src.bookmyvenue.models.common import Venue
from src.bookmyvenue.core.database import session
from src.bookmyvenue.utils.image_kit import imagekit
from src.bookmyvenue.worker import app
logger = structlog.get_logger()


@app.task
def upload_media_to_imagekit(venue_id:int,cover_image,gallery:List,venue_name:str):
    db = session()

    #we need to get the venue record first
    #update its status to uploading
    #start the image uploads to imagekit
    #on success update the status to uploaded

    try:
        current_venue_fetching_statement = select(Venue).where(Venue.id == venue_id)
        venue = db.execute(current_venue_fetching_statement).scalar_one_or_none()  #scalar is uses=d to return as python object
        
        if not venue:
            logger.error("venue not found for the given id" , venueid = venue_id)
            return {
                "status_code":400,
                "message": "venue not found"
            }
        
        venue.task_status = 'Uploading'

        cover_image_url = ''
        gallery_urls = []
        #First we upload the images to the imagekit storage and then return the urls to the route control
    
        logger.info("trying to upload the cover image through imagekit" , venueid = venue_id, task_id = venue.celery_task_ID)
        
        
        try:
            uploaded_media =  imagekit.files.upload(
                file=cover_image,
                file_name=f'{venue_name}-cover-{random.randint(0,10000)}',
                folder='/covers'
            )

            if uploaded_media.url:
                logger.info("successfully uploaded the cover image" , url = uploaded_media.url,  venueid = venue_id, task_id = venue.celery_task_ID)
                cover_image_url = uploaded_media.url
            
            idx=0
            for img in gallery:
                uploaded_media_gallery =  imagekit.files.upload(
                    file=img,
                    file_name= f'{venue_name}-gallery-idx',
                    folder='/gallery'
                )   
                if uploaded_media_gallery.url:
                    logger.info("successfully uploaded the gallery image" , url = uploaded_media_gallery.url,  venueid = venue_id, task_id = venue.celery_task_ID)
                    gallery_urls.append(uploaded_media_gallery.url) ## appending the gallery urls back.
                
                idx += 1
            
            venue.cover_image = cover_image_url
            venue.gallery = gallery_urls
            venue.task_status = 'Completed'
            db.commit()

        except Exception as e:
            logger.info("Can't upload the media",   venueid = venue_id, task_id = venue.celery_task_ID)
            venue.task_status = "Failed"
            raise e
        
        

    except Exception as e:
        db.rollback()
        logger.info("owner media upload task error",   venueid = venue_id)
        raise e
    finally:
        db.close() #closing the opened connection   



