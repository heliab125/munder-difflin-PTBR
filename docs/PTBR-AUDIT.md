# Auditoria de localização PT-BR — strings hardcoded em inglês

**Repositório:** `munder-difflin-PTBR`  
**Data:** 2026-10-20  
**Escopo:** `src/renderer/src/**/*.tsx|ts` (exceto `i18n/locales`), `src/main/*.ts`, `src/preload/*.ts`, `src/shared/*.ts`  
**Idioma de destino:** PT-BR  
**Código-fonte alterado:** sim — a auditoria foi aplicada. O locale `pt-BR` está registrado e é o padrão; as strings de interface listadas abaixo foram traduzidas, incluindo menus nativos, diálogos, notificações, erros, tooltips, estados vazios e conteúdo ambiente. As seções a seguir permanecem como registro histórico da varredura original.

## Resumo

| Métrica | Valor |
|---|---:|
| Ocorrências totais (UI + conteúdo ambiente) | **869** |
| Arquivos com ocorrências | **52** |
| P1 — telas principais | **138** ocorrências em 130 itens |
| P2 — demais componentes/renderer | **157** ocorrências em 149 itens |
| P3 — main/shared/scene | **574** ocorrências em 138 itens (410 são falas ambiente) |

> O total inclui ~410 falas ambiente da cafeteria (`cafeteriaLines.ts`), agrupadas em uma única linha da tabela P3. Sem esse conteúdo ambiente, o total de strings de interface é **459**.

### Como ler a coluna “Chave i18n”

- `✅ chave` — a chave já existe em `src/renderer/src/i18n/locales/en.json`; basta passar a chamar `t()` no ponto indicado (em alguns casos a chave tem texto ligeiramente diferente e pode ser reutilizada ou ajustada).
- `➕ chave` — não existe chave adequada; a chave sugerida é nova e deve ser adicionada a `en.json` (e aos demais locales).
- Textos marcados como “conteúdo de prompt” são exibidos em campos do formulário, mas alimentam prompts de agentes; a recomendação é avaliar caso a caso antes de traduzir.

### Método e exclusões

- Varredura AST com o compilador TypeScript sobre todos os arquivos do escopo, cobrindo texto JSX, `placeholder`, `title`, `aria-label`, `data-tip`, `alt`, labels/mensagens de diálogo, notificações, menus nativos e objetos de copy em `shared`.
- Foram excluídos: comentários, logs de console, chaves de API, URLs, comandos shell, nomes de variáveis/tipos/enums internos, classes CSS e mensagens de erro puramente técnicas que não chegam à UI.
- Textos de fallback dentro de `<Trans i18nKey="...">` não foram contados quando a chave existe em `en.json` (ex.: parágrafos do onboarding).
- Conteúdo remoto (`hero.json`, release notes do GitHub) e nomes de produtos/marcas não foram traduzidos.
- Strings de prompt de sistema, descrições de ferramentas do modelo e mensagens internas agente↔agente ficaram fora do escopo de UI.
- `AiEnginesSettings` mantém os hints de endpoint em inglês por decisão do próprio código (dados técnicos). Mensagens de validação de manifestos em `shared/hire.ts` também não foram contadas por serem validação técnica de formato.
- O arquivo `src/renderer/src/i18n/locales/pt-BR.json` foi registrado em `src/renderer/src/i18n/index.ts` e é o idioma padrão desta distribuição. O catálogo tem paridade total de chaves com `en.json` (1170 chaves em ambos).
- A contagem de ~410 falas da cafeteria é exata para os literais de diálogo do arquivo; elas foram agrupadas em uma linha para não inflar o relatório com conteúdo decorativo.

## P1 — Telas principais

