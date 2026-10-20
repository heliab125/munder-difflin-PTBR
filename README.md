<div align="center">

<img src="./docs/logo.png" alt="Munder Difflin, o harness de agentes para administrar um escritório dos seus clones" width="180">

# Munder Difflin

### Harness de agentes para administrar um escritório dos seus clones

<p>
  <a href="https://trendshift.io/repositories/46562" target="_blank" rel="noopener noreferrer"><img alt="GitHub Trending: #1 Repository of the Day" src="./docs/badge-github-trending.png" width="250" height="54"></a>
  <a href="https://www.producthunt.com/products/munder-difflin?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_campaign=badge-munder-difflin" target="_blank" rel="noopener noreferrer"><img alt="Munder Difflin, #5 Product of the Day on Product Hunt" src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=1221363&theme=light&period=daily" width="250" height="54"></a>
</p>

<img src="./docs/media/floor.png" alt="O andar do escritório do Munder Difflin: agentes em suas mesas trabalhando em paralelo, com a Central de Comando e um terminal de agente ao vivo à direita" width="1240">

**Gratuito, open source e de alto desempenho.** Um harness multiagente que funciona com as
assinaturas que você já paga, dentro dos limites por hora delas. Ele transforma a CLI de
programação de terminal que você já usa em um clone de você, que continua trabalhando enquanto você
está fora e coordena um escritório inteiro de agentes na sua própria máquina.

