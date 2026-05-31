from fastapi import FastAPI,Response
from pydantic import BaseModel 
from starlette import status
import models
from schema import CreateVenue ,CreateUser
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


# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

@app.post("/",status_code=status.HTTP_201_CREATED,response_model=List[CreateVenue])
async def create_venue(Venues:CreateVenue,db:Session=Depends(get_db)):
    new_venue = models.Venue(**Venues.dict())
    db.add(new_venue)
    db.commit()
    db.refresh(new_venue)
    
    return [new_venue]

@app.get("/",status_code=status.HTTP_200_OK,response_model=List[CreateVenue])
async def get_venue(db:Session=Depends(get_db)):
    venues  = db.query(models.Venue).all()
    return venues

@app.get("/{id}",status_code=status.HTTP_200_OK,response_model=CreateVenue)
async def get_venues(id:int,db: Session = Depends(get_db)):
    # print(id)

    venue = db.query(models.Venue).filter(models.Venue.id == id).first()
    if not venue:
        raise HTTPException(status_code=404,detail="Venue Not Found")
    
    return venue

@app.put("/{id}",status_code=status.HTTP_200_OK,response_model=CreateVenue)
async def update_venue(id:int,updated_data:CreateVenue,db:Session=Depends(get_db)):
    fetch_venue = db.query(models.Venue).filter(models.Venue.id == id)
    exiting_v = fetch_venue.first()

    if not fetch_venue:
        raise HTTPException(status_code=404,detail="Venue Not Found")

    fetch_venue.update(updated_data.dict(),synchronize_session=False)
    db.commit()
    
    updated_venue = fetch_venue.first()
    return updated_venue

@app.delete("/{id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_venue(id:int,db:Session=Depends(get_db)):
    venue_query = db.query(models.Venue).filter(models.Venue.id == id)
    venue = venue_query.first()

    if not venue_query:
        raise HTTPException(status_code=404,detail="Venue Not Found")

    venue_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)



@app.post("/user",status_code=status.HTTP_201_CREATED,response_model=List[CreateUser])
async def create_user(Users:CreateUser,db:Session=Depends(get_db)):
    new_user = models.User(**Users.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return [new_user]


@app.get("/user/{id}",status_code=status.HTTP_200_OK,response_model=CreateUser)
async def get_user(id:int,db: Session = Depends(get_db)):
    # print(id)

    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404,detail="user Not Found")
    
    return user


