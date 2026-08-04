/* js/ui/particles.js — Partículas de luz e poeira luminosa */

const Particles = (() => {
  let canvas, ctx, particles = [], animId, sysId = null;

  const configs = {
    default: {
      count: 55,
      colors: ["rgba(200,168,75,","rgba(232,192,109,","rgba(255,220,120,"],
      minSize: 0.8, maxSize: 2.2,
      speed: 0.3, opacity: 0.5,
    },
    dnd: {
      count: 65,
      colors: ["rgba(200,168,75,","rgba(232,192,109,","rgba(180,140,60,","rgba(255,230,130,"],
      minSize: 0.8, maxSize: 2.5,
      speed: 0.28, opacity: 0.55,
    },
    op: {
      count: 70,
      colors: ["rgba(0,229,255,","rgba(0,180,200,","rgba(100,240,255,","rgba(180,255,255,"],
      minSize: 0.5, maxSize: 1.8,
      speed: 0.4, opacity: 0.45,
    },
    custom: {
      count: 50,
      colors: ["rgba(160,120,200,","rgba(200,160,240,","rgba(120,180,220,"],
      minSize: 0.6, maxSize: 2.0,
      speed: 0.3, opacity: 0.4,
    },
  };

  function createParticle(cfg) {
    const colorArr = cfg.colors;
    const color = colorArr[Math.floor(Math.random() * colorArr.length)];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize),
      speedX: (Math.random() - 0.5) * cfg.speed,
      speedY: -(0.1 + Math.random() * cfg.speed * 0.8),
      opacity: 0.1 + Math.random() * cfg.opacity,
      color,
      life: 0,
      maxLife: 200 + Math.random() * 400,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
    };
  }

  function init(system) {
    canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    sysId = system || "default";
    resize();
    window.addEventListener("resize", resize);

    const cfg = configs[sysId] || configs.default;
    particles = Array.from({length: cfg.count}, () => createParticle(cfg));
    if (animId) cancelAnimationFrame(animId);
    animate();
  }

  function resize() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animate() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cfg = configs[sysId] || configs.default;

    particles.forEach((p, i) => {
      p.life++;
      p.x += p.speedX;
      p.y += p.speedY;
      p.twinkle += p.twinkleSpeed;

      // Recriar partícula quando sai da tela ou morre
      if (p.y < -10 || p.life > p.maxLife || p.x < -10 || p.x > canvas.width + 10) {
        particles[i] = createParticle(cfg);
        particles[i].y = canvas.height + 5;
        return;
      }

      const fadeIn  = Math.min(1, p.life / 40);
      const fadeOut = Math.min(1, (p.maxLife - p.life) / 40);
      const twinkleOpacity = 0.7 + 0.3 * Math.sin(p.twinkle);
      const alpha = p.opacity * fadeIn * fadeOut * twinkleOpacity;

      // Glow suave
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      grad.addColorStop(0, p.color + alpha + ")");
      grad.addColorStop(1, p.color + "0)");
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Núcleo brilhante
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.min(1, alpha * 2) + ")";
      ctx.fill();
    });

    animId = requestAnimationFrame(animate);
  }

  function setSystem(system) {
    sysId = system || "default";
    const cfg = configs[sysId] || configs.default;
    // Transição suave — recriar metade das partículas
    setTimeout(() => {
      for (let i = 0; i < particles.length; i++) {
        if (Math.random() > 0.5) particles[i] = createParticle(cfg);
      }
    }, 200);
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener("resize", resize);
  }

  return { init, setSystem, destroy };
})();
