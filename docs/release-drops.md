# Drops de release

Um **drop** é uma página de release autoral — exibida centralizada, em tamanho
cheio, na primeira vez que o app de um usuário vê a release. Ele substitui o resumo
de três tópicos do toast de canto pelo que você desenhar.

Releases sem drop não são afetadas: elas continuam recebendo o toast de resumo. Isso
é aditivo, então nenhuma release passada muda de comportamento.

## Como escrever

Coloque HTML entre dois marcadores em qualquer lugar do corpo da release no GitHub:

```markdown
## Novidades da 0.5.0

Markdown normal, para quem lê isto no github.com.

<!-- drop -->
<section class="hero">
  <h1>Os agentes do Windows finalmente podem conversar entre si.</h1>
  <p>Metade dos nossos downloads. Quebrados em silêncio. Não mais.</p>
  <video src="https://…/demo.mp4" autoplay muted loop playsinline></video>
</section>
<style>
  .hero { padding: 48px 40px; background: linear-gradient(160deg,#1b1524,#2e2140); color:#f4efe6; }
  .hero h1 { font-size: 2.4rem; letter-spacing:-.02em; }
</style>
<!-- /drop -->
```

Tudo entre os marcadores vira a página. O markdown ao redor fica intacto, então a
página da release no github.com continua legível.

Os dois marcadores precisam estar presentes e em ordem. Um par desbalanceado é
ignorado e a release volta para o resumo — um drop meio analisado renderizaria como
markup quebrado para todo usuário, então é tratado como nenhum drop.

## O que você pode usar

Imagens, vídeo, áudio, fontes web, gradientes, transforms, grid, flexbox, animações
keyframe, `prefers-color-scheme`, `prefers-reduced-motion`. Recursos remotos precisam
ser **https** (ou `data:`/`blob:`).

Uma pequena paleta de tokens é predefinida — `--ink`, `--ink-soft`, `--paper`,
`--cream`, `--lemon`, `--mint`, `--coral` — para um drop combinar com o app sem
redeclarar as cores. Ignore-as totalmente para um visual sob medida.

## O que você não pode usar, e por quê

**Sem JavaScript. Sem formulários. Sem links funcionais.**

O drop é markup remoto controlado pelo autor. O renderer onde ele cairia tem
`window.cth` conectado — `spawnPty`, `writeFileText`, `updateConfig`. Execução de
script ali não é um bug de estilo: é execução de código arbitrário na máquina do
usuário com a autoridade total do app, disponível para qualquer um que consiga
publicar uma release ou interceptar a requisição.

Por isso o drop renderiza dentro de um iframe com `sandbox=""` (sem scripts, sem
same-origin, sem formulários, sem popups, sem navegação de nível superior) e uma CSP
própria `default-src 'none'`. Dois controles independentes, cada um suficiente
sozinho.

Como nada no frame pode navegar, **os botões do próprio modal carregam toda ação** —
"abrir releases", "reiniciar para atualizar", o link da estrela, "depois". Projete em
torno deles; não coloque um link de call-to-action no drop esperando que o clique
funcione.

Se um dia um drop realmente precisar de script, a mudança é `allow-scripts` no
iframe — e ela **nunca** deve ser combinada com `allow-same-origin`, porque essa
combinação deixa o frame remover o próprio sandbox.

## Pré-visualizando antes de publicar

O caminho de atualização só roda em builds empacotados, então o modo dev tem um hook
de simulação:

```js
await window.cth.updateSimulate({ version: '0.5.0', notes: '<cole o corpo>' })
```

Rode no DevTools (⌥⌘I → Console). Apenas dev — bloqueado por `!app.isPackaged`.

Para ver o pedido de estrela de novo depois que ele já foi usado:

```js
localStorage.removeItem('cth.updateStarAsked')
```

## Uma coisa a saber sobre tags de pré-release

`/releases/latest` exclui pré-releases e o canal `latest` do electron-updater as
ignora, então uma tag `-rc` nunca dispara o toast ou o drop para usuários estáveis.
Só um `X.Y.Z` maior e simples faz isso. Teste drops com `updateSimulate`, não
publicando um rc.