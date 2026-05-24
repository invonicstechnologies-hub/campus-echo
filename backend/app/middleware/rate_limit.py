from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import logging
import ipaddress
import redis.asyncio as redis
from app.core.config import settings

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

def _get_real_ip(request: Request) -> str:
    if request.client and request.client.host in settings.TRUSTED_PROXIES:
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
    return request.client.host if request.client else "127.0.0.1"

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            client_ip = _get_real_ip(request)
            try:
                ip_obj = ipaddress.ip_address(client_ip)
                if ip_obj.version == 4:
                    subnet = ".".join(client_ip.split(".")[:3]) + ".0/24"
                else:
                    subnet = client_ip
            except ValueError:
                subnet = "unknown"
                
            endpoint = request.url.path
            
            window = 60
            limit = 60
            
            if not request.headers.get("Authorization"):
                limit = 30
                
            if request.method == "POST" and endpoint == "/posts":
                window = 600
                limit = 5
            elif request.method == "POST" and endpoint.endswith("/flag"):
                window = 3600
                limit = 3

            key = f"rate:{client_ip}:{subnet}:{endpoint}:{window}"
            
            requests = await redis_client.incr(key)
            if requests == 1:
                await redis_client.expire(key, window)
                
            if requests > limit:
                ttl = await redis_client.ttl(key)
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too Many Requests"},
                    headers={"Retry-After": str(ttl if ttl > 0 else window)}
                )
        except Exception as e:
            logging.warning(f"WARNING: rate limiter unavailable, failing open. Error: {e}")
            
        return await call_next(request)
