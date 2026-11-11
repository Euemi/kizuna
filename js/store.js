// ===== Armazenamento local (protótipo). Trocar por um backend (ex.: Supabase) depois. =====
const Store = (() => {
  const KEY = 'kizuna:v1';
  let uid = Date.now();
  const id = () => (uid++).toString(36);

  function seed() {
    const now = Date.now();
    return {
      user: { name: null, color: null, genres: [], since: now, created: false },
      library: {},
      visited: [],       // mundos do catálogo já visitados (para badges)
      badges: {},        // id da badge -> data em que foi desbloqueada
      revealedCount: 0,
      reviews: SEED_REVIEWS.map((r) => ({ id: id(), animeId: r.animeId, author: r.author, rating: r.rating, ep: r.ep, text: r.text, createdAt: now - r.ago })),
      threads: SEED_THREADS.map((t) => ({
        id: id(), animeId: t.animeId, title: t.title, body: t.body, author: t.author, ep: t.ep, spoiler: t.spoiler,
        likes: t.likes, liked: false, createdAt: now - t.ago,
        replies: t.replies.map((r) => ({ id: id(), author: r.author, body: r.body, createdAt: now - r.ago })),
      })),
      activity: [],
    };
  }

  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* armazenamento indisponível */ }
  if (!s || !s.library) s = seed();
  // Migração de dados da versão anterior (antes do cadastro de perfil e das badges)
  s.visited ??= []; s.badges ??= {}; s.revealedCount ??= 0;
  if (s.user.created === undefined) Object.assign(s.user, { created: false, genres: [], color: null });

  // Nomes já usados pela comunidade de exemplo
  const TAKEN = new Set([...SEED_REVIEWS, ...SEED_THREADS, ...SEED_THREADS.flatMap((t) => t.replies)].map((x) => x.author.toLowerCase()));

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignora */ } };
  const blank = () => ({ status: null, ep: 0, rating: 0, fav: false, meta: {}, updatedAt: 0 });

  function log(text, animeId) {
    s.activity.unshift({ text, animeId, at: Date.now() });
    s.activity = s.activity.slice(0, 30);
  }

  function upd(anime, fn) {
    const e = s.library[anime.id] || blank();
    e.meta = { title: anime.title, image: anime.image || e.meta.image, episodes: anime.episodes ?? e.meta.episodes, color: anime.color || e.meta.color, genres: anime.genres || e.meta.genres };
    fn(e);
    e.updatedAt = Date.now();
    s.library[anime.id] = e;
    save();
    return e;
  }

  return {
    get user() { return s.user; },
    // O nome é escolhido uma única vez, na criação do perfil
    nameError(n) {
      if (!/^[a-zA-Z0-9_.]{3,20}$/.test(n)) return 'Use de 3 a 20 caracteres: letras, números, ponto ou _';
      if (TAKEN.has(n.toLowerCase())) return 'Esse nome já está em uso. Tente outro!';
      return null;
    },
    createProfile({ name, color, genres }) {
      const old = s.user.name;
      Object.assign(s.user, { name, color, genres, created: true, since: Date.now() });
      // conteúdos escritos antes do cadastro passam a ter o novo nome
      for (const r of s.reviews) if (r.mine) r.author = name;
      for (const t of s.threads) {
        if (t.mine || t.author === old) t.author = name;
        for (const r of t.replies) if (r.mine) r.author = name;
      }
      save();
    },
    visit(animeId) {
      if (CATALOG_BY_ID[animeId] && !s.visited.includes(animeId)) { s.visited.push(animeId); save(); }
    },
    countReveal() { s.revealedCount++; save(); },
    badges: () => s.badges,
    unlock(ids) { const now = Date.now(); ids.forEach((b) => { s.badges[b] = now; }); save(); },
    // Números usados pelas badges e pelo perfil
    stats() {
      const lib = Object.entries(s.library).map(([id, e]) => ({ id: +id, ...e }));
      const genres = new Set(lib.filter((e) => e.status).flatMap((e) => e.meta?.genres || CATALOG_BY_ID[e.id]?.genres || []));
      return {
        shelf: lib.filter((e) => e.status).length,
        eps: lib.reduce((n, e) => n + (e.ep || 0), 0),
        completed: lib.filter((e) => e.status === 'completo').length,
        dropped: lib.filter((e) => e.status === 'abandonado').length,
        rated: lib.filter((e) => e.rating).length,
        favs: lib.filter((e) => e.fav).length,
        genres: genres.size,
        reviews: s.reviews.filter((r) => r.mine).length,
        threads: s.threads.filter((t) => t.mine).length,
        replies: s.threads.reduce((n, t) => n + t.replies.filter((r) => r.mine).length, 0),
        visited: s.visited.length,
        revealed: s.revealedCount,
        profile: s.user.created ? 1 : 0,
      };
    },
    entry: (animeId) => s.library[animeId] || blank(),
    library: () => Object.entries(s.library).map(([id, e]) => ({ id: +id, ...e })),
    activity: () => s.activity,

    setStatus(anime, status) {
      return upd(anime, (e) => {
        e.status = e.status === status ? null : status;
        if (e.status === 'completo' && anime.episodes) e.ep = anime.episodes;
        if (e.status) log(`marcou como ${STATUS[e.status].label.toLowerCase()}`, anime.id);
      });
    },
    setEp(anime, ep) {
      return upd(anime, (e) => {
        const max = anime.episodes || 9999;
        e.ep = Math.max(0, Math.min(max, ep | 0));
        if (e.ep > 0 && (!e.status || e.status === 'quero')) e.status = 'assistindo';
        if (anime.episodes && e.ep === anime.episodes) { e.status = 'completo'; log('terminou', anime.id); }
        else log(`está no ep ${e.ep}`, anime.id);
      });
    },
    setRating(anime, r) { return upd(anime, (e) => { e.rating = e.rating === r ? 0 : r; if (e.rating) log(`deu nota ${r}/5`, anime.id); }); },
    toggleFav(anime) { return upd(anime, (e) => { e.fav = !e.fav; if (e.fav) log('favoritou', anime.id); }); },

    reviews: (animeId) => s.reviews.filter((r) => r.animeId === animeId).sort((a, b) => b.createdAt - a.createdAt),
    myReview: (animeId) => s.reviews.find((r) => r.animeId === animeId && r.mine),
    saveReview(anime, text) {
      let r = s.reviews.find((x) => x.animeId === anime.id && x.mine);
      const e = this.entry(anime.id);
      if (!r) { r = { id: id(), animeId: anime.id, mine: true }; s.reviews.push(r); }
      Object.assign(r, { author: s.user.name, rating: e.rating, ep: e.ep, text: text.trim(), createdAt: Date.now() });
      log('escreveu uma resenha', anime.id);
      save();
    },

    threads: (animeId) => s.threads.filter((t) => animeId === undefined || t.animeId === animeId).sort((a, b) => b.createdAt - a.createdAt),
    thread: (tid) => s.threads.find((t) => t.id === tid),
    addThread({ animeId, title, body, ep, spoiler }) {
      const t = { id: id(), animeId, title: title.trim(), body: body.trim(), author: s.user.name, ep: ep | 0, spoiler: !!spoiler, likes: 0, liked: false, createdAt: Date.now(), replies: [], mine: true };
      s.threads.push(t);
      log(`abriu o tópico "${t.title}"`, animeId);
      save();
      return t;
    },
    addReply(tid, body) {
      const t = this.thread(tid);
      t.replies.push({ id: id(), author: s.user.name, body: body.trim(), createdAt: Date.now(), mine: true });
      save();
    },
    toggleLike(tid) {
      const t = this.thread(tid);
      t.liked = !t.liked; t.likes += t.liked ? 1 : -1;
      save();
    },
    reset() { s = seed(); save(); },
  };
})();
