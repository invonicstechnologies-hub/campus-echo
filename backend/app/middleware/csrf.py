from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from app.core.config import settings

EXEMPT_METHODS = {"GET", "HEAD", "OPTIONS"}
EXEMPT_PATHS = {
    "/health",
    "/api/auth/send-otp",
    "/api/auth/verify-otp",
    "/api/auth/refresh",
    "/api/admin/moderators",
    "/api/admin/moderators/",
}

class CSRFMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        if request.method in EXEMPT_METHODS:
            return await call_next(request)

        # Exempt exact paths and any /api/admin/moderators/ 
        # sub-paths (e.g. revoke endpoint with path param)
        path = request.url.path
        if path in EXEMPT_PATHS or path.startswith("/api/admin/moderators/"):
            return await call_next(request)

        csrf_header = request.headers.get(settings.CSRF_HEADER_NAME)
        if not csrf_header or csrf_header != settings.CSRF_HEADER_VALUE:
            return JSONResponse(
                status_code=403,
                content={"detail": "CSRF validation failed"}
            )

        return await call_next(request)
