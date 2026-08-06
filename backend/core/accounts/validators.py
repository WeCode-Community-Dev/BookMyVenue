import re

FULL_NAME_MIN_LENGTH = 2
FULL_NAME_MAX_LENGTH = 255
FULL_NAME_PATTERN = re.compile(r"^[a-zA-Z]+(?:[ '.-][a-zA-Z]+)*$")

INDIAN_MOBILE_FIRST_DIGITS = frozenset("6789")


def normalize_full_name(value: str) -> str:
    return " ".join(value.split())


def validate_full_name(value: str) -> str:
    full_name = normalize_full_name(value)

    if len(full_name) < FULL_NAME_MIN_LENGTH:
        raise ValueError("Full name must be at least 2 characters.")

    if len(full_name) > FULL_NAME_MAX_LENGTH:
        raise ValueError("Full name must be at most 255 characters.")

    if not FULL_NAME_PATTERN.fullmatch(full_name):
        raise ValueError(
            "Full name can only contain letters, spaces, hyphens, apostrophes, and periods.",
        )

    return full_name


def normalize_phone(value: str) -> str:
    digits = re.sub(r"\D", "", value.strip())

    if digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]

    return digits


def validate_phone(value: str) -> str:
    phone = value.strip()
    if not phone:
        raise ValueError("Phone number is required.")

    digits = normalize_phone(phone)

    if len(digits) != 10:
        raise ValueError("Enter a valid 10-digit Indian mobile number.")

    if digits[0] not in INDIAN_MOBILE_FIRST_DIGITS:
        raise ValueError("Indian mobile numbers must start with 6, 7, 8, or 9.")

    return digits