| # | Arquivo:linha | String original | Tradução PT-BR sugerida | Chave i18n |
|---:|---|---|---|---|
| 1 | `src/renderer/src/App.tsx:311` | auto mode on | modo automático ativado | ➕ `app.autoModeOn` |
| 2 | `src/renderer/src/App.tsx:311` | auto mode off | modo automático desativado | ➕ `app.autoModeOff` |
| 3 | `src/renderer/src/App.tsx:333` | Light theme | Tema claro | ➕ `app.lightTheme` |
| 4 | `src/renderer/src/App.tsx:333` | Dark theme | Tema escuro | ➕ `app.darkTheme` |
| 5 | `src/renderer/src/App.tsx:334` | Toggle dark mode | Alternar modo escuro | ✅ `fullscreenTerminal.toggleTheme` |
| 6 | `src/renderer/src/App.tsx:352` | Settings (data-tip) | Configurações | ➕ `common.settings` |
| 7 | `src/renderer/src/App.tsx:353` | Settings (aria-label) | Configurações | ➕ `common.settings` |
| 8 | `src/renderer/src/App.tsx:379` | Exit focus mode (Esc) | Sair do modo foco (Esc) | ✅ `fullscreenTerminal.exitFullscreen` |
| 9 | `src/renderer/src/App.tsx:379` | Focus mode | Modo foco | ➕ `app.focusMode` |
| 10 | `src/renderer/src/App.tsx:380` | Toggle focus mode | Alternar modo foco | ➕ `app.toggleFocusMode` |
| 11 | `src/renderer/src/App.tsx:412` | EMPTY FLOOR | ANDAR VAZIO | ➕ `app.emptyFloorTitle` |
| 12 | `src/renderer/src/App.tsx:415` | No agents on the floor yet. Spawn one to see real claude output stream in here. | Ainda não há agentes no andar. Contrate um para ver a saída real do Claude em tempo real aqui. | ➕ `app.emptyFloorBody` |
| 13 | `src/renderer/src/App.tsx:419` | add agent | adicionar agente | ✅ `agentStrip.addAgent` |
| 14 | `src/renderer/src/App.tsx:450` | WAKING THE FLOOR | ACORDANDO O ANDAR | ➕ `app.wakingFloor` |
| 15 | `src/renderer/src/App.tsx:452` | is clocking in. | está batendo o ponto. | ➕ `app.clockingIn` |
| 16 | `src/renderer/src/App.tsx:453` | The terminal will land here once he's seated. | O terminal aparecerá aqui assim que ele se acomodar. | ➕ `app.terminalSeated` |
| 17 | `src/renderer/src/App.tsx:465` | NO AGENT SELECTED | NENHUM AGENTE SELECIONADO | ➕ `app.noAgentSelected` |
| 18 | `src/renderer/src/App.tsx:467` | Spawn an agent from the strip below. | Contrate um agente na faixa abaixo. | ➕ `app.spawnFromStrip` |
| 19 | `src/renderer/src/App.tsx:468` | The terminal and command bar will land here. | O terminal e a barra de comandos aparecerão aqui. | ➕ `app.terminalAndCommandBar` |
| 20 | `src/renderer/src/App.tsx:472` | add agent | adicionar agente | ✅ `agentStrip.addAgent` |
| 21 | `src/renderer/src/components/AgentDetailPanel.tsx:108` | unknown error | erro desconhecido | ➕ `common.unknownError` |
| 22 | `src/renderer/src/components/AgentDetailPanel.tsx:178` | Edit {name}: their name and face, which engine they run on, and the briefing that tells them what they are for. | Editar {name}: o nome e o rosto, o motor que ele usa e o briefing que diz para que ele serve. | ➕ `agentDetail.editTip` |
| 23 | `src/renderer/src/components/AgentDetailPanel.tsx:179` | Edit this agent | Editar este agente | ➕ `agentDetail.editAria` |
| 24 | `src/renderer/src/components/AgentDetailPanel.tsx:182` |  edit (label after icon) |  editar | ➕ `agentDetail.edit` |
| 25 | `src/renderer/src/components/CommandCenterPanel.tsx:350` | 'the orchestrator' (fallback) | 'o orquestrador' (fallback) | ➕ `common.theOrchestrator` |
| 26 | `src/renderer/src/components/CommandCenterPanel.tsx:431` | Cannot resume a session through a different provider. | Não é possível retomar uma sessão usando outro provedor. | ➕ `commandCenter.errResumeProvider` |
| 27 | `src/renderer/src/components/CommandCenterPanel.tsx:445` | No recorded session ID; current process was left running. | Nenhum ID de sessão registrado; o processo atual foi mantido em execução. | ➕ `commandCenter.errNoSessionId` |
| 28 | `src/renderer/src/components/CommandCenterPanel.tsx:447` | Session transcript not found; current process was left running. | Transcrição da sessão não encontrada; o processo atual foi mantido em execução. | ➕ `commandCenter.errTranscriptNotFound` |
| 29 | `src/renderer/src/components/CommandCenterPanel.tsx:470` | Could not stop the current process. | Não foi possível parar o processo atual. | ➕ `commandCenter.errStopProcess` |
| 30 | `src/renderer/src/components/CommandCenterPanel.tsx:499` | Restart failed. | Falha ao reiniciar. | ✅ `commandCenter.restartFailed` |
| 31 | `src/renderer/src/components/CommandCenterPanel.tsx:501` | Resume was refused; no replacement session was accepted. | A retomada foi recusada; nenhuma sessão substituta foi aceita. | ➕ `commandCenter.errResumeRefused` |
| 32 | `src/renderer/src/components/CommandCenterPanel.tsx:519` | recreating terminal… | recriando terminal… | ➕ `commandCenter.actionRecreating` |
| 33 | `src/renderer/src/components/CommandCenterPanel.tsx:536` | continuing… | continuando… | ➕ `commandCenter.actionContinuing` |
| 34 | `src/renderer/src/components/CommandCenterPanel.tsx:543` | restarting… | reiniciando… | ✅ `common.restarting` |
| 35 | `src/renderer/src/components/CommandCenterPanel.tsx:543` | switching to {provider}… | trocando para {provider}… | ➕ `commandCenter.actionSwitching` |
| 36 | `src/renderer/src/components/CommandCenterPanel.tsx:584` | No repo selected. | Nenhum repositório selecionado. | ✅ `commandCenter.noRepoSelected` |
| 37 | `src/renderer/src/components/CommandCenterPanel.tsx:593` | Failed to fetch issues. | Falha ao buscar as issues. | ✅ `commandCenter.fetchFailed` |
| 38 | `src/renderer/src/components/CommandCenterPanel.tsx:605` | GitHub Issue #{number}: {title} — texto de dispatch | Issue do GitHub #{number}: {title} — texto de dispatch | ➕ `commandCenter.issueDispatch` |
| 39 | `src/renderer/src/components/CommandCenterPanel.tsx:702` | rate | taxa | ✅ `commandCenter.rate` |
| 40 | `src/renderer/src/components/CommandCenterPanel.tsx:827` | current (model fallback) | atual (fallback de modelo) | ➕ `commandCenter.currentModel` |
| 41 | `src/renderer/src/components/CommandCenterPanel.tsx:842` |  · default |  · padrão | ➕ `commandCenter.defaultModelMarker` |
| 42 | `src/renderer/src/components/AddAgentModal.tsx:57` | keeps the codebase tidy and healthy | mantém a base de código limpa e saudável | ➕ `addAgent.templates.repoJanitor.description` — Conteúdo de prompt; avaliar manter em inglês |
| 43 | `src/renderer/src/components/AddAgentModal.tsx:58` | Continuously hunt for dead code, lint errors, flaky tests, and small safe refactors… | Caçar continuamente código morto, erros de lint, testes instáveis e pequenos refactors seguros… | ➕ `addAgent.templates.repoJanitor.goal` — Conteúdo de prompt; avaliar manter em inglês |
| 44 | `src/renderer/src/components/AddAgentModal.tsx:62` | keeps docs in sync with the code | mantém a documentação em sincronia com o código | ➕ `addAgent.templates.docsWriter.description` — Conteúdo de prompt |
| 45 | `src/renderer/src/components/AddAgentModal.tsx:63` | Watch for code changes that outdate the README and docs, then update them… | Acompanhar mudanças de código que desatualizam o README e a documentação, e atualizá-los… | ➕ `addAgent.templates.docsWriter.goal` — Conteúdo de prompt |
| 46 | `src/renderer/src/components/AddAgentModal.tsx:67` | investigates and root-causes bugs | investiga bugs e encontra a causa raiz | ➕ `addAgent.templates.bugTriager.description` — Conteúdo de prompt |
| 47 | `src/renderer/src/components/AddAgentModal.tsx:68` | For each reported issue: reproduce it, find the root cause, then propose a minimal fix with evidence… | Para cada issue relatada: reproduza, encontre a causa raiz e proponha uma correção mínima com evidências… | ➕ `addAgent.templates.bugTriager.goal` — Conteúdo de prompt |
| 48 | `src/renderer/src/components/AddAgentModal.tsx:72` | gathers and summarizes information | coleta e resume informações | ➕ `addAgent.templates.researchAssistant.description` — Conteúdo de prompt |
| 49 | `src/renderer/src/components/AddAgentModal.tsx:73` | Research the questions you are given across multiple sources, verify the key claims, and return a concise, cited summary. | Pesquise as perguntas recebidas em várias fontes, verifique as alegações principais e retorne um resumo conciso com citações. | ➕ `addAgent.templates.researchAssistant.goal` — Conteúdo de prompt |
| 50 | `src/renderer/src/components/AddAgentModal.tsx:77` | prepares and ships releases | prepara e publica releases | ➕ `addAgent.templates.releaseManager.description` — Conteúdo de prompt |
| 51 | `src/renderer/src/components/AddAgentModal.tsx:78` | Track what has shipped since the last release, update the changelog and version, and draft clear release notes. | Acompanhe o que foi entregue desde a última release, atualize o changelog e a versão, e redija notas de versão claras. | ➕ `addAgent.templates.releaseManager.goal` — Conteúdo de prompt |
| 52 | `src/renderer/src/components/AddAgentModal.tsx:205, 348, 458` | a fresh harness | um novo harness | ➕ `addAgent.defaultDescription` |
| 53 | `src/renderer/src/components/AddAgentModal.tsx:379` | Skipped {n} invalid {files}: {errors} | Ignorados {n} {files} inválidos: {errors} | ➕ `addAgent.skippedInvalid` |
| 54 | `src/renderer/src/components/AddAgentModal.tsx:433` | spawn failed | falha ao iniciar o agente | ➕ `addAgent.spawnFailed` |
| 55 | `src/renderer/src/components/AddAgentModal.tsx:464` | session not found — fresh start | sessão não encontrada — início do zero | ➕ `addAgent.sessionNotFound` |
| 56 | `src/renderer/src/components/AddAgentModal.tsx:464` | starting up | iniciando | ➕ `addAgent.startingUp` |
| 57 | `src/renderer/src/components/AddAgentModal.tsx:790` | Remove {name} from this list. The folder itself is left alone. | Remover {name} desta lista. A pasta em si não é alterada. | ➕ `addAgent.removeProjectTitle` |
| 58 | `src/renderer/src/components/AddAgentModal.tsx:791` | Remove {name} from the project list | Remover {name} da lista de projetos | ➕ `addAgent.removeProjectAria` |
| 59 | `src/renderer/src/components/EditAgentModal.tsx:108` | EDIT AGENT | EDITAR AGENTE | ➕ `editAgent.title` |
| 60 | `src/renderer/src/components/EditAgentModal.tsx:122` | Identity | Identidade | ✅ `addAgent.sections.identity.label` |
| 61 | `src/renderer/src/components/EditAgentModal.tsx:122` | name · character · color | nome · personagem · cor | ✅ `addAgent.sections.identity.hint` |
| 62 | `src/renderer/src/components/EditAgentModal.tsx:123` | Name | Nome | ✅ `addAgent.name` |
| 63 | `src/renderer/src/components/EditAgentModal.tsx:127` | Stanley (placeholder) | Stanley (placeholder) | ➕ `editAgent.namePlaceholder` |
| 64 | `src/renderer/src/components/EditAgentModal.tsx:133` | Character | Personagem | ✅ `addAgent.character` |
| 65 | `src/renderer/src/components/EditAgentModal.tsx:167` | Color | Cor | ✅ `addAgent.color` |
| 66 | `src/renderer/src/components/EditAgentModal.tsx:189` | Engine | Motor | ✅ `addAgent.sections.engine.label` |
| 67 | `src/renderer/src/components/EditAgentModal.tsx:189` | provider · model · next restart | provedor · modelo · próximo reinício | ➕ `editAgent.engineHint` |
| 68 | `src/renderer/src/components/EditAgentModal.tsx:190` | Provider | Provedor | ✅ `addAgent.provider` |
| 69 | `src/renderer/src/components/EditAgentModal.tsx:220` | Model | Modelo | ✅ `addAgent.model` |
| 70 | `src/renderer/src/components/EditAgentModal.tsx:225` | {model} (current) | {model} (atual) | ➕ `editAgent.currentModel` |
| 71 | `src/renderer/src/components/EditAgentModal.tsx:234` | CLI default model | modelo padrão da CLI | ✅ `addAgent.cliDefaultModel` |
| 72 | `src/renderer/src/components/EditAgentModal.tsx:254` | Engine changes are saved for the next restart. Use Command Center → Floor to restart a live session onto a new provider/model now. | As mudanças de motor são salvas para o próximo reinício. Use Central de Comandos → Andar para reiniciar uma sessão ativa com outro provedor/modelo agora. | ➕ `editAgent.engineNote` |
| 73 | `src/renderer/src/components/EditAgentModal.tsx:260` | Briefing | Briefing | ✅ `addAgent.sections.briefing.label` |
| 74 | `src/renderer/src/components/EditAgentModal.tsx:260` | description · goal | descrição · objetivo | ✅ `addAgent.sections.briefing.hint` |
| 75 | `src/renderer/src/components/EditAgentModal.tsx:261` | Description | Descrição | ✅ `addAgent.description` |
| 76 | `src/renderer/src/components/EditAgentModal.tsx:265` | what is this agent for | para que serve este agente | ➕ `editAgent.descriptionPlaceholder` |
| 77 | `src/renderer/src/components/EditAgentModal.tsx:270` | Goal (optional) | Objetivo (opcional) | ✅ `addAgent.goal` |
| 78 | `src/renderer/src/components/EditAgentModal.tsx:274` | long-running directive injected on every prompt | diretriz de longo prazo injetada em cada prompt | ✅ `addAgent.goalPlaceholder` |
| 79 | `src/renderer/src/components/EditAgentModal.tsx:300` | cancel | cancelar | ✅ `common.cancel` |
| 80 | `src/renderer/src/components/EditAgentModal.tsx:302` | save changes | salvar alterações | ➕ `editAgent.save` |
| 81 | `src/renderer/src/components/EditAgentModal.tsx:75` | a fresh harness | um novo harness | ➕ `addAgent.defaultDescription` |
| 82 | `src/renderer/src/components/SettingsModal.tsx:198` | 'the orchestrator' (fallback) | 'o orquestrador' (fallback) | ➕ `common.theOrchestrator` |
| 83 | `src/renderer/src/components/SettingsModal.tsx:460` | failed | falhou | ➕ `settings.memory.failed` |
| 84 | `src/renderer/src/components/SettingsModal.tsx:463` | added {n} document(s), {m} failed | {n} documento(s) adicionado(s), {m} falhou/falharam | ➕ `settings.memory.addedNote` |
| 85 | `src/renderer/src/components/SettingsModal.tsx:608, 655, 736, 759` | saved | salvo | ✅ `settings.saved` |
| 86 | `src/renderer/src/components/SettingsModal.tsx:625` | listening | ouvindo | ✅ `settings.connections.listening` |
| 87 | `src/renderer/src/components/SettingsModal.tsx:625` | started, but tunnel unavailable | iniciado, mas o túnel não está disponível | ➕ `settings.connections.tunnelUnavailable` |
| 88 | `src/renderer/src/components/SettingsModal.tsx:627` | failed to start | falha ao iniciar | ➕ `settings.connections.startFailed` |
| 89 | `src/renderer/src/components/SettingsModal.tsx:639` | stopped | parado | ✅ `settings.connections.stopped` |
| 90 | `src/renderer/src/components/SettingsModal.tsx:654, 735` | could not save | não foi possível salvar | ➕ `settings.connections.couldNotSave` |
| 91 | `src/renderer/src/components/SettingsModal.tsx:677, 702` | could not generate a secret | não foi possível gerar um segredo | ➕ `settings.connections.secretFailed` |
| 92 | `src/renderer/src/components/SettingsModal.tsx:705` | new secret — copy it now | novo segredo — copie agora | ➕ `settings.connections.newSecret` |
| 93 | `src/renderer/src/components/SettingsModal.tsx:713` | deleted | excluído | ➕ `settings.connections.deleted` |
| 94 | `src/renderer/src/components/SettingsModal.tsx:802` | Could not change the home folder. | Não foi possível alterar a pasta inicial. | ➕ `settings.changeHome.failed` |
| 95 | `src/renderer/src/components/SettingsModal.tsx:1277` | Who can add agents | Quem pode adicionar agentes | ➕ `settings.autonomy.whoCanHire` |
| 96 | `src/renderer/src/components/SettingsModal.tsx:1281` | {godName} can hire on his own. Every agent he starts spends tokens you did not approve. | {godName} pode contratar sozinho. Cada agente que ele inicia gasta tokens que você não aprovou. | ➕ `settings.autonomy.hireOnDesc` |
| 97 | `src/renderer/src/components/SettingsModal.tsx:1282` | Only you. {godName} can still ask, and his request waits in the queue instead of failing. | Somente você. {godName} ainda pode pedir, e o pedido fica na fila em vez de falhar. | ➕ `settings.autonomy.hireOnlyMeDesc` |
| 98 | `src/renderer/src/components/SettingsModal.tsx:1286` | me and {godName} | eu e {godName} | ➕ `settings.autonomy.hireMeAndGod` |
| 99 | `src/renderer/src/components/SettingsModal.tsx:1286` | only me | somente eu | ➕ `settings.autonomy.hireOnlyMe` |
| 100 | `src/renderer/src/components/SettingsModal.tsx:93` | Connect Munder Difflin to Slack — walkthrough de 8 passos (texto integral em <pre>) | Conectar o Munder Difflin ao Slack — traduzir os 8 passos, mantendo os nomes de campos da UI do Slack | ➕ `settings.connections.slackHelpDoc` — Texto longo exibido no popover de ajuda |
| 101 | `src/renderer/src/components/SettingsModal.tsx:124` | Webhook API — contrato request/response completo (texto integral em <pre>) | API de Webhooks — traduzir o contrato e as explicações, mantendo verbos HTTP, headers e JSON | ➕ `settings.connections.webhookApiDoc` — Texto longo exibido no popover de ajuda |
| 102 | `src/renderer/src/components/OnboardingWizard.tsx:538` | checking... | verificando... | ➕ `onboarding.checking` |
| 103 | `src/renderer/src/components/OnboardingWizard.tsx:538` | check again | verificar novamente | ➕ `onboarding.checkAgain` |
| 104 | `src/renderer/src/components/OnboardingWizard.tsx:542` | install instructions | instruções de instalação | ➕ `onboarding.installInstructions` |
| 105 | `src/renderer/src/components/OnboardingWizard.tsx:776` | {label} is not installed. Install it and press "check again", or pick another engine. | {label} não está instalado. Instale-o e pressione "verificar novamente", ou escolha outro motor. | ✅ `onboarding.errEngineNotInstalled` — Chave existe, mas o call site não a usa |
| 106 | `src/renderer/src/components/QuitWarningModal.tsx:57` | CLOSING TIME | HORA DE FECHAR | ➕ `quitWarning.closingTitle` |
| 107 | `src/renderer/src/components/QuitWarningModal.tsx:57` | QUITTING NOW? | SAIR AGORA? | ➕ `quitWarning.quitTitle` |
| 108 | `src/renderer/src/components/QuitWarningModal.tsx:80` | FLOOR SAVED — SEE YOU TOMORROW | ANDAR SALVO — ATÉ AMANHÃ | ➕ `quitWarning.floorSaved` |
| 109 | `src/renderer/src/components/QuitWarningModal.tsx:82` | STILL WRAPPING UP… | AINDA FINALIZANDO… | ➕ `quitWarning.stillWrapping` |
| 110 | `src/renderer/src/components/QuitWarningModal.tsx:83` | WRAPPING UP THE FLOOR | FINALIZANDO O ANDAR | ➕ `quitWarning.wrappingUp` |
| 111 | `src/renderer/src/components/QuitWarningModal.tsx:87` | Every agent saved its memory and the orchestrator confirmed the shutdown. The harness closes itself in a moment. | Todos os agentes salvaram a memória e o orquestrador confirmou o encerramento. O harness fecha sozinho em instantes. | ➕ `quitWarning.savedBody` |
| 112 | `src/renderer/src/components/QuitWarningModal.tsx:90` | The orchestrator broadcast closing time. Every worker parks its work, saves its memory, and reports back — the app closes only after the orchestrator confirms nothing will be lost. | O orquestrador avisou a hora de fechar. Cada worker pausa o trabalho, salva a memória e responde — o app só fecha depois que o orquestrador confirma que nada será perdido. | ➕ `quitWarning.closingBody` |
| 113 | `src/renderer/src/components/QuitWarningModal.tsx:108` | {acked} / {total} WORKERS CONFIRMED | {acked} / {total} WORKERS CONFIRMADOS | ➕ `quitWarning.workersConfirmed` |
| 114 | `src/renderer/src/components/QuitWarningModal.tsx:108` |  — WAITING FOR THE ORCHESTRATOR |  — AGUARDANDO O ORQUESTRADOR | ➕ `quitWarning.waitingOrchestrator` |
| 115 | `src/renderer/src/components/QuitWarningModal.tsx:109` | NO WORKERS ON THE FLOOR — WAITING FOR THE ORCHESTRATOR | NENHUM WORKER NO ANDAR — AGUARDANDO O ORQUESTRADOR | ➕ `quitWarning.noWorkers` |
| 116 | `src/renderer/src/components/QuitWarningModal.tsx:112` | This is taking a while (an agent may be mid-compaction or deep in a tool call). Keep waiting, or force quit and accept the data loss. | Isso está demorando (um agente pode estar no meio de uma compactação ou de uma chamada de ferramenta). Continue aguardando, ou force a saída e aceite a perda de dados. | ➕ `quitWarning.timeoutBody` |
| 117 | `src/renderer/src/components/QuitWarningModal.tsx:122` | cancel — back to work | cancelar — voltar ao trabalho | ➕ `quitWarning.cancelBack` |
| 118 | `src/renderer/src/components/QuitWarningModal.tsx:125, 198` | killing... | encerrando... | ➕ `quitWarning.killing` |
| 119 | `src/renderer/src/components/QuitWarningModal.tsx:125` | force quit now | forçar saída agora | ➕ `quitWarning.forceQuit` |
| 120 | `src/renderer/src/components/QuitWarningModal.tsx:151` | {n} AGENT/AGENTS STILL RUNNING | {n} AGENTE(S) AINDA EM EXECUÇÃO | ➕ `quitWarning.agentsRunning` |
| 121 | `src/renderer/src/components/QuitWarningModal.tsx:154` | Closing the harness will terminate | Fechar o harness encerrará | ➕ `quitWarning.terminateLead` |
| 122 | `src/renderer/src/components/QuitWarningModal.tsx:155` | the running claude session / all {n} running claude sessions | a sessão do Claude em execução / todas as {n} sessões do Claude em execução | ➕ `quitWarning.terminateSessions` |
| 123 | `src/renderer/src/components/QuitWarningModal.tsx:156` | and discard any unsaved progress they were holding in memory. The conversation history inside each session is lost when the PTY exits. | e descartará qualquer progresso não salvo mantido em memória. O histórico da conversa de cada sessão é perdido quando o PTY encerra. | ➕ `quitWarning.terminateBody` |
| 124 | `src/renderer/src/components/QuitWarningModal.tsx:169` | Tip: | Dica: | ➕ `quitWarning.tipLabel` |
| 125 | `src/renderer/src/components/QuitWarningModal.tsx:169` | closing time | hora de fechar | ➕ `quitWarning.closingTime` |
| 126 | `src/renderer/src/components/QuitWarningModal.tsx:169` | is the safe way out — the orchestrator has every agent commit its work and save its memory, and the app closes itself once the whole floor has confirmed. No data loss. | é a saída segura — o orquestrador faz cada agente confirmar o trabalho e salvar a memória, e o app fecha sozinho quando o andar inteiro confirma. Sem perda de dados. | ➕ `quitWarning.tipBody` |
| 127 | `src/renderer/src/components/QuitWarningModal.tsx:188` | keep them running | mantê-los em execução | ➕ `quitWarning.keepRunning` |
| 128 | `src/renderer/src/components/QuitWarningModal.tsx:193` | closing time | hora de fechar | ➕ `quitWarning.closingTime` |
| 129 | `src/renderer/src/components/QuitWarningModal.tsx:182` | Closing time could not start. | Não foi possível iniciar a hora de fechar. | ➕ `quitWarning.startFailed` |
| 130 | `src/renderer/src/components/QuitWarningModal.tsx:198` | kill {it} / {all} & quit | encerrar {ele} / {todos} e sair | ➕ `quitWarning.killAndQuit` |

