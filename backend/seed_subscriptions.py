"""
Datos iniciales de suscripciones (CSBot y planes).
"""

CSBOT_IMAGE = (
    'https://images.unsplash.com/photo-1677442136019-21780ecad995'
    '?auto=format&fit=crop&w=800&q=80'
)

CSBOT_DESCRIPTION = """CSBot es un bot especializado que te avisará cuando bajen de precio las armas y accesorios que elijas. Configura tus alertas con total flexibilidad:

1. Porcentaje de bajada respecto al precio actual
Elige un umbral mínimo (por ejemplo, 30 %) y recibirás avisos de todas las skins que hayan bajado ese porcentaje o más hacia arriba.

2. Arma o categoría concreta
Selecciona un modelo específico, una categoría entera (subfusiles, rifles, cuchillos, guantes…) o cualquier combinación que necesites. Todo es posible."""

CSBOT_PLANS = [
    {
        'slug': 'basic',
        'name': 'Basic',
        'description': 'Avisos de hasta 20 armas y accesorios que selecciones',
        'price_eur': 15.00,
        'sort_order': 1,
        'is_featured': False,
    },
    {
        'slug': 'advanced',
        'name': 'Advanced',
        'description': 'Avisos ilimitados en 3 categorías de armas y accesorios que elijas',
        'price_eur': 30.00,
        'sort_order': 2,
        'is_featured': True,
    },
    {
        'slug': '2pro',
        'name': '2Pro',
        'description': 'Para avanzados: avisos en todas las categorías, armas y accesorios',
        'price_eur': 50.00,
        'sort_order': 3,
        'is_featured': False,
    },
]


WHALEWATCH_IMAGE = (
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3'
    '?auto=format&fit=crop&w=800&q=80'
)

WHALEWATCH_DESCRIPTION = """WhaleWatch vigila automáticamente todo el mercado de skins CS2 en segundo plano. No tienes que elegir qué buscar: el radar recorre el catálogo completo y te avisa cuando detecta señales de manipulación:

1. Acumulación — compras repetidas de ballenas (precio y volumen al alza).
2. Dump masivo — venta coordinada o salida masiva.
3. Pump & dump — subida artificial seguida de caída desde el pico.

Las alertas son heurísticas basadas en datos públicos de Steam; úsalas como radar, no como consejo de inversión."""

WHALEWATCH_PLAN = {
    'slug': 'radar',
    'name': 'Radar',
    'description': 'Vigilancia automática de todas las skins y artículos del juego',
    'price_eur': 29.00,
    'sort_order': 1,
    'is_featured': True,
}


def _seed_csbot():
    from extensions import db
    from models import Subscription, SubscriptionPlan

    if Subscription.query.filter_by(slug='csbot').first():
        return

    csbot = Subscription(
        slug='csbot',
        name='CSBot',
        tagline='Alertas inteligentes de precios en CS2',
        description=CSBOT_DESCRIPTION,
        image_url=CSBOT_IMAGE,
        is_active=True,
    )
    db.session.add(csbot)
    db.session.flush()

    for plan_data in CSBOT_PLANS:
        db.session.add(SubscriptionPlan(subscription_id=csbot.id, **plan_data))


def _seed_whalewatch():
    from extensions import db
    from models import Subscription, SubscriptionPlan, UserSubscription

    existing = Subscription.query.filter_by(slug='whalewatch').first()
    if existing:
        existing.tagline = 'Radar automático de todo el mercado CS2'
        existing.description = WHALEWATCH_DESCRIPTION
        plans = SubscriptionPlan.query.filter_by(subscription_id=existing.id).all()
        radar = next((p for p in plans if p.slug == 'radar'), None)
        if not radar:
            db.session.add(SubscriptionPlan(subscription_id=existing.id, **WHALEWATCH_PLAN))
        for plan in plans:
            if plan.slug != 'radar':
                in_use = UserSubscription.query.filter_by(plan_id=plan.id).count()
                if in_use == 0:
                    db.session.delete(plan)
        return

    whalewatch = Subscription(
        slug='whalewatch',
        name='WhaleWatch',
        tagline='Radar automático de todo el mercado CS2',
        description=WHALEWATCH_DESCRIPTION,
        image_url=WHALEWATCH_IMAGE,
        is_active=True,
    )
    db.session.add(whalewatch)
    db.session.flush()
    db.session.add(SubscriptionPlan(subscription_id=whalewatch.id, **WHALEWATCH_PLAN))


def seed_subscriptions():
    from extensions import db

    _seed_csbot()
    _seed_whalewatch()
    db.session.commit()
