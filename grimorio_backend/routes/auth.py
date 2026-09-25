from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models import db, User
from datetime import datetime, timedelta
import uuid

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
bcrypt = Bcrypt()


def user_to_dict(user):
    return {
        'id': user.id,
        'username': user.username,
        'displayName': user.display_name,
        'avatar': user.avatar,
        'frame': user.frame,
        'background': user.background,
        'bgBrightness': user.bg_brightness,
        'bio': user.bio,
        'email': user.email,
        'isAdmin': bool(user.is_admin),
        'achievements': user.achievements or [],
        'displayedAchievement': user.displayed_achievement or '',
        'achievementStats': user.achievement_stats or {},
        'createdAt': user.created_at.isoformat() if user.created_at else None,
    }


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'error': 'Usuário e senha são obrigatórios'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Usuário já existe'}), 400

    user = User(
        id=str(uuid.uuid4()),
        username=username,
        password_hash=bcrypt.generate_password_hash(password).decode('utf-8'),
        display_name=username,
        is_admin=False,
        achievements=[],
        displayed_achievement='',
        achievement_stats={}
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        'id': user.id,
        'username': user.username,
        'message': 'Usuário criado com sucesso'
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username', '').strip()
    password = data.get('password', '')

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 401

    # Verifica bloqueio
    if user.blocked_until and datetime.utcnow() < user.blocked_until:
        remaining = int((user.blocked_until - datetime.utcnow()).total_seconds() / 60) + 1
        return jsonify({'error': f'Conta bloqueada. Tente em {remaining} minuto(s).'}), 403

    # Verifica senha
    if not bcrypt.check_password_hash(user.password_hash, password):
        user.login_attempts += 1
        if user.login_attempts >= 5:
            user.blocked_until = datetime.utcnow() + timedelta(minutes=5)
            db.session.commit()
            return jsonify({'error': 'Muitas tentativas. Bloqueado por 5 minutos.'}), 403
        db.session.commit()
        remaining = 5 - user.login_attempts
        return jsonify({'error': f'Senha incorreta. Tentativas restantes: {remaining}'}), 401

    # Login bem-sucedido
    user.login_attempts = 0
    user.blocked_until = None
    db.session.commit()

    return jsonify(user_to_dict(user))


@auth_bp.route('/recover', methods=['POST'])
def recover():
    data = request.json
    username = data.get('username', '').strip()
    keyword = data.get('keyword', '')
    new_password = data.get('newPassword', '')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    if not user.recovery_keyword or user.recovery_keyword != keyword:
        return jsonify({'error': 'Palavra-chave incorreta'}), 401

    if not new_password or len(new_password) < 3:
        return jsonify({'error': 'Senha inválida (mínimo 3 caracteres)'}), 400

    user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.login_attempts = 0
    user.blocked_until = None
    db.session.commit()

    return jsonify({'message': 'Senha alterada com sucesso'})


@auth_bp.route('/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    data = request.json or {}
    field_map = {
        'displayName': 'display_name',
        'avatar': 'avatar',
        'frame': 'frame',
        'background': 'background',
        'bgBrightness': 'bg_brightness',
        'bio': 'bio',
        'email': 'email',
        'recoveryKeyword': 'recovery_keyword',
        'achievements': 'achievements',
        'displayedAchievement': 'displayed_achievement',
        'achievementStats': 'achievement_stats',
    }
    for key, attr in field_map.items():
        if key in data:
            setattr(user, attr, data[key])

    db.session.commit()
    return jsonify(user_to_dict(user))


@auth_bp.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Usuário excluído'})
