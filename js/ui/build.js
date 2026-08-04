/* js/ui/build.js — Criação de personagem D&D e OP + Custom */

const BuildScreen = (() => {

  /* ══════════════════════════════════════
     D&D
  ══════════════════════════════════════ */
  function renderDnD() {
    Particles.setSystem("dnd");
    const b = App.getBuildState();

    const wrap = el("div", { class:"page screen-enter", style:"max-width:900px" });

    const hdr = el("div", { class:"build-header fu" });
    const back = el("button", { class:"btn-ghost" }, "← Voltar");
    back.addEventListener("click", () => { Dice.sounds.page(); App.go("select"); });
    const info = el("div");
    info.innerHTML = `<div class="build-title">⚔️ D&D 5e — Criar Personagem</div>
      <div class="build-flavor">"Não importa o quão escura seja a masmorra, a luz da tocha sempre encontra o caminho."</div>`;
    hdr.appendChild(back); hdr.appendChild(info);
    wrap.appendChild(hdr);

    wrap.appendChild(UI.divider("1. Nome e nível"));
    const nameRow = el("div", { class:"g2", style:"gap:12px;margin-bottom:4px" });
    const nameG = el("div");
    nameG.appendChild(el("div", { class:"field-label" }, "Nome do personagem"));
    const nameI = el("input", { type:"text", placeholder:"Ex: Thorin Escudo-de-Carvalho", value: b.name || "" });
    nameI.addEventListener("input", e => { App.setBuildState({ name: e.target.value }); updateBtn(); });
    nameG.appendChild(nameI);
    const levelG = el("div");
    levelG.appendChild(el("div", { class:"field-label" }, "Nível"));
    const levelI = el("input", { type:"number", placeholder:"1", value: b.level || "1", style:"width:80px" });
    levelI.addEventListener("input", e => { App.setBuildState({ level: e.target.value }); updatePreview(); });
    levelG.appendChild(levelI);
    nameRow.appendChild(nameG); nameRow.appendChild(levelG);
    wrap.appendChild(nameRow);

    wrap.appendChild(UI.divider("2. Raça"));
    const raceGrid = el("div", { class:"opt-grid" });
    DND.races.forEach(r => {
      const card = el("button", { class:"opt-card" + (b.race === r.id ? " active" : "") });
      card.innerHTML = `<div class="opt-name">${r.name}</div><div class="opt-desc">${r.desc}</div>`;
      card.addEventListener("click", () => {
        Dice.sounds.click();
        App.setBuildState({ race: r.id, subrace: null });
        wrap.querySelectorAll(".race-opt").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        renderSubraces();
        updatePreview();
      });
      card.classList.add("race-opt");
      raceGrid.appendChild(card);
    });
    wrap.appendChild(raceGrid);

    const subraceContainer = el("div", { id:"subrace-container" });
    wrap.appendChild(subraceContainer);

    function renderSubraces() {
      const subraceDiv = document.getElementById("subrace-container");
      if (!subraceDiv) return;
      subraceDiv.innerHTML = "";
      const selectedRace = DND.races.find(r => r.id === App.getBuildState().race);
      if (!selectedRace || !selectedRace.subraces || selectedRace.subraces.length === 0) return;

      subraceDiv.appendChild(UI.divider("2b. Sub-raça"));
      const subGrid = el("div", { class:"opt-grid" });
      selectedRace.subraces.forEach(sr => {
        const card = el("button", { class:"opt-card" + (b.subrace === sr.id ? " active" : "") });
        card.innerHTML = `<div class="opt-name">${sr.name}</div><div class="opt-desc">${sr.traits?.join(", ") || ""}</div>`;
        card.addEventListener("click", () => {
          Dice.sounds.click();
          App.setBuildState({ subrace: sr.id });
          subraceDiv.querySelectorAll(".subrace-opt").forEach(c => c.classList.remove("active"));
          card.classList.add("active");
          updatePreview();
        });
        card.classList.add("subrace-opt");
        subGrid.appendChild(card);
      });
      subraceDiv.appendChild(subGrid);
    }

    wrap.appendChild(UI.divider("3. Classe"));
    const clsGrid = el("div", { class:"opt-grid" });
    DND.classes.forEach(c => {
      const card = el("button", { class:"opt-card" + (b.cls === c.id ? " active" : "") });
      card.innerHTML = `
        <div class="opt-name">${c.name} <span class="opt-badge">d${c.hd}</span></div>
        <div class="opt-desc">${c.desc}</div>
        <div class="opt-sub">▸ ${c.skillProficiencies.slice(0,3).join(", ")}</div>
      `;
      card.addEventListener("click", () => {
        Dice.sounds.click();
        App.setBuildState({ cls: c.id, subclass: null });
        wrap.querySelectorAll(".cls-opt").forEach(x => x.classList.remove("active"));
        card.classList.add("active");
        renderSubclasses();
        updatePreview();
      });
      card.classList.add("cls-opt");
      clsGrid.appendChild(card);
    });
    wrap.appendChild(clsGrid);

    const subclassContainer = el("div", { id:"subclass-container" });
    wrap.appendChild(subclassContainer);

    function renderSubclasses() {
      const subclassDiv = document.getElementById("subclass-container");
      if (!subclassDiv) return;
      subclassDiv.innerHTML = "";
      const selectedClass = DND.classes.find(c => c.id === App.getBuildState().cls);
      if (!selectedClass || !selectedClass.subclasses || selectedClass.subclasses.length === 0) return;

      subclassDiv.appendChild(UI.divider("3b. Especialização"));
      const subGrid = el("div", { class:"opt-grid" });
      selectedClass.subclasses.forEach(sc => {
        const card = el("button", { class:"opt-card" + (b.subclass === sc.id ? " active" : "") });
        card.innerHTML = `<div class="opt-name">${sc.name}</div>`;
        card.addEventListener("click", () => {
          Dice.sounds.click();
          App.setBuildState({ subclass: sc.id });
          subclassDiv.querySelectorAll(".subclass-opt").forEach(c => c.classList.remove("active"));
          card.classList.add("active");
          updatePreview();
        });
        card.classList.add("subclass-opt");
        subGrid.appendChild(card);
      });
      subclassDiv.appendChild(subGrid);
    }

    const previewEl = el("div", { id:"preview-area" });
    wrap.appendChild(previewEl);

    const confirmBtn = el("button", { class:"btn-gold w100", style:"margin-top:20px" }, "✦ Conjurar personagem e abrir ficha ✦");
    confirmBtn.id = "confirm-btn";
    confirmBtn.disabled = !canConfirmDnD();
    confirmBtn.addEventListener("click", () => { if (!confirmBtn.disabled) { Dice.sounds.magic(); createDnDChar(); } });
    wrap.appendChild(confirmBtn);

    function updateBtn() {
      const btn = document.getElementById("confirm-btn");
      if (btn) btn.disabled = !canConfirmDnD();
    }

    function updatePreview() {
      updateBtn();
      const area = document.getElementById("preview-area");
      if (!area) return;
      const bNow = App.getBuildState();
      const cls  = DND.classes.find(c => c.id === bNow.cls);
      const race = DND.races.find(r => r.id === bNow.race);
      if (!cls) { area.innerHTML = ""; return; }
      const stats = computeDnDStats(cls, race);
      area.innerHTML = "";
      area.appendChild(UI.divider("Preview dos atributos"));
      const grid = el("div", { class:"stats-preview", style:`grid-template-columns:repeat(${DND.statKeys.length},1fr)` });
      DND.statKeys.forEach(k => {
        const box = el("div", { class:"stat-prev" });
        box.innerHTML = `
          <div class="stat-prev-label">${DND.statLabels[k]}</div>
          <div class="stat-prev-val">${stats[k] || "—"}</div>
          <div class="stat-prev-mod">${Calc.dnd.modStr(stats[k])}</div>
        `;
        grid.appendChild(box);
      });
      area.appendChild(grid);
      const lv = parseInt(bNow.level) || 1;
      const hp = Calc.dnd.hp(cls.name, stats.con, lv);
      const info = el("p", { style:"font-size:13px;color:var(--ink-faint);margin-top:10px" });
      info.innerHTML = `HP (nível ${lv}): <strong style="color:var(--ink)">${hp}</strong> &nbsp;·&nbsp; Dado de vida: <strong style="color:var(--ink)">d${cls.hd}</strong> &nbsp;·&nbsp; Bônus de proficiência: <strong style="color:var(--ink)">+${Calc.dnd.profBonus(lv)}</strong>`;
      area.appendChild(info);
    }

    setTimeout(updatePreview, 0);
    if (b.race) renderSubraces();
    if (b.cls) renderSubclasses();
    return wrap;
  }

  function canConfirmDnD() {
    const b = App.getBuildState();
    return !!(b.name?.trim() && b.race && b.cls);
  }

  function computeDnDStats(cls, race) {
    const base = { ...cls.base };
    if (race) {
      Object.entries(race.abilityBonuses).forEach(([k,v]) => {
        if (k !== "_choice") base[k] = (base[k] || 10) + v;
      });
      const b = App.getBuildState();
      if (b.subrace && race.subraces) {
        const subrace = race.subraces.find(sr => sr.id === b.subrace);
        if (subrace) {
          Object.entries(subrace.abilityBonuses).forEach(([k,v]) => {
            base[k] = (base[k] || 10) + v;
          });
        }
      }
    }
    return base;
  }

  function createDnDChar() {
    const b   = App.getBuildState();
    const cls = DND.classes.find(c => c.id === b.cls);
    const race = DND.races.find(r => r.id === b.race);

    let subraceName = null;
    if (b.subrace && race && race.subraces) {
      const subrace = race.subraces.find(sr => sr.id === b.subrace);
      if (subrace) subraceName = subrace.name;
    }

    let subclassName = null;
    if (b.subclass && cls && cls.subclasses) {
      const subclass = cls.subclasses.find(sc => sc.id === b.subclass);
      if (subclass) subclassName = subclass.name;
    }

    const stats = computeDnDStats(cls, race);
    const lv = parseInt(b.level) || 1;
    const hpMax = Calc.dnd.hp(cls.name, stats.con, lv);
    const slots = Calc.dnd.spellSlots(cls.id, lv);
    const slotState = {};
    Object.entries(slots).forEach(([lvl, count]) => { slotState[lvl] = Array(count).fill(0); });

    const raceSkills = race.skillProficiencies || [];
    const classSkills = cls.skillProficiencies || [];
    const allProficiencies = [...raceSkills, ...classSkills];
    const skillProfs = {};
    allProficiencies.forEach(s => { skillProfs[s] = true; });

    const character = new DnDCharacter({
      id: crypto.randomUUID(),
      sysId: "dnd",
      name: b.name.trim(),
      level: lv,
      cls: cls.name,
      clsId: cls.id,
      race: race.name,
      raceId: race.id,
      subrace: subraceName,
      subraceId: b.subrace,
      subclass: subclassName,
      subclassId: b.subclass,
      stats: { ...stats },
      hpCur: hpMax,
      hpMax: hpMax,
      slots: slotState,
      skillProfs: skillProfs,
      abilities: cls.features.map(f => [f, "", ""]),
      equip: [],
      notes: "",
    });

    App.setChar(character);
    GrimorioStorage.saveCharacter(character);
    App.go("sheet");
  }

  /* ══════════════════════════════════════
     ORDEM PARANORMAL (CORRIGIDO)
  ══════════════════════════════════════ */
  function renderOP() {
    Particles.setSystem("op");
    const b = App.getBuildState();

    const wrap = el("div", { class:"page screen-enter", style:"max-width:900px" });

    const hdr = el("div", { class:"build-header fu" });
    const back = el("button", { class:"btn-ghost" }, "← Voltar");
    back.addEventListener("click", () => { Dice.sounds.page(); App.go("select"); });
    const info = el("div");
    info.innerHTML = `<div class="build-title" style="color:var(--op-cyan)">🌙 Ordem Paranormal — Criar Agente</div>
      <div class="build-flavor">"Há coisas entre o mundo dos vivos e o desconhecido que a razão humana ainda não alcançou."</div>`;
    hdr.appendChild(back); hdr.appendChild(info);
    wrap.appendChild(hdr);

    wrap.appendChild(UI.divider("1. Nome e idade"));
    const nameRow = el("div", { class:"g2", style:"gap:12px" });
    const nameG = el("div");
    nameG.appendChild(el("div", { class:"field-label" }, "Nome do agente"));
    const nameI = el("input", { type:"text", placeholder:"Ex: Rafael Cambará", value: b.name || "" });
    nameI.addEventListener("input", e => { App.setBuildState({ name: e.target.value }); updateBtn(); });
    nameG.appendChild(nameI);
    const ageG = el("div");
    ageG.appendChild(el("div", { class:"field-label" }, "Idade"));
    const ageI = el("input", { type:"number", placeholder:"25", value: b.age || "", style:"width:80px" });
    ageI.addEventListener("input", e => App.setBuildState({ age: e.target.value }));
    ageG.appendChild(ageI);
    nameRow.appendChild(nameG); nameRow.appendChild(ageG);
    wrap.appendChild(nameRow);

    wrap.appendChild(UI.divider("2. Classe"));
    const clsGrid = el("div", { class:"opt-grid" });
    OP.classes.forEach(c => {
      const card = el("button", { class:"opt-card cls-opt" + (b.cls === c.id ? " active" : "") });
      card.innerHTML = `
        <div class="opt-name">${c.icon} ${c.name}</div>
        <div class="opt-desc">${c.desc}</div>
        <div class="opt-sub">▸ ${c.skillProficiencies.slice(0,3).join(", ")}</div>
      `;
      card.addEventListener("click", () => {
        Dice.sounds.click();
        App.setBuildState({ cls: c.id });
        wrap.querySelectorAll(".cls-opt").forEach(x => x.classList.remove("active"));
        card.classList.add("active");
        updatePreview();
      });
      clsGrid.appendChild(card);
    });
    wrap.appendChild(clsGrid);

    wrap.appendChild(UI.divider("3. Origem"));
    const origGrid = el("div", { class:"opt-grid" });
    OP.origins.forEach(o => {
      const card = el("button", { class:"opt-card orig-opt" + (b.origin === o.id ? " active" : "") });
      card.innerHTML = `<div class="opt-name">${o.name}</div><div class="opt-desc">${o.desc}</div><div class="opt-sub">▸ Perícia: ${o.skill}</div>`;
      card.addEventListener("click", () => {
        Dice.sounds.click();
        App.setBuildState({ origin: o.id });
        wrap.querySelectorAll(".orig-opt").forEach(x => x.classList.remove("active"));
        card.classList.add("active");
        updatePreview();
      });
      origGrid.appendChild(card);
    });
    wrap.appendChild(origGrid);

    const previewEl = el("div", { id:"preview-area" });
    wrap.appendChild(previewEl);

    const confirmBtn = el("button", { class:"btn-gold w100", style:"margin-top:20px" }, "✦ Criar agente e abrir ficha ✦");
    confirmBtn.id = "confirm-btn";
    confirmBtn.disabled = !canConfirmOP();
    confirmBtn.addEventListener("click", () => { if (!confirmBtn.disabled) { Dice.sounds.magic(); createOPChar(); } });
    wrap.appendChild(confirmBtn);

    function updateBtn() {
      const btn = document.getElementById("confirm-btn");
      if (btn) btn.disabled = !canConfirmOP();
    }

    function updatePreview() {
      updateBtn();
      const area = document.getElementById("preview-area");
      if (!area) return;
      const bNow = App.getBuildState();
      const cls  = OP.classes.find(c => c.id === bNow.cls);
      const orig = OP.origins.find(o => o.id === bNow.origin);
      if (!cls) { area.innerHTML = ""; return; }
      const stats = computeOPStats(cls, orig);
      area.innerHTML = "";
      area.appendChild(UI.divider("Preview dos atributos"));
      const grid = el("div", { class:"stats-preview", style:`grid-template-columns:repeat(${OP.statKeys.length},1fr)` });
      OP.statKeys.forEach(k => {
        const box = el("div", { class:"stat-prev", style:"border-color:var(--op-cyan-dim)" });
        box.innerHTML = `
          <div class="stat-prev-label">${OP.statLabels[k]}</div>
          <div class="stat-prev-val" style="color:var(--op-cyan)">${stats[k] || "—"}</div>
          <div class="stat-prev-mod">${Calc.op.bonusStr(stats[k])}</div>
        `;
        grid.appendChild(box);
      });
      area.appendChild(grid);
      const pv  = Calc.op.pv(cls.id, stats, 0);
      const pe  = Calc.op.pe(cls.id, stats, 0);
      const san = Calc.op.sanidade(cls.id, 0);
      const def = Calc.op.defesa(stats);
      const info = el("p", { style:"font-size:13px;color:var(--ink-faint);margin-top:10px" });
      info.innerHTML = `PV (NEX 0%): <strong style="color:var(--ink)">${pv}</strong> &nbsp;·&nbsp; PE: <strong style="color:var(--ink)">${pe}</strong> &nbsp;·&nbsp; Sanidade: <strong style="color:var(--ink)">${san}</strong> &nbsp;·&nbsp; Defesa: <strong style="color:var(--ink)">${def}</strong>`;
      area.appendChild(info);
    }

    setTimeout(updatePreview, 0);
    return wrap;
  }

  function canConfirmOP() {
    const b = App.getBuildState();
    return !!(b.name?.trim() && b.cls && b.origin);
  }

  function computeOPStats(cls, orig) {
    const base = { for: 1, agi: 1, int: 1, pre: 1, vig: 1 };
    return base;
  }

  function createOPChar() {
    const b = App.getBuildState();
    console.log('🔍 [Build] createOPChar chamado com:', b);

    if (typeof OP === 'undefined') {
      alert('Erro: Dados do Ordem Paranormal não carregados!');
      return;
    }

    const cls = OP.classes.find(c => c.id === b.cls);
    const orig = OP.origins.find(o => o.id === b.origin);

    console.log('🔍 [Build] Classe encontrada:', cls);
    console.log('🔍 [Build] Origem encontrada:', orig);

    if (!cls) {
      alert('Classe não encontrada! Selecione uma classe válida.');
      return;
    }

    const stats = { for: 1, agi: 1, int: 1, pre: 1, vig: 1 };
    const pvMax = Calc.op.pv(cls.id, stats, 0);
    const peMax = Calc.op.pe(cls.id, stats, 0);
    const sanMax = Calc.op.sanidade(cls.id, 0);

    console.log('🔍 [Build] PV calculado:', pvMax, 'PE:', peMax, 'SAN:', sanMax);

    const classSkills = cls.skillProficiencies || [];
    const originSkill = orig ? orig.skill : null;
    const allProficiencies = [...classSkills];
    if (originSkill && !allProficiencies.includes(originSkill)) {
      allProficiencies.push(originSkill);
    }
    const skillProfs = {};
    allProficiencies.forEach(s => { skillProfs[s] = true; });

    const character = new OPCharacter({
      id: crypto.randomUUID(),
      sysId: "op",
      name: b.name.trim(),
      age: b.age || "25",
      cls: cls.name,
      clsId: cls.id,
      origin: orig ? orig.name : '',
      originId: orig ? orig.id : '',
      stats: { ...stats },
      hpCur: pvMax,
      hpMax: pvMax,
      peCur: peMax,
      peMax: peMax,
      sanCur: sanMax,
      sanMax: sanMax,
      nexLevel: 0,
      nexPercent: 0,
      trilhas: { Sobrevivência: 0, Habilidades: 0, Poderes: 0, Rituais: 0 },
      skillProfs: skillProfs,
      abilities: cls.features.map(f => [f, "", ""]),
      equip: [],
      notes: "",
      _isNew: true,
    });

    console.log('🔍 [Build] Personagem criado:', character);
    App.setChar(character);
    GrimorioStorage.saveCharacter(character);
    App.go("sheet");
  }

  /* ══════════════════════════════════════
     SISTEMA CUSTOMIZADO
  ══════════════════════════════════════ */
  let customState = {
    sysName:"", charName:"",
    diceSet:"d4,d6,d8,d10,d12,d20",
    stats:[
      {id:"s1",label:"Atributo 1",value:10},
      {id:"s2",label:"Atributo 2",value:10},
      {id:"s3",label:"Atributo 3",value:10},
    ],
    skills:["Habilidade 1","Habilidade 2"],
    hpBase:10,
    theme:"arcano",
    resources:[
      {name:"HP",   max:20},
      {name:"Mana", max:15},
    ],
  };

  const themes = {
    arcano:      { color:"var(--gold)",    label:"Arcano" },
    tecnologico: { color:"var(--op-cyan)", label:"Tecnológico" },
    sombrio:     { color:"var(--crimson)", label:"Sombrio" },
    minimalista: { color:"var(--ink-dim)", label:"Minimalista" },
  };

  function renderCustom() {
    Particles.setSystem("custom");
    const c = customState;

    const wrap = el("div", { class:"page screen-enter", style:"max-width:760px" });
    const hdr = el("div", { class:"build-header fu" });
    const back = el("button", { class:"btn-ghost" }, "← Voltar");
    back.addEventListener("click", () => { Dice.sounds.page(); App.go("select"); });
    hdr.appendChild(back);
    hdr.appendChild(Object.assign(el("div"), { innerHTML:`<div class="build-title">✍️ Sistema Próprio</div>` }));
    wrap.appendChild(hdr);

    wrap.appendChild(UI.divider("1. Tema visual"));
    const themeRow = el("div", { style:"display:flex;gap:8px;flex-wrap:wrap;margin-bottom:4px" });
    Object.entries(themes).forEach(([id, th]) => {
      const btn = el("button", { class:"btn-ghost", style:`border-radius:20px;padding:6px 16px;${c.theme===id?`border-color:${th.color};color:${th.color}`:""}` }, th.label);
      btn.addEventListener("click", () => {
        customState.theme = id;
        wrap.querySelectorAll(".theme-btn").forEach(x => {
          x.style.borderColor=""; x.style.color="";
        });
        btn.style.borderColor = th.color;
        btn.style.color = th.color;
      });
      btn.classList.add("theme-btn");
      themeRow.appendChild(btn);
    });
    wrap.appendChild(themeRow);

    wrap.appendChild(UI.divider("2. Identidade"));
    const row2 = el("div", { class:"g2", style:"gap:12px" });
    const sysG = el("div");
    sysG.appendChild(el("div",{class:"field-label"},"Nome do sistema"));
    const sysI = el("input",{type:"text",placeholder:"Ex: Meu RPG",value:c.sysName});
    sysI.addEventListener("input",e=>{customState.sysName=e.target.value;updateCustomBtn();});
    sysG.appendChild(sysI); row2.appendChild(sysG);
    const charG = el("div");
    charG.appendChild(el("div",{class:"field-label"},"Nome do personagem"));
    const charI = el("input",{type:"text",placeholder:"Ex: Draven",value:c.charName});
    charI.addEventListener("input",e=>{customState.charName=e.target.value;updateCustomBtn();});
    charG.appendChild(charI); row2.appendChild(charG);
    wrap.appendChild(row2);

    wrap.appendChild(UI.divider("3. Atributos"));
    const statsEl = el("div"); statsEl.id="custom-stats-list";
    function renderStatsList() {
      statsEl.innerHTML="";
      customState.stats.forEach(s=>{
        const row = el("div",{class:"custom-row"});
        const li=el("input",{type:"text",placeholder:"Nome do atributo",value:s.label});
        li.addEventListener("input",e=>{s.label=e.target.value;});
        const vi=el("input",{type:"number",placeholder:"10",value:s.value,style:"width:80px"});
        vi.addEventListener("input",e=>{s.value=parseInt(e.target.value)||0;});
        const db=el("button",{class:"btn-del"},"✕");
        db.addEventListener("click",()=>{customState.stats=customState.stats.filter(x=>x.id!==s.id);renderStatsList();});
        row.appendChild(li);row.appendChild(vi);row.appendChild(db);
        statsEl.appendChild(row);
      });
    }
    renderStatsList();
    wrap.appendChild(statsEl);
    const addStatBtn=el("button",{class:"btn-add"},"+ Adicionar atributo");
    addStatBtn.addEventListener("click",()=>{customState.stats.push({id:"s"+Date.now(),label:"Novo Atributo",value:10});renderStatsList();});
    wrap.appendChild(addStatBtn);

    wrap.appendChild(UI.divider("4. Perícias"));
    const skillsEl=el("div",{class:"custom-skill-grid"});skillsEl.id="custom-skills-list";
    function renderSkillsList(){
      skillsEl.innerHTML="";
      customState.skills.forEach((sk,i)=>{
        const row=el("div",{class:"custom-skill-row"});
        const si=el("input",{type:"text",value:sk});
        si.addEventListener("input",e=>{customState.skills[i]=e.target.value;});
        const db=el("button",{class:"btn-del"},"✕");
        db.addEventListener("click",()=>{customState.skills.splice(i,1);renderSkillsList();});
        row.appendChild(si);row.appendChild(db);
        skillsEl.appendChild(row);
      });
    }
    renderSkillsList();
    wrap.appendChild(skillsEl);
    const addSkillBtn=el("button",{class:"btn-add"},"+ Adicionar perícia");
    addSkillBtn.addEventListener("click",()=>{customState.skills.push("Nova Habilidade");renderSkillsList();});
    wrap.appendChild(addSkillBtn);

    wrap.appendChild(UI.divider("5. Dados e HP"));
    const row5=el("div",{class:"g2",style:"gap:12px"});
    const diceG=el("div");
    diceG.appendChild(el("div",{class:"field-label"},"Dados (separados por vírgula)"));
    const diceI=el("input",{type:"text",placeholder:"d4,d6,d8,d10,d12,d20",value:c.diceSet});
    diceI.addEventListener("input",e=>{customState.diceSet=e.target.value;});
    diceG.appendChild(diceI);row5.appendChild(diceG);
    const hpG=el("div");
    hpG.appendChild(el("div",{class:"field-label"},"HP inicial"));
    const hpI=el("input",{type:"number",value:c.hpBase,style:"width:80px"});
    hpI.addEventListener("input",e=>{customState.hpBase=parseInt(e.target.value)||10;});
    hpG.appendChild(hpI);row5.appendChild(hpG);
    wrap.appendChild(row5);

    const confirmBtn=el("button",{class:"btn-gold w100",style:"margin-top:20px"},"✦ Criar personagem e abrir ficha ✦");
    confirmBtn.id="custom-confirm-btn";
    confirmBtn.disabled=!(c.sysName.trim()&&c.charName.trim());
    confirmBtn.addEventListener("click",()=>{if(!confirmBtn.disabled){Dice.sounds.magic();createCustomChar();}});
    wrap.appendChild(confirmBtn);

    function updateCustomBtn(){
      const btn=document.getElementById("custom-confirm-btn");
      if(btn) btn.disabled=!(customState.sysName.trim()&&customState.charName.trim());
    }

    return wrap;
  }

  function createCustomChar() {
    const c=customState;
    const stats={};
    c.stats.forEach(s=>{stats[s.id]=s.value;});

    const character = new CustomCharacter({
      id: crypto.randomUUID(),
      sysId: "custom",
      name: c.charName.trim(),
      stats: stats,
      hpCur: c.hpBase,
      hpMax: c.hpBase,
      abilities: [],
      equip: [],
      notes: "",
      customSysName: c.sysName.trim(),
      customStatKeys: c.stats.map(s => s.id),
      customStatLabels: Object.fromEntries(c.stats.map(s => [s.id, s.label])),
      customSkills: [...c.skills],
      customDiceSet: c.diceSet.split(",").map(d => d.trim()).filter(Boolean),
      customTheme: c.theme,
      customResources: c.resources.map(r => ({ ...r, cur: r.max })),
    });

    App.setChar(character);
    GrimorioStorage.saveCharacter(character);
    App.go("sheet");
  }

  function render(sysId) {
    if (sysId === "dnd") return renderDnD();
    if (sysId === "op")  return renderOP();
    return renderCustom();
  }

  return { render };
})();