**Subtotal P1: 138 ocorrências.**

## P2 — Demais componentes e renderer

| # | Arquivo:linha | String original | Tradução PT-BR sugerida | Chave i18n |
|---:|---|---|---|---|
| 1 | `src/renderer/src/components/AgentHoldButton.tsx:69` | could not set the hold | não foi possível definir a conversa individual | ➕ `agentHold.errSet` |
| 2 | `src/renderer/src/components/AgentHoldButton.tsx:78` | End the 1:1. {godName} can hand {name} work again. | Encerrar a conversa individual. {godName} pode voltar a passar trabalho para {name}. | ➕ `agentHold.endTip` |
| 3 | `src/renderer/src/components/AgentHoldButton.tsx:79` | Take {name} aside. {godName} stops sending them work until you end it… | Levar {name} para uma conversa individual. {godName} para de enviar trabalho até você encerrar… | ➕ `agentHold.startTip` |
| 4 | `src/renderer/src/components/AgentHoldButton.tsx:80` | End the 1:1 and release this agent to {godName} | Encerrar a conversa individual e liberar este agente para {godName} | ➕ `agentHold.endAria` |
| 5 | `src/renderer/src/components/AgentHoldButton.tsx:80` | Take this agent aside for a 1:1 | Levar este agente para uma conversa individual | ➕ `agentHold.startAria` |
| 6 | `src/renderer/src/components/AgentHoldButton.tsx:83` | 1:1 failed | 1:1 falhou | ➕ `agentHold.failed` |
| 7 | `src/renderer/src/components/AgentHoldButton.tsx:83` | in 1:1 | em 1:1 | ➕ `agentHold.active` |
| 8 | `src/renderer/src/components/AgentNameEditor.tsx:39` | Name is required | O nome é obrigatório | ➕ `agentName.errRequired` |
| 9 | `src/renderer/src/components/AgentNameEditor.tsx:52` | Could not rename agent | Não foi possível renomear o agente | ➕ `agentName.errRename` |
| 10 | `src/renderer/src/components/AgentNameEditor.tsx:66` | Rename {name} | Renomear {name} | ➕ `agentName.rename` |
| 11 | `src/renderer/src/components/AgentNameEditor.tsx:103` | {name} — double-click to rename | {name} — clique duas vezes para renomear | ➕ `agentName.renameTitle` |
| 12 | `src/renderer/src/components/AgentNameEditor.tsx:113, 114` | Rename {name} | Renomear {name} | ➕ `agentName.rename` |
| 13 | `src/renderer/src/components/CodeEditor.tsx:165` | No file open | Nenhum arquivo aberto | ➕ `codeEditor.noFile` |
| 14 | `src/renderer/src/components/CodeEditor.tsx:171` | Pick a file from the tree to view it here. | Escolha um arquivo na árvore para visualizá-lo aqui. | ➕ `codeEditor.pickFile` |
| 15 | `src/renderer/src/components/CodeEditor.tsx:199` | Copy absolute path | Copiar caminho absoluto | ➕ `codeEditor.copyPathTitle` |
| 16 | `src/renderer/src/components/CodeEditor.tsx:201` | copy path | copiar caminho | ✅ `idePanel.copyPath` |
| 17 | `src/renderer/src/components/CodeEditor.tsx:206` | Save (Cmd-S) | Salvar (Cmd-S) | ➕ `codeEditor.saveTitle` |
| 18 | `src/renderer/src/components/CodeEditor.tsx:209` | saved | salvo | ➕ `codeEditor.saved` |
| 19 | `src/renderer/src/components/CodeEditor.tsx:209` | err | erro | ➕ `common.errorShort` |
| 20 | `src/renderer/src/components/CodeEditor.tsx:209` | save | salvar | ✅ `common.save` |
| 21 | `src/renderer/src/components/CodeEditor.tsx:214` | Open in the IDE | Abrir na IDE | ✅ `fileEditor.openInIde` |
| 22 | `src/renderer/src/components/CodeEditor.tsx:215` | Open in the IDE | Abrir na IDE | ✅ `fileEditor.openInIde` |
| 23 | `src/renderer/src/components/CodeEditor.tsx:226` | loading… | carregando… | ✅ `fileTree.loading` |
| 24 | `src/renderer/src/components/FullscreenTerminal.tsx:311` | MUNDER DIFFLIN · FOCUS MODE | MUNDER DIFFLIN · MODO FOCO | ➕ `fullscreenTerminal.focusHeader` |
| 25 | `src/renderer/src/components/FullscreenTerminal.tsx:362` | Settings (title) | Configurações | ➕ `common.settings` |
| 26 | `src/renderer/src/components/FullscreenTerminal.tsx:363` | Settings (aria-label) | Configurações | ➕ `common.settings` |
| 27 | `src/renderer/src/components/FullscreenTerminal.tsx:510` | restoring your team… | restaurando sua equipe… | ✅ `agentStrip.restoringTeam` |
| 28 | `src/renderer/src/components/FullscreenTerminal.tsx:532` | {name} — restorable from last session | {name} — restaurável da sessão anterior | ➕ `fullscreenTerminal.restorableTitle` |
| 29 | `src/renderer/src/components/FullscreenTerminal.tsx:544` | Dismiss {name} — remove permanently from the restore list | Dispensar {name} — remover permanentemente da lista de restauração | ➕ `fullscreenTerminal.dismissRestorableTitle` |
| 30 | `src/renderer/src/components/FullscreenTerminal.tsx:545` | Dismiss {name} | Dispensar {name} | ➕ `fullscreenTerminal.dismissRestorableAria` |
| 31 | `src/renderer/src/components/FullscreenTerminal.tsx:843` | no note | sem nota | ➕ `agentCard.noNote` |
| 32 | `src/renderer/src/components/FullscreenTerminal.tsx:876` | PRIVATE NOTE | NOTA PRIVADA | ✅ `agentStrip.privateNote` (com `name`) |
| 33 | `src/renderer/src/components/FullscreenTerminal.tsx:912` | one line = one bullet · esc to close | uma linha = um item · esc para fechar | ✅ `agentStrip.oneLineOneBullet` |
| 34 | `src/renderer/src/components/FullscreenTerminal.tsx:974` | Edit {name}: their name and face, which engine they run on, and the briefing… | Editar {name}: o nome e o rosto, o motor que ele usa e o briefing… | ➕ `agentDetail.editTip` |
| 35 | `src/renderer/src/components/FullscreenTerminal.tsx:975` | Edit {name} | Editar {name} | ➕ `agentDetail.editAria` |
| 36 | `src/renderer/src/components/HivePicker.tsx:49` | Could not open that folder. | Não foi possível abrir essa pasta. | ➕ `hivePicker.errOpen` |
| 37 | `src/renderer/src/components/HivePicker.tsx:77` | SELECT A HARNESS CONFIG | SELECIONE UMA CONFIGURAÇÃO DE HARNESS | ➕ `hivePicker.title` |
| 38 | `src/renderer/src/components/HivePicker.tsx:80` | A harness config is the folder where the app keeps everything for one workspace… | Uma configuração de harness é a pasta onde o app guarda tudo de um workspace… | ➕ `hivePicker.desc` |
| 39 | `src/renderer/src/components/HivePicker.tsx:90` | CURRENT | ATUAL | ➕ `hivePicker.current` |
| 40 | `src/renderer/src/components/HivePicker.tsx:103` | open | abrir | ➕ `hivePicker.open` |
| 41 | `src/renderer/src/components/HivePicker.tsx:117` | RECENT | RECENTES | ➕ `hivePicker.recent` |
| 42 | `src/renderer/src/components/HivePicker.tsx:125` | Switch to {path} (reloads the app) | Mudar para {path} (recarrega o app) | ➕ `hivePicker.switchTitle` |
| 43 | `src/renderer/src/components/HivePicker.tsx:144` | opening… | abrindo… | ➕ `hivePicker.opening` |
| 44 | `src/renderer/src/components/HivePicker.tsx:144` | switch → | mudar → | ➕ `hivePicker.switch` |
| 45 | `src/renderer/src/components/HivePicker.tsx:161` | Opening {name} — the app will reload… | Abrindo {name} — o app será recarregado… | ➕ `hivePicker.openingReload` |
| 46 | `src/renderer/src/components/HivePicker.tsx:170` | open existing config… | abrir configuração existente… | ➕ `hivePicker.openExisting` |
| 47 | `src/renderer/src/components/HivePicker.tsx:175` | create new config… | criar nova configuração… | ➕ `hivePicker.createNew` |
| 48 | `src/renderer/src/ide/IdePanel.tsx:402` | god | deus | ➕ `idePanel.godTag` |
| 49 | `src/renderer/src/ide/IdePanel.tsx:447` | No workspace available. | Nenhum workspace disponível. | ➕ `idePanel.noWorkspaceAvailable` |
| 50 | `src/renderer/src/ide/IdePanel.tsx:447` | Spawn an agent first — the IDE opens on its working directory. | Contrate um agente primeiro — a IDE abre no diretório de trabalho dele. | ➕ `idePanel.noWorkspaceHint` |
| 51 | `src/renderer/src/ide/IdePanel.tsx:626` | nothing open | nada aberto | ➕ `idePanel.nothingOpen` |
| 52 | `src/renderer/src/ide/IdePanel.tsx:628` | Pick a file from the tree to edit, or a changed file to diff. | Escolha um arquivo na árvore para editar, ou um arquivo alterado para comparar. | ➕ `idePanel.nothingOpenHint` |
| 53 | `src/renderer/src/ide/IdePanel.tsx:648` | loading… | carregando… | ✅ `fileTree.loading` |
| 54 | `src/renderer/src/ide/IdePanel.tsx:869, 876` | find in file | localizar no arquivo | ➕ `idePanel.shortcut.find` |
| 55 | `src/renderer/src/ide/IdePanel.tsx:870, 877` | replace | substituir | ➕ `idePanel.shortcut.replace` |
| 56 | `src/renderer/src/ide/IdePanel.tsx:871, 878` | command palette | paleta de comandos | ➕ `idePanel.shortcut.commandPalette` |
| 57 | `src/renderer/src/ide/IdePanel.tsx:872, 879` | go to line | ir para a linha | ➕ `idePanel.shortcut.goToLine` |
| 58 | `src/renderer/src/ide/IdePanel.tsx:873, 880` | go to symbol | ir para o símbolo | ➕ `idePanel.shortcut.goToSymbol` |
| 59 | `src/renderer/src/ide/ImagePreview.tsx:83` | Copy absolute path | Copiar caminho absoluto | ➕ `codeEditor.copyPathTitle` |
| 60 | `src/renderer/src/ide/ImagePreview.tsx:83` | copy path | copiar caminho | ✅ `idePanel.copyPath` |
| 61 | `src/renderer/src/ide/MonacoDiff.tsx:24` | loading diff… | carregando diff… | ✅ `idePanel.loadingDiff` |
| 62 | `src/renderer/src/ide/MonacoEditor.tsx:38` | loading editor… | carregando editor… | ➕ `idePanel.loadingEditor` |
| 63 | `src/renderer/src/components/MemoryGraphPanel.tsx:350` | No messages logged yet — the hive is quiet. Agents shown as roster. | Nenhuma mensagem registrada ainda — a colmeia está silenciosa. Agentes exibidos como equipe. | ➕ `memoryGraph.emptyMessages` |
| 64 | `src/renderer/src/components/MemoryGraphPanel.tsx:391` | shared by {n} agents | compartilhado por {n} agentes | ➕ `memoryGraph.sharedBy` |
| 65 | `src/renderer/src/components/MemoryGraphPanel.tsx:398` | escalations to the human | escalações para o humano | ➕ `memoryGraph.edgeEscalations` |
| 66 | `src/renderer/src/components/MemoryGraphPanel.tsx:398` | broadcast to everyone | transmitido para todos | ➕ `memoryGraph.edgeBroadcast` |
| 67 | `src/renderer/src/components/MessageQueueComposer.tsx:257` | Close the picker this agent has open so queued messages can be delivered | Feche o seletor aberto deste agente para que as mensagens da fila possam ser entregues | ➕ `queueComposer.closePickerTitle` |
| 68 | `src/renderer/src/components/MessageQueueComposer.tsx:258` | Move the leftover text on this agent's prompt into this box so queued messages can be delivered | Mova o texto restante no prompt deste agente para esta caixa para que as mensagens da fila possam ser entregues | ➕ `queueComposer.recoverPromptTitle` |
| 69 | `src/renderer/src/components/MichaelBooting.tsx:23` | CLOCKING IN | BATENDO O PONTO | ➕ `michaelBooting.title` |
| 70 | `src/renderer/src/components/MichaelBooting.tsx:47` | {name} is settling into the corner office and getting the floor ready. Hang tight… | {name} está se instalando na sala do canto e preparando o andar. Aguarde… | ➕ `michaelBooting.body` |
| 71 | `src/renderer/src/components/OfficeThemePicker.tsx:18` | Dunder Mifflin — the original floor | Dunder Mifflin — o andar original | ➕ `officeTheme.blurbs.office` |
| 72 | `src/renderer/src/components/OfficeThemePicker.tsx:19` | Central Perk coffee house | Café Central Perk | ➕ `officeTheme.blurbs.friends` |
| 73 | `src/renderer/src/components/OfficeThemePicker.tsx:20` | The 99th precinct bullpen | O distrito 99 | ➕ `officeTheme.blurbs.brooklyn99` |
| 74 | `src/renderer/src/components/OfficeThemePicker.tsx:21` | The Hacker Hostel | O Hacker Hostel | ➕ `officeTheme.blurbs.siliconvalley` |
| 75 | `src/renderer/src/components/OfficeThemePicker.tsx:22` | The Red Keep throne room | A sala do trono do Red Keep | ➕ `officeTheme.blurbs.got` |
| 76 | `src/renderer/src/components/OfficeThemePicker.tsx:23` | Hogwarts great hall | O grande salão de Hogwarts | ➕ `officeTheme.blurbs.hogwarts` |
| 77 | `src/renderer/src/components/OfficeThemePicker.tsx:200` | 'the orchestrator' (fallback) | 'o orquestrador' (fallback) | ➕ `common.theOrchestrator` |
| 78 | `src/renderer/src/components/PtyTerminalView.tsx:380` | live · pty {ptyId} | ao vivo · pty {ptyId} | ➕ `ptyTerminal.live` |
| 79 | `src/renderer/src/components/PtyTerminalView.tsx:388` | Zoom out (Cmd -) | Diminuir zoom (Cmd -) | ➕ `ptyTerminal.zoomOut` |
| 80 | `src/renderer/src/components/PtyTerminalView.tsx:393` | Reset zoom (Cmd 0) | Redefinir zoom (Cmd 0) | ➕ `ptyTerminal.zoomReset` |
| 81 | `src/renderer/src/components/PtyTerminalView.tsx:399` | Zoom in (Cmd +) | Aumentar zoom (Cmd +) | ➕ `ptyTerminal.zoomIn` |
| 82 | `src/renderer/src/components/PtyTerminalView.tsx:405` | Exit focus mode (Esc) | Sair do modo foco (Esc) | ✅ `fullscreenTerminal.exitFullscreen` |
| 83 | `src/renderer/src/components/ReleaseDrop.tsx:113` | What's new in Munder Difflin {version} | Novidades do Munder Difflin {version} | ➕ `releaseDrop.dialogAria` |
| 84 | `src/renderer/src/components/ReleaseDrop.tsx:153` | / release notes | / notas da versão | ➕ `releaseDrop.releaseNotes` |
| 85 | `src/renderer/src/components/ReleaseDrop.tsx:164` | Close release notes | Fechar notas da versão | ➕ `releaseDrop.closeAria` |
| 86 | `src/renderer/src/components/ReleaseDrop.tsx:165` | Close (Esc) | Fechar (Esc) | ➕ `releaseDrop.closeTitle` |
| 87 | `src/renderer/src/components/ReleaseDrop.tsx:186` | What's new in {version} | Novidades da versão {version} | ➕ `releaseDrop.iframeTitle` |
| 88 | `src/renderer/src/components/ReleaseDrop.tsx:250` | Loading | Carregando | ➕ `releaseDrop.loading` |
| 89 | `src/renderer/src/components/SettingsHeroCard.tsx:110` | v{pending} is out | v{pending} disponível | ➕ `settingsHero.versionOut` |
| 90 | `src/renderer/src/components/SettingsHeroCard.tsx:113` | Download the installer and replace the app yourself. Auto-update is in Updates below. | Baixe o instalador e substitua o app manualmente. A atualização automática fica em Atualizações abaixo. | ➕ `settingsHero.downloadTitle` |
| 91 | `src/renderer/src/components/SettingsHeroCard.tsx:114` | download v{pending} | baixar v{pending} | ➕ `settingsHero.download` |
| 92 | `src/renderer/src/components/SettingsHeroCard.tsx:166` | % OFF | % OFF | ➕ `settingsHero.percentOff` |
| 93 | `src/renderer/src/components/SidebarSplitter.tsx:58` | Drag to resize · double-click to reset | Arraste para redimensionar · clique duas vezes para redefinir | ➕ `sidebarSplitter.resizeTitle` |
| 94 | `src/renderer/src/components/TerminalView.tsx:121` | live · pipe-pane | ao vivo · pipe-pane | ➕ `terminalView.live` |
| 95 | `src/renderer/src/components/UpdateBadge.tsx:108` | Version {v} — check for updates | Versão {v} — verificar atualizações | ➕ `updateBadge.versionAria` |
| 96 | `src/renderer/src/components/UpdateBadge.tsx:149` | Click to download v{pending} | Clique para baixar a v{pending} | ➕ `updateBadge.clickDownload` |
| 97 | `src/renderer/src/components/UpdateBadge.tsx:152` | Download the latest version and replace the app you have. Prefer the app to update itself? Settings → Updates. | Baixe a versão mais recente e substitua o app que você tem. Prefere que o app se atualize sozinho? Configurações → Atualizações. | ➕ `updateBadge.downloadHint` |
| 98 | `src/renderer/src/components/UpdateBadge.tsx:157` | On {os} | Em {os} | ➕ `updateBadge.onOs` |
| 99 | `src/renderer/src/components/UpdateBadge.tsx:168` | Install the update | Instalar a atualização | ➕ `updateBadge.installAria` |
| 100 | `src/renderer/src/components/UpdateBadge.tsx:179` | v{version} is downloading in your browser. | A v{version} está sendo baixada no seu navegador. | ➕ `updateBadge.downloadingTitle` |
| 101 | `src/renderer/src/components/UpdateBadge.tsx:182` | When it lands, quit this app and install the new version over the current one. Open it and pick the same project. Your agents, memory and settings stay where they are. | Quando o download terminar, saia deste app e instale a nova versão por cima da atual. Abra-a e escolha o mesmo projeto. Seus agentes, memória e configurações continuam onde estão. | ➕ `updateBadge.downloadingBody` |
| 102 | `src/renderer/src/components/UpdateBadge.tsx:189` | got it | entendi | ➕ `common.gotIt` |
| 103 | `src/renderer/src/components/UpdateBadge.tsx:215` | You are on the latest version. | Você está na versão mais recente. | ➕ `updateBadge.latestTitle` |
| 104 | `src/renderer/src/components/UpdateBadge.tsx:218` | v{v} is the newest release. Checked just now. | A v{v} é a versão mais recente. Verificado agora. | ➕ `updateBadge.latestBody` |
| 105 | `src/renderer/src/components/UpdateToast.tsx:234` | Update v{version} downloaded | Atualização v{version} baixada | ➕ `updateToast.downloadedTitle` |
| 106 | `src/renderer/src/components/UpdateToast.tsx:235` | v{version} is available | A v{version} está disponível | ➕ `updateToast.availableTitle` |
| 107 | `src/renderer/src/components/UpdateToast.tsx:240` | Restart Munder Difflin whenever you like to apply it — nothing restarts on its own. | Reinicie o Munder Difflin quando quiser para aplicar — nada reinicia sozinho. | ➕ `updateToast.restartBody` |
| 108 | `src/renderer/src/components/UpdateToast.tsx:241` | This install can’t update itself — grab the new build from the releases page. | Esta instalação não consegue se atualizar — baixe a nova versão na página de releases. | ➕ `updateToast.manualBody` |
| 109 | `src/renderer/src/components/UpdateToast.tsx:250` | What’s new | Novidades | ✅ `settingsHero.whatsNew` |
| 110 | `src/renderer/src/components/UpdateToast.tsx:274` | Read more | Ler mais | ➕ `updateToast.readMore` |
| 111 | `src/renderer/src/components/UpdateToast.tsx:280` | ⭐ Star us on GitHub | ⭐ Dê uma estrela no GitHub | ✅ `settingsHero.starOnGitHub` |
| 112 | `src/renderer/src/components/UpdateToast.tsx:291` | later | depois | ➕ `common.later` |
| 113 | `src/renderer/src/components/UpdateToast.tsx:295` | restarting… | reiniciando… | ✅ `common.restarting` |
| 114 | `src/renderer/src/components/UpdateToast.tsx:295` | restart to update | reiniciar para atualizar | ➕ `updateToast.restart` |
| 115 | `src/renderer/src/components/UpdateToast.tsx:302` | download {version} | baixar {version} | ➕ `updateToast.download` |
| 116 | `src/renderer/src/components/UpdateToast.tsx:302` | open releases | abrir releases | ➕ `updateToast.openReleases` |
| 117 | `src/renderer/src/realtime/CompletionToast.tsx:127` | · completed | · concluído | ➕ `completionToast.completed` |
| 118 | `src/renderer/src/realtime/CompletionToast.tsx:131` | Dismiss | Dispensar | ➕ `common.dismiss` |
| 119 | `src/renderer/src/components/TaskDetailOverlay.tsx:64` | (no description) | (sem descrição) | ➕ `taskDetail.noDescription` |
| 120 | `src/renderer/src/components/TaskDetailOverlay.tsx:65` | Task: {title}\nContext: {desc} | Tarefa: {title}\nContexto: {desc} | ➕ `taskDetail.assignSeed` |
| 121 | `src/renderer/src/components/git/CommitGraph.tsx:160` | {author} · {time} ago | {author} · há {time} | ➕ `commitGraph.agoTitle` |
| 122 | `src/renderer/src/components/IntegrationsRegistry.tsx:1748` | The office floor could not get a GPU context. The GPU may still be restarting, or too many terminals are using it at once. Close a few agent terminals, or restart the app, to bring the floor back. | O andar do escritório não conseguiu um contexto de GPU. A GPU pode ainda estar reiniciando, ou terminais demais a estão usando. Feche alguns terminais de agente, ou reinicie o app, para trazer o andar de volta. | ✅ `office.gpuError` — Fallback hardcoded; a chave `office.gpuError` já existe com texto equivalente |
| 123 | `src/renderer/src/components/IntegrationsRegistry.tsx:248` | Secret | Segredo | ➕ `integrations.secretFallback` |
| 124 | `src/renderer/src/components/RecentText.tsx:34` | recent | recente | ➕ `recentText.recent` |
| 125 | `src/renderer/src/components/RecentText.tsx:45` | idle | ocioso | ✅ `badge.idle` |
| 126 | `src/renderer/src/components/RecentText.tsx:45` | live | ao vivo | ➕ `recentText.live` |
| 127 | `src/renderer/src/components/IntegrationsRegistry.tsx:46` | None (public API) | Nenhuma (API pública) | ➕ `integrations.auth.none` |
| 128 | `src/renderer/src/components/IntegrationsRegistry.tsx:47` | Bearer token | Token Bearer | ➕ `integrations.auth.bearer` |
| 129 | `src/renderer/src/components/IntegrationsRegistry.tsx:48` | Custom header | Header personalizado | ➕ `integrations.auth.header` |
| 130 | `src/renderer/src/ide/IdePanel.tsx:176, 227` | diff failed | falha no diff | ➕ `idePanel.diffFailed` |
| 131 | `src/renderer/src/hooks/usePtyParser.ts:161` | Waiting for your reply | Aguardando sua resposta | ➕ `blocked.waitingReply` |
| 132 | `src/renderer/src/hooks/usePtyParser.ts:162` | Claude is waiting for input. Check the terminal for the exact prompt. | O Claude está aguardando entrada. Verifique o terminal para ver o prompt exato. | ➕ `blocked.waitingReplyDetail` |
| 133 | `src/renderer/src/hooks/useHive.ts:426` | god — runs the floor, triages requests, escalates only critical calls to you | deus — comanda o andar, triagem de pedidos e escala para você apenas o que é crítico | ➕ `hive.godDescription` |
| 134 | `src/renderer/src/hooks/useHive.ts:431` | running the floor | comandando o andar | ➕ `hive.action.runningFloor` |
| 135 | `src/renderer/src/hooks/useHive.ts:492` | compacting context | compactando contexto | ➕ `hive.action.compacting` |
| 136 | `src/renderer/src/hooks/useHive.ts:516` | reading inbox | lendo a caixa de entrada | ➕ `hive.action.readingInbox` |
| 137 | `src/renderer/src/hooks/useHive.ts:561` | breaker armed | circuit breaker armado | ➕ `hive.action.breakerArmed` |
| 138 | `src/renderer/src/hooks/useHive.ts:1232` | revived after sleep | reanimado após suspensão | ➕ `hive.action.revived` |
| 139 | `src/renderer/src/freeflow/recorder.ts:92` | no agent selected | nenhum agente selecionado | ➕ `freeflow.errNoAgent` |
| 140 | `src/renderer/src/freeflow/recorder.ts:94` | microphone not available | microfone não disponível | ➕ `freeflow.errNoMic` |
| 141 | `src/renderer/src/freeflow/recorder.ts:109` | microphone permission denied | permissão do microfone negada | ➕ `freeflow.errMicDenied` |
| 142 | `src/renderer/src/freeflow/recorder.ts:109` | could not open microphone | não foi possível abrir o microfone | ➕ `freeflow.errOpenMic` |
| 143 | `src/renderer/src/freeflow/recorder.ts:127` | recording not supported | gravação não suportada | ➕ `freeflow.errUnsupported` |
| 144 | `src/renderer/src/freeflow/recorder.ts:153` | nothing recorded | nada gravado | ➕ `freeflow.errNothingRecorded` |
| 145 | `src/renderer/src/freeflow/recorder.ts:169, 172` | transcription failed | falha na transcrição | ➕ `freeflow.errTranscription` |
| 146 | `src/renderer/src/components/terminalPool.ts:207` | ─ process exited (code {code}, signal {signal}) ─ | ─ processo encerrado (código {code}, sinal {signal}) ─ | ➕ `terminal.processExited` |
| 147 | `src/renderer/src/components/terminalPool.ts:752` | {n}/{total} open terminal(s) switched | {n}/{total} terminal(is) aberto(s) alternado(s) | ➕ `terminal.themeSwitched` |
| 148 | `src/renderer/src/components/terminalPool.ts:892` | ─ resuming existing session ─ | ─ retomando sessão existente ─ | ➕ `terminal.resumingSession` |
| 149 | `src/renderer/src/markdown/MarkdownPreview.tsx:135` | could not decode | não foi possível decodificar | ➕ `markdown.imageDecodeFailed` |

