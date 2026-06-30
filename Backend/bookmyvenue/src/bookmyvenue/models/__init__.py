# src/models/__init__.py

#when the src.model is called all the imports listed here will get grouped together and can access them easily,  (MOST NEEDED FOR DB MIGRATIONS)



# Import every model class here so they register with the central Base
from src.bookmyvenue.models.user import User
from src.bookmyvenue.models.owners import Owner, PriceManager
from src.bookmyvenue.models.admin import Admin, Category, Amenity
from src.bookmyvenue.models.common import Venue

# Package them up cleanly
__all__ = ["User", "Owner", "Admin", "Category", "Amenity", "PriceManager", "Venue"]