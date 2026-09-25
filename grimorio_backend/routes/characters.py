from flask import Blueprint, request, jsonify
from models import db, Character
import uuid

characters_bp = Blueprint('characters', __name__, url_prefix='/api/characters')


@characters_bp.route('/<user_id>', methods=['GET'])
def list_characters(user_id):
    chars = Character.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': c.id,
        'sysId': c.sys_id,
        'name': c.name,
        'createdAt': c.created_at.isoformat(),
    } for c in chars])


@characters_bp.route('/<user_id>/<char_id>', methods=['GET'])
def get_character(user_id, char_id):
    char = Character.query.filter_by(id=char_id, user_id=user_id).first()
    if not char:
        return jsonify({'error': 'Personagem não encontrado'}), 404
    return jsonify(char_to_dict(char))


@characters_bp.route('/<user_id>', methods=['POST'])
def create_character(user_id):
    data = request.json or {}
    char = Character(
        id=str(uuid.uuid4()),
        user_id=user_id,
        sys_id=data.get('sysId', 'custom'),
        name=data.get('name', 'Sem nome'),
        stats=data.get('stats', {}),
        hp_cur=data.get('hpCur', 0),
        hp_max=data.get('hpMax', 0),
        abilities=data.get('abilities', []),
        equip=data.get('equip', [])
    )
    db.session.add(char)
    db.session.commit()
    return jsonify(char_to_dict(char)), 201


@characters_bp.route('/<user_id>/<char_id>', methods=['PUT'])
def update_character(user_id, char_id):
    char = Character.query.filter_by(id=char_id, user_id=user_id).first()
    if not char:
        return jsonify({'error': 'Personagem não encontrado'}), 404

    data = request.json or {}
    key_map = {
        'sysId': 'sys_id',
        'hpCur': 'hp_cur',
        'hpMax': 'hp_max',
        'skillTrainingLevel': 'skill_training_level',
        'skillExtraBonuses': 'skill_extra_bonuses',
        'cls': 'cls',
        'clsId': 'cls_id',
        'raceId': 'race_id',
        'subrace': 'subrace',
        'subraceId': 'subrace_id',
        'subclass': 'subclass',
        'subclassId': 'subclass_id',
        'skillProfs': 'skill_profs',
        'skillExpertise': 'skill_expertise',
        'originId': 'origin_id',
        'peCur': 'pe_cur',
        'peMax': 'pe_max',
        'sanCur': 'san_cur',
        'sanMax': 'san_max',
        'nexLevel': 'nex_level',
        'nexPercent': 'nex_percent',
        'customSysName': 'custom_sys_name',
        'customStatKeys': 'custom_stat_keys',
        'customStatLabels': 'custom_stat_labels',
        'customSkills': 'custom_skills',
        'customDiceSet': 'custom_dice_set',
        'customTheme': 'custom_theme',
        'customResources': 'custom_resources',
    }
    for key, value in data.items():
        attr = key_map.get(key, key)
        if hasattr(char, attr):
            setattr(char, attr, value)

    db.session.commit()
    return jsonify(char_to_dict(char))


@characters_bp.route('/<user_id>/<char_id>', methods=['DELETE'])
def delete_character(user_id, char_id):
    char = Character.query.filter_by(id=char_id, user_id=user_id).first()
    if not char:
        return jsonify({'error': 'Personagem não encontrado'}), 404

    db.session.delete(char)
    db.session.commit()
    return jsonify({'message': 'Excluído com sucesso'})


def char_to_dict(char):
    return {
        'id': char.id,
        'sysId': char.sys_id,
        'name': char.name,
        'stats': char.stats,
        'hpCur': char.hp_cur,
        'hpMax': char.hp_max,
        'abilities': char.abilities,
        'equip': char.equip,
        'notes': char.notes,
        'skillTrainingLevel': char.skill_training_level,
        'skillExtraBonuses': char.skill_extra_bonuses,
        'level': char.level,
        'cls': char.cls,
        'clsId': char.cls_id,
        'race': char.race,
        'raceId': char.race_id,
        'subrace': char.subrace,
        'subraceId': char.subrace_id,
        'subclass': char.subclass,
        'subclassId': char.subclass_id,
        'slots': char.slots,
        'skillProfs': char.skill_profs,
        'skillExpertise': char.skill_expertise,
        'age': char.age,
        'origin': char.origin,
        'originId': char.origin_id,
        'peCur': char.pe_cur,
        'peMax': char.pe_max,
        'sanCur': char.san_cur,
        'sanMax': char.san_max,
        'nexLevel': char.nex_level,
        'nexPercent': char.nex_percent,
        'trilhas': char.trilhas,
        'customSysName': char.custom_sys_name,
        'customStatKeys': char.custom_stat_keys,
        'customStatLabels': char.custom_stat_labels,
        'customSkills': char.custom_skills,
        'customDiceSet': char.custom_dice_set,
        'customTheme': char.custom_theme,
        'customResources': char.custom_resources,
        'createdAt': char.created_at.isoformat(),
        'updatedAt': char.updated_at.isoformat()
    }
