/**
 * Classe base para todos os personagens do Grimório Universal.
 * Contém campos e métodos comuns a D&D, Ordem Paranormal e Custom.
 */
class Character {
  /**
   * @param {Object} data - Dados iniciais do personagem
   */
  constructor(data = {}) {
    // Identificação
    this.id = data.id || crypto.randomUUID();
    this.sysId = data.sysId || 'custom'; // 'dnd' | 'op' | 'custom'
    this.name = data.name || 'Sem nome';

    // Atributos (stats) – genérico, cada sistema define as chaves
    this.stats = data.stats || {};

    // Status básicos
    this.hpCur = data.hpCur ?? 0;
    this.hpMax = data.hpMax ?? 0;

    // Listas editáveis
    this.abilities = data.abilities || []; // [nome, bonus/custo, descricao]
    this.equip = data.equip || [];          // [item, qtd, obs]
    this.notes = data.notes || '';

    // ============================================================
    // 🔥 NOVOS CAMPOS PARA PERÍCIAS – salvos e carregados
    // ============================================================
    // Grau de treinamento por perícia (valores: 0, 5, 10, 15)
    this.skillTrainingLevel = data.skillTrainingLevel || {};
    // Bônus extras por perícia (editáveis pelo jogador)
    this.skillExtraBonuses = data.skillExtraBonuses || {};

    // Metadados
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // ──────────────────────────────────────────────────────────────
  //  MÉTODOS PÚBLICOS (comuns a todos os sistemas)
  // ──────────────────────────────────────────────────────────────

  /** Retorna o valor de um atributo, ou 0 se não existir */
  getStat(key) {
    return this.stats[key] ?? 0;
  }

  /** Atualiza um atributo e registra a mudança */
  setStat(key, value) {
    this.stats[key] = value;
    this._touch();
  }

  /** Aplica dano (não deixa HP negativo) */
  takeDamage(amount) {
    const dmg = Math.max(0, amount);
    this.hpCur = Math.max(0, this.hpCur - dmg);
    this._touch();
    return this.hpCur;
  }

  /** Cura (não ultrapassa HP máximo) */
  heal(amount) {
    const healAmount = Math.max(0, amount);
    this.hpCur = Math.min(this.hpMax, this.hpCur + healAmount);
    this._touch();
    return this.hpCur;
  }

  /** Define HP máximo e ajusta o atual se necessário */
  setMaxHP(value) {
    this.hpMax = Math.max(0, value);
    if (this.hpCur > this.hpMax) this.hpCur = this.hpMax;
    this._touch();
  }

  /** Verifica se o personagem está vivo (HP > 0) */
  isAlive() {
    return this.hpCur > 0;
  }

  /** Retorna a porcentagem de HP (0–100) */
  hpPercent() {
    if (this.hpMax <= 0) return 0;
    return Math.round((this.hpCur / this.hpMax) * 100);
  }

  /** Adiciona uma habilidade/poder */
  addAbility(name, bonus = '', desc = '') {
    this.abilities.push([name, bonus, desc]);
    this._touch();
  }

  /** Remove uma habilidade pelo índice */
  removeAbility(index) {
    if (index >= 0 && index < this.abilities.length) {
      this.abilities.splice(index, 1);
      this._touch();
    }
  }

  /** Adiciona um item ao inventário */
  addItem(name, qty = 1, obs = '') {
    this.equip.push([name, String(qty), obs]);
    this._touch();
  }

  /** Remove um item pelo índice */
  removeItem(index) {
    if (index >= 0 && index < this.equip.length) {
      this.equip.splice(index, 1);
      this._touch();
    }
  }

  /** Retorna um objeto simples para serialização (JSON) */
  toJSON() {
    return {
      id: this.id,
      sysId: this.sysId,
      name: this.name,
      stats: { ...this.stats },
      hpCur: this.hpCur,
      hpMax: this.hpMax,
      abilities: this.abilities.map(a => [...a]),
      equip: this.equip.map(e => [...e]),
      notes: this.notes,
      // 🔥 Inclui os novos campos
      skillTrainingLevel: { ...this.skillTrainingLevel },
      skillExtraBonuses: { ...this.skillExtraBonuses },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /** Cria uma instância a partir de um objeto JSON (factory) */
  static fromJSON(data) {
    return new Character(data);
  }

  // ──────────────────────────────────────────────────────────────
  //  MÉTODOS PRIVADOS (internos)
  // ──────────────────────────────────────────────────────────────

  /** Atualiza o timestamp de modificação */
  _touch() {
    this.updatedAt = new Date().toISOString();
  }
}

// Exporta para uso global (no navegador)
if (typeof window !== 'undefined') {
  window.Character = Character;
}