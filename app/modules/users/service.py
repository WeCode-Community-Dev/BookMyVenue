# business logic written in this file 
from app.modules.users.models import User



def get_profile(user):
    return user

# update the user 
def update_profile(
    db,
    current_user,
    data
):
    if data.name:
        current_user.name = data.name


    if data.username:
        current_user.username = data.username

    db.commit()
    db.refresh(current_user)

    return current_user