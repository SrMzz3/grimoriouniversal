from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import uuid

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(200), nullable=False)
    display_name = db.Column(db.String(80))
    avatar = db.Column(db.Text, default='')
    frame = db.Column(db.String(50), default='none')
    background = db.Column(db.Text, default='')
    bg_brightness = db.Column(db.Integer, default=25)
    bio = db.Column(db.Text, default='')
    recovery_keyword = db.Column(db.String(100), default='')
    is_admin = db.Column(db.Boolean, default=False)
    achievements = db.Column(db.JSON, default=[])
    displayed_achievement = db.Column(db.String(60), default='')
    achievement_stats = db.Column(db.JSON, default={})
    login_attempts = db.Column(db.Integer, default=0)
    blocked_until = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    characters = db.relationship('Character', backref='user', lazy=True, cascade='all, delete-orphan')

class Character(db.Model):
    __tablename__ = 'characters'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'))
    sys_id = db.Column(db.String(20), default='custom')
    name = db.Column(db.String(100), nullable=False)
    stats = db.Column(db.JSON, default={})
    hp_cur = db.Column(db.Integer, default=0)
    hp_max = db.Column(db.Integer, default=0)
    abilities = db.Column(db.JSON, default=[])
    equip = db.Column(db.JSON, default=[])
    notes = db.Column(db.Text, default='')
    skill_training_level = db.Column(db.JSON, default={})
    skill_extra_bonuses = db.Column(db.JSON, default={})
    # D&D
    level = db.Column(db.Integer, default=1)
    cls = db.Column(db.String(50), default='')
    cls_id = db.Column(db.String(50), default='')
    race = db.Column(db.String(50), default='')
    race_id = db.Column(db.String(50), default='')
    subrace = db.Column(db.String(50), nullable=True)
    subrace_id = db.Column(db.String(50), nullable=True)
    subclass = db.Column(db.String(50), nullable=True)
    subclass_id = db.Column(db.String(50), nullable=True)
    slots = db.Column(db.JSON, default={})
    skill_profs = db.Column(db.JSON, default={})
    skill_expertise = db.Column(db.JSON, default={})
    # OP
    age = db.Column(db.String(20), default='')
    origin = db.Column(db.String(50), default='')
    origin_id = db.Column(db.String(50), default='')
    pe_cur = db.Column(db.Integer, default=0)
    pe_max = db.Column(db.Integer, default=0)
    san_cur = db.Column(db.Integer, default=0)
    san_max = db.Column(db.Integer, default=0)
    nex_level = db.Column(db.Integer, default=0)
    nex_percent = db.Column(db.Integer, default=0)
    trilhas = db.Column(db.JSON, default={})
    # Custom
    custom_sys_name = db.Column(db.String(100), default='Sistema Próprio')
    custom_stat_keys = db.Column(db.JSON, default=[])
    custom_stat_labels = db.Column(db.JSON, default={})
    custom_skills = db.Column(db.JSON, default=[])
    custom_dice_set = db.Column(db.JSON, default=['d4', 'd6', 'd8', 'd10', 'd12', 'd20'])
    custom_theme = db.Column(db.String(50), default='arcano')
    custom_resources = db.Column(db.JSON, default=[])

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Table(db.Model):
    __tablename__ = 'tables'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(120), default='Mesa de Aventura')
    master_id = db.Column(db.String(36), nullable=False)
    members = db.Column(db.JSON, default=[])
    characters = db.Column(db.JSON, default=[])
    messages = db.Column(db.JSON, default=[])
    rolls = db.Column(db.JSON, default=[])
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Table {self.id} {self.name}>'


class CustomAchievement(db.Model):
    __tablename__ = 'custom_achievements'

    id = db.Column(db.String(60), primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, default='')
    icon = db.Column(db.String(20), default='\u2728')
    rarity = db.Column(db.String(20), default='comum')
    created_by = db.Column(db.String(36), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'desc': self.description,
            'icon': self.icon,
            'rarity': self.rarity,
            'custom': True,
        }
