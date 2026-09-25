/* js/achievements.js — Sistema de Conquistas do Grimório Universal */

const Achievements = (() => {

  const STATS_KEY = 'grimorio_ach_stats';

  // ============================================================
  // RARIDADES
  // ============================================================
  const RARITIES = {
    comum:    { label: 'Comum',    color: '#c0b090', glow: 'rgba(192,176,144,0.35)' },
    raro:     { label: 'Raro',     color: '#00f0ff', glow: 'rgba(0,240,255,0.35)'   },
    epico:    { label: 'Épico',    color: '#b89af0', glow: 'rgba(184,154,240,0.4)'  },
    lendario: { label: 'Lendário', color: '#d4b84b', glow: 'rgba(212,184,75,0.45)'  },
    mitico:   { label: 'Mítico',   color: '#f05a5a', glow: 'rgba(240,90,90,0.45)'   },
  };

  function rarityInfo(r) {
    return RARITIES[normalizeRarity(r)] || RARITIES.comum;
  }

  function normalizeRarity(r) {
    if (!r) return 'comum';
    return String(r).toLowerCase()
      .replace('épico', 'epico')
      .replace('lendário', 'lendario')
      .replace('mítico', 'mitico');
  }

  // ============================================================
  // CATÁLOGO
  // ============================================================
  const CATALOG = [
    // ── EXCLUSIVA DE ADM ──
    { id: 'im_purpleflower', icon: '💜', title: "I'm PurpleFlower", desc: 'Fazer login na conta de administrador. Só o adm tem.', rarity: 'mitico', adminOnly: true, group: 'Exclusiva' },

    // ── TROLL ──
    { id: 'chuck_norris', icon: '💪', title: 'Chuck Norris', desc: '20 vinte naturais seguidos. Chance: 1 em 104 septilhões.', rarity: 'mitico', group: 'Troll' },

    // ── DADOS ──
    { id: 'viciado_dados',    icon: '🎰', title: 'Viciado em Dados',    desc: '500 rolagens num único dia.',                      rarity: 'epico',    group: 'Dados' },
    { id: 'milagre',          icon: '🌟', title: 'Milagre',             desc: '10 vinte naturais num único dia.',                  rarity: 'raro',     group: 'Dados' },
    { id: 'desastre_total',   icon: '☠️', title: 'Desastre Total',      desc: 'Sessão inteira sem tirar acima de 10.',             rarity: 'raro',     group: 'Dados' },
    { id: 'destruidor',       icon: '💥', title: 'Destruidor',          desc: '1.000 de dano numa única rolagem.',                 rarity: 'epico',    group: 'Dados' },
    { id: 'cataclismo',       icon: '🌋', title: 'Cataclismo',          desc: '10.000 de dano numa única rolagem.',                rarity: 'lendario', group: 'Dados' },
    { id: 'favorito_deuses',  icon: '⚡', title: 'Favorito dos Deuses', desc: '50 vinte naturais num único dia.',                  rarity: 'lendario', group: 'Dados' },
    { id: 'calamidade',       icon: '🌪️', title: 'Calamidade',          desc: '30 uns naturais num único dia.',                    rarity: 'epico',    group: 'Dados' },
    { id: 'perfeicao',        icon: '💎', title: 'Perfeição',           desc: 'Sessão inteira sem tirar abaixo de 15.',            rarity: 'lendario', group: 'Dados' },
    { id: 'pior_sessao',      icon: '🪦', title: 'Pior Sessão da Vida', desc: 'Sessão inteira sem tirar acima de 3.',              rarity: 'lendario', group: 'Dados' },
    { id: 'dia_da_sorte',     icon: '🎰', title: 'Dia da Sorte',        desc: '20 vinte naturais no dia 20/07.',                   rarity: 'mitico',   group: 'Dados' },

    // ── PERSONAGENS ──
    { id: 'colecionador', icon: '📚', title: 'Colecionador', desc: 'Ter personagens nos 3 sistemas.', rarity: 'comum',    group: 'Personagens' },
    { id: 'exercito',     icon: '⚔️', title: 'Exército',     desc: 'Criar 100 personagens.',         rarity: 'lendario', group: 'Personagens' },

    // ── MESAS ──
    { id: 'mestre_supremo', icon: '👑', title: 'Mestre Supremo', desc: 'Criar 10 mesas.',                 rarity: 'epico', group: 'Mesas' },
    { id: 'chatty',         icon: '💬', title: 'Chatty',         desc: 'Enviar 100 mensagens numa mesa.', rarity: 'raro',  group: 'Mesas' },

    // ── PERFIL ──
    { id: 'camaleao',      icon: '🎭', title: 'Camaleão',      desc: 'Trocar de moldura 99 vezes.',              rarity: 'epico', group: 'Perfil' },
    { id: 'dragao_eterno', icon: '🐉', title: 'Dragão Eterno', desc: 'Usar a moldura dragon por 7 dias seguidos.', rarity: 'epico', group: 'Perfil' },

    // ── TEMPO ──
    { id: 'maratonista',     icon: '⏱️', title: 'Maratonista',     desc: 'Ficar 1 hora com a ficha aberta.',   rarity: 'comum', group: 'Tempo' },
    { id: 'notivago',        icon: '🌙', title: 'Notívago',        desc: 'Usar o site entre 3h e 5h da manhã.', rarity: 'raro',  group: 'Tempo' },
    { id: 'aniversariante',  icon: '🎂', title: 'Aniversariante',  desc: 'Logar no dia do seu aniversário.',    rarity: 'raro',  group: 'Tempo' },

    // ── SECRETAS ──
    { id: 'halloween',    icon: '🎃', title: 'Halloween',    desc: 'Usar o site no dia 31 de outubro.',        rarity: 'raro',  secret: true, group: 'Secretas' },
    { id: 'natal',        icon: '🎄', title: 'Natal',        desc: 'Usar o site no dia 25 de dezembro.',       rarity: 'raro',  secret: true, group: 'Secretas' },
    { id: 'ano_novo',     icon: '🎆', title: 'Ano Novo',     desc: 'Usar o site no dia 1 de janeiro.',         rarity: 'raro',  secret: true, group: 'Secretas' },
    { id: 'senha_errada', icon: '🔒', title: 'Senha Errada', desc: 'Errar a senha 10 vezes.',                  rarity: 'comum', secret: true, group: 'Secretas' },
    { id: 'gandalf',      icon: '🧙', title: 'Gandalf',      desc: 'Criar um personagem chamado "Gandalf".',   rarity: 'epico', secret: true, group: 'Secretas' },
    { id: 'conan',        icon: '⚔️', title: 'Conan',        desc: 'Criar um personagem chamado "Conan".',     rarity: 'epico', secret: true, group: 'Secretas' },
    { id: 'sem_nome',     icon: '❓', title: 'Sem Nome',     desc: 'Criar um personagem chamado "Sem nome".',  rarity: 'comum', secret: true, group: 'Secretas' },
  ];

  // Conquistas criadas pelo adm (carregadas do backend)
  let customCatalog = [];

  function all() {
    return CATALOG.concat(customCatalog);
  }

  function get(id) {
    return all().find(function(a) { return a.id === id; }) || null;
  }

  function loadCustom() {
    return fetch('/api/admin/achievements')
      .then(function(r) { return r.ok ? r.json() : []; })
      .then(function(list) {
        customCatalog = (list || []).map(function(a) {
          return {
            id: a.id,
            icon: a.icon || '✨',
            title: a.title,
            desc: a.desc || '',
            rarity: normalizeRarity(a.rarity),
            custom: true,
            group: 'Customizadas'
          };
        });
        return customCatalog;
      })
      .catch(function() { return customCatalog; });
  }

  // ============================================================
  // USUÁRIO
  // ============================================================
  function currentUser() {
    if (window.GrimorioStorage && GrimorioStorage.getCurrentUser) {
      return GrimorioStorage.getCurrentUser();
    }
    return null;
  }

  function isAdmin(user) {
    user = user || currentUser();
    if (!user) return false;
    return user.isAdmin === true;
  }

  function unlocked(user) {
    user = user || currentUser();
    if (!user) return [];
    return user.achievements || [];
  }

  function has(id, user) {
    return unlocked(user).indexOf(id) !== -1;
  }

  function persistUser(user) {
    if (!user) return;
    try {
      if (window.GrimorioStorage && GrimorioStorage.updateCurrentUser) {
        GrimorioStorage.updateCurrentUser(user);
      }
    } catch (e) {}
    // Sincroniza com o backend (sem travar a UI)
    try {
      fetch('/api/auth/user/' + user.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          achievements: user.achievements || [],
          displayedAchievement: user.displayedAchievement || ''
        })
      }).catch(function() {});
    } catch (e) {}
  }

  // ============================================================
  // DESBLOQUEIO
  // ============================================================
  function unlock(id) {
    const user = currentUser();
    if (!user) return false;

    const def = get(id);
    if (!def) return false;

    // Conquista exclusiva do adm: ninguém mais pega, nem via console
    if (def.adminOnly && !isAdmin(user)) {
      console.warn('🔒 Conquista exclusiva do administrador.');
      return false;
    }

    if (!user.achievements) user.achievements = [];
    if (user.achievements.indexOf(id) !== -1) return false;

    user.achievements.push(id);
    persistUser(user);
    showUnlockPopup(def);
    return true;
  }

  function revoke(id) {
    const user = currentUser();
    if (!user || !user.achievements) return false;
    user.achievements = user.achievements.filter(function(a) { return a !== id; });
    if (user.displayedAchievement === id) user.displayedAchievement = '';
    persistUser(user);
    return true;
  }

  // ============================================================
  // POPUP DE DESBLOQUEIO
  // ============================================================
  function injectPopupStyles() {
    if (document.getElementById('achievement-styles')) return;
    const style = document.createElement('style');
    style.id = 'achievement-styles';
    style.textContent = `
      #achievement-popup-layer {
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        pointer-events: none;
      }
      .ach-popup {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 24px 14px 18px;
        min-width: 300px;
        background: rgba(12,11,9,0.96);
        backdrop-filter: blur(14px);
        border: 1px solid var(--border-2);
        border-radius: var(--r-lg);
        box-shadow: 0 10px 50px rgba(0,0,0,.9);
        animation: achIn .55s cubic-bezier(0.34, 1.5, 0.64, 1) both;
        position: relative;
        overflow: hidden;
      }
      .ach-popup::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,.07) 50%, transparent 80%);
        transform: translateX(-100%);
        animation: achShine 1.6s ease .3s both;
      }
      .ach-popup.ach-out { animation: achOut .4s ease both; }
      .ach-popup .ach-icon {
        font-size: 34px;
        line-height: 1;
        flex-shrink: 0;
        filter: drop-shadow(0 0 10px currentColor);
      }
      .ach-popup .ach-label {
        font-family: 'Cinzel', serif;
        font-size: 10px;
        letter-spacing: .18em;
        text-transform: uppercase;
        margin-bottom: 3px;
        opacity: .85;
      }
      .ach-popup .ach-title {
        font-family: 'Cinzel', serif;
        font-size: 16px;
        font-weight: 700;
        color: var(--ink);
      }
      .ach-popup .ach-desc {
        font-size: 12px;
        color: var(--ink-faint);
        margin-top: 2px;
        max-width: 280px;
      }
      @keyframes achIn {
        from { opacity: 0; transform: translateY(-30px) scale(.9); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes achOut {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to   { opacity: 0; transform: translateY(-20px) scale(.95); }
      }
      @keyframes achShine {
        to { transform: translateX(100%); }
      }

      .ach-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 12px;
        border-radius: 12px;
        font-size: 12px;
        border: 1px solid;
        background: rgba(0,0,0,.35);
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function popupLayer() {
    let layer = document.getElementById('achievement-popup-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'achievement-popup-layer';
      document.body.appendChild(layer);
    }
    return layer;
  }

  function showUnlockPopup(def) {
    injectPopupStyles();
    const rar = rarityInfo(def.rarity);

    const popup = document.createElement('div');
    popup.className = 'ach-popup';
    popup.style.borderColor = rar.color;
    popup.style.boxShadow = '0 10px 50px rgba(0,0,0,.9), 0 0 30px ' + rar.glow;

    const icon = document.createElement('div');
    icon.className = 'ach-icon';
    icon.style.color = rar.color;
    icon.textContent = def.icon || '🏆';
    popup.appendChild(icon);

    const body = document.createElement('div');

    const label = document.createElement('div');
    label.className = 'ach-label';
    label.style.color = rar.color;
    label.textContent = 'Conquista ' + rar.label;
    body.appendChild(label);

    const title = document.createElement('div');
    title.className = 'ach-title';
    title.textContent = def.title;
    body.appendChild(title);

    const desc = document.createElement('div');
    desc.className = 'ach-desc';
    desc.textContent = def.desc || '';
    body.appendChild(desc);

    popup.appendChild(body);
    popupLayer().appendChild(popup);

    try { if (window.Dice && Dice.sounds) Dice.sounds.magic(); } catch (e) {}

    setTimeout(function() {
      popup.classList.add('ach-out');
      setTimeout(function() { if (popup.parentNode) popup.remove(); }, 420);
    }, 5200);
  }

  // ============================================================
  // BADGE (usado no perfil e na barra do usuário)
  // ============================================================
  function createBadge(id) {
    const def = get(id);
    if (!def) return null;
    injectPopupStyles();

    const rar = rarityInfo(def.rarity);
    const badge = document.createElement('span');
    badge.className = 'ach-badge';
    badge.style.borderColor = rar.color;
    badge.style.color = rar.color;
    badge.title = def.title + ' — ' + def.desc;

    const ic = document.createElement('span');
    ic.textContent = def.icon || '🏆';
    badge.appendChild(ic);

    const tx = document.createElement('span');
    tx.textContent = def.title;
    tx.style.fontFamily = "'Cinzel', serif";
    tx.style.fontSize = '11px';
    tx.style.letterSpacing = '.04em';
    badge.appendChild(tx);

    return badge;
  }

  // ============================================================
  // ESTATÍSTICAS (contadores locais)
  // ============================================================
  function today() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function blankDaily() {
    return { date: today(), rolls: 0, nat20: 0, nat1: 0 };
  }

  function blankPersist() {
    return {
      frameChanges: 0,
      tablesCreated: 0,
      messagesSent: 0,
      charsCreated: 0,
      wrongPass: 0,
      streak20: 0,
      dragonFrameSince: null,
      sheetSeconds: 0
    };
  }

  function readStats() {
    let store = {};
    try { store = JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); } catch (e) { store = {}; }

    const user = currentUser();
    const key = user ? user.id : 'anon';

    if (!store[key]) store[key] = { daily: blankDaily(), persist: blankPersist() };
    if (!store[key].daily || store[key].daily.date !== today()) store[key].daily = blankDaily();
    if (!store[key].persist) store[key].persist = blankPersist();

    return { store: store, key: key, data: store[key] };
  }

  function writeStats(store) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(store)); } catch (e) {}
  }

  function stats() {
    return readStats().data;
  }

  // Sessão = desde que a página abriu
  const session = { count: 0, min: null, max: null, startedAt: Date.now() };

  // ============================================================
  // TRACKING
  // ============================================================
  function track(event, data) {
    data = data || {};
    const user = currentUser();
    if (!user) return;

    const st = readStats();
    const daily = st.data.daily;
    const persist = st.data.persist;

    switch (event) {

      // ── ROLAGEM ──
      case 'roll': {
        const result = parseInt(data.result);
        const sides = parseInt(data.sides) || 20;
        if (isNaN(result)) break;

        daily.rolls++;

        if (sides === 20) {
          session.count++;
          session.min = session.min === null ? result : Math.min(session.min, result);
          session.max = session.max === null ? result : Math.max(session.max, result);

          if (result === 20) {
            daily.nat20++;
            persist.streak20 = (persist.streak20 || 0) + 1;
          } else {
            persist.streak20 = 0;
          }
          if (result === 1) daily.nat1++;
        }

        writeStats(st.store);

        if (daily.rolls >= 500) unlock('viciado_dados');
        if (daily.nat20 >= 10) unlock('milagre');
        if (daily.nat20 >= 50) unlock('favorito_deuses');
        if (daily.nat1 >= 30) unlock('calamidade');
        if ((persist.streak20 || 0) >= 20) unlock('chuck_norris');

        const now = new Date();
        if (now.getDate() === 20 && now.getMonth() === 6 && daily.nat20 >= 20) unlock('dia_da_sorte');

        // Sessão (mínimo de 10 rolagens de d20 pra contar como "sessão inteira")
        if (session.count >= 10) {
          if (session.max <= 3)  unlock('pior_sessao');
          if (session.max <= 10) unlock('desastre_total');
          if (session.min >= 15) unlock('perfeicao');
        }
        break;
      }

      // ── DANO ──
      case 'damage': {
        const dmg = parseInt(data.total || data.damage);
        if (isNaN(dmg)) break;
        if (dmg >= 1000)   unlock('destruidor');
        if (dmg >= 10000)  unlock('cataclismo');
        break;
      }

      // ── LOGIN ──
      case 'login': {
        persist.wrongPass = 0;
        writeStats(st.store);

        if (user.isAdmin) unlock('im_purpleflower');
        checkDateAchievements(user);
        break;
      }

      case 'wrong_password': {
        persist.wrongPass = (persist.wrongPass || 0) + 1;
        writeStats(st.store);
        if (persist.wrongPass >= 10) unlock('senha_errada');
        break;
      }

      // ── PERSONAGENS ──
      case 'character_created': {
        persist.charsCreated = (persist.charsCreated || 0) + 1;
        writeStats(st.store);

        const name = String(data.name || '').trim().toLowerCase();
        if (name === 'gandalf')  unlock('gandalf');
        if (name === 'conan')    unlock('conan');
        if (name === 'sem nome') unlock('sem_nome');

        const chars = user.characters || [];
        if (chars.length >= 100 || persist.charsCreated >= 100) unlock('exercito');

        const systems = {};
        chars.forEach(function(c) { if (c && c.sysId) systems[c.sysId] = true; });
        if (systems.dnd && systems.op && systems.custom) unlock('colecionador');
        break;
      }

      // ── MESAS ──
      case 'table_created': {
        persist.tablesCreated = (persist.tablesCreated || 0) + 1;
        writeStats(st.store);
        if (persist.tablesCreated >= 10) unlock('mestre_supremo');
        break;
      }

      case 'message_sent': {
        persist.messagesSent = (persist.messagesSent || 0) + 1;
        writeStats(st.store);
        if (persist.messagesSent >= 100) unlock('chatty');
        break;
      }

      // ── MOLDURA ──
      case 'frame_changed': {
        persist.frameChanges = (persist.frameChanges || 0) + 1;

        if (data.frame === 'dragon') {
          if (!persist.dragonFrameSince) persist.dragonFrameSince = Date.now();
        } else {
          persist.dragonFrameSince = null;
        }

        writeStats(st.store);

        if (persist.frameChanges >= 99) unlock('camaleao');
        checkDragonFrame();
        break;
      }

      default:
        break;
    }
  }

  function trackScreenOpen(screen) {
    const user = currentUser();
    if (!user) return;
    checkDateAchievements(user);
    if (screen === 'sheet') startSheetTimer();
    else stopSheetTimer();
  }

  // ============================================================
  // CHECAGENS POR DATA / TEMPO
  // ============================================================
  function checkDateAchievements(user) {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth(); // 0-indexado
    const hour = now.getHours();

    if (day === 31 && month === 9)  unlock('halloween');
    if (day === 25 && month === 11) unlock('natal');
    if (day === 1  && month === 0)  unlock('ano_novo');
    if (hour >= 3 && hour < 5)      unlock('notivago');

    // Aniversário (user.birthday no formato YYYY-MM-DD ou MM-DD)
    if (user && user.birthday) {
      const parts = String(user.birthday).split('-');
      const bMonth = parseInt(parts[parts.length - 2]);
      const bDay = parseInt(parts[parts.length - 1]);
      if (bDay === day && bMonth === month + 1) unlock('aniversariante');
    }

    checkDragonFrame();
  }

  function checkDragonFrame() {
    const user = currentUser();
    if (!user || user.frame !== 'dragon') return;

    const st = readStats();
    const persist = st.data.persist;
    if (!persist.dragonFrameSince) {
      persist.dragonFrameSince = Date.now();
      writeStats(st.store);
      return;
    }
    const days = (Date.now() - persist.dragonFrameSince) / 86400000;
    if (days >= 7) unlock('dragao_eterno');
  }

  // ── Maratonista: 1 hora com a ficha aberta ──
  let sheetTimer = null;

  function startSheetTimer() {
    if (sheetTimer) return;
    sheetTimer = setInterval(function() {
      const st = readStats();
      st.data.persist.sheetSeconds = (st.data.persist.sheetSeconds || 0) + 30;
      writeStats(st.store);
      if (st.data.persist.sheetSeconds >= 3600) {
        unlock('maratonista');
        stopSheetTimer();
      }
    }, 30000);
  }

  function stopSheetTimer() {
    if (sheetTimer) {
      clearInterval(sheetTimer);
      sheetTimer = null;
    }
  }

  // ============================================================
  // CONQUISTA EXIBIDA NO PERFIL
  // ============================================================
  function getDisplayed() {
    const user = currentUser();
    if (!user) return '';
    const id = user.displayedAchievement || '';
    if (!id) return '';
    return has(id, user) ? id : '';
  }

  function setDisplayed(id) {
    const user = currentUser();
    if (!user) return false;
    if (id && !has(id, user)) return false;
    user.displayedAchievement = id || '';
    persistUser(user);
    return true;
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    injectPopupStyles();
    loadCustom();
    const user = currentUser();
    if (user) checkDateAchievements(user);
  }

  // ============================================================
  // API PÚBLICA
  // ============================================================
  return {
    CATALOG: CATALOG,
    RARITIES: RARITIES,
    all: all,
    get: get,
    loadCustom: loadCustom,
    rarityInfo: rarityInfo,
    normalizeRarity: normalizeRarity,
    isAdmin: isAdmin,
    unlocked: unlocked,
    has: has,
    unlock: unlock,
    revoke: revoke,
    track: track,
    trackScreenOpen: trackScreenOpen,
    stats: stats,
    createBadge: createBadge,
    showUnlockPopup: showUnlockPopup,
    getDisplayed: getDisplayed,
    setDisplayed: setDisplayed,
    init: init,
  };

})();

window.Achievements = Achievements;
console.log('✅ Achievements carregado!');