Envolve o [Claude Code](https://claude.com/claude-code), Antigravity (Gemini), OpenAI Codex,
**xAI Grok**, **Kimi Code**, **Gemini CLI**, **Qwen**, **OpenCode**, **Crush**,
**pi.dev**, **GitHub Copilot CLI** e **Cursor**, com chaves próprias e LLMs locais.
Agentes que trocam mensagens, roteiam e lembram, coordenados por **seu clone** (Michael) e
visualizados como avatares trabalhando em um andar de escritório compartilhado.

<p>
  <em>Electron · React · TypeScript · Pixi.js · xterm.js · node-pty</em>
</p>

<p>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <a href="./CHANGELOG.md"><img alt="Version: 0.5.8" src="https://img.shields.io/badge/version-0.5.8-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <a href="https://github.com/chaitanyagiri/munder-difflin/releases"><img alt="Downloads across all releases" src="https://img.shields.io/github/downloads/chaitanyagiri/munder-difflin/total?style=flat-square&label=downloads&color=F4D35E&labelColor=6E1423"></a>
  <img alt="Status: pre-release" src="https://img.shields.io/badge/status-pre--release-F4F1EA.svg?style=flat-square&labelColor=6E1423">
  <img alt="Platform: macOS | Windows | Linux" src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-F4F1EA.svg?style=flat-square&labelColor=6E1423">
  <a href="./CONTRIBUTING.md"><img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <a href="https://munderdiffl.in/blog/"><img alt="Blog" src="https://img.shields.io/badge/blog-guides%20%26%20postmortems-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <a href="https://discord.gg/SEDzP5ZPk5"><img alt="Discord" src="https://img.shields.io/badge/Discord-join%20the%20office-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
</p>

<br>

<!-- Inline player renders on github.com (raw URL required; relative paths only link). -->
<video src="https://github.com/chaitanyagiri/munder-difflin/raw/main/docs/media/hero.mp4" controls muted loop playsinline width="820">
  <a href="https://github.com/chaitanyagiri/munder-difflin/raw/main/docs/media/hero.mp4">▶ Assista ao andar: Munder Difflin comandando um hive de agentes Claude Code</a>
</video>

<br><br>

**[⬇ Baixar 0.5.8 para macOS, Windows ou Linux](https://harnessmd.com/download)**

<sub>Builds de macOS são assinados e notarizados. Você não precisa compilar a partir do código-fonte para usá-lo.
O build open source está na <a href="https://github.com/HarnessMD/munder-difflin/releases">página de releases do GitHub</a>.</sub>

**Cancele suas assinaturas do Granola e do Wispr Flow.** Ele dita em qualquer app e transcreve suas
reuniões, tudo rodando localmente.

**Novo por aqui?** Comece pelo [guia de instalação](https://munderdiffl.in/blog/how-to-install-and-use-munder-difflin/), depois
pela [sua primeira hora](https://munderdiffl.in/blog/your-first-hour-with-munder-difflin/), e veja [todos os agentes no nosso próprio andar](https://munderdiffl.in/blog/ai-agent-use-cases-our-office/).

<sub><b>Oferta de lançamento:</b> o Pro é grátis para todos até sábado, 24 de outubro de 2026: baixe o app e entre.
Depois disso, o plano anual Pro é US$ 150, ajustado pelo poder de compra em diferentes países, chegando a US$ 100
por ano. <a href="https://app.harnessmd.com/console/license">Obter Pro</a></sub>

</div>

> [!NOTE]
> **Distribuição PT-BR.** Este é o README da distribuição em Português do Brasil do Munder Difflin.
> A interface está 100% em Português do Brasil. Nomes de produtos, comandos, caminhos de arquivo,
> chaves e URLs permanecem como no original.

---

> [!NOTE]
> **Os melhores agentes do mundo. A pior empresa de papel do mundo.**
> O Munder Difflin pega as CLIs de agentes de terminal que você já usa (`claude`, `agy`, `codex`, `grok`,
> `kimi`, `qwen`, `opencode`, `crush`, `pi` e `copilot`) e as transforma
> em uma equipe que se coordena sozinha: cada agente ganha memória de longo prazo, uma caixa de correio e uma mesa em um
> andar de escritório 2D, e **seu clone** (Michael) roteia o trabalho entre eles enquanto você observa. Ele é o
> chefe do andar; você continua sendo o chefe dele.

## Sumário

- [Agentes suportados](#supported-agents)
- [Planos de assinatura e provedores suportados](#planos-de-assinatura-e-provedores-suportados)
- [O que é](#what-it-is)
- [Como funciona](#how-it-works)
- [Recursos](#features)
- [Primeiros passos](#getting-started)
- [Arquitetura e estrutura do projeto](./docs/ARCHITECTURE.md)
- [Roteiro](#roadmap)
- [Contribuindo](#contributing)
- [Telemetria](#telemetry)
- [Licença](#license)
- [Agradecimentos](#acknowledgements)

<a id="supported-agents"></a>
## Agentes suportados

**Traga a CLI que você já paga.** Cada uma delas roda como um processo real em seu próprio
terminal, com sua assinatura existente e seus limites por hora. Se roda em um terminal,
roda aqui.

<p>
  <a href="https://docs.claude.com/en/docs/claude-code"><kbd>Claude Code</kbd></a>
  <a href="https://github.com/openai/codex"><kbd>Codex · GPT</kbd></a>
  <a href="https://x.ai/cli"><kbd>Grok · xAI</kbd></a>
  <a href="https://www.kimi.com/code"><kbd>Kimi Code</kbd></a>
  <a href="https://github.com/google-gemini/gemini-cli"><kbd>Gemini CLI</kbd></a>
  <a href="https://antigravity.google/docs/cli-overview"><kbd>Antigravity · Gemini</kbd></a>
  <a href="https://github.com/QwenLM/qwen-code"><kbd>Qwen</kbd></a>
  <a href="https://opencode.ai/docs"><kbd>OpenCode</kbd></a>
  <a href="https://github.com/charmbracelet/crush"><kbd>Crush · Charm</kbd></a>
  <a href="https://pi.dev/docs/latest"><kbd>Pi</kbd></a>
  <a href="https://docs.github.com/copilot/concepts/agents/about-copilot-cli"><kbd>GitHub Copilot</kbd></a>
  <a href="https://cursor.com/docs/cli/install"><kbd>Cursor</kbd></a>
  <kbd>+ qualquer comando personalizado</kbd>
</p>

Além disso, **traga suas próprias chaves** e **modelos locais** via Ollama, LM Studio ou vLLM.

## Planos de assinatura e provedores suportados

Esta distribuição oferece suporte de primeira classe aos principais planos de assinatura e provedores:

- **Alibaba AI Token Plan** (DashScope / Alibaba Cloud Model Studio)
- **OpenCode nativo** (CLI detectada localmente)
- **BytePlus Coding Plan** (Ark)
- **Z.ai** (GLM Coding Plan)
- **DeepSeek API direta**
- **OpenAI**
- **Anthropic**
- **Endpoints personalizados compatíveis com OpenAI**

### Detecção do OpenCode local

Quando o OpenCode está instalado na máquina, o harness o detecta automaticamente e lê a configuração local em
`~/.config/opencode/` de forma segura. A leitura serve para reconhecer provedor, plano e modelo disponíveis;
chaves e segredos não são expostos.

### Planos e limites de subagentes simultâneos

| Plano | Preço | Subagentes simultâneos |
| --- | --- | --- |
| Alibaba Token Plan Lite/Starter | US$ 9/mês (ou trial) | 2 |
| Alibaba Token Plan Standard | US$ 18/mês | 4 |
| Alibaba Token Plan Pro/Plus | US$ 36+/mês | 8 |
| BytePlus / Z.ai / outros | conforme o plano | perfis equivalentes ou personalizado |

O limite é aplicado de verdade no processo principal, antes de criar o PTY — e não apenas na interface.
Ao atingir o teto, o subagente excedente é bloqueado com uma mensagem clara em Português do Brasil: em um
plano com limite de 4, o 5º subagente é bloqueado antes de o PTY ser criado.

No painel inicial (modo PRO), você vê o provedor ativo, o plano reconhecido, o modelo principal e um medidor
visual de subagentes no formato **X/limite**.

### Novidades da 0.5.8

A versão 0.5.8 traz o workspace **PRO** redesenhado: navegação lateral compacta, cards do orquestrador
com orçamento/disjuntor/tarefas/aguardando você, barra de comando integrada e uma grade de agentes no
mesmo estilo do aplicativo oficial. O modo **Clássico** continua disponível no seletor da barra de título.
Os planos Alibaba/OpenCode e a trava de subagentes seguem ativos no PRO. A 0.5.8 também
corrige a detecção do OpenCode no app empacotado: o app consulta o PATH do seu shell de login,
encontra o binário em `~/.opencode/bin` e carrega no seletor os modelos reais da sua CLI.

<a id="what-it-is"></a>
## O que é

O Munder Difflin é um aplicativo de desktop que envolve **CLIs de agentes de terminal reais** como agentes plenamente capazes,
conecta-os em uma **mente coletiva (hive)** e coloca **seu clone** no comando. Michael é o único agente com quem *você*
conversa para fazer as coisas acontecerem. Por baixo, ele executa a **camada de memória mais rápida do
mundo** para que cada agente lembre o que aprendeu e recupere isso instantaneamente.

- **Todo terminal é um agente.** Cada sessão `claude`, `agy`, `codex`, `grok`, `kimi`, `qwen`, `opencode`, `crush`, `pi`, `copilot` ou personalizada roda como um processo real
  em um pseudo-terminal (`node-pty`), autêntico byte a byte, renderizado com xterm.js.
- **Todo agente é um avatar.** As sessões aparecem como personagens em um andar de escritório Pixi.js. Eles caminham
  até as estações enquanto trabalham, e envelopes voam de mesa em mesa quando trocam mensagens.
- **O hive os coordena.** Os agentes leem sua memória e esvaziam uma caixa de correio; o roteador move
  mensagens entre caixas de entrada; o agente GOD julga, atribui e escala apenas quando precisa de você.
- **Memória instantânea.** Uma camada de memória markdown-first com índice de recuperação semântica faz os agentes
  lembrarem entre sessões e recuperarem em milissegundos.

<a id="how-it-works"></a>
## Como funciona

```
            você ── fala com ──►  ┌─────────────────┐
                                  │   agente GOD    │  orquestrador / supervisor
                                  │ (escritório do  │  equipe · roteamento · adjudicação
                                  │    Michael)     │  quadro compartilhado · registro de tarefas
                                  └────────┬────────┘
                                           │ atribui · roteia · escala
              ┌────────────────────────────┼────────────────────────────┐
              ▼                            ▼                            ▼
        ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
        │  agente A   │  mensagem  │  agente B   │  mensagem  │  agente C   │
        │  provedor   │ ─────────► │  provedor   │ ─────────► │  provedor   │
        │  + memória  │            │  + memória  │            │  + memória  │
        └─────────────┘            └─────────────┘            └─────────────┘
              └──────────── hive compartilhado: memória · correio · quadro · log ─────────────┘
```

1. **Você cria os agentes**: cada um é um processo de terminal normal (`claude`, `agy`, `codex` ou personalizado)
   com seu próprio diretório de trabalho, identidade e ciclo de vida específico do provedor.
2. **Os agentes colaboram pelo hive**: um repositório git local de arquivos simples. Eles escrevem em seu próprio
   `outbox/`; o roteador do harness entrega nas `inbox/` dos destinatários. Nenhum agente toca no git
   (o design de committer único evita corrupção do `index.lock`).
3. **O agente GOD comanda o andar**: ele lê cada solicitação, resolve as rotineiras sozinho (mantendo
   o sistema totalmente autônomo) e escala apenas itens *críticos* (gastos, operações destrutivas, mudanças
   de escopo) para uma fila de aprovações que você analisa.
4. **Tudo é visível**: você vê os avatares se moverem, os envelopes voarem e o fluxo ao vivo do terminal;
   pode digitar de volta em qualquer sessão, navegar pelos arquivos e ler o histórico git dela.

Veja [`HIVE.md`](./HIVE.md) para o design multiagente completo, [`SPEC.md`](./SPEC.md) para o
plano de terminal/eventos e [`DESIGN.md`](./DESIGN.md) para o sistema visual.

<a id="features"></a>
## Recursos

<table>
<tr>
<td width="50%" valign="middle">

### Cancele suas assinaturas do Granola e do Wispr Flow

**Dite em qualquer app.** Segure Option no Mac, ou Control+Alt+Space no Windows e Linux (X11),
fale e solte. As palavras entram no campo que estiver na sua frente, e em toda caixa de texto dentro do
Munder Difflin. O microfone da caixa de mensagem também funciona na versão gratuita.

**As reuniões ouvem os dois lados**, no Stapler, parte do Pro. Seu microfone é gravado como Você e o
áudio da chamada como Eles, no Mac, Windows e Linux. Shift+Command+Space inicia e para uma reunião no
Mac, Control+Shift+Space no Windows e Linux. Corrija a transcrição, adicione uma descrição e
envie para qualquer um dos seus agentes.

**Transcrição na sua máquina.** Um modelo Whisper vem dentro do app e é o mecanismo padrão.
Um modelo maior está a um download de distância, o reconhecedor on-device da Apple funciona no macOS 26, e o Groq fica
desligado a menos que você adicione uma chave. 126 nomes técnicos embutidos mais as suas próprias palavras. Inglês por enquanto.

<img src="./docs/media/stapler-053.png" alt="Stapler, o disco amarelo, com seu anel aberto e Gravar reunião pronto" width="360">

</td>
<td width="50%" valign="middle">

### Uma linha por agente, e ela conta tudo

Classic, o tema gratuito, ganha os novos cartões de agente: status, engine, modelo, um medidor de contexto, o
ticket em que está trabalhando e a ação que está executando agora, uma faixa de falha em vez de um terminal silencioso,
e um menu de contexto para as tarefas comuns.

O Pro ganha a nova barra lateral: Tarefas, Caixa de entrada, Automações, Memória, Capacidades e o Stapler no
topo, agentes agrupados sob seus projetos, uma linha ao vivo por agente, **Perguntou a você** na linha quando um
agente tem uma pergunta, notas pesquisáveis e **Manter minha ordem de agentes** para arrastar agentes e projetos
para onde quiser. Arraste a borda da barra lateral para aumentá-la, passe o mouse sobre um ticket para ver detalhes ou
alterne para mostrar apenas agentes e notas.

</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Fale com um agente, não com doze

Michael é seu clone e o único agente que você orienta. Ele atribui o trabalho, roteia o tráfego e
escala as poucas coisas que realmente precisam de você.

</td>
<td width="50%">
  <a href="https://github.com/chaitanyagiri/munder-difflin/raw/main/docs/media/demo/orchestrator.mp4"><img src="./docs/media/demo/orchestrator-poster.jpg" alt="Briefing para Michael, o agente orquestrador, a partir da Central de Comando" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Contrate um agente em poucos cliques

Escolha a CLI, o modelo e a autonomia, dê uma mesa a ele, e ele começa a trabalhar. Importe um
papel pronto da [Galeria de Agentes](https://munderdiffl.in/hires/) se preferir não
começar do zero.

</td>
<td width="50%">
  <img src="./docs/screenshots/add-agent.png" alt="A caixa de diálogo de adicionar agente: escolha de provedor, modelo e papel" width="100%">
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Memória que sobrevive à sessão

Cada agente mantém uma memória em markdown que é minerada para um palácio compartilhado e pesquisável. Feche o app,
volte amanhã, e eles ainda sabem o que aprenderam.

</td>
<td width="50%">
  <img src="./docs/screenshots/memory.png" alt="Pesquisando o palácio de memória compartilhado entre todos os agentes" width="100%">
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Autonomia com coleira

Defina até onde cada agente pode ir sozinho. Gastos, escopo e operações destrutivas voltam para
você, e um disjuntor direciona, restringe e então interrompe qualquer coisa que entre em loop ou fuja do controle.

</td>
<td width="50%">
  <img src="./docs/screenshots/autonomy.png" alt="Configurações de autonomia e aprovação por agente" width="100%">
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Veja o andar inteiro trabalhar

Agentes caminham até as estações enquanto trabalham e envelopes voam de mesa em mesa quando trocam mensagens.
Clique em qualquer mesa para ler aquele terminal ao vivo e digitar diretamente nele.

</td>
<td width="50%">
  <a href="https://github.com/chaitanyagiri/munder-difflin/raw/main/docs/media/demo/agents.mp4"><img src="./docs/media/demo/agents-poster.jpg" alt="Agentes trabalhando em paralelo no andar do escritório" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Configure uma vez

O assistente de onboarding verifica o que você já tem e oferece instalar o que falta, em vez de
mandar você para uma página de documentação.

</td>
<td width="50%">
  <a href="https://github.com/chaitanyagiri/munder-difflin/raw/main/docs/media/demo/setup.mp4"><img src="./docs/media/demo/setup-poster.jpg" alt="O assistente de configuração da primeira execução" width="100%"></a>
</td>
</tr>
</table>

**O andar**
- **Todo terminal é um agente real.** Claude Code, Antigravity (Gemini), OpenAI Codex, xAI Grok, Kimi Code, Gemini CLI, Qwen, OpenCode, Crush, pi.dev, GitHub Copilot CLI, Cursor ou um comando personalizado, cada um em seu próprio PTY `node-pty`, renderizado com xterm.js.
- **Todo agente é um avatar.** Um andar de escritório Pixi.js onde agentes caminham até estações, envelopes voam de mesa em mesa e o estado do avatar reflete o trabalho real.
- **Um orquestrador GOD com quem você conversa.** Ele roteia tarefas, julga o tráfego e escala apenas o que precisa de um humano. Ou pressione **Falar** e comande o andar por voz.
- **Worktrees git por agente.** Isolamento opcional para que agentes paralelos nunca colidam em branches.
- **Mais de um andar** (0.5.3). Arquivo, Novo andar abre outro escritório em sua própria pasta, em sua própria janela, com seus próprios agentes, quadro e memória. Uma pasta só abre em um andar, e uma licença cobre todos eles.

**Memória e coordenação**
- **O hive**: memória por agente, caixas de correio em arquivos atômicos, um quadro compartilhado, um log de eventos somente de acréscimo, git de committer único.
- **Recuperação semântica**: memória markdown minerada para um palácio compartilhado, pesquisável pela interface, com condensação para não crescer para sempre.
- **Knowledge Graph empresarial**: seus próprios documentos e políticas, consultáveis por qualquer agente.

**Controle e segurança**
- **Portões humanos**: gastos, escopo e operações destrutivas escalam para você. Direcione em tempo de execução ou pare de forma graciosa.
- **Disjuntor**: uma escada de direcionar → restringir → parar para agentes que entram em loop, disparam erros em tempestade ou estouram o orçamento.
- **Orçamentos e telemetria**: orçamentos de tokens por agente, custo real a partir das transcrições, um livro-razão durável, spans OTel e uma cascata de ferramentas.

**Central de Comando**
- **Tickets com chaves** (0.5.3): cada cartão ganha uma chave como V53-299, cada agente tem uma aba Tarefas com o que fez e quando, e a tela de Tarefas filtra por data.
- Tarefas kanban com dependências, missões agendadas + heartbeat, monitoramento ao vivo da frota, pesquisa de memória, log de atividades e um observador de CI.
- **Skills**: o que cada agente já sabe fazer em Claude Code, OpenCode e Codex, além de um catálogo navegável com mais 227, com busca, filtros, instalação e desinstalação.
- **IDE Monaco embutida**: árvore de arquivos, abas de editor, salvamento, além de trilhos git MUDANÇAS · HISTÓRICO · COMPARAR com grafo de commits, diffs, comparação de branches e checkout protegido. Todo acesso a fs/git é intermediado pelo processo principal (main).

**Entrada e saída de trabalho**
- **Slack e webhooks**: envie mensagem a um canal ou faça POST em um webhook; Michael pode criar um worker efêmero, responder na thread e destruí-lo.
- **Contratações compartilháveis + Galeria de Agentes**: importe um papel de um link `munderdifflin://hire`; a importação apenas preenche o formulário, um humano ainda o cria. Navegue pelos papéis na [Galeria de Agentes](https://munderdiffl.in/hires/).
- **Transcrição e ditado locais** (0.5.3): dite em qualquer app (Option no Mac,
  Control+Alt+Space no Windows e Linux X11), e o Stapler no Pro transcreve reuniões com Você e
  Eles no Mac, Windows e Linux. Um modelo Whisper incluído é o mecanismo padrão; o reconhecedor on-device
  da Apple no macOS 26 e o Groq com sua própria chave são opções. Um vocabulário embutido de 126
  nomes técnicos mantém Anthropic, Claude, Kubernetes e ARR escritos corretamente, e você pode adicionar os seus.
- **Fale com um agente pelo Stapler** (Pro): Gravar mensagem, várias capturas de tela por mensagem, PDFs,
  vídeos e pastas, e um menu Para que lembra quem você escolheu.
- **Chaves BYOK + LLMs locais**: chaves por provedor em um broker de segredos somente-escrita, além de URLs base Ollama / LM Studio / vLLM. Guias: [modelos abertos](https://munderdiffl.in/blog/run-munder-difflin-on-open-models/) · [Mac Mini](https://munderdiffl.in/blog/run-munder-difflin-on-a-mac-mini/).
- **Atualizações em um clique**: o selo da barra de título executa a atualização real. Ele baixa o build para sua máquina, depois reinicia e instala, e lê `latest` quando uma verificação confirma que você está atualizado. O download manual é o fallback para quando o atualizador não consegue buscar o build sozinho. A primeira execução depois disso abre as notas daquela versão como uma página projetada, em vez de um número de versão.
- **Seu idioma**: inglês, chinês simplificado e árabe, com layout da direita para a esquerda no árabe. O inglês é o padrão e nada muda até você escolher outro em Configurações. O app não lê o locale do sistema operacional. As três fontes do app vêm dentro do pacote, então nada é buscado na inicialização.
- **Pré-requisitos**: uma página de Configurações mostrando quais ferramentas de apoio (uv, git, Node, MemPalace, cada CLI de agente) você tem, para que serve cada uma, e um botão que pede a Michael para instalar o que falta.

> [!NOTE]
> **Status: v0.5.6. Capacidades, Integrações e Equipes, e menos tokens.**
> **O Pro é grátis para todos até sábado, 24 de outubro de 2026**, como parte do lançamento: baixe o app e entre.
> Estas notas descrevem o app 0.5.6 na [página de download](https://harnessmd.com/download).
> **Capacidades (Pro)**: um marketplace de 2.347 servidores MCP, skills, plugins e ferramentas da lista pública
> [HarnessMD/awesome-agent-capabilities](https://github.com/HarnessMD/awesome-agent-capabilities). Revisamos 622 deles;
> o restante aparece como "Listado, não revisado por nós" e não tem botão Instalar. Uma mudança mesclada chega ao app sem
> novo release, e o app usa a lista apenas quando ela carrega nossa assinatura.
> **Integrações**: um único lugar para Slack, webhooks, os apps que seus agentes usam e suas chaves, cada um com um status simples e
> as últimas 50 coisas que aconteceram. Nada é salvo até você pressionar Salvar.
> **Equipes**: seu escritório conversa com os escritórios dos seus colegas. Um chat simples por colega, você escolhe quem responde cada um,
> e arquivos e pastas vão como um link com senha, para um download.
> **Menos tokens por padrão**: Compactar quando o contexto enche e Limpar ao trocar de trabalho estão ativados em toda nova instalação.
> A limpeza roda quando o trabalho de um agente muda após uma sessão de 60 minutos, e um `handoff.md` na pasta do agente
> carrega o fio da conversa. Uma nova instalação não tem standup por hora. Em uma repetição de um escritório de 13 agentes Claude ao longo de uma
> semana, com essas duas mudanças, o uso de tokens caiu cerca de 37%. Isso é uma repetição, não uma medição ao vivo.
> **Arquivos de agente (Pro)**: exporte um agente como arquivo e escolha o que entra; uma chave, um token ou o valor de um segredo nunca
> entra. 36 modelos substituem os pacotes de papel.
> **Temps**: qualquer agente duradouro pode iniciar um temp, um agente de curta duração para um trabalho, não apenas o orquestrador. Onde quer que você
> escolha quem responde (Slack, um colega, um webhook, o "Envia para" de um agendamento, o "Enviar capturas para" do Stapler), você pode escolher
> **Um temp** ou **Um temp, clone de** um dos seus agentes. **Temps por agente** (0 a 4) e **Máximo de temps ao mesmo tempo** ficam na
> aba **Orçamento e disjuntor** do orquestrador.
> **Slack**: um bot responde em **Todos os canais** em que está por padrão, ou apenas nos canais que você marcar, e em mensagens
> diretas; as respostas ficam na thread. Configure o app Slack a partir do manifesto: pressione **Copiar manifesto** em
> **Como obter estes**. O Slack volta sozinho após uma inicialização falha.
> **Limites de tokens por período**: A cada 5 horas, Diário, Semanal ou Mensal, para o escritório e para cada agente. Eles substituem
> os antigos tetos de tokens.
> **Entrar e contas no app**: pressione **Abrir navegador para entrar** e entre por lá; a tela avança sozinha,
> ou você cola o código em **Código do navegador**. **Sair** e **Mudar para Equipes** ficam no menu de perfil.
> **Disjuntor**: um agente que parou conforme instruído não é mais restringido de novo, e o mesmo aviso não é enviado duas vezes
> em dez minutos.
> **Correções**: a janela não trava mais após horas, hooks funcionam no modo automático do Claude Code, o login funciona em uma rede com
> certificado próprio, uma mensagem para o Codex não espera mais pelo Enter, o campo de nome de pasta do Windows mostra o nome e não
> o caminho inteiro, o clique no Dock funciona na primeira vez com o Stapler ativado, e o Haiku 5.5 está na lista de modelos.
> Novo por aqui? O [guia de instalação](https://munderdiffl.in/blog/how-to-install-and-use-munder-difflin/) e [sua primeira hora](https://munderdiffl.in/blog/your-first-hour-with-munder-difflin/) cobrem cada passo.
>
> **v0.5.3: Cancele suas assinaturas do Granola e do Wispr Flow.**
> O Stapler faz as duas coisas, tudo rodando localmente, e todo agente fica mais fácil de iniciar, reiniciar e direcionar.
> **Dite em qualquer app**: segure Option no Mac (permissões de Microfone e Acessibilidade), ou
> Control+Alt+Space no Windows e Linux X11, fale e solte. O Wayland explica por que não consegue.
> **As reuniões ouvem os dois lados** no Stapler, parte do Pro: Você e Eles, no Mac, Windows e Linux,
> transcritas localmente, depois corrigidas, descritas e enviadas para qualquer um dos seus agentes.
> **Transcrição na sua máquina**: um modelo Whisper incluído por padrão, um modelo maior opcional de 190 MB,
> o reconhecedor on-device da Apple no macOS 26, e Groq apenas se você adicionar uma chave.
> A 0.5.3 transcreve inglês. O modelo incluído é somente inglês; no macOS 26 o ditado roda no mecanismo da Apple, que segue o idioma do Mac e foi testado em inglês. Outros idiomas chegam como download de modelo em uma versão posterior.
> **Uma CLI ausente é um cartão, não um erro**: instale e entre de dentro do app para cada
> engine, com Configurar manualmente quando qualquer um falhar. **Pergunte-me** na Caixa de entrada de cada agente, respondido de
> uma caixa acima do compositor. **Mais de um andar**: Arquivo, Novo andar (Shift+Command+N, ou Control+Shift+N) executa outro
> escritório em sua própria pasta, com seus próprios agentes, quadro e memória, e uma licença cobre todos os andares. **Enviar agora** entra direto, **Reiniciar e continuar**
> mantém a conversa para cada engine, e **Opus 5.5** é o modelo Claude padrão.
> **Configurações, redesenhadas**: um único botão Salvar para tudo, webhooks de entrada para GitHub, Linear, Telegram
> e os seus próprios, cada um com o agente que responde, e segredos personalizados armazenados criptografados ao lado
> das suas chaves de provedor. **Falhas preservam seu trabalho**: um agente que falhou mantém o trabalho não commitado. A IDE abre com Command+I com localizar e substituir, a alça de reordenação da barra lateral
> fica à direita em árabe, e o código na IDE é lido da esquerda para a direita em todos os idiomas.
> A compactação automática roda a cada 40 minutos em 30 por cento da janela de contexto, a mesma barra em
> todos os tamanhos de modelo, enquanto o padrão anterior era a cada duas horas em 60 por cento.
> **Tarefas que você pode acompanhar**: cada ticket ganha uma chave de três letras como V53-299, tirada do nome
> da pasta do hive ou definida em Configurações, Autonomia. Cada agente tem uma aba **Tarefas** ao lado de Caixa de entrada e
> Terminal com o que fez e quando, a tela de Tarefas filtra por Hoje, Esta semana, Este mês ou
> Todo o período, e um cartão cai em qualquer lugar de uma coluna. Passe o mouse sobre um ticket na barra lateral para ver detalhes.
> **A barra lateral do Pro** tem a largura que você arrastar, e uma configuração mostra apenas agentes e notas. Com
> mais de um andar aberto, cada janela e ícone do Dock carrega o número do escritório.
> **Correções do Stapler**: o microfone para no clique, nenhuma palavra se perde em uma pausa, Gravar mensagem nunca
> trava, o arrasto segue seu ponteiro, Redefinir o coloca no meio da tela, e ele nunca
> fica fora da tela.
> Correções: o terminal de um agente reiniciado volta a aceitar o mouse, o repositório do hive não engole mais
> as pastas git dos agentes para dentro do seu banco de objetos e o espaço em disco volta, e um evento de hook agora
> renderiza uma linha na barra lateral com o registro de tarefas lido uma vez.
> Fora desta versão: o bug de rolagem e fila do Kimi, que não conseguimos reproduzir, e está em primeiro
> na lista da 0.5.4.
> Antes disso, a v0.4.6 trouxe uma interface em chinês simplificado e árabe com suporte da direita para a esquerda
> e fontes auto-hospedadas, o selo de atualização que executa o download e a reinicialização reais, e o trabalho
> de segurança na validação de nomes de CLI e analytics.
> **Se você está na 0.3.8, atualize:** a proteção de limite de uso daquele build nunca liberava os agentes que segurava,
> e ela foi removida por completo.
> Builds de macOS (assinados e notarizados), Windows e Linux estão na
> [página de download](https://harnessmd.com/download). O build open source está na
> [página de releases](https://github.com/HarnessMD/munder-difflin/releases).

<div align="right">(<a href="#munder-difflin">↑ voltar ao topo</a>)</div>

<a id="getting-started"></a>
## Primeiros passos

### Baixe o app

**A maioria das pessoas quer este.** O Munder Difflin é gratuito e open source. Builds assinados e notarizados de macOS
da 0.5.6, além de Windows e Linux, estão na [página de download](https://harnessmd.com/download).
O build open source está na [página de releases do GitHub](https://github.com/HarnessMD/munder-difflin/releases). Instale-o,
abra-o, e o assistente leva você pelo resto. O [guia de instalação](https://munderdiffl.in/blog/how-to-install-and-use-munder-difflin/) percorre
cada passo e cada correção. Você não precisa de Node, de uma toolchain nem deste
repositório.

Você ainda precisa de pelo menos uma CLI de agente na sua máquina. A partir da 0.5.3, uma CLI ausente aparece como um cartão
no terminal do agente: Instalar executa o comando, você entra no app e o agente inicia.
**Configurações → Pré-requisitos** lista o resto.

**O Pro** adiciona Capacidades, arquivos de agente, Stapler e a nova barra lateral. Como parte do lançamento, é grátis para todos
até sábado, 24 de outubro de 2026. Depois disso, o plano anual é US$ 150, ajustado pelo poder de compra, chegando a
US$ 100 por ano.
[Obter Pro](https://app.harnessmd.com/console/license)

### Compilar a partir do código-fonte

Tudo abaixo é para contribuidores e para pessoas que querem executar um build não lançado.

### Pré-requisitos

- **macOS, Windows ou Linux**.
- **Node.js 18+** e npm.
- Uma **toolchain C/C++** para o addon nativo do `node-pty`. No macOS, instale as Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```
- Pelo menos uma CLI de agente suportada no seu `PATH`, uma entre **[Claude Code](https://claude.com/claude-code)**
  (`claude`, o padrão), **Antigravity** (`agy`), **OpenAI Codex** (`codex`), **xAI Grok** (`grok`),
  **Kimi Code** (`kimi`), **Gemini CLI** (`gemini`), **Qwen** (`qwen`), **OpenCode** (`opencode`),
  **Crush** (`crush`), **pi.dev** (`pi`), **GitHub Copilot** (`copilot`) ou **Cursor** (`cursor-agent`).
  A maioria das CLIs ausentes se auto-corrige: o harness executa o instalador no
  terminal e continua no novo binário.
- *Opcional:* **suas próprias chaves de API e LLMs locais** em **Configurações → Engines de IA** (Ollama / LM Studio / vLLM).
- *Opcional:* o índice de memória semântica para recuperação instantânea entre sessões. A memória markdown funciona sem ele.

### Instalar e executar

```bash
git clone https://github.com/chaitanyagiri/munder-difflin.git
cd munder-difflin
npm install        # postinstall rebuilds node-pty against Electron's ABI
npm run dev        # launches the Electron app with hot reload
```

Na primeira execução, você passa pelo assistente de onboarding e chega ao andar. Use **Adicionar agente** para
criar sua primeira sessão. O agente GOD se acomoda automaticamente no escritório do Michael.

### Outros scripts

```bash
npm run build      # production build via electron-vite
npm run preview    # preview the production build
npm run typecheck  # type-check the node (main/preload) and web (renderer) projects
```

> Se o `node-pty` falhar ao carregar após uma atualização do Electron, execute `npm install` novamente (o hook `postinstall`
> roda `electron-rebuild` contra a ABI atual do Electron).

## Build e release PT-BR

A distribuição PT-BR compila instaladores nativos para **macOS Intel (x64)** e **Windows (x64)**:

```bash
npm ci
npm run typecheck      # main + preload + renderer
npm test               # 972 testes (node:test)
npm run build

# macOS Intel: dist/Munder-Difflin-<versão>-mac-x64.dmg e .zip
npm run dist:mac:x64

# Windows x64: dist/Munder-Difflin-<versão>-win-x64-setup.exe e -portable.exe
npm run dist:win:x64
```

O workflow [`.github/workflows/release-ptbr.yml`](./.github/workflows/release-ptbr.yml) executa a mesma
sequência em runners nativos (`macos-13` para Intel e `windows-2022` para x64) e publica os artefatos.
`node-pty` e `better-sqlite3` são módulos nativos: cada sistema compila o seu próprio binário, por isso
não há cross-build de C++ entre macOS e Windows. Builds sem certificado Apple saem **não assinados** —
o macOS pode pedir “Abrir mesmo assim” no primeiro lançamento.

## Arquitetura

Dois planos de dados alimentam um único renderer: um **plano de terminal** que possui os PTYs, o sistema de arquivos e o git,
e um **plano de eventos** que executa o hive, o servidor de hooks e o roteador. O renderer fala com
ambos apenas por uma ponte tipada.

**Os diagramas completos, a estrutura do projeto módulo a módulo e o sistema de design ficam em
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).** Eles saíram deste arquivo para que ele possa explicar
o produto em vez do código. Veja também [`HIVE.md`](./HIVE.md) para o design multiagente,
[`SPEC.md`](./SPEC.md) para o plano de terminal e eventos, e [`DESIGN.md`](./DESIGN.md) para o
sistema visual.

<div align="right">(<a href="#munder-difflin">↑ voltar ao topo</a>)</div>

<a id="roadmap"></a>
## Roteiro

Lançado até a **v0.5.6**: Capacidades, Integrações e Equipes, arquivos de agente com 36 modelos, limites de tokens por
período, menos tokens por padrão com um arquivo de handoff que atravessa uma sessão limpa, temps que qualquer
agente pode iniciar e que podem responder mensagens de entrada, um bot Slack para cada canal em que está, login e contas
dentro do app, um disjuntor mais silencioso, ditado local em qualquer app e reuniões com os dois lados da chamada,
com o modelo no instalador, os novos cartões de agente no build gratuito e uma nova barra lateral Pro, uma
CLI ausente que você instala e acessa de dentro do app, Pergunte-me em toda Caixa de entrada, mais de um
andar em uma máquina, chaves de ticket e uma aba Tarefas em cada agente, Configurações redesenhadas com webhooks de entrada e segredos personalizados, Opus 5.5 como o modelo Claude
padrão, uma barra de compactação para cada tamanho de modelo, uma interface em chinês simplificado e árabe com suporte da direita para a esquerda
e fontes auto-hospedadas, doze engines de agente com chaves BYOK e LLMs locais, orquestração por voz,
o hive (memória · caixas de correio · quadro · log de eventos), Central de Comando com kanban e agendamentos
por dia da semana, uma IDE Monaco embutida com trilhos git, registro de integrações + broker de segredos,
workers criados pelo Slack, contratações compartilháveis e a Galeria de Agentes, observabilidade e o disjuntor,
persistência durável, retomada de sessão, andares em múltiplas janelas, atualizações em um clique, um navegador
de Skills, uma verificação ao vivo de Pré-requisitos, relatórios de custo dobrados a partir do livro-razão, memória semântica
que funciona em Apple Silicon, e um atualizador que instala o build em vez de apontar para ele.
Histórico completo em [`CHANGELOG.md`](./CHANGELOG.md).

A seguir:

- [ ] **Mais integrações de chat**: Telegram e pontes de chat mais ricas que levam um canal para a fila do Michael e roteiam as respostas de volta.
- [ ] **Mais engines e modelos de integração**: continuar crescendo o catálogo de engines e o registro de integrações.
- [ ] **Cobertura de avatares mais completa**: conduzir as visitas restantes às estações e as bolhas de ferramentas inteiramente a partir de eventos de hook reais.
- [ ] **Layout e histórico de comandos duráveis**: estender a persistência ao layout dos agentes e ao histórico por sessão.

<div align="right">(<a href="#munder-difflin">↑ voltar ao topo</a>)</div>

<a id="contributing"></a>
## Contribuindo

Contribuições são bem-vindas. Este é um software pré-lançamento com muita superfície. Comece com
[`CONTRIBUTING.md`](./CONTRIBUTING.md). A versão curta: faça um fork, `npm install && npm run dev`, mantenha
`npm run typecheck` verde, e **derive qualquer nova UI a partir dos tokens do [`DESIGN.md`](./DESIGN.md)**. Boas
primeiras áreas: conectar eventos de hook reais, o fluxo de adicionar agente, a gaveta de configuração e trabalho multiplataforma.

> [!IMPORTANT]
> **Todo pull request precisa mostrar um antes e um depois**: capturas de tela, ou uma gravação quando a
> coisa se move, sob os títulos `### Before` e `### After` no template de PR. Isso é verificado
> automaticamente e um PR sem isso não é mesclado. "Minha mudança não tem UI" não é uma isenção; isso
> apenas muda a aparência da evidência. Veja
> [A evidência é obrigatória](./CONTRIBUTING.md#evidence-is-mandatory).

Perguntas, bugs, ou quer exibir seu escritório? Entre no Discord: **<https://discord.gg/SEDzP5ZPk5>**. Adicione seu handle do Discord a um PR e você receberá o papel `employee of the month` quando ele for mesclado.

**Procurando por onde começar?** A
[`good first issue`](https://github.com/chaitanyagiri/munder-difflin/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
lista é mantida com trabalhos pequenos e autocontidos que têm uma linha de chegada clara.

**Todos cujo código está no Munder Difflin aparecem em [`CONTRIBUTORS.md`](./CONTRIBUTORS.md).**
Se esse é você, é sua para mostrar. A lista é gerada a partir dos próprios pull requests e
se atualiza sozinha, então você aparece sem precisar pedir. Ela também nomeia as contribuições que estão em
`main` mas que o GitHub mostra como fechadas em vez de mescladas, porque esse foi o nosso erro de registrar
e não o deles de explicar.

<a href="./CONTRIBUTORS.md">
  <img src="https://contrib.rocks/image?repo=chaitanyagiri/munder-difflin" alt="Colaboradores do Munder Difflin">
</a>

<a id="telemetry"></a>
## Telemetria

Builds oficiais enviam um **pequeno conjunto de eventos de uso anônimos** (app aberto, agente criado, recurso
usado), nunca prompts, código, caminhos de arquivo ou saída de agente. A lista completa de eventos, as garantias
de anonimato e as três formas de desativar (alternância em Configurações, `DO_NOT_TRACK`, ou compilar a partir do
código-fonte, forks compilam sem chave e não enviam nada) estão documentadas em
[`TELEMETRY.md`](./TELEMETRY.md).

<a id="license"></a>
## Licença

> [!IMPORTANT]
> **Licenciamento de assets.** O pixel art incluído (tilesets e mapas) é **Modern Interiors - RPG Tileset
> [16X16]** de [LimeZu](https://limezu.itch.io/moderninteriors), usado sob a **Complete Version
> licence**, que permite edição e uso em projetos comerciais e não comerciais. **O crédito a
> LimeZu é exigido por essa licença** e deve permanecer. O elenco do Office não é arte da LimeZu. Ele
> é desenhado proceduralmente em `portraitArt.ts`. Veja
> [`src/renderer/src/assets/ATTRIBUTION.md`](./src/renderer/src/assets/ATTRIBUTION.md).

O **código-fonte** está licenciado sob a **Licença MIT**. Veja [`LICENSE`](./LICENSE). A concessão MIT
cobre apenas o código; o pixel art incluído é licenciado separadamente pela LimeZu e está isolado em
[`LICENSE-ASSETS`](./LICENSE-ASSETS). *Munder Difflin* é uma paródia afetuosa e não é afiliado a *The Office* da NBC nem à
Dunder Mifflin.

<a id="acknowledgements"></a>
## Agradecimentos

- [LimeZu](https://limezu.itch.io/) pelos tilesets de pixel art *Modern Interiors* (licença Complete Version).
- [`shahar061/the-office`](https://github.com/shahar061/the-office) pelo fornecimento do tileset/mapa do escritório.
- [Pixi.js](https://pixijs.com/) · [xterm.js](https://xtermjs.org/) · [node-pty](https://github.com/microsoft/node-pty) · [electron-vite](https://electron-vite.org/) · [CodeMirror](https://codemirror.net/) pelas bibliotecas sobre as quais isto é construído.
- [Remotion](https://www.remotion.dev/) pelos clipes animados de "como funciona" da landing page (`landing-remotion/`).
- *The Office* (US) por Munder Difflin, Inc.