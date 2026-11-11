// ===== Kizuna — app principal (roteamento por hash + páginas) =====
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let routeId = 0;          // invalida respostas assíncronas de páginas antigas
let page = {};            // contexto da página atual
const revealed = new Set(); // spoilers revelados nesta sessão
const imgCache = {};      // id -> url da capa

// ---------- utilidades ----------
function ago(t) {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `há ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return d < 30 ? `há ${d} d` : new Date(t).toLocaleDateString('pt-BR');
}
function colorOf(name) {
  let h = 0; for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h} 60% 48%)`;
}
const avatar = (name, cls = '') => {
  const color = name === Store.user.name && Store.user.color ? Store.user.color : colorOf(name);
  return `<span class="avatar ${cls}" style="background:${color}">${esc(String(name)[0]?.toUpperCase() || '?')}</span>`;
};
const starsTxt = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

// Fila de avisos: mensagens comuns e badges desbloqueadas aparecem uma de cada vez
const toastQueue = [];
function toast(msg, badge) {
  toastQueue.push({ msg, badge });
  if (toastQueue.length === 1) nextToast();
}
function nextToast() {
  const item = toastQueue[0];
  if (!item) return;
  const t = $('#toast');
  t.classList.toggle('badge-toast', !!item.badge);
  if (item.badge) {
    const b = item.badge;
    t.innerHTML = `<span class="medal sm" style="--tier:${TIERS[b.tier].color}">${b.icon}</span><span><small>Nova badge desbloqueada!</small><br><b>${esc(b.name)}</b></span>`;
  } else t.textContent = item.msg;
  t.classList.add('show');
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { toastQueue.shift(); nextToast(); }, 350);
  }, item.badge ? 3200 : 2000);
}
function checkBadges() {
  const fresh = Badges.check();
  fresh.forEach((b) => toast(null, b));
  return fresh.length;
}

function applyTheme(t) {
  const r = document.documentElement;
  const vars = { '--bg': t.bg, '--surface': t.surface, '--text': t.text, '--muted': t.muted, '--accent': t.accent, '--accent2': t.accent2, '--on-accent': t.onAccent, '--font-display': t.display, '--font-body': t.body };
  for (const [k, v] of Object.entries(vars)) r.style.setProperty(k, v);
  r.dataset.mode = t.light ? 'light' : 'dark';
  const bg = $('.bg-pattern');
  if (bg.dataset.p !== t.pattern) {
    bg.classList.add('swap');
    setTimeout(() => { r.style.setProperty('--pattern', t.pattern); bg.dataset.p = t.pattern; bg.classList.remove('swap'); }, 250);
  }
  FX.set(t.effect, [t.accent, t.accent2, t.light ? t.muted : t.text]);
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', t.bg);
}

// Junta dados do catálogo (tema, sinopse em PT) com dados da API (capa, nota)
function merge(cur, api) {
  if (!cur) return api;
  return { ...api, ...cur, image: api?.image, banner: api?.banner, score: api?.score, episodes: cur.episodes ?? api?.episodes, airing: api?.airing };
}
function paintImages() {
  $$('[data-img]').forEach((el) => {
    const url = imgCache[el.dataset.img];
    if (url) { el.style.backgroundImage = `url("${url}")`; el.removeAttribute('data-img'); }
  });
}
// Uma única requisição para todas as capas que faltam na tela
function hydrateImages(rid) {
  const ids = [...new Set($$('[data-img]').map((el) => +el.dataset.img))].filter((id) => !imgCache[id]);
  paintImages();
  if (!ids.length) return;
  Api.many(ids).then((list) => {
    list.forEach((a) => { imgCache[a.id] = a.image; });
    if (rid === routeId) paintImages();
  }).catch(() => {});
}
const fromEntry = (e) => ({ id: e.id, title: e.meta.title, image: e.meta.image, episodes: e.meta.episodes, color: e.meta.color, genres: e.meta.genres, jp: CATALOG_BY_ID[e.id]?.jp });

