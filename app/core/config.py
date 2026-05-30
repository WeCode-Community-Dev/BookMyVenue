# import env credientails 
from dotenv import load_dotenv
import os 

load_dotenv()

# define settings so we can create each secrets and configurations in here
class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")


settings = Settings()





