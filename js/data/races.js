/* js/data/races.js – Todas as raças e sub-raças do Livro do Jogador */

export const RACES = [
  {
    id: "dwarf",
    name: "Anão",
    abilityBonuses: { con: 2 },
    speed: 7.5,
    size: "Médio",
    languages: ["Comum", "Anão"],
    traits: ["Visão no Escuro (18m)", "Resiliência Anã", "Treinamento Anão em Combate", "Proficiência com Ferramentas", "Especialização em Rochas"],
    subraces: [
      { id: "hill", name: "Anão da Colina", abilityBonuses: { wis: 1 }, traits: ["Tenacidade Anã (+1 PV por nível)"] },
      { id: "mountain", name: "Anão da Montanha", abilityBonuses: { str: 2 }, traits: ["Treinamento com Armaduras (leves e médias)"] }
    ]
  },
  {
    id: "elf",
    name: "Elfo",
    abilityBonuses: { dex: 2 },
    speed: 9,
    size: "Médio",
    languages: ["Comum", "Élfico"],
    traits: ["Visão no Escuro (18m)", "Sentidos Aguçados", "Ancestral Feérico", "Transe"],
    subraces: [
      { id: "high", name: "Alto Elfo", abilityBonuses: { int: 1 }, traits: ["Treinamento Élfico com Armas", "Truque de mago", "Idioma Adicional"] },
      { id: "wood", name: "Elfo da Floresta", abilityBonuses: { wis: 1 }, speed: 10.5, traits: ["Pés Ligeiros", "Máscara da Natureza"] },
      { id: "dark", name: "Elfo Negro (Drow)", abilityBonuses: { cha: 1 }, traits: ["Visão no Escuro Superior (36m)", "Magia Drow", "Sensibilidade à Luz Solar"] }
    ]
  },
  {
    id: "halfling",
    name: "Halfling",
    abilityBonuses: { dex: 2 },
    speed: 7.5,
    size: "Pequeno",
    languages: ["Comum", "Halfling"],
    traits: ["Sortudo", "Bravura", "Agilidade Halfling"],
    subraces: [
      { id: "lightfoot", name: "Halfling Pés-Leves", abilityBonuses: { cha: 1 }, traits: ["Furtividade Natural"] },
      { id: "stout", name: "Halfling Robusto", abilityBonuses: { con: 1 }, traits: ["Resiliência dos Robustos"] }
    ]
  },
  {
    id: "human",
    name: "Humano",
    abilityBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    speed: 9,
    size: "Médio",
    languages: ["Comum", "um idioma adicional"],
    traits: ["Versátil"],
    subraces: []
  },
  {
    id: "dragonborn",
    name: "Draconato",
    abilityBonuses: { str: 2, cha: 1 },
    speed: 9,
    size: "Médio",
    languages: ["Comum", "Dracônico"],
    traits: ["Ancestral Dracônico", "Arma de Sopro", "Resistência a Dano"],
    subraces: []
  },
  {
    id: "gnome",
    name: "Gnomo",
    abilityBonuses: { int: 2 },
    speed: 7.5,
    size: "Pequeno",
    languages: ["Comum", "Gnômico"],
    traits: ["Visão no Escuro (18m)", "Esperteza Gnômica"],
    subraces: [
      { id: "forest", name: "Gnomo da Floresta", abilityBonuses: { dex: 1 }, traits: ["Ilusionista Nato", "Falar com Bestas Pequenas"] },
      { id: "rock", name: "Gnomo das Rochas", abilityBonuses: { con: 1 }, traits: ["Engenhoqueiro"] }
    ]
  },
  {
    id: "half_elf",
    name: "Meio-Elfo",
    abilityBonuses: { cha: 2, _choice: 2 },
    speed: 9,
    size: "Médio",
    languages: ["Comum", "Élfico", "um idioma adicional"],
    traits: ["Visão no Escuro (18m)", "Ancestral Feérico", "Versatilidade em Perícia"],
    subraces: []
  },
  {
    id: "half_orc",
    name: "Meio-Orc",
    abilityBonuses: { str: 2, con: 1 },
    speed: 9,
    size: "Médio",
    languages: ["Comum", "Orc"],
    traits: ["Visão no Escuro (18m)", "Ameaçador", "Resistência Implacável", "Ataques Selvagens"],
    subraces: []
  },
  {
    id: "tiefling",
    name: "Tiefling",
    abilityBonuses: { int: 1, cha: 2 },
    speed: 9,
    size: "Médio",
    languages: ["Comum", "Infernal"],
    traits: ["Visão no Escuro (18m)", "Resistência Infernal (fogo)", "Legado Infernal"],
    subraces: []
  }
];

export function getRaceById(id) {
  return RACES.find(r => r.id === id);
}

export function getSubraceById(raceId, subraceId) {
  const race = getRaceById(raceId);
  if (!race) return null;
  return race.subraces.find(s => s.id === subraceId);
}
