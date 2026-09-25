/* js/ui/admin-panel.js — Painel do Administrador */

const AdminPanel = (() => {

  let selectedUser = null;
  let usersCache = [];

  // ============================================================
  // ESTILOS
  // ============================================================
  function injectStyles() {
    if (document.getElementById('admin-styles')) return;
    const style = document.createElement('style');
    style.id = 'admin-styles';
    style.textContent = `
      .admin-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 16px;
        align-items: start;
      }
      @media (max-width: 820px) {
        .admin-layout { grid-template-columns: 1fr; }
      }

      .admin-user-row {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 9px 12px;
        margin-bottom: 6px;
        background: var(--parch-3);
        border: 1px solid var(--border);
        border-radius: var(--r);
        color: var(--ink);
        cursor: pointer;
        text-align: left;
        transition: all var(--t-fast);
      }
      .admin-user-row:hover {
        border-color: var(--gold-dim);
        background: var(--parch-4);
      }
      .admin-user-row.active {
        border-color: var(--gold);
        background: rgba(212,184,75,.1);
      }
      .admin-user-row .au-name {
        font-weight: 600;
        font-size: 14px;
      }
      .admin-user-row .au-sub {
        font-size: 11px;
        color: var(--ink-faint);
      }

      .admin-ach-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: var(--r);
        border: 1px solid;
        background: rgba(0,0,0,.35);
        font-size: 12px;
        margin: 0 6px 6px 0;
      }
      .admin-ach-chip button {
        background: none;
        border: none;
        color: var(--red);
        cursor: pointer;
        font-size: 13px;
        line-height: 1;
        padding: 0 0 0 2px;
      }

      .admin-field {
        width: 100%;
        padding: 9px 12px;
        background: var(--parch-2);
        border: 1px solid var(--border);
        border-radius: var(--r);
        color: var(--ink);
        font-size: 14px;
        font-family: inherit;
      }
      .admin-field:focus { border-color: var(--gold-dim); outline: none; }

      .admin-label {
        display: block;
        font-family: 'Cinzel', serif;
        font-size: 11px;
        letter-spacing: .06em;
        color: var(--ink-faint);
        margin-bottom: 5px;
        margin-top: 12px;
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // GUARDA DE ACESSO
  // ============================================================
  function canAccess() {
    return Account.isAdmin();
  }

  // ============================================================
  // LISTA DE USUÁRIOS
  // ============================================================
  function renderUserList(container, search) {
    container.innerHTML = '<p style="color:var(--ink-faint);font-size:13px;padding:10px;">Carregando…</p>';

    Account.listUsers(search)
      .then(function(users) {
        usersCache = users || [];
        container.innerHTML = '';

        if (!usersCache.length) {
          container.innerHTML = '<p style="color:var(--ink-faint);font-size:13px;padding:10px;">Nenhum usuário encontrado.</p>';
          return;
        }

        usersCache.forEach(function(u) {
          const row = document.createElement('button');
          row.className = 'admin-user-row' + (selectedUser && selectedUser.id === u.id ? ' active' : '');

          const info = document.createElement('div');
          info.style.flex = '1';
          info.style.minWidth = '0';

          const nameEl = document.createElement('div');
          nameEl.className = 'au-name';
          nameEl.textContent = (u.isAdmin ? '👑 ' : '') + (u.displayName || u.username);
          info.appendChild(nameEl);

          const sub = document.createElement('div');
          sub.className = 'au-sub';
          sub.textContent = '@' + u.username + ' · ' + (u.achievements || []).length + ' conquistas';
          info.appendChild(sub);

          row.appendChild(info);

          row.addEventListener('click', function() {
            selectedUser = u;
            try { Dice.sounds.click(); } catch (e) {}
            refresh();
          });

          container.appendChild(row);
        });
      })
      .catch(function(err) {
        container.innerHTML = '<p style="color:var(--red);font-size:13px;padding:10px;">' + (err.message || err) + '</p>';
      });
  }

  // ============================================================
  // DETALHES DO USUÁRIO
  // ============================================================
  function renderUserDetail(container) {
    container.innerHTML = '';

    if (!selectedUser) {
      container.innerHTML = '<p style="color:var(--ink-faint);text-align:center;padding:40px;">Selecione um usuário à esquerda.</p>';
      return;
    }

    const user = selectedUser;

    // ── Cabeçalho ──
    const head = document.createElement('div');
    head.style.marginBottom = '14px';
    head.innerHTML =
      '<div style="font-family:\'Cinzel\',serif;font-size:22px;color:var(--gold);">' +
        (user.isAdmin ? '👑 ' : '') + escapeHtml(user.displayName || user.username) +
      '</div>' +
      '<div style="font-size:12px;color:var(--ink-faint);margin-top:3px;">@' + escapeHtml(user.username) +
        ' · ID: ' + escapeHtml((user.id || '').slice(0, 8)) + '</div>';
    container.appendChild(head);

    // ── Conquistas do usuário ──
    const achTitle = document.createElement('div');
    achTitle.className = 'card-title';
    achTitle.textContent = '🏆 Conquistas (' + (user.achievements || []).length + ')';
    container.appendChild(achTitle);

    const chips = document.createElement('div');
    chips.style.marginBottom = '10px';

    if (!(user.achievements || []).length) {
      chips.innerHTML = '<p style="color:var(--ink-faint);font-size:13px;">Nenhuma conquista ainda.</p>';
    } else {
      user.achievements.forEach(function(id) {
        const def = Achievements.get(id) || { id: id, icon: '❔', title: id, rarity: 'comum' };
        const rar = Achievements.rarityInfo(def.rarity);

        const chip = document.createElement('span');
        chip.className = 'admin-ach-chip';
        chip.style.borderColor = rar.color;
        chip.style.color = rar.color;

        const txt = document.createElement('span');
        txt.textContent = (def.icon || '🏆') + ' ' + def.title;
        chip.appendChild(txt);

        const del = document.createElement('button');
        del.textContent = '✕';
        del.title = 'Tirar conquista';
        del.addEventListener('click', function() {
          Account.revokeAchievement(user.id, id)
            .then(function(updated) {
              selectedUser = updated;
              Toast.success('Conquista removida de @' + user.username + '.');
              refresh();
            })
            .catch(function(err) { Toast.error(err.message || err); });
        });
        chip.appendChild(del);

        chips.appendChild(chip);
      });
    }
    container.appendChild(chips);

    // ── Dar conquista ──
    const giveLabel = document.createElement('label');
    giveLabel.className = 'admin-label';
    giveLabel.textContent = 'Dar conquista';
    container.appendChild(giveLabel);

    const giveRow = document.createElement('div');
    giveRow.style.display = 'flex';
    giveRow.style.gap = '8px';
    giveRow.style.flexWrap = 'wrap';

    const select = document.createElement('select');
    select.className = 'admin-field';
    select.style.flex = '1';
    select.style.minWidth = '200px';

    const owned = user.achievements || [];
    Achievements.all()
      .filter(function(a) { return owned.indexOf(a.id) === -1; })
      .filter(function(a) { return !a.adminOnly || user.isAdmin; })
      .forEach(function(a) {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = (a.icon || '🏆') + '  ' + a.title + '  (' + Achievements.rarityInfo(a.rarity).label + ')';
        select.appendChild(opt);
      });

    if (!select.children.length) {
      const opt = document.createElement('option');
      opt.textContent = 'Esse usuário já tem tudo';
      opt.disabled = true;
      select.appendChild(opt);
      select.disabled = true;
    }
    giveRow.appendChild(select);

    const giveBtn = document.createElement('button');
    giveBtn.className = 'btn-gold';
    giveBtn.textContent = '🎁 Dar conquista';
    giveBtn.disabled = select.disabled;
    giveBtn.addEventListener('click', function() {
      const id = select.value;
      if (!id) return;
      Account.grantAchievement(user.id, id)
        .then(function(updated) {
          selectedUser = updated;
          Toast.success('Conquista entregue para @' + user.username + '.', '🎁 Feito');
          try { Dice.sounds.magic(); } catch (e) {}
          refresh();
        })
        .catch(function(err) { Toast.error(err.message || err); });
    });
    giveRow.appendChild(giveBtn);

    container.appendChild(giveRow);
  }

  // ============================================================
  // CRIAR CONQUISTA CUSTOMIZADA
  // ============================================================
  function renderCreateForm(container) {
    container.innerHTML = '';

    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = '✨ Criar Conquista Customizada';
    container.appendChild(title);

    // Título
    const lblTitle = document.createElement('label');
    lblTitle.className = 'admin-label';
    lblTitle.textContent = 'Título';
    container.appendChild(lblTitle);

    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.className = 'admin-field';
    inputTitle.placeholder = 'Ex: Lenda Viva';
    container.appendChild(inputTitle);

    // Descrição
    const lblDesc = document.createElement('label');
    lblDesc.className = 'admin-label';
    lblDesc.textContent = 'Descrição';
    container.appendChild(lblDesc);

    const inputDesc = document.createElement('textarea');
    inputDesc.className = 'admin-field';
    inputDesc.rows = 2;
    inputDesc.style.resize = 'vertical';
    inputDesc.placeholder = 'O que o jogador fez para merecer isso?';
    container.appendChild(inputDesc);

    // Raridade
    const lblRarity = document.createElement('label');
    lblRarity.className = 'admin-label';
    lblRarity.textContent = 'Raridade';
    container.appendChild(lblRarity);

    const selRarity = document.createElement('select');
    selRarity.className = 'admin-field';
    [['comum', 'Comum'], ['raro', 'Raro'], ['epico', 'Épico'], ['lendario', 'Lendário'], ['mitico', 'Mítico']]
      .forEach(function(pair) {
        const opt = document.createElement('option');
        opt.value = pair[0];
        opt.textContent = pair[1];
        selRarity.appendChild(opt);
      });
    container.appendChild(selRarity);

    // Ícone (seletor nativo do sistema)
    const lblIcon = document.createElement('label');
    lblIcon.className = 'admin-label';
    lblIcon.textContent = 'Ícone (emoji)';
    container.appendChild(lblIcon);

    const iconRow = document.createElement('div');
    iconRow.style.display = 'flex';
    iconRow.style.gap = '8px';
    iconRow.style.alignItems = 'center';

    const inputIcon = document.createElement('input');
    inputIcon.type = 'text';
    inputIcon.className = 'admin-field';
    inputIcon.value = '✨';
    inputIcon.maxLength = 8;
    inputIcon.style.width = '90px';
    inputIcon.style.flex = '0 0 auto';
    inputIcon.style.textAlign = 'center';
    inputIcon.style.fontSize = '22px';
    iconRow.appendChild(inputIcon);

    const emojiBtn = document.createElement('button');
    emojiBtn.className = 'btn-ghost';
    emojiBtn.textContent = '😀 Escolher emoji';
    emojiBtn.title = 'Abre o seletor de emoji do sistema';
    emojiBtn.addEventListener('click', function() {
      inputIcon.focus();
      // Tenta abrir o seletor nativo do SO/navegador
      let opened = false;
      try {
        if (window.navigator && 'virtualKeyboard' in navigator) {
          navigator.virtualKeyboard.show();
          opened = true;
        }
      } catch (e) {}
      if (!opened) {
        Toast.info(
          'Windows: Win + .  ·  Mac: Cmd + Ctrl + Espaço  ·  Celular: teclado de emoji. Ou digite direto no campo.',
          '😀 Seletor de emoji'
        );
      }
    });
    iconRow.appendChild(emojiBtn);

    container.appendChild(iconRow);

    // Criar
    const createBtn = document.createElement('button');
    createBtn.className = 'btn-gold';
    createBtn.textContent = '✦ Criar';
    createBtn.style.width = '100%';
    createBtn.style.marginTop = '16px';
    createBtn.addEventListener('click', function() {
      const t = inputTitle.value.trim();
      if (!t) {
        Toast.warning('Dê um título para a conquista.');
        return;
      }
      Account.createCustomAchievement({
        title: t,
        desc: inputDesc.value.trim(),
        icon: inputIcon.value.trim() || '✨',
        rarity: selRarity.value
      })
        .then(function(created) {
          Toast.success('"' + created.title + '" já pode ser entregue.', '✨ Conquista criada');
          try { Dice.sounds.magic(); } catch (e) {}
          inputTitle.value = '';
          inputDesc.value = '';
          inputIcon.value = '✨';
          refresh();
        })
        .catch(function(err) { Toast.error(err.message || err); });
    });
    container.appendChild(createBtn);

    // ── Lista de customizadas existentes ──
    const listTitle = document.createElement('div');
    listTitle.className = 'card-title';
    listTitle.style.marginTop = '20px';
    listTitle.textContent = '📦 Conquistas Customizadas';
    container.appendChild(listTitle);

    const list = document.createElement('div');
    container.appendChild(list);

    Account.listCustomAchievements().then(function(items) {
      if (!items || !items.length) {
        list.innerHTML = '<p style="color:var(--ink-faint);font-size:13px;">Nenhuma ainda.</p>';
        return;
      }
      items.forEach(function(a) {
        const rar = Achievements.rarityInfo(a.rarity);
        const chip = document.createElement('span');
        chip.className = 'admin-ach-chip';
        chip.style.borderColor = rar.color;
        chip.style.color = rar.color;

        const txt = document.createElement('span');
        txt.textContent = (a.icon || '✨') + ' ' + a.title;
        chip.appendChild(txt);

        const del = document.createElement('button');
        del.textContent = '🗑️';
        del.title = 'Excluir conquista';
        del.addEventListener('click', function() {
          Modal.confirm('Excluir "' + a.title + '"? Ela será removida de todos os usuários.', {
            title: '⚠️ Excluir conquista',
            icon: '🗑️',
            confirmText: 'Excluir'
          }).then(function(ok) {
            if (!ok) return;
            Account.deleteCustomAchievement(a.id)
              .then(function() {
                Toast.success('Conquista excluída.');
                if (selectedUser) {
                  return Account.getUser(selectedUser.id).then(function(u) { selectedUser = u; });
                }
              })
              .then(refresh)
              .catch(function(err) { Toast.error(err.message || err); });
          });
        });
        chip.appendChild(del);

        list.appendChild(chip);
      });
    });
  }

  // ============================================================
  // RENDER GERAL
  // ============================================================
  function refresh() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = '';
    app.appendChild(render());
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render() {
    injectStyles();

    // ── Verificação de acesso (segunda camada) ──
    if (!canAccess()) {
      Toast.error('Você não tem permissão para acessar o painel do administrador.', '🔒 Acesso negado');
      setTimeout(function() { App.go('select'); }, 50);
      const denied = document.createElement('div');
      denied.className = 'page';
      denied.innerHTML = '<p style="color:var(--red);text-align:center;padding:60px;">🔒 Acesso negado.</p>';
      return denied;
    }

    try { Particles.setSystem('default'); } catch (e) {}
    try { Achievements.trackScreenOpen('admin'); } catch (e) {}

    const wrap = document.createElement('div');
    wrap.className = 'page screen-enter';
    wrap.style.maxWidth = '1100px';
    wrap.style.margin = '0 auto';

    // ── Header ──
    const header = document.createElement('div');
    header.className = 'build-header fu';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn-ghost';
    backBtn.textContent = '← Voltar';
    backBtn.addEventListener('click', function() {
      selectedUser = null;
      try { Dice.sounds.page(); } catch (e) {}
      App.go('select');
    });
    header.appendChild(backBtn);

    const info = document.createElement('div');
    info.innerHTML = '<div class="build-title" style="color:var(--gold);">👑 Painel do Administrador</div>' +
                     '<div class="build-flavor">Controle total do Grimório</div>';
    header.appendChild(info);
    wrap.appendChild(header);

    // ── Layout ──
    const layout = document.createElement('div');
    layout.className = 'admin-layout';

    // Coluna esquerda: usuários
    const leftCard = document.createElement('div');
    leftCard.className = 'card';

    const leftTitle = document.createElement('div');
    leftTitle.className = 'card-title';
    leftTitle.textContent = '👥 Usuários';
    leftCard.appendChild(leftTitle);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'admin-field';
    searchInput.placeholder = '🔍 Buscar usuário…';
    searchInput.style.marginBottom = '10px';
    leftCard.appendChild(searchInput);

    const userList = document.createElement('div');
    userList.style.maxHeight = '420px';
    userList.style.overflowY = 'auto';
    leftCard.appendChild(userList);

    let searchTimer = null;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimer);
      const val = searchInput.value.trim();
      searchTimer = setTimeout(function() { renderUserList(userList, val); }, 250);
    });

    renderUserList(userList, '');
    layout.appendChild(leftCard);

    // Coluna direita
    const rightCol = document.createElement('div');
    rightCol.style.display = 'flex';
    rightCol.style.flexDirection = 'column';
    rightCol.style.gap = '16px';

    const detailCard = document.createElement('div');
    detailCard.className = 'card';
    renderUserDetail(detailCard);
    rightCol.appendChild(detailCard);

    const createCard = document.createElement('div');
    createCard.className = 'card';
    renderCreateForm(createCard);
    rightCol.appendChild(createCard);

    layout.appendChild(rightCol);
    wrap.appendChild(layout);

    return wrap;
  }

  return { render: render, canAccess: canAccess };

})();

window.AdminPanel = AdminPanel;
console.log('✅ AdminPanel carregado!');
