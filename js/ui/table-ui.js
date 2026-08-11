/* js/ui/table-ui.js — Interface com Controle de Acesso */

const TableUI = (() => {

  // ── Renderizar Gerenciador de Mesas ──
  function renderTableManager() {
    var wrap = document.createElement('div');
    wrap.className = 'card';
    wrap.style.marginTop = '16px';
    
    var title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = '🎲 Mesas e Compartilhamento';
    wrap.appendChild(title);
    
    var createBtn = document.createElement('button');
    createBtn.className = 'btn-gold';
    createBtn.textContent = '✦ Criar Nova Mesa';
    createBtn.style.width = '100%';
    createBtn.style.marginBottom = '12px';
    createBtn.addEventListener('click', function() {
      var name = prompt('Nome da mesa:');
      if (name) {
        TableSystem.createTable(name)
          .then(function() { renderTableManager(); })
          .catch(function(err) { alert('Erro: ' + err); });
      }
    });
    wrap.appendChild(createBtn);
    
    var listContainer = document.createElement('div');
    listContainer.id = 'table-list';
    wrap.appendChild(listContainer);
    
    TableSystem.getUserTables()
      .then(function(tables) {
        if (tables.length === 0) {
          listContainer.innerHTML = '<p style="color:var(--ink-faint);text-align:center;padding:20px;">Nenhuma mesa. Crie uma ou entre em uma!</p>';
          return;
        }
        
        tables.forEach(function(table) {
          var card = document.createElement('div');
          card.style.background = 'var(--parch-3)';
          card.style.border = '1px solid var(--border)';
          card.style.borderRadius = 'var(--r-md)';
          card.style.padding = '12px';
          card.style.marginBottom = '8px';
          card.style.display = 'flex';
          card.style.justifyContent = 'space-between';
          card.style.alignItems = 'center';
          
          var info = document.createElement('div');
          info.innerHTML = '<div style="font-weight:600;">' + (table.name || 'Mesa ' + table.id) + '</div><div style="font-size:12px;color:var(--ink-faint);">ID: ' + table.id + '</div>';
          card.appendChild(info);
          
          var actions = document.createElement('div');
          actions.style.display = 'flex';
          actions.style.gap = '8px';
          
          var enterBtn = document.createElement('button');
          enterBtn.className = 'btn-ghost';
          enterBtn.textContent = 'Entrar';
          enterBtn.addEventListener('click', function() { openTable(table.id); });
          actions.appendChild(enterBtn);
          
          var leaveBtn = document.createElement('button');
          leaveBtn.className = 'btn-del';
          leaveBtn.textContent = 'Sair';
          leaveBtn.style.padding = '6px 12px';
          leaveBtn.style.border = '1px solid var(--crimson)';
          leaveBtn.style.borderRadius = 'var(--r)';
          leaveBtn.style.color = 'var(--crimson)';
          leaveBtn.addEventListener('click', function() {
            if (confirm('Sair da mesa?')) {
              TableSystem.leaveTable(table.id)
                .then(function() { renderTableManager(); })
                .catch(function(err) { alert('Erro: ' + err); });
            }
          });
          actions.appendChild(leaveBtn);
          
          card.appendChild(actions);
          listContainer.appendChild(card);
        });
        
        var joinRow = document.createElement('div');
        joinRow.style.marginTop = '12px';
        joinRow.style.display = 'flex';
        joinRow.style.gap = '8px';
        joinRow.style.alignItems = 'center';
        
        var joinInput = document.createElement('input');
        joinInput.type = 'text';
        joinInput.placeholder = 'ID da mesa para entrar';
        joinInput.style.flex = '1';
        joinInput.id = 'join-table-input';
        joinRow.appendChild(joinInput);
        
        var joinBtn = document.createElement('button');
        joinBtn.className = 'btn-ghost';
        joinBtn.textContent = 'Entrar';
        joinBtn.addEventListener('click', function() {
          var id = document.getElementById('join-table-input').value.trim();
          if (id) {
            TableSystem.joinTable(id)
              .then(function() {
                document.getElementById('join-table-input').value = '';
                renderTableManager();
              })
              .catch(function(err) { alert('Erro: ' + err.message); });
          }
        });
        joinRow.appendChild(joinBtn);
        listContainer.appendChild(joinRow);
      })
      .catch(function(err) {
        listContainer.innerHTML = '<p style="color:var(--red);">Erro ao carregar mesas: ' + err + '</p>';
      });
    
    return wrap;
  }

  // ── Abrir Mesa ──
  function openTable(tableId) {
    var app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(renderTableScreen(tableId));
  }

  // ── Verificar link de mesa na URL ──
  function checkTableLink() {
    var urlParams = new URLSearchParams(window.location.search);
    var tableId = urlParams.get('table');
    
    if (tableId) {
      TableSystem.joinTable(tableId)
        .then(function() {
          window.history.replaceState({}, document.title, window.location.pathname);
          openTable(tableId);
        })
        .catch(function(err) {
          alert('Erro ao entrar na mesa: ' + err.message);
        });
      return true;
    }
    return false;
  }

  // ── Renderizar Lista de Personagens da Mesa ──
  function renderCharactersList(tableId, chars, currentUserId) {
    const container = document.createElement('div');
    container.id = 'table-characters';

    if (!chars || chars.length === 0) {
      container.innerHTML = '<p style="color:var(--ink-faint);text-align:center;padding:20px;">Nenhum personagem compartilhado ainda.</p>';
      return container;
    }

    chars.forEach(char => {
      const item = document.createElement('div');
      item.style.background = 'var(--parch-3)';
      item.style.border = '1px solid var(--border)';
      item.style.borderRadius = 'var(--r)';
      item.style.padding = '8px 12px';
      item.style.marginBottom = '4px';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';

      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = '8px';

      // Avatar
      const avatar = document.createElement('img');
      avatar.src = char.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%2328251c"/%3E%3Ctext x="50" y="120" font-size="80" fill="%23c8a84b"%3E👤%3C/text%3E%3C/svg%3E';
      avatar.style.width = '32px';
      avatar.style.height = '32px';
      avatar.style.borderRadius = '50%';
      avatar.style.objectFit = 'cover';
      avatar.style.background = 'var(--parch-3)';
      left.appendChild(avatar);

      const info = document.createElement('div');
      let infoHtml = `<div style="font-weight:600;">${char.name || 'Sem nome'}</div>`;
      infoHtml += `<div style="font-size:11px;color:var(--ink-faint);">${char.username || '—'} · ${char.sysId || 'custom'}`;
      
      // Mostra se é o dono
      if (char.isOwner) {
        infoHtml += ` · <span style="color:var(--gold);">👑 Dono</span>`;
      }
      
      // Mostra se tem acesso completo
      if (char.canViewFull && !char.isOwner) {
        infoHtml += ` · <span style="color:var(--op-cyan);">🔓 Acesso total</span>`;
      }
      
      // Mostra status de HP
      if (char.hpMax > 0) {
        const pct = Math.round((char.hpCur || 0) / char.hpMax * 100);
        const color = pct > 50 ? 'var(--green)' : pct > 25 ? 'var(--yellow)' : 'var(--red)';
        infoHtml += ` · <span style="color:${color};">❤️ ${char.hpCur}/${char.hpMax}</span>`;
      }
      
      infoHtml += `</div>`;
      info.innerHTML = infoHtml;
      left.appendChild(info);
      item.appendChild(left);

      // ── Botão de ação ──
      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '4px';

      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-ghost';
      
      // Só mostra "Ver Ficha" se tiver acesso
      if (char.canViewFull || char.isOwner) {
        viewBtn.textContent = '📄 Ver Ficha';
        viewBtn.style.fontSize = '11px';
        viewBtn.style.padding = '4px 10px';
        viewBtn.addEventListener('click', function() {
          // Carrega a ficha completa
          TableSystem.getCharacterWithPermission(tableId, char.id, currentUserId)
            .then(fullChar => {
              const charInstance = CharacterFactory.create(fullChar);
              App.setChar(charInstance);
              App.go('sheet');
            })
            .catch(err => alert('Erro: ' + err));
        });
      } else {
        viewBtn.textContent = '👤 Ver Perfil';
        viewBtn.style.fontSize = '11px';
        viewBtn.style.padding = '4px 10px';
        viewBtn.addEventListener('click', function() {
          // Mostra só o perfil público
          alert(`👤 ${char.name}\n📋 ${char.cls || 'Sem classe'} · Nível ${char.level || 1}\n❤️ ${char.hpCur}/${char.hpMax}`);
        });
      }
      actions.appendChild(viewBtn);

      // ── Mestre pode dar permissão ──
      if (char.canViewFull && char.isMaster && !char.isOwner && !char.visibility?.canViewFull?.includes(currentUserId)) {
        const grantBtn = document.createElement('button');
        grantBtn.className = 'btn-ghost';
        grantBtn.textContent = '🔓 Dar Acesso';
        grantBtn.style.fontSize = '11px';
        grantBtn.style.padding = '4px 10px';
        grantBtn.style.borderColor = 'var(--gold)';
        grantBtn.style.color = 'var(--gold)';
        grantBtn.addEventListener('click', function() {
          TableSystem.grantViewPermission(tableId, char.id, currentUserId)
            .then(() => {
              alert('✅ Acesso concedido!');
              renderTableScreen(tableId);
            })
            .catch(err => alert('Erro: ' + err));
        });
        actions.appendChild(grantBtn);
      }

      item.appendChild(actions);
      container.appendChild(item);
    });

    return container;
  }

  // ── Renderizar Tela da Mesa (atualizada) ──
  function renderTableScreen(tableId) {
    const wrap = document.createElement('div');
    wrap.className = 'page screen-enter';
    wrap.style.maxWidth = '1000px';
    wrap.style.margin = '0 auto';

    const user = StorageAdapter.getCurrentUser();
    if (!user) {
      wrap.innerHTML = '<p style="color:var(--red);">Nenhum usuário logado.</p>';
      return wrap;
    }

    // ── Header ──
    const header = document.createElement('div');
    header.className = 'build-header fu';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-ghost';
    backBtn.textContent = '← Voltar';
    backBtn.addEventListener('click', function() {
      App.go('select');
    });
    header.appendChild(backBtn);
    
    const info = document.createElement('div');
    // Verifica se é mestre
    TableSystem.getUserRole(tableId, user.id)
      .then(role => {
        const isMaster = role === 'master';
        info.innerHTML = `
          <div class="build-title" style="color:var(--op-cyan);">🎲 Mesa: ${tableId}</div>
          <div class="build-flavor">${isMaster ? '👑 Você é o MESTRE' : '🎮 Você é JOGADOR'}</div>
        `;
      });
    header.appendChild(info);
    wrap.appendChild(header);

    // ── Grid ──
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = '1fr 1fr';
    grid.style.gap = '16px';

    // ── Coluna Esquerda: Personagens ──
    const leftCol = document.createElement('div');
    leftCol.className = 'col';

    const charsCard = document.createElement('div');
    charsCard.className = 'card';
    const charsTitle = document.createElement('div');
    charsTitle.className = 'card-title';
    charsTitle.textContent = '👥 Personagens da Mesa';
    charsCard.appendChild(charsTitle);

    const charsList = document.createElement('div');
    charsList.id = 'table-characters';
    charsList.innerHTML = '<p style="color:var(--ink-faint);text-align:center;padding:20px;">Carregando...</p>';
    charsCard.appendChild(charsList);

    // ── Botão Compartilhar ──
    const shareSection = document.createElement('div');
    shareSection.style.marginTop = '12px';
    shareSection.style.paddingTop = '12px';
    shareSection.style.borderTop = '1px solid var(--border)';

    const shareBtn = document.createElement('button');
    shareBtn.className = 'btn-gold';
    shareBtn.textContent = '📤 Compartilhar Personagem Atual';
    shareBtn.style.width = '100%';
    shareBtn.addEventListener('click', function() {
      const char = App.getChar();
      if (!char) {
        alert('Nenhum personagem carregado!');
        return;
      }
      TableSystem.shareCharacter(char, tableId)
        .then(() => loadCharacters());
    });
    shareSection.appendChild(shareBtn);
    charsCard.appendChild(shareSection);

    leftCol.appendChild(charsCard);
    grid.appendChild(leftCol);

    // ── Coluna Direita: Rolagens e Chat ──
    const rightCol = document.createElement('div');
    rightCol.className = 'col';

    // Rolagens
    const rollsCard = document.createElement('div');
    rollsCard.className = 'card';
    const rollsTitle = document.createElement('div');
    rollsTitle.className = 'card-title';
    rollsTitle.textContent = '🎲 Rolagens da Mesa';
    rollsCard.appendChild(rollsTitle);

    const rollsList = document.createElement('div');
    rollsList.id = 'table-rolls';
    rollsList.style.maxHeight = '200px';
    rollsList.style.overflowY = 'auto';
    rollsList.innerHTML = '<p style="color:var(--ink-faint);text-align:center;padding:20px;">Carregando...</p>';
    rollsCard.appendChild(rollsList);

    rightCol.appendChild(rollsCard);

    // Chat
    const chatCard = document.createElement('div');
    chatCard.className = 'card';
    const chatTitle = document.createElement('div');
    chatTitle.className = 'card-title';
    chatTitle.textContent = '💬 Chat da Mesa';
    chatCard.appendChild(chatTitle);

    const chatMessages = document.createElement('div');
    chatMessages.id = 'table-chat';
    chatMessages.style.maxHeight = '200px';
    chatMessages.style.overflowY = 'auto';
    chatMessages.style.marginBottom = '8px';
    chatMessages.innerHTML = '<p style="color:var(--ink-faint);text-align:center;padding:20px;">Carregando...</p>';
    chatCard.appendChild(chatMessages);

    const chatInput = document.createElement('div');
    chatInput.style.display = 'flex';
    chatInput.style.gap = '8px';

    const msgInput = document.createElement('input');
    msgInput.type = 'text';
    msgInput.placeholder = 'Digite uma mensagem...';
    msgInput.style.flex = '1';
    msgInput.id = 'chat-input';
    msgInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendChatMessage();
    });
    chatInput.appendChild(msgInput);

    const sendBtn = document.createElement('button');
    sendBtn.className = 'btn-gold';
    sendBtn.textContent = 'Enviar';
    sendBtn.style.padding = '8px 16px';
    sendBtn.addEventListener('click', sendChatMessage);
    chatInput.appendChild(sendBtn);

    chatCard.appendChild(chatInput);
    rightCol.appendChild(chatCard);

    grid.appendChild(rightCol);
    wrap.appendChild(grid);

    // ── Funções ──
    function loadCharacters() {
      TableSystem.getTableCharacters(tableId, user.id)
        .then(chars => {
          charsList.innerHTML = '';
          const list = renderCharactersList(tableId, chars, user.id);
          charsList.appendChild(list);
        })
        .catch(err => {
          charsList.innerHTML = '<p style="color:var(--red);">Erro: ' + err + '</p>';
        });
    }

    function loadRolls() {
      TableSystem.getTableRolls(tableId, 20)
        .then(rolls => {
          if (rolls.length === 0) {
            rollsList.innerHTML = '<p style="color:var(--ink-faint);text-align:center;padding:20px;">Nenhuma rolagem ainda.</p>';
            return;
          }
          rollsList.innerHTML = '';
          rolls.forEach(roll => {
            const item = document.createElement('div');
            item.style.padding = '4px 0';
            item.style.borderBottom = '1px solid var(--border)';
            item.style.fontSize = '13px';
            item.innerHTML = `
              <span style="color:var(--gold);">${roll.username || '—'}</span>
              <span style="color:var(--ink-faint);">🎲</span>
              <span>${roll.label || 'Rolagem'}</span>
              <span style="font-weight:700;color:var(--op-cyan);float:right;">${roll.total || roll.result || '?'}</span>
            `;
            rollsList.appendChild(item);
          });
        });
    }

    function loadChat() {
      TableSystem.getTableMessages(tableId, 30)
        .then(messages => {
          if (messages.length === 0) {
            chatMessages.innerHTML = '<p style="color:var(--ink-faint);text-align:center;padding:20px;">Nenhuma mensagem ainda.</p>';
            return;
          }
          chatMessages.innerHTML = '';
          messages.reverse().forEach(msg => {
            const item = document.createElement('div');
            item.style.padding = '4px 8px';
            item.style.marginBottom = '2px';
            item.style.background = 'var(--parch-3)';
            item.style.borderRadius = 'var(--r)';
            item.style.fontSize = '13px';
            item.innerHTML = `
              <span style="color:var(--gold);font-weight:600;">${msg.username || '—'}</span>
              <span style="color:var(--ink-dim);">${msg.message}</span>
              <span style="float:right;font-size:10px;color:var(--ink-faint);">${new Date(msg.timestamp).toLocaleTimeString()}</span>
            `;
            chatMessages.appendChild(item);
          });
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    function sendChatMessage() {
      const input = document.getElementById('chat-input');
      const msg = input.value.trim();
      if (!msg) return;
      
      TableSystem.sendMessage(tableId, msg)
        .then(() => {
          input.value = '';
          loadChat();
        })
        .catch(err => alert('Erro: ' + err));
    }

    // ── Watch em tempo real ──
    let watcher = null;
    function startWatch() {
      watcher = TableSystem.watchTable(tableId, function(doc) {
        if (doc.type === 'shared_character') loadCharacters();
        else if (doc.type === 'roll') loadRolls();
        else if (doc.type === 'message') loadChat();
      });
    }

    loadCharacters();
    loadRolls();
    loadChat();
    startWatch();

    return wrap;
  }

  // ── API Pública ──
  return {
    renderTableManager: renderTableManager,
    renderTableScreen: renderTableScreen,
    openTable: openTable,
    checkTableLink: checkTableLink,
    TableSystem: TableSystem
  };

})();

window.TableUI = TableUI;
console.log('✅ TableUI carregado!');

