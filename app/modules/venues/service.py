from app.modules.venues.models import Venue


def create_venue():
#      Only owner can create

# Venue starts as:
# is_approved = False

# Admin must approve later
    pass 

def get_venues():
    # Venue.owner_id == current_user.id
    pass

def update_venue(db,
    venue_id,
    current_user,
    data):
#     Venue Exists
# Venue Belongs To Owner
    pass

def delete_venue(db,
    venue_id,
    current_user):
#     Venue Exists
# Venue Belongs To Owner
    pass

def list_venues():
# Only show:
# is_approved=True
# is_active=True
    pass

def venue_detailes(db,
    venue_id):
    pass