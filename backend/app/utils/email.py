import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY


def send_otp_email_sync(recipient_email: str, otp: str) -> None:
    """
    Send an OTP verification email via the Resend API (HTTPS/443).
    Uses the official Resend Python SDK — not SMTP.
    """
    try:
        response = resend.Emails.send({
            "from": "Unsaid <onboarding@resend.dev>",
            "to": [recipient_email],
            "subject": "Unsaid Verification Code",
            "html": f"""
                <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
                    <h2 style="color: #1a1a2e;">Your Unsaid Verification Code</h2>
                    <p style="font-size: 16px;">Use the code below to verify your identity:</p>
                    <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                                background: #f4f4f8; padding: 16px 24px; border-radius: 8px;
                                text-align: center; color: #1a1a2e;">
                        {otp}
                    </div>
                    <p style="color: #666; margin-top: 16px;">
                        This code expires in <strong>10 minutes</strong>.
                        Do not share it with anyone.
                    </p>
                </div>
            """,
        })
        print(f"[Resend] OTP email sent to {recipient_email} → response: {response}")
    except Exception as e:
        print(f"[Resend] Failed to send OTP email to {recipient_email}: {e}")
