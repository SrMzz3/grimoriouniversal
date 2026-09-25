/* js/app.js — Estado global, roteamento, helpers de DOM */

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class")           e.className = v;
    else if (k === "style" && typeof v === "object") Object.assign(e.style, v);
    else if (k === "style")      e.setAttribute("style", v);
    else if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), v);
    else                         e.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null || c === false) continue;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return e;
}

const UI = {
  divider(text) {
    const d = el("div", { class: "divider" });
    d.appendChild(el("span", {}, text));
    return d;
  },
  cardTitle(text) {
    return el("div", { class: "card-title" }, text);
  },
  barGroup(label, cur, max, colorVar, id) {
    const pct = Math.max(0, Math.min(100, Math.round((cur / (max || 1)) * 100)));
    const wrap = el("div", { class: "bar-group" });
    const lbl = el("div", { class: "bar-label" });
    lbl.appendChild(el("span", {}, label));
    lbl.appendChild(el("span", { class: "bar-vals", id: id + "-vals" }, cur + " / " + max));
    wrap.appendChild(lbl);
    const barWrap = el("div", { class: "bar-wrap" });
    const fill = el("div", {
      class: "bar-fill" + (pct <= 25 ? " danger" : ""),
      id: id + "-fill",
      style: "width:" + pct + "%;background:" + colorVar
    });
    barWrap.appendChild(fill);
    wrap.appendChild(barWrap);
    return wrap;
  },
  updateBar(id, cur, max, colorVar) {
    const fill = document.getElementById(id + "-fill");
    const vals = document.getElementById(id + "-vals");
    if (!fill || !vals) return;
    const pct = Math.max(0, Math.min(100, Math.round((cur / (max || 1)) * 100)));
    fill.style.width = pct + "%";
    fill.style.background = colorVar;
    fill.classList.toggle("danger", pct <= 25);
    vals.textContent = cur + " / " + max;
  },
};

