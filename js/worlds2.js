// ===== Mais mundos + cenários por gênero (usa os ajudantes de scenes.js) =====
(() => {
  const { S, glow, spiral, star, gear, ticks, kanji, f } = Scenes.h;
  const D = Scenes.define;
  const range = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');

  // Trevo de N folhas (corações girados) — usado em Black Clover
  const clover = (cx, cy, r, n, fill) => range(n, (i) => {
    const a = (i * 360) / n;
    return `<path transform="rotate(${a} ${cx} ${cy})" d="M${cx} ${cy}C${cx - r * .9} ${cy - r * .5} ${cx - r * .7} ${cy - r * 1.3} ${cx} ${cy - r * .95}C${cx + r * .7} ${cy - r * 1.3} ${cx + r * .9} ${cy - r * .5} ${cx} ${cy}Z" fill="${fill}"/>`;
  });

  D('blackclover', () => {
    const grimoire = (style, leaves, cls) => S('0 0 200 240', style, `
      <defs>${glow('bcg', 'var(--accent2)', .5)}</defs><circle cx="100" cy="120" r="110" fill="url(#bcg)"/>
      <rect x="30" y="20" width="140" height="200" rx="8" fill="${leaves === 5 ? '#111' : '#5a3a22'}" stroke="#d4af37" stroke-width="4"/>
      <rect x="44" y="34" width="112" height="172" rx="4" fill="none" stroke="#d4af37" stroke-width="2" opacity=".6"/>
      ${clover(100, 120, 34, leaves, leaves === 5 ? '#2a2a2a' : '#3fbf6a')}
      ${leaves === 5 ? '<circle cx="100" cy="120" r="6" fill="#d33b2c"/>' : ''}
      ${clover(100, 120, 34, leaves, 'none').replace(/fill="none"/g, 'fill="none" stroke="#d4af37" stroke-width="2"')}
      <rect x="166" y="30" width="10" height="180" fill="#e8e0c8"/>`, cls);
    const sword = S('0 0 120 700', 'right:6vw;bottom:-40px;height:min(82vh,700px);transform:rotate(16deg)', `
      <path d="M30 40L90 40L96 470L60 520L24 470Z" fill="#2b2a2e" stroke="#555" stroke-width="3"/>
      <path d="M40 60L80 60L84 450L60 490L36 450Z" fill="#3a393e"/>
      <g fill="#6b4a2a" opacity=".6">${range(7, (i) => `<circle cx="${44 + (i * 13) % 36}" cy="${90 + i * 52}" r="${4 + i % 3}"/>`)}</g>
      <rect x="10" y="20" width="100" height="24" rx="4" fill="#1b1a1e" stroke="#555" stroke-width="2"/>
      <rect x="48" y="-90" width="24" height="112" fill="#3a2418"/>${range(5, (i) => `<path d="M48 ${-80 + i * 20}l24 10" stroke="#1a100a" stroke-width="3"/>`)}`, 'hide-sm');
    const wisps = S('0 0 600 400', 'left:-60px;bottom:-40px;width:min(640px,90vw)', `
      <g fill="none" stroke="#000" stroke-linecap="round" opacity=".85">
        <path d="M0 400Q80 260 40 160Q20 80 90 30" stroke-width="40"/><path d="M60 400Q180 300 160 200Q150 120 230 90" stroke-width="28"/>
        <path d="M120 400Q300 340 340 250Q370 190 450 200" stroke-width="22"/></g>
      <g fill="none" stroke="#d33b2c" stroke-width="2" opacity=".55"><path d="M0 400Q80 260 40 160Q20 80 90 30"/><path d="M120 400Q300 340 340 250Q370 190 450 200"/></g>`, 'sway slow');
    let castle = '';
    [[60, 40, 120], [130, 30, 170], [190, 50, 230], [270, 30, 180], [330, 40, 120], [880, 40, 130], [940, 30, 200], [1000, 60, 250], [1090, 30, 170], [1150, 40, 110]].forEach(([x, w, h]) => {
      castle += `<rect x="${x}" y="${300 - h}" width="${w}" height="${h}"/><path d="M${x - 6} ${300 - h}L${x + w / 2} ${250 - h}L${x + w + 6} ${300 - h}Z"/>`;
    });
    const kingdom = S('0 0 1200 300', 'left:0;right:0;bottom:0;width:100%;height:min(32vh,280px)', `
      <defs>${glow('bck', 'var(--accent2)', .35)}</defs><ellipse cx="1000" cy="200" rx="300" ry="160" fill="url(#bck)"/>
      <g class="sf">${castle}</g><rect y="290" width="1200" height="10" class="sf"/>`, '', 'xMidYMax slice');
    const circle = S('0 0 300 300', 'left:28vw;top:8vh;width:min(220px,36vw)', `
      <g class="sa2" fill="none" opacity=".35"><circle cx="150" cy="150" r="140" stroke-width="3"/><circle cx="150" cy="150" r="100"/><path d="${star(150, 150, 100, 40, 5)}"/><path d="${ticks(150, 150, 110, 128, 40)}"/></g>`, 'spin-slow');
    return kingdom + circle + wisps + grimoire('left:3vw;top:20vh;width:min(150px,26vw);transform:rotate(-8deg)', 5, 'bob')
      + grimoire('right:24vw;top:10vh;width:min(80px,16vw);transform:rotate(10deg)', 4, 'bob hide-sm faint') + sword + kanji('魔', 'right:-2vw;top:6vh');
  });

  D('mha', () => {
    const rays = S('0 0 800 800', 'right:-20vw;top:-20vh;width:min(1100px,150vw)', `
      <g class="a2" opacity=".08">${range(24, (i) => { const a = (i / 24) * Math.PI * 2, b = a + .07; return `<path d="M400 400L${f(400 + 800 * Math.cos(a))} ${f(400 + 800 * Math.sin(a))}L${f(400 + 800 * Math.cos(b))} ${f(400 + 800 * Math.sin(b))}Z"/>`; })}</g>`, 'spin-slow');
    const burst = (style, txt, fill, rot, cls = '') => S('0 0 320 200', `${style};transform:rotate(${rot}deg)`, `
      <path d="${star(160, 100, 150, 96, 14)}" fill="${fill}" stroke="#111" stroke-width="5" transform="scale(1 .66) translate(0 52)"/>
      <text x="160" y="118" text-anchor="middle" fill="#fff" stroke="#111" stroke-width="3" paint-order="stroke" style="font:64px 'Bangers',cursive;letter-spacing:3px">${txt}</text>`, `pulse ${cls}`);
    const fist = S('0 0 300 260', 'left:2vw;bottom:6vh;width:min(230px,36vw)', `
      <path d="M0 150L110 120L110 190L0 210Z" fill="#2f6b4f"/><path d="M0 160h120M0 190h120" stroke="#1f4a36" stroke-width="4"/>
      <rect x="110" y="96" width="150" height="120" rx="34" fill="#f2c9a0" stroke="#111" stroke-width="5"/>
      ${range(4, (i) => `<path d="M${150 + i * 28} 98v40" stroke="#111" stroke-width="4"/>`)}<path d="M120 160q50 20 90 0" stroke="#111" stroke-width="4" fill="none"/>
      <g stroke="var(--accent2)" stroke-width="6" stroke-linecap="round" class="flick"><path d="M270 80l26-30M280 150h20M270 220l26 26"/></g>
      <g fill="none" stroke="#3fa9f5" stroke-width="3" class="flick d2"><path d="M130 90l20-26l10 18l20-30M220 230l16 22l10-14l20 20"/></g>`, 'bob hide-sm');
    const dots = S('0 0 300 300', 'left:-40px;top:8vh;width:min(300px,40vw)', `<g class="a1" opacity=".22">${range(100, (i) => { const x = (i % 10) * 30 + 15, y = Math.floor(i / 10) * 30 + 15, r = 13 * (1 - Math.hypot(x, y) / 420); return r > 1 ? `<circle cx="${x}" cy="${y}" r="${f(r)}"/>` : ''; })}</g>`, '');
    const school = S('0 0 1200 220', 'left:0;right:0;bottom:0;width:100%;height:min(24vh,200px)', `
      <g class="sf"><rect x="760" y="20" width="60" height="200"/><rect x="830" y="0" width="60" height="220"/><rect x="900" y="20" width="60" height="200"/>
      <rect x="0" y="150" width="1200" height="70"/><rect x="100" y="110" width="220" height="110"/><rect x="420" y="130" width="200" height="90"/></g>
      <g fill="#7ec8ff" opacity=".35">${range(18, (i) => `<rect x="${770 + (i % 3) * 70}" y="${40 + Math.floor(i / 3) * 28}" width="40" height="14"/>`)}</g>`, '', 'xMidYMax slice');
    return rays + dots + school + burst('right:4vw;top:18vh;width:min(260px,40vw)', 'SMASH!', 'var(--accent)', -10)
      + burst('left:26vw;top:9vh;width:min(150px,24vw)', 'PLUS ULTRA', 'var(--accent2)', 6, 'hide-sm') + fist + kanji('英雄', 'right:-2vw;bottom:20vh;writing-mode:vertical-rl');
  });

  D('hxh', () => {
    let trees = '';
    for (let x = -20; x < 1220; x += 46) { const h = 120 + (x * 17) % 90; trees += `<path d="M${x} 300L${x + 30} ${300 - h}L${x + 60} 300Z"/>`; }
    const forest = S('0 0 1200 300', 'left:0;right:0;bottom:0;width:100%;height:min(30vh,270px)', `<g class="sf" opacity=".9">${trees}</g><rect y="280" width="1200" height="20" class="bgf"/>`, '', 'xMidYMax slice');
    const card = S('0 0 300 190', 'right:3vw;top:16vh;width:min(250px,38vw);transform:rotate(8deg)', `
      <rect width="300" height="190" rx="14" fill="#e9eef2" stroke="#9aa6b2" stroke-width="3"/><rect y="30" width="300" height="36" fill="#2b2f36"/>
      <circle cx="70" cy="128" r="38" fill="none" stroke="#c0392b" stroke-width="6"/><path d="M52 112v32M88 112v32M52 128h36" stroke="#c0392b" stroke-width="7"/>
      <text x="200" y="120" text-anchor="middle" fill="#2b2f36" style="font:28px 'Anton',sans-serif;letter-spacing:3px">HUNTER</text>
      <path d="M140 140h120M140 156h90" stroke="#9aa6b2" stroke-width="4"/>`, 'bob');
    const rod = S('0 0 300 500', 'left:1vw;top:18vh;height:min(60vh,520px)', `
      <path d="M40 500L220 20" stroke="#6b4a2a" stroke-width="10" stroke-linecap="round"/><circle cx="70" cy="420" r="18" fill="#444"/>
      <path d="M220 20Q290 140 260 330" stroke="var(--text)" stroke-width="1.5" fill="none" opacity=".5"/>
      <g class="bob"><path d="M260 330a14 14 0 1 0 0.1 0Z" fill="#e8433a"/><path d="M246 330h28" stroke="#fff" stroke-width="4"/></g>`, 'hide-sm');
    const yoyo = (x, len, d) => `<g class="sway" style="animation-delay:-${d}s"><path d="M${x} 0V${len}" stroke="var(--text)" stroke-width="1.5" opacity=".5"/><circle cx="${x}" cy="${len + 22}" r="22" fill="#5b6470"/><circle cx="${x}" cy="${len + 22}" r="12" fill="#2b2f36"/><circle cx="${x}" cy="${len + 22}" r="3" fill="#cfd6de"/></g>`;
    const yoyos = S('0 0 200 300', 'left:24vw;top:56px;width:min(140px,22vw)', yoyo(60, 120, 0) + yoyo(140, 70, 1.5), 'hide-sm');
    const aura = S('0 0 400 400', 'right:12vw;bottom:14vh;width:min(320px,46vw)', `
      <g fill="none" stroke="var(--accent)" stroke-width="3" opacity=".4" class="pulse">
        <path d="M200 380Q90 360 100 250Q110 180 150 140Q140 200 180 210Q160 120 220 60Q220 150 260 170Q270 130 300 120Q310 200 300 260Q300 360 200 380Z"/>
        <path d="M200 350Q130 330 140 260Q150 210 175 185Q175 230 205 235Q195 170 230 120Q235 190 262 200Q280 230 270 270Q262 340 200 350Z"/></g>`, 'hide-sm');
    return forest + aura + card + rod + yoyos + kanji('念', 'left:-2vw;top:8vh');
  });

  D('opm', () => {
    const lines = S('0 0 1000 600', 'left:0;top:0;width:100%;height:100vh', `<g stroke="#2a2420" opacity=".07">${range(40, (i) => `<path d="M1000 ${i * 15}L${f(300 + (i % 5) * 60)} ${f(300 + (i - 20) * 4)}" stroke-width="${2 + i % 3}"/>`)}</g>`, '', 'none');
    const fist = S('0 0 400 300', 'right:-40px;top:20vh;width:min(380px,56vw)', `
      <path d="M400 110H220V200H400Z" fill="#f2b705"/><path d="M220 100h40v110h-40Z" fill="#fff"/>
      <rect x="40" y="80" width="200" height="150" rx="48" fill="#e23b2e" stroke="#2a2420" stroke-width="6"/>
      ${range(4, (i) => `<path d="M${80 + i * 34} 82v52" stroke="#2a2420" stroke-width="5"/>`)}
      <path d="M50 170q60 26 120 0" stroke="#2a2420" stroke-width="5" fill="none"/>
      <path d="${star(30, 155, 70, 30, 12)}" fill="#fff" stroke="#2a2420" stroke-width="4" class="pulse"/>`, '');
    let city = '';
    [[0, 60, 140], [70, 80, 190], [160, 50, 120], [230, 90, 220], [340, 70, 160], [700, 60, 150], [770, 100, 200], [880, 60, 130], [950, 80, 240], [1050, 70, 170], [1130, 70, 130]].forEach(([x, w, h], i) => {
      const t = 300 - h; // prédios quebrados têm o topo irregular
      city += i % 3 === 1
        ? `<path d="M${x} 300V${t + 20}L${f(x + w * .3)} ${t}L${f(x + w * .6)} ${t + 26}L${x + w} ${t + 10}V300Z"/>`
        : `<path d="M${x} 300V${t}H${x + w}V300Z"/>`;
    });
    const town = S('0 0 1200 300', 'left:0;right:0;bottom:0;width:100%;height:min(30vh,260px)', `
      <g fill="#b9ad9c" opacity=".55">${city}</g><ellipse cx="560" cy="300" rx="180" ry="40" fill="#8a7a66" opacity=".6"/>
      <g fill="#8a7a66" opacity=".7">${range(8, (i) => `<rect x="${420 + i * 34}" y="${250 - (i % 3) * 14}" width="${10 + i % 3 * 4}" height="10" transform="rotate(${i * 25} ${425 + i * 34} 255)"/>`)}</g>`, '', 'xMidYMax slice');
    const flyer = S('0 0 200 260', 'left:2vw;top:22vh;width:min(150px,26vw);transform:rotate(-8deg)', `
      <rect width="200" height="260" fill="#fff" stroke="#2a2420" stroke-width="3"/><rect y="0" width="200" height="56" fill="#e23b2e"/>
      <text x="100" y="40" text-anchor="middle" fill="#fff" style="font:30px 'Bangers',cursive;letter-spacing:2px">PROMOÇÃO!</text>
      <ellipse cx="70" cy="120" rx="30" ry="38" fill="#f6f1e4" stroke="#2a2420" stroke-width="3"/>
      <text x="140" y="118" text-anchor="middle" fill="#e23b2e" style="font:34px 'Bangers',cursive">-50%</text>
      <text x="100" y="200" text-anchor="middle" fill="#2a2420" style="font:22px 'Bangers',cursive">OVOS · HOJE · 17H</text>
      <path d="M20 224h160M20 240h110" stroke="#cfc6b8" stroke-width="5"/>`, 'bob hide-sm');
    const ok = S('0 0 200 120', 'left:28vw;top:10vh;width:min(140px,22vw)', `<text x="100" y="96" text-anchor="middle" fill="#2a2420" opacity=".15" style="font:110px 'Bangers',cursive">OK</text>`, 'hide-sm');
    return lines + town + flyer + ok + fist + kanji('拳', 'left:-2vw;bottom:18vh');
  });

  D('ghoul', () => {
    const lily = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V120" stroke="#3a5a2a" stroke-width="3"/>
      ${range(6, (i) => { const a = (i / 6) * 360; return `<path transform="rotate(${a})" d="M0 0Q14 -20 6 -46Q30 -40 40 -60" stroke="#d1102f" stroke-width="3.5" fill="none" stroke-linecap="round"/>`; })}
      ${range(6, (i) => { const a = (i / 6) * 360 + 20; return `<path transform="rotate(${a})" d="M0 0Q4 -30 -10 -58" stroke="#ff5a6e" stroke-width="1.5" fill="none"/>`; })}</g>`;
    const field = S('0 0 1200 220', 'left:0;right:0;bottom:0;width:100%;height:min(24vh,210px)', `${range(22, (i) => lily(30 + i * 55 + (i % 3) * 8, 110 + (i % 4) * 22, .7 + (i % 3) * .15))}`, '', 'xMidYMax slice');
    const kagune = S('0 0 500 700', 'left:-80px;top:10vh;height:min(90vh,760px)', `
      ${[[0, 26], [60, 20], [120, 16], [-40, 22]].map(([dx, w], i) => `<g class="sway" style="animation-delay:-${i}s"><path d="M${60 + dx} 700Q${180 + dx} 520 ${120 + dx} 380Q${40 + dx} 220 ${220 + dx} 60" stroke="#8a0a1e" stroke-width="${w}" fill="none" stroke-linecap="round"/>
        <path d="M${60 + dx} 700Q${180 + dx} 520 ${120 + dx} 380Q${40 + dx} 220 ${220 + dx} 60" stroke="#ff2a45" stroke-width="${w * .25}" fill="none" stroke-dasharray="18 22" opacity=".8"/></g>`).join('')}`, 'faint');
    const cup = S('0 0 200 200', 'right:4vw;bottom:min(24vh,200px);width:min(140px,24vw)', `
      <g class="stx" stroke-width="4" fill="none" opacity=".35" stroke-linecap="round"><path class="steam" d="M80 60q-10-14 0-26t0-24"/><path class="steam d2" d="M110 60q-10-14 0-26t0-24"/></g>
      <path d="M40 80h120q-4 80-60 84q-56-4-60-84Z" fill="#efe6dc"/><path d="M160 96q30 0 26 28q-4 22-34 20" stroke="#efe6dc" stroke-width="10" fill="none"/>
      <ellipse cx="100" cy="82" rx="60" ry="10" fill="#3a2418"/><ellipse cx="100" cy="176" rx="80" ry="12" fill="#cfc4b8"/>`, 'hide-sm');
    const mask = S('0 0 200 240', 'right:3vw;top:16vh;width:min(150px,24vw);transform:rotate(8deg)', `
      <path d="M100 6C40 6 16 60 20 120C24 190 60 234 100 234C140 234 176 190 180 120C184 60 160 6 100 6Z" fill="#1a1416" stroke="#5a4a50" stroke-width="3"/>
      <ellipse cx="66" cy="104" rx="26" ry="18" fill="#e8e6e3"/><circle cx="66" cy="104" r="9" fill="#d1102f"/><circle cx="66" cy="104" r="4" fill="#000"/>
      <path d="M118 90h50q-4 30-50 30Z" fill="#000" stroke="#5a4a50" stroke-width="2"/>
      <path d="M50 170Q100 196 150 170" stroke="#e8e6e3" stroke-width="3" fill="none"/>${range(9, (i) => `<path d="M${58 + i * 11} ${172 + Math.sin(i / 8 * Math.PI) * 12}v12" stroke="#e8e6e3" stroke-width="3"/>`)}`, 'hide-sm bob');
    const drips = S('0 0 1200 120', 'left:0;right:0;top:56px;width:100%;height:90px', `<g class="a1" opacity=".5">${range(14, (i) => { const x = 40 + i * 86 + (i % 3) * 13, h = 20 + (i * 37) % 70; return `<path d="M${x - 8} 0h16v${h}a8 8 0 0 1-16 0Z"/>`; })}</g>`, '', 'none');
    return drips + field + kagune + cup + mask + kanji('喰', 'right:-2vw;bottom:22vh');
  });

  D('silentvoice', () => {
    const koi = (c, spot) => `<g><path d="M0 20Q30 0 70 14Q90 20 100 10L96 20L100 30Q90 20 70 26Q30 40 0 20Z" fill="${c}"/><circle cx="16" cy="18" r="2.5" fill="#222"/>${spot}<path d="M40 24l10 12l4-12Z" fill="${c}" opacity=".8"/></g>`;
    const pond = S('0 0 1200 220', 'left:0;right:0;bottom:0;width:100%;height:min(26vh,230px)', `
      <rect width="1200" height="220" fill="#3f8fc9" opacity=".18"/>
      <g fill="none" stroke="#fff" stroke-width="2" opacity=".5">${range(6, (i) => `<ellipse cx="${150 + i * 190}" cy="${70 + (i % 3) * 40}" rx="${40 + i % 3 * 16}" ry="${10 + i % 2 * 4}" class="pulse"/>`)}</g>
      <g fill="#5f9f5a" opacity=".6">${range(5, (i) => `<path d="M${80 + i * 260} ${150 - (i % 2) * 40}a34 22 0 1 0 1 0Z"/>`)}</g>`, '', 'xMidYMax slice');
    const fish = [['#f28c38', '<circle cx="50" cy="16" r="6" fill="#fff"/>', 0, 76], ['#ffffff', '<circle cx="40" cy="18" r="7" fill="#e23b2e"/>', 1, 82], ['#e23b2e', '<circle cx="58" cy="20" r="5" fill="#fff"/>', 2, 88]].map(([c, s, i, y]) =>
      S('0 0 100 40', `left:0;top:${y}vh;width:${80 - i * 10}px;animation-duration:${30 + i * 8}s;animation-delay:-${i * 11}s`, koi(c, s), 'fly')).join('');
    const bridge = S('0 0 1200 120', 'left:0;right:0;bottom:min(24vh,210px);width:100%;height:min(12vh,100px)', `
      <g class="a1" opacity=".35"><rect y="20" width="1200" height="10"/><rect y="70" width="1200" height="8"/>${range(25, (i) => `<rect x="${i * 50}" y="20" width="8" height="100"/>`)}</g>`, 'hide-sm', 'none');
    const notebook = S('0 0 220 180', 'right:4vw;top:18vh;width:min(180px,30vw);transform:rotate(-8deg)', `
      <rect x="10" y="10" width="200" height="160" rx="6" fill="#fff" stroke="#9fb6c8" stroke-width="3"/><path d="M110 10v160" stroke="#9fb6c8" stroke-width="2"/>
      <g stroke="#cfdbe5" stroke-width="2">${range(7, (i) => `<path d="M24 ${40 + i * 18}H100M120 ${40 + i * 18}H196"/>`)}</g>
      <text x="62" y="70" text-anchor="middle" fill="#3f8fc9" style="font:italic 700 18px 'Cormorant Garamond',serif">Olá!</text>
      <text x="152" y="88" text-anchor="middle" fill="#ef8fae" style="font:italic 700 16px 'Cormorant Garamond',serif">amigos?</text>
      <ellipse cx="160" cy="140" rx="30" ry="16" fill="#3f8fc9" opacity=".15"/>`, 'bob hide-md');
    const hands = S('0 0 200 200', 'left:3vw;top:24vh;width:min(130px,22vw)', `
      <g fill="none" stroke="#3f8fc9" stroke-width="4" stroke-linecap="round" opacity=".45">
        <path d="M60 180V110M60 110V40M80 110V30M100 110V36M120 116V60M60 140Q40 120 30 96"/>
        <path d="M60 180q30 10 60-10V110"/></g>
      <path d="M140 40q20 10 30 0M150 70q20 10 30 0" stroke="#ef8fae" stroke-width="4" fill="none" class="flick"/>`, 'hide-sm');
    return pond + bridge + fish + notebook + hands + kanji('声', 'right:-2vw;top:8vh');
  });

  D('sao', () => {
    let tiers = '';
    for (let i = 0; i < 9; i++) { const w = 260 - i * 26, y = 40 + i * 24; tiers += `<path d="M${200 - w / 2} ${y}h${w}l-10 22h-${w - 20}Z" opacity="${f(.85 - i * .05)}"/>`; }
    const castle = S('0 0 400 320', 'right:2vw;top:12vh;width:min(330px,46vw)', `
      <defs>${glow('saog', 'var(--accent)', .5)}</defs><ellipse cx="200" cy="140" rx="200" ry="150" fill="url(#saog)"/>
      <g class="sf" stroke="var(--accent)" stroke-width="1.5">${tiers}<path d="M120 260L200 316L280 260Z"/></g>
      <g fill="#7ec8ff" opacity=".7">${range(14, (i) => `<rect x="${130 + (i * 23) % 140}" y="${50 + Math.floor(i / 2) * 26}" width="4" height="6"/>`)}</g>`, 'bob');
    const hud = S('0 0 360 80', 'left:2vw;top:76px;width:min(330px,60vw)', `
      <path d="M4 10h280l20 20H4Z" fill="#000" opacity=".45" stroke="var(--accent)" stroke-width="2"/>
      <text x="14" y="26" fill="var(--text)" style="font:700 13px 'Orbitron',sans-serif">JOGADOR</text>
      <rect x="100" y="16" width="190" height="10" fill="#1d2b3d"/><rect x="100" y="16" width="150" height="10" fill="#5ee05e" class="pulse"/>
      <text x="16" y="56" fill="var(--accent)" style="font:700 12px 'Orbitron',sans-serif">HP 3584/4200 · LV 78</text>`, '');
    const menu = S('0 0 200 260', 'left:2vw;top:30vh;width:min(150px,24vw)', `
      ${['ITENS', 'HABILID.', 'MAPA', 'AMIGOS', 'SAIR'].map((t, i) => `<g transform="translate(0 ${i * 50})"><rect x="0" y="0" width="190" height="40" rx="20" fill="#e8f2ff" opacity="${i === 4 ? .35 : .85}"/><circle cx="22" cy="20" r="12" fill="${i === 4 ? '#e23b2e' : 'var(--accent)'}"/><text x="46" y="26" fill="#0e1b2e" style="font:700 14px 'Orbitron',sans-serif">${t}</text></g>`).join('')}`, 'hide-sm');
    const swords = S('0 0 240 300', 'left:24vw;bottom:2vh;width:min(170px,26vw)', `
      <g transform="rotate(-30 120 150)"><rect x="110" y="0" width="20" height="220" fill="#111" stroke="#3a4a5a" stroke-width="2"/><rect x="80" y="220" width="80" height="12" fill="#222"/><rect x="112" y="232" width="16" height="60" fill="#333"/></g>
      <g transform="rotate(30 120 150)"><rect x="110" y="0" width="20" height="220" fill="#e8f2ff" stroke="#9fb6c8" stroke-width="2"/><rect x="80" y="220" width="80" height="12" fill="#7ec8ff"/><rect x="112" y="232" width="16" height="60" fill="#5a6a7a"/></g>`, 'hide-sm');
    return castle + hud + menu + swords + kanji('剣', 'left:-2vw;bottom:4vh');
  });

  D('yourname', () => {
    const comet = S('0 0 1200 500', 'left:0;top:0;width:100%;height:70vh', `
      <defs><linearGradient id="ynt" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient>
      <linearGradient id="ynt2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--accent);stop-opacity:0"/><stop offset="1" style="stop-color:var(--accent);stop-opacity:.8"/></linearGradient></defs>
      <path d="M1200 0L760 330" stroke="url(#ynt)" stroke-width="8" stroke-linecap="round"/><circle cx="760" cy="330" r="9" fill="#fff"/>
      <path d="M1100 0L640 380" stroke="url(#ynt2)" stroke-width="5" stroke-linecap="round" class="pulse"/><circle cx="640" cy="380" r="6" fill="var(--accent)"/>
      <g fill="#fff">${range(60, (i) => `<circle cx="${(i * 197) % 1200}" cy="${(i * 89) % 420}" r="${1 + i % 3 * .6}" class="${i % 4 ? '' : 'twinkle'}" opacity=".7"/>`)}</g>`, '', 'none');
    const land = S('0 0 1200 300', 'left:0;right:0;bottom:0;width:100%;height:min(32vh,290px)', `
      <path class="bgf" d="M0 300V180Q200 120 360 170Q500 100 640 160Q800 90 960 150Q1100 120 1200 160V300Z"/>
      <ellipse cx="600" cy="245" rx="230" ry="30" fill="#7ec8ff" opacity=".35"/>
      <g class="bgf"><path d="M880 150h60v-30h-60Z"/><path d="M870 122h80l-40-24Z"/><rect x="200" y="140" width="6" height="40"/><rect x="236" y="140" width="6" height="40"/><path d="M190 140h62v6h-62Z M194 150h54v4h-54Z" fill="#c9343a"/></g>
      <g fill="#ffcf7a" opacity=".6">${range(10, (i) => `<rect x="${60 + i * 117}" y="${230 + (i % 3) * 14}" width="5" height="6"/>`)}</g>`, '', 'xMidYMax slice');
    const cord = S('0 0 300 200', 'left:2vw;top:22vh;width:min(230px,36vw)', `
      <path d="M10 100C60 20 120 180 170 100S260 40 290 90" stroke="#d1253f" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M10 100C60 20 120 180 170 100S260 40 290 90" stroke="#ff8a9e" stroke-width="3" fill="none" stroke-dasharray="6 8"/>
      <circle cx="290" cy="90" r="9" fill="#d1253f"/><path d="M290 90l6 30M290 90l-4 32" stroke="#d1253f" stroke-width="3"/>`, 'sway hide-sm');
    return comet + land + cord + kanji('君', 'right:-2vw;top:24vh');
  });

  D('conan', () => {
    const tape = (style, rot) => S('0 0 1200 50', `${style};transform:rotate(${rot}deg)`, `<rect width="1200" height="50" fill="#f2c94c" opacity=".8"/>
      <g fill="#111">${range(8, (i) => `<text x="${20 + i * 150}" y="34" style="font:24px 'Special Elite',monospace">NÃO ULTRAPASSE</text>`)}</g>`, '', 'none');
    const lens = S('0 0 220 220', 'right:3vw;top:20vh;width:min(190px,30vw)', `
      <circle cx="90" cy="90" r="64" fill="#7ec8ff" opacity=".12"/><circle cx="90" cy="90" r="64" fill="none" stroke="#c8a45a" stroke-width="12"/>
      <path d="M136 136L206 206" stroke="#5a3a22" stroke-width="22" stroke-linecap="round"/><path d="M58 64q14-18 36-18" stroke="#fff" stroke-width="6" fill="none" opacity=".4"/>`, 'bob');
    const bow = S('0 0 160 90', 'left:3vw;top:24vh;width:min(120px,22vw)', `
      <path d="M80 45L10 10Q0 45 10 80Z M80 45L150 10Q160 45 150 80Z" fill="#d93a3a" stroke="#7a1414" stroke-width="3"/>
      <rect x="66" y="30" width="28" height="30" rx="6" fill="#b02020"/><circle cx="80" cy="45" r="5" fill="#222"/>`, 'pulse hide-sm');
    const prints = S('0 0 300 600', 'left:18vw;bottom:0;height:min(60vh,520px)', `<g class="tx" opacity=".12">${range(8, (i) => `<ellipse cx="${i % 2 ? 180 : 120}" cy="${560 - i * 70}" rx="16" ry="26"/>`)}</g>`, 'hide-sm');
    const chalk = S('0 0 300 200', 'right:20vw;bottom:2vh;width:min(240px,36vw)', `
      <path d="M40 120Q60 80 100 90L130 60Q150 50 160 70L170 90Q220 80 260 100Q240 120 200 116L190 150Q180 176 160 160L150 130Q110 150 80 140Q50 160 40 120Z" fill="none" stroke="#fff" stroke-width="4" opacity=".4" stroke-dasharray="10 6"/>`, 'hide-md');
    const watch = S('0 0 140 140', 'left:30vw;top:8vh;width:min(90px,16vw)', `
      <rect x="10" y="40" width="120" height="60" rx="10" fill="#2a2f3a"/><circle cx="70" cy="70" r="34" fill="#e8eef6" stroke="#9aa8c4" stroke-width="4"/>
      <path d="M70 70V48M70 70l16 8" stroke="#2a2f3a" stroke-width="4" stroke-linecap="round"/><path d="M70 36l-10-14h20Z" fill="#d93a3a"/>`, 'hide-sm');
    return prints + tape('left:-5vw;top:72px;width:110vw;height:34px', -2) + tape('left:-5vw;bottom:1vh;width:110vw;height:30px', 2) + lens + bow + chalk + watch + kanji('謎', 'left:-2vw;top:40vh');
  });

  D('jojo', () => {
    const go = (style, size, cls) => `<div class="sc sc-go ${cls}" style="${style};font-size:${size}">ゴゴゴゴ</div>`;
    const deco = S('0 0 1200 600', 'left:0;top:0;width:100%;height:100vh', `
      <g fill="none" stroke="var(--accent)" opacity=".1" stroke-width="3">${range(10, (i) => `<path d="M0 ${600 - i * 60}L${300 + i * 40} 0"/><path d="M1200 ${600 - i * 60}L${900 - i * 40} 0"/>`)}</g>`, '', 'none');
    const ball = (style, d) => S('0 0 200 200', style, `
      <defs><radialGradient id="jb${d}" cx=".35" cy=".35"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#b8c0cc"/><stop offset="1" stop-color="#5a6270"/></radialGradient></defs>
      <circle cx="100" cy="100" r="90" fill="url(#jb${d})"/><path d="${spiral(100, 100, 3.4, 26)}" stroke="#f2c12e" stroke-width="5" fill="none" class="spin-fast" style="transform-origin:100px 100px"/>`, 'bob');
    const shoe = S('0 0 200 200', 'left:3vw;bottom:8vh;width:min(150px,26vw);transform:rotate(-20deg)', `
      <path d="M40 180V90A60 60 0 0 1 160 90V180h-34V92A26 26 0 0 0 74 92V180Z" fill="#9aa1ab" stroke="#5a6270" stroke-width="4"/>
      ${range(6, (i) => { const a = Math.PI * (1 + i / 5); return `<circle cx="${f(100 + 46 * Math.cos(a))}" cy="${f(92 + 46 * Math.sin(a))}" r="5" fill="#3a4048"/>`; })}`, 'hide-sm');
    const starmark = S('0 0 100 100', 'right:24vw;top:12vh;width:60px', `<path d="${star(50, 50, 46, 19, 5)}" fill="var(--accent)" stroke="#000" stroke-width="3"/>`, 'pulse hide-sm');
    return deco + go('left:2vw;top:20vh', 'clamp(40px,6vw,90px)', 'g1') + go('right:3vw;top:44vh', 'clamp(30px,4vw,64px)', 'g2') + go('left:22vw;bottom:6vh', 'clamp(30px,4vw,60px)', 'g3 hide-sm')
      + ball('right:4vw;top:14vh;width:min(130px,22vw)', 1) + ball('right:16vw;bottom:10vh;width:min(80px,14vw)', 2) + shoe + starmark + kanji('奇', 'left:-2vw;top:4vh');
  });

  D('bluebox', () => {
    const windows = S('0 0 1200 400', 'left:0;top:0;width:100%;height:60vh', `
      <g fill="#fff" opacity=".55">${range(5, (i) => `<rect x="${60 + i * 240}" y="20" width="160" height="120" rx="4"/>`)}</g>
      <g stroke="#cfe3f5" stroke-width="6">${range(5, (i) => `<path d="M${140 + i * 240} 20v120M${60 + i * 240} 80h160"/>`)}</g>
      <g fill="#fff" opacity=".22">${range(5, (i) => `<path d="M${60 + i * 240} 140h160L${260 + i * 240} 400H${110 + i * 240}Z"/>`)}</g>`, '', 'xMidYMin slice');
    const floor = S('0 0 1200 200', 'left:0;right:0;bottom:0;width:100%;height:min(22vh,190px)', `
      <rect width="1200" height="200" fill="#e0b47a" opacity=".55"/>
      <g stroke="#c8935a" stroke-width="2" opacity=".6">${range(30, (i) => `<path d="M${i * 40} 0V200"/>`)}</g>
      <path d="M0 60H1200M300 60V200M900 60V200" stroke="#2f7fd6" stroke-width="6" opacity=".6"/><ellipse cx="600" cy="140" rx="160" ry="50" fill="none" stroke="#f2994a" stroke-width="6" opacity=".7"/>`, '', 'xMidYMax slice');
    const hoop = S('0 0 200 300', 'right:3vw;top:14vh;width:min(160px,26vw)', `
      <rect x="10" y="10" width="180" height="120" rx="6" fill="#fff" stroke="#2f7fd6" stroke-width="5"/><rect x="66" y="60" width="68" height="50" fill="none" stroke="#e23b2e" stroke-width="5"/>
      <ellipse cx="100" cy="132" rx="44" ry="8" fill="none" stroke="#f2994a" stroke-width="6"/>
      <g stroke="#fff" stroke-width="2" opacity=".9">${range(6, (i) => `<path d="M${60 + i * 16} 134L${70 + i * 12} 196"/>`)}<path d="M66 160h68M70 182h60"/></g>`, 'hide-sm');
    const ball = S('0 0 100 100', 'right:20vw;bottom:min(18vh,160px);width:70px', `<circle cx="50" cy="50" r="46" fill="#f2994a" stroke="#7a3d12" stroke-width="3"/><path d="M4 50h92M50 4v92M18 18q30 30 0 64M82 18q-30 30 0 64" stroke="#7a3d12" stroke-width="3" fill="none"/>`, 'bob');
    const racket = S('0 0 120 360', 'left:3vw;top:24vh;height:min(46vh,380px);transform:rotate(-20deg)', `
      <ellipse cx="60" cy="80" rx="52" ry="74" fill="none" stroke="#2f7fd6" stroke-width="7"/>
      <g stroke="#cfe3f5" stroke-width="1.5">${range(9, (i) => `<path d="M${20 + i * 10} 14V146M10 ${20 + i * 15}H110"/>`)}</g>
      <path d="M60 154V300" stroke="#2f7fd6" stroke-width="7"/><rect x="50" y="290" width="20" height="66" rx="6" fill="#f2994a"/>`, 'hide-sm');
    return windows + floor + hoop + ball + racket + kanji('青', 'right:-2vw;bottom:20vh');
  });

  // ===== Cenários por gênero (animes sem mundo próprio) =====
  const G = {
    'Romance': () => range(7, (i) => S('0 0 100 100', `left:${(i * 37) % 92 + 2}vw;top:${(i * 23) % 70 + 14}vh;width:${30 + (i % 3) * 14}px`, '<path class="a1" d="M50 88C10 60 4 36 20 22c12-10 26-4 30 8c4-12 18-18 30-8c16 14 10 38-30 66Z"/>', `pulse ${i > 3 ? 'hide-sm' : ''}`))
      + S('0 0 200 140', 'right:4vw;bottom:10vh;width:min(150px,26vw);transform:rotate(-8deg)', '<rect x="4" y="20" width="192" height="116" rx="6" fill="#fff" stroke="var(--accent)" stroke-width="3"/><path d="M4 22L100 90L196 22" fill="none" stroke="var(--accent)" stroke-width="3"/><path class="a1" d="M100 116C84 104 80 94 86 88c5-4 11-2 14 3c3-5 9-7 14-3c6 6 2 16-14 28Z"/>', 'bob'),
    'Terror': () => S('0 0 300 300', 'right:6vw;top:12vh;width:min(220px,34vw)', '<circle cx="150" cy="150" r="120" fill="#e8e0c8" opacity=".25"/><circle cx="190" cy="120" r="110" class="bgf"/>', 'hide-light')
      + S('0 0 1200 300', 'left:0;right:0;bottom:0;width:100%;height:min(30vh,260px)', `<g class="bgf">${range(9, (i) => { const x = i * 140 + 20, h = 120 + (i * 41) % 120; return `<path d="M${x} 300V${300 - h}l14-30l-6-20l20 10l10 -40l6 50l20-20l-10 50V300Z"/><path d="M${x + 30} ${300 - h + 20}l-40 -40M${x + 30} ${300 - h + 40}l46 -30" stroke="var(--bg)" stroke-width="6"/>`; })}</g>`, '', 'xMidYMax slice')
      + range(4, (i) => S('0 0 120 50', `left:${[4, 86, 12, 78][i]}vw;top:${[40, 30, 70, 64][i]}vh;width:70px`, '<g class="blink"><ellipse cx="30" cy="25" rx="16" ry="8" fill="var(--accent)"/><ellipse cx="90" cy="25" rx="16" ry="8" fill="var(--accent)"/><circle cx="30" cy="25" r="4" fill="#000"/><circle cx="90" cy="25" r="4" fill="#000"/></g>', 'faint')),
    'Ficção Científica': () => S('0 0 300 300', 'right:-40px;top:10vh;width:min(300px,44vw)', `<circle cx="150" cy="150" r="80" class="a2" opacity=".35"/><ellipse cx="150" cy="150" rx="140" ry="30" fill="none" class="sa1" stroke-width="4" opacity=".5" transform="rotate(-20 150 150)"/>`, 'bob')
      + S('0 0 400 400', 'left:-20px;bottom:-20px;width:min(380px,56vw)', `<g class="sa1" stroke-width="2" fill="none" opacity=".35">${range(8, (i) => `<path d="M0 ${60 + i * 40}H${80 + i * 20}l30 -30H${220 + (i % 3) * 40}"/><circle cx="${224 + (i % 3) * 40}" cy="${30 + i * 40}" r="5"/>`)}</g>`, 'flick'),
    'Esportes': () => S('0 0 1200 200', 'left:0;right:0;bottom:0;width:100%;height:min(20vh,170px)', '<rect width="1200" height="200" class="a1" opacity=".12"/><path d="M0 40H1200M600 40V200" class="stx" stroke-width="4" opacity=".25"/><circle cx="600" cy="120" r="60" fill="none" class="stx" stroke-width="4" opacity=".25"/>', '', 'xMidYMax slice')
      + S('0 0 100 100', 'right:6vw;top:18vh;width:min(110px,20vw)', '<circle cx="50" cy="50" r="46" class="a1" opacity=".7"/><path d="M4 50h92M50 4v92M18 18q30 30 0 64M82 18q-30 30 0 64" class="stx" stroke-width="3" fill="none" opacity=".6"/>', 'bob')
      + S('0 0 400 200', 'left:2vw;top:20vh;width:min(260px,40vw)', `<g class="stx" stroke-width="5" stroke-linecap="round" opacity=".18">${range(6, (i) => `<path d="M${i * 30} ${30 + i * 26}H${200 + i * 30}"/>`)}</g>`, 'hide-sm'),
    'Comédia': () => range(6, (i) => S('0 0 100 100', `left:${(i * 41) % 90 + 3}vw;top:${(i * 29) % 66 + 16}vh;width:${36 + (i % 3) * 12}px;transform:rotate(${i * 30}deg)`, [
      `<path d="${star(50, 50, 46, 20, 5)}" class="a1"/>`, '<circle cx="50" cy="50" r="40" class="a2"/><circle cx="36" cy="40" r="6" fill="#222"/><circle cx="64" cy="40" r="6" fill="#222"/><path d="M30 60q20 22 40 0" stroke="#222" stroke-width="5" fill="none"/>',
      '<path d="M50 6C70 30 80 44 80 60a30 30 0 0 1-60 0c0-16 10-30 30-54Z" fill="#7ec8ff"/>'][i % 3], `bob ${i > 3 ? 'hide-sm' : ''}`)),
    'Fantasia': () => S('0 0 400 300', 'right:2vw;bottom:min(10vh,90px);width:min(320px,46vw)', `<g class="sf">${[[40, 40, 160], [100, 50, 220], [170, 60, 280], [250, 50, 200], [320, 40, 150]].map(([x, w, h]) => `<rect x="${x}" y="${300 - h}" width="${w}" height="${h}"/><path d="M${x - 6} ${300 - h}L${x + w / 2} ${240 - h}L${x + w + 6} ${300 - h}Z"/>`).join('')}</g><g class="a2" opacity=".6">${range(6, (i) => `<rect x="${55 + i * 50}" y="${180 + (i % 2) * 30}" width="8" height="12"/>`)}</g>`, '')
      + S('0 0 300 300', 'left:-60px;top:14vh;width:min(300px,44vw)', `<g class="sa1" fill="none" opacity=".3"><circle cx="150" cy="150" r="130" stroke-width="3"/><path d="${star(150, 150, 130, 50, 6)}"/><circle cx="150" cy="150" r="50"/></g>`, 'spin-slow'),
    'Ação': () => S('0 0 600 400', 'right:-20px;top:16vh;width:min(520px,70vw)', `<g fill="var(--accent)" opacity=".22">${range(4, (i) => `<path d="M${40 + i * 60} ${380 - i * 30}L${560 - i * 20} ${20 + i * 40}L${548 - i * 20} ${10 + i * 40}Z"/>`)}</g>`, 'flick')
      + S('0 0 400 400', 'left:-40px;bottom:-40px;width:min(380px,56vw)', `<g class="stx" opacity=".1">${range(30, (i) => { const a = (i / 30) * Math.PI / 2; return `<path d="M0 400L${f(400 * Math.cos(a))} ${f(400 - 400 * Math.sin(a))}" stroke-width="${1 + i % 3}"/>`; })}</g>`, ''),
    'Mistério': () => S('0 0 220 220', 'right:4vw;top:18vh;width:min(170px,28vw)', '<circle cx="90" cy="90" r="64" fill="none" class="sa1" stroke-width="10" opacity=".5"/><path d="M136 136L206 206" class="sa1" stroke-width="18" stroke-linecap="round" opacity=".5"/>', 'bob')
      + range(5, (i) => `<div class="sc sc-q" style="left:${(i * 37) % 86 + 4}vw;top:${(i * 31) % 60 + 20}vh;font-size:${40 + (i % 3) * 30}px;animation-delay:-${i}s">?</div>`),
    'Slice of Life': () => S('0 0 240 200', 'right:4vw;top:16vh;width:min(200px,32vw)', '<rect x="10" y="10" width="220" height="180" rx="10" fill="#fff" opacity=".7" stroke="var(--accent)" stroke-width="4"/><path d="M120 10v180M10 100h220" class="sa1" stroke-width="4"/><circle cx="70" cy="56" r="20" fill="#ffd166"/>', '')
      + S('0 0 200 140', 'left:3vw;bottom:8vh;width:min(150px,26vw)', '<path d="M30 130Q20 60 60 50Q100 40 130 70Q160 60 170 90Q170 130 140 130Z" fill="#2d2a3a" opacity=".7"/><path d="M60 50l-6-26l20 18M100 46l10-24l6 26" fill="#2d2a3a" opacity=".7"/><path d="M170 120q30-10 20-40" stroke="#2d2a3a" stroke-width="8" fill="none" opacity=".7"/>', 'bob')
      + S('0 0 200 160', 'left:26vw;top:10vh;width:min(110px,18vw)', '<g class="stx" stroke-width="4" fill="none" opacity=".35" stroke-linecap="round"><path class="steam" d="M80 50q-10-14 0-26t0-24"/><path class="steam d2" d="M110 50q-10-14 0-26t0-24"/></g><path d="M50 70h100q-4 70-50 74q-46-4-50-74Z" class="a2" opacity=".7"/><path d="M150 84q26 0 22 24q-4 18-28 16" class="sa2" stroke-width="8" opacity=".7"/>', 'hide-sm'),
  };
  for (const [g, fn] of Object.entries(G)) D('g-' + g, fn);
})();
