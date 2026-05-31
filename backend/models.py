from database import Base
from sqlalchemy import Column,Integer,TIMESTAMP,String,Float,Boolean,text

class Venue(Base):
    __tablename__ =   "Venues"

    id = Column(Integer,primary_key=True,nullable=False)
    name = Column(String,nullable=False)
    location = Column(String,nullable=False)
    price = Column(Float,nullable=False)
    capacity = Column(Integer,nullable=True)
    availability = Column(Boolean,server_default='TRUE')
    created_at = Column(TIMESTAMP(timezone=True),server_default=text('now()')) 

class User(Base):
    __tablename__ =   "users"

    id = Column(Integer,primary_key=True,nullable=False)
    name = Column(String,nullable=False)
    phone_no = Column(String,nullable=False)
    default_city = Column(String)
    account_status = Column(Boolean,server_default='TRUE')
    created_at = Column(TIMESTAMP(timezone=True),server_default=text('now()')) 
    updated_at = Column(TIMESTAMP(timezone=True),server_default=text('now()')) 