// ---------- componentes ----------
function card(a) {
  const t = themeFor(a);
  const e = Store.entry(a.id);
  const img = a.image || imgCache[a.id];
  const eps = a.episodes || e.meta?.episodes;
  const pct = eps ? Math.round((e.ep / eps) * 100) : 0;
  return `
  <a class="tcard" href="#/anime/${a.id}" style="--c-bg:${t.bg};--c-text:${t.text};--c-accent:${t.accent};--c-accent2:${t.accent2};--c-on:${t.onAccent};--c-font:${t.display.replace(/"/g, "'")}">
    ${e.status ? `<span class="badge">${STATUS[e.status].icon} ${STATUS[e.status].label}</span>` : ''}
    <div class="tcard-img" ${img ? `style="background-image:url('${esc(img)}')"` : `data-img="${a.id}"`}>
      ${a.jp ? `<span class="jp">${esc(a.jp)}</span>` : ''}
    </div>
    <div class="tcard-body">
      <h3>${esc(a.title)}</h3>
      <div class="meta">${[a.year, eps ? `${eps} eps` : (a.airing || a.id === 21 ? 'em exibição' : null), a.score ? `★ ${a.score}` : null].filter(Boolean).join(' · ')}</div>
      ${e.status === 'assistindo' && eps ? `<div class="prog"><i style="width:${pct}%"></i></div><div class="meta">ep ${e.ep} de ${eps}</div>` : ''}
    </div>
  </a>`;
}
const skeletons = (n) => Array.from({ length: n }, () => '<div class="skeleton"></div>').join('');

function animePill(animeId) {
  if (!animeId) return '<span class="anime-pill" style="--t-accent:var(--muted)">Geral</span>';
  const a = CATALOG_BY_ID[animeId];
  const t = themeFor(a || fromEntry({ id: animeId, ...Store.entry(animeId) }));
  const title = a?.title || Store.entry(animeId).meta?.title || 'Anime';
  return `<span class="anime-pill" style="--t-accent:${t.accent};--t-on:${t.onAccent}">${esc(title)}</span>`;
}

function isLocked(t) {
  if (!t.spoiler || !t.animeId || revealed.has(t.id)) return false;
  const e = Store.entry(t.animeId);
  return e.status !== 'completo' && (e.ep || 0) < t.ep;
}
function spoilerWrap(t, html) {
  if (!isLocked(t)) return html;
  const e = Store.entry(t.animeId);
  return `<div class="spoiler locked"><div class="content">${html}</div>
    <div class="veil"><div>🙈 Spoiler até o ep ${t.ep} — você está no ep ${e.ep || 0}<br>
    <button class="btn sm" data-action="reveal" data-id="${t.id}">Revelar mesmo assim</button></div></div></div>`;
}

function threadItem(t) {
  const a = CATALOG_BY_ID[t.animeId];
  const th = t.animeId ? themeFor(a || fromEntry({ id: t.animeId, ...Store.entry(t.animeId) })) : null;
  const img = t.animeId ? (imgCache[t.animeId] || Store.entry(t.animeId).meta?.image) : null;
  return `
  <a class="thread-item" href="#/topico/${t.id}" ${th ? `style="--t-accent:${th.accent};--t-accent2:${th.accent2};--t-on:${th.onAccent}"` : ''}>
    <div class="thumb" ${img ? `style="background-image:url('${esc(img)}')"` : t.animeId ? `data-img="${t.animeId}"` : ''}></div>
    <div>
      <div class="post-head">${animePill(t.animeId)} ${t.ep ? `<span class="tag alt">ep ${t.ep}</span>` : ''} ${t.spoiler ? '<span class="tag">spoiler</span>' : ''}</div>
      <h3 style="margin-top:6px">${isLocked(t) ? '🙈 Tópico com spoiler escondido' : esc(t.title)}</h3>
      <div class="small muted">por ${esc(t.author)} · ${ago(t.createdAt)}</div>
    </div>
    <div class="stats">💬 ${t.replies.length} &nbsp; ♥ ${t.likes}</div>
  </a>`;
}

function newThreadForm(fixedAnimeId) {
  const options = CATALOG.map((a) => `<option value="${a.id}">${esc(a.title)}</option>`).join('');
  return `
  <form class="panel form" data-form="thread" style="margin-bottom:20px">
    <h3>Novo tópico</h3>
    ${fixedAnimeId === undefined ? `<select name="animeId"><option value="">Geral (sem anime específico)</option>${options}</select>` : `<input type="hidden" name="animeId" value="${fixedAnimeId}">`}
    <input type="text" name="title" placeholder="Título do tópico" required maxlength="120">
    <textarea name="body" placeholder="O que você quer discutir?" required></textarea>
    <div class="form-row">
      <label class="small muted">Comentando até o ep <input type="number" name="ep" min="0" value="${fixedAnimeId ? Store.entry(fixedAnimeId).ep || 0 : 0}" style="width:80px;margin-left:6px"></label>
      <label class="check"><input type="checkbox" name="spoiler"> Contém spoiler</label>
      <button class="btn primary" style="margin-left:auto">Publicar</button>
    </div>
  </form>`;
}

