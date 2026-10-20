/**
 * Single source of truth for the Claude Code command reference.
 *
 * Consumed by BOTH the renderer (the Command Center "commands" tab) and the main
 * process (rendered to `<hive>/COMMANDS.md`, which the orchestrator agent reads),
 * so the human's cheat-sheet and the agent's reference never drift.
 *
 * Web-verified against the Claude Code docs (slash + CLI reference) for v2.1.x.
 * Curated to the broadly-useful set — aliases and trivia are intentionally omitted.
 *
 * `kind` doubles as the scope hint an orchestrator needs:
 *   - `slash` acts ONLY on the session it's typed into (you cannot run it on
 *     another agent's terminal).
 *   - `cli` runs in a shell and can target the fleet / spawn / query.
 */
export type CmdKind = 'slash' | 'cli';

export interface Cmd {
  cmd: string;
  kind: CmdKind;
  desc: string;
  usage?: string;
}

export interface CmdGroup {
  title: string;
  items: Cmd[];
}

export const COMMAND_GROUPS: CmdGroup[] = [
  {
    title: 'SESSÃO',
    items: [
      { cmd: '/clear', kind: 'slash', desc: 'Inicia uma conversa nova e recupera toda a janela de contexto. A anterior continua em /resume.' },
      { cmd: '/resume', kind: 'slash', desc: 'Escolha ou pesquise uma sessão anterior para continuar.', usage: '/resume refatoracao-auth' },
      { cmd: '/rewind', kind: 'slash', desc: 'Volta o código E a conversa para um checkpoint anterior.' },
      { cmd: '/compact', kind: 'slash', desc: 'Resume a conversa até agora para liberar contexto sem perder o fio.', usage: '/compact mantenha as decisões de auth' },
      { cmd: 'claude -c', kind: 'cli', desc: 'Continua a sessão mais recente neste diretório.' },
      { cmd: 'claude -r', kind: 'cli', desc: 'Retoma — escolha ou pesquise uma sessão anterior.', usage: 'claude -r auth' },
      { cmd: 'claude --fork-session', kind: 'cli', desc: 'Ao retomar, cria uma ramificação com um novo id de sessão em vez de reutilizar o original.' }
    ]
  },
  {
    title: 'CONTEXTO E MEMÓRIA',
    items: [
      { cmd: '/context', kind: 'slash', desc: 'Visualiza o que está ocupando a janela de contexto, com dicas de otimização.' },
      { cmd: '/memory', kind: 'slash', desc: 'Abre os arquivos de memória CLAUDE.md do projeto e do usuário para edição.' },
      { cmd: '/init', kind: 'slash', desc: 'Examina o repositório e gera um CLAUDE.md capturando suas convenções.' },
      { cmd: '# ', kind: 'slash', desc: 'Memória rápida: comece a linha com # para acrescentar uma nota durável à memória.', usage: '# rode prettier antes de commitar' },
      { cmd: 'claude --add-dir ../outro-repo', kind: 'cli', desc: 'Concede à sessão acesso de leitura/escrita a um diretório extra.' }
    ]
  },
  {
    title: 'MODELOS E ESFORÇO',
    items: [
      { cmd: '/model', kind: 'slash', desc: 'Troca o modelo desta sessão (salvo como padrão); as setas ajustam o esforço.', usage: '/model opus' },
      { cmd: '/effort', kind: 'slash', desc: 'Define o esforço de raciocínio: low / medium / high / xhigh / max.', usage: '/effort high' },
      { cmd: '/fast', kind: 'slash', desc: 'Liga/desliga o modo rápido — Opus com saída mais veloz, sem rebaixar o modelo.' },
      { cmd: 'claude --model claude-sonnet-4-6[1m]', kind: 'cli', desc: 'Inicia em um modelo específico. O sufixo [1m] seleciona a janela de 1M tokens (Dwight).' },
      { cmd: 'claude --fallback-model sonnet', kind: 'cli', desc: 'Recorre automaticamente a outro modelo quando o principal está indisponível.' }
    ]
  },
  {
    title: 'PLANEJAR E EXECUTAR',
    items: [
      { cmd: '/plan', kind: 'slash', desc: 'Entra no modo plano — projeta a mudança antes de qualquer edição.', usage: '/plan refatorar o módulo de auth' },
      { cmd: '/goal', kind: 'slash', desc: 'Define uma condição de objetivo; o Claude continua trabalhando entre turnos até cumpri-la.', usage: '/goal todos os testes passarem' },
      { cmd: '/batch', kind: 'slash', desc: 'Decompõe uma mudança grande em unidades paralelas em worktrees git.', usage: '/batch migrar componentes para v2' },
      { cmd: '/diff', kind: 'slash', desc: 'Abre o visualizador interativo de diff das mudanças atuais.' },
      { cmd: '/run', kind: 'slash', desc: 'Inicia e opera o app do projeto para ver a mudança funcionando de verdade.' },
      { cmd: '/verify', kind: 'slash', desc: 'Compila, executa e observa para confirmar que a mudança faz o que deveria.' },
      { cmd: 'claude --worktree feat/x', kind: 'cli', desc: 'Inicia a sessão em uma worktree git isolada.' }
    ]
  },
  {
    title: 'REVISÃO E GIT',
    items: [
      { cmd: '/code-review', kind: 'slash', desc: 'Caça bugs de correção no diff. --fix aplica as correções, --comment publica comentários inline; "ultra" roda uma revisão profunda na nuvem.', usage: '/code-review high --fix' },
      { cmd: '/simplify', kind: 'slash', desc: 'Passada apenas de limpeza no código alterado (reuso/simplificação) — sem caça a bugs.' },
      { cmd: '/review', kind: 'slash', desc: 'Revisa um pull request nesta sessão.', usage: '/review 123' },
      { cmd: '/security-review', kind: 'slash', desc: 'Verifica mudanças pendentes em busca de vulnerabilidades de segurança.' },
      { cmd: '/ultrareview', kind: 'slash', desc: 'Revisão multiagente na nuvem do branch atual ou de um PR.' }
    ]
  },
  {
    title: 'SUBAGENTES E SEGUNDO PLANO',
    items: [
      { cmd: 'claude agents', kind: 'cli', desc: 'Abre a visão de agentes entre suas sessões Claude ativas e em segundo plano.' },
      { cmd: 'claude agents --json', kind: 'cli', desc: 'Imprime as sessões ativas como JSON — status da frota para scripts.' },
      { cmd: '/agents', kind: 'slash', desc: 'Cria e gerencia subagentes personalizados para trabalho delegado.' },
      { cmd: '/fork', kind: 'slash', desc: 'Gera um subagente em segundo plano que herda a conversa completa.', usage: '/fork implemente a correção de performance' },
      { cmd: '/background', kind: 'slash', desc: 'Desanexa a sessão atual para que ela continue rodando em segundo plano.' },
      { cmd: '/tasks', kind: 'slash', desc: 'Visualiza e gerencia tudo o que está rodando em segundo plano.' },
      { cmd: '/stop', kind: 'slash', desc: 'Para a sessão em segundo plano atual (quando anexada).' },
      { cmd: 'claude --agent reviewer', kind: 'cli', desc: 'Inicia a sessão usando uma configuração de agente específica.' }
    ]
  },
  {
    title: 'FERRAMENTAS E PERMISSÕES',
    items: [
      { cmd: '/permissions', kind: 'slash', desc: 'Visualiza e edita quais ferramentas são permitidas, perguntadas ou negadas.' },
      { cmd: '/hooks', kind: 'slash', desc: 'Visualiza os hooks de ciclo de vida configurados (PreToolUse, Stop etc.).' },
      { cmd: 'claude --permission-mode bypassPermissions', kind: 'cli', desc: 'Roda sem prompts de aprovação por ferramenta (é o que o "modo automático" usa).' },
      { cmd: 'claude --allowedTools "Bash(git *) Edit Read"', kind: 'cli', desc: 'Pré-autoriza ferramentas específicas para que nunca perguntem.' }
    ]
  },
  {
    title: 'MCP E PLUGINS',
    items: [
      { cmd: '/mcp', kind: 'slash', desc: 'Lista/gerencia servidores MCP conectados e autentica (OAuth).' },
      { cmd: '/plugin', kind: 'slash', desc: 'Gerencia plugins (listar, instalar, ativar, desativar).' },
      { cmd: 'claude mcp list', kind: 'cli', desc: 'Lista os servidores MCP configurados e a saúde deles.' },
      { cmd: 'claude mcp add <nome> <comando>', kind: 'cli', desc: 'Registra um novo servidor MCP (stdio ou HTTP).' }
    ]
  },
  {
    title: 'USO E CUSTO',
    items: [
      { cmd: '/usage', kind: 'slash', desc: 'Custo da sessão, limites do plano e detalhamento por skill / subagente / MCP.' },
      { cmd: '/status', kind: 'slash', desc: 'Conta, modelo ativo, versão e status da conexão.' },
      { cmd: 'claude -p "..." --max-budget-usd 5', kind: 'cli', desc: 'Limita o gasto em dólares de uma execução headless.' },
      { cmd: 'claude --max-turns 20', kind: 'cli', desc: 'Limita os turnos agênticos (uma proteção grossa contra execuções descontroladas).' }
    ]
  },
  {
    title: 'AUTOMAÇÃO (HEADLESS)',
    items: [
      { cmd: 'claude -p "seu prompt"', kind: 'cli', desc: 'Modo print: executa um prompt de forma não interativa e encerra.', usage: 'cat log | claude -p "resuma"' },
      { cmd: 'claude -p "..." --output-format json', kind: 'cli', desc: 'Headless com JSON estruturado (resultado, uso, custo).' },
      { cmd: 'claude -p "..." --output-format stream-json', kind: 'cli', desc: 'Eventos JSON em streaming para consumo ao vivo.' },
      { cmd: 'claude -p "..." --json-schema <schema>', kind: 'cli', desc: 'Força o resultado headless a corresponder a um JSON Schema.' },
      { cmd: 'claude --append-system-prompt "..."', kind: 'cli', desc: 'Acrescenta instruções extras ao prompt de sistema padrão.' }
    ]
  },
  {
    title: 'CONFIGURAÇÃO',
    items: [
      { cmd: '/config', kind: 'slash', desc: 'Abre as Configurações: tema, modelo, estilo de saída e preferências.' },
      { cmd: '/theme', kind: 'slash', desc: 'Muda o tema de cores (auto / claro / escuro / daltônico / personalizado).' },
      { cmd: '/statusline', kind: 'slash', desc: 'Configura a linha de status do Claude Code.' }
    ]
  },
  {
    title: 'AJUDA E DIAGNÓSTICO',
    items: [
      { cmd: '/help', kind: 'slash', desc: 'Lista todos os comandos de barra disponíveis.' },
      { cmd: '/doctor', kind: 'slash', desc: 'Diagnostica problemas de instalação/saúde (pressione f para corrigir automaticamente).' },
      { cmd: '/debug', kind: 'slash', desc: 'Ativa o log de depuração e investiga a sessão atual.' },
      { cmd: '/release-notes', kind: 'slash', desc: 'Navega pelo changelog do Claude Code por versão.' },
      { cmd: '/remote-control', kind: 'slash', desc: 'Expõe esta sessão para controle pelo claude.ai ou pelo celular.' }
    ]
  }
];