const App = (() => {
  const LS_KEY = "rpg_grimorio_v2";

  let state = {
    screen: "select",
    sysId: null,
    build: { name: "", level: 1, age: "", race: null, cls: null, origin: null },
    char: null,
    rollLog: [],
    rollMod: 0,
    rollLabel: "",
    activeTab: "skills",
    advantageLevel: 0,
  };

  function saveChar() {
    try {
      if (state.char) {
        const data = (state.char instanceof Character) ? state.char.toJSON() : state.char;
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        console.log('💾 [App] Personagem salvo:', data);
        if (window.GrimorioStorage && GrimorioStorage.getCurrentUser()) {
          GrimorioStorage.saveCharacter(data);
        }
      }
    } catch(e) {
      console.error('❌ [App] Erro ao salvar:', e);
    }
  }

  function loadChar() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY));
      if (raw) {
        console.log('📂 [App] Personagem carregado (raw):', raw);
        return CharacterFactory.create(raw);
      }
    } catch(e) {
      console.error('❌ [App] Erro ao carregar:', e);
    }
    return null;
  }

  function clearChar() {
    try { localStorage.removeItem(LS_KEY); } catch(e) {}
  }

  function getChar()        { return state.char; }
  function setChar(data)    {
    console.log('✏️ [App] setChar chamado com:', data);
    if (data && !(data instanceof Character)) {
      state.char = CharacterFactory.create(data);
    } else {
      state.char = data;
    }
    saveChar();
    render();
  }
  function updateChar(patch) {
    if (state.char) {
      Object.assign(state.char, patch);
      saveChar();
      render();
    }
  }
  function getBuildState()        { return state.build; }
  function setBuildState(patch)   { Object.assign(state.build, patch); }
  function resetBuildState()      { state.build = { name:"", level:1, age:"", race:null, cls:null, origin:null }; }
  function getLog()               { return state.rollLog; }
  function pushLog(entry)         { state.rollLog.unshift(entry); if (state.rollLog.length > 40) state.rollLog.pop(); }
  function clearLog()             { state.rollLog = []; }
  function getRollMod()           { return state.rollMod; }
  function setRollMod(v)          { state.rollMod = v; }
  function getRollLabel()         { return state.rollLabel; }
  function setRollLabel(v)        { state.rollLabel = v; }
  function getTab()               { return state.activeTab; }
  function setTab(t)              { state.activeTab = t; }
  function getAdvantageLevel()    { return state.advantageLevel; }
  function setAdvantageLevel(v)   { state.advantageLevel = parseInt(v) || 0; }

  function go(screen, sysId) {
    // ── Guarda de rota: painel do adm só para administradores ──
    if (screen === 'admin' && (!window.Account || !Account.isAdmin())) {
      if (window.Toast) Toast.error('Você não tem permissão para acessar essa área.', '🔒 Acesso negado');
      screen = 'select';
    }
    state.screen = screen;
    if (sysId) state.sysId = sysId;
    try { if (window.Achievements) Achievements.trackScreenOpen(screen); } catch (e) {}
    render();
  }

  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = "";

    let view;
    try {
      if      (state.screen === "select") view = SelectScreen.render();
      else if (state.screen === "build")  view = BuildScreen.render(state.sysId);
      else if (state.screen === "custom") view = BuildScreen.render("custom");
      else if (state.screen === "sheet")  view = SheetScreen.render();
      else if (state.screen === "profile") view = ProfileScreen.render();
      else if (state.screen === "mesas")  view = MesasScreen.render();
      else if (state.screen === "admin")  view = AdminPanel.render();
    } catch (err) {
      console.error('❌ [App] Erro ao renderizar a tela "' + state.screen + '":', err);
      app.appendChild(renderCrashScreen(state.screen, err));
      return;
    }

    if (view) {
      app.appendChild(view);
    } else {
      // Nenhuma tela casou: não deixa a página em branco
      console.warn('⚠️ [App] Tela desconhecida:', state.screen, '— voltando para select.');
      if (state.screen !== 'select') {
        state.screen = 'select';
        return render();
      }
      app.appendChild(renderCrashScreen(state.screen, new Error('A tela não retornou nenhum conteúdo.')));
      return;
    }

    if (state.screen === "sheet") {
      app.appendChild(renderMobileNav());
    }
  }

  // Tela de erro visível — melhor que uma página em branco
  function renderCrashScreen(screen, err) {
    const box = document.createElement('div');
    box.className = 'page';
    box.style.maxWidth = '640px';
    box.style.margin = '60px auto';
    box.style.textAlign = 'center';

    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('div');
    title.style.fontFamily = "'Cinzel', serif";
    title.style.fontSize = '20px';
    title.style.color = 'var(--red, #e05a5a)';
    title.style.marginBottom = '10px';
    title.textContent = '⚠️ Algo quebrou ao abrir "' + screen + '"';
    card.appendChild(title);

    const msg = document.createElement('pre');
    msg.style.whiteSpace = 'pre-wrap';
    msg.style.textAlign = 'left';
    msg.style.fontSize = '12px';
    msg.style.color = 'var(--ink-dim, #bbb)';
    msg.style.background = 'rgba(0,0,0,.35)';
    msg.style.padding = '12px';
    msg.style.borderRadius = '8px';
    msg.style.maxHeight = '260px';
    msg.style.overflow = 'auto';
    msg.textContent = (err && (err.stack || err.message)) || String(err);
    card.appendChild(msg);

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '10px';
    row.style.marginTop = '14px';
    row.style.justifyContent = 'center';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn-gold';
    backBtn.textContent = '← Voltar ao início';
    backBtn.addEventListener('click', function() { go('select'); });
    row.appendChild(backBtn);

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn-ghost';
    logoutBtn.textContent = '🚪 Sair da conta';
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('grimorio_session');
      location.reload();
    });
    row.appendChild(logoutBtn);

    card.appendChild(row);
    box.appendChild(card);
    return box;
  }

  function renderMobileNav() {
    const nav = el("nav", { class: "mobile-nav" });
    const tabs = [
      { id:"skills",     icon:"📋", label:"Perícias" },
      { id:"abilities",  icon:"⚡", label:"Habilidades" },
      { id:"equip",      icon:"🎒", label:"Itens" },
      { id:"notes",      icon:"📝", label:"Notas" },
      { id:"dice",       icon:"🎲", label:"Dados" },
    ];
    tabs.forEach(function(t) {
      const btn = el("button", { class: "mobile-nav-btn" + (state.activeTab === t.id ? " active" : "") });
      btn.innerHTML = '<span class="nav-icon">' + t.icon + '</span>' + t.label;
      btn.addEventListener("click", function() {
        state.activeTab = t.id;
        document.querySelectorAll(".mobile-nav-btn").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        SheetScreen.switchTab(t.id);
      });
      nav.appendChild(btn);
    });
    return nav;
  }

  function initSoundToggle() {
    const btn  = document.getElementById("sound-toggle");
    const icon = document.getElementById("sound-icon");
    if (!btn) return;
    btn.addEventListener("click", function() {
      const on = Dice.toggleSound();
      icon.textContent = on ? "🔊" : "🔇";
      if (on) Dice.sounds.click();
    });
  }

  function init() {
    if (!state.char) {
      const savedChar = loadChar();
      if (savedChar) {
        state.char = savedChar;
        console.log('📂 [App] Personagem carregado do localStorage:', savedChar);
        render();
      }
    }
    Particles.init("default");
    initSoundToggle();

    // Restaura o usuário no StorageAdapter (mesas e backend dependem disso)
    try {
      if (window.StorageAdapter) {
        StorageAdapter.init();
        StorageAdapter.loadUserFromSession();
      }
    } catch (e) { console.warn('⚠️ [App] StorageAdapter:', e); }

    try { if (window.Achievements) Achievements.init(); } catch (e) {}

    render();
  }

  return {
    go: go,
    render: render,
    getChar: getChar,
    setChar: setChar,
    updateChar: updateChar,
    getBuildState: getBuildState,
    setBuildState: setBuildState,
    resetBuildState: resetBuildState,
    getLog: getLog,
    pushLog: pushLog,
    clearLog: clearLog,
    getRollMod: getRollMod,
    setRollMod: setRollMod,
    getRollLabel: getRollLabel,
    setRollLabel: setRollLabel,
    getTab: getTab,
    setTab: setTab,
    getAdvantageLevel: getAdvantageLevel,
    setAdvantageLevel: setAdvantageLevel,
    saveChar: saveChar,
    loadChar: loadChar,
    clearChar: clearChar,
    init: init,
  };
})();

