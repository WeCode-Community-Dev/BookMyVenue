from pydantic import BaseModel, Field
from datetime import date, time, datetime
from typing import Optional 

class BookingCreate(BaseModel):
    venue_id: int
    booking_date: date          
    time_slot: time             
    notes: Optional[str] = None 
    event_type: Optional[str] = None
    guest_count: Optional[int] = None

class BookingOut(BaseModel):
    id: int
    venue_id: int
    booking_date: date
    time_slot: time
    notes: Optional[str] = None
    event_type: Optional[str] = None
    guest_count: Optional[int] = None
    status: str
    owner_status: str
    amount: float
    created_at: datetime
    model_config = {"from_attributes": True} 
    
    
class BookingCancelRequest(BaseModel):
    cancellation_reason: Optional[str] = None


class PaginatedBookingsOut(BaseModel):
    items: list[BookingOut]
    total: int
    page: int
    limit: int
    
    
class VenueSnippet(BaseModel):
    id: int
    name: str
    location: str
 
    model_config = {"from_attributes": True}
    
    
class CustomerSnippet(BaseModel):
    id: int
    name: str
 
    model_config = {"from_attributes": True}
    
    
class OwnerBookingOut(BaseModel):
    id: int
    venue: VenueSnippet
    user: CustomerSnippet          # the customer who made the booking
    booking_date: date
    time_slot: time
    event_type: Optional[str] = None
    guest_count: Optional[int] = None
    notes: Optional[str] = None
    status: str                    
    owner_status: str             
    amount: float
    created_at: datetime
 
    model_config = {"from_attributes": True}
    
    
    
class PaginatedOwnerBookingsOut(BaseModel):
    items: list[OwnerBookingOut]
    total: int
    page: int
    limit: int