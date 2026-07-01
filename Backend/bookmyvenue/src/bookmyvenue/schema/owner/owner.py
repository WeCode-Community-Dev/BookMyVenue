import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import List, Dict, Any, Optional

    
class OwnerOnboardingSchema(BaseModel):
    organization: str 
    profession: Optional[str] = None
    promise: str
    self_info: Optional[str] = None

