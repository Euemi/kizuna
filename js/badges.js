// ===== Badges (conquistas) e níveis =====
// stat: campo de Store.stats(); goal: quanto é preciso para desbloquear
// tier: bronze | prata | ouro | especial (define a cor e o XP)
const BADGES = [
  { id: 'boas-vindas', icon: '🌸', name: 'Primeiro laço', desc: 'Criou seu perfil na Kizuna', stat: 'profile', goal: 1, tier: 'bronze' },
  { id: 'estante-1', icon: '📖', name: 'Primeira página', desc: 'Adicionou 1 anime à estante', stat: 'shelf', goal: 1, tier: 'bronze' },
  { id: 'estante-10', icon: '📚', name: 'Colecionador de mundos', desc: 'Tem 10 animes na estante', stat: 'shelf', goal: 10, tier: 'prata' },
  { id: 'eps-12', icon: '📺', name: 'Uma temporada', desc: 'Assistiu 12 episódios', stat: 'eps', goal: 12, tier: 'bronze' },
  { id: 'eps-100', icon: '🍿', name: 'Maratonista', desc: 'Assistiu 100 episódios', stat: 'eps', goal: 100, tier: 'prata' },
  { id: 'eps-500', icon: '🔥', name: 'Lenda das maratonas', desc: 'Assistiu 500 episódios', stat: 'eps', goal: 500, tier: 'ouro' },
  { id: 'completo-1', icon: '🏁', name: 'Fim da jornada', desc: 'Concluiu seu primeiro anime', stat: 'completed', goal: 1, tier: 'bronze' },
  { id: 'completo-10', icon: '🏆', name: 'Dez finais', desc: 'Concluiu 10 animes', stat: 'completed', goal: 10, tier: 'ouro' },
  { id: 'nota-10', icon: '⭐', name: 'Olhar crítico', desc: 'Deu nota para 10 animes', stat: 'rated', goal: 10, tier: 'prata' },
  { id: 'resenha-1', icon: '✍️', name: 'Primeira resenha', desc: 'Escreveu uma resenha', stat: 'reviews', goal: 1, tier: 'bronze' },
  { id: 'resenha-5', icon: '🖋️', name: 'Voz da comunidade', desc: 'Escreveu 5 resenhas', stat: 'reviews', goal: 5, tier: 'prata' },
  { id: 'topico-1', icon: '💬', name: 'Puxa-papo', desc: 'Criou um tópico no fórum', stat: 'threads', goal: 1, tier: 'bronze' },
  { id: 'resposta-10', icon: '🗣️', name: 'Debatedor nato', desc: 'Respondeu 10 vezes no fórum', stat: 'replies', goal: 10, tier: 'prata' },
  { id: 'favorito-5', icon: '💖', name: 'Coração de otaku', desc: 'Favoritou 5 animes', stat: 'favs', goal: 5, tier: 'prata' },
  { id: 'generos-5', icon: '🎭', name: 'Paladar eclético', desc: 'Tem animes de 5 gêneros diferentes', stat: 'genres', goal: 5, tier: 'prata' },
  { id: 'mundos-5', icon: '🧭', name: 'Explorador de mundos', desc: 'Visitou 5 mundos em destaque', stat: 'visited', goal: 5, tier: 'bronze' },
  { id: 'mundos-todos', icon: '🌌', name: 'Viajante interdimensional', desc: 'Visitou todos os mundos em destaque', stat: 'visited', goal: CATALOG.length, tier: 'ouro' },
  { id: 'spoiler', icon: '🙈', name: 'Curiosidade venceu', desc: 'Revelou um spoiler mesmo avisado', stat: 'revealed', goal: 1, tier: 'especial' },
  { id: 'abandono', icon: '🍃', name: 'Desapego', desc: 'Abandonou um anime (tudo bem!)', stat: 'dropped', goal: 1, tier: 'especial' },
];

const TIERS = {
  bronze: { label: 'Bronze', xp: 10, color: '#d08a4f' },
  prata: { label: 'Prata', xp: 25, color: '#b9c4d0' },
  ouro: { label: 'Ouro', xp: 60, color: '#f5c518' },
  especial: { label: 'Especial', xp: 15, color: '#c084fc' },
};

// Títulos neutros em gênero para cada nível
const RANKS = ['Iniciante', 'Curiosidade em pessoa', 'Fã de carteirinha', 'Otaku', 'Maratona humana', 'Sensei', 'Lenda da Kizuna'];

const Badges = {
  list() {
    const st = Store.stats();
    const got = Store.badges();
    return BADGES.map((b) => ({ ...b, value: Math.min(st[b.stat] || 0, b.goal), unlockedAt: got[b.id] || null }));
  },
  // Verifica e grava badges novas; devolve as que acabaram de ser desbloqueadas
  check() {
    if (!Store.user.created) return [];
    const st = Store.stats();
    const got = Store.badges();
    const fresh = BADGES.filter((b) => !got[b.id] && (st[b.stat] || 0) >= b.goal);
    if (fresh.length) Store.unlock(fresh.map((b) => b.id));
    return fresh;
  },
  // XP: badges + 1 por episódio; cada nível pede 100 XP a mais que o anterior
  level() {
    const got = Store.badges();
    const xp = BADGES.filter((b) => got[b.id]).reduce((n, b) => n + TIERS[b.tier].xp, 0) + Store.stats().eps;
    let lvl = 1, need = 100, rest = xp;
    while (rest >= need) { rest -= need; lvl++; need += 100; }
    return { xp, lvl, into: rest, need, rank: RANKS[Math.min(lvl - 1, RANKS.length - 1)] };
  },
};
