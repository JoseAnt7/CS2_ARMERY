"""
API WhaleWatch: radar pasivo (alertas globales generadas en background).
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import Subscription, UserSubscription
from services.whale_watch import (
    WHALEWATCH_SLUG,
    get_active_alerts,
    get_radar_status,
)

whalewatch_bp = Blueprint('whalewatch', __name__)


def _current_user_id():
    return int(get_jwt_identity())


def _get_active_whalewatch(user_id):
    return (
        UserSubscription.query.join(Subscription)
        .filter(
            UserSubscription.user_id == user_id,
            UserSubscription.is_active.is_(True),
            Subscription.slug == WHALEWATCH_SLUG,
        )
        .first()
    )


@whalewatch_bp.route('/api/whalewatch/status', methods=['GET'])
@jwt_required()
def whalewatch_status():
    user_sub = _get_active_whalewatch(_current_user_id())
    if not user_sub:
        return jsonify({'active': False})

    plan = user_sub.plan
    return jsonify({
        'active': True,
        'plan': plan.to_dict() if plan else None,
        'subscription': user_sub.subscription.to_dict() if user_sub.subscription else None,
        'radar': get_radar_status(),
    })


@whalewatch_bp.route('/api/whalewatch/alerts', methods=['GET'])
@jwt_required()
def whalewatch_alerts():
    if not _get_active_whalewatch(_current_user_id()):
        return jsonify({'msg': 'No tienes WhaleWatch activo'}), 403

    alert_type = request.args.get('type', 'all')
    limit = min(int(request.args.get('limit', 80)), 200)

    alerts = get_active_alerts(limit=limit, alert_type=alert_type)
    return jsonify({
        'alerts': alerts,
        'total': len(alerts),
        'radar': get_radar_status(),
    })
