/* js/data/backgrounds.js – Antecedentes D&D 5e */

export const BACKGROUNDS = [
  {
    id: "acolyte",
    name: "Acólito",
    skillProfs: ["Intuição", "Religião"],
    languages: 1,
    equipment: ["símbolo sagrado", "livro de preces", "incenso", "vestes", "15 po"],
    feature: "Abrigo dos Fiéis",
    traits: ["Você tem grande devoção a uma divindade"]
  },
  {
    id: "criminal",
    name: "Criminoso",
    skillProfs: ["Enganação", "Furtividade"],
    toolProfs: ["kit de jogo", "ferramentas de ladrão"],
    languages: 0,
    equipment: ["pé de cabra", "roupas escuras com capuz", "15 po"],
    feature: "Contato Criminal",
    traits: ["Você tem um contato no submundo"]
  },
  {
    id: "entertainer",
    name: "Artista",
    skillProfs: ["Acrobacia", "Performance"],
    toolProfs: ["instrumento musical"],
    languages: 0,
    equipment: ["instrumento musical", "fantasia de performance", "15 po"],
    feature: "Estar em Voga",
    traits: ["Você é conhecido em certos círculos artísticos"]
  },
  {
    id: "folk_hero",
    name: "Herói do Povo",
    skillProfs: ["Adestrar Animais", "Sobrevivência"],
    toolProfs: ["ferramentas de artesão"],
    languages: 0,
    equipment: ["ferramentas de artesão", "mochila", "15 po"],
    feature: "Bem-vindo Por Toda Parte",
    traits: ["Você é reconhecido como alguém que ajuda os necessitados"]
  },
  {
    id: "guild_artisan",
    name: "Artesão de Guilda",
    skillProfs: ["Insight", "Persuasão"],
    toolProfs: ["ferramentas de artesão"],
    languages: 1,
    equipment: ["ferramentas de artesão", "carta de guilda", "15 po"],
    feature: "Membro da Guilda",
    traits: ["Você é membro de uma guilda de artesãos"]
  },
  {
    id: "hermit",
    name: "Eremita",
    skillProfs: ["Medicina", "Religião"],
    toolProfs: ["kit de ervas"],
    languages: 1,
    equipment: ["kit de escrita", "mapa do local de isolamento", "15 po"],
    feature: "Descoberta",
    traits: ["Durante seu isolamento, você descobriu algo importante"]
  },
  {
    id: "noble",
    name: "Nobre",
    skillProfs: ["Insight", "Sofisticação"],
    languages: 1,
    equipment: ["roupas finas", "selim de cavalos", "15 po"],
    feature: "Posição Privilegiada",
    traits: ["Sua posição social garante favores e respeito"]
  },
  {
    id: "sage",
    name: "Sábio",
    skillProfs: ["Arcana", "História"],
    languages: 2,
    equipment: ["bolsa com quill e tinta", "pequeno faca", "letra de referência", "15 po"],
    feature: "Pesquisador",
    traits: ["Você tem acesso a bibliotecas e recursos de aprendizado"]
  },
  {
    id: "soldier",
    name: "Soldado",
    skillProfs: ["Atletismo", "Intimidação"],
    toolProfs: ["jogos de tabuleiro"],
    languages: 0,
    equipment: ["insígnia militar", "estandarte", "15 po"],
    feature: "Militar Ranking",
    traits: ["Você tem conexões militares"]
  },
  {
    id: "urchin",
    name: "Criança da Rua",
    skillProfs: ["Furtividade", "Sleight of Hand"],
    toolProfs: ["ferramentas de ladrão", "jogos de tabuleiro"],
    languages: 0,
    equipment: ["ferramenta de vidro", "mapa da cidade", "15 po"],
    feature: "Cidade Secreta",
    traits: ["Você conhece os segredos da cidade"]
  }
];

export function getBackgroundById(id) {
  return BACKGROUNDS.find(b => b.id === id);
}
