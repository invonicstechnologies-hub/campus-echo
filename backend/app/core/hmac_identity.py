import hmac
import hashlib
from datetime import datetime
from app.core.config import settings

def get_current_semester_salt() -> str:
    """Derive salt from current academic semester (e.g. '2025-S1')."""
    now = datetime.utcnow()
    year = now.year
    # S1 is Jan-Jun, S2 is Jul-Dec, as an example mapping
    semester = "S1" if now.month <= 6 else "S2"
    semester_string = f"{year}-{semester}"
    
    # Combine base secret with semester string and hash it
    base_secret = settings.SEMESTER_SALT_SECRET.encode('utf-8')
    semester_bytes = semester_string.encode('utf-8')
    
    # Return hex digest of the combined hash
    return hashlib.sha256(base_secret + semester_bytes).hexdigest()

def generate_hmac_token(session_id: str, semester_salt: str) -> str:
    """Generate HMAC-SHA256 token using session_id and semester_salt."""
    return hmac.new(
        semester_salt.encode('utf-8'),
        session_id.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

def sever_identity(session_id: str) -> str:
    """
    Call generate_hmac_token, then DELETE session_id from memory scope.
    This is the only function in the codebase that consumes a raw session_id.
    All callers receive only the hmac_token.
    """
    semester_salt = get_current_semester_salt()
    hmac_token = generate_hmac_token(session_id, semester_salt)
    
    # Explicitly delete session_id from the local scope to prevent any further use
    del session_id
    
    return hmac_token
