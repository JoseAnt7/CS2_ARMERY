"""Formulario de contacto público."""
import logging

from flask import Blueprint, request, jsonify

from extensions import db
from models import ContactMessage
from mail import notifications

logger = logging.getLogger(__name__)

contact_bp = Blueprint('contact', __name__)

TOPICS = {'support', 'general', 'sponsorship', 'privacy', 'other'}


@contact_bp.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    topic = (data.get('topic') or 'general').strip()
    message = (data.get('message') or '').strip()

    if not name or not email or not message:
        return jsonify({'msg': 'Nombre, email y mensaje son obligatorios'}), 400
    if len(message) < 10:
        return jsonify({'msg': 'El mensaje debe tener al menos 10 caracteres'}), 400
    if len(message) > 5000:
        return jsonify({'msg': 'El mensaje es demasiado largo'}), 400
    if topic not in TOPICS:
        topic = 'general'
    if '@' not in email or len(email) > 200:
        return jsonify({'msg': 'Email no válido'}), 400

    row = ContactMessage(name=name, email=email, topic=topic, message=message)
    db.session.add(row)
    db.session.commit()

    mail_errors = []

    from mail import settings as mail_settings

    if mail_settings.mail_should_send():
        if not notifications.send_contact_notification(
            name=name, email=email, topic=topic, message=message
        ):
            mail_errors.append('notify')

        if (
            mail_settings.CONTACT_REPLY_ENABLED
            and not notifications.send_contact_auto_reply(
                name=name, email=email, topic=topic
            )
        ):
            mail_errors.append('auto_reply')

    if mail_errors:
        logger.warning(
            "Contacto #%s guardado pero falló envío de correo: %s",
            row.id,
            ", ".join(mail_errors),
        )

    return jsonify({'msg': 'Mensaje recibido correctamente'}), 201
