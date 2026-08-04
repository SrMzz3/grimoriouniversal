/* js/data/spells.js – TEMPLATE para preencher com dados das PDFs */

export const SPELLS = [
  // ==================== NÍVEL 0 (Truques) ====================
  {
    id: "acid_splash",
    name: "Respingo de Ácido",
    level: 0,
    school: "Evocação",
    castingTime: "1 ação",
    range: "18m",
    components: "V, S",
    duration: "Instantâneo",
    description: "TODO: Descrever efeito do truque, dano, alvos múltiplos conforme nível",
    classes: ["Feiticeiro", "Mago"],
    damage: "1d6",
    savingThrow: null
  },
  {
    id: "blade_ward",
    name: "Guarda de Lâmina",
    level: 0,
    school: "Abjuração",
    castingTime: "1 ação",
    range: "Pessoal",
    components: "V, S",
    duration: "1 rodada",
    description: "TODO: Descrever redução de dano e efeitos de proteção",
    classes: ["Bardo", "Feiticeiro", "Mago"],
    damage: null,
    savingThrow: null
  },
  {
    id: "chill_touch",
    name: "Toque Gélido",
    level: 0,
    school: "Necromancia",
    castingTime: "1 ação",
    range: "9m",
    components: "V, S",
    duration: "1 rodada",
    description: "TODO: Descrever dano necromântico, efeito contra não-mortos, penalidades",
    classes: ["Feiticeiro", "Mago"],
    damage: "1d8",
    savingThrow: null
  },
  // TODO: Adicionar mais truques (Light, Mage Hand, Mending, Message, Minor Illusion, Prestidigitation, Shocking Grasp, True Strike, etc.)

  // ==================== NÍVEL 1 ====================
  {
    id: "burning_hands",
    name: "Mãos em Chamas",
    level: 1,
    school: "Evocação",
    castingTime: "1 ação",
    range: "Pessoal (cone de 4,5m)",
    components: "V, S",
    duration: "Instantâneo",
    spellSlots: 1,
    description: "TODO: Descrever formato do cone, dano base (3d6), salvação, escalagem por slot",
    classes: ["Feiticeiro", "Mago"],
    damage: "3d6",
    savingThrow: "DEX - metade do dano"
  },
  {
    id: "magic_missile",
    name: "Míssil Mágico",
    level: 1,
    school: "Evocação",
    castingTime: "1 ação",
    range: "36m",
    components: "V, S",
    duration: "Instantâneo",
    spellSlots: 1,
    description: "TODO: Descrever número de mísseis (3, aumentando por slot), dano por míssil (1d4+1)",
    classes: ["Feiticeiro", "Mago"],
    damage: "1d4+1",
    savingThrow: null
  },
  {
    id: "cure_wounds",
    name: "Curar Ferimentos",
    level: 1,
    school: "Evocação",
    castingTime: "1 ação",
    range: "Toque",
    components: "V, S",
    duration: "Instantâneo",
    spellSlots: 1,
    description: "TODO: Descrever cura (1d8 + modificador de magia, aumentando por slot)",
    classes: ["Bardo", "Clérigo", "Druida", "Paladino"],
    damage: null,
    savingThrow: null
  },
  {
    id: "shield",
    name: "Escudo",
    level: 1,
    school: "Abjuração",
    castingTime: "1 reação",
    range: "Pessoal",
    components: "V, S",
    duration: "1 rodada",
    spellSlots: 1,
    description: "TODO: Descrever bônus de +5 à CA, como reação a ataque, duração até fim do turno",
    classes: ["Feiticeiro", "Mago"],
    damage: null,
    savingThrow: null
  },
  {
    id: "sleep",
    name: "Sono",
    level: 1,
    school: "Encantamento",
    castingTime: "1 ação",
    range: "27m",
    components: "V, S, M (pó de pólvora)",
    duration: "1 minuto",
    spellSlots: 1,
    description: "TODO: Descrever sistema de pontos de PV para determinar alvos adormecidos, escalagem",
    classes: ["Bardo", "Feiticeiro", "Mago"],
    damage: null,
    savingThrow: "Sabedoria"
  },
  // TODO: Adicionar mais magias de 1º nível (Charm Person, Disguise Self, Fog Cloud, etc.)

  // ==================== NÍVEL 2 ====================
  {
    id: "fireball",
    name: "Bola de Fogo",
    level: 2,
    school: "Evocação",
    castingTime: "1 ação",
    range: "45m",
    components: "V, S, M (bolinha de enxofre)",
    duration: "Instantâneo",
    spellSlots: 2,
    description: "TODO: Descrever esfera de 7m raio, dano (8d6 base), salvação DEX metade, escalagem por nível do slot",
    classes: ["Feiticeiro", "Mago"],
    damage: "8d6",
    savingThrow: "DEX - metade do dano"
  },
  {
    id: "invisibility",
    name: "Invisibilidade",
    level: 2,
    school: "Ilusão",
    castingTime: "1 ação",
    range: "Toque",
    components: "V, S, M (cilío de morcego)",
    duration: "Concentração, até 1 hora",
    spellSlots: 2,
    description: "TODO: Descrever invisibilidade total, fim ao atacar/lançar magia, múltiplas criaturas com escalagem",
    classes: ["Bardo", "Feiticeiro", "Mago"],
    damage: null,
    savingThrow: null
  },
  {
    id: "scorching_ray",
    name: "Raio Escaldante",
    level: 2,
    school: "Evocação",
    castingTime: "1 ação",
    range: "36m",
    components: "V, S",
    duration: "Instantâneo",
    spellSlots: 2,
    description: "TODO: Descrever 3 raios (escalando com slot), cada um é ataque de magia separado (4d6 dano)",
    classes: ["Feiticeiro", "Mago"],
    damage: "4d6",
    savingThrow: null
  },
  // TODO: Adicionar mais magias de 2º nível (Blur, Mirror Image, Misty Step, Suggestion, etc.)

  // ==================== NÍVEL 3 ====================
  {
    id: "counterspell",
    name: "Contrafeitiçaria",
    level: 3,
    school: "Abjuração",
    castingTime: "1 reação",
    range: "18m",
    components: "S",
    duration: "Instantâneo",
    spellSlots: 3,
    description: "TODO: Descrever como interrompe magia sendo lançada, testes para magias de slot superior",
    classes: ["Feiticeiro", "Mago"],
    damage: null,
    savingThrow: null
  },
  {
    id: "fireball_3rd",
    name: "Bola de Fogo (3º nível)",
    level: 3,
    school: "Evocação",
    castingTime: "1 ação",
    range: "45m",
    components: "V, S, M (bolinha de enxofre)",
    duration: "Instantâneo",
    spellSlots: 3,
    description: "TODO: Quando lançada em 3º nível de slot ou superior, dano adicional (1d6 por nível acima do 2º)",
    classes: ["Feiticeiro", "Mago"],
    damage: "8d6",
    savingThrow: "DEX - metade"
  },
  // TODO: Adicionar mais magias de 3º nível (Fireball, Lightning Bolt, Haste, Slow, Fly, etc.)

  // ==================== NÍVEL 4 ====================
  {
    id: "polymorph",
    name: "Polimorfismo",
    level: 4,
    school: "Transmutação",
    castingTime: "1 ação",
    range: "18m",
    components: "V, S, M (uma larva de um sapo)",
    duration: "Concentração, até 1 hora",
    spellSlots: 4,
    description: "TODO: Descrever transformação em criatura, limites de CR/nível, novo HP conforme alvo",
    classes: ["Bardo", "Druida", "Feiticeiro", "Mago"],
    damage: null,
    savingThrow: "Sabedoria"
  },
  // TODO: Adicionar mais magias de 4º nível (Dimension Door, Greater Invisibility, Stoneskin, etc.)

  // ==================== NÍVEL 5 ====================
  {
    id: "meteor_swarm",
    name: "Chuva de Meteoros",
    level: 5,
    school: "Evocação",
    castingTime: "1 ação",
    range: "1,5m (esfera de visão)",
    components: "V, S",
    duration: "Instantâneo",
    spellSlots: 5,
    description: "TODO: Descrever 4 esferas de 11m raio em pontos diferentes, (40d6 dano fogo total)",
    classes: ["Feiticeiro", "Mago"],
    damage: "40d6",
    savingThrow: "DEX - metade"
  },
  // TODO: Adicionar mais magias de 5º nível (Cone of Cold, Telekinesis, Wall of Stone, etc.)

  // ==================== NÍVEIS 6-9 ====================
  // TODO: Adicionar magias de 6º, 7º, 8º e 9º níveis seguindo o mesmo padrão
  // Exemplos: Power Word Stun (6º), Teleport (6º), Wish (9º), Time Stop (9º), etc.
];

export const SPELL_SCHOOLS = {
  abjuration: "Abjuração",
  conjuration: "Conjuração",
  divination: "Adivinhação",
  enchantment: "Encantamento",
  evocation: "Evocação",
  illusion: "Ilusão",
  necromancy: "Necromancia",
  transmutation: "Transmutação"
};

export function getSpellById(id) {
  return SPELLS.find(s => s.id === id);
}

export function getSpellsByLevel(level) {
  return SPELLS.filter(s => s.level === level);
}

export function getSpellsByClass(className) {
  return SPELLS.filter(s => s.classes.includes(className));
}

export function getSpellsBySchool(school) {
  return SPELLS.filter(s => s.school === school);
}

export function getSpellsByLevelAndClass(level, className) {
  return SPELLS.filter(s => s.level === level && s.classes.includes(className));
}
