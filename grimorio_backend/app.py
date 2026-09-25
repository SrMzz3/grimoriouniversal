from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os

from models import db
from routes.auth import auth_bp, bcrypt
from routes.characters import characters_bp
from routes.tables import tables_bp
from routes.admin import admin_bp
from sqlalchemy import text

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, static_folder='static', static_url_path='')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'database', 'grimorio.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

CORS(app)
bcrypt.init_app(app)
db.init_app(app)

# Rotas
app.register_blueprint(auth_bp)
app.register_blueprint(characters_bp)
app.register_blueprint(tables_bp)
app.register_blueprint(admin_bp)

# Frontend
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

# ================================================================
# MIGRAÇÃO LEVE — adiciona colunas novas em bancos já existentes
# ================================================================
NEW_USER_COLUMNS = {
    'is_admin': 'BOOLEAN DEFAULT 0',
    'achievements': 'JSON',
    'displayed_achievement': 'VARCHAR(60) DEFAULT \'\'',
    'achievement_stats': 'JSON',
}


def migrate_users_table():
    existing = [row[1] for row in db.session.execute(text('PRAGMA table_info(users)')).fetchall()]
    if not existing:
        return
    for col, ddl in NEW_USER_COLUMNS.items():
        if col not in existing:
            db.session.execute(text('ALTER TABLE users ADD COLUMN ' + col + ' ' + ddl))
            print('🔧 Coluna adicionada em users: ' + col)
    db.session.commit()


def seed_admin():
    from models import User
    from routes.auth import bcrypt as auth_bcrypt
    import uuid

    admin_username = os.getenv('ADMIN_USERNAME')
    admin_password = os.getenv('ADMIN_PASSWORD')

    if not admin_username or not admin_password:
        print('⚠️  ADMIN_USERNAME / ADMIN_PASSWORD não definidos no .env — nenhuma conta de administrador foi criada.')
        return

    # Já existe algum administrador? Não mexe em nada (a senha só é
    # trocada pelo change_admin_password.py, nunca sozinho ao reiniciar).
    if User.query.filter_by(is_admin=True).first():
        return

    existing = User.query.filter_by(username=admin_username).first()
    if existing:
        existing.is_admin = True
        if 'im_purpleflower' not in (existing.achievements or []):
            existing.achievements = list(existing.achievements or []) + ['im_purpleflower']
        db.session.commit()
        print('👑 Conta existente "' + admin_username + '" promovida a administradora!')
        return

    admin = User(
        id=str(uuid.uuid4()),
        username=admin_username,
        email='admin@grimorio.com',
        password_hash=auth_bcrypt.generate_password_hash(admin_password).decode('utf-8'),
        display_name=admin_username,
        bio='Administrador do Grimório Universal',
        frame='royal',
        is_admin=True,
        achievements=['im_purpleflower'],
        displayed_achievement='im_purpleflower',
        achievement_stats={}
    )
    db.session.add(admin)
    db.session.commit()
    print('👑 Conta administradora "' + admin_username + '" criada!')


# Criar banco
with app.app_context():
    os.makedirs(os.path.join(BASE_DIR, 'database'), exist_ok=True)
    db.create_all()
    migrate_users_table()
    seed_admin()
    print('✅ Banco de dados criado!')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
