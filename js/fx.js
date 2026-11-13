// ===== Partículas de fundo: cada anime tem seu efeito (ou uma mistura deles) =====
const FX = (() => {
  const c = document.getElementById('fx');
  const ctx = c.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const R = (a, b) => a + Math.random() * (b - a);
  let W = 0, Hh = 0, parts = [], key = '', colors = ['#fff'], raf = 0;

  // n: quantidade; up: nasce embaixo e sobe; sway: balanço lateral; color: cor fixa
  const CFG = {
    leaves:     { n: 26, init: (p) => { p.vy = R(.4, 1); p.vx = R(-.4, .4); p.s = R(6, 11); p.vr = R(-.03, .03); p.a = R(.4, .75); } },
    petals:     { n: 34, init: (p) => { p.vy = R(.3, .8); p.vx = R(-.5, .2); p.s = R(4, 8); p.vr = R(-.04, .04); p.a = R(.35, .7); } },
    bubbles:    { n: 30, up: true, init: (p) => { p.vy = -R(.3, .9); p.vx = 0; p.s = R(3, 12); p.a = R(.15, .35); } },
    embers:     { n: 40, up: true, init: (p) => { p.vy = -R(.4, 1.2); p.vx = R(-.3, .3); p.s = R(1, 2.6); p.a = R(.5, 1); } },
    ash:        { n: 45, init: (p) => { p.vy = R(.15, .5); p.vx = R(-.3, .3); p.s = R(.8, 2.2); p.a = R(.15, .4); } },
    orbs:       { n: 14, up: true, init: (p) => { p.vy = -R(.1, .35); p.vx = R(-.2, .2); p.s = R(30, 90); p.a = R(.08, .18); } },
    rain:       { n: 70, sway: 0, init: (p) => { p.vy = R(7, 12); p.vx = -1.2; p.s = R(10, 22); p.a = R(.08, .2); } },
    sparkles:   { n: 32, up: true, init: (p) => { p.vy = -R(.05, .25); p.vx = R(-.1, .1); p.s = R(2, 5); p.a = R(.4, .9); } },
    notes:      { n: 18, up: true, init: (p) => { p.vy = -R(.3, .7); p.vx = R(-.2, .2); p.s = R(14, 24); p.vr = R(-.01, .01); p.a = R(.25, .5); p.ch = '♪♫♬'[Math.random() * 3 | 0]; } },
    // Novos
    shuriken:   { n: 7, sway: 0, color: '#b9c0cc', init: (p) => { p.vy = R(1.2, 2.4); p.vx = R(-1.6, 1.6); p.s = R(7, 12); p.vr = R(.15, .3) * (Math.random() < .5 ? -1 : 1); p.a = R(.35, .6); } },
    butterflies:{ n: 9, sway: .9, init: (p) => { p.vy = R(-.5, .5); p.vx = R(-.8, .8); p.s = R(6, 10); p.a = R(.45, .8); } },
    feathers:   { n: 10, sway: 1.1, color: '#f4efe4', init: (p) => { p.vy = R(.3, .7); p.vx = R(-.3, .3); p.s = R(10, 18); p.vr = 0; p.a = R(.25, .5); } },
    pages:      { n: 8, sway: .8, color: '#e8e6e3', init: (p) => { p.vy = R(.3, .7); p.vx = R(-.4, .4); p.s = R(10, 16); p.vr = R(-.015, .015); p.a = R(.12, .25); } },
    peanuts:    { n: 10, color: '#d9a35f', init: (p) => { p.vy = R(.4, .9); p.vx = R(-.3, .3); p.s = R(5, 8); p.vr = R(-.03, .03); p.a = R(.5, .8); } },
    sparks:     { n: 22, sway: 0, init: (p) => { p.vy = R(3, 6); p.vx = R(-4, 4); p.s = R(6, 14); p.a = R(.5, 1); } },
    runes:      { n: 8, up: true, init: (p) => { p.vy = -R(.2, .5); p.vx = R(-.2, .2); p.s = R(8, 16); p.vr = R(-.01, .01); p.a = R(.2, .4); } },
    lanterns:   { n: 9, up: true, sway: .5, color: '#ff6b3d', init: (p) => { p.vy = -R(.25, .55); p.vx = R(-.15, .15); p.s = R(7, 14); p.a = R(.45, .8); } },
    herbs:      { n: 14, sway: .7, palette: ['#5f8f4a', '#7aa35a', '#8fb36a', '#9a8a4a'], init: (p) => { p.vy = R(.3, .8); p.vx = R(-.4, .4); p.s = R(6, 10); p.vr = R(-.03, .03); p.a = R(.45, .75); } },
    clovers:    { n: 12, palette: ['#3fbf6a', '#2e9a52', '#d4af37'], init: (p) => { p.vy = R(.3, .8); p.vx = R(-.3, .3); p.s = R(5, 9); p.vr = R(-.03, .03); p.a = R(.45, .8); } },
    cards:      { n: 9, sway: .6, color: '#f4f1ea', init: (p) => { p.vy = R(.5, 1.1); p.vx = R(-.5, .5); p.s = R(9, 14); p.vr = R(-.04, .04); p.a = R(.5, .8); p.ch = '♠♥♦♣'[Math.random() * 4 | 0]; } },
    pixels:     { n: 30, up: true, sway: .1, init: (p) => { p.vy = -R(.3, .9); p.vx = 0; p.s = R(2, 6); p.a = R(.25, .7); } },
    comets:     { n: 3, sway: 0, color: '#ffffff', init: (p) => { p.vy = R(3, 5); p.vx = -R(4, 7); p.s = R(40, 90); p.a = R(.5, .9); p.x = R(W * .3, W + 200); p.y = R(-200, Hh * .3); } },
    questions:  { n: 10, up: true, init: (p) => { p.vy = -R(.2, .5); p.vx = R(-.2, .2); p.s = R(16, 30); p.vr = R(-.01, .01); p.a = R(.15, .35); p.ch = '?'; } },
    menacing:   { n: 10, up: true, sway: .2, init: (p) => { p.vy = -R(.3, .6); p.vx = R(-.1, .1); p.s = R(18, 34); p.vr = 0; p.rot = R(-.3, .3); p.a = R(.25, .5); p.ch = Math.random() < .7 ? 'ゴ' : 'ド'; } },
    shuttles:   { n: 7, sway: .4, color: '#ffffff', init: (p) => { p.vy = R(.6, 1.2); p.vx = R(-.6, .6); p.s = R(8, 12); p.vr = R(-.05, .05); p.a = R(.6, .9); } },
    flowers:    { n: 16, init: (p) => { p.vy = R(.3, .7); p.vx = R(-.4, .3); p.s = R(3, 5); p.vr = R(-.03, .03); p.a = R(.45, .8); } },
  };

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; Hh = innerHeight;
    c.width = W * dpr; c.height = Hh * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(p, initial) {
    const cfg = CFG[p.k];
    p.x = R(0, W); p.y = initial ? R(0, Hh) : cfg.up ? Hh + 40 : -40;
    if (!initial && p.k === 'butterflies') { p.x = Math.random() < .5 ? -30 : W + 30; p.y = R(0, Hh); }
    const pal = cfg.palette || (cfg.color ? [cfg.color] : colors);
    p.c = pal[Math.random() * pal.length | 0];
    p.t = R(0, 1000); p.rot = R(0, 6.28); p.vr = 0;
    cfg.init(p);
    return p;
  }

  function star4(s, inner) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4, r = i % 2 ? s * inner : s;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
  }

  function draw(p) {
    ctx.globalAlpha = p.a;
    ctx.fillStyle = ctx.strokeStyle = p.c;
    switch (p.k) {
      case 'leaves':
      case 'petals':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.beginPath();
        if (p.k === 'leaves') ctx.ellipse(0, 0, p.s, p.s * .45, 0, 0, 6.28);
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
      case 'shuriken':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        star4(p.s, .3); ctx.fill();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(0, 0, p.s * .14, 0, 6.28); ctx.fill();
        ctx.restore(); break;
      case 'butterflies': {
        const flap = Math.abs(Math.sin(p.t * .18)) * .85 + .15;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx) + Math.PI / 2);
        ctx.scale(flap, 1);
        ctx.beginPath();
        ctx.ellipse(-p.s * .6, -p.s * .3, p.s * .65, p.s * .45, -.5, 0, 6.28);
        ctx.ellipse(p.s * .6, -p.s * .3, p.s * .65, p.s * .45, .5, 0, 6.28);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-p.s * .4, p.s * .35, p.s * .4, p.s * .3, .4, 0, 6.28);
        ctx.ellipse(p.s * .4, p.s * .35, p.s * .4, p.s * .3, -.4, 0, 6.28);
        ctx.fill(); ctx.restore();
        // muda de direção devagar
        if (Math.random() < .01) { p.vx = R(-.8, .8); p.vy = R(-.5, .5); }
        break;
      }
      case 'feathers':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.t * .03) * .7);
        ctx.beginPath(); ctx.moveTo(0, -p.s);
        ctx.quadraticCurveTo(p.s * .45, 0, 0, p.s); ctx.quadraticCurveTo(-p.s * .45, 0, 0, -p.s); ctx.fill();
        ctx.globalAlpha = p.a * 1.4; ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,.35)';
        ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.lineTo(0, p.s * 1.3); ctx.stroke(); ctx.restore(); break;
      case 'pages':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.scale(1, .55 + .45 * Math.cos(p.t * .02));
        ctx.fillRect(-p.s * .75, -p.s, p.s * 1.5, p.s * 2);
        ctx.globalAlpha = p.a * 1.5; ctx.fillStyle = 'rgba(0,0,0,.6)';
        for (let i = -2; i <= 2; i++) ctx.fillRect(-p.s * .55, i * p.s * .32, p.s * 1.1, 1);
        ctx.restore(); break;
      case 'peanuts':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.beginPath(); ctx.ellipse(0, -p.s * .55, p.s * .62, p.s * .7, 0, 0, 6.28); ctx.ellipse(0, p.s * .55, p.s * .66, p.s * .72, 0, 0, 6.28); ctx.fill();
        ctx.restore(); break;
      case 'sparks':
        ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.shadowBlur = 8; ctx.shadowColor = p.c;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * p.s * .25, p.y - p.vy * p.s * .25); ctx.stroke();
        ctx.shadowBlur = 0; break;
      case 'runes':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3; ctx.lineTo(Math.cos(a) * p.s, Math.sin(a) * p.s); }
        ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, p.s * .35, 0, 6.28); ctx.stroke(); ctx.restore(); break;
      case 'lanterns': {
        const s = p.s;
        ctx.globalAlpha = p.a * (.75 + .25 * Math.sin(p.t * .07));
        ctx.shadowBlur = 22; ctx.shadowColor = '#ffb347';
        ctx.beginPath(); ctx.ellipse(p.x, p.y, s * .7, s, 0, 0, 6.28); ctx.fill();
        ctx.shadowBlur = 0; ctx.fillStyle = '#ffd27a';
        ctx.beginPath(); ctx.ellipse(p.x, p.y + s * .1, s * .3, s * .55, 0, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#5a1c14'; ctx.fillRect(p.x - s * .45, p.y - s * 1.05, s * .9, s * .2); ctx.fillRect(p.x - s * .45, p.y + s * .88, s * .9, s * .2);
        break;
      }
      case 'herbs':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.bezierCurveTo(p.s * .8, -p.s * .5, p.s * .8, p.s * .5, 0, p.s);
        ctx.bezierCurveTo(-p.s * .8, p.s * .5, -p.s * .8, -p.s * .5, 0, -p.s); ctx.fill();
        ctx.strokeStyle = 'rgba(30,50,25,.55)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.lineTo(0, p.s * 1.25);
        for (let i = -1; i <= 1; i++) { ctx.moveTo(0, i * p.s * .4); ctx.lineTo(p.s * .4, i * p.s * .4 - p.s * .25); ctx.moveTo(0, i * p.s * .4); ctx.lineTo(-p.s * .4, i * p.s * .4 - p.s * .25); }
        ctx.stroke(); ctx.restore(); break;
      case 'clovers':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-p.s * .9, -p.s * .5, -p.s * .7, -p.s * 1.3, 0, -p.s * .95); ctx.bezierCurveTo(p.s * .7, -p.s * 1.3, p.s * .9, -p.s * .5, 0, 0); ctx.fill(); }
        ctx.restore(); break;
      case 'cards':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(Math.cos(p.t * .03), 1);
        ctx.fillRect(-p.s * .7, -p.s, p.s * 1.4, p.s * 2);
        ctx.fillStyle = p.ch === '♥' || p.ch === '♦' ? '#d1253f' : '#1b1b1b';
        ctx.font = `${p.s}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.ch, 0, 1);
        ctx.restore(); break;
      case 'pixels':
        ctx.globalAlpha = p.a * (.5 + .5 * Math.sin(p.t * .08));
        ctx.fillRect(p.x, p.y, p.s, p.s); ctx.strokeRect(p.x - 2, p.y - 2, p.s + 4, p.s + 4); break;
      case 'comets': {
        const g = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * p.s * .25, p.y - p.vy * p.s * .25);
        g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * p.s * .25, p.y - p.vy * p.s * .25); ctx.stroke(); break;
      }
      case 'questions':
      case 'menacing':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.font = `900 ${p.s}px ${p.k === 'menacing' ? "'Dela Gothic One', sans-serif" : "'Special Elite', serif"}`;
        if (p.k === 'menacing') { ctx.lineWidth = 3; ctx.strokeStyle = '#000'; ctx.strokeText(p.ch, 0, 0); }
        ctx.fillText(p.ch, 0, 0); ctx.restore(); break;
      case 'shuttles':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.beginPath(); ctx.moveTo(-p.s * .6, -p.s); ctx.lineTo(p.s * .6, -p.s); ctx.lineTo(p.s * .25, p.s * .4); ctx.lineTo(-p.s * .25, p.s * .4); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = '#f2994a'; ctx.beginPath(); ctx.arc(0, p.s * .55, p.s * .3, 0, 6.28); ctx.fill(); ctx.restore(); break;
      case 'flowers':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        for (let i = 0; i < 5; i++) { const a = (i * 2 * Math.PI) / 5; ctx.beginPath(); ctx.arc(Math.cos(a) * p.s, Math.sin(a) * p.s, p.s * .75, 0, 6.28); ctx.fill(); }
        ctx.fillStyle = '#f6d36b'; ctx.beginPath(); ctx.arc(0, 0, p.s * .5, 0, 6.28); ctx.fill(); ctx.restore(); break;
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, Hh);
    for (const p of parts) {
      const sway = CFG[p.k].sway ?? .35;
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
    else if (parts.length && !raf && !reduce) raf = requestAnimationFrame(tick);
  });

  return {
    // t: nome de um efeito, uma lista de efeitos, ou null
    set(t, cols) {
      const types = (Array.isArray(t) ? t : [t]).filter((k) => CFG[k]);
      const k = types.join('+') + '|' + cols;
      if (k === key) return;
      key = k; colors = cols;
      cancelAnimationFrame(raf); raf = 0;
      ctx.clearRect(0, 0, W, Hh);
      parts = [];
      if (!types.length || reduce) return;
      for (const ty of types) {
        const n = Math.round(CFG[ty].n * (W < 700 ? .55 : 1));
        for (let i = 0; i < n; i++) parts.push(spawn({ k: ty }, true));
      }
      raf = requestAnimationFrame(tick);
    },
  };
})();
