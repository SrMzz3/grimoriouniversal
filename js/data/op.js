/* js/data/op.js — Ordem Paranormal RPG (Livro Base) */

console.log('📦 [OP] Carregando dados do Ordem Paranormal...');

const OP = {
  name: "Ordem Paranormal",
  icon: "🌙",
  color: "#00e5ff",
  desc: "RPG brasileiro — horror e paranormal",
  flavor: '"Há coisas entre o mundo dos vivos e o desconhecido que a razão humana ainda não alcançou."',

  statKeys: ["for", "agi", "int", "pre", "vig"],
  statLabels: { for: "Força", agi: "Agilidade", int: "Intelecto", pre: "Presença", vig: "Vigor" },
  diceSet: ["d4", "d6", "d8", "d10", "d12", "d20"],

  statDefault: 1,
  statMin: 1,
  statMax: 5,

  classes: [
    {
      id: "combatente",
      name: "Combatente",
      icon: "⚔️",
      desc: "Especializado em combate direto. Alto vigor e resistência.",
      skillProficiencies: ["Luta", "Pontaria", "Atletismo", "Fortitude"],
      features: ["Ataque Extra", "Defesa Aprimorada", "Estilo de Combate", "Resiliência"],
      pvBase: 20,
      pvPorNEX: 4,
      peBase: 2,
      pePorNEX: 2,
      sanBase: 12,
      sanPorNEX: 3,
    },
    {
      id: "especialista",
      name: "Especialista",
      icon: "🔧",
      desc: "Versátil, habilidoso em múltiplas áreas.",
      skillProficiencies: ["Furtividade", "Investigação", "Tecnologia", "Crime"],
      features: ["Expertise", "Ação Rápida", "Maestria", "Especialização"],
      pvBase: 16,
      pvPorNEX: 3,
      peBase: 3,
      pePorNEX: 3,
      sanBase: 16,
      sanPorNEX: 4,
    },
    {
      id: "ocultista",
      name: "Ocultista",
      icon: "🔮",
      desc: "Mestre dos rituais e do Outro Lado.",
      skillProficiencies: ["Ocultismo", "Vontade", "Religião"],
      features: ["Ritual", "Sentido do Além", "Proteção Mística", "Canal Paranormal"],
      pvBase: 12,
      pvPorNEX: 2,
      peBase: 4,
      pePorNEX: 4,
      sanBase: 20,
      sanPorNEX: 5,
    },
  ],

  origins: [
    { id: "nerd", name: "Nerd", skill: "Tecnologia", desc: "Conhecimento em tecnologia e cultura pop." },
    { id: "policial", name: "Policial", skill: "Armas de Fogo", desc: "Treinamento policial e autoridade legal." },
    { id: "militar", name: "Militar", skill: "Fortitude", desc: "Disciplina e resistência militar." },
    { id: "religioso", name: "Religioso", skill: "Religião", desc: "Fé e conexão com o sobrenatural." },
    { id: "universitario", name: "Universitário", skill: "Investigação", desc: "Educação formal e pensamento crítico." },
    { id: "street", name: "Street", skill: "Crime", desc: "Vivência nas ruas e sobrevivência urbana." },
    { id: "artista", name: "Artista", skill: "Artes", desc: "Expressão criativa e sensibilidade." },
    { id: "atletico", name: "Atlético", skill: "Atletismo", desc: "Corpo treinado e resistência física." },
    { id: "medico", name: "Médico", skill: "Medicina", desc: "Conhecimento médico e primeiros socorros." },
    { id: "hacker", name: "Hacker", skill: "Tecnologia", desc: "Especialista em sistemas e invasões." },
    { id: "atirador", name: "Atirador", skill: "Pontaria", desc: "Precisão e treinamento com armas de fogo." },
    { id: "lutador", name: "Lutador", skill: "Luta", desc: "Artes marciais e combate corpo a corpo." },
  ],

  skills: [
    { name: "Acrobacia", stat: "agi" },
    { name: "Artes", stat: "pre" },
    { name: "Atletismo", stat: "for" },
    { name: "Ciências", stat: "int" },
    { name: "Pilotagem", stat: "agi" },
    { name: "Crime", stat: "agi" },
    { name: "Diplomacia", stat: "pre" },
    { name: "Enganação", stat: "pre" },
    { name: "Fortitude", stat: "vig" },
    { name: "Furtividade", stat: "agi" },
    { name: "Iniciativa", stat: "agi" },
    { name: "Intimidação", stat: "pre" },
    { name: "Intuição", stat: "pre" },
    { name: "Investigação", stat: "int" },
    { name: "Luta", stat: "for" },
    { name: "Medicina", stat: "int" },
    { name: "Ocultismo", stat: "int" },
    { name: "Percepção", stat: "pre" },
    { name: "Pontaria", stat: "agi" },
    { name: "Reflexos", stat: "agi" },
    { name: "Religião", stat: "int" },
    { name: "Sobrevivência", stat: "int" },
    { name: "Tecnologia", stat: "int" },
    { name: "Vontade", stat: "pre" },
  ],

  trilhas: ["Sobrevivência", "Habilidades", "Poderes", "Rituais"],

  get nexValues() {
    const vals = [];
    for (let v = 0; v <= 95; v += 5) vals.push(v);
    vals.push(99);
    return vals;
  },

  nexLabel(level) {
    const vals = this.nexValues;
    return vals[level] !== undefined ? vals[level] + '%' : '0%';
  },

  calcDefesa: (stats) => 10 + Math.max(0, (stats.agi || 1) - 1),

  calcPV: (clsId, stats, nexLevel = 0) => {
    const cls = OP.classes.find(c => c.id === clsId);
    if (!cls) {
      console.warn(`⚠️ [OP] Classe "${clsId}" não encontrada! Usando fallback.`);
      return 12;
    }
    const vig = Math.max(0, (stats.vig || 1) - 1);
    const result = cls.pvBase + vig + nexLevel * (cls.pvPorNEX + vig);
    console.log(`📊 [OP] calcPV(${clsId}): base=${cls.pvBase}, vig=${vig}, nex=${nexLevel} → ${result}`);
    return result;
  },

  calcPE: (clsId, stats, nexLevel = 0) => {
    const cls = OP.classes.find(c => c.id === clsId);
    if (!cls) {
      console.warn(`⚠️ [OP] Classe "${clsId}" não encontrada! Usando fallback.`);
      return 3;
    }
    const pre = Math.max(0, (stats.pre || 1) - 1);
    const result = cls.peBase + pre + nexLevel * (cls.pePorNEX + pre);
    console.log(`📊 [OP] calcPE(${clsId}): base=${cls.peBase}, pre=${pre}, nex=${nexLevel} → ${result}`);
    return result;
  },

  calcSanidade: (clsId, nexLevel = 0) => {
    const cls = OP.classes.find(c => c.id === clsId);
    if (!cls) {
      console.warn(`⚠️ [OP] Classe "${clsId}" não encontrada! Usando fallback.`);
      return 12;
    }
    const result = cls.sanBase + nexLevel * cls.sanPorNEX;
    console.log(`📊 [OP] calcSanidade(${clsId}): base=${cls.sanBase}, nex=${nexLevel} → ${result}`);
    return result;
  },
};

window.OP = OP;
console.log('✅ [OP] Dados carregados!', OP);