// ---------- páginas ----------
let homeFilter = 'Todos';
function pageHome(rid) {
  applyTheme(THEMES.default);
  const lib = Store.library().filter((e) => e.status === 'assistindo').sort((a, b) => b.updatedAt - a.updatedAt);
  const genres = ['Todos', ...new Set(CATALOG.flatMap((a) => a.genres))];
  const list = CATALOG.filter((a) => homeFilter === 'Todos' || a.genres.includes(homeFilter));
  app.innerHTML = `
    <section class="hero">
      <h1>Cada anime é <em>um mundo</em>. Entre nele.</h1>
      <p>Descubra novas histórias, marque o episódio em que está, dê sua nota e discuta sem medo de spoiler.</p>
    </section>
    ${lib.length ? `
    <section class="section">
      <div class="section-head"><h2>Continuar assistindo</h2><a class="muted small" href="#/estante">ver estante →</a></div>
      <div class="grid">${lib.slice(0, 5).map((e) => card(fromEntry(e))).join('')}</div>
    </section>` : ''}
    <section class="section">
      <div class="section-head"><h2>Mundos em destaque</h2><span class="muted small">passe o mouse e sinta o clima</span></div>
      <div class="chips" style="margin-bottom:18px">${genres.map((g) => `<button class="chip ${g === homeFilter ? 'on' : ''}" data-action="filter" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>
      <div class="grid">${list.map(card).join('')}</div>
    </section>
    <section class="section">
      <div class="section-head"><h2>Em exibição agora</h2><span class="muted small">via MyAnimeList</span></div>
      <div class="grid" id="airing">${skeletons(6)}</div>
    </section>
    <section class="section">
      <div class="section-head"><h2>Mais populares de todos os tempos</h2></div>
      <div class="grid" id="popular">${skeletons(6)}</div>
    </section>`;
  const fill = (sel, p) => p.then((list) => {
    if (rid !== routeId) return;
    list.forEach((a) => { imgCache[a.id] = a.image; });
    $(sel).innerHTML = list.map(card).join('');
  }).catch(() => { if (rid === routeId) $(sel).innerHTML = '<p class="muted">Não foi possível carregar agora. Tente recarregar a página.</p>'; });
  fill('#airing', Api.airing());
  fill('#popular', Api.popular());
  hydrateImages(rid);
}

function pageSearch(rid, q) {
  applyTheme(THEMES.default);
  $('#search').q.value = q;
  app.innerHTML = `<div class="section-head"><h2>Resultados para “${esc(q)}”</h2></div><div class="grid" id="res">${skeletons(8)}</div>`;
  Api.search(q).then((list) => {
    if (rid !== routeId) return;
    list.forEach((a) => { imgCache[a.id] = a.image; });
    $('#res').innerHTML = list.length ? list.map((a) => card(merge(CATALOG_BY_ID[a.id], a))).join('') : '<div class="empty"><div class="big">🔍</div>Nada encontrado.</div>';
  }).catch(() => { if (rid === routeId) $('#res').innerHTML = '<p class="muted">Erro na busca. Tente de novo em alguns segundos.</p>'; });
}

function pageAnime(rid, id) {
  const cur = CATALOG_BY_ID[id];
  page = { anime: cur ? { ...cur, image: imgCache[id] } : null, tab: page.anime?.id === id ? page.tab : 'sobre' };
  if (cur) { Store.visit(id); checkBadges(); applyTheme(cur.theme); drawAnime(); }
  else app.innerHTML = '<div class="empty"><div class="big">⏳</div>Carregando…</div>';
  Api.anime(id).then((d) => {
    if (rid !== routeId) return;
    imgCache[id] = d.image;
    page.anime = merge(cur, d);
    if (!cur) applyTheme(themeFor(d));
    drawAnime();
  }).catch(() => {
    if (rid !== routeId || cur) return;
    app.innerHTML = '<div class="empty"><div class="big">😵</div>Não foi possível carregar este anime.</div>';
  });
}

function drawAnime() {
  const a = page.anime;
  const e = Store.entry(a.id);
  const total = a.episodes;
  const pct = total ? Math.round((e.ep / total) * 100) : 0;
  const reviews = Store.reviews(a.id);
  const threads = Store.threads(a.id);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  const mine = Store.myReview(a.id);
  const scrollY = window.scrollY;

  app.innerHTML = `
  <section class="a-hero">
    ${a.banner || a.image ? `<div class="backdrop" style="background-image:url('${esc(a.banner || a.image)}')"></div>` : ''}
    ${a.image ? `<img class="poster" src="${esc(a.image)}" alt="Capa de ${esc(a.title)}">` : '<div class="poster"></div>'}
    <div class="a-title">
      ${a.jp ? `<div class="jp">${esc(a.jp)}</div>` : ''}
      <h1>${esc(a.title)}</h1>
      ${a.tagline ? `<p class="tagline">${esc(a.tagline)}</p>` : ''}
      <div class="facts">
        ${a.score ? `<span class="score">★ ${a.score} MAL</span>` : ''}
        ${avg ? `<span><b>${avg}</b>/5 na Kizuna (${reviews.length})</span>` : ''}
        ${a.year ? `<span><b>${a.year}</b></span>` : ''}
        <span><b>${total || '?'}</b> episódios</span>
        ${a.studio ? `<span>${esc(a.studio)}</span>` : ''}
      </div>
      <div class="chips">${(a.genres || []).map((g) => `<span class="tag">${esc(g)}</span>`).join('')}</div>
    </div>
  </section>

  <div class="a-layout">
    <aside class="tracker panel">
      <div>
        <h3>Minha estante</h3>
        <div class="status-grid">
          ${Object.entries(STATUS).map(([k, s]) => `<button class="btn ${e.status === k ? 'on' : ''}" data-action="status" data-s="${k}">${s.icon} ${s.label}</button>`).join('')}
        </div>
      </div>
      <div>
        <h3>Em que episódio você está?</h3>
        <div class="ep-row">
          <button class="btn icon" data-action="ep" data-d="-1" aria-label="Episódio anterior">−</button>
          <input type="number" min="0" ${total ? `max="${total}"` : ''} value="${e.ep}" data-action-input="ep-set" aria-label="Episódio atual">
          <button class="btn icon primary" data-action="ep" data-d="1" aria-label="Próximo episódio">+1</button>
          <span class="muted">${total ? `de ${total}` : ''}</span>
        </div>
        ${total ? `<div class="progress"><i style="width:${pct}%"></i></div><div class="small muted" style="margin-top:6px">${pct}% concluído</div>` : ''}
      </div>
      <div>
        <h3>Sua nota</h3>
        <div class="stars">${[1, 2, 3, 4, 5].map((n) => `<button class="${n <= e.rating ? 'on' : ''}" data-action="rate" data-n="${n}" aria-label="${n} estrelas">★</button>`).join('')}</div>
      </div>
      <button class="btn fav-btn ${e.fav ? 'on' : ''}" data-action="fav">${e.fav ? '♥ Favorito' : '♡ Adicionar aos favoritos'}</button>
    </aside>

    <div>
      <div class="tabs" role="tablist">
        ${[['sobre', 'Sobre'], ['resenhas', `Resenhas (${reviews.length})`], ['discussoes', `Discussões (${threads.length})`]].map(([k, l]) => `<button class="${page.tab === k ? 'on' : ''}" data-action="tab" data-t="${k}" role="tab">${l}</button>`).join('')}
      </div>

      ${page.tab === 'sobre' ? `
        <p class="synopsis">${esc(a.synopsis || 'Sem sinopse disponível.')}</p>
        ${!CATALOG_BY_ID[a.id] && a.synopsis ? '<p class="small muted">Sinopse original do MyAnimeList.</p>' : ''}
        ${threads.length ? `<div class="section"><div class="section-head"><h2>Discussões recentes</h2></div>${threads.slice(0, 2).map(threadItem).join('')}</div>` : ''}
      ` : ''}

      ${page.tab === 'resenhas' ? `
        <form class="panel form" data-form="review" style="margin-bottom:10px">
          <h3>${mine ? 'Editar sua resenha' : 'Escreva sua resenha'}</h3>
          <textarea name="text" placeholder="O que você achou até agora?" required>${esc(mine?.text || '')}</textarea>
          <div class="form-row small muted">
            <span>Nota: <span class="mini-stars">${starsTxt(e.rating)}</span></span>
            <span>· escrevendo no ep ${e.ep}</span>
            <button class="btn primary" style="margin-left:auto">${mine ? 'Atualizar' : 'Publicar'}</button>
          </div>
        </form>
        ${reviews.map((r) => `
          <article class="post">
            <div class="post-head">${avatar(r.author)} <b>${esc(r.author)}</b> ${r.rating ? `<span class="mini-stars">${starsTxt(r.rating)}</span>` : ''} <span class="tag alt">no ep ${r.ep}</span> <span class="muted">${ago(r.createdAt)}</span></div>
            <p>${esc(r.text)}</p>
          </article>`).join('') || '<div class="empty">Ninguém resenhou ainda. Seja a primeira pessoa!</div>'}
      ` : ''}

      ${page.tab === 'discussoes' ? `
        ${newThreadForm(a.id)}
        ${threads.map(threadItem).join('') || '<div class="empty"><div class="big">💬</div>Nenhuma discussão ainda.</div>'}
      ` : ''}
    </div>
  </div>`;
  window.scrollTo(0, scrollY);
  hydrateImages(routeId);
}

function pageThread(rid, tid) {
  const t = Store.thread(tid);
  if (!t) { app.innerHTML = '<div class="empty"><div class="big">🤷</div>Tópico não encontrado.</div>'; applyTheme(THEMES.default); return; }
  const a = CATALOG_BY_ID[t.animeId];
  applyTheme(t.animeId ? themeFor(a || fromEntry({ id: t.animeId, ...Store.entry(t.animeId) })) : THEMES.default);
  const back = t.animeId ? `#/anime/${t.animeId}` : '#/forum';
  app.innerHTML = `
    <a class="muted small" href="${back}">← ${t.animeId ? 'voltar ao anime' : 'voltar ao fórum'}</a>
    <article class="panel" style="margin-top:14px">
      <div class="post-head">${animePill(t.animeId)} ${t.ep ? `<span class="tag alt">até o ep ${t.ep}</span>` : ''} ${t.spoiler ? '<span class="tag">spoiler</span>' : ''}</div>
      ${spoilerWrap(t, `<h1 class="display" style="font-size:clamp(28px,4vw,42px);margin:14px 0">${esc(t.title)}</h1><p style="white-space:pre-wrap;font-size:17px">${esc(t.body)}</p>`)}
      <div class="post-head" style="margin-top:16px">${avatar(t.author)} <b>${esc(t.author)}</b> <span class="muted">${ago(t.createdAt)}</span>
        <button class="like ${t.liked ? 'on' : ''}" data-action="like" data-id="${t.id}" style="margin-left:auto">♥ ${t.likes}</button></div>
    </article>
    <div class="section-head" style="margin-top:32px"><h2>${t.replies.length} resposta${t.replies.length === 1 ? '' : 's'}</h2></div>
    <div class="panel">
      ${t.replies.map((r) => `<div class="post"><div class="post-head">${avatar(r.author)} <b>${esc(r.author)}</b> <span class="muted">${ago(r.createdAt)}</span></div>${spoilerWrap(t, `<p>${esc(r.body)}</p>`)}</div>`).join('') || '<p class="muted">Ainda sem respostas.</p>'}
      <form class="form" data-form="reply" data-id="${t.id}" style="margin-top:16px">
        <textarea name="body" placeholder="Escreva uma resposta…" required></textarea>
        <div class="form-row"><button class="btn primary" style="margin-left:auto">Responder</button></div>
      </form>
    </div>`;
}

