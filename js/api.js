// ===== Dados reais de animes via AniList (GraphQL público, sem chave) =====
// Os IDs usados no site são os do MyAnimeList (idMal), que a AniList também aceita.
const Api = (() => {
  const URL_ = 'https://graphql.anilist.co';
  const CACHE_KEY = 'kizuna:cache2';
  const TTL = 3 * 24 * H;
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) { /* ignora */ }
  const saveCache = () => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* ignora */ } };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const FIELDS = `idMal title { romaji english native } coverImage { extraLarge color } bannerImage
    averageScore episodes seasonYear genres status description(asHtml: false)
    studios(isMain: true) { nodes { name } }`;

  let chain = Promise.resolve();
  function gql(query, variables) {
    const key = JSON.stringify([query, variables]);
    const hit = cache[key];
    if (hit && Date.now() - hit.at < TTL) return Promise.resolve(hit.data);
    const p = chain.then(async () => {
      for (let i = 0; i < 3; i++) {
        const res = await fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query, variables }) });
        if (res.status === 429) { await sleep(2000 * (i + 1)); continue; }
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        cache[key] = { at: Date.now(), data: json.data };
        saveCache();
        await sleep(250);
        return json.data;
      }
      throw new Error('Limite de requisições');
    });
    chain = p.catch(() => {});
    return p;
  }

  const strip = (s) => (s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/\(\s*Source:[^)]*\)/gi, '').replace(/^\s*Notes?:.*$/gim, '').replace(/\n{3,}/g, '\n\n').trim();

  // ===== Tradução das sinopses (inglês → português), guardada no navegador =====
  const TR_KEY = 'kizuna:tr';
  let tr = {};
  try { tr = JSON.parse(localStorage.getItem(TR_KEY)) || {}; } catch (e) { /* ignora */ }
  const trKey = (t) => t.length + ':' + t.slice(0, 60);
  async function google(text) {
    const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=' + encodeURIComponent(text));
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return (await res.json())[0].map((x) => x[0]).join('');
  }
  async function mymemory(text) {
    // Serviço reserva: só aceita trechos curtos, então junta frases em blocos de até ~450 caracteres
    const parts = text.match(/[^.!?\n]+[.!?]*\s*|\n+/g) || [text];
    const chunks = [];
    for (const s of parts) if (chunks.length && (chunks.at(-1) + s).length < 450) chunks[chunks.length - 1] += s; else chunks.push(s);
    const out = [];
    for (const c of chunks) {
      if (!c.trim()) { out.push(c); continue; }
      const res = await fetch('https://api.mymemory.translated.net/get?langpair=en|pt-BR&q=' + encodeURIComponent(c));
      const j = await res.json();
      if (j.responseStatus !== 200) throw new Error(j.responseDetails);
      out.push(j.responseData.translatedText + (/\s$/.test(c) ? ' ' : ''));
    }
    return out.join('');
  }
  const translated = (text) => (text ? tr[trKey(text)] || null : null);
  async function translate(text) {
    if (!text) return text;
    const hit = translated(text);
    if (hit) return hit;
    let out;
    try { out = await google(text); } catch (e) { out = await mymemory(text); }
    tr[trKey(text)] = out;
    const keys = Object.keys(tr);
    if (keys.length > 300) delete tr[keys[0]];
    try { localStorage.setItem(TR_KEY, JSON.stringify(tr)); } catch (e) { /* ignora */ }
    return out;
  }
  function norm(m) {
    return {
      id: m.idMal,
      title: m.title.english || m.title.romaji,
      jp: m.title.native,
      image: m.coverImage?.extraLarge,
      color: m.coverImage?.color,
      banner: m.bannerImage,
      score: m.averageScore ? (m.averageScore / 10).toFixed(1) : null,
      episodes: m.episodes,
      year: m.seasonYear,
      genres: (m.genres || []).map((g) => GENRE_PT[g] || g),
      studio: m.studios?.nodes?.[0]?.name,
      synopsis: strip(m.description),
      airing: m.status === 'RELEASING',
    };
  }
  const TYPES = { p: 'Int', q: 'String', ids: '[Int]' };
  const list = (q, v) => gql(`query(${Object.keys(v).map((k) => `$${k}:${TYPES[k]}`).join(',')}){ Page(perPage:$p){ media(${q}){ ${FIELDS} } } }`, v)
    .then((d) => d.Page.media.filter((m) => m.idMal).map(norm));

  const byId = {};
  return {
    translate, translated,
    anime: (id) => byId[id] ? Promise.resolve(byId[id])
      : gql(`query($id:Int){ Media(idMal:$id, type:ANIME){ ${FIELDS} } }`, { id }).then((d) => (byId[id] = norm(d.Media))),
    // Busca várias de uma vez (1 requisição) — usado para as capas dos cards
    many: (ids) => list('idMal_in:$ids, type:ANIME', { p: 50, ids }).then((arr) => { arr.forEach((a) => { byId[a.id] = a; }); return arr; }),
    search: (q) => list('search:$q, type:ANIME, isAdult:false, sort:POPULARITY_DESC', { p: 18, q }),
    airing: () => list('type:ANIME, status:RELEASING, isAdult:false, sort:POPULARITY_DESC', { p: 12 }),
    popular: () => list('type:ANIME, isAdult:false, sort:POPULARITY_DESC', { p: 18 }),
  };
})();