**Subtotal P2: 157 ocorrências.**

## P3 — Main process, shared e conteúdo ambiente

| # | Arquivo:linha | String original | Tradução PT-BR sugerida | Chave i18n |
|---:|---|---|---|---|
| 1 | `src/main/index.ts:2283` | Import hire manifests | Importar manifestos de contratação | ➕ `main.dialog.importHireTitle` |
| 2 | `src/main/index.ts:2284` | Hire manifest | Manifesto de contratação | ➕ `main.dialog.hireManifestFilter` |
| 3 | `src/main/index.ts:2321` | Munder Difflin — Floor | Munder Difflin — Andar | ➕ `main.window.floorTitle` |
| 4 | `src/main/index.ts:2425` | Close floor | Fechar andar | ➕ `main.dialog.closeFloor` |
| 5 | `src/main/index.ts:2425` | Cancel | Cancelar | ✅ `common.cancel` |
| 6 | `src/main/index.ts:2428` | Close this floor? {n} running terminal(s) on it will be stopped. | Fechar este andar? {n} terminal(is) em execução nele serão encerrados. | ➕ `main.dialog.closeFloorMessage` |
| 7 | `src/main/index.ts:2429` | Other floors keep running. | Os outros andares continuam em execução. | ➕ `main.dialog.closeFloorDetail` |
| 8 | `src/main/index.ts:2490` | New Floor | Novo andar | ➕ `main.menu.newFloor` |
| 9 | `src/main/index.ts:2497` | File | Arquivo | ➕ `main.menu.file` |
| 10 | `src/main/index.ts:2519` | Edit | Editar | ➕ `main.menu.edit` |
| 11 | `src/main/index.ts:3114` | Pick a folder | Escolher uma pasta | ➕ `main.dialog.pickFolder` |
| 12 | `src/main/index.ts:3270` | Pick a folder that is not inside (or a parent of) the current home. | Escolha uma pasta que não esteja dentro (nem seja pai) da pasta inicial atual. | ➕ `main.dialog.pickFolderInvalid` |
| 13 | `src/main/index.ts:3705` | Add documents to the Knowledge Graph | Adicionar documentos ao Grafo de Conhecimento | ➕ `main.dialog.addKgDocuments` |
| 14 | `src/main/index.ts:3728` | Attach images or files | Anexar imagens ou arquivos | ➕ `main.dialog.attachFiles` |
| 15 | `src/main/index.ts:3731` | All Files | Todos os arquivos | ➕ `main.dialog.allFilesFilter` |
| 16 | `src/main/index.ts:1270` | {name} constrained | {name} restringido | ➕ `main.notify.constrained` |
| 17 | `src/main/index.ts:1274` | {name} stopped by circuit breaker | {name} interrompido pelo circuit breaker | ➕ `main.notify.stopped` |
| 18 | `src/main/index.ts:2804` | Agent running degraded | Agente em execução degradada | ➕ `main.notify.degraded` |
| 19 | `src/main/index.ts:5322` | Agents need a restart | Agentes precisam ser reiniciados | ➕ `main.notify.restartTitle` |
| 20 | `src/main/index.ts:5322` | {n} agent terminal(s) didn't survive sleep — re-open them to resume. | {n} terminal(is) de agente não sobreviveu(aram) à suspensão — reabra para retomar. | ➕ `main.notify.restartBody` |
| 21 | `src/main/hooks.ts:271` | Hive hooks are down | Os hooks da colmeia estão fora do ar | ➕ `main.notify.hooksDownTitle` |
| 22 | `src/main/hooks.ts:271` | Nothing is listening at {sock} ({code}). Every agent hook is being allowed and no cost is recorded until this recovers. | Nada está escutando em {sock} ({code}). Todos os hooks de agente estão sendo permitidos e nenhum custo é registrado até isso se recuperar. | ➕ `main.notify.hooksDownBody` |
| 23 | `src/main/hooks.ts:497` | finished — idle | concluído — ocioso | ➕ `main.notify.finishedIdle` |
| 24 | `src/main/hooks.ts:497` | Agent (fallback title) | Agente (título fallback) | ➕ `main.notify.agentFallback` |
| 25 | `src/main/hooks.ts:591` | needs your attention | precisa da sua atenção | ➕ `main.notify.needsAttention` |
| 26 | `src/main/config.ts:67` | Hourly ops standup | Reunião operacional horária | ➕ `main.schedule.opsStandup` |
| 27 | `src/main/config.ts:100` | Floor heartbeat | Batimento do andar | ➕ `main.schedule.heartbeat` |
| 28 | `src/main/config.ts:125` | Auto-compact (maintenance) | Compactação automática (manutenção) | ➕ `main.schedule.autoCompact` |
| 29 | `src/main/breaker.ts:340` | looping: {n}× identical tool call ({tool}) | em loop: {n}× chamada de ferramenta idêntica ({tool}) | ➕ `main.breaker.looping` |
| 30 | `src/main/breaker.ts:344` | error storm: {n} consecutive api errors/retries | tempestade de erros: {n} erros/tentativas consecutivos de API | ➕ `main.breaker.errorStorm` |
| 31 | `src/main/breaker.ts:356` | token limit: {work} work tokens over the agent cap of {cap} ({total} total incl. cache reads) | limite de tokens: {work} tokens de trabalho acima do limite do agente de {cap} ({total} no total, incluindo leituras de cache) | ➕ `main.breaker.tokenLimit` |
| 32 | `src/main/breaker.ts:361` | cost cap: floor total over ${cap} (top spender ${spent}) | limite de custo: total do andar acima de ${cap} (maior gasto ${spent}) | ➕ `main.breaker.costCap` |
| 33 | `src/main/breaker.ts:365` | token cap: floor total over {cap} tokens (top spender {spent}) | limite de tokens: total do andar acima de {cap} tokens (maior gasto {spent}) | ➕ `main.breaker.tokenCap` |
| 34 | `src/main/breaker.ts:378` | token velocity {rate}/min > {limit}/min | velocidade de tokens {rate}/min > {limit}/min | ➕ `main.breaker.tokenVelocity` |
| 35 | `src/main/breaker.ts:407` | no-progress: generating tokens without coordinating (stale log/files) | sem progresso: gerando tokens sem coordenação (log/arquivos desatualizados) | ➕ `main.breaker.noProgress` |
| 36 | `src/shared/updateState.ts:185` | downloading {pct}% | baixando {pct}% | ➕ `updateBadge.downloadingLabel` |
| 37 | `src/shared/updateState.ts:186` | Downloading v{version}… {pct}% | Baixando a v{version}… {pct}% | ➕ `updateBadge.downloadingTitle` |
| 38 | `src/shared/updateState.ts:198` | v{pending} · restart | v{pending} · reiniciar | ➕ `updateBadge.restartLabel` |
| 39 | `src/shared/updateState.ts:199` | Click to restart and install v{pending} | Clique para reiniciar e instalar a v{pending} | ➕ `updateBadge.restartTitle` |
| 40 | `src/shared/updateState.ts:204` | v{pending} · update | v{pending} · atualizar | ➕ `updateBadge.updateLabel` |
| 41 | `src/shared/updateState.ts:205` | Downloading v{pending} in the background; click to start it if it has not begun | Baixando a v{pending} em segundo plano; clique para iniciar se ainda não começou | ➕ `updateBadge.updateTitle` |
| 42 | `src/shared/updateState.ts:211` | v{pending} · download | v{pending} · baixar | ➕ `updateBadge.downloadLabel` |
| 43 | `src/shared/updateState.ts:212` | Click to download v{pending}, then replace the app you have{why} | Clique para baixar a v{pending} e substitua o app atual{why} | ➕ `updateBadge.downloadTitle` |
| 44 | `src/shared/updateState.ts:206` |  (this install could not update itself: {reason}) |  (esta instalação não pôde se atualizar: {reason}) | ➕ `updateBadge.noSelfUpdateReason` |
| 45 | `src/shared/updateState.ts:217` | checking… | verificando… | ➕ `updateBadge.checking` |
| 46 | `src/shared/updateState.ts:217` | Checking for updates (you're on v{v}) | Verificando atualizações (você está na v{v}) | ➕ `updateBadge.checkingTitle` |
| 47 | `src/shared/updateState.ts:220` | update check failed | falha na verificação de atualização | ➕ `updateBadge.checkFailed` |
| 48 | `src/shared/updateState.ts:221` | {message} — click to try again | {message} — clique para tentar novamente | ➕ `updateBadge.checkFailedTitle` |
| 49 | `src/shared/updateState.ts:226` | latest | mais recente | ➕ `updateBadge.latest` |
| 50 | `src/shared/updateState.ts:226` | v{v} is the latest version — click to check again | A v{v} é a versão mais recente — clique para verificar novamente | ➕ `updateBadge.latestTitle` |
| 51 | `src/shared/updateState.ts:229` | v{v} — click to check for updates | v{v} — clique para verificar atualizações | ➕ `updateBadge.idleTitle` |
| 52 | `src/shared/updateState.ts:264, 297, 316` | You're on v{v} | Você está na v{v} | ✅ `updatesSection.onVersion` |
| 53 | `src/shared/updateState.ts:265` | Checking for a newer release… | Verificando se há uma versão mais nova… | ✅ `updatesSection.checkingDetail` |
| 54 | `src/shared/updateState.ts:270, 288` | v{version} is available | A v{version} está disponível | ✅ `updatesSection.availableHeadline` |
| 55 | `src/shared/updateState.ts:271` | You're on v{v}. Download it now — you'll be asked to restart once it's ready. | Você está na v{v}. Baixe agora — você será avisado para reiniciar quando estiver pronta. | ✅ `updatesSection.availableDetail` |
| 56 | `src/shared/updateState.ts:272` | Download v{version} | Baixar v{version} | ✅ `updatesSection.downloadBtn` |
| 57 | `src/shared/updateState.ts:276` | Downloading v{version} | Baixando a v{version} | ✅ `updatesSection.downloadingHeadline` |
| 58 | `src/shared/updateState.ts:277` | {pct}% done. You can keep working; the restart is yours to trigger. | {pct}% concluído. Você pode continuar trabalhando; o reinício é você quem decide. | ✅ `updatesSection.downloadingDetail` |
| 59 | `src/shared/updateState.ts:282` | v{version} is ready to install | A v{version} está pronta para instalar | ✅ `updatesSection.downloadedHeadline` |
| 60 | `src/shared/updateState.ts:283` | Restart Munder Difflin to finish updating from v{v}. | Reinicie o Munder Difflin para concluir a atualização da v{v}. | ✅ `updatesSection.downloadedDetail` |
| 61 | `src/shared/updateState.ts:284` | Restart to update | Reiniciar para atualizar | ✅ `updatesSection.restartBtn` |
| 62 | `src/shared/updateState.ts:289, 290` | This install can't update itself ({reason}) — download it from the release page. | Esta instalação não consegue se atualizar ({reason}) — baixe na página de releases. | ✅ `updatesSection.manualDetailReason` |
| 63 | `src/shared/updateState.ts:292` | Open release page / Download v{version} | Abrir página de releases / Baixar v{version} | ✅ `updatesSection.openReleaseBtn` / `updatesSection.downloadBtn` |
| 64 | `src/shared/updateState.ts:298` | Freshly updated. This is the latest release. | Atualizado agora há pouco. Esta é a versão mais recente. | ➕ `updatesSection.freshlyUpdated` |
| 65 | `src/shared/updateState.ts:299, 318` | Check for updates | Verificar atualizações | ✅ `updatesSection.checkBtn` |
| 66 | `src/shared/updateState.ts:303` | Update check failed | Falha na verificação de atualização | ✅ `updatesSection.errorHeadline` |
| 67 | `src/shared/updateState.ts:304` | {message} (you're on v{v}). | {message} (você está na v{v}). | ✅ `updatesSection.errorDetail` |
| 68 | `src/shared/updateState.ts:305` | Try again | Tentar novamente | ✅ `updatesSection.retryBtn` |
| 69 | `src/shared/updateState.ts:309` | v{v} is the latest version | A v{v} é a versão mais recente | ✅ `updatesSection.latestHeadline` |
| 70 | `src/shared/updateState.ts:310` | You're already up to date — nothing to install. | Você já está atualizado — nada para instalar. | ✅ `updatesSection.latestDetail` |
| 71 | `src/shared/updateState.ts:311` | Check again | Verificar novamente | ✅ `updatesSection.checkAgainBtn` |
| 72 | `src/shared/updateState.ts:317` | Updates are checked automatically every 6 hours. Check now if you want to be sure. | As atualizações são verificadas automaticamente a cada 6 horas. Verifique agora se quiser ter certeza. | ✅ `updatesSection.idleDetail` |
| 73 | `src/shared/updateState.ts:329` | Open the .dmg and drag Munder Difflin onto Applications. Choose Replace when asked. | Abra o .dmg e arraste o Munder Difflin para Aplicativos. Escolha Substituir quando solicitado. | ➕ `updatesSection.installSteps.mac.1` |
| 74 | `src/shared/updateState.ts:330` | Quit this app, open the new one from Applications, and pick the same project. | Saia deste app, abra o novo em Aplicativos e escolha o mesmo projeto. | ➕ `updatesSection.installSteps.mac.2` |
| 75 | `src/shared/updateState.ts:338` | Quit this app, then run the downloaded setup .exe. It replaces the installed version. | Saia deste app e execute o .exe de instalação baixado. Ele substitui a versão instalada. | ➕ `updatesSection.installSteps.win.1` |
| 76 | `src/shared/updateState.ts:339` | Open Munder Difflin again and pick the same project. | Abra o Munder Difflin novamente e escolha o mesmo projeto. | ➕ `updatesSection.installSteps.win.2` |
| 77 | `src/shared/updateState.ts:347` | Make the downloaded .AppImage executable (chmod +x) and move it over the one you run now. | Torne o .AppImage baixado executável (chmod +x) e substitua o que você usa agora. | ➕ `updatesSection.installSteps.linux.1` |
| 78 | `src/shared/updateState.ts:348` | Quit this app, launch the new AppImage, and pick the same project. | Saia deste app, inicie o novo AppImage e escolha o mesmo projeto. | ➕ `updatesSection.installSteps.linux.2` |
| 79 | `src/shared/mcpCatalog.ts:57` | Structured step-by-step reasoning scratchpad. No I/O, no secrets. | Bloco de raciocínio estruturado passo a passo. Sem I/O, sem segredos. | ➕ `mcpDefaults.catalog.sequentialThinking` |
| 80 | `src/shared/mcpCatalog.ts:65` | Current time and timezone conversions. | Hora atual e conversões de fuso horário. | ➕ `mcpDefaults.catalog.time` |
| 81 | `src/shared/mcpCatalog.ts:74` | Fetch a URL and return its content as markdown (read-only HTTP GET). | Busca uma URL e retorna o conteúdo em markdown (HTTP GET somente leitura). | ➕ `mcpDefaults.catalog.fetch` |
| 82 | `src/shared/mcpCatalog.ts:83` | Up-to-date library/framework documentation lookups. | Consultas atualizadas de documentação de bibliotecas/frameworks. | ➕ `mcpDefaults.catalog.context7` |
| 83 | `src/shared/mcpCatalog.ts:91` | Read/edit files within the agent workspace only (scoped to cwd at spawn). | Lê/edita arquivos somente dentro do workspace do agente (limitado ao cwd na criação). | ➕ `mcpDefaults.catalog.filesystem` |
| 84 | `src/shared/mcpCatalog.ts:101` | Inspect git status/log/diff for the workspace repo (scoped to cwd at spawn). | Inspeciona status/log/diff do git do repositório do workspace (limitado ao cwd na criação). | ➕ `mcpDefaults.catalog.git` |
| 85 | `src/shared/mcpCatalog.ts:113` | Read/write GitHub issues, PRs, and repos. Requires a personal access token. | Lê/escreve issues, PRs e repositórios do GitHub. Requer um token de acesso pessoal. | ➕ `mcpDefaults.catalog.github` |
| 86 | `src/shared/mcpCatalog.ts:125` | Query a SQL database. Requires a connection string. | Consulta um banco SQL. Requer uma string de conexão. | ➕ `mcpDefaults.catalog.database` |
| 87 | `src/shared/mcpCatalog.ts:138` | Read/send mail and read/write calendar events. Requires account credentials. | Lê/envia e-mails e lê/escreve eventos de calendário. Requer credenciais da conta. | ➕ `mcpDefaults.catalog.emailCalendar` |
| 88 | `src/shared/mcpCatalog.ts:147` | Keyed web search. Requires a search-provider API key. | Busca na web com chave. Requer uma chave de API do provedor de busca. | ➕ `mcpDefaults.catalog.webSearch` |
| 89 | `src/shared/integrations.ts:245, 246` | GitHub personal access token / Create a fine-grained or classic PAT at github.com/settings/tokens… | Token de acesso pessoal do GitHub / Crie um PAT no github.com/settings/tokens… | ➕ `integrations.templates.github.secret` |
| 90 | `src/shared/integrations.ts:255, 256` | API key / token / Point baseUrl at any REST API. Choose how its credential is sent… | Chave de API / token / Aponte baseUrl para qualquer API REST. Escolha como a credencial é enviada… | ➕ `integrations.templates.customRest.secret` |
| 91 | `src/shared/integrations.ts:271, 272` | Linear API key / Linear → Settings → Security & access → Personal API keys… | Chave de API do Linear / Linear → Settings → Security & access → Personal API keys… | ➕ `integrations.templates.linear.secret` |
| 92 | `src/shared/integrations.ts:282, 283` | Authorization header (Basic …) / Basic auth: paste "Basic " + base64… | Header Authorization (Basic …) / Autenticação Basic: cole "Basic " + base64… | ➕ `integrations.templates.jira.secret` |
| 93 | `src/shared/integrations.ts:292, 293` | Notion internal integration token / notion.so/my-integrations → Internal Integration Secret… | Token de integração interna do Notion / notion.so/my-integrations → Internal Integration Secret… | ➕ `integrations.templates.notion.secret` |
| 94 | `src/shared/integrations.ts:302, 303` | Stripe secret key / dashboard.stripe.com → Developers → API keys → Secret key… | Chave secreta do Stripe / dashboard.stripe.com → Developers → API keys → Secret key… | ➕ `integrations.templates.stripe.secret` |
| 95 | `src/shared/integrations.ts:313, 314` | Authorization header (Basic …) / Basic auth: paste "Basic " + base64… (Atlassian) | Header Authorization (Basic …) / Autenticação Basic: cole "Basic " + base64… (Atlassian) | ➕ `integrations.templates.confluence.secret` |
| 96 | `src/shared/integrations.ts:323, 324` | Sentry auth token / sentry.io → Settings → Auth Tokens… | Token de autenticação do Sentry / sentry.io → Settings → Auth Tokens… | ➕ `integrations.templates.sentry.secret` |
| 97 | `src/shared/integrations.ts:333, 334` | HubSpot private app token / HubSpot → Settings → Integrations → Private Apps… | Token de app privado do HubSpot / HubSpot → Settings → Integrations → Private Apps… | ➕ `integrations.templates.hubspot.secret` |
| 98 | `src/shared/toolCatalog.ts:49` | Installs and runs mempalace. A self-contained Python toolchain — it does not touch any Python you already have. | Instala e executa o mempalace. Uma toolchain Python autocontida — não mexe no Python que você já tem. | ➕ `setupPanel.tools.uv.why` |
| 99 | `src/shared/toolCatalog.ts:64` | Meaning-based recall across everything your agents have learned. Without it they still keep plain markdown notes, but cannot search them by meaning. | Recuperação por significado em tudo que seus agentes aprenderam. Sem isso, eles ainda mantêm notas markdown, mas não conseguem buscá-las por significado. | ➕ `setupPanel.tools.mempalace.why` |
| 100 | `src/shared/toolCatalog.ts:70` | Needs uv first. | Precisa do uv primeiro. | ➕ `setupPanel.tools.mempalace.note` |
| 101 | `src/shared/toolCatalog.ts:77` | Worktrees let agents work in parallel without fighting over one checkout, and the hive keeps its own history in git. | Worktrees permitem que agentes trabalhem em paralelo sem disputar um único checkout, e a colmeia mantém seu próprio histórico no git. | ➕ `setupPanel.tools.git.why` |
| 102 | `src/shared/toolCatalog.ts:90` | Runs the npm-installed agent engines (OpenCode, and Claude Code on machines without the native build). | Executa os motores de agente instalados via npm (OpenCode e Claude Code em máquinas sem o build nativo). | ➕ `setupPanel.tools.node.why` |
| 103 | `src/shared/toolCatalog.ts:96` | The app installs this for you when an engine needs it — nothing to do by hand. | O app instala isso para você quando um motor precisa — nada para fazer manualmente. | ➕ `setupPanel.tools.node.note` |
| 104 | `src/shared/toolCatalog.ts:114` | Agent engine — {command}. | Motor de agente — {command}. | ➕ `setupPanel.tools.engine.why` |
| 105 | `src/shared/triggers.ts:31` | strict | rigoroso | ➕ `triggersUi.modes.strict.label` |
| 106 | `src/shared/triggers.ts:31` | Ask me before anything reaches the hive. | Pergunte antes que qualquer coisa chegue à colmeia. | ➕ `triggersUi.modes.strict.blurb` |
| 107 | `src/shared/triggers.ts:32` | allow all | permitir tudo | ➕ `triggersUi.modes.allowAll.label` |
| 108 | `src/shared/triggers.ts:32` | Messages, directives and communication all flow. | Mensagens, diretivas e comunicações passam livremente. | ➕ `triggersUi.modes.allowAll.blurb` |
| 109 | `src/shared/triggers.ts:33` | communication only | somente comunicação | ➕ `triggersUi.modes.communicationOnly.label` |
| 110 | `src/shared/triggers.ts:33` | Chatter flows; directives need my approval. | Conversas passam; diretivas precisam da minha aprovação. | ➕ `triggersUi.modes.communicationOnly.blurb` |
| 111 | `src/shared/engineAvailability.ts:63` | INSTALLED | INSTALADO | ➕ `onboarding.engine.installed` |
| 112 | `src/shared/engineAvailability.ts:64` | INSTALLS ON FIRST RUN | INSTALA NA PRIMEIRA EXECUÇÃO | ➕ `onboarding.engine.installsOnFirstRun` |
| 113 | `src/shared/engineAvailability.ts:65` | NOT INSTALLED | NÃO INSTALADO | ➕ `onboarding.engine.notInstalled` |
| 114 | `src/shared/engineAvailability.ts:75` | {label} is not installed on this computer and the app has no installer for it, so Michael could not start. Install it first, then press "check again". Or pick Claude Code, which installs itself on first run. | {label} não está instalado neste computador e o app não tem instalador para ele, então o Michael não pôde iniciar. Instale-o primeiro e pressione "verificar novamente". Ou escolha Claude Code, que se instala sozinho na primeira execução. | ➕ `onboarding.engine.noInstaller` |
| 115 | `src/shared/weeklySchedule.ts:32` | Sun, Mon, Tue, Wed, Thu, Fri, Sat | Dom, Seg, Ter, Qua, Qui, Sex, Sáb | ➕ `schedulesSection.weekdays.short` |
| 116 | `src/shared/weeklySchedule.ts:35` | S, M, T, W, T, F, S (weekday initials) | D, S, T, Q, Q, S, S | ➕ `schedulesSection.weekdays.initial` |
| 117 | `src/shared/weeklySchedule.ts:77` | no days picked | nenhum dia selecionado | ➕ `schedulesSection.weekly.noDays` |
| 118 | `src/shared/weeklySchedule.ts:80` | every day at {time} | todos os dias às {time} | ➕ `schedulesSection.weekly.everyDay` |
| 119 | `src/shared/weeklySchedule.ts:81` | weekdays at {time} | dias úteis às {time} | ➕ `schedulesSection.weekly.weekdays` |
| 120 | `src/shared/weeklySchedule.ts:82` | weekends at {time} | fins de semana às {time} | ➕ `schedulesSection.weekly.weekends` |
| 121 | `src/shared/weeklySchedule.ts:83` | {days} at {time} | {days} às {time} | ➕ `schedulesSection.weekly.atTime` |
| 122 | `src/shared/agentProvider.ts:329` | Qwen (local available) | Qwen (local disponível) | ➕ `agentProvider.qwenLocal` |
| 123 | `src/renderer/src/scene/office/cafeteriaLines.ts:23, 31, 40, 48, 63, 100, 160, 218` | Aproximadamente 410 falas ambiente de pausa para café (solo, por personagem e diálogos em dupla), incluindo trocadilhos de "that’s what she said". | Traduzir como conteúdo ambiente, preservando o humor e as referências à série; pode ser feito em uma passada dedicada. | ➕ `office.cafeteria.*` — Conteúdo visível em balões de pensamento; não é chrome de UI |
| 124 | `src/renderer/src/scene/office/cast.ts:31` | World's best boss | O melhor chefe do mundo | ➕ `office.cast.michael.blurb` |
| 125 | `src/renderer/src/scene/office/cast.ts:32` | Salesman, prankster | Vendedor, brincalhão | ➕ `office.cast.jim.blurb` |
| 126 | `src/renderer/src/scene/office/cast.ts:33` | Receptionist, artist | Recepcionista, artista | ➕ `office.cast.pam.blurb` |
| 127 | `src/renderer/src/scene/office/cast.ts:34` | Assistant (to the) RM | Assistente (do) gerente regional | ➕ `office.cast.dwight.blurb` |
| 128 | `src/renderer/src/scene/office/cast.ts:35` | Accounting | Contabilidade | ➕ `office.cast.kevin.blurb` |
| 129 | `src/renderer/src/scene/office/cast.ts:36` | Head of accounting | Chefe da contabilidade | ➕ `office.cast.angela.blurb` |
| 130 | `src/renderer/src/scene/office/cast.ts:37` | Accountant | Contador | ➕ `office.cast.oscar.blurb` |
| 131 | `src/renderer/src/scene/office/cast.ts:38` | Sales, crossword | Vendas, palavras cruzadas | ➕ `office.cast.stanley.blurb` |
| 132 | `src/renderer/src/scene/office/cast.ts:39` | Sales | Vendas | ➕ `office.cast.phyllis.blurb` |
| 133 | `src/renderer/src/scene/office/cast.ts:40` | Cornell, a cappella | Cornell, a cappella | ➕ `office.cast.andy.blurb` |
| 134 | `src/renderer/src/scene/office/cast.ts:41` | Customer service | Atendimento ao cliente | ➕ `office.cast.kelly.blurb` |
| 135 | `src/renderer/src/scene/office/cast.ts:42` | The temp | O estagiário | ➕ `office.cast.ryan.blurb` |
| 136 | `src/renderer/src/scene/office/cast.ts:43` | Human resources | Recursos humanos | ➕ `office.cast.toby.blurb` |
| 137 | `src/renderer/src/scene/office/cast.ts:44` | Quality assurance | Garantia de qualidade | ➕ `office.cast.creed.blurb` |
| 138 | `src/renderer/src/scene/office/cast.ts:45` | Supplier relations | Relações com fornecedores | ➕ `office.cast.meredith.blurb` |

**Subtotal P3: 574 ocorrências.**

## Observações por arquivo (P1)

- **`App.tsx`** não usa `useTranslation()` em nenhum ponto; toda a moldura da tela inicial (title bar, estados vazios, foco) está hardcoded.
- **`EditAgentModal.tsx`** e **`QuitWarningModal.tsx`** não importam `react-i18next`; são os dois maiores blocos 100% monolíngues.
- **`AddAgentModal.tsx`** já usa `tr()` na maior parte do formulário; restam os templates de briefing (conteúdo de prompt) e mensagens de erro/estado.
- **`SettingsModal.tsx`** está majoritariamente traduzido; restam o bloco “Who can add agents”, notas de status de Slack/Webhook/Organização e os dois popovers de documentação (`SLACK_CONNECT_STEPS`, `webhookApiDoc`).
- **`OnboardingWizard.tsx`** usa `<Trans>` com chaves existentes; restam apenas “checking…”, “check again”, “install instructions” e a mensagem de motor não instalado (que já tem chave).
- **`SetupPanel.tsx`** não tem strings próprias, mas herda `why`/`note` em inglês de `src/shared/toolCatalog.ts` (ver P3).
- **`BlockedBanner.tsx`** não tem texto próprio: `reason.summary`, `reason.detail` e `reason.actions[].label` vêm de `usePtyParser`/hooks do main (ver P3).
- **`AskMeTab.tsx`** e **`TasksKanban.tsx`** já estão traduzidos; erros internos engolidos por `catch` não foram contados.
- **P1 sem ocorrências próprias:** `AgentStrip.tsx`, `SetupPanel.tsx`, `BlockedBanner.tsx`, `TasksKanban.tsx` e `AskMeTab.tsx`. `BlockedBanner` apenas renderiza `reason.summary/detail/actions`, cujos textos vêm de `usePtyParser` e do main (ver P2/P3).

## Sugestão de ordem de execução

1. Registrar o locale `pt-BR` (arquivo já presente) em `i18n/index.ts` (`LANGUAGES`, `resources`, `supportedLngs`) e revisar a cobertura de chaves em relação a `en.json`.
2. Fechar os blocos 100% monolíngues: `App.tsx`, `EditAgentModal.tsx`, `QuitWarningModal.tsx`, `HivePicker.tsx`, `MichaelBooting.tsx`.
3. Traduzir os componentes de atualização (`UpdateBadge`, `UpdateToast`, `updateState.ts`) e as notificações/menus do main.
4. Traduzir `shared` que alimenta UI (`mcpCatalog`, `integrations`, `toolCatalog`, `triggers`, `engineAvailability`, `weeklySchedule`).
5. Em uma passada separada, traduzir o conteúdo ambiente da cafeteria e os blurbs do elenco.

## Contagem final

- **Total de strings encontradas:** 869
- **P1:** 138  |  **P2:** 157  |  **P3:** 574
- **Arquivos com ocorrências:** 52
- **Relatório:** `docs/PTBR-AUDIT.md`
