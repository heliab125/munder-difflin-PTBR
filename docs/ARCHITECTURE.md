# Arquitetura, estrutura do projeto e sistema de design

_Movido do README para que aquele documento cumpra o papel de explicar o produto._
_Este é o mapa do contribuidor. Comece por aqui antes do seu primeiro pull request._

## Arquitetura

Dois planos de dados alimentam um único renderer:

```
┌───────────────────────────────────────────────────────────────┐
│                     Electron Renderer (React)                  │
│   ┌──────────────────┐    ┌──────────────────────────────┐    │
│   │ Andar do escritório│   │ Terminal + Barra de comandos │    │
│   │ (Pixi.js)        │    │ Arquivos + abas Git (xterm.js)│   │
│   └─────────▲────────┘    └────────────▲─────────────────┘    │
│             │ estado dos avatares      │ bytes do pty / fs / git│
└─────────────┼──────────────────────────┼───────────────────────┘
              │ IPC (contextBridge: window.cth)
       ┌──────┴──────────┐        ┌──────┴─────────────┐
       │  Plano de eventos│      │  Plano de terminal │
       │  hooks / colmeia │      │  PTYs node-pty     │
       │  roteador + GOD  │      │  + fs + git        │
       └────────▲────────┘        └──────▲─────────────┘
                │ payloads de hook       │ stdin / stdout
                └─────────┬──────────────┘
                   ┌──────┴──────────────┐
                   │ claude / agy / codex│
                   └─────────────────────┘
```

- **Plano de terminal.** O processo principal possui um `PtyManager` que inicia cada agente como um
  processo `node-pty` e transmite a saída por IPC por id (`pty:data:<id>`). O renderer fala apenas
  através de uma ponte tipada `window.cth` ([`src/preload/index.ts`](../src/preload/index.ts)), que
  também expõe helpers de sistema de arquivos e git em sandbox.
- **Plano de colmeia / eventos.** `hive.ts` é a camada multiagente em disco; `hooks.ts` executa o
  servidor de hooks para onde as pontes dos provedores enviam payloads de ciclo de vida (`cth-hook`
  para Claude Code, `agy-hook` para Antigravity). `memory.ts` envolve a CLI de memória semântica.
  O roteador entrega mensagens, drena as caixas de saída dos provedores, o agente GOD julga, e os
  despertares de inatividade/caixa de entrada mantêm os trabalhadores drenando o correio.

## Estrutura do projeto

```
src/
  main/                      Processo principal do Electron (Node)
    index.ts                 janela, handlers IPC, proteção de saída
    pty.ts                   gerenciador node-pty (spawn/write/resize/kill/stream)
    hive.ts                  camada multiagente em disco (memória, caixas de correio, roteador)
    hooks.ts                 servidor de hooks + shims de hook dos provedores (`cth-hook`, `agy-hook`)
    memory.ts                camada de memória semântica (wrapper da CLI, degrada para no-op)
    config.ts                persistência da configuração do harness + preparação da pasta inicial
    transcript.ts            lê transcrições JSONL em ~/.claude/projects/ para telemetria real de tokens/custo
    telemetry.ts             coletor OTel ao vivo + feed de uso/custo para observabilidade
    usage.ts / pricing.ts    interface UsageProvider + atribuição de custo por modelo
    breaker.ts / control.ts  disjuntor de custo/execução descontrolada (orientar/restringir/parar) + gate HITL / steer / stop
    reflect.ts               MemoryReflector — condensação de memória
    db.ts                    armazenamento durável SQLite (limites de janela + histórico) + livro-razão de custos
    github.ts                ingestão de issues e execuções de CI do GitHub via CLI gh
    shellEnv.ts              resolve PATH e ambiente de shell para processos filhos
    fs.ts / git.ts           pontes de sistema de arquivos e git em sandbox
  preload/                   contextBridge → API tipada window.cth
  renderer/src/
    App.tsx                  layout de nível superior + fiação
    design/                  tokens.css / tokens.ts / global.css (fonte da verdade do design)
    components/              PixelPanel, AgentDetailPanel, CommandBar, ApprovalsPanel, MemoryPanel, …
    CommandCenterPanel,      superfície de controle do Michael (abas Terminal/Andar/Memória/Atividade/Tarefas/Gatilhos/Manual)
    ToolWaterfall,           waterfall de spans de ferramentas por agente para a visão de observabilidade
    TasksKanban,             quadro kanban com dependências (aba Tarefas)
    ThreadsPanel,            visualizador de conversas de mensagens da colmeia (aba Mensagens)
    MessageQueueComposer,    estaciona mensagens para um agente ocupado
    scene/office/            andar Pixi: OfficeFloor, Character, Camera, cast, pathfinding, …
    store/ · hooks/          store zustand, loop de eventos, parser de PTY, typewriter
    assets/                  tilesets, mapas, folhas de personagem (veja ATTRIBUTION.md)
docs/                        `logo.png`, `banner.png`, landing page (GitHub Pages → munderdiffl.in)
docs/media/                  `og.png` (previews sociais) + clipes Remotion renderizados
landing-remotion/            projeto Remotion que renderiza os clipes "como funciona" da landing
HIVE.md · SPEC.md · DESIGN.md   multiagente · terminal/eventos · design visual
docs/message-queue.md        quem pode digitar no terminal de um agente, e quando
```

<div align="right">(<a href="#munder-difflin">↑ voltar ao topo</a>)</div>

## Sistema de design

A estética é **Animal Crossing × Earthbound × menus de SNES** — pixel-snapped, robusta e amigável.
[`DESIGN.md`](../DESIGN.md) é canônico; todo componente deriva dos seus tokens. A marca Munder Difflin
aplica um **vinho Dunder-Mifflin** (`#6E1423`) e **dourado** (`#F4D35E`) por cima para o logo e o
chrome. Os 15 avatares são o elenco de *The Office*, diferenciados por receitas de cabelo/pele/camisa.