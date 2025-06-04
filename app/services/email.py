from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from urllib.parse import quote

from core.config import settings
from dtos.job_offer import ApplicationDto


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


def send_job_application_email(to_email: str, application: ApplicationDto) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "New Application"
    msg["From"] = settings.email_user
    msg["To"] = to_email

    link = f"http://localhost:8000/users/resumes/{application.resume_id}"
    html_content = f"""
    <html>
        <body>
            <p>You have a new job application.<br>
            View it here: <a href="{link}">View Application</a>
            </p>
        </body>
    </html>
    """
    msg.attach(MIMEText(html_content, "html"))

    with smtplib.SMTP(settings.email_host, settings.email_port) as connection:
        connection.starttls()
        connection.login(settings.email_user, settings.email_password)
        connection.sendmail(
            from_addr=settings.email_user,
            to_addrs=to_email,
            msg=msg.as_string(),
        )
