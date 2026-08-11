/**
 * Fábrica de personagens – cria a instância correta com base no sysId.
 */
class CharacterFactory {
  /**
   * Cria uma instância de Character (ou subclasse) a partir de dados brutos.
   * @param {Object} data - Dados do personagem (pode vir do localStorage)
   * @returns {Character}
   */
  static create(data) {
    const sysId = data.sysId || 'custom';

    switch (sysId) {
      case 'dnd':
        return new DnDCharacter(data);
      case 'op':
        return new OPCharacter(data);
      case 'custom':
      default:
        return new CustomCharacter(data);
    }
  }

  /**
   * Cria um personagem vazio para um sistema específico.
   */
  static createEmpty(sysId) {
    const base = {
      id: crypto.randomUUID(),
      sysId: sysId,
      name: '',
      stats: {},
      hpCur: 0,
      hpMax: 0,
    };

    if (sysId === 'dnd') {
      return new DnDCharacter({
        ...base,
        level: 1,
        cls: '',
        race: '',
        slots: {},
        skillProfs: {},
      });
    }

    if (sysId === 'op') {
      return new OPCharacter({
        ...base,
        age: '',
        origin: '',
        peCur: 0,
        peMax: 0,
        sanCur: 0,
        sanMax: 0,
        nexLevel: 0,
        trilhas: { Sobrevivência: 0, Habilidades: 0, Poderes: 0, Rituais: 0 },
      });
    }

    // Custom
    return new CustomCharacter({
      ...base,
      customSysName: 'Sistema Próprio',
      customStatKeys: [],
      customStatLabels: {},
      customSkills: [],
      customDiceSet: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'],
      customTheme: 'arcano',
      customResources: [],
    });
  }
}

if (typeof window !== 'undefined') {
  window.CharacterFactory = CharacterFactory;
}