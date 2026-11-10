// ===== Partículas de fundo: cada anime tem seu efeito =====
const FX = (() => {
  const c = document.getElementById('fx');
  const ctx = c.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const R = (a, b) => a + Math.random() * (b - a);
  let W = 0, Hh = 0, parts = [], type = null, colors = ['#fff'], raf = 0;

  const CFG = {
    leaves:   { n: 26, up: false, init: (p) => { p.vy = R(.4, 1); p.vx = R(-.4, .4); p.s = R(6, 11); p.vr = R(-.03, .03); p.a = R(.4, .75); } },
    petals:   { n: 34, up: false, init: (p) => { p.vy = R(.3, .8); p.vx = R(-.5, .2); p.s = R(4, 8); p.vr = R(-.04, .04); p.a = R(.35, .7); } },
    bubbles:  { n: 30, up: true,  init: (p) => { p.vy = -R(.3, .9); p.vx = 0; p.s = R(3, 12); p.a = R(.15, .35); } },
    embers:   { n: 40, up: true,  init: (p) => { p.vy = -R(.4, 1.2); p.vx = R(-.3, .3); p.s = R(1, 2.6); p.a = R(.5, 1); } },
    ash:      { n: 45, up: false, init: (p) => { p.vy = R(.15, .5); p.vx = R(-.3, .3); p.s = R(.8, 2.2); p.a = R(.15, .4); } },
    orbs:     { n: 14, up: true,  init: (p) => { p.vy = -R(.1, .35); p.vx = R(-.2, .2); p.s = R(30, 90); p.a = R(.08, .18); } },
    rain:     { n: 70, up: false, init: (p) => { p.vy = R(7, 12); p.vx = -1.2; p.s = R(10, 22); p.a = R(.08, .2); } },
    sparkles: { n: 32, up: true,  init: (p) => { p.vy = -R(.05, .25); p.vx = R(-.1, .1); p.s = R(2, 5); p.a = R(.4, .9); } },
    notes:    { n: 18, up: true,  init: (p) => { p.vy = -R(.3, .7); p.vx = R(-.2, .2); p.s = R(14, 24); p.vr = R(-.01, .01); p.a = R(.25, .5); p.ch = '♪♫♬'[Math.random() * 3 | 0]; } },
  };

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; Hh = innerHeight;
    c.width = W * dpr; c.height = Hh * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(p, initial) {
    const cfg = CFG[type];
    p.x = R(0, W); p.y = initial ? R(0, Hh) : cfg.up ? Hh + 40 : -40;
    p.c = colors[Math.random() * colors.length | 0];
    p.t = R(0, 1000); p.rot = R(0, 6.28); p.vr = 0;
    cfg.init(p);
    return p;
  }

  function draw(p) {
    ctx.globalAlpha = p.a;
    ctx.fillStyle = ctx.strokeStyle = p.c;
    switch (type) {
      case 'leaves':
      case 'petals':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.beginPath();
        if (type === 'leaves') ctx.ellipse(0, 0, p.s, p.s * .45, 0, 0, 6.28);
        else { ctx.moveTo(0, -p.s); ctx.quadraticCurveTo(p.s, 0, 0, p.s); ctx.quadraticCurveTo(-p.s, 0, 0, -p.s); }
        ctx.fill(); ctx.restore(); break;
      case 'bubbles':
        ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.28); ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x - p.s * .35, p.y - p.s * .35, p.s * .2, 0, 6.28); ctx.fill(); break;
      case 'embers':
        ctx.globalAlpha = p.a * (.6 + .4 * Math.sin(p.t * .1));
        ctx.shadowBlur = 12; ctx.shadowColor = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0; break;
      case 'ash':
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.28); ctx.fill(); break;
      case 'orbs': {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s);
        g.addColorStop(0, p.c); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.28); ctx.fill(); break;
      }
      case 'rain':
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 2, p.y + p.s); ctx.stroke(); break;
      case 'sparkles': {
        ctx.globalAlpha = p.a * (.5 + .5 * Math.sin(p.t * .05));
        const s = p.s; ctx.beginPath();
        ctx.moveTo(p.x, p.y - s * 2); ctx.quadraticCurveTo(p.x, p.y, p.x + s * 2, p.y);
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s * 2); ctx.quadraticCurveTo(p.x, p.y, p.x - s * 2, p.y);
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s * 2); ctx.fill(); break;
      }
      case 'notes':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.font = `${p.s}px sans-serif`; ctx.fillText(p.ch, 0, 0); ctx.restore(); break;
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, Hh);
    const sway = type === 'rain' ? 0 : .35;
    for (const p of parts) {
      p.t++;
      p.x += p.vx + Math.sin(p.t * .02) * sway;
      p.y += p.vy; p.rot += p.vr;
      if (p.y > Hh + 60 || p.y < -100 || p.x < -100 || p.x > W + 100) spawn(p, false);
      draw(p);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  }

  addEventListener('resize', resize);
  resize();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (type && !raf && !reduce) raf = requestAnimationFrame(tick);
  });

  return {
    set(t, cols) {
      if (t === type && String(cols) === String(colors)) return;
      type = t; colors = cols;
      cancelAnimationFrame(raf); raf = 0;
      ctx.clearRect(0, 0, W, Hh);
      parts = [];
      if (!t || reduce || !CFG[t]) return;
      const n = Math.round(CFG[t].n * (W < 700 ? .55 : 1));
      for (let i = 0; i < n; i++) parts.push(spawn({}, true));
      raf = requestAnimationFrame(tick);
    },
  };
})();
