// ===== Cenários: elementos desenhados de cada mundo, atrás do conteúdo =====
// Cada cena é uma lista de SVGs posicionados na tela (classe .sc) + um kanji gigante.
// As cores vêm das variáveis do tema (classes .a1 .a2 .tx .bgf .sf ...).
const Scenes = (() => {
  const f = (n) => n.toFixed(1);
  // svg(viewBox, estilo de posição, conteúdo, classes extras, preserveAspectRatio)
  const S = (vb, style, inner, cls = '', par = '') =>
    `<svg class="sc ${cls}" viewBox="${vb}" style="${style}" ${par ? `preserveAspectRatio="${par}"` : ''} aria-hidden="true">${inner}</svg>`;
  const glow = (id, color, o = .5) =>
    `<radialGradient id="${id}"><stop offset="0" style="stop-color:${color};stop-opacity:${o}"/><stop offset="1" style="stop-color:${color};stop-opacity:0"/></radialGradient>`;

  // ---- Formas reutilizáveis ----
  function spiral(cx, cy, turns, step) {
    let d = '';
    for (let i = 0; i <= turns * 48; i++) {
      const t = (i / 48) * Math.PI * 2, r = (step * t) / (Math.PI * 2);
      d += (i ? 'L' : 'M') + f(cx + r * Math.cos(t)) + ' ' + f(cy + r * Math.sin(t));
    }
    return d;
  }
  function star(cx, cy, R, r, n, rot = -Math.PI / 2) {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const a = rot + (i * Math.PI) / n, rr = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + f(cx + rr * Math.cos(a)) + ' ' + f(cy + rr * Math.sin(a));
    }
    return d + 'Z';
  }
  function gear(cx, cy, R, teeth, depth) {
    let d = '';
    const n = teeth * 4;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, r = i % 4 < 2 ? R : R - depth;
      d += (i ? 'L' : 'M') + f(cx + r * Math.cos(a)) + ' ' + f(cy + r * Math.sin(a));
    }
    return d + 'Z';
  }
  function ticks(cx, cy, r1, r2, n) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, r = i % 6 ? r1 : r1 - (r2 - r1);
      d += `M${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}L${f(cx + r2 * Math.cos(a))} ${f(cy + r2 * Math.sin(a))}`;
    }
    return d;
  }
  const shuriken = (cx, cy, R) => `<path class="tx" fill-rule="evenodd" d="${star(cx, cy, R, R * .28, 4, 0)} M${cx + R * .12} ${cy}a${R * .12} ${R * .12} 0 1 0 ${-R * .24} 0a${R * .12} ${R * .12} 0 1 0 ${R * .24} 0Z"/>`;
  const kanji = (ch, style) => `<div class="sc sc-kanji" style="${style}">${ch}</div>`;

  // ---- Os mundos ----
  const W = {};

  W.naruto = () => {
    // Vila ao entardecer: montanhas, telhados curvos e uma torre redonda
    let houses = '';
    const xs = [0, 70, 150, 215, 300, 640, 720, 790, 880, 950, 1040, 1110];
    xs.forEach((x, i) => {
      const w = 60 + (i * 37) % 40, h = 40 + (i * 53) % 70;
      houses += `<rect x="${x + 6}" y="${260 - h}" width="${w - 12}" height="${h}"/>`
        + `<path d="M${x - 6} ${262 - h}Q${x + w / 2} ${244 - h - w * .25} ${x + w + 6} ${262 - h}L${x + w - 4} ${250 - h}L${x + 4} ${250 - h}Z"/>`;
    });
    const village = S('0 0 1200 260', 'left:0;right:0;bottom:0;width:100%;height:min(34vh,300px)', `
      <defs>${glow('nsun', 'var(--accent)', .55)}</defs>
      <circle cx="930" cy="150" r="260" fill="url(#nsun)"/>
      <circle cx="930" cy="150" r="46" class="a1" opacity=".35"/>
      <path class="sf" opacity=".9" d="M0 260V150Q120 96 250 128Q380 50 520 82Q640 40 770 96Q900 60 1040 104Q1120 84 1200 120V260Z"/>
      <g class="bgf">${houses}
        <rect x="420" y="120" width="160" height="140"/>
        <path d="M400 124Q500 40 600 124Z"/>
        <rect x="380" y="186" width="240" height="10"/>
        <rect x="1000" y="150" width="6" height="110"/><rect x="1050" y="150" width="6" height="110"/>
        <path d="M985 154h86l-8-30h-70Z"/>
      </g>
      <text x="500" y="178" text-anchor="middle" class="a1" opacity=".55" style="font:700 46px 'Shippori Mincho',serif">火</text>`,
      'hide-light', 'xMidYMax slice');
    const swirl = S('0 0 400 400', 'top:-140px;right:-160px;width:min(640px,90vw)', `<path class="sa1" stroke-width="7" stroke-linecap="round" opacity=".16" d="${spiral(200, 200, 6.2, 30)}"/>`, 'spin-slow');
    const kunai = S('0 0 60 240', 'left:3vw;top:30vh;width:54px;transform:rotate(28deg)', `
      <path class="tx" opacity=".45" d="M30 0L46 70L36 80L24 80L14 70Z"/>
      <rect x="25" y="80" width="10" height="90" class="sf" stroke="currentColor" opacity=".9"/>
      <g class="sa1" stroke-width="2" opacity=".6">${[88, 100, 112, 124, 136, 148, 160].map((y) => `<path d="M25 ${y}L35 ${y + 8}"/>`).join('')}</g>
      <circle cx="30" cy="190" r="14" fill="none" class="stx" stroke-width="5" opacity=".45"/>
      <rect x="18" y="104" width="24" height="70" class="a1" opacity=".25"/>
      <text x="30" y="148" text-anchor="middle" class="a2" style="font:700 15px serif" opacity=".7">爆</text>`, 'hide-sm bob');
    const scroll = S('0 0 90 330', 'right:2.5vw;top:120px;width:70px', `
      <rect x="4" y="0" width="82" height="16" rx="8" class="a1" opacity=".55"/>
      <rect x="12" y="14" width="66" height="300" class="tx" opacity=".1"/>
      <rect x="12" y="14" width="66" height="300" fill="none" class="sa1" stroke-width="2" opacity=".35"/>
      <text x="45" y="100" text-anchor="middle" class="a1" opacity=".6" style="font:700 46px 'Shippori Mincho',serif">忍</text>
      <text x="45" y="170" text-anchor="middle" class="tx" opacity=".35" style="font:700 34px 'Shippori Mincho',serif">道</text>
      <circle cx="45" cy="250" r="20" fill="none" class="sa1" stroke-width="3" opacity=".5"/>
      <path class="sa1" stroke-width="3" opacity=".5" d="${spiral(45, 250, 2.2, 8)}"/>
      <rect x="4" y="314" width="82" height="16" rx="8" class="a1" opacity=".55"/>`, 'hide-sm sway');
    const ramen = S('0 0 160 140', 'left:2vw;bottom:min(16vh,140px);width:120px', `
      <g class="stx" stroke-width="4" stroke-linecap="round" fill="none" opacity=".35">
        <path class="steam" d="M55 50q-12-14 0-26t0-24"/><path class="steam d2" d="M80 46q-12-14 0-26t0-24"/><path class="steam d3" d="M105 50q-12-14 0-26t0-24"/>
      </g>
      <path class="a1" opacity=".6" d="M10 70h140q-6 52-70 58q-64-6-70-58Z"/>
      <rect x="10" y="64" width="140" height="10" rx="5" class="a2" opacity=".6"/>
      <circle cx="58" cy="66" r="10" class="tx" opacity=".7"/><path d="${spiral(58, 66, 1.6, 4)}" fill="none" stroke="#e25b8b" stroke-width="2"/>
      <path class="stx" stroke-width="3" opacity=".6" d="M118 20L90 66M128 24L98 66"/>`, 'hide-sm');
    const stars = S('0 0 100 100', 'left:22vw;top:14vh;width:46px', shuriken(50, 50, 48), 'spin-fast faint hide-sm');
    return village + swirl + kunai + scroll + ramen + stars + kanji('忍', 'left:-2vw;top:8vh');
  };

  W.demonslayer = () => {
    let clusters = '';
    [[70, 16], [190, 11], [300, 19], [430, 13], [560, 9], [890, 15], [1010, 20], [1130, 12]].forEach(([x, n], k) => {
      let c = '';
      for (let i = 0; i < n; i++) {
        const r = 11 - i * .45, y = 14 + i * 13, dx = (i % 2 ? 7 : -7) * (1 - i / n);
        c += `<circle cx="${x + dx}" cy="${y}" r="${f(r)}" class="${i % 3 ? 'a2' : 'tx'}" opacity="${f(.55 - i * .015)}"/>`;
      }
      clusters += `<g class="sway" style="animation-delay:-${k * .7}s">${c}<path d="M${x} 0V14" class="stx" opacity=".3"/></g>`;
    });
    const wisteria = S('0 0 1200 300', 'top:0;left:0;width:100%;height:min(32vh,280px)', `<path d="M0 6Q600 26 1200 4" class="stx" stroke-width="3" opacity=".25" fill="none"/>${clusters}`, '', 'xMidYMin slice');
    const moon = S('0 0 300 300', 'right:8vw;top:20vh;width:min(240px,40vw)', `
      <defs>${glow('dmoon', 'var(--accent2)', .45)}</defs>
      <circle cx="150" cy="150" r="150" fill="url(#dmoon)"/>
      <path class="tx" opacity=".75" d="M150 60A90 90 0 1 0 210 220A72 72 0 1 1 150 60Z"/>`, 'hide-light');
    const katana = S('0 0 60 700', 'left:4vw;bottom:-60px;height:min(80vh,640px);transform:rotate(-24deg)', `
      <path class="tx" opacity=".35" d="M26 0Q40 160 34 430L22 430Q24 150 26 0Z"/>
      <path class="a1" opacity=".55" d="M24 30Q34 180 30 420" stroke-width="2" fill="none" stroke="currentColor"/>
      <ellipse cx="28" cy="440" rx="26" ry="9" class="a2" opacity=".6"/>
      <rect x="20" y="449" width="16" height="210" rx="4" class="bgf" stroke="currentColor" opacity=".9"/>
      <g class="a1" opacity=".55">${Array.from({ length: 10 }, (_, i) => `<path d="M20 ${458 + i * 20}l16 10l-16 10Z"/>`).join('')}</g>`, 'hide-sm');
    const checks = S('0 0 240 40', 'left:0;right:0;bottom:0;width:100%;height:18px', `
      <defs><pattern id="dchk" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#2a9d8f"/><rect x="20" y="20" width="20" height="20" fill="#2a9d8f"/></pattern></defs>
      <rect width="240" height="40" fill="url(#dchk)" opacity=".5"/>`, '', 'none');
    return wisteria + moon + katana + checks + kanji('鬼', 'right:-3vw;bottom:4vh');
  };

  W.jjk = () => {
    const domain = S('0 0 600 600', 'left:50%;top:50%;width:min(1100px,150vw);margin:calc(min(1100px,150vw)/-2) 0 0 calc(min(1100px,150vw)/-2)', `
      <g class="sa1" fill="none" opacity=".16">
        <circle cx="300" cy="300" r="290" stroke-width="2"/><circle cx="300" cy="300" r="250" stroke-width="1"/>
        <path d="${ticks(300, 300, 256, 280, 72)}" stroke-width="2"/>
        <circle cx="300" cy="300" r="160" stroke-width="4" stroke-dasharray="4 14"/>
        <path d="${star(300, 300, 160, 60, 5)}" stroke-width="1.5"/>
      </g>`, 'spin-slow');
    const talisman = (x, y, rot, ch, cls) => S('0 0 60 220', `${x};${y};width:56px;transform:rotate(${rot}deg)`, `
      <rect x="2" y="0" width="56" height="220" fill="#efe4c8" opacity=".85"/>
      <rect x="8" y="6" width="44" height="208" fill="none" stroke="#7a1020" stroke-width="2"/>
      <text x="30" y="60" text-anchor="middle" fill="#1a1020" style="font:700 34px 'Shippori Mincho',serif">${ch}</text>
      <path d="M30 76V170M18 96l24 10M18 120l24 -10M18 144l24 10" stroke="#1a1020" stroke-width="3" fill="none"/>
      <circle cx="30" cy="192" r="12" fill="#b0102a"/>`, `sway ${cls}`);
    const torii = S('0 0 400 300', 'right:3vw;bottom:0;width:min(380px,55vw)', `
      <defs>${glow('jg', 'var(--accent)', .5)}</defs>
      <ellipse cx="200" cy="230" rx="220" ry="120" fill="url(#jg)"/>
      <g class="bgf"><path d="M20 40Q200 70 380 40L386 64Q200 92 14 64Z"/><rect x="40" y="96" width="320" height="16"/>
      <rect x="84" y="60" width="22" height="240"/><rect x="294" y="60" width="22" height="240"/><rect x="190" y="72" width="20" height="40"/></g>`, 'hide-sm');
    // Olhos de maldições espiando no escuro + inscrição de expansão de domínio
    const eyes = [[6, 62, 1], [88, 52, .8], [14, 84, .7], [80, 80, 1.1], [94, 28, .6], [30, 36, .6]].map(([x, y, s], i) =>
      S('0 0 120 50', `left:${x}vw;top:${y}vh;width:${f(110 * s)}px`, `
        <g class="blink" style="animation-delay:-${i * .7}s"><path d="M4 25Q30 2 56 25Q30 46 4 25Z" fill="#1a0b0f" stroke="#c21f3a" stroke-width="2"/><circle cx="30" cy="25" r="9" fill="#ffcf3f"/><ellipse cx="30" cy="25" rx="2.5" ry="8" fill="#000"/>
        <path d="M64 25Q90 2 116 25Q90 46 64 25Z" fill="#1a0b0f" stroke="#c21f3a" stroke-width="2"/><circle cx="90" cy="25" r="9" fill="#ffcf3f"/><ellipse cx="90" cy="25" rx="2.5" ry="8" fill="#000"/></g>`, i > 3 ? 'hide-sm faint' : 'faint')).join('');
    const marks = S('0 0 200 300', 'right:18vw;top:58vh;width:min(150px,24vw)', `
      <g stroke="#c21f3a" stroke-width="8" stroke-linecap="round" fill="none" opacity=".45"><path d="M20 40Q100 20 180 50M30 90Q100 70 170 100M60 140h80"/><path d="M100 160V280M70 200l30 20l30-20"/></g>`, 'hide-sm pulse');
    const scrollTxt = `<div class="sc sc-vtext" style="left:12vw;top:40vh">領域展開</div><div class="sc sc-vtext" style="right:12vw;top:24vh;opacity:.12">呪力</div>`;
    const finger = S('0 0 60 160', 'left:44vw;bottom:5vh;width:min(46px,10vw);transform:rotate(18deg)', `
      <path d="M14 20Q14 0 30 0Q46 0 46 20V150H14Z" fill="#5b2a2a"/><path d="M18 8Q30 0 42 8l-2 10H20Z" fill="#2a1414"/>
      <g fill="#efe4c8">${[40, 70, 100, 130].map((y) => `<rect x="10" y="${y}" width="40" height="18" transform="rotate(-8 30 ${y + 9})"/>`).join('')}</g>
      <g fill="#7a1020">${[46, 76, 106, 136].map((y) => `<circle cx="30" cy="${y + 4}" r="3"/>`).join('')}</g>`, 'hide-sm bob');
    return eyes + marks + scrollTxt + finger + domain + talisman('left:3vw', 'top:18vh', -8, '呪', 'hide-sm') + talisman('right:4vw', 'top:12vh', 6, '封', 'hide-sm faint') + torii + kanji('呪', 'left:-2vw;bottom:2vh');
  };

  W.spy = () => {
    const stamp = S('0 0 320 110', 'right:4vw;top:16vh;width:min(300px,50vw);transform:rotate(-12deg)', `
      <g class="sa1" fill="none" opacity=".45"><rect x="6" y="6" width="308" height="98" rx="10" stroke-width="6"/><rect x="18" y="18" width="284" height="74" rx="4" stroke-width="2"/></g>
      <text x="160" y="74" text-anchor="middle" class="a1" opacity=".5" style="font:700 46px 'Fredoka',sans-serif;letter-spacing:4px">TOP SECRET</text>`);
    const lens = S('0 0 200 200', 'left:3vw;bottom:10vh;width:min(170px,30vw)', `
      <circle cx="80" cy="80" r="60" class="a2" opacity=".12"/>
      <circle cx="80" cy="80" r="60" fill="none" class="sa2" stroke-width="12" opacity=".5"/>
      <path d="M124 124L186 186" class="sa2" stroke-width="20" stroke-linecap="round" opacity=".55"/>
      <path d="M50 58Q62 42 82 40" class="stx" stroke-width="6" fill="none" opacity=".3" stroke-linecap="round"/>`, 'bob');
    const folder = S('0 0 260 200', 'left:-30px;top:22vh;width:min(230px,38vw);transform:rotate(9deg)', `
      <path class="a2" opacity=".22" d="M0 20h90l16 18h154v162H0Z"/>
      <rect x="20" y="58" width="200" height="120" fill="#fff" opacity=".7"/>
      <g class="stx" stroke-width="5" opacity=".18">${[80, 100, 120, 140, 160].map((y) => `<path d="M36 ${y}H${y % 40 ? 190 : 150}"/>`).join('')}</g>
      <rect x="130" y="84" width="70" height="20" class="tx" opacity=".55"/>
      <path d="M200 40v40a10 10 0 0 1-20 0V48" fill="none" class="stx" stroke-width="4" opacity=".4"/>`, 'hide-sm');
    const peanuts = [[18, 8, 20], [76, 4, -30], [60, 80, 50], [88, 60, 10], [8, 62, -50]].map(([x, y, r]) =>
      S('0 0 40 70', `left:${x}vw;top:${y}vh;width:30px;transform:rotate(${r}deg)`, `<path fill="#d9a35f" opacity=".75" d="M20 2c12 0 16 12 12 22c-3 6-3 10 0 16c5 12 0 28-12 28S3 52 8 40c3-6 3-10 0-16C4 14 8 2 20 2Z"/><path d="M12 22h4M22 16h4M14 48h4M24 54h4M20 34h4" stroke="#a8743c" stroke-width="3" stroke-linecap="round"/>`, 'bob hide-sm'));
    const hearts = S('0 0 100 100', 'right:12vw;bottom:14vh;width:70px', `<path class="a1" opacity=".4" d="M50 88C10 60 4 36 20 22c12-10 26-4 30 8c4-12 18-18 30-8c16 14 10 38-30 66Z"/>`, 'pulse');
    // Cidade europeia com torre do relógio
    let city = '';
    [[0, 70, 120], [70, 50, 160], [120, 80, 100], [200, 60, 140], [330, 70, 120], [400, 50, 170], [700, 60, 130], [760, 80, 110], [840, 50, 160], [890, 70, 120], [960, 60, 150], [1020, 80, 100], [1100, 100, 140]].forEach(([x, w, h]) => {
      city += `<rect x="${x}" y="${260 - h}" width="${w}" height="${h}"/><path d="M${x - 4} ${262 - h}L${x + w / 2} ${226 - h}L${x + w + 4} ${262 - h}Z"/>`;
    });
    const skyline = S('0 0 1200 260', 'left:0;right:0;bottom:0;width:100%;height:min(30vh,260px)', `
      <g class="a2" opacity=".16">${city}<rect x="520" y="40" width="80" height="220"/><path d="M510 44L560 -20L610 44Z"/></g>
      <circle cx="560" cy="90" r="26" fill="#fff" opacity=".85"/><circle cx="560" cy="90" r="26" fill="none" class="sa2" stroke-width="3" opacity=".5"/>
      <path d="M560 90V72M560 90l12 6" class="sa2" stroke-width="3" opacity=".7"/>
      <g fill="#fff" opacity=".6">${Array.from({ length: 22 }, (_, i) => `<rect x="${(i * 97) % 1180 + 10}" y="${200 - (i * 31) % 70}" width="10" height="14"/>`).join('')}</g>`, '', 'xMidYMax slice');
    const rose = S('0 0 220 220', 'right:3vw;bottom:min(20vh,170px);width:min(180px,32vw)', `
      <g opacity=".75"><path d="M40 190L170 40" stroke="#5b5e72" stroke-width="7" stroke-linecap="round"/><path d="M180 190L50 40" stroke="#5b5e72" stroke-width="7" stroke-linecap="round"/>
      <path d="M160 52l18-22l-4 26Z M60 52l-18-22l4 26Z" fill="#c9ced8"/>
      <rect x="22" y="180" width="30" height="10" rx="4" transform="rotate(-48 37 185)" fill="#d4af37"/><rect x="168" y="180" width="30" height="10" rx="4" transform="rotate(48 183 185)" fill="#d4af37"/></g>
      <path d="M110 120Q104 170 112 210" stroke="#2f6b4f" stroke-width="5" fill="none"/><path d="M110 170q-26-8-30 8q22 8 30-8Z" fill="#2f6b4f"/>
      <circle cx="110" cy="104" r="26" fill="#b0103a"/><path d="M96 98q14-18 28 0q-14 20-28 0Z M90 110q20 12 40 0" fill="none" stroke="#6d0a24" stroke-width="3"/>`, 'hide-md');
    const dog = S('0 0 200 200', 'left:3vw;bottom:min(6vh,50px);width:min(170px,30vw)', `
      <path fill="#fff" stroke="#2b2d42" stroke-width="3" d="M50 190Q30 120 60 90Q50 50 80 40Q100 20 124 40Q150 50 142 90Q170 120 152 190Z"/>
      <path d="M78 46Q56 40 52 76Q62 82 74 66Z M126 46Q148 40 152 76Q142 82 130 66Z" fill="#2b2d42" opacity=".8"/>
      <circle cx="90" cy="70" r="5" fill="#2b2d42"/><circle cx="114" cy="70" r="5" fill="#2b2d42"/><ellipse cx="102" cy="86" rx="9" ry="6" fill="#2b2d42"/>
      <path d="M92 96q10 8 20 0" stroke="#2b2d42" stroke-width="3" fill="none"/><path d="M74 130q14 10 28 0q14 10 28 0" stroke="#d6d6e0" stroke-width="3" fill="none"/>`, 'bob');
    const stella = [[30, 12], [62, 26], [86, 44], [44, 58], [70, 72]].map(([x, y], i) =>
      S('0 0 40 40', `left:${x}vw;top:${y}vh;width:${26 - i * 2}px`, `<path d="${star(20, 20, 19, 7, 8)}" fill="#f4c542"/><path d="${star(20, 20, 9, 4, 8)}" fill="#fff"/>`, 'twinkle hide-sm')).join('');
    return skyline + stamp + lens + folder + peanuts.join('') + hearts + rose + dog + stella + kanji('家', 'right:-2vw;bottom:0');
  };

  W.fma = () => {
    const circle = (r) => `
      <g class="sa2" fill="none">
        <circle cx="300" cy="300" r="${r}" stroke-width="3"/><circle cx="300" cy="300" r="${r - 20}" stroke-width="1.5"/>
        <path d="${star(300, 300, r - 20, (r - 20) * .5, 7)}" stroke-width="1.5"/>
        <circle cx="300" cy="300" r="${(r - 20) * .5}" stroke-width="2"/>
        <path d="${star(300, 300, (r - 20) * .5, 0.001, 3)}" stroke-width="1.5"/>
        ${Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7; return `<circle cx="${f(300 + (r - 20) * Math.cos(a))}" cy="${f(300 + (r - 20) * Math.sin(a))}" r="14" stroke-width="2"/>`; }).join('')}
      </g>`;
    const big = S('0 0 600 600', 'right:-14vw;top:-6vh;width:min(760px,110vw)', circle(280), 'spin-slow faint');
    const small = S('0 0 600 600', 'left:-90px;bottom:-90px;width:min(380px,60vw)', circle(280), 'spin-rev faint');
    const gears = S('0 0 300 220', 'left:2vw;top:24vh;width:min(220px,34vw)', `
      <g class="tx" opacity=".18" fill-rule="evenodd">
        <path class="spin-mid" style="transform-origin:100px 110px" d="${gear(100, 110, 90, 14, 14)}M140 110a40 40 0 1 0-80 0a40 40 0 1 0 80 0Z"/>
        <path class="spin-mid rev" style="transform-origin:232px 62px" d="${gear(232, 62, 56, 10, 11)}M256 62a24 24 0 1 0-48 0a24 24 0 1 0 48 0Z"/>
      </g>`, 'hide-sm');
    const bolts = S('0 0 400 400', 'left:40vw;top:56vh;width:min(320px,50vw)', `
      <g class="sa2" fill="none" stroke-width="3" stroke-linejoin="bevel">
        <path class="flick" d="M20 200l40-30l20 40l40-60l30 50l40-70"/><path class="flick d2" d="M200 300l30-40l26 30l30-60l40 40l50-50"/>
        <path class="flick d3" d="M60 340l40-20l10 30l50-50"/></g>`, 'hide-sm');
    return big + small + gears + bolts + kanji('錬', 'left:-1vw;top:6vh');
  };

  W.aot = () => {
    let joints = '';
    for (let y = 60; y < 300; y += 34) joints += `<path d="M0 ${y}H1200"/>`;
    for (let y = 60, k = 0; y < 300; y += 34, k++) for (let x = (k % 2) * 60; x < 1200; x += 120) joints += `<path d="M${x} ${y}V${y + 34}"/>`;
    const wall = S('0 0 1200 300', 'left:0;right:0;bottom:0;width:100%;height:min(38vh,340px)', `
      <defs><linearGradient id="aw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--surface)"/><stop offset="1" style="stop-color:var(--bg)"/></linearGradient>
      ${glow('ast', '#eee4cf', .35)}</defs>
      <g class="steam-rise"><ellipse cx="870" cy="40" rx="190" ry="70" fill="url(#ast)"/><ellipse cx="760" cy="20" rx="120" ry="60" fill="url(#ast)"/></g>
      <path class="bgf" opacity=".95" d="M780 70Q790 -40 880 -46Q970 -40 980 70Z"/>
      <ellipse cx="850" cy="10" rx="16" ry="8" class="a1" opacity=".6"/><ellipse cx="912" cy="10" rx="16" ry="8" class="a1" opacity=".6"/>
      <rect x="0" y="50" width="1200" height="250" fill="url(#aw)"/>
      <rect x="0" y="44" width="1200" height="14" class="sf"/>
      <g class="stx" stroke-width="2" opacity=".08">${joints}</g>`, '', 'xMidYMax slice');
    const cables = S('0 0 600 400', 'left:0;top:0;width:min(560px,80vw)', `
      <g class="stx" stroke-width="2" opacity=".28" fill="none"><path d="M0 40Q300 120 560 380"/><path d="M0 110Q260 160 420 400"/></g>
      <path class="tx" opacity=".4" d="M552 372l16 16l-4-20Z M412 392l16 12l-6-20Z"/>`, 'hide-sm');
    const feather = S('0 0 60 200', 'right:6vw;top:18vh;width:46px;transform:rotate(24deg)', `
      <path class="tx" opacity=".3" d="M30 0C58 50 52 140 30 180C8 140 2 50 30 0Z"/><path d="M30 10V200" class="sa1" stroke-width="2" opacity=".6"/>`, 'sway');
    // Sinalizadores de fumaça, lâminas cruzadas e telhados dentro da muralha
    const flares = S('0 0 600 400', 'left:24vw;top:6vh;width:min(560px,70vw)', `
      <g fill="none" stroke-linecap="round">
        <path d="M60 400Q120 160 220 60" stroke="#5fae4f" stroke-width="22" opacity=".22"/><path d="M60 400Q120 160 220 60" stroke="#8fdc7a" stroke-width="5" opacity=".5"/>
        <path d="M360 400Q380 200 470 110" stroke="#d64a3a" stroke-width="22" opacity=".18"/><path d="M360 400Q380 200 470 110" stroke="#ff8a6a" stroke-width="5" opacity=".45"/></g>
      <circle cx="220" cy="60" r="10" fill="#b9ff9e" class="flick"/><circle cx="470" cy="110" r="9" fill="#ffb19e" class="flick d2"/>`, 'hide-sm');
    const blades = S('0 0 240 240', 'right:4vw;top:46vh;width:min(170px,30vw)', `
      <g opacity=".5"><path d="M30 210L190 30l14 6L44 220Z" fill="#c9ced6"/><path d="M210 210L50 30l-14 6L196 220Z" fill="#c9ced6"/>
      <path d="M190 30l14 6l-10-22Z M50 30l-14 6l10-22Z" fill="#e6e9ee"/>
      <rect x="14" y="200" width="44" height="22" rx="6" transform="rotate(-48 36 211)" class="a1"/><rect x="182" y="200" width="44" height="22" rx="6" transform="rotate(48 204 211)" class="a1"/>
      ${[60, 90, 120, 150].map((k) => `<path d="M${k + 26} ${240 - k - 24}l12 10" stroke="#555" stroke-width="2"/>`).join('')}</g>`, 'hide-sm');
    let roofs = '';
    for (let x = 0; x < 1200; x += 70) { const h = 30 + (x * 7) % 40; roofs += `<rect x="${x + 6}" y="${150 - h + 20}" width="58" height="${h}"/><path d="M${x} ${170 - h}L${x + 35} ${140 - h}L${x + 70} ${170 - h}Z"/>`; }
    const town = S('0 0 1200 150', 'left:0;right:0;bottom:0;width:100%;height:min(13vh,120px)', `<g class="bgf">${roofs}</g><g fill="#ffcf7a" opacity=".5">${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 75 + 28}" y="${118 - (i * 13) % 20}" width="8" height="10"/>`).join('')}</g>`, '', 'xMidYMax slice');
    return wall + town + flares + cables + blades + feather + kanji('巨', 'right:-2vw;top:4vh');
  };

  W.deathnote = () => {
    const book = S('0 0 300 380', 'right:3vw;bottom:5vh;width:min(250px,36vw);transform:rotate(9deg)', `
      <rect x="20" y="10" width="270" height="360" rx="8" fill="#000" stroke="currentColor" class="stx" stroke-width="2" opacity=".9"/>
      <rect x="292" y="20" width="6" height="340" fill="#e8e6e3" opacity=".35"/>
      <g class="stx" stroke-width="1.5" opacity=".2"><rect x="48" y="40" width="214" height="300" fill="none"/><path d="M60 70H250M60 320H250"/></g>
      <text x="155" y="200" text-anchor="middle" class="tx" opacity=".55" style="font:44px 'UnifrakturMaguntia',serif">Note</text>`, 'hide-sm');
    const apple = S('0 0 120 130', 'left:5vw;bottom:8vh;width:min(110px,22vw)', `
      <path class="a1" opacity=".85" d="M60 36C40 20 6 26 6 66c0 36 24 62 40 62c8 0 10-4 14-4s6 4 14 4c16 0 40-26 40-62c0-40-34-46-54-30Z"/>
      <path d="M60 36Q58 18 66 6" stroke="#5b3a1e" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M64 20Q84 0 100 14Q82 30 64 20Z" fill="#2f5d2a"/>
      <ellipse cx="34" cy="58" rx="8" ry="14" fill="#fff" opacity=".25" transform="rotate(20 34 58)"/>`, 'bob');
    const chess = S('0 0 200 200', 'left:3vw;top:20vh;width:min(150px,26vw)', `
      <g class="tx" opacity=".2">
        <path d="M60 30h8v-10h8v10h8v8h-8v10q20 6 16 30h-8l10 70h12v14H38v-14h12l10-70h-8q-4-24 16-30V38h-8Z"/>
        <circle cx="150" cy="104" r="16"/><path d="M138 120h24l10 46h10v14h-64v-14h10Z"/>
      </g>`, 'hide-sm');
    const candle = S('0 0 60 200', 'right:20vw;top:10vh;width:40px', `
      <defs>${glow('df', '#ffb347', .7)}</defs><circle cx="30" cy="40" r="30" fill="url(#df)" class="flick"/>
      <path d="M30 20Q38 36 30 52Q22 36 30 20Z" fill="#ffd27a" class="flick d2"/><rect x="20" y="54" width="20" height="140" fill="#e8e6e3" opacity=".35"/>`, 'hide-sm hide-light');
    // Asas rasgadas de um deus da morte, atrás de tudo
    const wing = (flip) => `<path transform="${flip ? 'translate(1000 0) scale(-1 1)' : ''}" d="M480 260Q380 120 220 70Q120 40 20 80Q90 100 120 140Q60 140 30 190Q110 180 150 210Q90 230 70 290Q150 260 200 270Q160 310 160 370Q230 320 280 310Q290 360 320 400Q350 330 400 300Z"/>`;
    const wings = S('0 0 1000 420', 'left:50%;top:6vh;width:min(1100px,140vw);translate:-50% 0', `
      <g fill="#000" stroke="var(--accent)" stroke-width="2" opacity=".55">${wing(false)}${wing(true)}</g>
      <g class="stx" stroke-width="1.5" opacity=".12" fill="none"><path d="M480 260Q300 160 60 100M480 260Q300 200 120 200M480 260Q340 260 200 300M520 260Q700 160 940 100M520 260Q700 200 880 200M520 260Q660 260 800 300"/></g>`, 'pulse');
    const chips = S('0 0 160 200', 'left:20vw;bottom:4vh;width:min(110px,20vw);transform:rotate(-10deg)', `
      <path d="M20 10h120l-6 20l6 150l-6 14H26l-6-14l6-150Z" fill="#c8a032" opacity=".85"/><path d="M26 30h108M26 180h108" stroke="#7a5c12" stroke-width="3" stroke-dasharray="6 4"/>
      <ellipse cx="80" cy="100" rx="40" ry="30" fill="#8a1020"/><text x="80" y="108" text-anchor="middle" fill="#ffe08a" style="font:700 22px 'Crimson Text',serif">CHIPS</text>
      <g fill="#e2b04a"><ellipse cx="150" cy="190" rx="14" ry="9" transform="rotate(20 150 190)"/><ellipse cx="10" cy="194" rx="12" ry="8"/></g>`, 'hide-sm');
    const page = S('0 0 220 280', 'right:24vw;top:14vh;width:min(150px,24vw);transform:rotate(-6deg)', `
      <rect width="220" height="280" fill="#e8e6e3" opacity=".12"/>
      <g class="stx" stroke-width="1" opacity=".18">${Array.from({ length: 12 }, (_, i) => `<path d="M14 ${30 + i * 20}H206"/>`).join('')}</g>
      <g class="stx" stroke-width="2.2" fill="none" opacity=".5">${Array.from({ length: 9 }, (_, i) => { let d = `M20 ${46 + i * 20}`; for (let k = 0; k < 6 + (i * 5) % 8; k++) d += `q6 -10 12 0t12 -2`; return `<path d="${d}"/>`; }).join('')}</g>
      <path d="M200 250L120 150" stroke="#c0001a" stroke-width="5" stroke-linecap="round"/><path d="M120 150l-8-14l14 6Z" fill="#e8e6e3"/>`, 'hide-sm');
    const hourglass = S('0 0 80 140', 'left:3vw;top:56vh;width:min(60px,12vw)', `
      <rect x="4" y="0" width="72" height="10" class="tx" opacity=".5"/><rect x="4" y="130" width="72" height="10" class="tx" opacity=".5"/>
      <path d="M12 10h56Q68 50 40 70Q68 90 68 130H12Q12 90 40 70Q12 50 12 10Z" fill="none" class="stx" stroke-width="3" opacity=".45"/>
      <path d="M22 26h36Q52 54 40 64Q28 54 22 26Z M40 72V112 M20 126Q40 104 60 126Z" class="a1" stroke="var(--accent)" stroke-width="2" opacity=".75"/>`, 'hide-sm');
    return wings + book + apple + chess + candle + chips + page + hourglass + kanji('死', 'left:-2vw;top:10vh');
  };

  W.chainsaw = () => {
    let teeth = '';
    for (let x = 0; x < 2400; x += 40) teeth += `M${x} 30L${x + 20} 0L${x + 40} 30`;
    const strip = (pos, flip) => S('0 0 1200 40', `left:0;${pos};width:100%;height:26px;${flip ? 'transform:scaleY(-1)' : ''}`, `
      <g class="saw-run"><path class="a1" opacity=".5" d="${teeth}V40H0Z"/></g>`, '', 'xMinYMid slice');
    const blade = S('0 0 300 300', 'right:-80px;top:24vh;width:min(320px,50vw)', `
      <path class="tx" opacity=".16" fill-rule="evenodd" d="${star(150, 150, 146, 118, 24)}M180 150a30 30 0 1 0-60 0a30 30 0 1 0 60 0Z"/>
      <circle cx="150" cy="150" r="96" fill="none" class="stx" stroke-width="2" opacity=".2"/>`, 'spin-fast');
    const splat = (style, s) => S('0 0 200 200', style, `<g class="a1" opacity=".22">
      <path d="M100 40c30 0 34 30 56 34s24 40 0 52s-16 44-50 40s-34-26-58-30s-30-40-4-54s26-42 56-42Z"/>
      <circle cx="170" cy="40" r="${8 * s}"/><circle cx="30" cy="170" r="${10 * s}"/><circle cx="186" cy="150" r="${5 * s}"/><circle cx="20" cy="60" r="${6 * s}"/></g>`, 'hide-sm');
    return strip('top:64px', false) + strip('bottom:0', true) + blade + splat('left:2vw;top:30vh;width:180px', 1) + splat('right:16vw;bottom:8vh;width:120px;transform:rotate(80deg)', .8) + kanji('鋸', 'left:-2vw;bottom:2vh');
  };

  W.onepiece = () => {
    const wave = (y, amp, o, cls) => {
      let d = `M0 ${y}`;
      for (let x = 0; x < 2400; x += 120) d += `Q${x + 30} ${y - amp} ${x + 60} ${y}T${x + 120} ${y}`;
      return `<g class="${cls}"><path d="${d}V200H0Z" class="a2-ocean" opacity="${o}"/></g>`;
    };
    const sea = S('0 0 1200 200', 'left:0;right:0;bottom:0;width:100%;height:min(26vh,220px)', `
      ${wave(80, 14, .35, 'wave w1')}${wave(110, 18, .5, 'wave w2')}${wave(140, 12, .8, 'wave w3')}`, '', 'xMinYMax slice');
    const ship = S('0 0 300 260', 'left:12vw;bottom:min(15vh,130px);width:min(260px,40vw)', `
      <g class="bob">
        <path class="bgf" d="M20 180h260l-30 50H60Z"/><rect x="146" y="20" width="8" height="165" class="bgf"/><rect x="86" y="70" width="6" height="115" class="bgf"/>
        <path class="tx" opacity=".75" d="M154 30Q230 70 154 150Z"/><path class="tx" opacity=".6" d="M92 76Q150 110 92 160Z"/>
        <path class="a2" d="M154 14l30 8l-30 8Z"/>
        <circle cx="186" cy="88" r="12" fill="#111" opacity=".6"/><path d="M178 104l16 10M194 104l-16 10" stroke="#111" stroke-width="3" opacity=".6"/>
      </g>`, 'hide-sm');
    const compass = S('0 0 300 300', 'right:-60px;top:12vh;width:min(320px,48vw)', `
      <g class="sa1" fill="none" opacity=".35"><circle cx="150" cy="150" r="140" stroke-width="3"/><circle cx="150" cy="150" r="124"/><path d="${ticks(150, 150, 124, 138, 72)}"/></g>
      <path class="a1" opacity=".35" d="${star(150, 150, 120, 18, 4)}"/><path class="tx" opacity=".2" d="${star(150, 150, 80, 14, 4, -Math.PI / 4)}"/>
      <text x="150" y="44" text-anchor="middle" class="a1" opacity=".6" style="font:28px 'Pirata One',cursive">N</text>`, 'spin-slow');
    const hat = S('0 0 200 120', 'left:4vw;top:16vh;width:min(150px,28vw);transform:rotate(-14deg)', `
      <ellipse cx="100" cy="84" rx="96" ry="26" fill="#e9c46a" opacity=".8"/><path d="M48 80Q50 20 100 20Q150 20 152 80Z" fill="#e9c46a" opacity=".9"/>
      <path d="M50 64Q100 78 150 64L151 78Q100 92 49 78Z" class="a2"/>
      <g stroke="#b88a2e" stroke-width="2" opacity=".5" fill="none"><path d="M60 50Q100 60 140 50M70 34Q100 42 130 34"/></g>`, 'bob');
    const gulls = [0, 1, 2].map((i) => S('0 0 60 20', `left:0;top:${12 + i * 7}vh;width:${36 - i * 8}px;animation-delay:-${i * 9}s`, '<path d="M2 14Q16 0 30 12Q44 0 58 14" class="stx" fill="none" stroke-width="3" stroke-linecap="round" opacity=".55"/>', 'fly')).join('');
    return sea + ship + compass + hat + gulls + kanji('海', 'right:-2vw;bottom:14vh');
  };

  W.eva = () => {
    const hazard = (style) => S('0 0 600 60', style, `
      <defs><pattern id="hz" width="40" height="60" patternUnits="userSpaceOnUse" patternTransform="skewX(-40)"><rect width="20" height="60" class="a2"/></pattern></defs>
      <rect width="600" height="60" fill="url(#hz)" opacity=".55"/><rect width="600" height="60" fill="none" class="sa2" stroke-width="4" opacity=".7"/>`, '', 'none');
    const hud = S('0 0 320 170', 'left:3vw;top:20vh;width:min(300px,50vw)', `
      <g class="sa2" fill="none" stroke-width="3" opacity=".7"><rect x="4" y="4" width="312" height="162"/><path d="M4 50H316"/></g>
      <rect x="4" y="4" width="312" height="46" class="a2" opacity=".25"/>
      <text x="16" y="38" class="a2" style="font:30px 'Anton',sans-serif;letter-spacing:3px">警告  WARNING</text>
      <text x="16" y="100" class="a1" style="font:38px 'Anton',sans-serif;letter-spacing:2px">EMERGENCY</text>
      <text x="16" y="146" class="tx" opacity=".6" style="font:20px 'Anton',sans-serif;letter-spacing:4px">緊急事態 · CODE 601</text>`, 'flick hide-sm');
    const reticle = S('0 0 300 300', 'right:5vw;top:30vh;width:min(280px,46vw)', `
      <g class="sa1" fill="none" opacity=".4"><circle cx="150" cy="150" r="120" stroke-width="2" stroke-dasharray="40 14"/><circle cx="150" cy="150" r="70" stroke-width="2"/>
      <path d="M150 0V110M150 190V300M0 150H110M190 150H300" stroke-width="2"/><path d="${ticks(150, 150, 84, 96, 48)}"/></g>`, 'spin-slow');
    const cross = S('0 0 200 400', 'left:44vw;bottom:-40px;height:min(60vh,520px)', `
      <defs><linearGradient id="ec" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--accent2);stop-opacity:.0"/><stop offset=".4" style="stop-color:var(--accent2);stop-opacity:.35"/><stop offset="1" style="stop-color:var(--accent2);stop-opacity:.05"/></linearGradient></defs>
      <path fill="url(#ec)" d="M85 0h30v120h85v34h-85v246h-30V154H0v-34h85Z"/>`, 'pulse hide-sm');
    return hazard('left:-40px;top:72px;width:min(520px,80vw);height:30px;transform:rotate(-4deg)') + hazard('right:-40px;bottom:30px;width:min(520px,80vw);height:30px;transform:rotate(-4deg)')
      + hud + reticle + cross + '<div class="sc sc-scan"></div>' + kanji('使徒', 'right:-2vw;top:8vh;writing-mode:vertical-rl');
  };

  W.frieren = () => {
    let field = '';
    for (let i = 0; i < 70; i++) {
      const x = (i * 173) % 1200 + (i % 3) * 7, h = 40 + (i * 37) % 90, c = ['a2', 'tx-white', 'a2', 'a1'][i % 4], r = 5 + (i % 4);
      field += `<g class="sway-b" style="animation-delay:-${(i % 7) * .6}s"><path d="M${x} 200Q${x + 6} ${200 - h / 2} ${x} ${200 - h}" class="sa1" stroke-width="2" fill="none" opacity=".5"/>`
        + [0, 1, 2, 3, 4].map((k) => { const a = (k / 5) * Math.PI * 2; return `<circle cx="${f(x + r * Math.cos(a))}" cy="${f(200 - h + r * Math.sin(a))}" r="${r * .75}" class="${c}" opacity=".75"/>`; }).join('')
        + `<circle cx="${x}" cy="${200 - h}" r="${r * .45}" fill="#f6d36b"/></g>`;
    }
    const meadow = S('0 0 1200 200', 'left:0;right:0;bottom:0;width:100%;height:min(17vh,150px);opacity:.75', `
      <path class="a1" opacity=".18" d="M0 200V150Q300 120 600 150Q900 176 1200 140V200Z"/>${field}`, '', 'xMidYMax slice');
    const peaks = S('0 0 1200 300', 'left:0;right:0;bottom:min(10vh,90px);width:100%;height:min(34vh,300px)', `
      <path class="a2" opacity=".14" d="M0 300L160 150L260 210L420 70L560 200L700 110L860 230L1000 90L1200 220V300Z"/>
      <path fill="#fff" opacity=".35" d="M420 70L460 106L440 102L420 116L402 100L384 104Z M1000 90L1036 120L1014 116L1000 128L984 116L966 120Z"/>`, 'hide-sm', 'xMidYMax slice');
    let sky = '';
    const pts = [[40, 60], [120, 40], [190, 90], [280, 50], [340, 110], [620, 70], [700, 30], [760, 90], [860, 60], [930, 120]];
    sky += `<path d="M40 60L120 40L190 90L280 50L340 110M620 70L700 30L760 90L860 60L930 120" class="sa2" stroke-width="1.5" fill="none" opacity=".4"/>`;
    sky += pts.map(([x, y], i) => `<path d="${star(x, y, 9, 2.5, 4)}" class="a2 twinkle" style="animation-delay:-${i * .4}s"/>`).join('');
    const stars = S('0 0 1000 160', 'left:0;right:0;top:70px;width:100%;height:min(20vh,160px)', sky, '', 'xMidYMin slice');
    const staff = S('0 0 80 560', 'right:5vw;top:18vh;height:min(64vh,560px)', `
      <path d="M40 120V560" class="sa1" stroke-width="7" opacity=".45"/>
      <path d="M40 120Q-4 90 14 40Q24 90 40 98Q56 90 66 40Q84 90 40 120Z" class="a1" opacity=".5"/>
      <circle cx="40" cy="70" r="13" class="a2" opacity=".8"/><circle cx="36" cy="66" r="4" fill="#fff" opacity=".9"/>`, 'hide-sm bob');
    // Baú mímico que "engoliu" uma maga: só as pernas para fora, chutando
    const mimic = S('0 0 200 200', 'left:2vw;bottom:min(13vh,120px);width:min(170px,30vw)', `
      <g class="kick"><path d="M86 70Q80 30 70 4l12-2Q96 30 100 66Z" fill="#f4f1ea" stroke="#3b3550" stroke-width="2"/><path d="M68 4l14-2l2 10l-16 3Z" fill="#6b4a3a"/></g>
      <g class="kick" style="animation-delay:-.45s"><path d="M108 66Q118 26 132 8l11 6Q126 36 118 70Z" fill="#f4f1ea" stroke="#3b3550" stroke-width="2"/><path d="M132 8l12 5l-4 10l-14-6Z" fill="#6b4a3a"/></g>
      <path d="M30 88L50 40H170L176 92Z" fill="#8a5a36"/><path d="M50 40H170L172 50H48Z" fill="#c9a25a"/>
      <path d="M38 88h132l-6 10H44Z" fill="#fff"/><path d="${Array.from({ length: 11 }, (_, i) => `M${44 + i * 12} 92l6 14l6-14`).join('')}" fill="#fff"/>
      <path d="M90 104Q110 150 140 132Q122 112 112 100Z" fill="#e2547f"/>
      <rect x="30" y="100" width="150" height="88" rx="6" fill="#8a5a36"/>
      <rect x="30" y="100" width="150" height="14" fill="#c9a25a"/><rect x="30" y="174" width="150" height="14" fill="#c9a25a"/>
      <rect x="92" y="114" width="26" height="30" rx="4" fill="#c9a25a"/><circle cx="105" cy="126" r="4" fill="#3b3550"/>
      <circle cx="62" cy="140" r="6" fill="#e2547f" class="blink"/><circle cx="148" cy="140" r="6" fill="#e2547f" class="blink"/>`, 'hide-sm');
    const grimoire = S('0 0 240 170', 'right:15vw;bottom:min(24vh,200px);width:min(190px,32vw)', `
      <defs>${glow('fg', 'var(--accent2)', .55)}</defs><ellipse cx="120" cy="80" rx="120" ry="80" fill="url(#fg)"/>
      <path d="M120 40Q70 20 14 34V150Q70 138 120 156Z" fill="#fffaf0" stroke="#7b6a9c" stroke-width="3"/>
      <path d="M120 40Q170 20 226 34V150Q170 138 120 156Z" fill="#fffaf0" stroke="#7b6a9c" stroke-width="3"/>
      <g class="sa2" stroke-width="2" opacity=".7"><circle cx="66" cy="78" r="24"/><path d="${star(66, 78, 24, 10, 6)}"/>
      <path d="M140 54h60M140 70h52M140 86h60M140 102h40M140 118h56M30 118h66M30 132h50"/></g>
      <g class="twinkle"><path d="${star(120, 14, 10, 3, 4)}" class="a2"/></g>`, 'bob hide-md');
    const ruins = S('0 0 400 400', 'left:-20px;bottom:min(10vh,90px);height:min(46vh,400px)', `
      <g class="a2" opacity=".16">
        <rect x="30" y="80" width="44" height="320"/><rect x="20" y="62" width="64" height="22"/><rect x="20" y="380" width="64" height="20"/>
        <path d="M74 110Q160 30 246 110V140Q160 70 74 140Z"/>
        <rect x="246" y="190" width="44" height="210"/><path d="M240 190l14-26l18 14l24-8v20Z"/>
        <rect x="330" y="330" width="60" height="22" transform="rotate(-12 360 340)"/>
      </g>
      <g class="sa1" stroke-width="3" fill="none" opacity=".35"><path d="M52 400Q40 300 60 220Q70 160 50 100M60 260q20-10 26 4M56 180q-20-6-24 8"/></g>`, 'hide-sm');
    const sword = S('0 0 120 240', 'right:24vw;bottom:min(8vh,70px);width:min(84px,16vw)', `
      <path d="M54 20h12v150H54Z" fill="#cfd8dc" opacity=".9"/><path d="M60 22v146" stroke="#fff" stroke-width="2"/>
      <rect x="34" y="16" width="52" height="10" rx="3" class="a1"/><rect x="55" y="-10" width="10" height="28" fill="#6b4a3a"/><circle cx="60" cy="-12" r="7" class="a2"/>
      <path d="M10 236Q14 170 60 160Q108 168 112 236Z" fill="#a6b3ad"/><path d="M30 200q20-12 40 0M70 220q20-8 30 4" stroke="#7c8a84" stroke-width="3" fill="none"/>`, 'hide-sm');
    const zoltraak = S('0 0 300 300', 'left:32vw;top:9vh;width:min(230px,40vw)', `
      <g class="sa2" fill="none" opacity=".35"><circle cx="150" cy="150" r="140" stroke-width="3"/><circle cx="150" cy="150" r="110" stroke-dasharray="3 9" stroke-width="3"/>
      <path d="${star(150, 150, 110, 42, 8)}" stroke-width="1.5"/><circle cx="150" cy="150" r="42" stroke-width="2"/><path d="${ticks(150, 150, 118, 132, 48)}"/></g>`, 'spin-slow');
    const clouds = [0, 1].map((i) => S('0 0 200 70', `left:0;top:${8 + i * 10}vh;width:${190 - i * 50}px;animation-duration:${70 + i * 30}s;animation-delay:-${i * 30}s`,
      '<path fill="#fff" opacity=".75" d="M30 60a26 26 0 0 1 6-50a34 34 0 0 1 62-6a28 28 0 0 1 52 10a24 24 0 0 1 20 46Z"/>', 'fly')).join('');
    return clouds + stars + zoltraak + peaks + ruins + sword + meadow + mimic + grimoire + staff + kanji('旅', 'left:-2vw;top:10vh');
  };

  W.bocchi = () => {
    const lights = S('0 0 1200 600', 'left:0;top:0;width:100%;height:100vh', `
      <defs><linearGradient id="bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd166" stop-opacity=".55"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></linearGradient>
      <linearGradient id="bl2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--accent2);stop-opacity:.45"/><stop offset="1" style="stop-color:var(--accent2);stop-opacity:0"/></linearGradient></defs>
      <g class="sway slow"><path d="M220 0h40l160 600H40Z" fill="url(#bl)"/></g>
      <g class="sway slow" style="animation-delay:-3s"><path d="M940 0h40l180 600H780Z" fill="url(#bl2)"/></g>`, '', 'none');
    const guitar = S('0 0 200 520', 'left:2vw;bottom:-30px;height:min(70vh,560px);transform:rotate(-18deg)', `
      <rect x="90" y="40" width="22" height="270" class="tx" opacity=".55"/>
      <path d="M86 0h30l6 46H80Z" class="tx" opacity=".7"/>
      <path class="a1" opacity=".55" d="M100 290c-20-10-56-24-70 4c-10 22 14 36 4 56c-20 34-22 100 20 130c30 22 62 22 92 0c42-30 40-96 20-130c-10-20 14-34 4-56c-14-28-50-14-70-4Z"/>
      <rect x="66" y="380" width="70" height="12" rx="3" class="tx" opacity=".5"/><rect x="72" y="330" width="58" height="20" rx="4" class="bgf" opacity=".7"/>
      <g class="stx" stroke-width="1.2" opacity=".55">${[93, 97, 101, 105, 109].map((x) => `<path d="M${x} 20V386"/>`).join('')}</g>`, 'hide-sm');
    const box = S('0 0 220 200', 'right:3vw;bottom:2vh;width:min(200px,38vw)', `
      <path fill="#c9a26b" d="M20 70h180v126H20Z"/><path fill="#b48a52" d="M20 70L0 30h120l-10 40Z"/><path fill="#d8b47e" d="M200 70l20-40H110l-10 40Z"/>
      <rect x="40" y="80" width="140" height="22" fill="#2d2a4a" opacity=".85"/>
      <circle cx="94" cy="91" r="4" fill="#fff" class="blink"/><circle cx="124" cy="91" r="4" fill="#fff" class="blink"/>
      <path d="M60 140h100M60 160h70" stroke="#8a6436" stroke-width="5" stroke-linecap="round"/>`, 'bob');
    const bubble = S('0 0 180 110', 'right:16vw;top:18vh;width:min(150px,30vw)', `
      <path fill="#fff" opacity=".85" d="M20 4h140a16 16 0 0 1 16 16v50a16 16 0 0 1-16 16H70l-30 20l6-20H20A16 16 0 0 1 4 70V20A16 16 0 0 1 20 4Z" stroke="currentColor" class="stx" stroke-width="3"/>
      <text x="90" y="56" text-anchor="middle" class="tx" style="font:700 30px 'Mochiy Pop One',sans-serif">……!?</text>`, 'bob hide-sm');
    const drops = S('0 0 60 80', 'left:24vw;top:22vh;width:30px', '<path class="a2" opacity=".7" d="M30 4C44 30 54 44 54 56a24 24 0 0 1-48 0c0-12 10-26 24-52Z"/>', 'bob hide-sm');
    // Palco: amplificador, pedestal de microfone, cabo e palhetas nas cores da banda
    const amp = S('0 0 200 180', 'right:22vw;bottom:2vh;width:min(150px,26vw)', `
      <rect x="4" y="20" width="192" height="156" rx="10" fill="#2d2a4a"/><rect x="14" y="30" width="172" height="26" rx="4" fill="#47436e"/>
      ${[30, 60, 90, 120, 150].map((x) => `<circle cx="${x + 10}" cy="43" r="6" fill="#ffd166"/>`).join('')}
      <rect x="14" y="64" width="172" height="102" rx="6" fill="#1b1930"/>
      <g stroke="#3a375c" stroke-width="2">${Array.from({ length: 9 }, (_, i) => `<path d="M18 ${72 + i * 11}H182"/>`).join('')}</g>
      <rect x="70" y="2" width="60" height="20" rx="6" fill="none" stroke="#2d2a4a" stroke-width="6"/>`, 'hide-sm pulse');
    const mic = S('0 0 120 420', 'left:28vw;bottom:0;height:min(48vh,420px)', `
      <path d="M60 60V400M20 410L60 396L100 410" stroke="#2d2a4a" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/>
      <path d="M60 80L96 40" stroke="#2d2a4a" stroke-width="6" opacity=".55"/><rect x="88" y="10" width="22" height="40" rx="11" transform="rotate(40 99 30)" class="a1" opacity=".8"/>
      <path d="M60 200Q10 260 50 330Q90 380 40 420" class="sa2" stroke-width="4" fill="none" opacity=".6"/>`, 'hide-sm');
    const picks = [['#ff4f9a', 8, 30, 20], ['#ffd166', 40, 12, -30], ['#3fb6e0', 66, 64, 40], ['#e63946', 90, 40, -10], ['#ff4f9a', 54, 86, 15]].map(([c, x, y, r]) =>
      S('0 0 40 46', `left:${x}vw;top:${y}vh;width:28px;transform:rotate(${r}deg)`, `<path d="M20 44C8 30 2 20 2 12C2 4 10 2 20 2s18 2 18 10c0 8-6 18-18 32Z" fill="${c}" opacity=".85"/><path d="M12 10q8-4 16 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>`, 'bob hide-sm')).join('');
    return lights + guitar + mic + amp + box + bubble + drops + picks + kanji('音', 'right:-2vw;top:6vh');
  };

  W.apothecary = () => {
    // Palácio interno: telhados de beiral curvo, pilares vermelhos e portão
    const roof = (x, y, w, h) => `<path d="M${x - 30} ${y + h}Q${x - 14} ${y + h - 4} ${x - 6} ${y + h - 18}Q${x + w * .2} ${y} ${x + w / 2} ${y - 4}Q${x + w * .8} ${y} ${x + w + 6} ${y + h - 18}Q${x + w + 14} ${y + h - 4} ${x + w + 30} ${y + h}Z"/>`;
    const palace = S('0 0 1200 300', 'left:0;right:0;bottom:0;width:100%;height:min(36vh,320px)', `
      <defs>${glow('apg', 'var(--accent)', .45)}${glow('apl', '#ffb347', .6)}</defs>
      <ellipse cx="600" cy="230" rx="560" ry="200" fill="url(#apg)"/>
      <g class="sf">${roof(80, 150, 260, 40)}<rect x="90" y="190" width="240" height="110"/>${roof(860, 150, 260, 40)}<rect x="870" y="190" width="240" height="110"/></g>
      <g class="bgf">${roof(420, 40, 360, 56)}<rect x="440" y="96" width="320" height="30"/>${roof(400, 120, 400, 52)}<rect x="420" y="172" width="360" height="128"/>
        <rect x="0" y="250" width="1200" height="50"/>${roof(-20, 230, 420, 24)}${roof(800, 230, 420, 24)}</g>
      <g class="a1" opacity=".8">${[440, 500, 560, 620, 680, 740].map((x) => `<rect x="${x}" y="176" width="12" height="124"/>`).join('')}</g>
      <g fill="#d4af37" opacity=".7"><rect x="430" y="168" width="340" height="6"/><rect x="450" y="90" width="300" height="5"/><circle cx="600" cy="34" r="8"/></g>
      <g fill="#ffcf7a" opacity=".55">${[110, 160, 210, 260, 890, 940, 990, 1040].map((x) => `<rect x="${x}" y="215" width="22" height="30"/>`).join('')}</g>
      <rect x="566" y="200" width="68" height="100" fill="#000" opacity=".5"/>
      <text x="600" y="150" text-anchor="middle" fill="#d4af37" opacity=".85" style="font:800 30px 'Shippori Mincho',serif">後宮</text>`, '', 'xMidYMax slice');
    // Lanternas de papel penduradas
    const lantern = (x, len, s, d) => `<g class="sway" style="animation-delay:-${d}s"><path d="M${x} 0V${len}" stroke="#5a1c14" stroke-width="2"/>
      <ellipse cx="${x}" cy="${len + 34 * s}" rx="${60 * s}" ry="${60 * s}" fill="url(#apl)"/>
      <rect x="${x - 14 * s}" y="${len}" width="${28 * s}" height="${8 * s}" fill="#3a120d"/>
      <ellipse cx="${x}" cy="${len + 34 * s}" rx="${26 * s}" ry="${30 * s}" class="a1"/>
      <g stroke="#7a1d14" stroke-width="1.5" opacity=".6" fill="none"><ellipse cx="${x}" cy="${len + 34 * s}" rx="${13 * s}" ry="${30 * s}"/><path d="M${x} ${len + 4 * s}V${len + 64 * s}"/></g>
      <text x="${x}" y="${len + 42 * s}" text-anchor="middle" fill="#ffe1a8" style="font:700 ${f(20 * s)}px 'Shippori Mincho',serif">${['薬', '毒', '福', '花', '月'][d % 5]}</text>
      <rect x="${x - 14 * s}" y="${len + 62 * s}" width="${28 * s}" height="${8 * s}" fill="#3a120d"/>
      <path d="M${x} ${len + 70 * s}v${26 * s}" stroke="#d4af37" stroke-width="${4 * s}"/></g>`;
    const lanterns = S('0 0 1200 260', 'left:0;right:0;top:56px;width:100%;height:min(30vh,260px)', `
      <defs>${glow('apl', '#ffb347', .55)}</defs>
      <path d="M0 4Q600 40 1200 4" stroke="#5a1c14" stroke-width="3" fill="none"/>
      ${lantern(140, 30, 1, 0)}${lantern(330, 60, .8, 1)}${lantern(880, 50, .9, 2)}${lantern(1060, 26, 1.1, 3)}${lantern(1170, 70, .7, 4)}`, '', 'xMidYMin slice');
    // Galho de ameixeira em flor
    const blossom = (x, y, r) => `<g>${[0, 1, 2, 3, 4].map((k) => { const a = (k / 5) * Math.PI * 2 - Math.PI / 2; return `<circle cx="${f(x + r * .8 * Math.cos(a))}" cy="${f(y + r * .8 * Math.sin(a))}" r="${f(r * .62)}" fill="#f5b8c4"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="${f(r * .35)}" fill="#e2547f"/></g>`;
    const plum = S('0 0 420 300', 'left:-10px;top:56px;width:min(400px,60vw)', `
      <path d="M0 40Q120 60 200 120Q260 170 400 180M140 84Q170 30 240 20M230 140Q250 220 320 260" stroke="#3a1d16" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${[[90, 52, 14], [170, 96, 12], [210, 30, 11], [250, 150, 13], [330, 176, 12], [390, 172, 9], [300, 248, 11], [128, 70, 8], [236, 20, 8], [270, 200, 9]].map(([x, y, r]) => blossom(x, y, r)).join('')}`, 'faint');
    // Armário de remédios com gavetinhas
    const herbs = ['甘草', '人参', '当帰', '桂皮', '葛根', '芍薬', '麻黄', '陳皮', '大黄', '附子', '茯苓', '黄連'];
    const cabinet = S('0 0 220 300', 'left:-30px;top:40vh;width:min(210px,32vw)', `
      <rect width="220" height="300" rx="6" fill="#5a2e1c" opacity=".85"/>
      ${herbs.map((h, i) => { const x = 12 + (i % 3) * 68, y = 12 + Math.floor(i / 3) * 70; return `<rect x="${x}" y="${y}" width="62" height="62" rx="3" fill="#7a4428"/><rect x="${x + 12}" y="${y + 8}" width="38" height="20" fill="#f3e3c3"/><text x="${x + 31}" y="${y + 23}" text-anchor="middle" fill="#3a1d16" style="font:700 12px 'Shippori Mincho',serif">${h}</text><circle cx="${x + 31}" cy="${y + 44}" r="5" fill="#d4af37"/>`; }).join('')}`, 'hide-sm');
    // Pilão com ervas, xícara de chá (para provar veneno) e cabaça
    const mortar = S('0 0 260 180', 'right:3vw;bottom:min(30vh,250px);width:min(220px,34vw)', `
      <path d="M150 20L196 120" stroke="#8a6a50" stroke-width="14" stroke-linecap="round"/>
      <path d="M100 90h120q-6 70-60 78q-54-8-60-78Z" fill="#9c8f84"/><rect x="96" y="84" width="128" height="12" rx="6" fill="#b8ada2"/>
      <g fill="#4fae8f"><path d="M120 84q10-26 30-20q-6 20-30 20Z"/><path d="M196 84q-4-24 14-30q4 22-14 30Z"/><circle cx="170" cy="82" r="6" fill="#d9443a"/></g>
      <path d="M10 130h60q-4 40-30 42q-26-2-30-42Z" fill="#f3efe6"/><path d="M14 138h52" stroke="#4fae8f" stroke-width="3"/>
      <g class="stx" stroke-width="3" fill="none" opacity=".4" stroke-linecap="round"><path class="steam" d="M30 120q-8-10 0-20t0-18"/><path class="steam d2" d="M48 120q-8-10 0-20t0-18"/></g>
      <path d="M230 40q-14 0-14 16q0 10 8 14q-14 8-14 26q0 22 20 22t20-22q0-18-14-26q8-4 8-14q0-16-14-16Z" fill="#c8973a"/><path d="M226 34h8v-10h-8Z" fill="#5a2e1c"/><path d="M216 90h28" stroke="#d9443a" stroke-width="4"/>`, 'hide-md');
    const moon = S('0 0 300 300', 'right:-70px;top:22vh;width:min(280px,40vw)', `
      <circle cx="150" cy="150" r="140" fill="#000" opacity=".25"/><circle cx="150" cy="150" r="140" fill="none" stroke="#d4af37" stroke-width="8" opacity=".5"/>
      <circle cx="190" cy="110" r="40" fill="#ffe9b8" opacity=".55"/>
      <g stroke="#d4af37" stroke-width="5" fill="none" opacity=".45"><path d="M150 10V290M10 150H290M60 60h180v180H60Z M100 100h100v100H100Z M60 60l40 40M240 60l-40 40M60 240l40-40M240 240l-40-40"/></g>`, 'hide-sm');
    const scroll = S('0 0 90 330', 'left:24vw;top:16vh;width:56px', `
      <rect x="4" y="0" width="82" height="14" rx="7" fill="#3a1d16"/><rect x="12" y="12" width="66" height="304" fill="#f3e3c3" opacity=".85"/>
      <rect x="18" y="20" width="54" height="288" fill="none" stroke="#d9443a" stroke-width="2"/>
      <text x="45" y="90" text-anchor="middle" fill="#2a1414" style="font:800 46px 'Shippori Mincho',serif">薬</text>
      <text x="45" y="150" text-anchor="middle" fill="#2a1414" style="font:800 30px 'Shippori Mincho',serif">毒</text>
      <text x="45" y="196" text-anchor="middle" fill="#2a1414" style="font:800 30px 'Shippori Mincho',serif">妙</text>
      <rect x="32" y="250" width="26" height="26" fill="#d9443a"/><rect x="4" y="316" width="82" height="14" rx="7" fill="#3a1d16"/>`, 'hide-md sway');
    // Maços de ervas secando de cabeça para baixo, pendurados na corda
    const bundle = (x, len, kind, d) => {
      const col = { verde: ['#5f8f4a', '#7aa35a'], seca: ['#9a8a4a', '#b8a35e'], lavanda: ['#6d8a5a', '#a98fd6'], flor: ['#5f8f4a', '#f2c14e'] }[kind];
      let stems = '';
      for (let i = -3; i <= 3; i++) {
        const ex = x + i * 7, ey = len + 70 + (3 - Math.abs(i)) * 8;
        stems += `<path d="M${x} ${len + 10}Q${x + i * 3} ${len + 40} ${ex} ${ey}" stroke="${col[0]}" stroke-width="2" fill="none"/>`;
        for (let k = 1; k <= 3; k++) {
          const ly = len + 10 + (ey - len - 10) * (k / 3.3), lx = x + i * (2 + k * 1.6);
          stems += kind === 'lavanda' || kind === 'flor'
            ? `<circle cx="${f(lx)}" cy="${f(ly + 6)}" r="3.4" fill="${col[1]}"/>`
            : `<ellipse cx="${f(lx + (i < 0 ? -4 : 4))}" cy="${f(ly)}" rx="6" ry="3" transform="rotate(${i < 0 ? 40 : -40} ${f(lx)} ${f(ly)})" fill="${k % 2 ? col[0] : col[1]}"/>`;
        }
      }
      return `<g class="sway" style="animation-delay:-${d}s"><path d="M${x} 0V${len + 6}" stroke="#5a1c14" stroke-width="2"/>${stems}<rect x="${x - 7}" y="${len + 2}" width="14" height="9" rx="2" fill="#c9343a"/></g>`;
    };
    const drying = S('0 0 1200 260', 'left:0;right:0;top:56px;width:100%;height:min(30vh,260px)', `
      ${bundle(235, 18, 'verde', 1)}${bundle(430, 30, 'lavanda', 2)}${bundle(530, 22, 'seca', 3)}${bundle(670, 24, 'flor', 4)}${bundle(770, 32, 'verde', 5)}${bundle(980, 20, 'seca', 6)}`, '', 'xMidYMin slice');
    // Cesto com ginseng, cogumelos, folhas e um saquinho de remédio
    const basket = S('0 0 260 200', 'right:2vw;bottom:1vh;width:min(230px,36vw)', `
      <path d="M150 96Q140 40 156 20Q166 50 178 30Q174 60 186 52Q172 80 168 104Z" fill="#e8c890"/>
      <path d="M156 20q-6-14 6-18M168 34q8-10 16-6" stroke="#b08850" stroke-width="2" fill="none"/>
      <g fill="#c4553a"><path d="M60 98q0-30 26-30q26 0 26 30Z"/><path d="M96 100q0-20 18-20q18 0 18 20Z" fill="#d97a3a"/></g>
      <g fill="#fff" opacity=".85"><circle cx="76" cy="82" r="3"/><circle cx="92" cy="78" r="2.5"/><circle cx="114" cy="88" r="2"/></g>
      <rect x="80" y="96" width="12" height="16" fill="#f3e3c3"/><rect x="109" y="98" width="9" height="12" fill="#f3e3c3"/>
      <g fill="#5f8f4a"><path d="M40 100Q20 60 46 40Q56 74 40 100Z"/><path d="M200 100Q228 66 214 42Q194 70 200 100Z" fill="#7aa35a"/></g>
      <path d="M44 96Q40 70 46 44M202 98Q208 72 214 46" stroke="#3f6a32" stroke-width="2" fill="none"/>
      <path d="M20 100h220l-20 92H40Z" fill="#a8783e"/>
      <g stroke="#7a5428" stroke-width="3" fill="none">${[118, 138, 158, 178].map((y) => `<path d="M${24 + (y - 100) * .2} ${y}H${236 - (y - 100) * .2}"/>`).join('')}${[60, 100, 140, 180, 220].map((x) => `<path d="M${x} 100V192"/>`).join('')}</g>
      <path d="M14 96h232v10H14Z" fill="#7a5428"/>
      <path d="M226 150q-26 0-26 26q0 18 26 18q26 0 26-18q0-26-26-26Z" fill="#4fae8f"/><path d="M212 152q14-14 28 0" stroke="#d9443a" stroke-width="4" fill="none"/>
      <text x="226" y="184" text-anchor="middle" fill="#f3e3c3" style="font:700 14px 'Shippori Mincho',serif">薬</text>`);
    // Folhas medicinais com nervuras, espalhadas pelas laterais
    const leaf = (style, c, r) => S('0 0 60 100', `${style};width:38px;transform:rotate(${r}deg)`, `
      <path d="M30 4C56 30 56 70 30 96C4 70 4 30 30 4Z" fill="${c}" opacity=".7"/><path d="M30 10V96M30 36l12-10M30 52l14-10M30 68l12-10M30 36l-12-10M30 52l-14-10M30 68l-12-10" stroke="#2f4f26" stroke-width="2" fill="none" opacity=".6"/>`, 'bob hide-sm');
    const leaves = leaf('left:20vw;top:34vh', '#7aa35a', -30) + leaf('right:20vw;top:60vh', '#5f8f4a', 25) + leaf('left:6vw;bottom:32vh', '#8fb36a', 60);
    return palace + lanterns + drying + plum + moon + cabinet + scroll + mortar + basket + leaves + kanji('薬', 'right:-2vw;bottom:24vh');
  };

  // id do MAL → mundo
  const BY_ID = { 20: 'naruto', 38000: 'demonslayer', 40748: 'jjk', 50265: 'spy', 5114: 'fma', 16498: 'aot', 1535: 'deathnote', 44511: 'chainsaw', 21: 'onepiece', 30: 'eva', 52991: 'frieren', 47917: 'bocchi', 54492: 'apothecary' };

  // Liga cada tema curado ao seu mundo
  for (const [id, w] of Object.entries(BY_ID)) if (CATALOG_BY_ID[id]) CATALOG_BY_ID[id].theme.world = w;

  const cache = {};
  return {
    render: (w) => (W[w] ? (cache[w] ??= W[w]()) : ''),
    // Permite que outros arquivos (worlds2.js) registrem mundos usando os mesmos ajudantes
    define: (name, fn) => { W[name] = fn; },
    h: { S, glow, spiral, star, gear, ticks, kanji, f },
  };
})();
