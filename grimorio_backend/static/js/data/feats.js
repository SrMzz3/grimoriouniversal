/* js/data/feats.js – Talentos D&D 5e */

export const FEATS = [
  {
    id: "alert",
    name: "Alerta",
    prerequisites: null,
    benefits: {
      initiative: 5,
      surprise: "Você nunca pode ser surpreendido enquanto estiver consciente",
      visibility: "Outros não ganham vantagem em ataques contra você por ficarem invisíveis"
    }
  },
  {
    id: "athlete",
    name: "Atleta",
    prerequisites: null,
    abilityScore: { str: 1, dex: 1 },
    benefits: {
      standUp: "Levanta-se gasta apenas 1.5m",
      climb: "Escalar não custa movimento extra",
      jump: "Você pode saltar com 1.5m de corrida em vez de 3m"
    }
  },
  {
    id: "actor",
    name: "Ator",
    prerequisites: null,
    abilityScore: { cha: 1 },
    benefits: {
      deception: "Vantagem em testes de Enganação",
      performance: "Vantagem em testes de Performance",
      mimicry: "Você pode imitar a voz de uma pessoa"
    }
  },
  {
    id: "charger",
    name: "Investidor",
    prerequisites: null,
    benefits: {
      charge: "Quando você usa ação de Investida, pode fazer um ataque especial"
    }
  },
  {
    id: "crossbow_expert",
    name: "Especialista em Bestas",
    prerequisites: null,
    benefits: {
      loading: "Ignorar a propriedade carregamento de bestas",
      range: "Ataque corpo a corpo não provoca ataque de oportunidade com bestas",
      twoWeapon: "Você pode usar bestas como arma para ataque com arma bônus"
    }
  },
  {
    id: "defensive_duelist",
    name: "Duelista Defensivo",
    prerequisites: "Destreza 13+",
    benefits: {
      reaction: "Quando é alvo de ataque e tem rapieira de mão, pode adicionar seu bônus de proficiência à sua CA"
    }
  },
  {
    id: "dual_wielder",
    name: "Lutador de Duas Armas",
    prerequisites: null,
    benefits: {
      ac: "+1 em sua CA quando empunha arma em cada mão",
      draw: "Você pode desenhar duas armas ao mesmo tempo",
      versatile: "Você pode usar armas versáteis com uma mão mesmo sem usar escudo"
    }
  },
  {
    id: "dungeon_delver",
    name: "Explorador de Masmorras",
    prerequisites: null,
    benefits: {
      perception: "Vantagem em Percepção em masmorras",
      trap: "Vantagem em testes de Inteligência para encontrar armadilhas",
      resistance: "Resistência a dano de armadilhas"
    }
  },
  {
    id: "durable",
    name: "Resistente",
    prerequisites: null,
    abilityScore: { con: 1 },
    benefits: {
      healing: "Quando você usa um Dado de Vida para recuperar HP, role o dado duas vezes e use o maior resultado"
    }
  },
  {
    id: "elemental_adept",
    name: "Adepto Elementar",
    prerequisites: "Capacidade de lançar magia",
    benefits: {
      damage: "Escolha um tipo de dano elementar. Magia com esse dano ignora resistência",
      reroll: "Você pode gastar sorcery points para rerollar dados de dano"
    }
  },
  {
    id: "grappler",
    name: "Lutador",
    prerequisites: "Força 13+",
    benefits: {
      advantage: "Vantagem em testes de Força para prender alguém",
      restrain: "Enquanto prende alguém, ele tem desvantagem em ataques"
    }
  },
  {
    id: "great_weapon_master",
    name: "Mestre de Grandes Armas",
    prerequisites: null,
    benefits: {
      heavyMelee: "Você pode usar -5 no ataque para +10 no dano com armas pesadas",
      bonus: "Quando você acerta um crítico ou reduz inimigo a 0 HP, pode fazer um ataque bônus"
    }
  },
  {
    id: "healer",
    name: "Curador",
    prerequisites: null,
    benefits: {
      healing: "Usando Kit de Cura, pode restaurar 1d6+4 + nível da criatura em HP",
      stabilize: "Você pode restaurar alguém em 1 HP quando os estabiliza"
    }
  },
  {
    id: "heavily_armored",
    name: "Armado Pesadamente",
    prerequisites: "Proficiência com armadura média",
    benefits: {
      armorProf: "Proficiência com armadura pesada"
    }
  },
  {
    id: "keen_mind",
    name: "Mente Aguçada",
    prerequisites: "Inteligência 13+",
    benefits: {
      direction: "Você sempre sabe qual é o norte magnético",
      memory: "Você pode recordar qualquer coisa vista nos últimos 30 dias",
      distance: "Você sabe sua distância exata de objetos familiares"
    }
  },
  {
    id: "lightly_armored",
    name: "Armado Levemente",
    prerequisites: null,
    abilityScore: { str: 1, dex: 1 },
    benefits: {
      armorProf: "Proficiência com armadura leve e escudos"
    }
  },
  {
    id: "linguist",
    name: "Linguista",
    prerequisites: "Inteligência 13+",
    benefits: {
      languages: "Você aprende 3 novos idiomas",
      script: "Você pode criar cifras que levam 1 minuto por palavra para alguém decifrar"
    }
  },
  {
    id: "lucky",
    name: "Sortudo",
    prerequisites: null,
    benefits: {
      reroll: "Você tem 3 Pontos de Sorte. Pode gastar um para rerollar dados",
      enemy: "Quando um inimigo faz um ataque contra você, pode gastar um ponto para fazê-lo rerollar"
    }
  },
  {
    id: "magic_initiate",
    name: "Iniciado em Magia",
    prerequisites: null,
    benefits: {
      cantrips: "Você aprende 2 truques de um lançador de magia",
      spell: "Você aprende 1 magia de 1º nível e pode lançar uma vez sem gastar espaço"
    }
  },
  {
    id: "martial_adept",
    name: "Adepto Marcial",
    prerequisites: null,
    benefits: {
      maneuvers: "Você aprende 2 manobras de Guerreiro (Mestre de Batalha)",
      superiority: "Você tem 1 Dado de Superioridade (d6)"
    }
  },
  {
    id: "medium_armor_master",
    name: "Mestre de Armadura Média",
    prerequisites: "Proficiência com armadura média",
    benefits: {
      stealth: "Armadura média não impõe desvantagem em Furtividade",
      dex: "Você usa todo seu modificador de Destreza em vez de máximo +2"
    }
  },
  {
    id: "mobile",
    name: "Móvel",
    prerequisites: null,
    benefits: {
      speed: "Sua velocidade aumenta em 3m",
      melee: "Ataque corpo a corpo não provoca ataque de oportunidade",
      difficult: "Movimento através de terreno difícil custa 1 pé extra"
    }
  },
  {
    id: "moderately_armored",
    name: "Armado Moderadamente",
    prerequisites: "Proficiência com armadura leve",
    abilityScore: { str: 1, dex: 1 },
    benefits: {
      armorProf: "Proficiência com armadura média e escudos"
    }
  },
  {
    id: "mount_combat",
    name: "Combate Montado",
    prerequisites: null,
    benefits: {
      mounting: "Você tem vantagem em testes para ficar na sela",
      ally: "Quando sua montaria é alvo, você pode usar reação para trocá-la de lugar",
      attack: "Quando sua montaria é atacada, você pode atacar o atacante"
    }
  },
  {
    id: "observant",
    name: "Observador",
    prerequisites: "Inteligência ou Sabedoria 15+",
    benefits: {
      perception: "+1 em Percepção",
      reading: "Você pode ler lábios em qualquer idioma",
      sight: "Você pode notar entradas secretas, armadilhas, etc."
    }
  },
  {
    id: "polearm_master",
    name: "Mestre de Armas de Haste",
    prerequisites: null,
    benefits: {
      bonus: "Quando você usa uma arma de haste, pode atacar como ação bônus",
      reaction: "Você pode usar reação para atacar quando inimigo se aproxima"
    }
  },
  {
    id: "resilient",
    name: "Resiliente",
    prerequisites: null,
    abilityScore: { choice: 1 },
    benefits: {
      save: "Você ganha proficiência em testes de resistência da habilidade escolhida"
    }
  },
  {
    id: "ritual_caster",
    name: "Lançador de Rituais",
    prerequisites: "Inteligência ou Sabedoria 13+",
    benefits: {
      ritual: "Você pode lançar magia de ritual mesmo sem saber",
      book: "Você tem um livro de rituais"
    }
  },
  {
    id: "savage_attacker",
    name: "Atacante Selvagem",
    prerequisites: null,
    benefits: {
      reroll: "Quando você ataca com arma, pode rerollar os dados de dano até 1 vez por turno"
    }
  },
  {
    id: "sentinel",
    name: "Sentinela",
    prerequisites: null,
    benefits: {
      reaction: "Quando criatura move para sair da sua alcance, pode usar reação para fazer ataque",
      speed: "Reduz velocidade do atacante para 0 por esse turno",
      attack: "Se atacante estiver incapacitado, você pode fazer ataque contra ele"
    }
  },
  {
    id: "sharpshooter",
    name: "Atirador de Precisão",
    prerequisites: null,
    benefits: {
      range: "Você ignora meia cobertura e 3/4 de cobertura",
      penalty: "Você pode usar -5 no ataque para +10 no dano com armas à distância",
      ignore: "Alcance de arma à distância não impõe desvantagem"
    }
  },
  {
    id: "spell_sniper",
    name: "Atirador de Magia",
    prerequisites: "Capacidade de lançar magia",
    benefits: {
      sight: "Magia de ataque com alcance pode atingir a 2x o alcance normal",
      cover: "Você ignora 3/4 de cobertura para magias de ataque"
    }
  },
  {
    id: "tavern_brawler",
    name: "Brigão de Taverna",
    prerequisites: null,
    abilityScore: { str: 1, con: 1 },
    benefits: {
      unarmed: "Seu ataque desarmado causa 1d4 de dano",
      improvised: "Você é proficiente em armas improvisadas",
      bonus: "Quando acerta ataque desarmado, pode derrubar ou agarrar inimigo"
    }
  },
  {
    id: "tough",
    name: "Resistente",
    prerequisites: null,
    benefits: {
      hp: "Seu máximo de PV aumenta em 2 por nível"
    }
  },
  {
    id: "war_caster",
    name: "Lançador de Guerra",
    prerequisites: "Capacidade de lançar magia",
    benefits: {
      concentration: "Vantagem em testes de Constituição para manter concentração",
      somatic: "Você pode executar componentes somáticos com armas",
      provoke: "Ataque de oportunidade com sua arma contra quem lança magia perto"
    }
  },
  {
    id: "weapon_master",
    name: "Mestre de Armas",
    prerequisites: null,
    abilityScore: { str: 1, dex: 1 },
    benefits: {
      martial: "Você ganha proficiência com 4 armas marciais de sua escolha"
    }
  }
];

export function getFeatById(id) {
  return FEATS.find(f => f.id === id);
}