let forumFilter = '';
function pageForum(rid) {
  applyTheme(THEMES.default);
  const all = Store.threads();
  const ids = [...new Set(all.map((t) => t.animeId).filter(Boolean))];
  const list = forumFilter === '' ? all : all.filter((t) => String(t.animeId ?? 'geral') === forumFilter);
  app.innerHTML = `
    <section class="hero" style="padding-top:8px"><h1 style="font-size:clamp(30px,5vw,46px)">Fórum</h1>
      <p>Discussões marcadas por episódio — se você ainda não chegou lá, o spoiler fica escondido.</p></section>
    <div class="chips section" style="margin-top:24px;margin-bottom:20px">
      <button class="chip ${forumFilter === '' ? 'on' : ''}" data-action="ffilter" data-v="">Todos</button>
      <button class="chip ${forumFilter === 'geral' ? 'on' : ''}" data-action="ffilter" data-v="geral">Geral</button>
      ${ids.map((id) => `<button class="chip ${forumFilter === String(id) ? 'on' : ''}" data-action="ffilter" data-v="${id}">${esc(CATALOG_BY_ID[id]?.title || Store.entry(id).meta?.title || id)}</button>`).join('')}
    </div>
    ${newThreadForm()}
    ${list.map(threadItem).join('') || '<div class="empty">Nenhum tópico aqui ainda.</div>'}`;
  hydrateImages(rid);
}

