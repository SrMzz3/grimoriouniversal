/* js/data/classes.js – PREENCHA COM DADOS DO LIVRO DO JOGADOR CAP. 3 */

// INSTRUÇÕES:
// 1. Abra o PDF "Livro do Jogador" Capítulo 3
// 2. Para cada classe, copie as features, descrições e detalhes das subclasses
// 3. Preencha os campos marcados com "TODO"

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
    features: {
      1: "TODO: Fúria (descrever efeitos, duração, usos)",
      1: "TODO: Defesa sem Armadura (fórmula de CA)",
      2: "TODO: Ataque Descuidado e Sentido de Perigo",
      3: "TODO: Caminho Primitivo (explicar como funciona)",
      4: "TODO: Incremento de Habilidade",
      5: "TODO: Ataque Extra (quantos ataques?)",
      5: "TODO: Movimento Rápido (aumento de velocidade)",
      7: "TODO: Instinto Selvagem (descrição)",
      9: "TODO: Crítico Brutal (dado de dano extra)",
      11: "TODO: Fúria Implacável (descrição)",
      13: "TODO: Crítico Brutal (incremento)",
      15: "TODO: Fúria Persistente",
      17: "TODO: Crítico Brutal (incremento)",
      18: "TODO: Força Indomável",
      20: "TODO: Campeão Primitivo (descrever bônus de For e Con)"
    },
    subclasses: [
      {
        id: "berserker",
        name: "Caminho do Furioso",
        features: {
          3: "TODO: Frenesi – descrição e efeitos",
          6: "TODO: Fúria Inconsciente",
          10: "TODO: Presença Intimidante",
          14: "TODO: Retaliação"
        }
      },
      {
        id: "totem_warrior",
        name: "Caminho do Guerreiro Totêmico",
        features: {
          3: "TODO: Conselheiro Espiritual",
          3: "TODO: Totem Espiritual (listar opções: Águia, Lobo, Urso)",
          6: "TODO: Aspecto da Besta",
          10: "TODO: Andarilho Espiritual",
          14: "TODO: Sintonia Totêmica"
        }
      }
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
    weaponProf: ["simples", "bestas de mão", "espadas longas", "rapieiras", "espadas curtas"],
    skillChoices: "qualquer 3",
    features: {
      1: "TODO: Conjuração (truques, magias conhecidas, espaços por nível)",
      1: "TODO: Inspiração de Bardo (d6, usos, como funciona)",
      2: "TODO: Versatilidade",
      2: "TODO: Canção do Descanso (efeito)",
      3: "TODO: Colégio de Bardo (como escolher)",
      3: "TODO: Aptidão (proficiência em perícias)",
      4: "TODO: Incremento de Habilidade",
      5: "TODO: Fonte de Inspiração (recuperação)",
      5: "TODO: Inspiração de Bardo (sobe para d8)",
      6: "TODO: Canção de Proteção (contra o quê?)",
      // ... continuar até nível 20
    },
    subclasses: [
      {
        id: "lore",
        name: "Colégio do Conhecimento",
        features: {
          3: "TODO: Proficiência Adicional (quantas perícias?)",
          3: "TODO: Palavras de Interrupção",
          6: "TODO: Canção de Proteção",
          14: "TODO: Segredos Mágicos Adicionais"
        }
      },
      {
        id: "valor",
        name: "Colégio da Bravura",
        features: {
          3: "TODO: Proficiência Adicional (armaduras)",
          3: "TODO: Inspiração em Combate",
          6: "TODO: Ataque Extra",
          14: "TODO: Magia de Batalha"
        }
      }
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
      1: "TODO: Patrono Transcendental (tipos: Arquifada, Corruptor, etc)",
      1: "TODO: Magia de Pacto (espaços por nível, níveis de magia)",
      1: "TODO: Truques e Magias Conhecidas",
      2: "TODO: Invocações Místicas (quantas? como funciona?)",
      2: "TODO: Magia de Pacto (incremento de espaços)",
      3: "TODO: Dádiva do Pacto (Corrente, Lâmina ou Tomo – descrever cada)",
      // ... continuar até nível 20
    },
    subclasses: [
      {
        id: "archfey",
        name: "A Arquifada",
        features: {
          1: "TODO: Lista de Magia Expandida (quais magias?)",
          1: "TODO: Presença Feérica (como afeta aliados/inimigos?)",
          6: "TODO: Névoa de Fuga",
          10: "TODO: Defesa Sedutora",
          14: "TODO: Delírio Sombrio"
        }
      },
      {
        id: "fiend",
        name: "O Corruptor",
        features: {
          1: "TODO: Lista de Magia Expandida",
          1: "TODO: Bênção do Obscuro (quantos PV temporários?)",
          6: "TODO: Sorte do Próprio Obscuro",
          10: "TODO: Resistência Demoníaca",
          14: "TODO: Lançar no Inferno (dano, efeito)"
        }
      },
      {
        id: "great_old_one",
        name: "O Grande Antigo",
        features: {
          1: "TODO: Lista de Magia Expandida",
          1: "TODO: Despertar a Mente (telepatia a que distância?)",
          6: "TODO: Proteção Entrópica",
          10: "TODO: Escudo de Pensamentos",
          14: "TODO: Criar Lacaios"
        }
      }
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
      1: "TODO: Conjuração (truques, magias preparadas = Sab + nível)",
      1: "TODO: Domínio Divino (explicar como funciona)",
      2: "TODO: Canalizar Divindade (usos, opções: Expulsar Mortos-Vivos)",
      5: "TODO: Destruir Mortos-Vivos (ND 1/4 ou 1/2?)",
      6: "TODO: Canalizar Divindade (incrementar usos)",
      10: "TODO: Intervenção Divina (probabilidade? como funciona?)",
      // ... continuar
    },
    subclasses: [
      {
        id: "knowledge",
        name: "Domínio do Conhecimento",
        features: {
          1: "TODO: Bênçãos do Conhecimento (idiomas e perícias)",
          1: "TODO: Magias de Domínio (lista completa)",
          2: "TODO: Conhecimento das Eras",
          6: "TODO: Ler Pensamentos",
          8: "TODO: Conjuração Poderosa",
          17: "TODO: Visões do Passado"
        }
      },
      {
        id: "trickery",
        name: "Domínio da Enganação",
        features: {
          1: "TODO: Bênção do Trapaceiro",
          1: "TODO: Magias de Domínio",
          2: "TODO: Invocar Duplicidade",
          6: "TODO: Manto de Sombras",
          8: "TODO: Golpe Divino",
          17: "TODO: Duplicidade Aprimorada"
        }
      },
      {
        id: "war",
        name: "Domínio da Guerra",
        features: {
          1: "TODO: Proficiência Adicional (tipos de armas/armaduras)",
          1: "TODO: Sacerdote da Guerra",
          1: "TODO: Magias de Domínio",
          2: "TODO: Ataque Dirigido",
          6: "TODO: Bênção do Deus da Guerra",
          8: "TODO: Golpe Divino",
          17: "TODO: Avatar da Batalha"
        }
      },
      {
        id: "light",
        name: "Domínio da Luz",
        features: {
          1: "TODO: Truque Adicional",
          1: "TODO: Labareda Protetora",
          1: "TODO: Magias de Domínio",
          2: "TODO: Radiação do Amanhecer",
          6: "TODO: Labareda Aprimorada",
          8: "TODO: Conjuração Poderosa",
          17: "TODO: Coroa de Luz"
        }
      },
      {
        id: "nature",
        name: "Domínio da Natureza",
        features: {
          1: "TODO: Acólito da Natureza",
          1: "TODO: Proficiência Adicional",
          1: "TODO: Magias de Domínio",
          2: "TODO: Enfeitiçar Animais e Plantas",
          6: "TODO: Amortecer Elementos",
          8: "TODO: Golpe Divino",
          17: "TODO: Senhor da Natureza"
        }
      },
      {
        id: "tempest",
        name: "Domínio da Tempestade",
        features: {
          1: "TODO: Proficiência Adicional",
          1: "TODO: Ira da Tormenta (dano de reação)",
          1: "TODO: Magias de Domínio",
          2: "TODO: Ira Destruidora",
          6: "TODO: Golpe de Relâmpago",
          8: "TODO: Golpe Divino",
          17: "TODO: Filho da Tormenta"
        }
      },
      {
        id: "life",
        name: "Domínio da Vida",
        features: {
          1: "TODO: Proficiência Adicional",
          1: "TODO: Discípulo da Vida",
          1: "TODO: Magias de Domínio",
          2: "TODO: Preservar a Vida",
          6: "TODO: Curandeiro Abençoado",
          8: "TODO: Golpe Divino",
          17: "TODO: Cura Suprema"
        }
      }
    ]
  },

  // ==================== DRUIDA ====================
  {
    id: "druid",
    name: "Druida",
    hd: 8,
    primaryAbility: "Sabedoria",
    saves: ["int", "wis"],
    armorProf: ["leves", "médias", "escudos (não metálicos)"],
    weaponProf: ["clavas", "adagas", "dardos", "azagaias", "maças", "bordões", "cimitarras", "foices", "fundas", "lanças"],
    features: {
      1: "TODO: Conjuração (truques, magias preparadas)",
      1: "TODO: Druídico (idioma secreto)",
      2: "TODO: Forma Selvagem (ND de bestas, duração, usos)",
      2: "TODO: Círculo Druídico (como escolher)",
      4: "TODO: Incremento de Habilidade",
      // ... continuar
    },
    subclasses: [
      {
        id: "land",
        name: "Círculo da Terra",
        features: {
          2: "TODO: Truque Adicional",
          2: "TODO: Recuperação Natural",
          2: "TODO: Magias de Círculo (por terreno)",
          6: "TODO: Caminho da Floresta",
          10: "TODO: Proteção Natural",
          14: "TODO: Santuário Natural"
        }
      },
      {
        id: "moon",
        name: "Círculo da Lua",
        features: {
          2: "TODO: Forma Selvagem de Combate",
          2: "TODO: Formas de Círculo (níveis de bestias)",
          6: "TODO: Ataque Primordial",
          10: "TODO: Forma Selvagem de Elemental",
          14: "TODO: Mil Formas"
        }
      }
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
      1: "TODO: Conjuração (truques, magias conhecidas)",
      1: "TODO: Origem de Feitiçaria (tipos: Dracônico, Magia Selvagem, etc)",
      2: "TODO: Fonte de Magia (pontos por nível)",
      3: "TODO: Metamágica (quantas opções? quais?)",
      4: "TODO: Incremento de Habilidade",
      // ... continuar
    },
    subclasses: [
      {
        id: "draconic",
        name: "Linhagem Dracônica",
        features: {
          1: "TODO: Ancestral Dracônico (tipos de dragão)",
          1: "TODO: Resiliência Dracônica (fórmula de CA)",
          6: "TODO: Afinidade Elemental",
          14: "TODO: Asas de Dragão",
          18: "TODO: Presença Dracônica"
        }
      },
      {
        id: "wild_magic",
        name: "Magia Selvagem",
        features: {
          1: "TODO: Surto de Magia Selvagem (tabela de efeitos)",
          1: "TODO: Marés de Caos",
          6: "TODO: Dobrar a Sorte",
          14: "TODO: Caos Controlado",
          18: "TODO: Bombardeio de Magia"
        }
      }
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
      1: "TODO: Estilo de Luta (tipos: Arqueiraria, Combate com Duas Armas, Estilo de Defesa, Luta Desarmada, etc)",
      1: "TODO: Retomar o Fôlego (d10 + nível, usos)",
      2: "TODO: Surto de Ação (usos, ações adicionais)",
      3: "TODO: Arquétipo Marcial",
      4: "TODO: Incremento de Habilidade",
      5: "TODO: Ataque Extra (2 ataques)",
      // ... continuar até nível 20
    },
    subclasses: [
      {
        id: "champion",
        name: "Campeão",
        features: {
          3: "TODO: Crítico Aprimorado (em qual valor?)",
          7: "TODO: Atletismo Extraordinário",
          10: "TODO: Estilo de Luta Adicional",
          15: "TODO: Crítico Superior",
          18: "TODO: Sobrevivente"
        }
      },
      {
        id: "battle_master",
        name: "Mestre de Batalha",
        features: {
          3: "TODO: Superioridade em Combate (dados, manobras)",
          3: "TODO: Estudioso da Guerra",
          7: "TODO: Conheça seu Inimigo",
          10: "TODO: Superioridade Aprimorada",
          15: "TODO: Implacável",
          18: "TODO: Superioridade Superior"
        }
      },
      {
        id: "eldritch_knight",
        name: "Cavaleiro Arcano",
        features: {
          3: "TODO: Conjuração (magias de abjuração/evocação)",
          3: "TODO: Vínculo com Arma",
          7: "TODO: Magia de Guerra",
          10: "TODO: Golpe Místico",
          15: "TODO: Investida Arcana",
          18: "TODO: Magia de Guerra Aprimorada"
        }
      }
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
    weaponProf: ["simples", "bestas de mão", "espadas longas", "rapieiras", "espadas curtas"],
    features: {
      1: "TODO: Especialização (perícias com proficiência dobrada)",
      1: "TODO: Ataque Furtivo (1d6 + incrementos por nível)",
      1: "TODO: Gíria de Ladrão",
      2: "TODO: Ação Ardilosa (ação bônus)",
      3: "TODO: Arquétipo de Ladino",
      4: "TODO: Incremento de Habilidade",
      5: "TODO: Esquiva Sobrenatural (reação)",
      // ... continuar até nível 20
    },
    subclasses: [
      {
        id: "assassin",
        name: "Assassino",
        features: {
          3: "TODO: Proficiência Adicional (ferramentas)",
          3: "TODO: Assassinar (vantagem em surpresa)",
          9: "TODO: Especialização em Infiltração",
          13: "TODO: Impostor",
          17: "TODO: Golpe Letal"
        }
      },
      {
        id: "thief",
        name: "Ladrão",
        features: {
          3: "TODO: Mãos Rápidas",
          3: "TODO: Andarilho de Telhados",
          9: "TODO: Furtividade Suprema",
          13: "TODO: Usar Instrumento Mágico",
          17: "TODO: Reflexos de Ladrão"
        }
      },
      {
        id: "arcane_trickster",
        name: "Trapaceiro Arcano",
        features: {
          3: "TODO: Conjuração (truques, magias de encantamento/ilusão)",
          3: "TODO: Mãos Mágicas Malabaristas",
          9: "TODO: Emboscada Mágica",
          13: "TODO: Trapaceiro Versátil",
          17: "TODO: Ladrão de Magia"
        }
      }
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
      1: "TODO: Conjuração (truques, magias preparadas, grimório)",
      1: "TODO: Recuperação Arcana (usos, recupera quantos espaços?)",
      2: "TODO: Tradição Arcana (8 opções de escolas)",
      4: "TODO: Incremento de Habilidade",
      18: "TODO: Dominar Magia (quais magias?)",
      20: "TODO: Assinatura Mágica (3º nível, sempre preparada)"
    },
    subclasses: [
      {
        id: "abjuration",
        name: "Escola de Abjuração",
        features: {
          2: "TODO: Abjuração Instruída",
          2: "TODO: Proteção Arcana",
          6: "TODO: Proteção Projetada",
          10: "TODO: Abjuração Aprimorada",
          14: "TODO: Resistência à Magia"
        }
      },
      {
        id: "conjuration",
        name: "Escola de Conjuração",
        features: {
          2: "TODO: Conjuração Instruída",
          2: "TODO: Conjuração Menor",
          6: "TODO: Transposição Benigna",
          10: "TODO: Conjuração Focada",
          14: "TODO: Invocações Resistentes"
        }
      },
      {
        id: "divination",
        name: "Escola de Adivinhação",
        features: {
          2: "TODO: Adivinhação Instruída",
          2: "TODO: Prodígio",
          6: "TODO: Especialista em Adivinhação",
          10: "TODO: O Terceiro Olho",
          14: "TODO: Prodígio Maior"
        }
      },
      {
        id: "enchantment",
        name: "Escola de Encantamento",
        features: {
          2: "TODO: Encantamento Instruído",
          2: "TODO: Olhar Hipnotizante",
          6: "TODO: Encanto Instintivo",
          10: "TODO: Dividir Encantamento",
          14: "TODO: Alterar Memórias"
        }
      },
      {
        id: "evocation",
        name: "Escola de Evocação",
        features: {
          2: "TODO: Evocação Instruída",
          2: "TODO: Esculpir Magias",
          6: "TODO: Truque Potente",
          10: "TODO: Evocação Potencializada",
          14: "TODO: Sobrecarga"
        }
      },
      {
        id: "illusion",
        name: "Escola de Ilusão",
        features: {
          2: "TODO: Ilusão Instruída",
          2: "TODO: Ilusão Menor Aprimorada",
          6: "TODO: Ilusões Moldáveis",
          10: "TODO: Eu Ilusório",
          14: "TODO: Realidade Ilusória"
        }
      },
      {
        id: "necromancy",
        name: "Escola de Necromancia",
        features: {
          2: "TODO: Necromancia Instruída",
          2: "TODO: Colheita Sinistra",
          6: "TODO: Escravos Mortos-Vivos",
          10: "TODO: Acostumado à Morte-Vida",
          14: "TODO: Comandar Mortos-Vivos"
        }
      },
      {
        id: "transmutation",
        name: "Escola de Transmutação",
        features: {
          2: "TODO: Transmutação Instruída",
          2: "TODO: Alquimia Menor",
          6: "TODO: Pedra de Transmutador",
          10: "TODO: Metamorfo",
          14: "TODO: Mestre Transmutador"
        }
      }
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
    weaponProf: ["simples", "espadas curtas"],
    features: {
      1: "TODO: Defesa sem Armadura (fórmula de CA)",
      1: "TODO: Artes Marciais (d4 + incrementos)",
      1: "TODO: Chi (pontos por nível, usos)",
      2: "TODO: Movimento sem Armadura (aumento de velocidade)",
      3: "TODO: Tradição Monástica",
      3: "TODO: Defletir Projéteis",
      4: "TODO: Incremento de Habilidade",
      // ... continuar até nível 20
    },
    subclasses: [
      {
        id: "open_hand",
        name: "Caminho da Mão Aberta",
        features: {
          3: "TODO: Técnica da Mão Aberta",
          6: "TODO: Integridade Corporal",
          11: "TODO: Tranquilidade",
          17: "TODO: Palma Vibrante"
        }
      },
      {
        id: "shadow",
        name: "Caminho da Sombra",
        features: {
          3: "TODO: Artes Sombrias (magias e efeitos)",
          6: "TODO: Passo das Sombras",
          11: "TODO: Manto de Sombras",
          17: "TODO: Oportunista"
        }
      },
      {
        id: "four_elements",
        name: "Caminho dos Quatro Elementos",
        features: {
          3: "TODO: Disciplina Elemental (Sintonia + 1 outra)",
          6: "TODO: Disciplina Elemental adicional",
          11: "TODO: Disciplina Elemental adicional",
          17: "TODO: Disciplina Elemental adicional"
        }
      }
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
      1: "TODO: Sentido Divino (detecta o quê?)",
      1: "TODO: Cura pelas Mãos (PV máximo)",
      2: "TODO: Estilo de Luta",
      2: "TODO: Conjuração (magias preparadas)",
      2: "TODO: Destruição Divina (como gastar espaço?)",
      3: "TODO: Saúde Divina",
      3: "TODO: Juramento Sagrado (3 tipos)",
      5: "TODO: Ataque Extra",
      6: "TODO: Aura de Proteção (raio, bônus)",
      // ... continuar até nível 20
    },
    subclasses: [
      {
        id: "devotion",
        name: "Juramento de Devoção",
        features: {
          3: "TODO: Magias de Juramento (lista)",
          3: "TODO: Canalizar Divindade opções",
          7: "TODO: Aura de Devoção",
          15: "TODO: Pureza de Espírito",
          20: "TODO: Halo Sagrado"
        }
      },
      {
        id: "ancients",
        name: "Juramento dos Anciões",
        features: {
          3: "TODO: Magias de Juramento",
          3: "TODO: Canalizar Divindade",
          7: "TODO: Aura de Vigilância",
          15: "TODO: Sentinelas Imortais",
          20: "TODO: Campeão dos Anciões"
        }
      },
      {
        id: "vengeance",
        name: "Juramento de Vingança",
        features: {
          3: "TODO: Magias de Juramento",
          3: "TODO: Canalizar Divindade",
          7: "TODO: Vingador Implacável",
          15: "TODO: Alma de Vingança",
          20: "TODO: Anjo Vingador"
        }
      }
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
      1: "TODO: Inimigo Favorito (tipos, bônus de dano)",
      1: "TODO: Explorador Natural (benefícios)",
      2: "TODO: Estilo de Luta",
      2: "TODO: Conjuração",
      3: "TODO: Conclave de Patrulheiro",
      3: "TODO: Consciência Primitiva",
      4: "TODO: Incremento de Habilidade",
      5: "TODO: Ataque Extra",
      // ... continuar até nível 20
    },
    subclasses: [
      {
        id: "beast_master",
        name: "Conclave da Besta",
        features: {
          3: "TODO: Companheiro Animal (como invocar?)",
          5: "TODO: Ataque Coordenado",
          7: "TODO: Defesa da Besta",
          11: "TODO: Tempestade de Garras e Presas",
          15: "TODO: Defesa da Besta Superior"
        }
      },
      {
        id: "hunter",
        name: "Conclave do Caçador",
        features: {
          3: "TODO: Presa do Caçador (opções)",
          5: "TODO: Ataque Extra",
          7: "TODO: Táticas Defensivas",
          11: "TODO: Ataque Múltiplo",
          15: "TODO: Defesa de Caçador Superior"
        }
      },
      {
        id: "gloom_stalker",
        name: "Conclave do Rastreador Subterrâneo",
        features: {
          3: "TODO: Batedor do Subterrâneo",
          3: "TODO: Magia do Rastreador Subterrâneo",
          5: "TODO: Ataque Extra",
          7: "TODO: Mente de Aço",
          11: "TODO: Rajada do Rastreador",
          15: "TODO: Esquiva do Rastreador"
        }
      }
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
