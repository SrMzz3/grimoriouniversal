/**
 * Personagem de D&D 5e – estende Character com campos e métodos específicos.
 */
class DnDCharacter extends Character {
  constructor(data = {}) {
    super(data);
    this.sysId = 'dnd';

    // Específicos D&D
    this.level = data.level ?? 1;
    this.cls = data.cls || '';          // Nome da classe (ex: "Guerreiro")
    this.clsId = data.clsId || '';      // ID da classe (ex: "fighter")
    this.race = data.race || '';
    this.raceId = data.raceId || '';
    this.subrace = data.subrace || null;
    this.subraceId = data.subraceId || null;
    this.subclass = data.subclass || null;
    this.subclassId = data.subclassId || null;

    // Slots de magia: { "1": [0,0,0, ...], "2": [0,0], ... }
    this.slots = data.slots || {};

    // Perícias com proficiência: { "Atletismo": true, "Furtividade": false, ... }
    this.skillProfs = data.skillProfs || {};

    // Expertise (proficiência dobrada)
    this.skillExpertise = data.skillExpertise || {};
  }

  // ──────────────────────────────────────────────────────────────
  //  MÉTODOS D&D
  // ──────────────────────────────────────────────────────────────

  /** Bônus de proficiência com base no nível */
  getProficiencyBonus() {
    const profArr = [0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];
    return profArr[Math.min(this.level, 20)] || 2;
  }

  /** Modificador de um atributo (Força, Destreza, etc.) */
  getMod(statKey) {
    const val = this.stats[statKey] ?? 10;
    return Math.floor((val - 10) / 2);
  }

  /** Modificador formatado (+2, -1, etc.) */
  getModStr(statKey) {
    const m = this.getMod(statKey);
    return m >= 0 ? `+${m}` : `${m}`;
  }

  /** Cálculo da CA (sem armadura) */
  getAC() {
    return 10 + this.getMod('dex');
  }

  /** Iniciativa (modificador de Destreza) */
  getInitiative() {
    return this.getMod('dex');
  }

  /** Bônus de uma perícia (considera proficiência e expertise) */
  getSkillBonus(skillName) {
    const statKey = this._getSkillStat(skillName);
    if (!statKey) return this.getMod('dex'); // fallback

    let bonus = this.getMod(statKey);
    const prof = this.skillProfs[skillName] || false;
    const expert = this.skillExpertise[skillName] || false;

    if (prof) {
      const pb = this.getProficiencyBonus();
      bonus += expert ? pb * 2 : pb;
    }
    return bonus;
  }

  /** Retorna o atributo associado a uma perícia (consulta DND.skills) */
  _getSkillStat(skillName) {
    if (typeof DND !== 'undefined' && DND.skills) {
      const found = DND.skills.find(s => s.name === skillName);
      if (found) return found.stat;
    }
    return null;
  }

  /** Número total de slots para um nível (baseado no nível do personagem) */
  _getTotalSlots(level) {
    if (typeof DND === 'undefined' || !DND.spellSlots) return 0;
    const slotsByLevel = DND.spellSlots[level] || [];
    return slotsByLevel[this.level] || 0;
  }

  /** Verifica se um slot de magia de determinado nível está disponível */
  hasSlot(level) {
    const total = this._getTotalSlots(level);
    const used = (this.slots[level] || []).filter(v => v === 1).length;
    return used < total;
  }

  /** Usa um slot de magia (marca como usado) */
  useSlot(level) {
    if (!this.hasSlot(level)) return false;
    const slots = this.slots[level] || [];
    for (let i = 0; i < slots.length; i++) {
      if (slots[i] === 0) {
        slots[i] = 1;
        this.slots[level] = slots;
        this._touch();
        return true;
      }
    }
    return false;
  }

  /** Restaura todos os slots de um nível */
  restoreSlots(level) {
    const total = this._getTotalSlots(level);
    this.slots[level] = Array(total).fill(0);
    this._touch();
  }

  /** Serialização específica D&D */
  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      level: this.level,
      cls: this.cls,
      clsId: this.clsId,
      race: this.race,
      raceId: this.raceId,
      subrace: this.subrace,
      subraceId: this.subraceId,
      subclass: this.subclass,
      subclassId: this.subclassId,
      slots: { ...this.slots },
      skillProfs: { ...this.skillProfs },
      skillExpertise: { ...this.skillExpertise },
    };
  }

  static fromJSON(data) {
    return new DnDCharacter(data);
  }
}

if (typeof window !== 'undefined') {
  window.DnDCharacter = DnDCharacter;
}