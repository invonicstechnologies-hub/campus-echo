import smtplib
from email.message import EmailMessage
from app.core.config import settings

def send_otp_email_sync(recipient_email: str, otp: str):
    msg = EmailMessage()
    msg.set_content(f"Your Unsaid verification code is: {otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.")
    msg["Subject"] = "Unsaid Verification Code"
    msg["From"] = settings.GMAIL_SENDER
    msg["To"] = recipient_email

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(settings.GMAIL_SENDER, settings.GMAIL_APP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"OTP email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send OTP email to {recipient_email}: {e}")
