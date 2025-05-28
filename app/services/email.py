import smtplib
from urllib.parse import quote
from core.config import settings


def send_verification_email(to_email: str, token: str):
    encoded_token = quote(token)
    verify_link = f"{settings.app_base_url}auth/verify-email?token={encoded_token}"

    with smtplib.SMTP(settings.email_host, settings.email_port) as connection:
        connection.starttls()
        connection.login(settings.email_user, settings.email_password)
        connection.sendmail( 
            from_addr=settings.email_user,
            to_addrs=to_email,
            msg=f"Subject:Verify your email\n\n Click the following link to verify your email: {verify_link}".encode(
                "utf-8"
            ),
        )
