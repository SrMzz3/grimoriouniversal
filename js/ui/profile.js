/* js/ui/profile.js — Perfil COMPLETO com molduras em SVG FODAS */

const ProfileScreen = (() => {

  // ============================================================
  // MOLDURAS EM SVG — ARTE DE VERDADE
  // ============================================================
  const FRAMES = [
    { id: 'none', label: 'Sem moldura', svg: '' },
    { 
      id: 'dragon', 
      label: 'Dragão Ancestral',
      svg: `<svg viewBox="0 0 200 200" style="position:absolute;inset:-12px;width:calc(100% + 24px);height:calc(100% + 24px);z-index:2;pointer-events:none;filter:drop-shadow(0 0 20px rgba(212,184,75,0.4));">
        <defs>
          <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#c8a84b;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#e8c96d;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8a6a20;stop-opacity:1" />
          </linearGradient>
          <filter id="dragonGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#c8a84b" flood-opacity="0.6"/>
          </filter>
        </defs>
        <!-- Corpo do dragão envolvendo -->
        <path d="M100 10 C60 10,30 30,20 60 C10 90,15 120,30 140 C45 160,70 175,100 180 C130 175,155 160,170 140 C185 120,190 90,180 60 C170 30,140 10,100 10 Z" 
              stroke="url(#dragonGrad)" stroke-width="4" fill="none" filter="url(#dragonGlow)" opacity="0.8"/>
        <!-- Escamas -->
        <path d="M100 10 C80 25,70 45,75 65 C80 85,95 95,110 95 C125 95,140 85,145 65 C150 45,140 25,120 10" 
              stroke="url(#dragonGrad)" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M60 35 C70 50,75 70,70 90 C65 110,55 130,50 145" 
              stroke="url(#dragonGrad)" stroke-width="2" fill="none" opacity="0.3"/>
        <path d="M140 35 C130 50,125 70,130 90 C135 110,145 130,150 145" 
              stroke="url(#dragonGrad)" stroke-width="2" fill="none" opacity="0.3"/>
        <!-- Cabeça do dragão -->
        <circle cx="100" cy="25" r="8" stroke="url(#dragonGrad)" stroke-width="2.5" fill="none"/>
        <circle cx="93" cy="22" r="1.5" fill="#c8a84b" opacity="0.7"/>
        <circle cx="107" cy="22" r="1.5" fill="#c8a84b" opacity="0.7"/>
        <path d="M97 28 C100 32,103 32,106 28" stroke="#c8a84b" stroke-width="1.5" fill="none" opacity="0.6"/>
        <!-- Asas -->
        <path d="M30 80 C15 65,10 45,25 35 C40 25,50 40,45 55" stroke="url(#dragonGrad)" stroke-width="2" fill="none" opacity="0.5"/>
        <path d="M170 80 C185 65,190 45,175 35 C160 25,150 40,155 55" stroke="url(#dragonGrad)" stroke-width="2" fill="none" opacity="0.5"/>
        <!-- Cauda -->
        <path d="M75 175 C65 185,55 190,50 185 C45 180,50 175,55 170" stroke="url(#dragonGrad)" stroke-width="2.5" fill="none" opacity="0.5"/>
        <path d="M125 175 C135 185,145 190,150 185 C155 180,150 175,145 170" stroke="url(#dragonGrad)" stroke-width="2.5" fill="none" opacity="0.5"/>
        <!-- Chamas -->
        <path d="M95 95 C90 85,85 75,88 65 C91 55,98 50,100 55" stroke="#ff6b35" stroke-width="1.5" fill="none" opacity="0.4"/>
        <path d="M105 95 C110 85,115 75,112 65 C109 55,102 50,100 55" stroke="#ff6b35" stroke-width="1.5" fill="none" opacity="0.4"/>
      </svg>`
    },
    { 
      id: 'dragon_skull', 
      label: 'Caveira com Corrente',
      svg: `<svg viewBox="0 0 200 200" style="position:absolute;inset:-8px;width:calc(100% + 16px);height:calc(100% + 16px);z-index:2;pointer-events:none;filter:drop-shadow(0 0 15px rgba(136,136,136,0.3));">
        <defs>
          <linearGradient id="skullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#888;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#aaa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#666;stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- Corrente -->
        <path d="M20 180 C40 175,60 180,80 175 C100 170,120 175,140 170 C160 165,170 170,180 165" 
              stroke="url(#skullGrad)" stroke-width="3" fill="none" stroke-dasharray="4,3" opacity="0.6"/>
        <path d="M25 175 C30 170,35 175,40 170" stroke="#888" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M50 173 C55 168,60 173,65 168" stroke="#888" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M85 175 C90 170,95 175,100 170" stroke="#888" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M120 172 C125 167,130 172,135 167" stroke="#888" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M155 170 C160 165,165 170,170 165" stroke="#888" stroke-width="2" fill="none" opacity="0.4"/>
        <!-- Caveira -->
        <circle cx="100" cy="95" r="45" stroke="url(#skullGrad)" stroke-width="3.5" fill="none" opacity="0.8"/>
        <!-- Olhos -->
        <circle cx="82" cy="90" r="10" stroke="url(#skullGrad)" stroke-width="2.5" fill="none" opacity="0.6"/>
        <circle cx="118" cy="90" r="10" stroke="url(#skullGrad)" stroke-width="2.5" fill="none" opacity="0.6"/>
        <circle cx="82" cy="90" r="4" fill="#333" opacity="0.5"/>
        <circle cx="118" cy="90" r="4" fill="#333" opacity="0.5"/>
        <!-- Nariz -->
        <path d="M94 102 L100 110 L106 102" stroke="url(#skullGrad)" stroke-width="2" fill="none" opacity="0.5"/>
        <!-- Dentes -->
        <path d="M88 118 L90 125 L92 118" stroke="url(#skullGrad)" stroke-width="1.5" fill="none" opacity="0.4"/>
        <path d="M96 118 L98 125 L100 118" stroke="url(#skullGrad)" stroke-width="1.5" fill="none" opacity="0.4"/>
        <path d="M104 118 L106 125 L108 118" stroke="url(#skullGrad)" stroke-width="1.5" fill="none" opacity="0.4"/>
        <path d="M112 118 L114 125 L116 118" stroke="url(#skullGrad)" stroke-width="1.5" fill="none" opacity="0.4"/>
        <!-- Rachaduras -->
        <path d="M70 70 L75 80 L72 90" stroke="#666" stroke-width="1" fill="none" opacity="0.3"/>
        <path d="M130 70 L125 80 L128 90" stroke="#666" stroke-width="1" fill="none" opacity="0.3"/>
        <path d="M100 60 L98 70 L102 75" stroke="#666" stroke-width="1" fill="none" opacity="0.3"/>
        <!-- Cruz na testa -->
        <line x1="95" y1="60" x2="105" y2="70" stroke="#888" stroke-width="1.5" opacity="0.3"/>
        <line x1="105" y1="60" x2="95" y2="70" stroke="#888" stroke-width="1.5" opacity="0.3"/>
      </svg>`
    },
    { 
      id: 'cyberpunk', 
      label: 'Cyberpunk 2077',
      svg: `<svg viewBox="0 0 200 200" style="position:absolute;inset:-10px;width:calc(100% + 20px);height:calc(100% + 20px);z-index:2;pointer-events:none;filter:drop-shadow(0 0 25px rgba(255,0,255,0.3));">
        <defs>
          <linearGradient id="cyberGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff00ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00ffff;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="cyberGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#00ffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff00ff;stop-opacity:1" />
          </linearGradient>
          <filter id="cyberGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ff00ff" flood-opacity="0.4"/>
          </filter>
        </defs>
        <!-- Hexágonos externos -->
        <polygon points="100,10 160,45 160,115 100,150 40,115 40,45" 
                 stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.4" filter="url(#cyberGlow)"/>
        <polygon points="100,25 150,55 150,105 100,135 50,105 50,55" 
                 stroke="url(#cyberGrad2)" stroke-width="1.5" fill="none" opacity="0.3"/>
        <!-- Ângulos cyberpunk -->
        <path d="M30 30 L60 30 L30 60 Z" stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.3"/>
        <path d="M170 30 L140 30 L170 60 Z" stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.3"/>
        <path d="M30 170 L60 170 L30 140 Z" stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.3"/>
        <path d="M170 170 L140 170 L170 140 Z" stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.3"/>
        <!-- Linhas de glitch -->
        <line x1="20" y1="50" x2="30" y2="50" stroke="#ff00ff" stroke-width="1.5" opacity="0.6"/>
        <line x1="20" y1="55" x2="28" y2="55" stroke="#00ffff" stroke-width="1" opacity="0.4"/>
        <line x1="170" y1="50" x2="180" y2="50" stroke="#00ffff" stroke-width="1.5" opacity="0.6"/>
        <line x1="170" y1="55" x2="178" y2="55" stroke="#ff00ff" stroke-width="1" opacity="0.4"/>
        <line x1="20" y1="150" x2="30" y2="150" stroke="#ff00ff" stroke-width="1.5" opacity="0.6"/>
        <line x1="170" y1="150" x2="180" y2="150" stroke="#00ffff" stroke-width="1.5" opacity="0.6"/>
        <!-- Pontos de dados -->
        <circle cx="55" cy="40" r="2" fill="#ff00ff" opacity="0.5"/>
        <circle cx="145" cy="40" r="2" fill="#00ffff" opacity="0.5"/>
        <circle cx="55" cy="160" r="2" fill="#ff00ff" opacity="0.5"/>
        <circle cx="145" cy="160" r="2" fill="#00ffff" opacity="0.5"/>
        <circle cx="100" cy="10" r="2" fill="#ff00ff" opacity="0.5"/>
        <circle cx="100" cy="190" r="2" fill="#00ffff" opacity="0.5"/>
        <!-- Texto "2077" -->
        <text x="90" y="185" font-family="monospace" font-size="10" fill="url(#cyberGrad1)" opacity="0.4" font-weight="bold">2077</text>
      </svg>`
    },
    { 
      id: 'cyber_glitch', 
      label: 'Glitch Neon',
      svg: `<svg viewBox="0 0 200 200" style="position:absolute;inset:-8px;width:calc(100% + 16px);height:calc(100% + 16px);z-index:2;pointer-events:none;filter:drop-shadow(0 0 20px rgba(0,255,255,0.3));">
        <defs>
          <filter id="glitchFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <!-- Retângulos glitch -->
        <rect x="30" y="25" width="140" height="150" stroke="#00ffff" stroke-width="2" fill="none" opacity="0.6"/>
        <rect x="25" y="30" width="150" height="140" stroke="#ff00ff" stroke-width="1.5" fill="none" opacity="0.4" 
              style="animation: glitchBorder 0.3s ease-in-out infinite"/>
        <!-- Linhas de scan -->
        <line x1="30" y1="50" x2="170" y2="50" stroke="#00ffff" stroke-width="0.5" opacity="0.3" 
              style="animation: scanline 2s linear infinite"/>
        <line x1="30" y1="80" x2="170" y2="80" stroke="#ff00ff" stroke-width="0.5" opacity="0.2" 
              style="animation: scanline 2.5s linear infinite"/>
        <line x1="30" y1="120" x2="170" y2="120" stroke="#00ffff" stroke-width="0.5" opacity="0.3" 
              style="animation: scanline 1.8s linear infinite"/>
        <!-- Código binário -->
        <text x="40" y="45" font-family="monospace" font-size="6" fill="#00ffff" opacity="0.3">01001010</text>
        <text x="40" y="55" font-family="monospace" font-size="6" fill="#ff00ff" opacity="0.2">11011011</text>
        <text x="40" y="65" font-family="monospace" font-size="6" fill="#00ffff" opacity="0.3">00100100</text>
        <text x="140" y="45" font-family="monospace" font-size="6" fill="#ff00ff" opacity="0.2">11101110</text>
        <text x="140" y="55" font-family="monospace" font-size="6" fill="#00ffff" opacity="0.3">00010001</text>
        <!-- Glitch squares -->
        <rect x="45" y="100" width="15" height="10" fill="#ff00ff" opacity="0.15" style="animation: glitchText 0.5s ease-in-out infinite"/>
        <rect x="140" y="130" width="12" height="8" fill="#00ffff" opacity="0.15" style="animation: glitchText 0.7s ease-in-out infinite"/>
        <rect x="60" y="150" width="10" height="12" fill="#ff00ff" opacity="0.1" style="animation: glitchText 0.4s ease-in-out infinite"/>
      </svg>`
    },
    { 
      id: 'void', 
      label: 'Vazio Estelar',
      svg: `<svg viewBox="0 0 200 200" style="position:absolute;inset:-12px;width:calc(100% + 24px);height:calc(100% + 24px);z-index:2;pointer-events:none;filter:drop-shadow(0 0 25px rgba(138,74,240,0.4));">
        <defs>
          <radialGradient id="voidGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#b89af0;stop-opacity:0.1" />
            <stop offset="70%" style="stop-color:#8a4af0;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#4a1a80;stop-opacity:0.6" />
          </radialGradient>
          <filter id="voidGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#8a4af0" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- Círculo externo -->
        <circle cx="100" cy="100" r="90" stroke="url(#voidGrad)" stroke-width="3" fill="none" opacity="0.6" filter="url(#voidGlow)"/>
        <circle cx="100" cy="100" r="75" stroke="#8a4af0" stroke-width="1.5" fill="none" opacity="0.3" stroke-dasharray="3,5"/>
        <!-- Estrelas -->
        <circle cx="40" cy="40" r="2" fill="#b89af0" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="160" cy="40" r="1.5" fill="#b89af0" opacity="0.5">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="160" r="1.5" fill="#b89af0" opacity="0.4">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="160" cy="160" r="2" fill="#b89af0" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="70" cy="25" r="1" fill="#b89af0" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="130" cy="175" r="1" fill="#b89af0" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="25" cy="100" r="1.5" fill="#b89af0" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="175" cy="100" r="1.5" fill="#b89af0" opacity="0.4">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.8s" repeatCount="indefinite"/>
        </circle>
        <!-- Nebulosa -->
        <ellipse cx="100" cy="100" rx="60" ry="40" fill="url(#voidGrad)" opacity="0.15" transform="rotate(45,100,100)"/>
        <ellipse cx="100" cy="100" rx="40" ry="60" fill="url(#voidGrad)" opacity="0.1" transform="rotate(-30,100,100)"/>
        <!-- Runas -->
        <text x="85" y="15" font-family="serif" font-size="12" fill="#8a4af0" opacity="0.3">ᚠ</text>
        <text x="170" y="105" font-family="serif" font-size="12" fill="#8a4af0" opacity="0.3">ᚢ</text>
        <text x="90" y="190" font-family="serif" font-size="12" fill="#8a4af0" opacity="0.3">ᚦ</text>
        <text x="15" y="95" font-family="serif" font-size="12" fill="#8a4af0" opacity="0.3">ᚨ</text>
      </svg>`
    },
    { 
      id: 'arcane', 
      label: 'Arcano Místico',
      svg: `<svg viewBox="0 0 200 200" style="position:absolute;inset:-10px;width:calc(100% + 20px);height:calc(100% + 20px);z-index:2;pointer-events:none;filter:drop-shadow(0 0 20px rgba(212,184,75,0.3));">
        <defs>
          <linearGradient id="arcaneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#c8a84b;stop-opacity:1" />
            <stop offset="33%" style="stop-color:#8a4af0;stop-opacity:1" />
            <stop offset="66%" style="stop-color:#00f0ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#c8a84b;stop-opacity:1" />
          </linearGradient>
          <filter id="arcaneGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#8a4af0" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- Círculo mágico -->
        <circle cx="100" cy="100" r="85" stroke="url(#arcaneGrad)" stroke-width="2.5" fill="none" filter="url(#arcaneGlow)" 
                style="animation: arcaneShift 3s linear infinite"/>
        <circle cx="100" cy="100" r="75" stroke="url(#arcaneGrad)" stroke-width="1.5" fill="none" opacity="0.5" stroke-dasharray="4,6"/>
        <circle cx="100" cy="100" r="65" stroke="url(#arcaneGrad)" stroke-width="1" fill="none" opacity="0.3" stroke-dasharray="2,8"/>
        <!-- Estrela de Davi -->
        <polygon points="100,30 80,80 50,80 70,105 60,155 100,135 140,155 130,105 150,80 120,80" 
                 stroke="url(#arcaneGrad)" stroke-width="1.5" fill="none" opacity="0.4" filter="url(#arcaneGlow)"/>
        <!-- Runas mágicas -->
        <text x="75" y="20" font-family="serif" font-size="10" fill="#c8a84b" opacity="0.5" filter="url(#arcaneGlow)">ᚨ</text>
        <text x="170" y="100" font-family="serif" font-size="10" fill="#8a4af0" opacity="0.5" filter="url(#arcaneGlow)">ᛗ</text>
        <text x="75" y="185" font-family="serif" font-size="10" fill="#00f0ff" opacity="0.5" filter="url(#arcaneGlow)">ᚱ</text>
        <text x="15" y="100" font-family="serif" font-size="10" fill="#c8a84b" opacity="0.5" filter="url(#arcaneGlow)">ᛞ</text>
        <text x="135" y="20" font-family="serif" font-size="10" fill="#00f0ff" opacity="0.4">ᛉ</text>
        <text x="170" y="175" font-family="serif" font-size="10" fill="#8a4af0" opacity="0.4">ᛊ</text>
        <text x="15" y="175" font-family="serif" font-size="10" fill="#c8a84b" opacity="0.4">ᛏ</text>
        <text x="135" y="185" font-family="serif" font-size="10" fill="#00f0ff" opacity="0.4">ᛒ</text>
        <!-- Partículas mágicas -->
        <circle cx="50" cy="50" r="2" fill="#c8a84b" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="50" r="2" fill="#8a4af0" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="50" cy="150" r="2" fill="#00f0ff" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="150" r="2" fill="#c8a84b" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.2s" repeatCount="indefinite"/>
        </circle>
      </svg>`
    },
    { 
      id: 'neon_storm', 
      label: 'Neon Storm',
      svg: `<svg viewBox="0 0 200 200" style="position:absolute;inset:-10px;width:calc(100% + 20px);height:calc(100% + 20px);z-index:2;pointer-events:none;filter:drop-shadow(0 0 20px rgba(255,0,102,0.3));">
        <defs>
          <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff0066;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#ffcc00;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#00ff66;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#0066ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff0066;stop-opacity:1" />
          </linearGradient>
          <filter id="neonGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ff0066" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- Contorno neon -->
        <rect x="20" y="20" width="160" height="160" rx="20" stroke="url(#neonGrad)" stroke-width="3" fill="none" 
              style="animation: neonShift 2s linear infinite" filter="url(#neonGlow)"/>
        <rect x="30" y="30" width="140" height="140" rx="15" stroke="url(#neonGrad)" stroke-width="1.5" fill="none" opacity="0.5"
              style="animation: neonShift 2s linear infinite"/>
        <!-- Raios neon -->
        <line x1="100" y1="10" x2="100" y2="30" stroke="#ff0066" stroke-width="2" opacity="0.4"/>
        <line x1="100" y1="170" x2="100" y2="190" stroke="#00ff66" stroke-width="2" opacity="0.4"/>
        <line x1="10" y1="100" x2="30" y2="100" stroke="#ffcc00" stroke-width="2" opacity="0.4"/>
        <line x1="170" y1="100" x2="190" y2="100" stroke="#0066ff" stroke-width="2" opacity="0.4"/>
        <!-- Cantos neon -->
        <path d="M30 35 L35 30 L40 35" stroke="#ff0066" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M160 35 L165 30 L170 35" stroke="#ffcc00" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M30 165 L35 170 L40 165" stroke="#00ff66" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M160 165 L165 170 L170 165" stroke="#0066ff" stroke-width="2" fill="none" opacity="0.6"/>
        <!-- Pontos neon -->
        <circle cx="50" cy="50" r="3" fill="#ff0066" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="50" r="3" fill="#ffcc00" opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="50" cy="150" r="3" fill="#00ff66" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="150" r="3" fill="#0066ff" opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.2s" repeatCount="indefinite"/>
        </circle>
      </svg>`
    },
    { 
      id: 'inferno', 
      label: 'Inferno',
      svg: `<svg viewBox="0 0 200 200" style="position:absolute;inset:-10px;width:calc(100% + 20px);height:calc(100% + 20px);z-index:2;pointer-events:none;filter:drop-shadow(0 0 25px rgba(176,32,32,0.4));">
        <defs>
          <linearGradient id="infernoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#b02020;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ff4500;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff6b35;stop-opacity:1" />
          </linearGradient>
          <filter id="infernoGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#ff4500" flood-opacity="0.4"/>
          </filter>
        </defs>
        <!-- Chamas externas -->
        <path d="M100 10 C80 20,70 40,60 60 C50 80,40 100,35 120 C30 140,35 155,40 165 C50 170,60 175,70 178" 
              stroke="url(#infernoGrad)" stroke-width="3" fill="none" opacity="0.6" filter="url(#infernoGlow)"/>
        <path d="M100 10 C120 20,130 40,140 60 C150 80,160 100,165 120 C170 140,165 155,160 165 C150 170,140 175,130 178" 
              stroke="url(#infernoGrad)" stroke-width="3" fill="none" opacity="0.6" filter="url(#infernoGlow)"/>
        <!-- Chamas internas -->
        <path d="M100 20 C85 35,75 55,70 75 C65 95,60 115,65 135 C70 150,80 160,90 165" 
              stroke="#ff4500" stroke-width="2" fill="none" opacity="0.4" filter="url(#infernoGlow)"/>
        <path d="M100 20 C115 35,125 55,130 75 C135 95,140 115,135 135 C130 150,120 160,110 165" 
              stroke="#ff4500" stroke-width="2" fill="none" opacity="0.4" filter="url(#infernoGlow)"/>
        <!-- Labaredas -->
        <path d="M80 40 C75 30,70 25,65 30 C60 35,65 45,70 50" stroke="#ff6b35" stroke-width="1.5" fill="none" opacity="0.3"/>
        <path d="M120 40 C125 30,130 25,135 30 C140 35,135 45,130 50" stroke="#ff6b35" stroke-width="1.5" fill="none" opacity="0.3"/>
        <path d="M90 25 C85 15,80 10,75 15 C70 20,75 30,80 35" stroke="#ff6b35" stroke-width="1.5" fill="none" opacity="0.2"/>
        <path d="M110 25 C115 15,120 10,125 15 C130 20,125 30,120 35" stroke="#ff6b35" stroke-width="1.5" fill="none" opacity="0.2"/>
        <!-- Brasas -->
        <circle cx="55" cy="100" r="2" fill="#ff4500" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="145" cy="100" r="2" fill="#ff4500" opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="70" cy="140" r="1.5" fill="#ff6b35" opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.5;0.1" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="130" cy="140" r="1.5" fill="#ff6b35" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.2s" repeatCount="indefinite"/>
        </circle>
      </svg>`
    },
    { 
      id: 'royal', 
      label: 'Coroa Real',
      svg: `<svg viewBox="0 0 200 200" style="position:absolute;inset:-12px;width:calc(100% + 24px);height:calc(100% + 24px);z-index:2;pointer-events:none;filter:drop-shadow(0 0 25px rgba(212,184,75,0.4));">
        <defs>
          <linearGradient id="royalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#c8a84b;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#e8c96d;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8a6a20;stop-opacity:1" />
          </linearGradient>
          <filter id="royalGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#c8a84b" flood-opacity="0.4"/>
          </filter>
        </defs>
        <!-- Coroa -->
        <path d="M30 100 L40 60 L60 70 L80 40 L100 55 L120 40 L140 70 L160 60 L170 100 L160 140 L140 150 L60 150 L40 140 L30 100 Z" 
              stroke="url(#royalGrad)" stroke-width="3" fill="none" filter="url(#royalGlow)" opacity="0.8"/>
        <!-- Detalhes da coroa -->
        <path d="M40 100 L45 80 L55 85 L65 70 L75 80 L85 65 L95 78 L100 70 L105 78 L115 65 L125 80 L135 70 L145 85 L155 80 L160 100" 
              stroke="url(#royalGrad)" stroke-width="1.5" fill="none" opacity="0.5"/>
        <!-- Joias -->
        <circle cx="100" cy="55" r="4" fill="#ff0066" opacity="0.6" filter="url(#royalGlow)"/>
        <circle cx="60" cy="70" r="3" fill="#00f0ff" opacity="0.5" filter="url(#royalGlow)"/>
        <circle cx="140" cy="70" r="3" fill="#00f0ff" opacity="0.5" filter="url(#royalGlow)"/>
        <circle cx="80" cy="40" r="2.5" fill="#b89af0" opacity="0.4"/>
        <circle cx="120" cy="40" r="2.5" fill="#b89af0" opacity="0.4"/>
        <!-- Base da coroa -->
        <path d="M40 140 L160 140" stroke="url(#royalGrad)" stroke-width="2" opacity="0.5"/>
        <path d="M50 150 L150 150" stroke="url(#royalGrad)" stroke-width="1.5" opacity="0.3"/>
        <!-- Ornamentos -->
        <circle cx="40" cy="100" r="3" fill="#c8a84b" opacity="0.4"/>
        <circle cx="160" cy="100" r="3" fill="#c8a84b" opacity="0.4"/>
        <circle cx="100" cy="145" r="2" fill="#c8a84b" opacity="0.3"/>
      </svg>`
    },
  ];

  function render() {
    const user = GrimorioStorage.getCurrentUser();
    if (!user) {
      const wrap = document.createElement('div');
      wrap.className = 'page';
      wrap.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px;">Nenhum usuário logado.</p>';
      return wrap;
    }

    if (!user.avatar) user.avatar = '';
    if (!user.frame) user.frame = 'none';
    if (!user.background) user.background = '';
    if (!user.bgBrightness) user.bgBrightness = 25;
    if (!user.bio) user.bio = '';
    if (!user.displayName) user.displayName = user.username;

    const isEditing = user._editing || false;

    const wrap = document.createElement('div');
    wrap.className = 'page screen-enter';
    wrap.style.maxWidth = '900px';
    wrap.style.margin = '0 auto';
    wrap.style.position = 'relative';
    wrap.style.zIndex = '10';

    // ── Fundo ──
    const bgDiv = document.createElement('div');
    bgDiv.className = 'profile-bg';
    bgDiv.style.position = 'fixed';
    bgDiv.style.inset = '0';
    bgDiv.style.zIndex = '0';
    bgDiv.style.pointerEvents = 'none';
    bgDiv.style.backgroundSize = 'cover';
    bgDiv.style.backgroundPosition = 'center';
    bgDiv.style.backgroundRepeat = 'no-repeat';
    bgDiv.style.transition = 'all 0.8s ease';
    bgDiv.id = 'profile-bg-layer';

    if (user.background && user.background.trim()) {
      bgDiv.style.backgroundImage = 'url(' + user.background.trim() + ')';
      bgDiv.style.opacity = (user.bgBrightness || 25) / 100;
    } else {
      bgDiv.style.background = 'var(--parch-s)';
      bgDiv.style.opacity = '1';
    }
    document.body.prepend(bgDiv);

    // ── Header ──
    const header = document.createElement('div');
    header.className = 'build-header fu';
    header.style.position = 'relative';
    header.style.zIndex = '10';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-ghost';
    backBtn.textContent = '← Voltar';
    backBtn.addEventListener('click', () => {
      Dice.sounds.page();
      const bg = document.querySelector('.profile-bg');
      if (bg) bg.remove();
      App.go('select');
    });
    
    const infoDiv = document.createElement('div');
    infoDiv.innerHTML = '<div class="build-title" style="color:var(--gold);">👤 Meu Perfil</div><div class="build-flavor">' + (isEditing ? 'Edite suas informações' : 'Visualize seu perfil') + '</div>';
    
    header.appendChild(backBtn);
    header.appendChild(infoDiv);
    wrap.appendChild(header);

    // ── Toggle ──
    const toggleBtn = document.createElement('button');
    toggleBtn.className = isEditing ? 'btn-gold' : 'btn-ghost';
    toggleBtn.style.position = 'relative';
    toggleBtn.style.zIndex = '10';
    toggleBtn.style.marginBottom = '16px';
    toggleBtn.textContent = isEditing ? '💾 Salvar e Visualizar' : '✏️ Editar Perfil';
    toggleBtn.addEventListener('click', function() {
      if (isEditing) {
        user._editing = false;
        GrimorioStorage.updateCurrentUser(user);
        Dice.sounds.magic();
      } else {
        user._editing = true;
        GrimorioStorage.updateCurrentUser(user);
        Dice.sounds.click();
      }
      const bg = document.querySelector('.profile-bg');
      if (bg) bg.remove();
      const app = document.getElementById('app');
      app.innerHTML = '';
      app.appendChild(ProfileScreen.render());
    });
    wrap.appendChild(toggleBtn);

    // ── Card principal ──
    const mainCard = document.createElement('div');
    mainCard.className = 'card';
    mainCard.style.position = 'relative';
    mainCard.style.zIndex = '10';
    mainCard.style.background = 'rgba(16,15,12,0.85)';
    mainCard.style.backdropFilter = 'blur(10px)';
    mainCard.style.border = '1px solid var(--border)';

    // ── Topo ──
    const profileTop = document.createElement('div');
    profileTop.style.display = 'flex';
    profileTop.style.alignItems = 'center';
    profileTop.style.gap = '30px';
    profileTop.style.flexWrap = 'wrap';
    profileTop.style.marginBottom = '20px';

    // ── Avatar com moldura SVG ──
    const avatarWrap = document.createElement('div');
    avatarWrap.style.position = 'relative';
    avatarWrap.style.width = '160px';
    avatarWrap.style.height = '160px';
    avatarWrap.style.flexShrink = '0';

    // Container da moldura
    const frameContainer = document.createElement('div');
    frameContainer.id = 'frame-container';
    frameContainer.style.width = '100%';
    frameContainer.style.height = '100%';
    frameContainer.style.borderRadius = '50%';
    frameContainer.style.transition = 'all 0.5s ease';
    frameContainer.style.position = 'relative';
    frameContainer.style.overflow = 'visible';

    // Imagem
    const avatarImg = document.createElement('img');
    avatarImg.id = 'profile-avatar';
    avatarImg.src = user.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%2328251c"/%3E%3Ctext x="50" y="120" font-size="80" fill="%23c8a84b"%3E👤%3C/text%3E%3C/svg%3E';
    avatarImg.alt = 'Avatar';
    avatarImg.style.width = '100%';
    avatarImg.style.height = '100%';
    avatarImg.style.objectFit = 'cover';
    avatarImg.style.borderRadius = '50%';
    avatarImg.style.background = 'var(--parch-3)';
    avatarImg.style.transition = 'all 0.5s ease';
    avatarImg.style.display = 'block';
    avatarImg.style.position = 'relative';
    avatarImg.style.zIndex = '1';
    frameContainer.appendChild(avatarImg);

    // SVG da moldura
    const svgContainer = document.createElement('div');
    svgContainer.id = 'frame-svg';
    svgContainer.style.position = 'absolute';
    svgContainer.style.inset = '0';
    svgContainer.style.width = '100%';
    svgContainer.style.height = '100%';
    svgContainer.style.zIndex = '2';
    svgContainer.style.pointerEvents = 'none';
    svgContainer.style.borderRadius = '50%';
    svgContainer.style.overflow = 'visible';
    frameContainer.appendChild(svgContainer);

    avatarWrap.appendChild(frameContainer);
    profileTop.appendChild(avatarWrap);

    // ── Info ──
    const userInfo = document.createElement('div');
    userInfo.style.flex = '1';

    if (isEditing) {
      userInfo.innerHTML = `
        <div style="margin-bottom:8px;">
          <label style="font-size:11px;color:var(--ink-faint);font-family:'Cinzel',serif;">Nome de Exibição</label>
          <input type="text" id="edit-displayname" value="${user.displayName || user.username}" style="width:100%;padding:6px 10px;background:var(--parch-2);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);font-size:16px;">
        </div>
        <div style="margin-bottom:8px;">
          <label style="font-size:11px;color:var(--ink-faint);font-family:'Cinzel',serif;">Bio</label>
          <textarea id="edit-bio" rows="2" style="width:100%;padding:6px 10px;background:var(--parch-2);border:1px solid var(--border);border-radius:var(--r);color:var(--ink);font-size:13px;resize:vertical;">${user.bio || ''}</textarea>
        </div>
        <div style="font-size:12px;color:var(--ink-faint);">ID: ${user.id?.slice(0,8) || '—'} · Membro desde ${new Date(user.createdAt || Date.now()).toLocaleDateString('pt-BR')}</div>
      `;
    } else {
      userInfo.innerHTML = `
        <div style="font-family:'Cinzel',serif;font-size:28px;font-weight:700;color:var(--gold);">${user.displayName || user.username}</div>
        <div style="font-size:14px;color:var(--ink-dim);margin-top:4px;">${user.bio || 'Aventureiro do Grimório Universal'}</div>
        <div style="font-size:12px;color:var(--ink-faint);margin-top:8px;">ID: ${user.id?.slice(0,8) || '—'} · Membro desde ${new Date(user.createdAt || Date.now()).toLocaleDateString('pt-BR')}</div>
        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
          <span style="background:var(--parch-3);padding:3px 14px;border-radius:12px;font-size:12px;border:1px solid var(--border);">${(user.characters || []).length} personagens</span>
          <span style="background:var(--parch-3);padding:3px 14px;border-radius:12px;font-size:12px;border:1px solid var(--border);">${(user.systems || []).length} sistemas</span>
        </div>
      `;
    }

    profileTop.appendChild(userInfo);
    mainCard.appendChild(profileTop);

    // ── Edição ──
    if (isEditing) {
      // Upload avatar
      const uploadSection = document.createElement('div');
      uploadSection.style.marginBottom = '16px';
      uploadSection.style.paddingBottom = '16px';
      uploadSection.style.borderBottom = '1px solid var(--border)';

      const uploadLabel = document.createElement('div');
      uploadLabel.style.fontSize = '12px';
      uploadLabel.style.color = 'var(--ink-faint)';
      uploadLabel.style.fontFamily = "'Cinzel',serif";
      uploadLabel.style.marginBottom = '8px';
      uploadLabel.textContent = '📷 Alterar Avatar';
      uploadSection.appendChild(uploadLabel);

      const uploadRow = document.createElement('div');
      uploadRow.style.display = 'flex';
      uploadRow.style.gap = '10px';
      uploadRow.style.flexWrap = 'wrap';

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml';
      fileInput.style.display = 'none';
      fileInput.id = 'avatar-upload';
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
          const dataUrl = ev.target.result;
          user.avatar = dataUrl;
          GrimorioStorage.updateCurrentUser(user);
          document.getElementById('profile-avatar').src = dataUrl;
          Dice.sounds.magic();
        };
        reader.readAsDataURL(file);
      });
      uploadRow.appendChild(fileInput);

      const uploadBtn = document.createElement('button');
      uploadBtn.className = 'btn-gold';
      uploadBtn.textContent = '📁 Upload de imagem';
      uploadBtn.addEventListener('click', () => document.getElementById('avatar-upload').click());
      uploadRow.appendChild(uploadBtn);

      const removeAvatarBtn = document.createElement('button');
      removeAvatarBtn.className = 'btn-ghost';
      removeAvatarBtn.textContent = '✕ Remover';
      removeAvatarBtn.style.color = 'var(--crimson)';
      removeAvatarBtn.addEventListener('click', function() {
        user.avatar = '';
        GrimorioStorage.updateCurrentUser(user);
        document.getElementById('profile-avatar').src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%2328251c"/%3E%3Ctext x="50" y="120" font-size="80" fill="%23c8a84b"%3E👤%3C/text%3E%3C/svg%3E';
        Dice.sounds.click();
      });
      uploadRow.appendChild(removeAvatarBtn);

      uploadSection.appendChild(uploadRow);
      mainCard.appendChild(uploadSection);

      // Molduras
      const frameSection = document.createElement('div');
      frameSection.style.marginBottom = '16px';
      frameSection.style.paddingBottom = '16px';
      frameSection.style.borderBottom = '1px solid var(--border)';
      
      const frameLabel = document.createElement('div');
      frameLabel.style.fontSize = '12px';
      frameLabel.style.color = 'var(--ink-faint)';
      frameLabel.style.fontFamily = "'Cinzel',serif";
      frameLabel.style.marginBottom = '8px';
      frameLabel.textContent = '🎨 Molduras de Avatar';
      frameSection.appendChild(frameLabel);

      const frameGrid = document.createElement('div');
      frameGrid.style.display = 'grid';
      frameGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(140px, 1fr))';
      frameGrid.style.gap = '6px';

      FRAMES.forEach(f => {
        const btn = document.createElement('button');
        btn.className = 'btn-ghost';
        btn.style.padding = '6px 10px';
        btn.style.fontSize = '10px';
        btn.style.borderRadius = 'var(--r)';
        btn.style.border = user.frame === f.id ? '2px solid var(--gold)' : '1px solid var(--border)';
        btn.style.background = user.frame === f.id ? 'rgba(212,184,75,0.1)' : 'transparent';
        btn.style.transition = 'all 0.3s ease';
        btn.textContent = f.label;
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '6px';

        // Preview da moldura
        const previewWrap = document.createElement('span');
        previewWrap.style.display = 'inline-block';
        previewWrap.style.width = '24px';
        previewWrap.style.height = '24px';
        previewWrap.style.borderRadius = '50%';
        previewWrap.style.position = 'relative';
        previewWrap.style.background = 'var(--parch-3)';
        previewWrap.style.border = '2px solid var(--border)';
        previewWrap.style.flexShrink = '0';
        previewWrap.style.overflow = 'hidden';

        if (f.svg) {
          const previewSvg = document.createElement('div');
          previewSvg.innerHTML = f.svg;
          previewSvg.style.position = 'absolute';
          previewSvg.style.inset = '-6px';
          previewSvg.style.width = 'calc(100% + 12px)';
          previewSvg.style.height = 'calc(100% + 12px)';
          previewSvg.style.transform = 'scale(0.4)';
          previewSvg.style.transformOrigin = 'center';
          previewWrap.appendChild(previewSvg);
        }

        btn.prepend(previewWrap);

        btn.addEventListener('click', function() {
          user.frame = f.id;
          GrimorioStorage.updateCurrentUser(user);
          applyFrame(f.id);
          frameGrid.querySelectorAll('button').forEach(b => {
            b.style.border = '1px solid var(--border)';
            b.style.background = 'transparent';
          });
          btn.style.border = '2px solid var(--gold)';
          btn.style.background = 'rgba(212,184,75,0.1)';
          Dice.sounds.click();
        });
        frameGrid.appendChild(btn);
      });

      frameSection.appendChild(frameGrid);
      mainCard.appendChild(frameSection);

      // Fundo
      const bgSection = document.createElement('div');
      bgSection.style.marginBottom = '16px';
      bgSection.style.paddingBottom = '16px';
      bgSection.style.borderBottom = '1px solid var(--border)';
      
      const bgLabel = document.createElement('div');
      bgLabel.style.fontSize = '12px';
      bgLabel.style.color = 'var(--ink-faint)';
      bgLabel.style.fontFamily = "'Cinzel',serif";
      bgLabel.style.marginBottom = '8px';
      bgLabel.textContent = '🖼️ Fundo do Perfil';
      bgSection.appendChild(bgLabel);

      const bgRow = document.createElement('div');
      bgRow.style.display = 'flex';
      bgRow.style.gap = '10px';
      bgRow.style.flexWrap = 'wrap';
      bgRow.style.alignItems = 'center';

      const bgInput = document.createElement('input');
      bgInput.type = 'text';
      bgInput.placeholder = 'URL da imagem (ou use upload)';
      bgInput.value = user.background || '';
      bgInput.style.flex = '1';
      bgInput.style.minWidth = '200px';
      bgInput.style.padding = '8px 12px';
      bgInput.style.background = 'var(--parch-2)';
      bgInput.style.border = '1px solid var(--border)';
      bgInput.style.borderRadius = 'var(--r)';
      bgInput.style.color = 'var(--ink)';
      bgInput.style.fontSize = '13px';
      bgInput.addEventListener('change', function() {
        user.background = bgInput.value.trim();
        GrimorioStorage.updateCurrentUser(user);
        applyBackground(user.background, user.bgBrightness || 25);
        Dice.sounds.click();
      });
      bgRow.appendChild(bgInput);

      const bgFileInput = document.createElement('input');
      bgFileInput.type = 'file';
      bgFileInput.accept = 'image/png,image/jpeg,image/gif,image/webp';
      bgFileInput.style.display = 'none';
      bgFileInput.id = 'bg-upload';
      bgFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
          const dataUrl = ev.target.result;
          user.background = dataUrl;
          GrimorioStorage.updateCurrentUser(user);
          applyBackground(dataUrl, user.bgBrightness || 25);
          bgInput.value = dataUrl;
          Dice.sounds.magic();
        };
        reader.readAsDataURL(file);
      });
      bgRow.appendChild(bgFileInput);

      const bgUploadBtn = document.createElement('button');
      bgUploadBtn.className = 'btn-ghost';
      bgUploadBtn.textContent = '📁 Upload';
      bgUploadBtn.addEventListener('click', function() {
        document.getElementById('bg-upload').click();
      });
      bgRow.appendChild(bgUploadBtn);

      const bgRemoveBtn = document.createElement('button');
      bgRemoveBtn.className = 'btn-ghost';
      bgRemoveBtn.textContent = '✕ Remover';
      bgRemoveBtn.style.color = 'var(--crimson)';
      bgRemoveBtn.addEventListener('click', function() {
        user.background = '';
        GrimorioStorage.updateCurrentUser(user);
        applyBackground('', user.bgBrightness || 25);
        bgInput.value = '';
        Dice.sounds.click();
      });
      bgRow.appendChild(bgRemoveBtn);

      bgSection.appendChild(bgRow);

      // Brilho
      const brightnessRow = document.createElement('div');
      brightnessRow.style.marginTop = '10px';
      brightnessRow.style.display = 'flex';
      brightnessRow.style.alignItems = 'center';
      brightnessRow.style.gap = '12px';

      const brightnessLabel = document.createElement('span');
      brightnessLabel.style.fontSize = '12px';
      brightnessLabel.style.color = 'var(--ink-faint)';
      brightnessLabel.textContent = '☀️ Brilho:';
      brightnessRow.appendChild(brightnessLabel);

      const brightnessInput = document.createElement('input');
      brightnessInput.type = 'range';
      brightnessInput.min = '5';
      brightnessInput.max = '80';
      brightnessInput.value = user.bgBrightness || 25;
      brightnessInput.style.flex = '1';
      brightnessInput.style.accentColor = 'var(--gold)';
      brightnessInput.addEventListener('input', function() {
        const val = parseInt(this.value);
        user.bgBrightness = val;
        GrimorioStorage.updateCurrentUser(user);
        applyBackground(user.background, val);
      });
      brightnessRow.appendChild(brightnessInput);

      const brightnessValue = document.createElement('span');
      brightnessValue.style.fontSize = '12px';
      brightnessValue.style.color = 'var(--ink-dim)';
      brightnessValue.textContent = (user.bgBrightness || 25) + '%';
      brightnessValue.id = 'brightness-value';
      brightnessInput.addEventListener('input', function() {
        brightnessValue.textContent = this.value + '%';
      });
      brightnessRow.appendChild(brightnessValue);

      bgSection.appendChild(brightnessRow);

      const bgPreview = document.createElement('div');
      bgPreview.style.marginTop = '10px';
      bgPreview.style.height = '60px';
      bgPreview.style.borderRadius = 'var(--r)';
      bgPreview.style.border = '1px solid var(--border)';
      bgPreview.style.background = user.background ? 'url(' + user.background + ') center/cover no-repeat' : 'var(--parch-3)';
      bgPreview.style.transition = 'all 0.5s ease';
      bgPreview.id = 'bg-preview';
      bgSection.appendChild(bgPreview);

      mainCard.appendChild(bgSection);

      // Recuperação
      const recoverySection = document.createElement('div');
      recoverySection.style.marginBottom = '16px';
      recoverySection.style.paddingBottom = '16px';
      recoverySection.style.borderBottom = '1px solid var(--border)';
      
      const recTitle = document.createElement('div');
      recTitle.style.fontSize = '12px';
      recTitle.style.color = 'var(--ink-faint)';
      recTitle.style.fontFamily = "'Cinzel',serif";
      recTitle.style.marginBottom = '8px';
      recTitle.textContent = '🔐 Recuperação de Conta';
      recoverySection.appendChild(recTitle);

      const recRow = document.createElement('div');
      recRow.style.display = 'flex';
      recRow.style.gap = '10px';
      recRow.style.flexWrap = 'wrap';
      recRow.style.alignItems = 'center';

      const recInput = document.createElement('input');
      recInput.type = 'text';
      recInput.placeholder = 'Palavra-chave de recuperação';
      recInput.value = user.recoveryKeyword || '';
      recInput.style.flex = '1';
      recInput.style.minWidth = '200px';
      recInput.style.padding = '8px 12px';
      recInput.style.background = 'var(--parch-2)';
      recInput.style.border = '1px solid var(--border)';
      recInput.style.borderRadius = 'var(--r)';
      recInput.style.color = 'var(--ink)';
      recInput.style.fontSize = '14px';

      const saveRecBtn = document.createElement('button');
      saveRecBtn.className = 'btn-gold';
      saveRecBtn.textContent = '💾 Salvar';
      saveRecBtn.style.padding = '8px 20px';
      saveRecBtn.addEventListener('click', function() {
        const keyword = recInput.value.trim();
        if (keyword.length < 3) {
          alert('A palavra-chave deve ter pelo menos 3 caracteres.');
          return;
        }
        user.recoveryKeyword = keyword;
        GrimorioStorage.updateCurrentUser(user);
        Dice.sounds.click();
        alert('✅ Palavra-chave salva!');
      });

      recRow.appendChild(recInput);
      recRow.appendChild(saveRecBtn);
      recoverySection.appendChild(recRow);

      const recHint = document.createElement('div');
      recHint.style.marginTop = '6px';
      recHint.style.fontSize = '12px';
      recHint.style.color = 'var(--ink-faint)';
      recHint.textContent = '💡 Use esta palavra para recuperar sua conta se esquecer a senha.';
      recoverySection.appendChild(recHint);

      mainCard.appendChild(recoverySection);

      // Zona de Perigo
      const dangerCard = document.createElement('div');
      dangerCard.className = 'card';
      dangerCard.style.marginTop = '16px';
      dangerCard.style.borderColor = 'var(--crimson)';
      dangerCard.style.background = 'rgba(16,15,12,0.85)';
      dangerCard.style.backdropFilter = 'blur(10px)';
      
      const dangerTitle = document.createElement('div');
      dangerTitle.className = 'card-title';
      dangerTitle.style.color = 'var(--crimson)';
      dangerTitle.textContent = '⚠️ Zona de Perigo';
      dangerCard.appendChild(dangerTitle);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-ghost';
      deleteBtn.style.borderColor = 'var(--crimson)';
      deleteBtn.style.color = 'var(--crimson)';
      deleteBtn.style.padding = '10px 20px';
      deleteBtn.textContent = '🗑️ Excluir conta permanentemente';
      deleteBtn.addEventListener('click', function() {
        if (confirm('⚠️ Tem certeza que deseja EXCLUIR PERMANENTEMENTE sua conta e todos os dados?\nEssa ação é IRREVERSÍVEL.')) {
          const userInput = prompt('Digite seu nome de usuário para confirmar:');
          if (userInput === user.username) {
            const users = JSON.parse(localStorage.getItem('grimorio_users') || '[]');
            const filtered = users.filter(u => u.id !== user.id);
            localStorage.setItem('grimorio_users', JSON.stringify(filtered));
            localStorage.removeItem('grimorio_session');
            const bg = document.querySelector('.profile-bg');
            if (bg) bg.remove();
            alert('Conta excluída.');
            location.reload();
          } else {
            alert('Nome incorreto. Exclusão cancelada.');
          }
        }
      });
      dangerCard.appendChild(deleteBtn);
      mainCard.appendChild(dangerCard);
    }

    // ── Estatísticas ──
    const statsCard = document.createElement('div');
    statsCard.style.marginTop = '16px';
    statsCard.className = 'card';
    statsCard.style.background = 'rgba(16,15,12,0.85)';
    statsCard.style.backdropFilter = 'blur(10px)';
    statsCard.style.border = '1px solid var(--border)';
    
    const statsTitle = document.createElement('div');
    statsTitle.className = 'card-title';
    statsTitle.textContent = '📊 Estatísticas';
    statsCard.appendChild(statsTitle);

    const statsGrid = document.createElement('div');
    statsGrid.style.display = 'grid';
    statsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';
    statsGrid.style.gap = '10px';

    const totalChars = (user.characters || []).length;
    const sysIds = (user.characters || []).map(c => c.sysId);
    const dndCount = sysIds.filter(s => s === 'dnd').length;
    const opCount = sysIds.filter(s => s === 'op').length;
    const customCount = sysIds.filter(s => s === 'custom').length;
    const totalSystems = (user.systems || []).length;

    const statsData = [
      { icon: '📄', label: 'Total Personagens', value: totalChars },
      { icon: '⚔️', label: 'D&D 5e', value: dndCount },
      { icon: '🌙', label: 'Ordem Paranormal', value: opCount },
      { icon: '✍️', label: 'Sistemas Próprios', value: customCount },
      { icon: '📚', label: 'Sistemas Criados', value: totalSystems },
    ];

    statsData.forEach(st => {
      const box = document.createElement('div');
      box.style.background = 'var(--parch-3)';
      box.style.border = '1px solid var(--border)';
      box.style.borderRadius = 'var(--r)';
      box.style.padding = '12px 8px';
      box.style.textAlign = 'center';
      box.innerHTML = `
        <div style="font-size:24px;">${st.icon}</div>
        <div style="font-size:28px;font-weight:700;color:var(--gold);">${st.value}</div>
        <div style="font-size:11px;color:var(--ink-faint);font-family:'Cinzel',serif;letter-spacing:.04em;">${st.label}</div>
      `;
      statsGrid.appendChild(box);
    });

    statsCard.appendChild(statsGrid);
    mainCard.appendChild(statsCard);

    wrap.appendChild(mainCard);

    // ── Funções ──
    function applyFrame(frameId) {
      const svgContainer = document.getElementById('frame-svg');
      if (!svgContainer) return;
      
      const frame = FRAMES.find(f => f.id === frameId);
      if (!frame || frameId === 'none') {
        svgContainer.innerHTML = '';
        svgContainer.style.filter = 'none';
        return;
      }
      
      svgContainer.innerHTML = frame.svg;
      svgContainer.style.filter = 'none';
    }

    function applyBackground(url, brightness) {
      const bg = document.querySelector('#profile-bg-layer');
      if (!bg) return;

      const preview = document.getElementById('bg-preview');
      if (preview) {
        if (url && url.trim()) {
          preview.style.background = 'url(' + url.trim() + ') center/cover no-repeat';
          preview.style.backgroundImage = 'url(' + url.trim() + ')';
        } else {
          preview.style.background = 'var(--parch-3)';
          preview.style.backgroundImage = 'none';
        }
      }

      if (url && url.trim()) {
        bg.style.backgroundImage = 'url(' + url.trim() + ')';
        bg.style.background = 'url(' + url.trim() + ') center/cover no-repeat';
        bg.style.opacity = (brightness || 25) / 100;
      } else {
        bg.style.background = 'var(--parch-s)';
        bg.style.backgroundImage = 'none';
        bg.style.opacity = '1';
      }
    }

    setTimeout(function() {
      applyFrame(user.frame || 'none');
      if (user.background) {
        applyBackground(user.background, user.bgBrightness || 25);
      }
    }, 100);

    return wrap;
  }

  return { render };
})();