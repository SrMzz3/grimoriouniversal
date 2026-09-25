from flask import Blueprint, request, jsonify
from models import db, Table, Character
import uuid
from datetime import datetime


tables_bp = Blueprint('tables', __name__, url_prefix='/api/tables')


@tables_bp.route('/<user_id>', methods=['POST'])
def create_table(user_id):
    data = request.json or {}
    name = (data.get('name') or 'Mesa de Aventura').strip() or 'Mesa de Aventura'

    table = Table(
        id=str(uuid.uuid4()),
        name=name,
        master_id=user_id,
        members=[{
            'id': user_id,
            'username': data.get('username', 'Mestre'),
            'role': 'master',
            'joinedAt': datetime.utcnow().isoformat()
        }],
        characters=[],
        messages=[],
        rolls=[],
        created_at=datetime.utcnow()
    )

    db.session.add(table)
    db.session.commit()

    return jsonify({
        'id': table.id,
        'name': table.name,
        'masterId': table.master_id,
        'members': table.members,
        'inviteLink': f'/table/{table.id}'
    }), 201


@tables_bp.route('/<user_id>', methods=['GET'])
def list_tables(user_id):
    tables = Table.query.order_by(Table.created_at.desc()).all()
    result = []

    for table in tables:
        members = table.members or []
        if table.master_id == user_id or any(member.get('id') == user_id for member in members):
            result.append({
                'id': table.id,
                'name': table.name,
                'masterId': table.master_id,
                'members': members,
                'createdAt': table.created_at.isoformat() if table.created_at else None,
            })

    return jsonify(result)


@tables_bp.route('/<table_id>', methods=['GET'])
def get_table(table_id):
    table = Table.query.filter_by(id=table_id).first()
    if not table:
        return jsonify({'error': 'Mesa não encontrada'}), 404

    return jsonify({
        'id': table.id,
        'name': table.name,
        'masterId': table.master_id,
        'members': table.members or [],
        'characters': table.characters or [],
        'messages': (table.messages or [])[-50:],
        'rolls': (table.rolls or [])[-50:],
        'createdAt': table.created_at.isoformat() if table.created_at else None,
    })


@tables_bp.route('/<table_id>/join', methods=['POST'])
def join_table(table_id):
    data = request.json or {}
    user_id = data.get('userId')
    username = data.get('username')

    table = Table.query.filter_by(id=table_id).first()
    if not table:
        return jsonify({'error': 'Mesa não encontrada'}), 404

    if not user_id:
        return jsonify({'error': 'userId obrigatório'}), 400

    if any(member.get('id') == user_id for member in (table.members or [])):
        return jsonify({'error': 'Usuário já está na mesa'}), 400

    table.members = table.members or []
    table.members.append({
        'id': user_id,
        'username': username or 'Jogador',
        'role': 'player',
        'joinedAt': datetime.utcnow().isoformat()
    })

    db.session.commit()
    return jsonify({'message': 'Entrou na mesa'}), 200


@tables_bp.route('/<table_id>/leave', methods=['POST'])
def leave_table(table_id):
    data = request.json or {}
    user_id = data.get('userId')

    table = Table.query.filter_by(id=table_id).first()
    if not table:
        return jsonify({'error': 'Mesa não encontrada'}), 404

    if not user_id:
        return jsonify({'error': 'userId obrigatório'}), 400

    if table.master_id == user_id:
        return jsonify({'error': 'Mestre não pode sair. Transfira ou delete a mesa.'}), 400

    table.members = [member for member in (table.members or []) if member.get('id') != user_id]
    db.session.commit()

    return jsonify({'message': 'Saiu da mesa'}), 200


@tables_bp.route('/<table_id>/characters', methods=['POST'])
def share_character(table_id):
    data = request.json or {}
    char_id = data.get('charId')
    user_id = data.get('userId')

    table = Table.query.filter_by(id=table_id).first()
    if not table:
        return jsonify({'error': 'Mesa não encontrada'}), 404

    char = Character.query.filter_by(id=char_id, user_id=user_id).first()
    if not char:
        return jsonify({'error': 'Personagem não encontrado'}), 404

    table.characters = table.characters or []
    if any(c.get('id') == char_id for c in table.characters):
        return jsonify({'error': 'Personagem já está na mesa'}), 400

    table.characters.append({
        'id': char.id,
        'name': char.name,
        'sysId': char.sys_id,
        'userId': user_id,
        'username': data.get('username', ''),
        'sharedAt': datetime.utcnow().isoformat()
    })

    db.session.commit()
    return jsonify({'message': 'Personagem compartilhado'}), 200


@tables_bp.route('/<table_id>/characters', methods=['GET'])
def get_table_characters(table_id):
    table = Table.query.filter_by(id=table_id).first()
    if not table:
        return jsonify({'error': 'Mesa não encontrada'}), 404

    result = []
    for char_ref in (table.characters or []):
        char = Character.query.filter_by(id=char_ref.get('id')).first()
        if not char:
            continue
        result.append({
            'id': char.id,
            'name': char.name,
            'sysId': char.sys_id,
            'userId': char.user_id,
            'username': char_ref.get('username', ''),
            'stats': char.stats,
            'hpCur': char.hp_cur,
            'hpMax': char.hp_max,
            'level': char.level,
            'cls': char.cls,
            'race': char.race,
            'abilities': (char.abilities or [])[:5],
        })

    return jsonify(result)


@tables_bp.route('/<table_id>/messages', methods=['POST'])
def send_message(table_id):
    data = request.json or {}
    user_id = data.get('userId')
    username = data.get('username')
    message = data.get('message')

    table = Table.query.filter_by(id=table_id).first()
    if not table:
        return jsonify({'error': 'Mesa não encontrada'}), 404

    table.messages = table.messages or []
    table.messages.append({
        'id': str(uuid.uuid4()),
        'userId': user_id,
        'username': username,
        'message': message,
        'timestamp': datetime.utcnow().isoformat()
    })

    if len(table.messages) > 200:
        table.messages = table.messages[-200:]

    db.session.commit()
    return jsonify({'message': 'Mensagem enviada'}), 200


@tables_bp.route('/<table_id>/rolls', methods=['POST'])
def add_roll(table_id):
    data = request.json or {}
    user_id = data.get('userId')
    username = data.get('username')
    label = data.get('label', 'Rolagem')
    result = data.get('result')
    total = data.get('total')

    table = Table.query.filter_by(id=table_id).first()
    if not table:
        return jsonify({'error': 'Mesa não encontrada'}), 404

    table.rolls = table.rolls or []
    table.rolls.append({
        'id': str(uuid.uuid4()),
        'userId': user_id,
        'username': username,
        'label': label,
        'result': result,
        'total': total,
        'timestamp': datetime.utcnow().isoformat()
    })

    if len(table.rolls) > 100:
        table.rolls = table.rolls[-100:]

    db.session.commit()
    return jsonify({'message': 'Rolagem registrada'}), 200
