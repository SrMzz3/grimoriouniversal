/* js/data/dnd.js — D&D 5e Completo com todas as raças e classes */

const DND = {
  name: "D&D 5e",
  icon: "⚔️",
  color: "#c8a84b",
  desc: "Dungeons & Dragons — fantasia épica com d20",
  flavor: '"Não importa o quão escura seja a masmorra, a luz da tocha sempre encontra o caminho."',

  statKeys: ["str", "dex", "con", "int", "wis", "cha"],
  statLabels: {
    str: "Força",
    dex: "Destreza",
    con: "Constituição",
    int: "Inteligência",
    wis: "Sabedoria",
    cha: "Carisma"
  },
  diceSet: ["d4", "d6", "d8", "d10", "d12", "d20", "d100"],

  races: [
    {
      id: "human",
      name: "Humano",
      abilityBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
      traits: ["Versátil"],
      skillProficiencies: [],
      desc: "Versáteis e adaptáveis, +1 em todos os atributos.",
      subraces: []
    },
    {
      id: "elf-high",
      name: "Alto Elfo",
      abilityBonuses: { dex: 2, int: 1 },
      traits: ["Visão no escuro", "Transe", "Sentidos aguçados"],
      skillProficiencies: ["Percepção"],
      desc: "Graciosos e arcanos, +2 DES +1 INT.",
      subraces: []
    },
    {
      id: "elf-wood",
      name: "Elfo da Floresta",
      abilityBonuses: { dex: 2, wis: 1 },
      traits: ["Visão no escuro", "Andar na floresta", "Máscara das florestas"],
      skillProficiencies: ["Percepção", "Furtividade"],
      desc: "Rápidos e furtivos, +2 DES +1 SAB.",
      subraces: []
    },
    {
      id: "elf-drow",
      name: "Elfo Negro (Drow)",
      abilityBonuses: { dex: 2, cha: 1 },
      traits: ["Visão no escuro superior", "Magia drow", "Sensibilidade à luz"],
      skillProficiencies: ["Percepção"],
      desc: "Mágicos das profundezas, +2 DES +1 CAR.",
      subraces: []
    },
    {
      id: "dwarf-hill",
      name: "Anão da Colina",
      abilityBonuses: { con: 2, wis: 1 },
      traits: ["Visão no escuro", "Resiliência anã", "Resistência venenosa"],
      skillProficiencies: [],
      desc: "Sábios e resistentes, +2 CON +1 SAB.",
      subraces: []
    },
    {
      id: "dwarf-mtn",
      name: "Anão da Montanha",
      abilityBonuses: { str: 2, con: 2 },
      traits: ["Visão no escuro", "Treinamento guerreiro", "Resistência venenosa"],
      skillProficiencies: [],
      desc: "Guerreiros natos, +2 FOR +2 CON.",
      subraces: []
    },
    {
      id: "halfling-lightfoot",
      name: "Halfling Pés-Leves",
      abilityBonuses: { dex: 2, cha: 1 },
      traits: ["Sortudo", "Valente", "Agilidade halfling"],
      skillProficiencies: ["Furtividade"],
      desc: "Sortudos e furtivos, +2 DES +1 CAR.",
      subraces: []
    },
    {
      id: "halfling-stout",
      name: "Halfling Robusto",
      abilityBonuses: { dex: 2, con: 1 },
      traits: ["Sortudo", "Valente", "Resiliência robusta"],
      skillProficiencies: [],
      desc: "Corajosos e resistentes, +2 DES +1 CON.",
      subraces: []
    },
    {
      id: "tiefling",
      name: "Tiefling",
      abilityBonuses: { int: 1, cha: 2 },
      traits: ["Visão no escuro", "Resistência infernal", "Legado infernal"],
      skillProficiencies: ["Enganação"],
      desc: "Herança demoníaca, +1 INT +2 CAR.",
      subraces: []
    },
    {
      id: "dragonborn",
      name: "Draconato",
      abilityBonuses: { str: 2, cha: 1 },
      traits: ["Sopro draconiano", "Resistência draconiana"],
      skillProficiencies: ["Intimidação"],
      desc: "Sangue de dragão, +2 FOR +1 CAR.",
      subraces: []
    },
    {
      id: "gnome-rock",
      name: "Gnomo das Rochas",
      abilityBonuses: { int: 2, con: 1 },
      traits: ["Visão no escuro", "Esperteza gnômica", "Acuidade do artífice"],
      skillProficiencies: [],
      desc: "Inventivos e curiosos, +2 INT +1 CON.",
      subraces: []
    },
    {
      id: "gnome-forest",
      name: "Gnomo da Floresta",
      abilityBonuses: { int: 2, dex: 1 },
      traits: ["Visão no escuro", "Esperteza gnômica", "Ilusionista nato"],
      skillProficiencies: [],
      desc: "Mágicos da natureza, +2 INT +1 DES.",
      subraces: []
    },
    {
      id: "half-elf",
      name: "Meio-Elfo",
      abilityBonuses: { cha: 2, _choice: 2 },
      traits: ["Visão no escuro", "Sangue feérico", "Versatilidade"],
      skillProficiencies: ["Percepção"],
      desc: "O melhor dos dois mundos, +2 CAR +1 em dois atributos.",
      subraces: []
    },
    {
      id: "half-orc",
      name: "Meio-Orc",
      abilityBonuses: { str: 2, con: 1 },
      traits: ["Visão no escuro", "Ameaçador", "Resistência implacável"],
      skillProficiencies: ["Intimidação"],
      desc: "Fortes e ferozes, +2 FOR +1 CON.",
      subraces: []
    },
  ],

  classes: [
    {
      id: "barbarian",
      name: "Bárbaro",
      hd: 12,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["str", "con"],
      skillProficiencies: ["Atletismo", "Percepção"],
      skillChoices: ["Adestrar Animais", "Atletismo", "Intimidação", "Natureza", "Percepção", "Sobrevivência"],
      armorProf: ["Armaduras leves", "Armaduras médias", "Escudos"],
      desc: "Fúria selvagem e resistência sobre-humana.",
      features: ["Fúria (2/longo descanso)", "Defesa sem armadura (10+DES+CON)", "Ataque descuidado", "Sentido de perigo"],
      subclasses: [{ id: "berserker", name: "Caminho do Furioso" }, { id: "totem", name: "Caminho do Guerreiro Totêmico" }]
    },
    {
      id: "bard",
      name: "Bardo",
      hd: 8,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["dex", "cha"],
      skillProficiencies: ["Persuasão", "Enganação"],
      skillChoices: "qualquer 3",
      armorProf: ["Armaduras leves"],
      desc: "Versátil e carismático. Magia, suporte e diplomacia.",
      features: ["Inspiração bárdica (d6)", "Canções de descanso", "Expertise", "Segredos mágicos"],
      subclasses: [{ id: "lore", name: "Colégio do Conhecimento" }, { id: "valor", name: "Colégio da Bravura" }]
    },
    {
      id: "cleric",
      name: "Clérigo",
      hd: 8,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["wis", "cha"],
      skillProficiencies: ["Medicina", "Religião"],
      skillChoices: ["História", "Insight", "Intimidação", "Medicina", "Persuasão", "Religião"],
      armorProf: ["Todas as armaduras", "Escudos"],
      desc: "Curandeiro e guerreiro divino. Suporte e combate.",
      features: ["Canalizar divindade", "Domínio divino", "Destruir mortos-vivos"],
      subclasses: [{ id: "knowledge", name: "Domínio do Conhecimento" }, { id: "trickery", name: "Domínio da Enganação" }, { id: "war", name: "Domínio da Guerra" }, { id: "light", name: "Domínio da Luz" }, { id: "nature", name: "Domínio da Natureza" }, { id: "tempest", name: "Domínio da Tempestade" }, { id: "life", name: "Domínio da Vida" }]
    },
    {
      id: "druid",
      name: "Druida",
      hd: 8,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["int", "wis"],
      skillProficiencies: ["Natureza", "Sobrevivência"],
      skillChoices: ["Arcanismo", "Insight", "Medicina", "Natureza", "Percepção", "Sobrevivência"],
      armorProf: ["Armaduras leves", "Armaduras médias"],
      desc: "Conectado com a natureza. Transformação em animais.",
      features: ["Forma selvagem", "Magia druídica", "Corpo atemporal"],
      subclasses: [{ id: "land", name: "Círculo da Terra" }, { id: "moon", name: "Círculo da Lua" }]
    },
    {
      id: "fighter",
      name: "Guerreiro",
      hd: 10,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["str", "con"],
      skillProficiencies: ["Atletismo"],
      skillChoices: ["Acrobacia", "Adestrar Animais", "Atletismo", "História", "Insight", "Intimidação", "Percepção", "Sobrevivência"],
      armorProf: ["Todas as armaduras", "Escudos"],
      desc: "Mestre do combate. Múltiplos ataques e estilos.",
      features: ["Estilo de luta", "Surto de ação", "Ataque extra", "Indomável"],
      subclasses: [{ id: "champion", name: "Campeão" }, { id: "battle_master", name: "Mestre de Batalha" }, { id: "eldritch_knight", name: "Cavaleiro Arcano" }]
    },
    {
      id: "monk",
      name: "Monge",
      hd: 8,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["str", "dex"],
      skillProficiencies: ["Acrobacia", "Furtividade"],
      skillChoices: ["Acrobacia", "Atletismo", "Furtividade", "História", "Insight", "Intimidação", "Percepção", "Religião"],
      armorProf: [],
      desc: "Guerreiro equilibrado. Artes marciais e mobilidade.",
      features: ["Defesa sem armadura", "Artes marciais", "Chi", "Movimento sem armadura"],
      subclasses: [{ id: "open_hand", name: "Caminho da Mão Aberta" }, { id: "shadow", name: "Caminho da Sombra" }, { id: "four_elements", name: "Caminho dos Quatro Elementos" }]
    },
    {
      id: "paladin",
      name: "Paladino",
      hd: 10,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["wis", "cha"],
      skillProficiencies: ["Atletismo", "Medicina"],
      skillChoices: ["Atletismo", "Insight", "Intimidação", "Medicina", "Persuasão", "Religião"],
      armorProf: ["Todas as armaduras", "Escudos"],
      desc: "Campeão da justiça. Magia divina e combate.",
      features: ["Sentido divino", "Cura pelas mãos", "Juramento sagrado", "Destruição divina"],
      subclasses: [{ id: "devotion", name: "Juramento de Devoção" }, { id: "ancients", name: "Juramento dos Anciões" }, { id: "vengeance", name: "Juramento de Vingança" }]
    },
    {
      id: "ranger",
      name: "Patrulheiro",
      hd: 10,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["str", "dex"],
      skillProficiencies: ["Sobrevivência"],
      skillChoices: ["Adestrar Animais", "Atletismo", "Intuição", "Investigação", "Percepção", "Furtividade", "Sobrevivência"],
      armorProf: ["Armaduras leves", "Armaduras médias", "Escudos"],
      desc: "Rastreador e caçador. Combate e survivalência.",
      features: ["Inimigo favorito", "Explorador natural", "Estilo de luta", "Conclave"],
      subclasses: [{ id: "beast_master", name: "Conclave da Besta" }, { id: "hunter", name: "Conclave do Caçador" }, { id: "gloom_stalker", name: "Conclave do Rastreador Subterrâneo" }]
    },
    {
      id: "rogue",
      name: "Ladino",
      hd: 8,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["dex", "int"],
      skillProficiencies: ["Acrobacia", "Furtividade", "Enganação"],
      skillChoices: ["Acrobacia", "Atletismo", "Enganação", "Furtividade", "Intuição", "Investigação", "Percepção", "Performance", "Persuasão"],
      armorProf: ["Armaduras leves"],
      desc: "Ágil e furtivo. Ataque furtivo devastador.",
      features: ["Especialização", "Ataque furtivo", "Ação ardilosa", "Evasão"],
      subclasses: [{ id: "assassin", name: "Assassino" }, { id: "thief", name: "Ladrão" }, { id: "arcane_trickster", name: "Trapaceiro Arcano" }]
    },
    {
      id: "sorcerer",
      name: "Feiticeiro",
      hd: 6,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["con", "cha"],
      skillProficiencies: ["Enganação"],
      skillChoices: ["Arcanismo", "Enganação", "Intimidação", "Investigação", "Percepção", "Performance", "Persuasão"],
      armorProf: [],
      desc: "Magia inata pura. Poder bruto e metamágica.",
      features: ["Conjuração", "Origem de feitiçaria", "Pontos de feitiçaria", "Metamágica"],
      subclasses: [{ id: "draconic", name: "Linhagem Dracônica" }, { id: "wild_magic", name: "Magia Selvagem" }]
    },
    {
      id: "warlock",
      name: "Bruxo",
      hd: 8,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["wis", "cha"],
      skillProficiencies: ["Intimidação"],
      skillChoices: ["Arcanismo", "Enganação", "História", "Intimidação", "Investigação", "Natureza", "Religião"],
      armorProf: ["Armaduras leves"],
      desc: "Pacto sobrenatural. Invocações e poder do patrono.",
      features: ["Patrono transcendental", "Magia de pacto", "Invocações místicas", "Dádiva do pacto"],
      subclasses: [{ id: "archfey", name: "A Arquifada" }, { id: "fiend", name: "O Corruptor" }, { id: "great_old_one", name: "O Grande Antigo" }]
    },
    {
      id: "wizard",
      name: "Mago",
      hd: 6,
      base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saves: ["int", "wis"],
      skillProficiencies: ["Arcanismo", "Investigação"],
      skillChoices: ["Arcanismo", "História", "Intuição", "Investigação", "Medicina", "Religião"],
      armorProf: [],
      desc: "Erudito da magia. Grimório e versatilidade.",
      features: ["Conjuração", "Recuperação arcana", "Grimório", "Tradição arcana"],
      subclasses: [{ id: "abjuration", name: "Escola de Abjuração" }, { id: "conjuration", name: "Escola de Conjuração" }, { id: "divination", name: "Escola de Adivinhação" }, { id: "enchantment", name: "Escola de Encantamento" }, { id: "evocation", name: "Escola de Evocação" }, { id: "illusion", name: "Escola de Ilusão" }, { id: "necromancy", name: "Escola de Necromancia" }, { id: "transmutation", name: "Escola de Transmutação" }]
    },
  ],

  skills: [
    { name: "Acrobacia", stat: "dex" },
    { name: "Adestrar Animais", stat: "wis" },
    { name: "Arcanismo", stat: "int" },
    { name: "Atletismo", stat: "str" },
    { name: "Atuação", stat: "cha" },
    { name: "Enganação", stat: "cha" },
    { name: "Esperteza Manual", stat: "dex" },
    { name: "Furtividade", stat: "dex" },
    { name: "História", stat: "int" },
    { name: "Insight", stat: "wis" },
    { name: "Intimidação", stat: "cha" },
    { name: "Investigação", stat: "int" },
    { name: "Medicina", stat: "wis" },
    { name: "Natureza", stat: "int" },
    { name: "Percepção", stat: "wis" },
    { name: "Performance", stat: "cha" },
    { name: "Persuasão", stat: "cha" },
    { name: "Religião", stat: "int" },
    { name: "Sobrevivência", stat: "wis" },
  ],

  proficiencyBonus: [0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6],

  spellSlots: {
    1: [0, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    2: [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    3: [0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    4: [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    5: [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    6: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    7: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    8: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },

  profBonus(level) {
    return this.proficiencyBonus[Math.min(20, Math.max(1, level))];
  },

  modStr(val) {
    const mod = Math.floor((val - 10) / 2);
    return (mod >= 0 ? "+" : "") + mod;
  },

  ac(stats) {
    return 10 + Math.floor((stats.dex - 10) / 2);
  },

  initiative(stats) {
    return Math.floor((stats.dex - 10) / 2);
  },

  hp(cls, con, level) {
    const classData = this.classes.find(c => c.name === cls);
    if (!classData) return 0;
    const conMod = Math.floor((con - 10) / 2);
    return classData.hd + (conMod * level) + ((level - 1) * 1);
  },

  skillBonus(stat, prof, expertise, level, stats) {
    const mod = Math.floor((stats[stat] - 10) / 2);
    let bonus = mod;
    if (prof) bonus += this.profBonus(level);
    if (expertise) bonus += this.profBonus(level);
    return bonus;
  }
};

window.DND = DND;