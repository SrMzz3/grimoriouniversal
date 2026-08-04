/* js/data/classes-template.js – TEMPLATE para preencher com seus dados das PDFs */

export const CLASSES = [
  // ==================== BÁRBARO ====================
  {
    id: "barbarian",
    name: "Bárbaro",
    hd: 12,
    primaryAbility: "Força",
    saves: ["str", "con"],
    armorProf: ["leves", "médias", "escudos"],
    weaponProf: ["simples", "marciais"],
    skillChoices: ["Adestrar Animais", "Atletismo", "Intimidação", "Natureza", "Percepção", "Sobrevivência"],
    // PREENCHER: features por nível com descrições do Livro do Jogador capítulo 3
    features: {
      1: "Fúria e Defesa sem Armadura", // Descrever seus efeitos
      2: "Ataque Descuidado e Sentido de Perigo",
      3: "Caminho Primitivo",
      // ... continuar até nível 20
    },
    subclasses: [
      { id: "berserker", name: "Caminho do Furioso" },
      { id: "totem_warrior", name: "Caminho do Guerreiro Totêmico" }
    ]
  },

  // ==================== BARDO ====================
  {
    id: "bard",
    name: "Bardo",
    hd: 8,
    primaryAbility: "Carisma",
    saves: ["dex", "cha"],
    armorProf: ["leves"],
    weaponProf: ["simples", "espada longa", "rapieira", "espada curta"],
    skillChoices: "qualquer 3",
    features: {
      1: "Conjuração e Inspiração Bárdica",
      2: "Versatilidade",
      3: "Colégio de Bardo",
      // ... preencher
    },
    subclasses: [
      { id: "lore", name: "Colégio do Conhecimento" },
      { id: "valor", name: "Colégio da Bravura" }
    ]
  },

  // ==================== BRUXO ====================
  {
    id: "warlock",
    name: "Bruxo",
    hd: 8,
    primaryAbility: "Carisma",
    saves: ["wis", "cha"],
    armorProf: ["leves"],
    weaponProf: ["simples"],
    features: {
      1: "Patrono Transcendental e Magia de Pacto",
      2: "Invocações Místicas",
      3: "Dádiva do Pacto",
      // ... preencher
    },
    subclasses: [
      { id: "archfey", name: "A Arquifada" },
      { id: "fiend", name: "O Corruptor" },
      { id: "great_old_one", name: "O Grande Antigo" }
    ]
  },

  // ==================== CLÉRIGO ====================
  {
    id: "cleric",
    name: "Clérigo",
    hd: 8,
    primaryAbility: "Sabedoria",
    saves: ["wis", "cha"],
    armorProf: ["leves", "médias", "escudos"],
    weaponProf: ["simples"],
    features: {
      1: "Conjuração e Domínio Divino",
      2: "Canalizar Divindade",
      5: "Destruir Mortos-Vivos",
      // ... preencher
    },
    subclasses: [
      { id: "knowledge", name: "Domínio do Conhecimento" },
      { id: "trickery", name: "Domínio da Enganação" },
      { id: "war", name: "Domínio da Guerra" },
      { id: "light", name: "Domínio da Luz" },
      { id: "nature", name: "Domínio da Natureza" },
      { id: "tempest", name: "Domínio da Tempestade" },
      { id: "life", name: "Domínio da Vida" }
    ]
  },

  // ==================== DRUIDA ====================
  {
    id: "druid",
    name: "Druida",
    hd: 8,
    primaryAbility: "Sabedoria",
    saves: ["int", "wis"],
    armorProf: ["leves", "médias"],
    weaponProf: ["clavas", "adagas", "dardos", "lanças"],
    features: {
      1: "Conjuração e Forma Selvagem",
      2: "Círculo Druídico",
      4: "Incremento de Habilidade",
      // ... preencher
    },
    subclasses: [
      { id: "land", name: "Círculo da Terra" },
      { id: "moon", name: "Círculo da Lua" }
    ]
  },

  // ==================== FEITICEIRO ====================
  {
    id: "sorcerer",
    name: "Feiticeiro",
    hd: 6,
    primaryAbility: "Carisma",
    saves: ["con", "cha"],
    armorProf: [],
    weaponProf: ["adagas", "dardos", "fundas", "bordões", "bestas leves"],
    features: {
      1: "Conjuração e Origem de Feitiçaria",
      2: "Fonte de Magia",
      3: "Metamágica",
      // ... preencher
    },
    subclasses: [
      { id: "draconic", name: "Linhagem Dracônica" },
      { id: "wild_magic", name: "Magia Selvagem" }
    ]
  },

  // ==================== GUERREIRO ====================
  {
    id: "fighter",
    name: "Guerreiro",
    hd: 10,
    primaryAbility: "Força ou Destreza",
    saves: ["str", "con"],
    armorProf: ["todas", "escudos"],
    weaponProf: ["simples", "marciais"],
    features: {
      1: "Estilo de Luta e Retomar o Fôlego",
      2: "Surto de Ação",
      3: "Arquétipo Marcial",
      5: "Ataque Extra",
      // ... preencher
    },
    subclasses: [
      { id: "champion", name: "Campeão" },
      { id: "battle_master", name: "Mestre de Batalha" },
      { id: "eldritch_knight", name: "Cavaleiro Arcano" }
    ]
  },

  // ==================== LADINO ====================
  {
    id: "rogue",
    name: "Ladino",
    hd: 8,
    primaryAbility: "Destreza",
    saves: ["dex", "int"],
    armorProf: ["leves"],
    weaponProf: ["simples", "rapieira", "espada curta"],
    features: {
      1: "Especialização e Ataque Furtivo",
      2: "Ação Ardilosa",
      3: "Arquétipo de Ladino",
      5: "Esquiva Sobrenatural",
      7: "Evasão",
      // ... preencher
    },
    subclasses: [
      { id: "assassin", name: "Assassino" },
      { id: "thief", name: "Ladrão" },
      { id: "arcane_trickster", name: "Trapaceiro Arcano" }
    ]
  },

  // ==================== MAGO ====================
  {
    id: "wizard",
    name: "Mago",
    hd: 6,
    primaryAbility: "Inteligência",
    saves: ["int", "wis"],
    armorProf: [],
    weaponProf: ["adagas", "dardos", "fundas", "bordões", "bestas leves"],
    features: {
      1: "Conjuração, Grimório e Recuperação Arcana",
      2: "Tradição Arcana",
      4: "Incremento de Habilidade",
      18: "Dominar Magia",
      20: "Assinatura Mágica"
      // ... preencher
    },
    subclasses: [
      { id: "abjuration", name: "Escola de Abjuração" },
      { id: "conjuration", name: "Escola de Conjuração" },
      { id: "divination", name: "Escola de Adivinhação" },
      { id: "enchantment", name: "Escola de Encantamento" },
      { id: "evocation", name: "Escola de Evocação" },
      { id: "illusion", name: "Escola de Ilusão" },
      { id: "necromancy", name: "Escola de Necromancia" },
      { id: "transmutation", name: "Escola de Transmutação" }
    ]
  },

  // ==================== MONGE ====================
  {
    id: "monk",
    name: "Monge",
    hd: 8,
    primaryAbility: "Destreza e Sabedoria",
    saves: ["str", "dex"],
    armorProf: [],
    weaponProf: ["simples", "espada curta"],
    features: {
      1: "Defesa sem Armadura e Artes Marciais",
      2: "Chi",
      3: "Tradição Monástica",
      5: "Ataque Extra",
      7: "Evasão",
      // ... preencher
    },
    subclasses: [
      { id: "open_hand", name: "Caminho da Mão Aberta" },
      { id: "shadow", name: "Caminho da Sombra" },
      { id: "four_elements", name: "Caminho dos Quatro Elementos" }
    ]
  },

  // ==================== PALADINO ====================
  {
    id: "paladin",
    name: "Paladino",
    hd: 10,
    primaryAbility: "Força e Carisma",
    saves: ["wis", "cha"],
    armorProf: ["todas", "escudos"],
    weaponProf: ["simples", "marciais"],
    features: {
      1: "Sentido Divino e Cura pelas Mãos",
      2: "Estilo de Luta, Conjuração e Destruição Divina",
      3: "Juramento Sagrado",
      5: "Ataque Extra",
      6: "Aura de Proteção",
      10: "Intervenção Divina",
      // ... preencher
    },
    subclasses: [
      { id: "devotion", name: "Juramento de Devoção" },
      { id: "ancients", name: "Juramento dos Anciões" },
      { id: "vengeance", name: "Juramento de Vingança" }
    ]
  },

  // ==================== PATRULHEIRO ====================
  {
    id: "ranger",
    name: "Patrulheiro",
    hd: 10,
    primaryAbility: "Destreza e Sabedoria",
    saves: ["str", "dex"],
    armorProf: ["leves", "médias", "escudos"],
    weaponProf: ["simples", "marciais"],
    features: {
      1: "Inimigo Favorito e Explorador Natural",
      2: "Estilo de Luta e Conjuração",
      3: "Conclave de Patrulheiro",
      5: "Ataque Extra",
      8: "Pés Rápidos",
      14: "Desaparecer",
      // ... preencher
    },
    subclasses: [
      { id: "beast_master", name: "Conclave da Besta" },
      { id: "hunter", name: "Conclave do Caçador" },
      { id: "gloom_stalker", name: "Conclave do Rastreador Subterrâneo" }
    ]
  }
];

export function getClassById(id) {
  return CLASSES.find(c => c.id === id);
}

export function getSubclassById(classId, subclassId) {
  const cls = getClassById(classId);
  if (!cls) return null;
  return cls.subclasses.find(s => s.id === subclassId);
}
