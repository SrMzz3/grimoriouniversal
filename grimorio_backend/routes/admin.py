from flask import Blueprint, request, jsonify
from models import db, User, CustomAchievement
from datetime import datetime
import re
import uuid

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


# ================================================================
# HELPERS
# ================================================================

def _requester():
    """Pega o usuário que está fazendo a requisição (header X-User-Id)."""
    user_id = request.headers.get('X-User-Id') or (request.json or {}).get('_requesterId')
    if not user_id:
        return None
    return User.query.get(user_id)


def _is_admin(user):
    if not user:
        return False
    return bool(user.is_admin)


def _guard():
    """Retorna (user, None) se for adm, ou (None, response) se não for."""
    user = _requester()
    if not _is_admin(user):
        return None, (jsonify({'error': 'Acesso negado. Somente administradores.'}), 403)
    return user, None


def _slug(text):
    base = re.sub(r'[^a-z0-9]+', '_', (text or '').lower()).strip('_')
    if not base:
        base = 'custom'
    return 'custom_' + base + '_' + uuid.uuid4().hex[:6]


def _user_brief(u):
    return {
        'id': u.id,
        'username': u.username,
        'displayName': u.display_name or u.username,
        'avatar': u.avatar or '',
        'frame': u.frame or 'none',
        'bio': u.bio or '',
        'isAdmin': bool(u.is_admin),
        'achievements': u.achievements or [],
        'displayedAchievement': u.displayed_achievement or '',
        'createdAt': u.created_at.isoformat() if u.created_at else None,
    }


# ================================================================
# USUÁRIOS
# ================================================================

@admin_bp.route('/users', methods=['GET'])
def list_users():
    _, denied = _guard()
    if denied:
        return denied

    search = (request.args.get('q') or '').strip().lower()
    query = User.query
    if search:
        query = query.filter(User.username.ilike('%' + search + '%'))

    users = query.order_by(User.created_at.asc()).all()
    return jsonify([_user_brief(u) for u in users])


@admin_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    _, denied = _guard()
    if denied:
        return denied

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404
    return jsonify(_user_brief(user))


# ================================================================
# CONQUISTAS DE USUÁRIO
# ================================================================

@admin_bp.route('/users/<user_id>/achievements', methods=['POST'])
def grant_achievement(user_id):
    _, denied = _guard()
    if denied:
        return denied

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    data = request.json or {}
    ach_id = (data.get('achievementId') or '').strip()
    if not ach_id:
        return jsonify({'error': 'ID da conquista é obrigatório'}), 400

    # Conquista exclusiva do adm não pode ser dada a mais ninguém
    if ach_id == 'im_purpleflower' and not user.is_admin:
        return jsonify({'error': 'Essa conquista é exclusiva do administrador.'}), 400

    current = list(user.achievements or [])
    if ach_id not in current:
        current.append(ach_id)
        user.achievements = current
        db.session.commit()

    return jsonify(_user_brief(user))


@admin_bp.route('/users/<user_id>/achievements/<ach_id>', methods=['DELETE'])
def revoke_achievement(user_id, ach_id):
    _, denied = _guard()
    if denied:
        return denied

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    current = [a for a in (user.achievements or []) if a != ach_id]
    user.achievements = current
    if user.displayed_achievement == ach_id:
        user.displayed_achievement = ''
    db.session.commit()

    return jsonify(_user_brief(user))


# ================================================================
# CONQUISTAS CUSTOMIZADAS
# ================================================================

@admin_bp.route('/achievements', methods=['GET'])
def list_custom():
    # Leitura livre: o front precisa dos dados pra exibir o badge de quem tem
    items = CustomAchievement.query.order_by(CustomAchievement.created_at.asc()).all()
    return jsonify([a.to_dict() for a in items])


@admin_bp.route('/achievements', methods=['POST'])
def create_custom():
    admin, denied = _guard()
    if denied:
        return denied

    data = request.json or {}
    title = (data.get('title') or '').strip()
    if not title:
        return jsonify({'error': 'Título é obrigatório'}), 400

    rarity = (data.get('rarity') or 'comum').strip().lower()
    if rarity not in ('comum', 'raro', 'epico', 'épico', 'lendario', 'lendário', 'mitico', 'mítico'):
        rarity = 'comum'
    rarity = rarity.replace('épico', 'epico').replace('lendário', 'lendario').replace('mítico', 'mitico')

    ach = CustomAchievement(
        id=_slug(title),
        title=title,
        description=(data.get('desc') or data.get('description') or '').strip(),
        icon=(data.get('icon') or '✨').strip()[:16],
        rarity=rarity,
        created_by=admin.id,
        created_at=datetime.utcnow()
    )
    db.session.add(ach)
    db.session.commit()

    return jsonify(ach.to_dict()), 201


@admin_bp.route('/achievements/<ach_id>', methods=['DELETE'])
def delete_custom(ach_id):
    _, denied = _guard()
    if denied:
        return denied

    ach = CustomAchievement.query.get(ach_id)
    if not ach:
        return jsonify({'error': 'Conquista não encontrada'}), 404

    db.session.delete(ach)

    # Remove de todo mundo que tinha
    for u in User.query.all():
        if ach_id in (u.achievements or []):
            u.achievements = [a for a in u.achievements if a != ach_id]
            if u.displayed_achievement == ach_id:
                u.displayed_achievement = ''

    db.session.commit()
    return jsonify({'message': 'Conquista removida'})
