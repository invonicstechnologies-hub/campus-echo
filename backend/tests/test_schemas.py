import pytest
import uuid
from datetime import datetime
from app.schemas.post import PostResponse

def test_post_response_excludes_hmac():
    post_data = {
        "id": uuid.uuid4(),
        "topic_id": uuid.uuid4(),
        "content": "Test content",
        "upvote_count": 0,
        "status": "published",
        "created_at": datetime.utcnow()
    }
    
    response = PostResponse(**post_data)
    json_data = response.model_dump()
    
    assert 'hmac_token' not in json_data
