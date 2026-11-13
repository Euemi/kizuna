# 絆 Kizuna

**Cada anime é um mundo. Entre nele.**

🌐 **Acesse:** <https://euemi.github.io/kizuna/>

Kizuna é uma plataforma para descobrir animes, montar sua estante e discutir com a comunidade, no estilo do Skoob, só que para animes. O diferencial é que a página de cada anime ganha o visual daquele universo: cores, tipografia, padrão de fundo e efeitos animados mudam conforme o anime que você abre.

> 絆 (*kizuna*) significa "laço": o vínculo que a gente cria com as histórias e com quem assiste junto.

## ✨ O que já funciona

| | |
|---|---|
| 🎨 **Temas por anime** | Cada mundo curado tem um cenário desenhado e animado: a vila ninja ao entardecer com shurikens caindo em Naruto, glicínias e borboletas em Demon Slayer, ondas, navio e bússola em One Piece, a muralha e a fumaça dos titãs em Attack on Titan, o caderno, a maçã e as páginas em Death Note, o campo de flores de Frieren, holofotes e a caixa de papelão em Bocchi the Rock!, lanternas, ervas e o palácio interno em Diários de uma Apotecária, grimórios e antimagia em Black Clover, o ゴゴゴ ameaçador em JoJo... São 24 mundos criados à mão (as continuações e temporadas novas entram no mesmo mundo), e os outros animes ganham um cenário do gênero com a cor da capa. |
| 🔍 **Descobrir** | Destaques com filtro por gênero, animes em exibição, os mais populares e busca em todo o catálogo, com as sinopses traduzidas automaticamente para o português. |
| 📚 **Estante** | Assistindo, Quero assistir, Completo, Abandonado e Favoritos. |
| ▶️ **Progresso por episódio** | Botão "+1", barra de progresso e mudança automática de status ao começar ou terminar um anime. |
| ⭐ **Notas e resenhas** | Nota de 1 a 5, e cada resenha mostra em que episódio a pessoa estava quando escreveu. |
| 💬 **Fórum sem spoiler** | Cada tópico indica até que episódio ele comenta. Se você ainda não chegou lá, o conteúdo fica escondido. |
| 👤 **Perfil** | Criado uma única vez, com @nome de usuário, cor do avatar e gêneros favoritos. Mostra nível, XP, episódios assistidos, nota média e atividade recente. |
| 🏅 **Badges** | 19 conquistas em bronze, prata, ouro e especiais, que são desbloqueadas usando a plataforma: maratonar, resenhar, debater no fórum, explorar todos os mundos... |

## 🚀 Como rodar

O site é só HTML, CSS e JavaScript, sem etapa de build. Basta servir a pasta:

```bash
python -m http.server 5500
```

Depois abra <http://localhost:5500>.

## 🧱 Estrutura

```
index.html        página única com o roteamento por hash
css/style.css     estilos e variáveis de tema (com transição suave entre mundos)
js/data.js        catálogo curado, temas de cada anime e conteúdo inicial da comunidade
js/store.js       estante, resenhas e fórum (salvos no localStorage por enquanto)
js/api.js         dados reais de animes via AniList (GraphQL público)
js/fx.js          partículas animadas: pétalas, brasas, bolhas, chuva, notas...
js/app.js         páginas, componentes e ações
```

### Como criar o visual de um novo anime

Adicione uma entrada em `CATALOG`, no arquivo `js/data.js`, com o ID do anime no MyAnimeList e um `theme`:

```js
theme: mkTheme({
  bg: '#0a1210', surface: '#111c19', text: '#f3ece4', muted: '#9fb3ab',
  accent: '#e8475a', accent2: '#b48ee0',
  display: "'Shippori Mincho', serif",          // fonte do título
  pattern: 'repeating-conic-gradient(...)',     // fundo em CSS
  effect: 'petals',  // leaves | petals | bubbles | embers | ash | orbs | rain | sparkles | notes
})
```

## 🗺️ Próximos passos

- [ ] Contas de usuário e banco de dados compartilhado (ex.: Supabase), para o fórum e as resenhas serem de verdade
- [ ] Mais mundos curados
- [ ] Seguir amigos e ver o que eles estão assistindo
- [ ] Recomendações com base na sua estante
- [x] Publicar no GitHub Pages

## 🙏 Créditos

Dados e capas fornecidos pela [AniList](https://anilist.co). Os nomes e imagens dos animes pertencem aos seus respectivos autores e estúdios. Este é um projeto de fãs, sem fins comerciais.
