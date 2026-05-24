import smtplib
from email.message import EmailMessage
from app.core.config import settings
import logging

def send_otp_email(to_email: str, otp: str) -> None:
    msg = EmailMessage()
    msg.set_content(f"Your OTP is: {otp}")
    msg['Subject'] = "Campus Echo - Verification OTP"
    msg['From'] = settings.SMTP_USER
    msg['To'] = to_email

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        logging.error(f"Failed to send email: {e}")
