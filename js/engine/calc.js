/* js/engine/calc.js — Cálculos automáticos D&D 5e e OP */

const Calc = (() => {

  const dnd = {
    mod: (val) => Math.floor((val - 10) / 2),
    modStr: (val) => { const m = Math.floor((val-10)/2); return (m>=0?"+":"")+m; },
    profBonus: (level) => {
      const profArr = [0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];
      return profArr[Math.min(level, 20)] || 2;
    },
    hp: (cls, conScore, level = 1) => {
      const hd = cls?.hd || 8;
      const conMod = Math.floor((conScore - 10) / 2);
      return hd + conMod + (level - 1) * (Math.floor(hd/2) + 1 + conMod);
    },
    ac: (stats) => {
      const dex = Math.floor((stats.dex - 10) / 2);
      return 10 + dex;
    },
    skillBonus: (stat, proficient, expertise, level, stats) => {
      const mod = Math.floor((stats[stat] - 10) / 2);
      const prof = dnd.profBonus(level);
      if (expertise)  return mod + prof * 2;
      if (proficient) return mod + prof;
      return mod;
    },
    spellSlots: (clsId, level) => {
      const slots = {};
      for (let i = 1; i <= 9; i++) {
        const count = (typeof DND !== 'undefined' && DND.spellSlots[i]) ? DND.spellSlots[i][level] || 0 : 0;
        if (count > 0) slots[i] = count;
      }
      return slots;
    },
    initiative: (stats) => Math.floor((stats.dex - 10) / 2),
  };

  const op = {
    bonus: (val) => Math.max(0, (val || 1) - 1),
    bonusStr: (val) => { const b = Math.max(0,(val||1)-1); return b>0?"+"+b:"0"; },
    pv: (clsId, stats, nexLevel = 0) => {
      if (typeof OP !== 'undefined' && OP.calcPV) {
        return OP.calcPV(clsId, stats, nexLevel);
      }
      const bases = { combatente: 20, especialista: 16, ocultista: 12, mundano: 12 };
      const pvPorNEX = { combatente: 4, especialista: 3, ocultista: 2, mundano: 2 };
      const base = bases[clsId] || 12;
      const porNEX = pvPorNEX[clsId] || 2;
      const vig = Math.max(0, (stats.vig || 1) - 1);
      return base + vig + nexLevel * (porNEX + vig);
    },
    pe: (clsId, stats, nexLevel = 0) => {
      if (typeof OP !== 'undefined' && OP.calcPE) {
        return OP.calcPE(clsId, stats, nexLevel);
      }
      const bases = { combatente: 2, especialista: 3, ocultista: 4, mundano: 1 };
      const pePorNEX = { combatente: 2, especialista: 3, ocultista: 4, mundano: 1 };
      const base = bases[clsId] || 2;
      const porNEX = pePorNEX[clsId] || 2;
      const pre = Math.max(0, (stats.pre || 1) - 1);
      return base + pre + nexLevel * (porNEX + pre);
    },
    sanidade: (clsId, nexLevel = 0) => {
      if (typeof OP !== 'undefined' && OP.calcSanidade) {
        return OP.calcSanidade(clsId, nexLevel);
      }
      const bases = { combatente: 12, especialista: 16, ocultista: 20, mundano: 8 };
      const sanPorNEX = { combatente: 3, especialista: 4, ocultista: 5, mundano: 2 };
      const base = bases[clsId] || 12;
      const porNEX = sanPorNEX[clsId] || 3;
      return base + nexLevel * porNEX;
    },
    defesa: (stats) => {
      if (typeof OP !== 'undefined' && OP.calcDefesa) return OP.calcDefesa(stats);
      return 10 + Math.max(0, (stats.agi || 1) - 1);
    },
  };

  function makeRollResult(sysId, label, result, max, note, success) {
    const isCrit = result === max && note === null;
    const isFail = result === 1   && note === null;
    let cls = "norm";
    if (note !== null) {
      cls = success === false ? "fail" : success === true ? "crit" : "norm";
    } else {
      cls = isCrit ? "crit" : isFail ? "fail" : "norm";
    }
    const display = note || (result + (isCrit?" — Crítico!":isFail?" — Falha!":""));
    if (typeof Dice !== 'undefined' && Dice.sounds) {
      if (cls === "crit") Dice.sounds.crit();
      else if (cls === "fail") Dice.sounds.fail();
      else Dice.sounds.dice();
    }
    return { label, display, cls, id: Date.now() + Math.random(), result, max };
  }

  function rollStat(sysId, label, key, stats, advantageLevel = 0, bonus = 0) {
    if (typeof Dice === 'undefined' || !Dice.rollWithAdvantageLevel) {
      const r = Math.floor(Math.random() * 20) + 1;
      const total = r + bonus;
      return makeRollResult(sysId, `d20 — ${label}`, total, 20, null, null);
    }
    if (sysId === "dnd") {
      const val = stats[key] || 10;
      const mod = dnd.mod(val);
      const rollResult = Dice.rollWithAdvantageLevel(20, advantageLevel, 1);
      const total = rollResult.result + mod + bonus;
      const display = advantageLevel === 0
        ? `${rollResult.result} ${mod>=0?"+":""}${mod} ${bonus>=0?"+":""}${bonus} = ${total}`
        : `[${rollResult.rolls.join(", ")}] → ${rollResult.result} ${mod>=0?"+":""}${mod} ${bonus>=0?"+":""}${bonus} = ${total}`;
      return makeRollResult(sysId, `d20${advantageLevel!==0?` (${rollResult.mode})`:""} — ${label}`, total, 20, display, null);
    } else if (sysId === "op") {
      const qtd = Math.max(1, stats[key] || 1);
      const rollResult = Dice.rollWithAdvantageLevel(20, advantageLevel, qtd);
      const critical = rollResult.rolls.includes(20);
      const disaster = rollResult.rolls.every(v => v === 1);
      const resultWithBonus = rollResult.result + bonus;
      const note = `Dados: [${rollResult.rolls.join(", ")}]  →  Resultado: ${rollResult.result} ${bonus>=0?"+":""}${bonus} = ${resultWithBonus}`;
      const cls = critical ? "crit" : disaster ? "fail" : "norm";
      if (typeof Dice !== 'undefined' && Dice.sounds) {
        if (cls === "crit") Dice.sounds.crit();
        else if (cls === "fail") Dice.sounds.fail();
        else Dice.sounds.dice();
      }
      return {
        label: `d20×${rollResult.rolls.length}${advantageLevel!==0?` (${rollResult.mode})`:""} — ${label}`,
        display: note,
        cls,
        id: Date.now() + Math.random(),
        result: resultWithBonus,
        max: 20,
      };
    }
    return null;
  }

  function rollSkill(sysId, skillName, statKey, stats, advantageLevel = 0, trainingBonus = 0) {
    return rollStat(sysId, skillName, statKey, stats, advantageLevel, trainingBonus);
  }

  // Suporte para expressões compostas (ex: "3d6+6d8+2")
  function rollCustomDice(dStr, mod, label) {
    const compoundResult = Dice.rollCompoundExpression(dStr);
    if (compoundResult) {
      const total = compoundResult.total + (parseInt(mod) || 0);
      let maxSide = 20;
      const sidesMatches = dStr.match(/d(\d+)/g);
      if (sidesMatches) {
        sidesMatches.forEach(m => {
          const side = parseInt(m.replace('d', ''));
          if (side > maxSide) maxSide = side;
        });
      }
      const display = `${compoundResult.expression}${mod > 0 ? ` + ${mod}` : mod < 0 ? ` - ${Math.abs(mod)}` : ''} = ${total}`;
      return makeRollResult("custom", label || dStr, total, maxSide || 20, display, null);
    }
    // Fallback: tenta como um único dado
    const sides = parseInt(dStr.replace("d", ""));
    if (isNaN(sides)) return null;
    const m = parseInt(mod) || 0;
    const result = Dice.rollDie(sides);
    const total = result + m;
    return makeRollResult("custom", label || dStr, result, sides,
      m !== 0 ? `${result}${m>0?"+":""}${m} = ${total}` : null, null);
  }

  return { dnd, op, rollStat, rollSkill, rollCustomDice, makeRollResult };
})();