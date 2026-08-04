/**
 * Personagem de Ordem Paranormal – estende Character.
 */
class OPCharacter extends Character {
  constructor(data = {}) {
    super(data);
    this.sysId = 'op';

    this.age = data.age || '';
    this.origin = data.origin || '';
    this.originId = data.originId || '';

    this.peCur = data.peCur ?? 0;
    this.peMax = data.peMax ?? 0;

    this.sanCur = data.sanCur ?? 0;
    this.sanMax = data.sanMax ?? 0;

    this.nexLevel = data.nexLevel ?? 0;
    this.nexPercent = data.nexPercent ?? 0;

    this.trilhas = data.trilhas || {
      Sobrevivência: 0,
      Habilidades: 0,
      Poderes: 0,
      Rituais: 0,
    };

    this._cachedDefesa = null;
    this._isNew = data._isNew || false;

    console.log('🏗️ [OPCharacter] Construindo com:', {
      clsId: this.clsId,
      stats: this.stats,
      nexLevel: this.nexLevel,
      hpMax: this.hpMax,
      peMax: this.peMax,
      sanMax: this.sanMax,
      _isNew: this._isNew,
    });

    // Só recalcula se for personagem NOVO ou se os valores estiverem zerados
    if (this._isNew || (this.hpMax === 0 && this.peMax === 0 && this.sanMax === 0)) {
      console.log('🔄 [OPCharacter] Personagem novo, recalculando...');
      this.recalcDerived();
    } else {
      console.log('✅ [OPCharacter] Personagem carregado, mantendo valores existentes');
      if (this.hpCur > this.hpMax) this.hpCur = this.hpMax;
      if (this.peCur > this.peMax) this.peCur = this.peMax;
      if (this.sanCur > this.sanMax) this.sanCur = this.sanMax;
    }
  }

  getBonus(statKey) {
    const val = this.stats[statKey] ?? 1;
    return Math.max(0, val - 1);
  }

  getBonusStr(statKey) {
    const b = this.getBonus(statKey);
    return b > 0 ? `+${b}` : '0';
  }

  getDefesa() {
    if (this._cachedDefesa !== null) return this._cachedDefesa;
    this._cachedDefesa = 10 + this.getBonus('agi');
    return this._cachedDefesa;
  }

  _getClassData() {
    if (typeof OP === 'undefined') {
      console.warn('⚠️ [OPCharacter] OP não está definido!');
      return null;
    }
    const clsId = this.clsId || 'especialista';
    const cls = OP.classes.find(c => c.id === clsId);
    if (!cls) {
      console.warn(`⚠️ [OPCharacter] Classe "${clsId}" não encontrada! OP.classes =`, OP.classes);
    } else {
      console.log(`✅ [OPCharacter] Classe encontrada: ${cls.name}`);
    }
    return cls;
  }

  getMaxPV() {
    const cls = this._getClassData();
    if (!cls) {
      console.warn('⚠️ [OPCharacter] Usando fallback PV = 12');
      return 12;
    }
    const vig = this.getBonus('vig');
    const result = cls.pvBase + vig + this.nexLevel * (cls.pvPorNEX + vig);
    console.log(`📊 [OPCharacter] getMaxPV: ${cls.name} → ${result}`);
    return result;
  }

  getMaxPE() {
    const cls = this._getClassData();
    if (!cls) {
      console.warn('⚠️ [OPCharacter] Usando fallback PE = 3');
      return 3;
    }
    const pre = this.getBonus('pre');
    const result = cls.peBase + pre + this.nexLevel * (cls.pePorNEX + pre);
    console.log(`📊 [OPCharacter] getMaxPE: ${cls.name} → ${result}`);
    return result;
  }

  getMaxSanidade() {
    const cls = this._getClassData();
    if (!cls) {
      console.warn('⚠️ [OPCharacter] Usando fallback SAN = 12');
      return 12;
    }
    const result = cls.sanBase + this.nexLevel * cls.sanPorNEX;
    console.log(`📊 [OPCharacter] getMaxSanidade: ${cls.name} → ${result}`);
    return result;
  }

  getNEXLabel() {
    if (typeof OP !== 'undefined' && OP.nexLabel) {
      return OP.nexLabel(this.nexLevel);
    }
    const labels = ['0%','5%','10%','15%','20%','25%','30%','35%','40%','45%','50%',
                    '55%','60%','65%','70%','75%','80%','85%','90%','95%','99%'];
    return labels[this.nexLevel] || '0%';
  }

  advanceNEX() {
    if (this.nexLevel < 20) {
      this.nexLevel++;
      this.nexPercent = this._getNEXValue(this.nexLevel);
      this.recalcDerived();
      this._touch();
      return true;
    }
    return false;
  }

  _getNEXValue(level) {
    const values = [];
    for (let v = 0; v <= 95; v += 5) values.push(v);
    values.push(99);
    return values[level] || 0;
  }

  setTrilhaLevel(name, level) {
    if (this.trilhas.hasOwnProperty(name)) {
      this.trilhas[name] = Math.max(0, Math.min(3, level));
      this._touch();
    }
  }

  advanceTrilha(name) {
    if (this.trilhas.hasOwnProperty(name) && this.trilhas[name] < 3) {
      this.trilhas[name]++;
      this._touch();
      return true;
    }
    return false;
  }

  recalcDerived() {
    console.log('🔄 [OPCharacter] recalcDerived iniciado...');
    this.hpMax = this.getMaxPV();
    this.peMax = this.getMaxPE();
    this.sanMax = this.getMaxSanidade();
    if (this.hpCur > this.hpMax) this.hpCur = this.hpMax;
    if (this.peCur > this.peMax) this.peCur = this.peMax;
    if (this.sanCur > this.sanMax) this.sanCur = this.sanMax;
    this._cachedDefesa = null;
    this._touch();
    console.log(`🔄 [OPCharacter] recalcDerived final: HP=${this.hpMax}, PE=${this.peMax}, SAN=${this.sanMax}`);
  }

  setStat(key, value) {
    console.log(`✏️ [OPCharacter] setStat(${key}, ${value})`);
    super.setStat(key, value);
    this.recalcDerived();
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      age: this.age,
      origin: this.origin,
      originId: this.originId,
      peCur: this.peCur,
      peMax: this.peMax,
      sanCur: this.sanCur,
      sanMax: this.sanMax,
      nexLevel: this.nexLevel,
      nexPercent: this.nexPercent,
      trilhas: { ...this.trilhas },
    };
  }

  static fromJSON(data) {
    return new OPCharacter(data);
  }
}

if (typeof window !== 'undefined') {
  window.OPCharacter = OPCharacter;
}