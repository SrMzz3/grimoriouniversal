/* js/ui/select.js — Tela inicial COMPLETA com avatar e moldura em todo lugar */

const SelectScreen = (() => {

  // ============================================================
  // MOLDURAS EM SVG (versão miniatura para botões)
  // ============================================================
  function getFrameSvg(frameId, size = '100%') {
    const frames = {
      dragon: `<svg viewBox="0 0 200 200" style="width:${size};height:${size};">
        <defs>
          <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#c8a84b;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#e8c96d;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8a6a20;stop-opacity:1" />
          </linearGradient>
        </defs>
        <path d="M100 10 C60 10,30 30,20 60 C10 90,15 120,30 140 C45 160,70 175,100 180 C130 175,155 160,170 140 C185 120,190 90,180 60 C170 30,140 10,100 10 Z" 
              stroke="url(#dragonGrad)" stroke-width="4" fill="none" opacity="0.8"/>
        <circle cx="100" cy="25" r="8" stroke="url(#dragonGrad)" stroke-width="2.5" fill="none"/>
        <path d="M30 80 C15 65,10 45,25 35 C40 25,50 40,45 55" stroke="url(#dragonGrad)" stroke-width="2" fill="none" opacity="0.5"/>
        <path d="M170 80 C185 65,190 45,175 35 C160 25,150 40,155 55" stroke="url(#dragonGrad)" stroke-width="2" fill="none" opacity="0.5"/>
        <circle cx="93" cy="22" r="1.5" fill="#c8a84b" opacity="0.7"/>
        <circle cx="107" cy="22" r="1.5" fill="#c8a84b" opacity="0.7"/>
        <path d="M97 28 C100 32,103 32,106 28" stroke="#c8a84b" stroke-width="1.5" fill="none" opacity="0.6"/>
      </svg>`,
      dragon_skull: `<svg viewBox="0 0 200 200" style="width:${size};height:${size};">
        <defs>
          <linearGradient id="skullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#888;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#aaa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#666;stop-opacity:1" />
          </linearGradient>
        </defs>
        <path d="M20 180 C40 175,60 180,80 175 C100 170,120 175,140 170 C160 165,170 170,180 165" 
              stroke="url(#skullGrad)" stroke-width="3" fill="none" stroke-dasharray="4,3" opacity="0.6"/>
        <circle cx="100" cy="95" r="45" stroke="url(#skullGrad)" stroke-width="3.5" fill="none" opacity="0.8"/>
        <circle cx="82" cy="90" r="10" stroke="url(#skullGrad)" stroke-width="2.5" fill="none" opacity="0.6"/>
        <circle cx="118" cy="90" r="10" stroke="url(#skullGrad)" stroke-width="2.5" fill="none" opacity="0.6"/>
        <circle cx="82" cy="90" r="4" fill="#333" opacity="0.5"/>
        <circle cx="118" cy="90" r="4" fill="#333" opacity="0.5"/>
        <path d="M88 118 L90 125 L92 118" stroke="url(#skullGrad)" stroke-width="1.5" fill="none" opacity="0.4"/>
        <path d="M112 118 L114 125 L116 118" stroke="url(#skullGrad)" stroke-width="1.5" fill="none" opacity="0.4"/>
        <path d="M70 70 L75 80 L72 90" stroke="#666" stroke-width="1" fill="none" opacity="0.3"/>
        <path d="M130 70 L125 80 L128 90" stroke="#666" stroke-width="1" fill="none" opacity="0.3"/>
      </svg>`,
      cyberpunk: `<svg viewBox="0 0 200 200" style="width:${size};height:${size};">
        <defs>
          <linearGradient id="cyberGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff00ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00ffff;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="cyberGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#00ffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff00ff;stop-opacity:1" />
          </linearGradient>
        </defs>
        <polygon points="100,10 160,45 160,115 100,150 40,115 40,45" 
                 stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.6"/>
        <polygon points="100,25 150,55 150,105 100,135 50,105 50,55" 
                 stroke="url(#cyberGrad2)" stroke-width="1.5" fill="none" opacity="0.3"/>
        <path d="M30 30 L60 30 L30 60 Z" stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.3"/>
        <path d="M170 30 L140 30 L170 60 Z" stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.3"/>
        <path d="M30 170 L60 170 L30 140 Z" stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.3"/>
        <path d="M170 170 L140 170 L170 140 Z" stroke="url(#cyberGrad1)" stroke-width="2" fill="none" opacity="0.3"/>
        <line x1="20" y1="50" x2="30" y2="50" stroke="#ff00ff" stroke-width="1.5" opacity="0.6"/>
        <line x1="170" y1="50" x2="180" y2="50" stroke="#00ffff" stroke-width="1.5" opacity="0.6"/>
        <line x1="20" y1="150" x2="30" y2="150" stroke="#ff00ff" stroke-width="1.5" opacity="0.6"/>
        <line x1="170" y1="150" x2="180" y2="150" stroke="#00ffff" stroke-width="1.5" opacity="0.6"/>
        <circle cx="55" cy="40" r="2" fill="#ff00ff" opacity="0.5"/>
        <circle cx="145" cy="40" r="2" fill="#00ffff" opacity="0.5"/>
        <circle cx="55" cy="160" r="2" fill="#ff00ff" opacity="0.5"/>
        <circle cx="145" cy="160" r="2" fill="#00ffff" opacity="0.5"/>
        <text x="90" y="185" font-family="monospace" font-size="10" fill="url(#cyberGrad1)" opacity="0.4" font-weight="bold">2077</text>
      </svg>`,
      cyber_glitch: `<svg viewBox="0 0 200 200" style="width:${size};height:${size};">
        <rect x="30" y="25" width="140" height="150" stroke="#00ffff" stroke-width="2" fill="none" opacity="0.6"/>
        <rect x="25" y="30" width="150" height="140" stroke="#ff00ff" stroke-width="1.5" fill="none" opacity="0.4"/>
        <line x1="30" y1="50" x2="170" y2="50" stroke="#00ffff" stroke-width="0.5" opacity="0.3"/>
        <line x1="30" y1="80" x2="170" y2="80" stroke="#ff00ff" stroke-width="0.5" opacity="0.2"/>
        <line x1="30" y1="120" x2="170" y2="120" stroke="#00ffff" stroke-width="0.5" opacity="0.3"/>
        <text x="40" y="45" font-family="monospace" font-size="6" fill="#00ffff" opacity="0.3">01001010</text>
        <text x="140" y="45" font-family="monospace" font-size="6" fill="#ff00ff" opacity="0.2">11101110</text>
        <rect x="45" y="100" width="15" height="10" fill="#ff00ff" opacity="0.15"/>
        <rect x="140" y="130" width="12" height="8" fill="#00ffff" opacity="0.15"/>
      </svg>`,
      void: `<svg viewBox="0 0 200 200" style="width:${size};height:${size};">
        <defs>
          <radialGradient id="voidGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#b89af0;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#4a1a80;stop-opacity:0.6" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" stroke="url(#voidGrad)" stroke-width="3" fill="none" opacity="0.6"/>
        <circle cx="100" cy="100" r="75" stroke="#8a4af0" stroke-width="1.5" fill="none" opacity="0.3" stroke-dasharray="3,5"/>
        <circle cx="40" cy="40" r="2" fill="#b89af0" opacity="0.6"/>
        <circle cx="160" cy="40" r="1.5" fill="#b89af0" opacity="0.5"/>
        <circle cx="40" cy="160" r="1.5" fill="#b89af0" opacity="0.4"/>
        <circle cx="160" cy="160" r="2" fill="#b89af0" opacity="0.6"/>
        <circle cx="70" cy="25" r="1" fill="#b89af0" opacity="0.3"/>
        <circle cx="130" cy="175" r="1" fill="#b89af0" opacity="0.3"/>
        <circle cx="25" cy="100" r="1.5" fill="#b89af0" opacity="0.4"/>
        <circle cx="175" cy="100" r="1.5" fill="#b89af0" opacity="0.4"/>
        <ellipse cx="100" cy="100" rx="60" ry="40" fill="url(#voidGrad)" opacity="0.15" transform="rotate(45,100,100)"/>
        <text x="85" y="15" font-family="serif" font-size="12" fill="#8a4af0" opacity="0.3">ᚠ</text>
        <text x="170" y="105" font-family="serif" font-size="12" fill="#8a4af0" opacity="0.3">ᚢ</text>
        <text x="90" y="190" font-family="serif" font-size="12" fill="#8a4af0" opacity="0.3">ᚦ</text>
        <text x="15" y="95" font-family="serif" font-size="12" fill="#8a4af0" opacity="0.3">ᚨ</text>
      </svg>`,
      arcane: `<svg viewBox="0 0 200 200" style="width:${size};height:${size};">
        <defs>
          <linearGradient id="arcaneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#c8a84b;stop-opacity:1" />
            <stop offset="33%" style="stop-color:#8a4af0;stop-opacity:1" />
            <stop offset="66%" style="stop-color:#00f0ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#c8a84b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="85" stroke="url(#arcaneGrad)" stroke-width="2.5" fill="none"/>
        <circle cx="100" cy="100" r="75" stroke="url(#arcaneGrad)" stroke-width="1.5" fill="none" opacity="0.5" stroke-dasharray="4,6"/>
        <polygon points="100,30 80,80 50,80 70,105 60,155 100,135 140,155 130,105 150,80 120,80" 
                 stroke="url(#arcaneGrad)" stroke-width="1.5" fill="none" opacity="0.4"/>
        <text x="75" y="20" font-family="serif" font-size="10" fill="#c8a84b" opacity="0.5">ᚨ</text>
        <text x="170" y="100" font-family="serif" font-size="10" fill="#8a4af0" opacity="0.5">ᛗ</text>
        <text x="75" y="185" font-family="serif" font-size="10" fill="#00f0ff" opacity="0.5">ᚱ</text>
        <text x="15" y="100" font-family="serif" font-size="10" fill="#c8a84b" opacity="0.5">ᛞ</text>
        <circle cx="50" cy="50" r="2" fill="#c8a84b" opacity="0.3"/>
        <circle cx="150" cy="50" r="2" fill="#8a4af0" opacity="0.3"/>
        <circle cx="50" cy="150" r="2" fill="#00f0ff" opacity="0.3"/>
        <circle cx="150" cy="150" r="2" fill="#c8a84b" opacity="0.3"/>
      </svg>`,
      neon_storm: `<svg viewBox="0 0 200 200" style="width:${size};height:${size};">
        <defs>
          <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff0066;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#ffcc00;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#00ff66;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#0066ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff0066;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="160" height="160" rx="20" stroke="url(#neonGrad)" stroke-width="3" fill="none"/>
        <rect x="30" y="30" width="140" height="140" rx="15" stroke="url(#neonGrad)" stroke-width="1.5" fill="none" opacity="0.5"/>
        <line x1="100" y1="10" x2="100" y2="30" stroke="#ff0066" stroke-width="2" opacity="0.4"/>
        <line x1="100" y1="170" x2="100" y2="190" stroke="#00ff66" stroke-width="2" opacity="0.4"/>
        <line x1="10" y1="100" x2="30" y2="100" stroke="#ffcc00" stroke-width="2" opacity="0.4"/>
        <line x1="170" y1="100" x2="190" y2="100" stroke="#0066ff" stroke-width="2" opacity="0.4"/>
        <circle cx="50" cy="50" r="3" fill="#ff0066" opacity="0.4"/>
        <circle cx="150" cy="50" r="3" fill="#ffcc00" opacity="0.4"/>
        <circle cx="50" cy="150" r="3" fill="#00ff66" opacity="0.4"/>
        <circle cx="150" cy="150" r="3" fill="#0066ff" opacity="0.4"/>
        <path d="M30 35 L35 30 L40 35" stroke="#ff0066" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M160 35 L165 30 L170 35" stroke="#ffcc00" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M30 165 L35 170 L40 165" stroke="#00ff66" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M160 165 L165 170 L170 165" stroke="#0066ff" stroke-width="2" fill="none" opacity="0.6"/>
      </svg>`,
      inferno: `<svg viewBox="0 0 200 200" style="width:${size};height:${size};">
        <defs>
          <linearGradient id="infernoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#b02020;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ff4500;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff6b35;stop-opacity:1" />
          </linearGradient>
        </defs>
        <path d="M100 10 C80 20,70 40,60 60 C50 80,40 100,35 120 C30 140,35 155,40 165 C50 170,60 175,70 178" 
              stroke="url(#infernoGrad)" stroke-width="3" fill="none" opacity="0.6"/>
        <path d="M100 10 C120 20,130 40,140 60 C150 80,160 100,165 120 C170 140,165 155,160 165 C150 170,140 175,130 178" 
              stroke="url(#infernoGrad)" stroke-width="3" fill="none" opacity="0.6"/>
        <path d="M100 20 C85 35,75 55,70 75 C65 95,60 115,65 135 C70 150,80 160,90 165" 
              stroke="#ff4500" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M100 20 C115 35,125 55,130 75 C135 95,140 115,135 135 C130 150,120 160,110 165" 
              stroke="#ff4500" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M80 40 C75 30,70 25,65 30 C60 35,65 45,70 50" stroke="#ff6b35" stroke-width="1.5" fill="none" opacity="0.3"/>
        <path d="M120 40 C125 30,130 25,135 30 C140 35,135 45,130 50" stroke="#ff6b35" stroke-width="1.5" fill="none" opacity="0.3"/>
        <circle cx="55" cy="100" r="2" fill="#ff4500" opacity="0.4"/>
        <circle cx="145" cy="100" r="2" fill="#ff4500" opacity="0.4"/>
        <circle cx="70" cy="140" r="1.5" fill="#ff6b35" opacity="0.3"/>
        <circle cx="130" cy="140" r="1.5" fill="#ff6b35" opacity="0.3"/>
      </svg>`,
      royal: `<svg viewBox="0 0 200 200" style="width:${size};height:${size};">
        <defs>
          <linearGradient id="royalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#c8a84b;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#e8c96d;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8a6a20;stop-opacity:1" />
          </linearGradient>
        </defs>
        <path d="M30 100 L40 60 L60 70 L80 40 L100 55 L120 40 L140 70 L160 60 L170 100 L160 140 L140 150 L60 150 L40 140 L30 100 Z" 
              stroke="url(#royalGrad)" stroke-width="3" fill="none" opacity="0.8"/>
        <path d="M40 100 L45 80 L55 85 L65 70 L75 80 L85 65 L95 78 L100 70 L105 78 L115 65 L125 80 L135 70 L145 85 L155 80 L160 100" 
              stroke="url(#royalGrad)" stroke-width="1.5" fill="none" opacity="0.5"/>
        <circle cx="100" cy="55" r="4" fill="#ff0066" opacity="0.6"/>
        <circle cx="60" cy="70" r="3" fill="#00f0ff" opacity="0.5"/>
        <circle cx="140" cy="70" r="3" fill="#00f0ff" opacity="0.5"/>
        <circle cx="80" cy="40" r="2.5" fill="#b89af0" opacity="0.4"/>
        <circle cx="120" cy="40" r="2.5" fill="#b89af0" opacity="0.4"/>
        <path d="M40 140 L160 140" stroke="url(#royalGrad)" stroke-width="2" opacity="0.5"/>
        <path d="M50 150 L150 150" stroke="url(#royalGrad)" stroke-width="1.5" opacity="0.3"/>
        <circle cx="40" cy="100" r="3" fill="#c8a84b" opacity="0.4"/>
        <circle cx="160" cy="100" r="3" fill="#c8a84b" opacity="0.4"/>
      </svg>`,
    };
    return frames[frameId] || null;
  }

  // ── Função para criar avatar com moldura ──
  function createAvatarWithFrame(user, size = '40px') {
    const wrap = document.createElement('div');
    wrap.style.position = 'relative';
    wrap.style.width = size;
    wrap.style.height = size;
    wrap.style.flexShrink = '0';
    wrap.style.borderRadius = '50%';
    wrap.style.overflow = 'visible';

    const img = document.createElement('img');
    img.src = user.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%2328251c"/%3E%3Ctext x="50" y="120" font-size="80" fill="%23c8a84b"%3E👤%3C/text%3E%3C/svg%3E';
    img.alt = 'Avatar';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.style.background = 'var(--parch-3)';
    img.style.display = 'block';
    img.style.position = 'relative';
    img.style.zIndex = '1';
    wrap.appendChild(img);

    // Moldura
    if (user.frame && user.frame !== 'none') {
      const frameSvg = document.createElement('div');
      const svgSize = parseInt(size) + 8;
      frameSvg.style.position = 'absolute';
      frameSvg.style.inset = '-4px';
      frameSvg.style.width = 'calc(100% + 8px)';
      frameSvg.style.height = 'calc(100% + 8px)';
      frameSvg.style.zIndex = '2';
      frameSvg.style.pointerEvents = 'none';
      frameSvg.style.borderRadius = '50%';
      frameSvg.style.overflow = 'visible';
      const svgContent = getFrameSvg(user.frame);
      if (svgContent) {
        frameSvg.innerHTML = svgContent;
      }
      wrap.appendChild(frameSvg);
    }

    return wrap;
  }

  function render() {
    Particles.setSystem("default");
    Dice.sounds.page();

    const wrap = document.createElement('div');
    wrap.className = 'page screen-enter';

    // Usuário logado
    const session = JSON.parse(localStorage.getItem("grimorio_session"));

    if (session) {
      const users = JSON.parse(localStorage.getItem("grimorio_users") || "[]");
      const user = users.find(u => u.id === session.id) || session;

      const userBar = document.createElement('div');
      userBar.className = 'card';
      userBar.style.maxWidth = '900px';
      userBar.style.margin = '0 auto 18px auto';
      userBar.style.display = 'flex';
      userBar.style.justifyContent = 'space-between';
      userBar.style.alignItems = 'center';
      userBar.style.flexWrap = 'wrap';
      userBar.style.gap = '12px';
      userBar.style.padding = '12px 18px';

      // ── Lado esquerdo: Avatar + Nome ──
      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = '12px';

      const avatarEl = createAvatarWithFrame(user, '40px');
      left.appendChild(avatarEl);

      const nameSpan = document.createElement('span');
      nameSpan.style.fontWeight = '600';
      nameSpan.style.fontSize = '16px';
      nameSpan.textContent = user.displayName || user.username;
      left.appendChild(nameSpan);

      userBar.appendChild(left);

      // ── Lado direito: Botões ──
      const right = document.createElement('div');
      right.style.display = 'flex';
      right.style.gap = '8px';
      right.style.alignItems = 'center';

      // ── BOTÃO PERFIL COM AVATAR ──
      const profileBtn = document.createElement('button');
      profileBtn.className = 'btn-ghost';
      profileBtn.style.display = 'flex';
      profileBtn.style.alignItems = 'center';
      profileBtn.style.gap = '8px';
      profileBtn.style.padding = '4px 12px 4px 4px';
      profileBtn.style.borderRadius = 'var(--r-lg)';
      profileBtn.style.border = '1px solid var(--border)';
      profileBtn.style.background = 'var(--parch-3)';
      profileBtn.style.transition = 'all 0.3s ease';

      // Avatar pequeno no botão
      const btnAvatar = createAvatarWithFrame(user, '28px');
      profileBtn.appendChild(btnAvatar);

      const btnText = document.createElement('span');
      btnText.textContent = 'Perfil';
      btnText.style.fontSize = '13px';
      profileBtn.appendChild(btnText);

      profileBtn.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--gold-dim)';
        this.style.background = 'var(--parch-4)';
      });
      profileBtn.addEventListener('mouseleave', function() {
        this.style.borderColor = 'var(--border)';
        this.style.background = 'var(--parch-3)';
      });
      profileBtn.addEventListener('click', function() {
        Dice.sounds.page();
        App.go('profile');
      });
      right.appendChild(profileBtn);

      // ── Botão Sair ──
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn-ghost';
      logoutBtn.textContent = 'Sair';
      logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('grimorio_session');
        location.reload();
      });
      right.appendChild(logoutBtn);

      userBar.appendChild(right);
      wrap.appendChild(userBar);
    }

    // ── Hero ──
    const hero = document.createElement('div');
    hero.className = 'hero fu';

    const orn1 = document.createElement('div');
    orn1.className = 'ornament';
    orn1.textContent = '✦ ✦ ✦';
    hero.appendChild(orn1);

    const logoDiv = document.createElement('div');
    logoDiv.className = 'grimorio-logo';
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/logo.png';
    logoImg.alt = 'Grimório';
    logoImg.style.maxWidth = '220px';
    logoDiv.appendChild(logoImg);
    hero.appendChild(logoDiv);

    const h1 = document.createElement('h1');
    h1.textContent = 'Grimório Universal';
    hero.appendChild(h1);

    const sub = document.createElement('p');
    sub.className = 'subtitle';
    sub.textContent = 'Todo sistema conta uma história.';
    hero.appendChild(sub);

    const orn2 = document.createElement('div');
    orn2.className = 'ornament';
    orn2.style.marginTop = '16px';
    orn2.style.letterSpacing = '14px';
    orn2.textContent = '⁂';
    hero.appendChild(orn2);

    wrap.appendChild(hero);

    // ── Divider ──
    const div1 = document.createElement('div');
    div1.className = 'divider';
    const span1 = document.createElement('span');
    span1.textContent = 'Escolha o sistema';
    div1.appendChild(span1);
    wrap.appendChild(div1);

    // ── Grid de sistemas ──
    const grid = document.createElement('div');
    grid.className = 'sys-grid fu3';

    // D&D
    const dndCard = document.createElement('button');
    dndCard.className = 'sys-card dnd-card';
    dndCard.innerHTML = `
      <span class="sys-icon">⚔️</span>
      <div class="sys-name" style="color:var(--gold)">D&D 5e</div>
      <div class="sys-desc">Dungeons & Dragons — fantasia épica</div>
      <div class="sys-cta">Criar personagem →</div>
    `;
    dndCard.addEventListener('click', function() { App.go('build','dnd'); });
    grid.appendChild(dndCard);

    // Ordem
    const opCard = document.createElement('button');
    opCard.className = 'sys-card op-card';
    opCard.innerHTML = `
      <span class="sys-icon">🌙</span>
      <div class="sys-name" style="color:var(--op-cyan)">Ordem Paranormal</div>
      <div class="sys-desc">Horror paranormal investigativo</div>
      <div class="sys-cta">Criar agente →</div>
    `;
    opCard.addEventListener('click', function() { App.go('build','op'); });
    grid.appendChild(opCard);

    // Custom
    const customCard = document.createElement('button');
    customCard.className = 'sys-card custom-card';
    customCard.innerHTML = `
      <span class="sys-icon">✍️</span>
      <div class="sys-name">Sistema Próprio</div>
      <div class="sys-desc">Crie seu próprio RPG</div>
      <div class="sys-cta">Configurar →</div>
    `;
    customCard.addEventListener('click', function() { App.go('custom'); });
    grid.appendChild(customCard);

    // Biblioteca
    const commCard = document.createElement('button');
    commCard.className = 'sys-card';
    commCard.innerHTML = `
      <span class="sys-icon">📚</span>
      <div class="sys-name">Biblioteca da Comunidade</div>
      <div class="sys-desc">Sistemas compartilhados</div>
      <div class="sys-cta">Em breve</div>
    `;
    grid.appendChild(commCard);

    wrap.appendChild(grid);

    // ── Minhas fichas ──
    if (window.GrimorioStorage && GrimorioStorage.getCharacters) {
      const chars = GrimorioStorage.getCharacters();

      if (chars.length) {
        const div2 = document.createElement('div');
        div2.className = 'divider';
        const span2 = document.createElement('span');
        span2.textContent = 'Minhas Fichas';
        div2.appendChild(span2);
        wrap.appendChild(div2);

        const charGrid = document.createElement('div');
        charGrid.className = 'sys-grid';

        chars.forEach(function(char) {
          const card = document.createElement('div');
          card.className = 'sys-card';
          card.style.position = 'relative';

          let sysLabel = '✍️ Sistema Próprio';
          if (char.sysId === 'dnd') sysLabel = '⚔️ D&D 5e';
          else if (char.sysId === 'op') sysLabel = '🌙 Ordem Paranormal';

          const nameDiv = document.createElement('div');
          nameDiv.className = 'sys-name';
          nameDiv.textContent = char.name || 'Sem nome';
          card.appendChild(nameDiv);

          const descDiv = document.createElement('div');
          descDiv.className = 'sys-desc';
          descDiv.textContent = sysLabel;
          card.appendChild(descDiv);

          const actions = document.createElement('div');
          actions.style.marginTop = '12px';
          actions.style.display = 'flex';
          actions.style.gap = '8px';

          const openBtn = document.createElement('button');
          openBtn.className = 'btn-gold';
          openBtn.textContent = 'Abrir';
          openBtn.addEventListener('click', function() {
            App.setChar(char);
            App.go('sheet');
          });
          actions.appendChild(openBtn);

          const delBtn = document.createElement('button');
          delBtn.className = 'btn-del';
          delBtn.style.background = 'var(--parch-3)';
          delBtn.style.border = '1px solid var(--border)';
          delBtn.style.borderRadius = 'var(--r)';
          delBtn.style.padding = '6px 12px';
          delBtn.style.color = 'var(--ink-faint)';
          delBtn.style.fontSize = '13px';
          delBtn.textContent = '🗑️ Excluir';
          delBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('Tem certeza que deseja excluir "' + char.name + '"?')) {
              GrimorioStorage.deleteCharacter(char.id);
              charGrid.removeChild(card);
              if (charGrid.children.length === 0) {
                const dividers = wrap.querySelectorAll('.divider');
                if (dividers.length > 0) {
                  const lastDiv = dividers[dividers.length - 1];
                  if (lastDiv) lastDiv.remove();
                }
                charGrid.remove();
              }
              Dice.sounds.click();
            }
          });
          actions.appendChild(delBtn);

          card.appendChild(actions);
          charGrid.appendChild(card);
        });

        wrap.appendChild(charGrid);
      }
    }

    return wrap;
  }

  return { render };
})();