let shelfTab = 'assistindo';
function pageShelf(rid) {
  applyTheme(THEMES.default);
  const lib = Store.library();
  const tabs = [...Object.entries(STATUS).map(([k, s]) => [k, s.label, lib.filter((e) => e.status === k)]), ['fav', '♥ Favoritos', lib.filter((e) => e.fav)]];
  const cur = tabs.find((t) => t[0] === shelfTab);
  app.innerHTML = `
    <section class="hero" style="padding-top:8px"><h1 style="font-size:clamp(30px,5vw,46px)">Minha estante</h1>
      <p>Tudo que você está assistindo, quer assistir e já terminou.</p></section>
    <div class="tabs">${tabs.map(([k, l, items]) => `<button class="${k === shelfTab ? 'on' : ''}" data-action="shelf" data-t="${k}">${l} (${items.length})</button>`).join('')}</div>
    ${cur[2].length
      ? `<div class="grid">${cur[2].sort((a, b) => b.updatedAt - a.updatedAt).map((e) => card(fromEntry(e))).join('')}</div>`
      : `<div class="empty"><div class="big">📚</div>Nada aqui ainda.<br><a class="btn primary" href="#/" style="margin-top:16px">Descobrir animes</a></div>`}`;
  hydrateImages(rid);
}

// ---------- criação de perfil (o nome é definido só aqui) ----------
const AVATAR_COLORS = ['#ff4d8d', '#7c5cff', '#22d3ee', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7'];
const onb = { color: AVATAR_COLORS[0], genres: new Set(), name: '' };
function pageOnboarding() {
  applyTheme(THEMES.default);
  $$('[data-nav]').forEach((a) => a.classList.remove('on'));
  const genres = [...new Set([...CATALOG.flatMap((a) => a.genres), 'Romance', 'Esportes', 'Terror', 'Ficção Científica'])];
  const err = onb.name ? Store.nameError(onb.name) : null;
  app.innerHTML = `
  <section class="onboarding panel">
    <div class="onb-avatar"><span class="avatar xl" style="background:${onb.color}">${esc(onb.name[0]?.toUpperCase() || '絆')}</span></div>
    <h1>Crie seu perfil</h1>
    <p class="muted">Escolha como a comunidade vai te conhecer. <b>O nome de usuário não pode ser alterado depois.</b></p>
    <form class="form" data-form="onboarding" novalidate>
      <label class="field">
        <span>Nome de usuário</span>
        <span class="at-input"><span>@</span><input type="text" name="name" value="${esc(onb.name)}" maxlength="20" placeholder="seu_nome" autocomplete="off" required></span>
        <small class="hint ${err ? 'bad' : onb.name ? 'good' : ''}" id="name-hint">${err || (onb.name ? '✓ Nome disponível' : '3 a 20 caracteres: letras, números, ponto ou _')}</small>
      </label>
      <div class="field"><span>Cor do avatar</span>
        <div class="swatches">${AVATAR_COLORS.map((c) => `<button type="button" class="swatch ${c === onb.color ? 'on' : ''}" style="background:${c}" data-action="onb-color" data-c="${c}" aria-label="Cor ${c}"></button>`).join('')}</div>
      </div>
      <div class="field"><span>Gêneros favoritos <small class="muted">(opcional)</small></span>
        <div class="chips">${genres.map((g) => `<button type="button" class="chip ${onb.genres.has(g) ? 'on' : ''}" data-action="onb-genre" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>
      </div>
      <button class="btn primary big">Começar minha jornada</button>
    </form>
  </section>`;
}

function badgeCard(b) {
  const t = TIERS[b.tier];
  const pct = Math.round((b.value / b.goal) * 100);
  return `
  <div class="badge-card ${b.unlockedAt ? 'got' : 'locked'}" style="--tier:${t.color}">
    <span class="medal">${b.icon}</span>
    <div>
      <div class="badge-name">${esc(b.name)}</div>
      <div class="small muted">${esc(b.desc)}</div>
      ${b.unlockedAt
        ? `<div class="badge-meta"><span class="tier">${t.label}</span> desbloqueada ${ago(b.unlockedAt)}</div>`
        : `<div class="badge-prog"><i style="width:${pct}%"></i></div><div class="badge-meta">${b.value}/${b.goal} · <span class="tier">${t.label}</span></div>`}
    </div>
  </div>`;
}

function pageProfile(rid) {
  applyTheme(THEMES.default);
  const u = Store.user;
  const lib = Store.library();
  const st = Store.stats();
  const lv = Badges.level();
  const all = Badges.list();
  const got = all.filter((b) => b.unlockedAt).sort((a, b) => b.unlockedAt - a.unlockedAt);
  const locked = all.filter((b) => !b.unlockedAt).sort((a, b) => b.value / b.goal - a.value / b.goal);
  const rated = lib.filter((e) => e.rating);
  const avg = rated.length ? (rated.reduce((s, e) => s + e.rating, 0) / rated.length).toFixed(1) : '—';
  const counts = Object.entries(STATUS).map(([k, s]) => [s.label, lib.filter((e) => e.status === k).length]);
  const maxC = Math.max(1, ...counts.map((c) => c[1]));
  const favs = lib.filter((e) => e.fav);
  const eps = st.eps;
  app.innerHTML = `
    <section class="profile-card panel">
      <div class="ring" style="--p:${Math.round((lv.into / lv.need) * 100)}">${avatar(u.name, 'xl')}<span class="lvl">${lv.lvl}</span></div>
      <div class="who">
        <h1>@${esc(u.name)}</h1>
        <div class="rank">${esc(lv.rank)} · Nível ${lv.lvl}</div>
        <div class="xp"><div class="badge-prog"><i style="width:${(lv.into / lv.need) * 100}%"></i></div><span class="small muted">${lv.into}/${lv.need} XP para o nível ${lv.lvl + 1}</span></div>
        <div class="small muted">Membro desde ${new Date(u.since).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}${u.genres?.length ? ' · curte ' + u.genres.map(esc).join(', ') : ''}</div>
      </div>
      <div class="showcase">
        <div class="small muted">Badges recentes</div>
        <div class="showcase-row">${got.slice(0, 4).map((b) => `<span class="medal" style="--tier:${TIERS[b.tier].color}" title="${esc(b.name)}">${b.icon}</span>`).join('') || '<span class="small muted">Nenhuma ainda</span>'}</div>
        <div class="small"><b>${got.length}</b>/${all.length} desbloqueadas</div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>🏅 Badges</h2><span class="muted small">use a plataforma para desbloquear</span></div>
      <div class="badge-grid">${got.map(badgeCard).join('')}${locked.map(badgeCard).join('')}</div>
    </section>

    <div class="stat-grid section" style="margin-top:40px">
      <div class="panel stat"><div class="n">${lib.filter((e) => e.status).length}</div><div class="muted">animes na estante</div></div>
      <div class="panel stat"><div class="n">${eps}</div><div class="muted">episódios assistidos</div></div>
      <div class="panel stat"><div class="n">${Math.round(eps * 23 / 60)}h</div><div class="muted">de anime (aprox.)</div></div>
      <div class="panel stat"><div class="n">${avg}</div><div class="muted">nota média</div></div>
    </div>
    <div class="a-layout two-col">
      <div class="panel"><h3 style="margin-bottom:14px">Por status</h3>
        <div class="bars">${counts.map(([l, n]) => `<div><span>${l}</span><div class="progress" style="margin:0"><i style="width:${(n / maxC) * 100}%"></i></div><b>${n}</b></div>`).join('')}</div>
      </div>
      <div class="panel"><h3 style="margin-bottom:8px">Atividade recente</h3>
        <ul class="activity">${Store.activity().slice(0, 8).map((x) => `<li>Você ${esc(x.text)} ${x.animeId ? `<a href="#/anime/${x.animeId}" style="color:var(--accent)">${esc(CATALOG_BY_ID[x.animeId]?.title || Store.entry(x.animeId).meta?.title || '')}</a>` : ''} <span class="muted small">${ago(x.at)}</span></li>`).join('') || '<li class="muted">Nada ainda — comece marcando um anime!</li>'}</ul>
      </div>
    </div>
    ${favs.length ? `<section class="section"><div class="section-head"><h2>♥ Favoritos</h2></div><div class="grid">${favs.map((e) => card(fromEntry(e))).join('')}</div></section>` : ''}
    <p class="small muted section">Seus dados ficam salvos neste navegador. <button class="btn sm" data-action="reset">Apagar tudo e recomeçar</button></p>`;
  hydrateImages(rid);
}

// ---------- roteador ----------
function route(keep) {
  const rid = ++routeId;
  const [, name = '', arg] = (location.hash || '#/').split('/');
  const navKey = { '': 'home', busca: 'home', anime: 'home', estante: 'estante', forum: 'forum', topico: 'forum', perfil: 'perfil' }[name];
  $$('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === navKey));
  const y = window.scrollY;
  if (name !== 'anime') page = {};
  if (!Store.user.created) { window.scrollTo(0, 0); return pageOnboarding(); }
  if (keep !== true) {
    if (name !== 'anime' || page.anime?.id !== +arg) window.scrollTo(0, 0);
    app.style.animation = 'none'; void app.offsetWidth; app.style.animation = '';
  }
  if (keep === true) requestAnimationFrame(() => window.scrollTo(0, y));
  switch (name) {
    case 'anime': return pageAnime(rid, +arg);
    case 'busca': return pageSearch(rid, decodeURIComponent(arg || ''));
    case 'estante': return pageShelf(rid);
    case 'forum': return pageForum(rid);
    case 'topico': return pageThread(rid, arg);
    case 'perfil': return pageProfile(rid);
    default: return pageHome(rid);
  }
}
const rerender = () => (location.hash.startsWith('#/anime/') && page.anime ? drawAnime() : route(true));

// ---------- ações ----------
const actions = {
  filter: (b) => { homeFilter = b.dataset.g; rerender(); },
  ffilter: (b) => { forumFilter = b.dataset.v; rerender(); },
  shelf: (b) => { shelfTab = b.dataset.t; rerender(); },
  tab: (b) => { page.tab = b.dataset.t; drawAnime(); },
  status: (b) => {
    const e = Store.setStatus(page.anime, b.dataset.s);
    toast(e.status ? `Adicionado em “${STATUS[e.status].label}”` : 'Removido da estante');
    drawAnime();
  },
  ep: (b) => {
    const e0 = Store.entry(page.anime.id);
    const e = Store.setEp(page.anime, e0.ep + +b.dataset.d);
    if (e.status === 'completo' && e0.status !== 'completo') toast('🎉 Anime concluído! Que tal deixar uma resenha?');
    drawAnime();
  },
  rate: (b) => { Store.setRating(page.anime, +b.dataset.n); drawAnime(); },
  fav: () => { const e = Store.toggleFav(page.anime); toast(e.fav ? '♥ Adicionado aos favoritos' : 'Removido dos favoritos'); drawAnime(); },
  reveal: (b) => { revealed.add(b.dataset.id); Store.countReveal(); rerender(); },
  'onb-color': (b) => { onb.color = b.dataset.c; pageOnboarding(); },
  'onb-genre': (b) => { const g = b.dataset.g; onb.genres.has(g) ? onb.genres.delete(g) : onb.genres.add(g); pageOnboarding(); },
  like: (b) => { Store.toggleLike(b.dataset.id); rerender(); },
  reset: () => { if (confirm('Apagar estante, resenhas e tópicos salvos neste navegador?')) { Store.reset(); toast('Tudo zerado'); rerender(); } },
};

const forms = {
  search: (f) => { const q = f.q.value.trim(); if (q) location.hash = `#/busca/${encodeURIComponent(q)}`; },
  review: (f) => { Store.saveReview(page.anime, f.text.value); toast('Resenha publicada!'); drawAnime(); },
  thread: (f) => {
    const animeId = f.animeId.value ? +f.animeId.value : null;
    const t = Store.addThread({ animeId, title: f.title.value, body: f.body.value, ep: f.ep.value, spoiler: f.spoiler.checked });
    toast('Tópico criado!');
    location.hash = `#/topico/${t.id}`;
  },
  reply: (f) => { Store.addReply(f.dataset.id, f.body.value); rerender(); },
  onboarding: (f) => {
    const name = f.name.value.trim();
    const err = Store.nameError(name);
    if (err) { onb.name = name; pageOnboarding(); $('[data-form=onboarding] input[name=name]').focus(); return; }
    Store.createProfile({ name, color: onb.color, genres: [...onb.genres] });
    toast(`Boas-vindas, @${name}!`);
    location.hash = '#/perfil';
    route();
  },
};

// Toda ação pode desbloquear uma badge: confere depois de cada clique ou envio
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-action]');
  if (b && actions[b.dataset.action]) {
    ev.preventDefault();
    actions[b.dataset.action](b, ev);
    if (checkBadges() && location.hash === '#/perfil') rerender();
  }
});
document.addEventListener('submit', (ev) => {
  const f = ev.target;
  const key = f.id === 'search' ? 'search' : f.dataset.form;
  if (forms[key]) {
    ev.preventDefault();
    forms[key](f);
    if (checkBadges() && location.hash === '#/perfil') rerender();
  }
});
// Validação do nome enquanto digita (sem redesenhar a tela, para não perder o foco)
document.addEventListener('input', (ev) => {
  if (ev.target.closest('[data-form=onboarding]') && ev.target.name === 'name') {
    onb.name = ev.target.value.trim();
    const err = onb.name ? Store.nameError(onb.name) : null;
    const h = $('#name-hint');
    h.className = `hint ${err ? 'bad' : onb.name ? 'good' : ''}`;
    h.textContent = err || (onb.name ? '✓ Nome disponível' : '3 a 20 caracteres: letras, números, ponto ou _');
    $('.onb-avatar .avatar').textContent = onb.name[0]?.toUpperCase() || '絆';
  }
});
document.addEventListener('change', (ev) => {
  if (ev.target.dataset.actionInput === 'ep-set') {
    const e0 = Store.entry(page.anime.id);
    const e = Store.setEp(page.anime, +ev.target.value);
    if (e.status === 'completo' && e0.status !== 'completo') toast('🎉 Anime concluído!');
    drawAnime();
    checkBadges();
  }
});

addEventListener('hashchange', route);
route();
