from fastapi import FastAPI
from pydantic import BaseModel 
from starlette import status
import models
from schema import CreateVenue 
from database import engine,Base
from typing import List
from database import get_db
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi import APIRouter

app = FastAPI()


Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix='/Venues',
    tags=['Venues']
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/",status_code=status.HTTP_201_CREATED,response_model=List[CreateVenue])
async def create_venue(Venues:CreateVenue,db:Session=Depends(get_db)):
    new_venue = models.Venue(**Venues.dict())
    db.add(new_venue)
    db.commit()
    db.refresh(new_venue)
    
    return [new_venue]

@app.get("/venues")
async def get_venue():
    return {"venues":[]}

@app.get("/venues/{venue_id}")
async def get_venues(venue_id:int):
    return venue_id