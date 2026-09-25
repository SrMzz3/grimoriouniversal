/* js/ui/mesas.js — Tela de Mesas (cards estilo Genshin Impact) */

const MesasScreen = (() => {

  // ============================================================
  // ESTILOS
  // ============================================================
  function injectStyles() {
    if (document.getElementById('mesas-styles')) return;
    const style = document.createElement('style');
    style.id = 'mesas-styles';
    style.textContent = `
      .mesas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 18px;
        margin-top: 8px;
      }

      .mesa-card {
        position: relative;
        height: 190px;
        border-radius: var(--r-lg);
        overflow: hidden;
        cursor: pointer;
        border: 1px solid var(--border);
        background: var(--parch-3);
        box-shadow: var(--shadow-md);
        transition: transform var(--t-med), box-shadow var(--t-med), border-color var(--t-med);
        isolation: isolate;
      }
      .mesa-card:hover {
        transform: translateY(-4px);
        border-color: var(--gold-dim);
        box-shadow: var(--shadow-lg), 0 0 28px var(--gold-glow);
      }

      .mesa-wall {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transform: scale(1.02);
        transition: transform 1.1s ease, filter var(--t-med);
        filter: saturate(.9) brightness(.85);
        z-index: 0;
      }
      .mesa-card:hover .mesa-wall {
        transform: scale(1.09);
        filter: saturate(1.05) brightness(1);
      }

      .mesa-veil {
        position: absolute;
        inset: 0;
        z-index: 1;
        background:
          linear-gradient(to top, rgba(6,5,4,.94) 0%, rgba(6,5,4,.55) 45%, rgba(6,5,4,.25) 100%);
        transition: opacity var(--t-med);
      }

      .mesa-content {
        position: relative;
        z-index: 3;
        height: 100%;
        padding: 16px 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .mesa-top {
        display: flex;
        justify-content: flex-end;
      }

      .mesa-master-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px;
        border-radius: 12px;
        font-family: 'Cinzel', serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .12em;
        color: var(--gold-light);
        border: 1px solid var(--gold-dim);
        background: rgba(0,0,0,.55);
        backdrop-filter: blur(4px);
      }

      .mesa-name {
        font-family: 'Cinzel', serif;
        font-size: 22px;
        font-weight: 700;
        color: var(--ink);
        text-shadow: 0 2px 14px rgba(0,0,0,.95);
        line-height: 1.2;
        margin-bottom: 4px;
      }

      .mesa-bottom {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
      }

      .mesa-master-name {
        font-size: 12px;
        color: var(--ink-dim);
        text-shadow: 0 1px 8px rgba(0,0,0,.9);
        letter-spacing: .03em;
      }

      .mesa-enter {
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: .6;
        transition: opacity var(--t-med), transform var(--t-med);
        flex-shrink: 0;
      }
      .mesa-card:hover .mesa-enter {
        opacity: 1;
        transform: translateX(4px);
      }
      .mesa-enter .mesa-enter-label {
        font-family: 'Cinzel', serif;
        font-size: 11px;
        letter-spacing: .1em;
        color: var(--gold-light);
        opacity: 0;
        transform: translateX(6px);
        transition: opacity var(--t-med), transform var(--t-med);
      }
      .mesa-card:hover .mesa-enter .mesa-enter-label {
        opacity: 1;
        transform: translateX(0);
      }
      .mesa-enter .mesa-arrow {
        font-size: 19px;
        color: var(--gold);
        line-height: 1;
        transition: text-shadow var(--t-med);
      }
      .mesa-card:hover .mesa-enter .mesa-arrow {
        text-shadow: 0 0 14px var(--gold-glow-2);
      }

      .mesa-particles {
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
        overflow: hidden;
      }
      .mesa-particle {
        position: absolute;
        animation: floatParticle linear infinite;
        will-change: transform;
      }
      .mesa-particle i {
        display: block;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: var(--gold-light);
        box-shadow: 0 0 6px var(--gold-glow-2);
        opacity: .4;
        transform: scale(.7);
        animation: floatParticleFade linear infinite;
        transition: opacity var(--t-slow), transform var(--t-slow);
      }
      .mesa-card:hover .mesa-particle i {
        opacity: 1;
        transform: scale(1);
      }

      .mesas-empty {
        text-align: center;
        padding: 56px 20px;
        border: 1px dashed var(--border-2);
        border-radius: var(--r-lg);
        background: rgba(16,15,12,.55);
      }
      .mesas-empty .empty-icon {
        font-size: 58px;
        opacity: .5;
        filter: drop-shadow(0 0 20px var(--gold-glow));
      }
      .mesas-empty .empty-title {
        font-family: 'Cinzel', serif;
        font-size: 18px;
        color: var(--gold);
        margin-top: 14px;
      }
      .mesas-empty .empty-desc {
        font-size: 13.5px;
        color: var(--ink-faint);
        margin-top: 6px;
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // CARD
  // ============================================================
  function buildCard(table, userId) {
    const card = document.createElement('div');
    card.className = 'mesa-card';

    // Wallpaper
    const wall = document.createElement('div');
    wall.className = 'mesa-wall';
    if (table.wallpaper && String(table.wallpaper).trim()) {
      wall.style.backgroundImage = 'url(' + String(table.wallpaper).trim() + ')';
    } else {
      wall.style.background = 'radial-gradient(circle at 30% 20%, #2a2418 0%, #12100b 70%)';
    }
    card.appendChild(wall);

    const veil = document.createElement('div');
    veil.className = 'mesa-veil';
    card.appendChild(veil);

    // 12 partículas douradas
    const particles = document.createElement('div');
    particles.className = 'mesa-particles';
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('span');
      p.className = 'mesa-particle';
      p.style.left = (Math.random() * 96 + 2) + '%';
      p.style.top = (Math.random() * 90 + 5) + '%';
      p.style.animationDuration = (5 + Math.random() * 6).toFixed(1) + 's';
      const delay = (-Math.random() * 8).toFixed(1) + 's';
      p.style.animationDelay = delay;
      const dot = document.createElement('i');
      dot.style.animationDuration = p.style.animationDuration;
      dot.style.animationDelay = delay;
      p.appendChild(dot);
      particles.appendChild(p);
    }
    card.appendChild(particles);

    // Conteúdo
    const content = document.createElement('div');
    content.className = 'mesa-content';

    const top = document.createElement('div');
    top.className = 'mesa-top';
    const isMaster = table.masterId === userId;
    if (isMaster) {
      const badge = document.createElement('span');
      badge.className = 'mesa-master-badge';
      badge.textContent = '👑 MESTRE';
      top.appendChild(badge);
    }
    content.appendChild(top);

    const bottomWrap = document.createElement('div');

    const name = document.createElement('div');
    name.className = 'mesa-name';
    name.textContent = table.name || ('Mesa ' + table.id);
    bottomWrap.appendChild(name);

    const bottom = document.createElement('div');
    bottom.className = 'mesa-bottom';

    const master = document.createElement('div');
    master.className = 'mesa-master-name';
    master.textContent = 'Mestre: ' + (table.masterUsername || '—');
    bottom.appendChild(master);

    const enter = document.createElement('div');
    enter.className = 'mesa-enter';
    const label = document.createElement('span');
    label.className = 'mesa-enter-label';
    label.textContent = 'Entrar';
    enter.appendChild(label);
    const arrow = document.createElement('span');
    arrow.className = 'mesa-arrow';
    arrow.textContent = '→';
    enter.appendChild(arrow);
    bottom.appendChild(enter);

    bottomWrap.appendChild(bottom);
    content.appendChild(bottomWrap);
    card.appendChild(content);

    // Click no card inteiro
    card.addEventListener('click', function() {
      try { Dice.sounds.page(); } catch (e) {}
      if (window.TableUI && TableUI.openTable) {
        TableUI.openTable(table.id);
      } else {
        Toast.error('Sistema de mesas indisponível.');
      }
    });

    return card;
  }

  // ============================================================
  // CRIAR MESA
  // ============================================================
  function createMesa(reload) {
    Modal.prompt('Qual o nome da mesa?', {
      title: '✦ Nova Mesa',
      icon: '🎲',
      placeholder: 'Ex: A Ordem de Vigília'
    }).then(function(name) {
      if (!name) return;

      return Modal.prompt('Wallpaper da mesa (URL da imagem — opcional):', {
        title: '🖼️ Wallpaper',
        icon: '🖼️',
        placeholder: 'https://...'
      }).then(function(wallpaper) {
        return TableSystem.createTable(name).then(function(table) {
          if (wallpaper && wallpaper.trim()) {
            table.wallpaper = wallpaper.trim();
            return StorageAdapter.save(table).then(function() { return table; });
          }
          return table;
        });
      }).then(function(table) {
        if (!table) return;
        try { Achievements.track('table_created', { id: table.id }); } catch (e) {}
        Toast.success('A mesa "' + (table.name || table.id) + '" foi criada.', '🎲 Mesa criada');
        if (reload) reload();
      });
    }).catch(function(err) {
      Toast.error(err && err.message ? err.message : String(err), 'Erro ao criar mesa');
    });
  }

  // ============================================================
  // ENTRAR POR ID
  // ============================================================
  function joinById(reload) {
    Modal.prompt('Cole o ID (ou o link) da mesa:', {
      title: '🔗 Entrar em uma mesa',
      icon: '🔗',
      placeholder: 'mesa_xxxxxxxx'
    }).then(function(value) {
      if (!value) return;
      let id = value.trim();
      const match = id.match(/[?&]table=([^&]+)/);
      if (match) id = match[1];

      return TableSystem.joinTable(id).then(function() {
        Toast.success('Você entrou na mesa.', '🎲 Bem-vindo');
        if (reload) reload();
      });
    }).catch(function(err) {
      Toast.error(err && err.message ? err.message : String(err), 'Erro ao entrar');
    });
  }

  // ============================================================
  // RENDER
  // ============================================================
  function render() {
    injectStyles();
    try { Particles.setSystem('default'); } catch (e) {}
    try { Dice.sounds.page(); } catch (e) {}
    try { Achievements.trackScreenOpen('mesas'); } catch (e) {}

    const wrap = document.createElement('div');
    wrap.className = 'page screen-enter';
    wrap.style.maxWidth = '1000px';
    wrap.style.margin = '0 auto';

    // ── Cabeçalho ──
    const header = document.createElement('div');
    header.className = 'build-header fu';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn-ghost';
    backBtn.textContent = '← Voltar';
    backBtn.addEventListener('click', function() {
      try { Dice.sounds.page(); } catch (e) {}
      App.go('select');
    });
    header.appendChild(backBtn);

    const info = document.createElement('div');
    info.innerHTML = '<div class="build-title" style="color:var(--gold);">🎲 Minhas Mesas</div>' +
                     '<div class="build-flavor">Onde as histórias acontecem</div>';
    header.appendChild(info);

    const searchBtn = document.createElement('button');
    searchBtn.className = 'btn-ghost';
    searchBtn.textContent = '🔍 Procurar Mesa (Em Breve)';
    searchBtn.disabled = true;
    searchBtn.style.opacity = '.45';
    searchBtn.style.cursor = 'not-allowed';
    searchBtn.style.marginLeft = 'auto';
    header.appendChild(searchBtn);

    wrap.appendChild(header);

    // ── Lista ──
    const listWrap = document.createElement('div');
    listWrap.id = 'mesas-list';
    listWrap.innerHTML = '<p style="color:var(--ink-faint);text-align:center;padding:40px;">Carregando mesas…</p>';
    wrap.appendChild(listWrap);

    function reload() {
      App.go('mesas');
    }

    const user = (window.StorageAdapter && StorageAdapter.getCurrentUser())
      || (window.GrimorioStorage && GrimorioStorage.getCurrentUser())
      || null;
    const userId = user ? user.id : null;

    TableSystem.getUserTables()
      .then(function(tables) {
        listWrap.innerHTML = '';

        if (!tables || tables.length === 0) {
          const empty = document.createElement('div');
          empty.className = 'mesas-empty';
          empty.innerHTML =
            '<div class="empty-icon">🏰</div>' +
            '<div class="empty-title">Nenhuma mesa ainda</div>' +
            '<div class="empty-desc">Crie a sua primeira mesa ou entre em uma com o ID do convite.</div>';
          listWrap.appendChild(empty);
        } else {
          const grid = document.createElement('div');
          grid.className = 'mesas-grid';
          tables.forEach(function(t) { grid.appendChild(buildCard(t, userId)); });
          listWrap.appendChild(grid);
        }

        // ── Ações ──
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '10px';
        actions.style.flexWrap = 'wrap';
        actions.style.marginTop = '22px';

        const createBtn = document.createElement('button');
        createBtn.className = 'btn-gold';
        createBtn.textContent = '✦ Criar Nova Mesa';
        createBtn.style.flex = '1';
        createBtn.style.minWidth = '200px';
        createBtn.addEventListener('click', function() { createMesa(reload); });
        actions.appendChild(createBtn);

        const joinBtn = document.createElement('button');
        joinBtn.className = 'btn-ghost';
        joinBtn.textContent = '🔗 Entrar com ID';
        joinBtn.style.flex = '1';
        joinBtn.style.minWidth = '200px';
        joinBtn.addEventListener('click', function() { joinById(reload); });
        actions.appendChild(joinBtn);

        listWrap.appendChild(actions);
      })
      .catch(function(err) {
        listWrap.innerHTML = '<p style="color:var(--red);text-align:center;padding:30px;">Erro ao carregar mesas: ' + err + '</p>';
      });

    return wrap;
  }

  return { render: render, createMesa: createMesa, joinById: joinById };

})();

window.MesasScreen = MesasScreen;
console.log('✅ MesasScreen carregado!');
