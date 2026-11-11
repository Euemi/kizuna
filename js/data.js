// ===== Catálogo curado: cada anime tem seu próprio "mundo visual" =====
// theme: cores, fontes, padrão de fundo (CSS) e efeito de partículas (fx.js)

const svg = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

const PATTERNS = {
  alchemy: svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><g fill='none' stroke='rgba(212,175,55,0.10)' stroke-width='2'><circle cx='200' cy='200' r='190'/><circle cx='200' cy='200' r='170'/><circle cx='200' cy='200' r='80'/><polygon points='200,30 347,285 53,285'/><polygon points='200,370 53,115 347,115'/><rect x='143' y='143' width='114' height='114' transform='rotate(45 200 200)'/></g></svg>`),
  waves: svg(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='30'><path d='M0 15 Q30 0 60 15 T120 15' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='2'/></svg>`),
  hex: svg(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='100'><path d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='rgba(124,255,79,0.08)' stroke-width='1'/></svg>`),
};

function mkTheme(o) {
  return Object.assign({
    bg: '#0d0d14', surface: '#171723', text: '#ecebf5', muted: '#9a98b3',
    accent: '#ff4d8d', accent2: '#7c5cff', onAccent: '#ffffff',
    display: "'Poppins', sans-serif", body: "'Inter', sans-serif",
    pattern: 'none', effect: null, light: false,
  }, o);
}

const THEMES = {
  default: mkTheme({
    pattern: 'radial-gradient(circle at 15% 10%, rgba(255,77,141,.16), transparent 40%), radial-gradient(circle at 85% 35%, rgba(124,92,255,.16), transparent 40%)',
    effect: 'sparkles',
  }),
};

const CATALOG = [
  {
    id: 52991, title: 'Frieren e a Jornada para o Além', jp: '葬送のフリーレン', year: 2023, episodes: 28, studio: 'Madhouse',
    genres: ['Aventura', 'Fantasia', 'Drama'],
    tagline: 'Uma elfa, mil anos e a saudade de uma única década.',
    synopsis: 'Depois de derrotar o Rei Demônio, a elfa maga Frieren percebe que mal conheceu os companheiros com quem viajou por dez anos. Décadas depois, ela parte numa nova jornada para entender as pessoas — e o peso do tempo.',
    theme: mkTheme({
      light: true, bg: '#eef3f1', surface: '#ffffff', text: '#24343b', muted: '#62757c',
      accent: '#5c8f7b', accent2: '#a98fd6', display: "'Cormorant Garamond', serif",
      pattern: 'radial-gradient(circle at 20% 15%, rgba(169,143,214,.35), transparent 40%), radial-gradient(circle at 85% 85%, rgba(92,143,123,.30), transparent 45%)',
      effect: 'sparkles',
    }),
  },
  {
    id: 38000, title: 'Demon Slayer', jp: '鬼滅の刃', year: 2019, episodes: 26, studio: 'ufotable',
    genres: ['Ação', 'Fantasia', 'Sobrenatural'],
    tagline: 'Uma lâmina, uma irmã e a noite inteira pela frente.',
    synopsis: 'Depois que sua família é massacrada por um oni e sua irmã Nezuko é transformada em um, Tanjiro Kamado se torna caçador de demônios para encontrar uma cura e vingar os seus.',
    theme: mkTheme({
      bg: '#0a1210', surface: '#111c19', text: '#f3ece4', muted: '#9fb3ab',
      accent: '#e8475a', accent2: '#b48ee0', display: "'Shippori Mincho', serif",
      pattern: 'repeating-conic-gradient(rgba(42,157,143,.10) 0 25%, transparent 0 50%) 0 0/84px 84px, radial-gradient(circle at 80% 10%, rgba(180,142,224,.18), transparent 45%)',
      effect: 'petals',
    }),
  },
  {
    id: 40748, title: 'Jujutsu Kaisen', jp: '呪術廻戦', year: 2020, episodes: 24, studio: 'MAPPA',
    genres: ['Ação', 'Sobrenatural'],
    tagline: 'Maldições não perdoam. Feiticeiros também não.',
    synopsis: 'Yuji Itadori engole um dedo amaldiçoado para salvar os amigos e se torna hospedeiro de Sukuna, o Rei das Maldições. Agora ele entra no mundo dos feiticeiros jujutsu, onde cada luta pode ser a última.',
    theme: mkTheme({
      bg: '#08081a', surface: '#121230', text: '#ece9ff', muted: '#9b98c7',
      accent: '#8b3dff', accent2: '#3a86ff', display: "'Dela Gothic One', sans-serif",
      pattern: 'radial-gradient(circle at 25% 75%, rgba(139,61,255,.35), transparent 45%), radial-gradient(circle at 75% 20%, rgba(58,134,255,.28), transparent 40%), conic-gradient(from 90deg at 50% 50%, transparent, rgba(139,61,255,.06), transparent 30%)',
      effect: 'orbs',
    }),
  },
  {
    id: 50265, title: 'Spy x Family', jp: 'SPY×FAMILY', year: 2022, episodes: 12, studio: 'Wit / CloverWorks',
    genres: ['Ação', 'Comédia'],
    tagline: 'Um espião, uma assassina e uma criança que lê mentes.',
    synopsis: 'O espião Twilight precisa montar uma família falsa para cumprir uma missão. Ele só não sabe que a filha adotada lê mentes e a esposa é uma assassina profissional.',
    theme: mkTheme({
      light: true, bg: '#fff4f6', surface: '#ffffff', text: '#2b2d42', muted: '#6f6d82',
      accent: '#e2547f', accent2: '#2a9d8f', display: "'Fredoka', sans-serif",
      pattern: 'radial-gradient(rgba(226,84,127,.16) 2px, transparent 2.5px) 0 0/28px 28px',
      effect: 'sparkles',
    }),
  },
  {
    id: 5114, title: 'Fullmetal Alchemist: Brotherhood', jp: '鋼の錬金術師', year: 2009, episodes: 64, studio: 'Bones',
    genres: ['Ação', 'Aventura', 'Drama', 'Fantasia'],
    tagline: 'Para obter algo, é preciso dar algo de igual valor.',
    synopsis: 'Após uma tentativa proibida de trazer a mãe de volta à vida, os irmãos Edward e Alphonse Elric pagam um preço terrível. Agora buscam a Pedra Filosofal para recuperar seus corpos — e descobrem uma conspiração que envolve o país inteiro.',
    theme: mkTheme({
      bg: '#160b0b', surface: '#221212', text: '#f6eadb', muted: '#bba48f',
      accent: '#c8202f', accent2: '#d4af37', display: "'Cinzel', serif",
      pattern: `${PATTERNS.alchemy} center/min(900px, 120vw) no-repeat fixed, radial-gradient(circle at 50% 50%, rgba(200,32,47,.15), transparent 60%)`,
      effect: 'embers',
    }),
  },
  {
    id: 16498, title: 'Attack on Titan', jp: '進撃の巨人', year: 2013, episodes: 25, studio: 'Wit Studio',
    genres: ['Ação', 'Drama', 'Mistério'],
    tagline: 'Além das muralhas, a liberdade — e algo muito pior.',
    synopsis: 'A humanidade vive cercada por muralhas gigantes para se proteger dos titãs. Quando a muralha é rompida, Eren Yeager jura exterminar todos eles — sem imaginar o quanto a verdade sobre o mundo é sombria.',
    theme: mkTheme({
      bg: '#17150f', surface: '#24211a', text: '#eee4cf', muted: '#a89d84',
      accent: '#c9a45c', accent2: '#5f7f4f', onAccent: '#17150f', display: "'Bebas Neue', sans-serif",
      pattern: 'repeating-linear-gradient(0deg, rgba(238,228,207,.035) 0 2px, transparent 2px 48px), repeating-linear-gradient(90deg, rgba(238,228,207,.035) 0 2px, transparent 2px 96px), radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.6))',
      effect: 'ash',
    }),
  },
  {
    id: 1535, title: 'Death Note', jp: 'デスノート', year: 2006, episodes: 37, studio: 'Madhouse',
    genres: ['Suspense', 'Sobrenatural', 'Mistério'],
    tagline: 'Um caderno. Um nome. Um novo deus do mundo.',
    synopsis: 'Light Yagami encontra um caderno capaz de matar qualquer pessoa cujo nome seja escrito nele. Decidido a criar um mundo sem crime, ele vira "Kira" — e começa um duelo mental contra o enigmático detetive L.',
    theme: mkTheme({
      bg: '#050505', surface: '#111111', text: '#e8e6e3', muted: '#8e8a86',
      accent: '#c0001a', accent2: '#e8e6e3', display: "'UnifrakturMaguntia', serif", body: "'Crimson Text', serif",
      pattern: 'repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 34px), radial-gradient(circle at 50% 0%, rgba(192,0,26,.18), transparent 50%), radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,.85))',
      effect: 'rain',
    }),
  },
  {
    id: 44511, title: 'Chainsaw Man', jp: 'チェンソーマン', year: 2022, episodes: 12, studio: 'MAPPA',
    genres: ['Ação', 'Terror', 'Sobrenatural'],
    tagline: 'Sonhos simples, motosserras barulhentas.',
    synopsis: 'Denji vive afundado em dívidas caçando demônios com seu cachorro-motosserra Pochita. Após ser traído e morto, renasce como o Homem-Motosserra e vira caçador de demônios oficial.',
    theme: mkTheme({
      bg: '#140505', surface: '#210b0b', text: '#fbe9e0', muted: '#c39a8c',
      accent: '#ff3b2f', accent2: '#ffb703', display: "'Permanent Marker', cursive",
      pattern: 'repeating-linear-gradient(-45deg, rgba(255,59,47,.06) 0 14px, transparent 14px 28px), radial-gradient(circle at 50% 0%, rgba(255,183,3,.14), transparent 50%)',
      effect: 'embers',
    }),
  },
  {
    id: 20, title: 'Naruto', jp: 'ナルト', year: 2002, episodes: 220, studio: 'Pierrot',
    genres: ['Ação', 'Aventura'],
    tagline: 'Nunca desista do seu jeito ninja.',
    synopsis: 'Naruto Uzumaki é um ninja órfão e barulhento que carrega dentro de si a raposa de nove caudas. Rejeitado pela vila, ele sonha em se tornar Hokage — o líder mais forte de Konoha — e fazer todos reconhecerem seu valor.',
    theme: mkTheme({
      bg: '#1a0f07', surface: '#2a190c', text: '#fff3e3', muted: '#c9a888',
      accent: '#ff7a00', accent2: '#2f5bd3', display: "'Bangers', cursive",
      pattern: 'radial-gradient(circle at 85% 15%, rgba(255,122,0,.25), transparent 35%), repeating-radial-gradient(circle at 85% 15%, rgba(255,122,0,.06) 0 2px, transparent 2px 42px)',
      effect: 'leaves',
    }),
  },
  {
    id: 21, title: 'One Piece', jp: 'ワンピース', year: 1999, episodes: null, studio: 'Toei Animation',
    genres: ['Ação', 'Aventura', 'Fantasia'],
    tagline: 'O maior tesouro do mundo está lá fora.',
    synopsis: 'Monkey D. Luffy, um garoto com corpo de borracha, sai ao mar com um sonho: encontrar o lendário tesouro One Piece e se tornar o Rei dos Piratas. No caminho, reúne uma tripulação inesquecível.',
    theme: mkTheme({
      bg: '#06182e', surface: '#0c2544', text: '#eaf4ff', muted: '#8fb0d1',
      accent: '#f5c518', accent2: '#e63946', onAccent: '#06182e', display: "'Pirata One', cursive",
      pattern: `${PATTERNS.waves} 0 0/120px 30px, linear-gradient(180deg, transparent, rgba(0,110,190,.30)), radial-gradient(ellipse at 50% 115%, rgba(245,197,24,.18), transparent 60%)`,
      effect: 'bubbles',
    }),
  },
  {
    id: 30, title: 'Neon Genesis Evangelion', jp: '新世紀エヴァンゲリオン', year: 1995, episodes: 26, studio: 'Gainax',
    genres: ['Ação', 'Ficção Científica', 'Drama'],
    tagline: 'Entre no robô. Encare o que está dentro de você.',
    synopsis: 'Quinze anos após uma catástrofe global, o jovem Shinji Ikari é convocado pelo pai para pilotar o Evangelion, um gigante biomecânico, contra os misteriosos Anjos que atacam Tóquio-3.',
    theme: mkTheme({
      bg: '#110a1d', surface: '#1c1230', text: '#efe9ff', muted: '#a597c4',
      accent: '#7cff4f', accent2: '#ff6b00', onAccent: '#110a1d', display: "'Anton', sans-serif",
      pattern: `repeating-linear-gradient(0deg, rgba(124,255,79,.035) 0 1px, transparent 1px 4px), ${PATTERNS.hex} 0 0/56px 100px, radial-gradient(circle at 80% 20%, rgba(255,107,0,.15), transparent 40%)`,
      effect: null,
    }),
  },
  {
    id: 47917, title: 'Bocchi the Rock!', jp: 'ぼっち・ざ・ろっく！', year: 2022, episodes: 12, studio: 'CloverWorks',
    genres: ['Comédia', 'Slice of Life'],
    tagline: 'Ansiedade social, solos de guitarra e uma banda.',
    synopsis: 'Hitori Gotoh, a "Bocchi", é uma guitarrista incrível e extremamente tímida que só toca no quarto. Até ser arrastada para uma banda e precisar encarar palcos, plateias e conversas.',
    theme: mkTheme({
      light: true, bg: '#ffe6ef', surface: '#ffffff', text: '#2d2a4a', muted: '#76708f',
      accent: '#ff4f9a', accent2: '#3fb6e0', display: "'Mochiy Pop One', sans-serif",
      pattern: 'radial-gradient(circle at 8% 90%, rgba(63,182,224,.28), transparent 35%), radial-gradient(circle at 92% 10%, rgba(255,209,102,.40), transparent 35%), repeating-linear-gradient(90deg, rgba(45,42,74,.035) 0 2px, transparent 2px 64px)',
      effect: 'notes',
    }),
  },
];

const CATALOG_BY_ID = Object.fromEntries(CATALOG.map((a) => [a.id, a]));

// Temas gerados para animes fora do catálogo (vindos da busca), pelo gênero principal
const GENRE_THEMES = {
  'Romance': mkTheme({ light: true, bg: '#fff1f4', surface: '#ffffff', text: '#3a2430', muted: '#8a6b78', accent: '#e8557a', accent2: '#f4a261', display: "'Cormorant Garamond', serif", pattern: 'radial-gradient(circle at 20% 20%, rgba(232,85,122,.18), transparent 40%)', effect: 'petals' }),
  'Terror': mkTheme({ bg: '#070a07', surface: '#111611', text: '#e2e8df', muted: '#8a9886', accent: '#7bd23a', accent2: '#b0001a', onAccent: '#070a07', display: "'UnifrakturMaguntia', serif", pattern: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.9))', effect: 'ash' }),
  'Ficção Científica': mkTheme({ bg: '#05121a', surface: '#0b1f2b', text: '#e3f6ff', muted: '#86a9b9', accent: '#22d3ee', accent2: '#a78bfa', onAccent: '#05121a', display: "'Anton', sans-serif", pattern: 'repeating-linear-gradient(0deg, rgba(34,211,238,.04) 0 1px, transparent 1px 4px)', effect: 'rain' }),
  'Esportes': mkTheme({ bg: '#140d05', surface: '#22170a', text: '#fff1df', muted: '#c4a886', accent: '#ff8c1a', accent2: '#2b6cb0', display: "'Bebas Neue', sans-serif", pattern: 'repeating-linear-gradient(-30deg, rgba(255,140,26,.05) 0 10px, transparent 10px 40px)', effect: 'embers' }),
  'Comédia': mkTheme({ light: true, bg: '#fffbe6', surface: '#ffffff', text: '#2e2a1f', muted: '#7d7563', accent: '#f59e0b', accent2: '#ec4899', onAccent: '#2e2a1f', display: "'Fredoka', sans-serif", pattern: 'radial-gradient(rgba(245,158,11,.18) 2px, transparent 2.5px) 0 0/26px 26px', effect: 'sparkles' }),
  'Fantasia': mkTheme({ bg: '#0f0b1f', surface: '#1a1433', text: '#efeaff', muted: '#a49cc8', accent: '#c084fc', accent2: '#fbbf24', display: "'Cinzel', serif", pattern: 'radial-gradient(circle at 30% 20%, rgba(192,132,252,.22), transparent 45%)', effect: 'sparkles' }),
  'Ação': mkTheme({ bg: '#120808', surface: '#1f0e0e', text: '#fbeae6', muted: '#c09a92', accent: '#ef4444', accent2: '#f59e0b', display: "'Bebas Neue', sans-serif", pattern: 'repeating-linear-gradient(-45deg, rgba(239,68,68,.05) 0 12px, transparent 12px 24px)', effect: 'embers' }),
  'Mistério': mkTheme({ bg: '#080b14', surface: '#111727', text: '#e5e9f5', muted: '#8d96b0', accent: '#6366f1', accent2: '#e5e9f5', display: "'Crimson Text', serif", pattern: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.7))', effect: 'rain' }),
  'Slice of Life': mkTheme({ light: true, bg: '#f2f7ee', surface: '#ffffff', text: '#27321f', muted: '#6f7d64', accent: '#6aa84f', accent2: '#f6a5c0', display: "'Fredoka', sans-serif", pattern: 'radial-gradient(circle at 80% 20%, rgba(246,165,192,.3), transparent 40%)', effect: 'petals' }),
};
const GENRE_PRIORITY = ['Terror', 'Romance', 'Ficção Científica', 'Esportes', 'Mistério', 'Slice of Life', 'Fantasia', 'Comédia', 'Ação'];

function themeForGenres(genres = []) {
  const g = GENRE_PRIORITY.find((k) => genres.includes(k));
  return g ? GENRE_THEMES[g] : THEMES.default;
}
// Animes fora do catálogo: tema do gênero + cor dominante da capa (vinda da AniList)
function themeFor(anime) {
  const cur = CATALOG_BY_ID[anime?.id];
  if (cur) return cur.theme;
  const base = themeForGenres(anime?.genres);
  const c = anime?.color;
  if (!c || !/^#[0-9a-f]{6}$/i.test(c)) return base;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (base.light ? lum > 0.75 : lum < 0.25) return base; // cor ilegível no fundo do tema
  return { ...base, accent: c, onAccent: lum > 0.6 ? '#111111' : '#ffffff' };
}

const GENRE_PT = {
  Action: 'Ação', Adventure: 'Aventura', Comedy: 'Comédia', Drama: 'Drama', Fantasy: 'Fantasia',
  Romance: 'Romance', 'Sci-Fi': 'Ficção Científica', Horror: 'Terror', Mystery: 'Mistério',
  Sports: 'Esportes', 'Slice of Life': 'Slice of Life', Supernatural: 'Sobrenatural',
  Suspense: 'Suspense', 'Award Winning': 'Premiado', 'Boys Love': 'BL', 'Girls Love': 'GL',
  Gourmet: 'Culinária', 'Avant Garde': 'Experimental', Thriller: 'Suspense', Psychological: 'Psicológico',
  Music: 'Música', 'Mahou Shoujo': 'Mahou Shoujo', Mecha: 'Mecha', Ecchi: 'Ecchi',
};

const STATUS = {
  assistindo: { label: 'Assistindo', icon: '▶' },
  quero: { label: 'Quero assistir', icon: '🔖' },
  completo: { label: 'Completo', icon: '✔' },
  abandonado: { label: 'Abandonado', icon: '✕' },
};

// ===== Conteúdo inicial da comunidade (usuários fictícios) =====
const H = 3600e3;
const SEED_REVIEWS = [
  { animeId: 52991, author: 'lua_de_papel', rating: 5, ep: 28, text: 'É o anime mais delicado que vi em anos. Cada episódio parece uma carta de despedida e de reencontro ao mesmo tempo.', ago: 30 * H },
  { animeId: 52991, author: 'gabs.otaku', rating: 4, ep: 12, text: 'Ritmo lento, mas no bom sentido. A trilha sonora carrega muito.', ago: 70 * H },
  { animeId: 38000, author: 'kaique_sz', rating: 5, ep: 19, text: 'A animação desse estúdio é outro nível. O ep 19 me deixou sem reação.', ago: 12 * H },
  { animeId: 40748, author: 'mari.kun', rating: 4, ep: 24, text: 'Lutas absurdas e personagens carismáticos. Só queria mais tempo com alguns deles.', ago: 50 * H },
  { animeId: 1535, author: 'detetive_b', rating: 5, ep: 25, text: 'O jogo de gato e rato é perfeito. Assisti tudo em três dias.', ago: 200 * H },
  { animeId: 5114, author: 'pedra_filosofal', rating: 5, ep: 64, text: 'Começo, meio e fim impecáveis. Recomendo pra quem quer uma história fechada.', ago: 90 * H },
  { animeId: 47917, author: 'introvertida_feliz', rating: 5, ep: 8, text: 'Nunca me senti tão representada por um desenho. E as músicas são ótimas!', ago: 5 * H },
  { animeId: 50265, author: 'familia_forger', rating: 4, ep: 12, text: 'Leve, engraçado e com ação na medida. Perfeito pra assistir no fim do dia.', ago: 20 * H },
  { animeId: 16498, author: 'muralha_maria', rating: 5, ep: 25, text: 'A primeira temporada já te prende pelo choque. Prepare o coração.', ago: 300 * H },
  { animeId: 20, author: 'ramen_ichiraku', rating: 4, ep: 135, text: 'Tem fillers, mas a jornada do Naruto vale cada minuto.', ago: 120 * H },
];

const SEED_THREADS = [
  { animeId: 52991, title: 'Frieren fala mais sobre luto do que muito drama por aí', body: 'Achei incrível como o anime trata a passagem do tempo. Alguém mais chorou em cenas que parecem "simples"?', author: 'lua_de_papel', ep: 1, spoiler: false, likes: 42, ago: 6 * H,
    replies: [
      { author: 'gabs.otaku', body: 'Demais! As cenas de flashback são as que mais pegam.', ago: 5 * H },
      { author: 'mago_flamme', body: 'É um anime sobre lembrar das pessoas enquanto elas ainda estão aqui.', ago: 3 * H },
    ] },
  { animeId: 52991, title: '[SPOILER] O exame de magos de primeira classe', body: 'O arco do exame foi muito melhor do que eu esperava. A dinâmica entre os candidatos e a última prova são excelentes.', author: 'mago_flamme', ep: 18, spoiler: true, likes: 17, ago: 26 * H, replies: [] },
  { animeId: 38000, title: 'Qual a melhor respiração?', body: 'Pra mim nenhuma supera a da água, pela estética das animações. E vocês?', author: 'kaique_sz', ep: 5, spoiler: false, likes: 31, ago: 9 * H,
    replies: [{ author: 'nezuko_cute', body: 'Trovão!! Rápida e dramática.', ago: 8 * H }] },
  { animeId: 38000, title: '[SPOILER] Aquela luta no episódio 19', body: 'A cena da dança do deus do fogo é das coisas mais bonitas já animadas na TV.', author: 'nezuko_cute', ep: 19, spoiler: true, likes: 58, ago: 40 * H, replies: [] },
  { animeId: 40748, title: 'Primeira vez assistindo, vale a pena ver o filme 0 antes?', body: 'Tô no ep 3 e vi que tem um filme. Assisto agora ou depois da temporada?', author: 'mari.kun', ep: 3, spoiler: false, likes: 9, ago: 2 * H,
    replies: [{ author: 'feiticeiro_grau1', body: 'Depois da primeira temporada fica bem melhor.', ago: 1 * H }] },
  { animeId: 1535, title: 'Light estava certo em algum momento?', body: 'Debate aberto: a ideia de justiça dele tinha alguma lógica no começo?', author: 'detetive_b', ep: 1, spoiler: false, likes: 77, ago: 72 * H, replies: [] },
  { animeId: 47917, title: 'Indiquem bandas parecidas com a Kessoku Band', body: 'Viciei nas músicas, quero ouvir coisas no mesmo estilo!', author: 'introvertida_feliz', ep: 8, spoiler: false, likes: 22, ago: 4 * H, replies: [] },
  { animeId: null, title: 'Qual anime vocês indicariam pra quem nunca viu nenhum?', body: 'Minha amiga quer começar e eu fiquei em dúvida entre Spy x Family e Fullmetal. Opiniões?', author: 'gabs.otaku', ep: 0, spoiler: false, likes: 35, ago: 10 * H,
    replies: [
      { author: 'familia_forger', body: 'Spy x Family! Episódios leves e fáceis de maratonar.', ago: 9 * H },
      { author: 'pedra_filosofal', body: 'Fullmetal, sem dúvida. Mostra tudo que um anime pode ser.', ago: 7 * H },
    ] },
];
