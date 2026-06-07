"""Configuración de correo (Gmail API). Variables en backend/.env."""
import os

MAIL_ENABLED = os.environ.get("MAIL_ENABLED", "false").strip().lower() in (
    "1",
    "true",
    "yes",
    "on",
)

GMAIL_CLIENT_ID = os.environ.get("GMAIL_CLIENT_ID", "").strip()
GMAIL_CLIENT_SECRET = os.environ.get("GMAIL_CLIENT_SECRET", "").strip()
GMAIL_REFRESH_TOKEN = os.environ.get("GMAIL_REFRESH_TOKEN", "").strip()
GMAIL_SENDER_EMAIL = os.environ.get("GMAIL_SENDER_EMAIL", "").strip()

APP_PUBLIC_URL = os.environ.get("APP_PUBLIC_URL", "https://globalskinmetrics.com").rstrip("/")
MAIL_LOGO_URL = os.environ.get("MAIL_LOGO_URL", "").strip() or (
    f"{APP_PUBLIC_URL}/favicon.png"
)

# Buzón donde llegan los mensajes del formulario de contacto
CONTACT_INBOX_EMAIL = os.environ.get(
    "CONTACT_INBOX_EMAIL", "jllorenspadilla@gmail.com"
).strip()

CONTACT_REPLY_ENABLED = os.environ.get("CONTACT_REPLY_ENABLED", "true").strip().lower() in (
    "1",
    "true",
    "yes",
    "on",
)

SITE_NAME = os.environ.get("SITE_NAME", "Global Skin Metrics").strip()

GMAIL_SEND_SCOPE = ["https://www.googleapis.com/auth/gmail.send"]


def mail_is_configured() -> bool:
    return bool(
        GMAIL_CLIENT_ID
        and GMAIL_CLIENT_SECRET
        and GMAIL_REFRESH_TOKEN
        and GMAIL_SENDER_EMAIL
    )


def mail_should_send() -> bool:
    return MAIL_ENABLED and mail_is_configured()
