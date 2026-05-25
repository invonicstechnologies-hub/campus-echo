import httpx
from app.core.config import settings


def send_otp_email_sync(recipient_email: str, otp: str):
    payload = {
        "from": "Unsaid <onboarding@resend.dev>",
        "to": [recipient_email],
        "subject": "Unsaid Verification Code",
        "text": (
            f"Your Unsaid verification code is: {otp}\n\n"
            "This code expires in 10 minutes. Do not share it with anyone."
        ),
    }

    try:
        response = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
        print(f"OTP email sent to {recipient_email} via Resend (id={response.json().get('id')})")
    except Exception as e:
        print(f"Failed to send OTP email to {recipient_email}: {e}")
