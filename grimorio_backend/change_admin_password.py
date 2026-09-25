"""
change_admin_password.py — Troca a senha (e opcionalmente o nome de
usuário) da conta administradora, direto no banco.

Uso:
    python change_admin_password.py

Roda com a venv ativada, na mesma pasta do app.py.
"""

import getpass
import sys

from app import app
from models import db, User
from routes.auth import bcrypt


def main():
    with app.app_context():
        admins = User.query.filter_by(is_admin=True).all()

        if not admins:
            print('❌ Nenhuma conta administradora encontrada no banco.')
            print('   Rode o servidor (python app.py) pelo menos uma vez com')
            print('   ADMIN_USERNAME e ADMIN_PASSWORD definidos no .env primeiro.')
            sys.exit(1)

        if len(admins) == 1:
            admin = admins[0]
        else:
            print('Mais de uma conta administradora encontrada:')
            for i, a in enumerate(admins):
                print(f'  [{i}] {a.username}')
            idx = input('Qual delas? (número): ').strip()
            try:
                admin = admins[int(idx)]
            except (ValueError, IndexError):
                print('❌ Opção inválida.')
                sys.exit(1)

        print(f'\nEditando a conta: {admin.username}')

        new_username = input(
            f'Novo nome de usuário (Enter para manter "{admin.username}"): '
        ).strip()

        new_password = getpass.getpass('Nova senha (Enter para não trocar): ')
        confirm = ''
        if new_password:
            confirm = getpass.getpass('Confirme a nova senha: ')
            if new_password != confirm:
                print('❌ As senhas não conferem. Nada foi alterado.')
                sys.exit(1)
            if len(new_password) < 6:
                print('❌ A senha precisa ter pelo menos 6 caracteres. Nada foi alterado.')
                sys.exit(1)

        if not new_username and not new_password:
            print('Nada para alterar. Saindo.')
            return

        if new_username and new_username != admin.username:
            if User.query.filter_by(username=new_username).first():
                print(f'❌ Já existe um usuário chamado "{new_username}". Nada foi alterado.')
                sys.exit(1)
            admin.username = new_username
            admin.display_name = new_username

        if new_password:
            admin.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')

        db.session.commit()
        print(f'\n✅ Pronto! Faça login como "{admin.username}" com a nova senha.')


if __name__ == '__main__':
    main()
