# import env credientails 
from dotenv import load_dotenv
import os 

load_dotenv()

# define settings so we can create each secrets and configurations in here
class Settings:
    # load the database
    DATABASE_URL = os.getenv("DATABASE_URL")

    # load the jwt 
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))




settings = Settings()





