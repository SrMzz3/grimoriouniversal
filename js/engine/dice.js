/* js/engine/dice.js — Rolagem de dados e sons */

const Dice = (() => {
  let soundEnabled = true;
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function playTone(freq, duration, type = 'sine', volume = 0.08) {
    if (!soundEnabled) return;
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ac.currentTime + duration);
      gain.gain.setValueAtTime(volume, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + duration);
    } catch(e) {}
  }

  function playNoise(duration, volume = 0.04) {
    if (!soundEnabled) return;
    try {
      const ac = getCtx();
      const bufSize = ac.sampleRate * duration;
      const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      src.buffer = buf;
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      gain.gain.setValueAtTime(volume, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      src.start();
      src.stop(ac.currentTime + duration);
    } catch(e) {}
  }

  const sounds = {
    dice: () => {
      playNoise(0.15, 0.06);
      setTimeout(() => playTone(300, 0.08, 'square', 0.05), 60);
      setTimeout(() => playTone(200, 0.12, 'square', 0.04), 130);
    },
    crit: () => {
      [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.15, 'sine', 0.07), i * 80);
      });
    },
    fail: () => {
      [400, 300, 200].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.18, 'sawtooth', 0.05), i * 90);
      });
    },
    page: () => {
      playNoise(0.2, 0.03);
      playTone(1200, 0.1, 'sine', 0.03);
    },
    magic: () => {
      [880, 1100, 1320].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.3, 'sine', 0.04), i * 60);
      });
    },
    glitch: () => {
      playNoise(0.05, 0.08);
      setTimeout(() => playTone(60, 0.1, 'sawtooth', 0.06), 20);
      setTimeout(() => playNoise(0.04, 0.05), 80);
    },
    click: () => {
      playTone(800, 0.05, 'sine', 0.04);
    },
    transition: () => {
      playTone(440, 0.15, 'sine', 0.04);
      setTimeout(() => playTone(550, 0.15, 'sine', 0.03), 100);
    },
  };

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function rollExpression(expr) {
    const match = expr.trim().match(/^(\d*)d(\d+)(?:kh(\d+))?([+-]\d+)?$/i);
    if (!match) return null;
    const num   = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const keep  = match[3] ? parseInt(match[3]) : null;
    const mod   = match[4] ? parseInt(match[4]) : 0;
    const rolls = Array.from({length: num}, () => rollDie(sides));
    let used = rolls;
    if (keep) {
      used = [...rolls].sort((a,b)=>b-a).slice(0, keep);
    }
    const total = used.reduce((a,b)=>a+b,0) + mod;
    return { rolls, used, total, mod, sides, num, expr };
  }

  function rollCompoundExpression(expr) {
    const parts = expr.trim().split(/(?=[+-])/);
    let total = 0;
    let allRolls = [];

    for (let part of parts) {
      const trimmed = part.trim();
      const result = rollExpression(trimmed);
      if (result) {
        total += result.total;
        allRolls = allRolls.concat(result.rolls);
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num)) {
          total += num;
        }
      }
    }

    return {
      expression: expr,
      total: total,
      rolls: allRolls,
      num: allRolls.length,
    };
  }

  // 🔥 CORREÇÃO: quando level = 0, escolhe o MAIOR entre todos os dados rolados
  function rollWithAdvantageLevel(sides, level, baseCount = 1) {
    const totalDice = Math.max(1, baseCount + Math.abs(level));
    const rolls = Array.from({ length: totalDice }, () => rollDie(sides));
    if (level > 0) {
      return { rolls, result: Math.max(...rolls), mode: 'advantage', level, sides };
    } else if (level < 0) {
      return { rolls, result: Math.min(...rolls), mode: 'disadvantage', level, sides };
    } else {
      // Normal: pega o maior entre todos os dados (que é o padrão do sistema)
      return { rolls, result: Math.max(...rolls), mode: 'normal', level: 0, sides };
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    return soundEnabled;
  }

  function isSoundEnabled() { return soundEnabled; }

  return {
    rollDie,
    rollExpression,
    rollCompoundExpression,
    rollWithAdvantageLevel,
    sounds,
    toggleSound,
    isSoundEnabled,
  };
})();