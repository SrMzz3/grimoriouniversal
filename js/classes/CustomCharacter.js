/**
 * Personagem de Sistema Próprio – estende Character.
 */
class CustomCharacter extends Character {
  constructor(data = {}) {
    super(data);
    this.sysId = 'custom';

    // Nome do sistema
    this.customSysName = data.customSysName || 'Sistema Próprio';

    // Lista de chaves dos atributos (para ordenação)
    this.customStatKeys = data.customStatKeys || [];

    // Mapa label -> chave (ex: { "Força": "str", "Mana": "mana" })
    this.customStatLabels = data.customStatLabels || {};

    // Lista de nomes das perícias
    this.customSkills = data.customSkills || [];

    // Dados disponíveis (ex: ["d4","d6","d8","d10","d12","d20"])
    this.customDiceSet = data.customDiceSet || ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

    // Tema visual (arcano, tecnologico, sombrio, minimalista)
    this.customTheme = data.customTheme || 'arcano';

    // Recursos personalizados (ex: [{ name: "Mana", max: 10, cur: 10 }])
    this.customResources = data.customResources || [];
  }

  // ──────────────────────────────────────────────────────────────
  //  MÉTODOS CUSTOM
  // ──────────────────────────────────────────────────────────────

  /** Retorna o valor de um recurso pelo nome */
  getResource(name) {
    const res = this.customResources.find(r => r.name === name);
    return res ? res.cur : 0;
  }

  /** Define o valor atual de um recurso */
  setResource(name, value) {
    const res = this.customResources.find(r => r.name === name);
    if (res) {
      res.cur = Math.max(0, Math.min(res.max, value));
      this._touch();
    }
  }

  /** Adiciona um recurso customizado */
  addResource(name, max = 10, cur = max) {
    this.customResources.push({ name, max, cur });
    this._touch();
  }

  /** Remove um recurso pelo nome */
  removeResource(name) {
    this.customResources = this.customResources.filter(r => r.name !== name);
    this._touch();
  }

  /** Retorna os nomes dos atributos na ordem definida */
  getStatNames() {
    return this.customStatKeys.map(key => this.customStatLabels[key] || key);
  }

  /** Verifica se um dado está disponível */
  hasDice(diceStr) {
    return this.customDiceSet.includes(diceStr);
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      customSysName: this.customSysName,
      customStatKeys: [...this.customStatKeys],
      customStatLabels: { ...this.customStatLabels },
      customSkills: [...this.customSkills],
      customDiceSet: [...this.customDiceSet],
      customTheme: this.customTheme,
      customResources: this.customResources.map(r => ({ ...r })),
    };
  }

  static fromJSON(data) {
    return new CustomCharacter(data);
  }
}

if (typeof window !== 'undefined') {
  window.CustomCharacter = CustomCharacter;
}