/* js/ui/sheet.js — Ficha completa com correções finais */

const SheetScreen = (() => {

  let expandedItems = {};
  let expandedAbilities = {};

  // ── Função segura para criar elementos ──
  function safeEl(tag, attrs = {}, ...children) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") e.className = v;
        else if (k === "style" && typeof v === "object") Object.assign(e.style, v);
        else if (k === "style") e.setAttribute("style", v);
        else if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), v);
        else e.setAttribute(k, v);
      }
    }
    for (const c of children) {
      if (c == null || c === false || c === undefined) continue;
      if (typeof c === "string") e.appendChild(document.createTextNode(c));
      else if (c instanceof Node) e.appendChild(c);
      else if (typeof c === "number") e.appendChild(document.createTextNode(String(c)));
      else {
        console.warn('⚠️ [safeEl] filho inválido:', c);
      }
    }
    return e;
  }

  const el = safeEl;

  function render() {
    const char = App.getChar();
    if (!char) {
      const wrap = el("div", { class: "page" });
      wrap.appendChild(el("p", { style: "color:var(--red);text-align:center;padding:40px;" }, "Nenhum personagem carregado."));
      return wrap;
    }

    const isDnD = char.sysId === "dnd";
    const isOP = char.sysId === "op";
    const isCustom = char.sysId === "custom";

    const sys = isDnD ? DND : isOP ? OP : null;
    const statKeys = isCustom ? char.customStatKeys : (sys ? sys.statKeys : []);
    const statLabels = isCustom ? char.customStatLabels : (sys ? sys.statLabels : {});
    const skills = isCustom ? char.customSkills : (sys ? sys.skills : []);
    const diceSet = isCustom ? char.customDiceSet : (sys ? sys.diceSet : ['d4','d6','d8','d10','d12','d20']);
    const sysName = isCustom ? char.customSysName : (sys ? sys.name : "Sistema");
    const sysIcon = isDnD ? "⚔️" : isOP ? "🌙" : "✍️";

    Particles.setSystem(char.sysId === "custom" ? "custom" : char.sysId);

    const wrap = el("div", { class: "page screen-enter", style: "max-width:1200px; margin:0 auto;" });

    const top = el("div", { class: "sheet-top fu" });
    const nameDiv = el("div");
    nameDiv.innerHTML = `
      <div class="ornament" style="text-align:left;font-size:13px;letter-spacing:5px;margin-bottom:4px">✦ ✦ ✦</div>
      <div class="char-name">${char.name || "Sem nome"}</div>
      <div class="char-sub">${sysIcon} ${sysName} · ${char.cls || "—"} · ${isDnD ? `Nível ${char.level || 1}` : isOP ? `${char.age || "—"} anos · ${char.origin || ""}` : ""}</div>
    `;
    top.appendChild(nameDiv);

    const topRight = el("div", { style: "display:flex;gap:8px;align-items:center" });
    const newCharBtn = el("button", { class: "btn-ghost" }, "←✦Página Inicial✦");
    newCharBtn.addEventListener("click", () => {
      Dice.sounds.page();
      App.clearChar();
      App.resetBuildState();
      App.clearLog();
      App.go("select");
    });
    topRight.appendChild(newCharBtn);

    const deleteCharBtn = el("button", {
      class: "btn-ghost",
      style: "color:var(--crimson);border-color:var(--crimson)"
    }, "🗑️ Excluir Ficha");
    deleteCharBtn.addEventListener("click", () => {
      if (confirm(`Tem certeza que deseja excluir permanentemente "${char.name}"?`)) {
        GrimorioStorage.deleteCharacter(char.id);
        App.clearChar();
        App.resetBuildState();
        App.clearLog();
        Dice.sounds.page();
        App.go("select");
      }
    });
    topRight.appendChild(deleteCharBtn);
    top.appendChild(topRight);
    wrap.appendChild(top);

    const mainGrid = el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start;" });

    const left = el("div", { class: "col" });
    left.appendChild(renderStats(char, statKeys, statLabels, isDnD, isOP));
    left.appendChild(renderStatusBars(char, isDnD, isOP));
    if (isDnD) left.appendChild(renderSpellSlots(char));
    if (isOP) left.appendChild(renderOPNex(char));
    mainGrid.appendChild(left);

    const right = el("div", { class: "col" });
    const tabBar = el("div", { class: "tab-bar fu2" });
    const tabList = [
      ["skills", "Perícias"],
      ["abilities", "Habilidades"],
      ["equip", "Equipamentos"],
      ["notes", "Anotações"]
    ];
    tabList.forEach(([id, lbl]) => {
      const btn = el("button", { class: "tab-btn" + (App.getTab() === id ? " active" : "") }, lbl);
      btn.dataset.tab = id;
      btn.addEventListener("click", () => {
        Dice.sounds.click();
        App.setTab(id);
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".mobile-nav-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTabContent(char, skills, isDnD, isOP);
      });
      tabBar.appendChild(btn);
    });
    right.appendChild(tabBar);

    const tabContent = el("div", { id: "tab-content" });
    right.appendChild(tabContent);

    const rollSection = renderRollSection(char, diceSet, isDnD, isOP);
    right.appendChild(rollSection);

    mainGrid.appendChild(right);
    wrap.appendChild(mainGrid);

    setTimeout(() => {
      console.log('🔄 [Sheet] Renderizando aba inicial...');
      renderTabContent(char, skills, isDnD, isOP);
    }, 100);

    return wrap;
  }

  // ── Seção de rolagens rápidas ──
  function renderRollSection(char, diceSet, isDnD, isOP) {
    const section = el("div", { class: "card", style: "margin-top:14px;" });
    section.appendChild(el("div", { class: "card-title" }, "🎲 Rolagens Rápidas"));

    const controls = el("div", { style: "display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px;" });

    const modG = el("div", { style: "display:flex;align-items:center;gap:4px;" });
    modG.appendChild(el("span", { style: "font-size:12px;color:var(--ink-faint);" }, "Mod:"));
    const modI = el("input", { type: "number", value: App.getRollMod(), style: "width:60px;padding:4px;" });
    modI.addEventListener("input", e => App.setRollMod(e.target.value));
    modG.appendChild(modI);
    controls.appendChild(modG);

    const lblG = el("div", { style: "display:flex;align-items:center;gap:4px;" });
    lblG.appendChild(el("span", { style: "font-size:12px;color:var(--ink-faint);" }, "Rótulo:"));
    const lblI = el("input", { type: "text", value: App.getRollLabel(), placeholder: "Ex: Ataque", style: "width:100px;padding:4px;" });
    lblI.addEventListener("input", e => App.setRollLabel(e.target.value));
    lblG.appendChild(lblI);
    controls.appendChild(lblG);

    const advG = el("div", { style: "display:flex;align-items:center;gap:4px;" });
    advG.appendChild(el("span", { style: "font-size:12px;color:var(--ink-faint);" }, "Nível:"));
    const advInput = el("input", {
      type: "number",
      value: App.getAdvantageLevel(),
      style: "width:50px;padding:4px;text-align:center;",
      min: -5,
      max: 5,
    });
    advInput.addEventListener("input", () => {
      const val = parseInt(advInput.value) || 0;
      App.setAdvantageLevel(val);
    });
    advG.appendChild(advInput);
    controls.appendChild(advG);

    section.appendChild(controls);

    // ── Campo para expressão composta ──
    const customExprRow = el("div", { style: "display:flex;gap:6px;align-items:center;margin-bottom:10px;flex-wrap:wrap;" });
    customExprRow.appendChild(el("span", { style: "font-size:12px;color:var(--ink-faint);" }, "Expressão:"));
    const exprInput = el("input", {
      type: "text",
      placeholder: "Ex: 3d6+6d8+2",
      style: "flex:1;min-width:150px;padding:4px 8px;background:var(--parch-2);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);"
    });
    customExprRow.appendChild(exprInput);
    const rollExprBtn = el("button", { class: "btn-dice", style: "background:var(--gold-dim);color:#000;font-weight:bold;" }, "🎲 Rolar");
    rollExprBtn.addEventListener("click", () => {
      const expr = exprInput.value.trim();
      if (!expr) { alert("Digite uma expressão, ex: 3d6+6d8"); return; }
      const mod = parseInt(App.getRollMod()) || 0;
      const label = App.getRollLabel() || expr;
      const entry = Calc.rollCustomDice(expr, mod, label);
      if (entry) {
        App.pushLog(entry);
        refreshLog();
      } else {
        alert("Expressão inválida. Use formato como: 3d6+6d8+2");
      }
    });
    customExprRow.appendChild(rollExprBtn);
    section.appendChild(customExprRow);

    // ── Botões de dados rápidos ──
    const diceBar = el("div", { class: "dice-shortcuts", style: "display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;" });
    
    let diceList = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
    if (Array.isArray(diceSet) && diceSet.length > 0) {
      diceList = diceSet;
    }

    diceList.forEach(d => {
      const btn = el("button", { class: "btn-dice" }, d);
      btn.addEventListener("click", () => {
        const mod = parseInt(App.getRollMod()) || 0;
        const label = App.getRollLabel() || d;
        const entry = Calc.rollCustomDice(d, mod, label);
        if (entry) {
          App.pushLog(entry);
          refreshLog();
        }
      });
      diceBar.appendChild(btn);
    });

    section.appendChild(diceBar);

    function renderShortcuts() {
      diceBar.querySelectorAll('.shortcut').forEach(el => el.remove());

      // ── Itens (equipamento) ──
      (char.equip || []).forEach((row, idx) => {
        const [name, qty, obs] = row;
        const damageMatch = obs ? obs.match(/Dano:\s*([^|]+)/i) : null;
        if (!damageMatch) return;
        let damageExpr = damageMatch[1].trim().replace(/\s/g, '');

        const statMatch = obs ? obs.match(/Atributo:\s*([^|]+)/i) : null;
        const statKey = statMatch ? statMatch[1].trim().toLowerCase() : null;

        const skillMatch = obs ? obs.match(/Perícia:\s*([^|]+)/i) : null;
        const skillName = skillMatch ? skillMatch[1].trim() : null;

        const critMatch = obs ? obs.match(/Critico:\s*(\d+)/i) : null;
        const critRange = critMatch ? parseInt(critMatch[1]) : 20;

        const multMatch = obs ? obs.match(/Multiplicador:\s*x(\d+)/i) : null;
        const critMult = multMatch ? parseInt(multMatch[1]) : 2;

        const btn = el("button", { class: "btn-dice shortcut", style: "background:var(--parch-4);border-color:var(--gold-dim);" }, `⚔️ ${name}`);
        btn.addEventListener("click", () => {
          let attackBonus = 0;
          if (skillName && char.skillTrainingLevel && char.skillTrainingLevel[skillName] !== undefined) {
            attackBonus += char.skillTrainingLevel[skillName] || 0;
          }
          if (skillName && char.skillExtraBonuses && char.skillExtraBonuses[skillName] !== undefined) {
            attackBonus += char.skillExtraBonuses[skillName] || 0;
          }
          const modGeral = parseInt(App.getRollMod()) || 0;
          attackBonus += modGeral;

          let qtd = 1;
          if (statKey && char.stats[statKey] !== undefined) {
            qtd = Math.max(1, char.stats[statKey] || 1);
          }
          const level = App.getAdvantageLevel();
          const rollResult = Dice.rollWithAdvantageLevel(20, level, qtd);
          const total = rollResult.result + attackBonus;
          const isCrit = rollResult.result >= critRange;
          const isFail = rollResult.result === 1;
          const cls = isCrit ? "crit" : isFail ? "fail" : "norm";
          const display = `d20×${rollResult.rolls.length}${level!==0?` (${rollResult.mode})`:""} → ${rollResult.result} ${attackBonus>=0?"+":""}${attackBonus} = ${total}`;
          const attackLog = {
            label: `Ataque: ${name}`,
            display: display + (isCrit ? " — Crítico!" : isFail ? " — Falha!" : ""),
            cls: cls,
            id: Date.now() + Math.random(),
            result: total,
            max: 20
          };
          App.pushLog(attackLog);
          if (isCrit) Dice.sounds.crit();
          else if (isFail) Dice.sounds.fail();
          else Dice.sounds.dice();

          if (cls !== 'fail') {
            const damageEntry = Calc.rollCustomDice(damageExpr, 0, `Dano: ${name}`);
            if (damageEntry) {
              if (isCrit) {
                damageEntry.result *= critMult;
                damageEntry.display += ` (Crítico x${critMult}! Dano: ${damageEntry.result})`;
              }
              App.pushLog(damageEntry);
            }
          }
          refreshLog();
        });
        diceBar.appendChild(btn);
      });

      // ── Habilidades ──
      (char.abilities || []).forEach((row, idx) => {
        const [name, bonus, desc] = row;
        const diceMatch = bonus.match(/(\d*d\d+([+-]\d+)?)/);
        if (!diceMatch) return;
        const diceExpr = diceMatch[0];
        const statMatch = bonus.match(/em\s+(\w+)/i);
        const statKey = statMatch ? statMatch[1].toLowerCase() : null;
        const skillMatch = (bonus + " " + desc).match(/Perícia:\s*([^|]+)/i);
        const skillName = skillMatch ? skillMatch[1].trim() : null;

        const btn = el("button", { class: "btn-dice shortcut", style: "background:var(--parch-4);border-color:var(--op-cyan-dim);" }, `✨ ${name}`);
        btn.addEventListener("click", () => {
          let useBonus = 0;
          if (skillName && char.skillTrainingLevel && char.skillTrainingLevel[skillName] !== undefined) {
            useBonus += char.skillTrainingLevel[skillName] || 0;
          }
          if (skillName && char.skillExtraBonuses && char.skillExtraBonuses[skillName] !== undefined) {
            useBonus += char.skillExtraBonuses[skillName] || 0;
          }
          const modGeral = parseInt(App.getRollMod()) || 0;
          useBonus += modGeral;

          let qtd = 1;
          if (statKey && char.stats[statKey] !== undefined) {
            qtd = Math.max(1, char.stats[statKey] || 1);
          }
          const level = App.getAdvantageLevel();
          const rollResult = Dice.rollWithAdvantageLevel(20, level, qtd);
          const total = rollResult.result + useBonus;
          const isCrit = rollResult.result === 20;
          const isFail = rollResult.result === 1;
          const cls = isCrit ? "crit" : isFail ? "fail" : "norm";
          const display = `d20×${rollResult.rolls.length}${level!==0?` (${rollResult.mode})`:""} → ${rollResult.result} ${useBonus>=0?"+":""}${useBonus} = ${total}`;
          const skillLog = {
            label: `Uso Habilidade: ${name}`,
            display: display + (isCrit ? " — Crítico!" : isFail ? " — Falha!" : ""),
            cls: cls,
            id: Date.now() + Math.random(),
            result: total,
            max: 20
          };
          App.pushLog(skillLog);
          if (isCrit) Dice.sounds.crit();
          else if (isFail) Dice.sounds.fail();
          else Dice.sounds.dice();

          if (cls !== 'fail') {
            const damageEntry = Calc.rollCustomDice(diceExpr, 0, `Dano (Habilidade): ${name}`);
            if (damageEntry) {
              if (isCrit) {
                damageEntry.result *= 2;
                damageEntry.display += ' (Crítico! Dano dobrado)';
              }
              App.pushLog(damageEntry);
            }
          }
          refreshLog();
        });
        diceBar.appendChild(btn);
      });
    }

    renderShortcuts();
    section._renderShortcuts = renderShortcuts;

    const logLabel = el("div", { class: "field-label", style: "margin-bottom:4px;" }, "Histórico");
    section.appendChild(logLabel);
    const logBox = el("div", { class: "log-box", id: "roll-log" });
    renderLogInto(logBox);
    section.appendChild(logBox);

    const clearBtn = el("button", { class: "btn-ghost", style: "margin-top:6px;font-size:12px;" }, "Limpar histórico");
    clearBtn.addEventListener("click", () => { App.clearLog(); refreshLog(); });
    section.appendChild(clearBtn);

    return section;
  }

  // ── Estatísticas ──
  function renderStats(char, statKeys, statLabels, isDnD, isOP) {
    const card = el("div", { class: "card fu2" });
    card.appendChild(el("div", { class: "card-title" }, isDnD ? "Atributos" : isOP ? "Atributos" : "Atributos"));

    const grid = el("div", { class: "g2", style: "gap:6px" });

    statKeys.forEach(k => {
      const row = el("div", { class: "stat-row" });
      row.appendChild(el("span", { class: "stat-lbl" }, statLabels[k]));

      const inp = el("input", { class: "stat-inp", type: "number", value: char.stats[k] || "" });
      inp.addEventListener("input", e => {
        const val = parseInt(e.target.value) || 0;
        if (isOP) {
          char.setStat(k, val);
        } else {
          char.stats[k] = val;
          App.saveChar();
        }
        const modEl = row.querySelector(".stat-mod");
        if (modEl) {
          if (isDnD) modEl.textContent = char.getModStr(k);
          if (isOP) modEl.textContent = char.getBonusStr(k);
        }
        if (isOP) {
          UI.updateBar("hp", char.hpCur, char.hpMax, "var(--green)");
          UI.updateBar("pe", char.peCur, char.peMax, "var(--op-cyan)");
          UI.updateBar("san", char.sanCur, char.sanMax, "var(--purple)");
          updateStatusInputs(char, false, true);
        }
        updateDefense(char, isDnD, isOP);
      });
      row.appendChild(inp);

      const mod = isDnD ? char.getModStr(k) : isOP ? char.getBonusStr(k) : "";
      row.appendChild(el("span", { class: "stat-mod" }, mod));

      const rollBtn = el("button", { class: "btn-roll" }, "🎲");
      rollBtn.addEventListener("click", () => {
        rollBtn.classList.remove("spin");
        void rollBtn.offsetWidth;
        rollBtn.classList.add("spin");
        const level = App.getAdvantageLevel();
        const entry = Calc.rollStat(char.sysId, statLabels[k], k, char.stats, level, 0);
        if (entry) {
          App.pushLog(entry);
          refreshLog();
        }
      });
      row.appendChild(rollBtn);
      grid.appendChild(row);
    });

    card.appendChild(grid);

    const def = isDnD ? char.getAC() : isOP ? char.getDefesa() : 0;
    const defBox = el("div", { class: "stat-def", style: "margin-top:10px;padding:6px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);text-align:center;" });
    defBox.innerHTML = `<span style="font-family:'Cinzel',serif;font-size:10px;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.06em;">Defesa</span><br><span style="font-size:24px;font-weight:700;color:${isDnD ? 'var(--gold)' : 'var(--op-cyan)'};">${def}</span>`;
    card.appendChild(defBox);

    return card;
  }

  function updateDefense(char, isDnD, isOP) {
    const defBox = document.querySelector('.stat-def');
    if (defBox) {
      const def = isDnD ? char.getAC() : isOP ? char.getDefesa() : 0;
      const span = defBox.querySelector('span:last-child');
      if (span) span.textContent = def;
    }
  }

  function updateStatusInputs(char, isDnD, isOP) {
    const hpMaxInput = document.querySelector('input[data-stat="hpMax"]');
    if (hpMaxInput) hpMaxInput.value = char.hpMax;
    const hpCurInput = document.querySelector('input[data-stat="hpCur"]');
    if (hpCurInput && char.hpCur === char.hpMax) hpCurInput.value = char.hpMax;

    if (isOP) {
      const peMaxInput = document.querySelector('input[data-stat="peMax"]');
      if (peMaxInput) peMaxInput.value = char.peMax;
      const peCurInput = document.querySelector('input[data-stat="peCur"]');
      if (peCurInput && char.peCur === char.peMax) peCurInput.value = char.peMax;

      const sanMaxInput = document.querySelector('input[data-stat="sanMax"]');
      if (sanMaxInput) sanMaxInput.value = char.sanMax;
      const sanCurInput = document.querySelector('input[data-stat="sanCur"]');
      if (sanCurInput && char.sanCur === char.sanMax) sanCurInput.value = char.sanMax;
    }
  }

  function renderStatusBars(char, isDnD, isOP) {
    const card = el("div", { class: "card fu3" });
    card.appendChild(el("div", { class: "card-title" }, "Status"));

    const hpSection = el("div", { style: "margin-bottom:14px" });
    hpSection.appendChild(UI.barGroup("Pontos de Vida", char.hpCur || 0, char.hpMax || 1, "var(--green)", "hp"));
    const hpInputs = el("div", { style: "display:flex;gap:8px;align-items:flex-end;margin-top:8px" });
    const hpCurG = el("div", { style: "flex:1" });
    hpCurG.appendChild(el("div", { class: "field-label" }, "Atual"));
    const hpCurI = el("input", { type: "number", value: char.hpCur || "", "data-stat": "hpCur" });
    hpCurI.addEventListener("input", e => {
      char.hpCur = parseInt(e.target.value) || 0;
      if (char.hpCur > char.hpMax) char.hpCur = char.hpMax;
      App.saveChar();
      UI.updateBar("hp", char.hpCur, char.hpMax, "var(--green)");
    });
    hpCurG.appendChild(hpCurI);
    hpInputs.appendChild(hpCurG);
    hpInputs.appendChild(el("span", { style: "font-size:20px;color:var(--ink-faint);padding-bottom:6px" }, "/"));
    const hpMaxG = el("div", { style: "flex:1" });
    hpMaxG.appendChild(el("div", { class: "field-label" }, "Máximo"));
    const hpMaxI = el("input", { type: "number", value: char.hpMax || "", "data-stat": "hpMax" });
    hpMaxI.addEventListener("input", e => {
      const oldMax = char.hpMax;
      const newMax = parseInt(e.target.value) || 0;
      if (char.hpCur === oldMax || char.hpCur === oldMax) {
        char.hpCur = Math.min(char.hpCur + (newMax - oldMax), newMax);
      }
      char.hpMax = newMax;
      if (char.hpCur > char.hpMax) char.hpCur = char.hpMax;
      App.saveChar();
      UI.updateBar("hp", char.hpCur, char.hpMax, "var(--green)");
      const curInput = document.querySelector('input[data-stat="hpCur"]');
      if (curInput) curInput.value = char.hpCur;
    });
    hpMaxG.appendChild(hpMaxI);
    hpInputs.appendChild(hpMaxG);
    hpSection.appendChild(hpInputs);
    card.appendChild(hpSection);

    if (isOP) {
      const peSection = el("div", { style: "margin-bottom:14px" });
      peSection.appendChild(UI.barGroup("Pontos de Esforço", char.peCur || 0, char.peMax || 1, "var(--op-cyan)", "pe"));
      const peInputs = el("div", { style: "display:flex;gap:8px;align-items:flex-end;margin-top:8px" });
      const peCurG = el("div", { style: "flex:1" });
      peCurG.appendChild(el("div", { class: "field-label" }, "Atual"));
      const peCurI = el("input", { type: "number", value: char.peCur || "", "data-stat": "peCur" });
      peCurI.addEventListener("input", e => {
        char.peCur = parseInt(e.target.value) || 0;
        if (char.peCur > char.peMax) char.peCur = char.peMax;
        App.saveChar();
        UI.updateBar("pe", char.peCur, char.peMax, "var(--op-cyan)");
      });
      peCurG.appendChild(peCurI);
      peInputs.appendChild(peCurG);
      peInputs.appendChild(el("span", { style: "font-size:20px;color:var(--ink-faint);padding-bottom:6px" }, "/"));
      const peMaxG = el("div", { style: "flex:1" });
      peMaxG.appendChild(el("div", { class: "field-label" }, "Máximo"));
      const peMaxI = el("input", { type: "number", value: char.peMax || "", "data-stat": "peMax" });
      peMaxI.addEventListener("input", e => {
        const oldMax = char.peMax;
        const newMax = parseInt(e.target.value) || 0;
        if (char.peCur === oldMax) {
          char.peCur = Math.min(char.peCur + (newMax - oldMax), newMax);
        }
        char.peMax = newMax;
        if (char.peCur > char.peMax) char.peCur = char.peMax;
        App.saveChar();
        UI.updateBar("pe", char.peCur, char.peMax, "var(--op-cyan)");
        const curInput = document.querySelector('input[data-stat="peCur"]');
        if (curInput) curInput.value = char.peCur;
      });
      peMaxG.appendChild(peMaxI);
      peInputs.appendChild(peMaxG);
      peSection.appendChild(peInputs);
      card.appendChild(peSection);

      const sanSection = el("div");
      sanSection.appendChild(UI.barGroup("Sanidade", char.sanCur || 0, char.sanMax || 1, "var(--purple)", "san"));
      const sanInputs = el("div", { style: "display:flex;gap:8px;align-items:flex-end;margin-top:8px" });
      const sanCurG = el("div", { style: "flex:1" });
      sanCurG.appendChild(el("div", { class: "field-label" }, "Atual"));
      const sanCurI = el("input", { type: "number", value: char.sanCur || "", "data-stat": "sanCur" });
      sanCurI.addEventListener("input", e => {
        char.sanCur = parseInt(e.target.value) || 0;
        if (char.sanCur > char.sanMax) char.sanCur = char.sanMax;
        App.saveChar();
        UI.updateBar("san", char.sanCur, char.sanMax, "var(--purple)");
      });
      sanCurG.appendChild(sanCurI);
      sanInputs.appendChild(sanCurG);
      sanInputs.appendChild(el("span", { style: "font-size:20px;color:var(--ink-faint);padding-bottom:6px" }, "/"));
      const sanMaxG = el("div", { style: "flex:1" });
      sanMaxG.appendChild(el("div", { class: "field-label" }, "Máximo"));
      const sanMaxI = el("input", { type: "number", value: char.sanMax || "", "data-stat": "sanMax" });
      sanMaxI.addEventListener("input", e => {
        const oldMax = char.sanMax;
        const newMax = parseInt(e.target.value) || 0;
        if (char.sanCur === oldMax) {
          char.sanCur = Math.min(char.sanCur + (newMax - oldMax), newMax);
        }
        char.sanMax = newMax;
        if (char.sanCur > char.sanMax) char.sanCur = char.sanMax;
        App.saveChar();
        UI.updateBar("san", char.sanCur, char.sanMax, "var(--purple)");
        const curInput = document.querySelector('input[data-stat="sanCur"]');
        if (curInput) curInput.value = char.sanCur;
      });
      sanMaxG.appendChild(sanMaxI);
      sanInputs.appendChild(sanMaxG);
      sanSection.appendChild(sanInputs);
      card.appendChild(sanSection);
    }

    return card;
  }

  function renderOPNex(char) {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "card-title" }, "NEX (Nível de Exposição)"));

    const row = el("div", { style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap;" });
    row.appendChild(el("span", { style: "font-family:'Cinzel',serif;font-size:12px;color:var(--ink-faint);" }, "Valor:"));

    const nexSelect = el("select", {
      style: "width:120px;padding:6px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--op-cyan);font-weight:700;font-size:14px;"
    });

    const nexValues = [];
    for (let v = 0; v <= 95; v += 5) nexValues.push(v);
    nexValues.push(99);

    nexValues.forEach(v => {
      const opt = el("option", { value: v }, v + '%');
      if ((char.nexPercent ?? 0) === v) opt.selected = true;
      nexSelect.appendChild(opt);
    });

    nexSelect.addEventListener("change", () => {
      const val = parseInt(nexSelect.value) || 0;
      char.nexPercent = val;
      const vals = [];
      for (let v = 0; v <= 95; v += 5) vals.push(v);
      vals.push(99);
      const idx = vals.indexOf(val);
      char.nexLevel = idx >= 0 ? idx : 0;
      App.saveChar();
      const labelEl = row.querySelector('.nex-label');
      if (labelEl) labelEl.textContent = char.getNEXLabel();
      char.recalcDerived();
      App.saveChar();
      UI.updateBar("hp", char.hpCur, char.hpMax, "var(--green)");
      UI.updateBar("pe", char.peCur, char.peMax, "var(--op-cyan)");
      UI.updateBar("san", char.sanCur, char.sanMax, "var(--purple)");
      updateDefense(char, false, true);
      updateStatusInputs(char, false, true);
    });

    row.appendChild(nexSelect);
    const label = el("span", { class: "nex-label", style: "font-size:14px;color:var(--op-cyan);font-weight:700;margin-left:8px;" }, char.getNEXLabel());
    row.appendChild(label);
    card.appendChild(row);

    const recalcBtn = el("button", { class: "btn-ghost", style: "margin-top:8px;font-size:12px;" }, "Recalcular PV/PE/Sanidade");
    recalcBtn.addEventListener("click", () => {
      char.recalcDerived();
      App.saveChar();
      UI.updateBar("hp", char.hpCur, char.hpMax, "var(--green)");
      UI.updateBar("pe", char.peCur, char.peMax, "var(--op-cyan)");
      UI.updateBar("san", char.sanCur, char.sanMax, "var(--purple)");
      updateStatusInputs(char, false, true);
      Dice.sounds.click();
    });
    card.appendChild(recalcBtn);

    return card;
  }

  function renderSpellSlots(char) {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "card-title" }, "Espaços de Magia"));

    const slotsData = char.slots || {};
    const level = char.level || 1;

    for (let lvl = 1; lvl <= 9; lvl++) {
      const total = DND.spellSlots[lvl]?.[level] || 0;
      if (total === 0) continue;

      const state = slotsData[lvl] || Array(total).fill(0);

      const row = el("div", { style: "display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)" });
      row.appendChild(el("span", { style: "font-family:'Cinzel',serif;font-size:11px;color:var(--ink-faint);min-width:52px" }, `Nível ${lvl}`));

      const pips = el("div", { style: "display:flex;gap:4px;flex:1;justify-content:flex-end" });
      for (let i = 0; i < total; i++) {
        const pip = el("div", { class: "pip" + (state[i] === 1 ? " used" : "") });
        pip.addEventListener("click", () => {
          Dice.sounds.click();
          const s = [...(char.slots[lvl] || Array(total).fill(0))];
          s[i] = s[i] === 1 ? 0 : 1;
          char.slots[lvl] = s;
          App.saveChar();
          pip.classList.toggle("used");
        });
        pips.appendChild(pip);
      }
      row.appendChild(pips);
      card.appendChild(row);
    }

    return card;
  }

  function renderTabContent(char, skills, isDnD, isOP) {
    const tc = document.getElementById("tab-content");
    if (!tc) {
      console.warn('⚠️ [Sheet] #tab-content não encontrado!');
      return;
    }
    tc.innerHTML = "";

    const tab = App.getTab();

    document.querySelectorAll(".tab-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.tab === tab);
    });

    let content = null;
    if (tab === "skills") {
      console.log('📋 [Sheet] Renderizando aba de Perícias...');
      content = renderSkillsTab(char, skills, isDnD, isOP);
    } else if (tab === "abilities") {
      content = renderAbilitiesTab(char);
    } else if (tab === "equip") {
      content = renderEquipTab(char);
    } else if (tab === "notes") {
      content = renderNotesTab(char);
    }

    if (content && content instanceof Node) {
      tc.appendChild(content);
    } else {
      console.warn('⚠️ [Sheet] Conteúdo inválido para a aba:', tab, content);
      tc.appendChild(el("p", { style: "color:var(--ink-faint);padding:20px;text-align:center;" }, "Nenhum conteúdo para esta aba."));
    }
  }

  function switchTab(tabId) {
    const char = App.getChar();
    if (!char) return;
    const isDnD = char.sysId === "dnd";
    const isOP = char.sysId === "op";
    const sys = isDnD ? DND : isOP ? OP : null;
    const skills = char.customSkills || sys?.skills || [];
    App.setTab(tabId);
    renderTabContent(char, skills, isDnD, isOP);
  }

  // ── Perícias ── com correção na leitura de valores e atualização do display ──
  function renderSkillsTab(char, skills, isDnD, isOP) {
    // Garantir que os campos existam
    if (!char.skillTrainingLevel) char.skillTrainingLevel = {};
    if (!char.skillExtraBonuses) char.skillExtraBonuses = {};

    const skillList = Array.isArray(skills) ? skills : [];

    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "card-title" }, isDnD ? "Perícias" : isOP ? "Perícias" : "Perícias"));

    if (skillList.length === 0) {
      card.appendChild(el("p", { style: "color:var(--ink-faint);padding:20px;text-align:center;" }, "Nenhuma perícia disponível."));
      return card;
    }

    const grid = el("div", { class: "g2", style: "gap:5px" });

    const normalizedSkills = skillList.map(sk => {
      if (typeof sk === "string") return { name: sk, stat: null };
      return { name: sk.name || "Perícia", stat: sk.stat || null };
    });

    normalizedSkills.forEach(sk => {
      const name = sk.name;
      const stat = sk.stat;

      // Para D&D, o mod do atributo é somado ao total (apenas para exibição)
      let statMod = 0;
      if (isDnD && stat) {
        statMod = char.getMod ? char.getMod(stat) : 0;
      }

      // Função para obter os valores atuais do personagem
      const getCurrentValues = () => {
        const training = char.skillTrainingLevel[name] ?? 0;
        const extra = char.skillExtraBonuses[name] ?? 0;
        return { training, extra };
      };

      // Função para atualizar o display de bônus total
      const updateDisplay = (rowElement) => {
        const display = rowElement.querySelector('.skill-bonus-display');
        if (!display) return;
        const { training, extra } = getCurrentValues();
        const total = statMod + training + extra;
        display.textContent = total;
        console.log(`📊 [Sheet] ${name} → treino: ${training}, extra: ${extra}, total: ${total}`);
        return total;
      };

      // Valores iniciais
      const { training: currentTraining, extra: currentExtra } = getCurrentValues();
      const totalDisplay = statMod + currentTraining + currentExtra;

      const row = el("div", { class: "skill-row" });
      row.appendChild(el("span", { class: "skill-name" }, name));

      // Select de treinamento
      const trainingSelect = el("select", {
        style: "width:60px;padding:2px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--gold);font-weight:bold;font-size:12px;"
      });
      const levels = [
        { value: 0, label: "+0" },
        { value: 5, label: "+5" },
        { value: 10, label: "+10" },
        { value: 15, label: "+15" }
      ];
      levels.forEach(lv => {
        const opt = el("option", { value: lv.value }, lv.label);
        if (lv.value === currentTraining) opt.selected = true;
        trainingSelect.appendChild(opt);
      });
      trainingSelect.addEventListener("change", () => {
        const val = parseInt(trainingSelect.value) || 0;
        char.skillTrainingLevel[name] = val;
        App.saveChar();
        updateDisplay(row);
      });

      // Input de extras
      const extraInput = el("input", {
        type: "number",
        value: currentExtra,
        style: "width:50px;padding:2px;text-align:center;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--op-cyan);font-size:12px;",
        step: 1,
        placeholder: "+0"
      });
      extraInput.addEventListener("input", () => {
        const val = parseInt(extraInput.value) || 0;
        char.skillExtraBonuses[name] = val;
        App.saveChar();
        updateDisplay(row);
      });

      // Display do bônus total
      const bonusDisplay = el("span", { class: "skill-bonus-display", style: "font-size:13px;font-weight:bold;color:var(--gold);min-width:30px;text-align:center;" }, totalDisplay);

      // Botão de rolagem – lê os valores atuais na hora do clique
      const rollBtn = el("button", { class: "btn-roll" }, "🎲");
      rollBtn.addEventListener("click", () => {
        rollBtn.classList.remove("spin");
        void rollBtn.offsetWidth;
        rollBtn.classList.add("spin");
        
        const { training, extra } = getCurrentValues();
        const bonusToRoll = training + extra;
        console.log(`🎲 Rolando ${name} com bônus: ${bonusToRoll} (treino=${training}, extra=${extra})`);
        
        const advLevel = App.getAdvantageLevel();
        let entry;
        if (isDnD) {
          entry = Calc.rollSkill('dnd', name, stat, char.stats, advLevel, bonusToRoll);
        } else if (isOP) {
          entry = Calc.rollSkill('op', name, stat, char.stats, advLevel, bonusToRoll);
        } else {
          const r = Dice.rollDie(20);
          entry = Calc.makeRollResult("custom", `d20 — ${name}`, r + bonusToRoll, 20, null, null);
        }
        if (entry) {
          App.pushLog(entry);
          refreshLog();
        }
      });

      const rightPart = el("div", { style: "display:flex;align-items:center;gap:4px;" });
      rightPart.appendChild(trainingSelect);
      rightPart.appendChild(extraInput);
      rightPart.appendChild(bonusDisplay);
      rightPart.appendChild(rollBtn);

      row.appendChild(rightPart);
      grid.appendChild(row);
    });

    card.appendChild(grid);
    return card;
  }

  // ── Habilidades com edição ──
  function renderAbilitiesTab(char) {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "card-title" }, "Habilidades / Poderes"));

    const list = el("div", { style: "display:flex;flex-direction:column;gap:4px;" });

    (char.abilities || []).forEach((row, i) => {
      const [name, bonus, desc] = row;
      const isExpanded = expandedAbilities[i] || false;

      const item = el("div", { style: "background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);padding:6px 10px;" });
      const header = el("div", { style: "display:flex;justify-content:space-between;align-items:center;cursor:pointer;" });
      const left = el("div", { style: "display:flex;gap:8px;align-items:center;flex:1;" });
      const toggleBtn = el("button", { class: "btn-ghost", style: "padding:0 4px;font-size:14px;" }, isExpanded ? "▼" : "▶");
      left.appendChild(toggleBtn);
      left.appendChild(el("span", { style: "font-weight:bold;" }, name || "Sem nome"));
      if (bonus) left.appendChild(el("span", { style: "color:var(--ink-faint);font-size:12px;" }, `(${bonus})`));
      header.appendChild(left);
      const delBtn = el("button", { class: "btn-del" }, "✕");
      delBtn.addEventListener("click", () => {
        char.abilities.splice(i, 1);
        App.saveChar();
        renderTabContent(char, null, false, false);
        updateShortcuts(char);
      });
      header.appendChild(delBtn);

      header.addEventListener("click", () => {
        expandedAbilities[i] = !expandedAbilities[i];
        renderTabContent(char, null, false, false);
      });

      item.appendChild(header);

      if (isExpanded) {
        const descDiv = el("div", { style: "margin-top:6px;padding:6px;background:var(--parch-4);border-radius:var(--r);font-size:13px;color:var(--ink-dim);" });
        const textarea = el("textarea", { style: "width:100%;min-height:60px;background:transparent;border:none;color:var(--ink);resize:vertical;font-family:inherit;font-size:13px;" });
        textarea.value = desc || "";
        textarea.addEventListener("input", e => {
          char.abilities[i][2] = e.target.value;
          App.saveChar();
        });
        descDiv.appendChild(textarea);
        const editBtn = el("button", { class: "btn-ghost", style: "margin-top:6px;font-size:12px;color:var(--gold);" }, "✏️ Editar Habilidade");
        editBtn.addEventListener("click", () => {
          showEditAbilityModal(char, i);
        });
        descDiv.appendChild(editBtn);
        item.appendChild(descDiv);
      }

      list.appendChild(item);
    });

    card.appendChild(list);

    const addBtn = el("button", { class: "btn-add" }, "+ Adicionar habilidade");
    addBtn.addEventListener("click", () => {
      Dice.sounds.click();
      showAddAbilityModal(char);
    });
    card.appendChild(addBtn);

    return card;
  }

  function showAddAbilityModal(char) {
    const overlay = el("div", { class: "modal-overlay" });
    const modal = el("div", { class: "modal-box" });
    modal.appendChild(el("h3", {}, "✧ Adicionar Habilidade"));

    const fields = [
      { label: "Nome *", id: "ab-name", type: "text", placeholder: "Ex: Ataque Especial" },
      { label: "Descrição", id: "ab-desc", type: "textarea", placeholder: "Descrição da habilidade..." },
      { label: "Bônus (ex: +2, 1d6, +3 em Força)", id: "ab-bonus", type: "text", placeholder: "+2 ou 1d6 ou +3 em Força" },
    ];

    const bonusTypeG = el("div", { style: "margin-bottom:8px;" });
    bonusTypeG.appendChild(el("div", { class: "field-label" }, "Tipo de bônus"));
    const bonusTypeSelect = el("select", {
      style: "width:100%;padding:6px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);"
    });
    const bonusTypes = [
      { value: "none", label: "Nenhum" },
      { value: "atributo", label: "Atributo" },
      { value: "status", label: "Status (HP, PE, Sanidade)" },
    ];
    bonusTypes.forEach(bt => {
      const opt = el("option", { value: bt.value }, bt.label);
      bonusTypeSelect.appendChild(opt);
    });
    bonusTypeG.appendChild(bonusTypeSelect);
    modal.appendChild(bonusTypeG);

    const attrG = el("div", { style: "margin-bottom:8px;display:none;" });
    attrG.appendChild(el("div", { class: "field-label" }, "Atributo"));
    const attrSelect = el("select", {
      style: "width:100%;padding:6px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);"
    });
    const sys = char.sysId === "dnd" ? DND : OP;
    if (sys) {
      sys.statKeys.forEach(k => {
        const opt = el("option", { value: k }, sys.statLabels[k]);
        attrSelect.appendChild(opt);
      });
    }
    attrG.appendChild(attrSelect);
    modal.appendChild(attrG);

    const statusG = el("div", { style: "margin-bottom:8px;display:none;" });
    statusG.appendChild(el("div", { class: "field-label" }, "Status"));
    const statusSelect = el("select", {
      style: "width:100%;padding:6px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);"
    });
    const statusOptions = [
      { value: "hp", label: "HP" },
      { value: "pe", label: "PE" },
      { value: "san", label: "Sanidade" },
    ];
    statusOptions.forEach(so => {
      const opt = el("option", { value: so.value }, so.label);
      statusSelect.appendChild(opt);
    });
    statusG.appendChild(statusSelect);
    modal.appendChild(statusG);

    bonusTypeSelect.addEventListener("change", () => {
      const val = bonusTypeSelect.value;
      attrG.style.display = val === "atributo" ? "block" : "none";
      statusG.style.display = val === "status" ? "block" : "none";
    });

    fields.forEach(f => {
      const grp = el("div", { style: "margin-bottom:8px;" });
      grp.appendChild(el("div", { class: "field-label" }, f.label));
      const input = el("input", {
        type: f.type === "textarea" ? "text" : f.type,
        placeholder: f.placeholder || "",
        id: f.id,
        style: f.type === "textarea" ? "min-height:60px;resize:vertical;width:100%;" : "width:100%;"
      });
      if (f.type === "textarea") input.tagName = "TEXTAREA";
      grp.appendChild(input);
      modal.appendChild(grp);
    });

    const actions = el("div", { style: "display:flex;gap:8px;justify-content:flex-end;margin-top:12px;" });
    const cancelBtn = el("button", { class: "btn-ghost" }, "Cancelar");
    cancelBtn.addEventListener("click", () => { overlay.remove(); });
    const saveBtn = el("button", { class: "btn-gold" }, "Adicionar");
    saveBtn.addEventListener("click", () => {
      const name = document.getElementById("ab-name").value.trim();
      if (!name) { alert("O nome é obrigatório."); return; }
      const desc = document.getElementById("ab-desc").value.trim();
      let bonus = document.getElementById("ab-bonus").value.trim();
      const bonusType = bonusTypeSelect.value;
      if (bonusType === "atributo") {
        const attr = attrSelect.value;
        bonus = `+${bonus} em ${attr.toUpperCase()}`;
      } else if (bonusType === "status") {
        const status = statusSelect.value;
        bonus = `+${bonus} em ${status.toUpperCase()}`;
      }
      if (!char.abilities) char.abilities = [];
      char.abilities.push([name, bonus, desc]);
      App.saveChar();
      overlay.remove();
      renderTabContent(char, null, false, false);
      updateShortcuts(char);
      Dice.sounds.click();
    });
    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    modal.appendChild(actions);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function showEditAbilityModal(char, index) {
    const row = char.abilities[index];
    if (!row) return;
    const [name, bonus, desc] = row;

    const overlay = el("div", { class: "modal-overlay" });
    const modal = el("div", { class: "modal-box" });
    modal.appendChild(el("h3", {}, "✧ Editar Habilidade"));

    const fields = [
      { label: "Nome *", id: "ab-name", type: "text", value: name },
      { label: "Descrição", id: "ab-desc", type: "textarea", value: desc },
      { label: "Bônus", id: "ab-bonus", type: "text", value: bonus },
    ];

    fields.forEach(f => {
      const grp = el("div", { style: "margin-bottom:8px;" });
      grp.appendChild(el("div", { class: "field-label" }, f.label));
      const input = el("input", {
        type: f.type === "textarea" ? "text" : f.type,
        id: f.id,
        style: f.type === "textarea" ? "min-height:60px;resize:vertical;width:100%;" : "width:100%;"
      });
      if (f.value !== undefined) input.value = f.value;
      if (f.type === "textarea") input.tagName = "TEXTAREA";
      grp.appendChild(input);
      modal.appendChild(grp);
    });

    const actions = el("div", { style: "display:flex;gap:8px;justify-content:flex-end;margin-top:12px;" });
    const cancelBtn = el("button", { class: "btn-ghost" }, "Cancelar");
    cancelBtn.addEventListener("click", () => { overlay.remove(); });
    const saveBtn = el("button", { class: "btn-gold" }, "Salvar");
    saveBtn.addEventListener("click", () => {
      const newName = document.getElementById("ab-name").value.trim();
      if (!newName) { alert("O nome é obrigatório."); return; }
      const newDesc = document.getElementById("ab-desc").value.trim();
      const newBonus = document.getElementById("ab-bonus").value.trim();
      char.abilities[index] = [newName, newBonus, newDesc];
      App.saveChar();
      overlay.remove();
      renderTabContent(char, null, false, false);
      updateShortcuts(char);
      Dice.sounds.click();
    });
    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    modal.appendChild(actions);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // ── Equipamentos com edição ──
  function renderEquipTab(char) {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "card-title" }, "Equipamentos"));

    const list = el("div", { style: "display:flex;flex-direction:column;gap:4px;" });

    (char.equip || []).forEach((row, i) => {
      const [name, qty, obs] = row;
      const isExpanded = expandedItems[i] || false;

      const item = el("div", { style: "background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);padding:6px 10px;" });
      const header = el("div", { style: "display:flex;justify-content:space-between;align-items:center;cursor:pointer;" });
      const left = el("div", { style: "display:flex;gap:8px;align-items:center;flex:1;" });
      const toggleBtn = el("button", { class: "btn-ghost", style: "padding:0 4px;font-size:14px;" }, isExpanded ? "▼" : "▶");
      left.appendChild(toggleBtn);
      left.appendChild(el("span", { style: "font-weight:bold;" }, name || "Item"));
      if (qty) left.appendChild(el("span", { style: "color:var(--ink-faint);font-size:12px;" }, `x${qty}`));
      header.appendChild(left);
      const delBtn = el("button", { class: "btn-del" }, "✕");
      delBtn.addEventListener("click", () => {
        char.equip.splice(i, 1);
        App.saveChar();
        renderTabContent(char, null, false, false);
        updateShortcuts(char);
      });
      header.appendChild(delBtn);

      header.addEventListener("click", () => {
        expandedItems[i] = !expandedItems[i];
        renderTabContent(char, null, false, false);
      });

      item.appendChild(header);

      if (isExpanded) {
        const descDiv = el("div", { style: "margin-top:6px;padding:6px;background:var(--parch-4);border-radius:var(--r);font-size:13px;color:var(--ink-dim);" });
        const textarea = el("textarea", { style: "width:100%;min-height:60px;background:transparent;border:none;color:var(--ink);resize:vertical;font-family:inherit;font-size:13px;" });
        textarea.value = obs || "";
        textarea.addEventListener("input", e => {
          char.equip[i][2] = e.target.value;
          App.saveChar();
        });
        descDiv.appendChild(textarea);
        const editBtn = el("button", { class: "btn-ghost", style: "margin-top:6px;font-size:12px;color:var(--gold);" }, "✏️ Editar Item");
        editBtn.addEventListener("click", () => {
          showEditEquipmentModal(char, i);
        });
        descDiv.appendChild(editBtn);
        item.appendChild(descDiv);
      }

      list.appendChild(item);
    });

    card.appendChild(list);

    const addBtn = el("button", { class: "btn-add" }, "+ Adicionar item");
    addBtn.addEventListener("click", () => {
      Dice.sounds.click();
      showAddEquipmentModal(char);
    });
    card.appendChild(addBtn);

    return card;
  }

  function showAddEquipmentModal(char) {
    const overlay = el("div", { class: "modal-overlay" });
    const modal = el("div", { class: "modal-box" });
    modal.appendChild(el("h3", {}, "✧ Adicionar Equipamento"));

    const fields = [
      { label: "Nome *", id: "eq-name", type: "text", placeholder: "Espada Longa" },
      { label: "Quantidade", id: "eq-qty", type: "number", placeholder: "1" },
      { label: "Dano (ex: 1d8+2 ou 3d6+6d8)", id: "eq-damage", type: "text", placeholder: "1d8+2" },
      { label: "Margem de Crítico (ex: 19 ou 20)", id: "eq-crit", type: "number", placeholder: "20", value: 20 },
      { label: "Multiplicador de Crítico (ex: 2, 3, 4)", id: "eq-mult", type: "number", placeholder: "2", value: 2 },
      { label: "Descrição", id: "eq-desc", type: "textarea", placeholder: "Descrição do item" },
    ];

    const skillG = el("div", { style: "margin-bottom:8px;" });
    skillG.appendChild(el("div", { class: "field-label" }, "Perícia associada (opcional)"));
    const skillSelect = el("select", {
      style: "width:100%;padding:6px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);"
    });
    const sys = char.sysId === "dnd" ? DND : OP;
    const skills = char.customSkills || sys?.skills || [];
    const defaultOpt = el("option", { value: "" }, "Nenhuma");
    skillSelect.appendChild(defaultOpt);
    skills.forEach(s => {
      const name = typeof s === "string" ? s : s.name;
      const opt = el("option", { value: name }, name);
      skillSelect.appendChild(opt);
    });
    skillG.appendChild(skillSelect);
    modal.appendChild(skillG);

    const attrG = el("div", { style: "margin-bottom:8px;" });
    attrG.appendChild(el("div", { class: "field-label" }, "Atributo associado (opcional)"));
    const attrSelect = el("select", {
      style: "width:100%;padding:6px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);"
    });
    const defaultAttr = el("option", { value: "" }, "Nenhum");
    attrSelect.appendChild(defaultAttr);
    if (sys) {
      sys.statKeys.forEach(k => {
        const opt = el("option", { value: k }, sys.statLabels[k]);
        attrSelect.appendChild(opt);
      });
    }
    attrG.appendChild(attrSelect);
    modal.appendChild(attrG);

    fields.forEach(f => {
      const grp = el("div", { style: "margin-bottom:8px;" });
      grp.appendChild(el("div", { class: "field-label" }, f.label));
      const input = el("input", {
        type: f.type === "textarea" ? "text" : f.type,
        placeholder: f.placeholder || "",
        id: f.id,
        style: f.type === "textarea" ? "min-height:60px;resize:vertical;width:100%;" : "width:100%;"
      });
      if (f.value !== undefined) input.value = f.value;
      if (f.type === "textarea") input.tagName = "TEXTAREA";
      grp.appendChild(input);
      modal.appendChild(grp);
    });

    const actions = el("div", { style: "display:flex;gap:8px;justify-content:flex-end;margin-top:12px;" });
    const cancelBtn = el("button", { class: "btn-ghost" }, "Cancelar");
    cancelBtn.addEventListener("click", () => { overlay.remove(); });
    const saveBtn = el("button", { class: "btn-gold" }, "Adicionar");
    saveBtn.addEventListener("click", () => {
      const name = document.getElementById("eq-name").value.trim();
      if (!name) { alert("O nome é obrigatório."); return; }
      const qty = document.getElementById("eq-qty").value || "1";
      const damage = document.getElementById("eq-damage").value.trim();
      const crit = document.getElementById("eq-crit").value || "20";
      const mult = document.getElementById("eq-mult").value || "2";
      const skill = skillSelect.value;
      const stat = attrSelect.value;
      const desc = document.getElementById("eq-desc").value.trim();

      let obs = desc;
      if (damage) obs += (obs ? " | " : "") + "Dano: " + damage;
      if (crit) obs += (obs ? " | " : "") + "Critico: " + crit;
      if (mult) obs += (obs ? " | " : "") + "Multiplicador: x" + mult;
      if (skill) obs += (obs ? " | " : "") + "Perícia: " + skill;
      if (stat) obs += (obs ? " | " : "") + "Atributo: " + stat;

      if (!char.equip) char.equip = [];
      char.equip.push([name, qty, obs]);
      App.saveChar();
      overlay.remove();
      renderTabContent(char, null, false, false);
      updateShortcuts(char);
      Dice.sounds.click();
    });
    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    modal.appendChild(actions);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function showEditEquipmentModal(char, index) {
    const row = char.equip[index];
    if (!row) return;
    const [name, qty, obs] = row;

    const parseField = (label) => {
      const match = obs ? obs.match(new RegExp(label + ':\\s*([^|]+)', 'i')) : null;
      return match ? match[1].trim() : '';
    };

    const damage = parseField('Dano');
    const crit = parseField('Critico') || '20';
    const mult = parseField('Multiplicador') ? parseField('Multiplicador').replace('x', '') : '2';
    const skill = parseField('Perícia');
    const stat = parseField('Atributo');
    const desc = obs ? obs.split(' | ').filter(part => !part.match(/^(Dano|Critico|Multiplicador|Perícia|Atributo):/)).join(' | ') : '';

    const overlay = el("div", { class: "modal-overlay" });
    const modal = el("div", { class: "modal-box" });
    modal.appendChild(el("h3", {}, "✧ Editar Equipamento"));

    const fields = [
      { label: "Nome *", id: "eq-name", type: "text", value: name },
      { label: "Quantidade", id: "eq-qty", type: "number", value: qty },
      { label: "Dano", id: "eq-damage", type: "text", value: damage },
      { label: "Margem de Crítico", id: "eq-crit", type: "number", value: crit },
      { label: "Multiplicador de Crítico", id: "eq-mult", type: "number", value: mult },
      { label: "Descrição", id: "eq-desc", type: "textarea", value: desc },
    ];

    const skillG = el("div", { style: "margin-bottom:8px;" });
    skillG.appendChild(el("div", { class: "field-label" }, "Perícia associada (opcional)"));
    const skillSelect = el("select", {
      style: "width:100%;padding:6px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);"
    });
    const sys = char.sysId === "dnd" ? DND : OP;
    const skills = char.customSkills || sys?.skills || [];
    const defaultOpt = el("option", { value: "" }, "Nenhuma");
    skillSelect.appendChild(defaultOpt);
    skills.forEach(s => {
      const nameSkill = typeof s === "string" ? s : s.name;
      const opt = el("option", { value: nameSkill }, nameSkill);
      if (nameSkill === skill) opt.selected = true;
      skillSelect.appendChild(opt);
    });
    skillG.appendChild(skillSelect);
    modal.appendChild(skillG);

    const attrG = el("div", { style: "margin-bottom:8px;" });
    attrG.appendChild(el("div", { class: "field-label" }, "Atributo associado (opcional)"));
    const attrSelect = el("select", {
      style: "width:100%;padding:6px;background:var(--parch-3);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);"
    });
    const defaultAttr = el("option", { value: "" }, "Nenhum");
    attrSelect.appendChild(defaultAttr);
    if (sys) {
      sys.statKeys.forEach(k => {
        const opt = el("option", { value: k }, sys.statLabels[k]);
        if (k === stat) opt.selected = true;
        attrSelect.appendChild(opt);
      });
    }
    attrG.appendChild(attrSelect);
    modal.appendChild(attrG);

    fields.forEach(f => {
      const grp = el("div", { style: "margin-bottom:8px;" });
      grp.appendChild(el("div", { class: "field-label" }, f.label));
      const input = el("input", {
        type: f.type === "textarea" ? "text" : f.type,
        id: f.id,
        style: f.type === "textarea" ? "min-height:60px;resize:vertical;width:100%;" : "width:100%;"
      });
      if (f.value !== undefined) input.value = f.value;
      if (f.type === "textarea") input.tagName = "TEXTAREA";
      grp.appendChild(input);
      modal.appendChild(grp);
    });

    const actions = el("div", { style: "display:flex;gap:8px;justify-content:flex-end;margin-top:12px;" });
    const cancelBtn = el("button", { class: "btn-ghost" }, "Cancelar");
    cancelBtn.addEventListener("click", () => { overlay.remove(); });
    const saveBtn = el("button", { class: "btn-gold" }, "Salvar");
    saveBtn.addEventListener("click", () => {
      const newName = document.getElementById("eq-name").value.trim();
      if (!newName) { alert("O nome é obrigatório."); return; }
      const newQty = document.getElementById("eq-qty").value || "1";
      const newDamage = document.getElementById("eq-damage").value.trim();
      const newCrit = document.getElementById("eq-crit").value || "20";
      const newMult = document.getElementById("eq-mult").value || "2";
      const newSkill = skillSelect.value;
      const newStat = attrSelect.value;
      const newDesc = document.getElementById("eq-desc").value.trim();

      let newObs = newDesc;
      if (newDamage) newObs += (newObs ? " | " : "") + "Dano: " + newDamage;
      if (newCrit) newObs += (newObs ? " | " : "") + "Critico: " + newCrit;
      if (newMult) newObs += (newObs ? " | " : "") + "Multiplicador: x" + newMult;
      if (newSkill) newObs += (newObs ? " | " : "") + "Perícia: " + newSkill;
      if (newStat) newObs += (newObs ? " | " : "") + "Atributo: " + newStat;

      char.equip[index] = [newName, newQty, newObs];
      App.saveChar();
      overlay.remove();
      renderTabContent(char, null, false, false);
      updateShortcuts(char);
      Dice.sounds.click();
    });
    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    modal.appendChild(actions);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function renderNotesTab(char) {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "card-title" }, "Anotações"));

    const ta = el("textarea", { style: "min-height:260px;resize:vertical;line-height:1.6", placeholder: "História, objetivos, contatos, segredos, notas de sessão..." });
    ta.value = char.notes || "";
    ta.addEventListener("input", e => { char.notes = e.target.value; App.saveChar(); });
    card.appendChild(ta);
    return card;
  }

  function updateShortcuts(char) {
    const section = document.querySelector('.card .dice-shortcuts');
    if (section) {
      const parent = section.closest('.card');
      if (parent && parent._renderShortcuts) {
        parent._renderShortcuts();
      }
    }
  }

  function refreshLog() {
    const box = document.getElementById("roll-log");
    if (box) renderLogInto(box);
  }

  function renderLogInto(box) {
    box.innerHTML = "";
    const log = App.getLog();
    if (log.length === 0) {
      box.appendChild(el("p", { class: "log-empty" }, "Os dados aguardam em silêncio..."));
      return;
    }
    log.forEach(e => {
      const row = el("div", { class: "log-entry" });
      row.appendChild(el("span", { class: "log-label" }, e.label));
      row.appendChild(el("span", { class: `log-result log-${e.cls}` }, e.display));
      box.appendChild(row);
    });
  }

  function refreshOPDerived(char) {
    char.recalcDerived();
    App.saveChar();
    UI.updateBar("hp", char.hpCur, char.hpMax, "var(--green)");
    UI.updateBar("pe", char.peCur, char.peMax, "var(--op-cyan)");
    UI.updateBar("san", char.sanCur, char.sanMax, "var(--purple)");
    updateDefense(char, false, true);
    updateStatusInputs(char, false, true);
  }

  return { render, switchTab };
})();