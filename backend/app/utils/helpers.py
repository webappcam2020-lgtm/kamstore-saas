import secrets
import string

def generate_ref(prefix: str = "TXN", length: int = 12) -> str:
    """Generates a random reference string."""
    alphabet = string.ascii_uppercase + string.digits
    random_str = "".join(secrets.choice(alphabet) for _ in range(length))
    return f"{prefix}_{random_str}"

def format_phone_cameroon(phone: str) -> str:
    """Formats phone number to Cameroon format (+237...)."""
    # Remove all non-numeric characters
    cleaned = "".join(c for c in phone if c.isdigit())
    
    if cleaned.startswith("237") and len(cleaned) == 12:
        return f"+{cleaned}"
    elif len(cleaned) == 9: # Local 9 digit format
        return f"+237{cleaned}"
    elif cleaned.startswith("0") and len(cleaned) == 10:
        return f"+237{cleaned[1:]}"
    
    return phone # Return as is if format is unknown

def format_currency_xaf(amount: float) -> str:
    """Formats an amount in XAF."""
    return f"{amount:,.0f} FCFA".replace(",", " ")