window.GrimorioStorage = {
  getCurrentUser: function() {
    const session = JSON.parse(localStorage.getItem("grimorio_session"));
    if (!session) return null;
    const users = JSON.parse(localStorage.getItem("grimorio_users") || "[]");
    return users.find(function(u) { return u.id === session.id; }) || null;
  },
  updateCurrentUser: function(user) {
    const users = JSON.parse(localStorage.getItem("grimorio_users") || "[]");
    const idx = users.findIndex(function(u) { return u.id === user.id; });
    if (idx === -1) return;
    users[idx] = user;
    localStorage.setItem("grimorio_users", JSON.stringify(users));
    localStorage.setItem("grimorio_session", JSON.stringify({ id: user.id, username: user.username }));
  },
  getCharacters: function() {
    const user = this.getCurrentUser();
    if (!user) return [];
    if (!user.characters) user.characters = [];
    return user.characters.map(function(c) {
      if (c && !(c instanceof Character)) {
        return CharacterFactory.create(c);
      }
      return c;
    });
  },
  saveCharacter: function(char) {
    const user = this.getCurrentUser();
    if (!user) {
      console.error('❌ [Storage] Nenhum usuário logado');
      return;
    }
    if (!user.characters) user.characters = [];

    const data = (char instanceof Character) ? char.toJSON() : char;
    console.log('💾 [Storage] Salvando personagem:', data);

    const idx = user.characters.findIndex(function(c) { return c.id === data.id; });
    if (idx >= 0) {
      user.characters[idx] = data;
    } else {
      user.characters.push(data);
    }
    this.updateCurrentUser(user);
  },
  deleteCharacter: function(id) {
    const user = this.getCurrentUser();
    if (!user) return;
    if (!user.characters) user.characters = [];
    user.characters = user.characters.filter(function(c) { return c.id !== id; });
    this.updateCurrentUser(user);
  },
  getSystems: function() {
    const user = this.getCurrentUser();
    if (!user) return [];
    if (!user.systems) user.systems = [];
    return user.systems;
  },
  saveSystem: function(sys) {
    const user = this.getCurrentUser();
    if (!user) return;
    if (!user.systems) user.systems = [];
    user.systems.push(sys);
    this.updateCurrentUser(user);
  }
};

document.addEventListener("DOMContentLoaded", function() {
  const app = document.getElementById("app");

  function showBoot(msg, err) {
    console.error('❌ [Boot]', msg, err || '');
    if (!app || app.children.length) return;
    app.innerHTML =
      '<div class="page" style="max-width:640px;margin:60px auto;text-align:center;">' +
        '<div class="card">' +
          '<div style="font-family:\'Cinzel\',serif;font-size:20px;color:#e05a5a;margin-bottom:10px;">⚠️ ' + msg + '</div>' +
          '<pre style="white-space:pre-wrap;text-align:left;font-size:12px;color:#bbb;background:rgba(0,0,0,.35);padding:12px;border-radius:8px;max-height:260px;overflow:auto;">' +
            String((err && (err.stack || err.message)) || err || '') +
          '</pre>' +
          '<button class="btn-ghost" style="margin-top:14px;" onclick="localStorage.removeItem(\'grimorio_session\');location.reload();">🚪 Sair da conta e recarregar</button>' +
        '</div>' +
      '</div>';
  }

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("grimorio_session"));
  } catch (e) {
    // Sessão corrompida no localStorage: limpa e cai na tela de login
    localStorage.removeItem("grimorio_session");
  }

  if (!session) {
    try {
      if (window.LoginUI) {
        app.innerHTML = LoginUI.render();
        LoginUI.init();
      } else {
        showBoot('A tela de login não carregou.', new Error('LoginUI indefinido — verifique se js/ui/login.js carregou.'));
      }
    } catch (err) {
      showBoot('Erro ao montar a tela de login.', err);
    }
    return;
  }

  try {
    App.init();
  } catch (err) {
    showBoot('Erro ao iniciar o Grimório.', err);
  }
});

// Rede de segurança: nada de tela branca silenciosa
window.addEventListener('error', function(ev) {
  const app = document.getElementById('app');
  if (!app || app.children.length) return;
  app.innerHTML =
    '<div class="page" style="max-width:640px;margin:60px auto;text-align:center;">' +
      '<div class="card">' +
        '<div style="font-family:\'Cinzel\',serif;font-size:20px;color:#e05a5a;margin-bottom:10px;">⚠️ Erro ao carregar o Grimório</div>' +
        '<pre style="white-space:pre-wrap;text-align:left;font-size:12px;color:#bbb;background:rgba(0,0,0,.35);padding:12px;border-radius:8px;">' +
          String(ev.message) + '\n' + String(ev.filename || '') + ':' + String(ev.lineno || '') +
        '</pre>' +
      '</div>' +
    '</div>';
});