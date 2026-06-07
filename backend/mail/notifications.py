"""Notificaciones por correo."""
from __future__ import annotations

import html
from datetime import datetime

from mail.gmail_transport import send_html_email
from mail.renderer import render_template
from mail import settings

TOPIC_LABELS = {
    "support": "Soporte técnico",
    "general": "Consulta general",
    "sponsorship": "Patrocinio / colaboración",
    "privacy": "Privacidad y datos",
    "other": "Otro",
}


def _topic_label(topic: str) -> str:
    return TOPIC_LABELS.get(topic, topic)


def send_contact_notification(
    *,
    name: str,
    email: str,
    topic: str,
    message: str,
) -> bool:
    """Avisa al equipo de un nuevo mensaje de contacto."""
    topic_label = _topic_label(topic)
    when = datetime.utcnow().strftime("%d/%m/%Y %H:%M UTC")
    safe = {
        "name": html.escape(name),
        "email": html.escape(email),
        "topic_label": html.escape(topic_label),
        "message": html.escape(message).replace("\n", "<br>"),
        "when": when,
    }
    html_body = render_template("contact_notification.html", **safe)
    text_body = (
        f"Nuevo contacto en {settings.SITE_NAME}\n\n"
        f"Nombre: {name}\n"
        f"Email: {email}\n"
        f"Motivo: {topic_label}\n"
        f"Fecha: {when}\n\n"
        f"Mensaje:\n{message}\n"
    )
    return send_html_email(
        settings.CONTACT_INBOX_EMAIL,
        f"[{settings.SITE_NAME}] {topic_label} — {name}",
        html_body,
        text_body=text_body,
        reply_to=email,
    )


def send_contact_auto_reply(*, name: str, email: str, topic: str) -> bool:
    """Confirma al usuario que hemos recibido su mensaje."""
    if not settings.CONTACT_REPLY_ENABLED:
        return False

    topic_label = _topic_label(topic)
    safe_name = html.escape(name)
    html_body = render_template(
        "contact_auto_reply.html",
        name=safe_name,
        topic_label=html.escape(topic_label),
    )
    text_body = (
        f"Hola {name},\n\n"
        f"Hemos recibido tu mensaje sobre «{topic_label}» en {settings.SITE_NAME}. "
        f"Te responderemos lo antes posible.\n\n"
        f"— {settings.SITE_NAME}\n"
    )
    return send_html_email(
        email,
        f"Hemos recibido tu mensaje — {settings.SITE_NAME}",
        html_body,
        text_body=text_body,
    )
