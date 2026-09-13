import re

def is_valid_cameroon_phone(phone: str) -> bool:
    """
    Validates if a phone number matches Cameroon's numbering plan.
    Supports +237 followed by 9 digits starting with 2, 6 or 8.
    """
    pattern = r"^\+237[268]\d{8}$"
    return bool(re.match(pattern, phone))

def is_valid_email(email: str) -> bool:
    """Simple regex to validate email format."""
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return bool(re.match(pattern, email))
