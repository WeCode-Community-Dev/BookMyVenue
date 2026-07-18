import re

ADMIN_EMAIL = "admin@bookmyvenue.com"
ADMIN_PASSWORD = "admin123"

# Strict Indian mobile number regex pattern (+91 followed by exactly 10 digits starting with 6-9)
PHONE_REGEX = re.compile(r"^\+91[6-9]\d{9}$")
