import pytest
import uuid
from app.core.hmac_identity import sever_identity, generate_hmac_token, get_current_semester_salt

def test_sever_identity():
    session_id = str(uuid.uuid4())
    expected_hmac = generate_hmac_token(session_id, get_current_semester_salt())
    
    hmac_token = sever_identity(session_id)
    
    assert hmac_token == expected_hmac
    assert session_id not in hmac_token
