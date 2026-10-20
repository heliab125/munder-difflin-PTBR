// Synthetic event stream so the avatars actually move while we wait on real tmux/hook wiring.

import { useStore, type Agent, type StationKind, type ToolKind } from './store';

const STATION_BY_TOOL: Record<ToolKind, StationKind> = {
  Read: 'shelf', Edit: 'shelf', Write: 'shelf',
  Bash: 'terminal',
  WebFetch: 'web', WebSearch: 'web',
  Grep: 'shelf', Glob: 'shelf',
  TodoWrite: 'board',
  MCP: 'mcp'
};

interface ToolSample {
  tool: ToolKind;
  what: string;            // short — used as the action text
  lines: string[];         // terminal stream output
  thought: string;         // first-person assistant text, streamed in the sidebar
}

const TOOL_SAMPLES: ToolSample[] = [
  {
    tool: 'Read', what: 'lendo SPEC.md',
    lines: ['\x1b[36m● Read\x1b[0m SPEC.md', '   read 412 lines.'],
    thought: "Abrindo a especificação para confirmar a máquina de estados antes de mexer na implementação."
  },
  {
    tool: 'Edit', what: 'editando PixelPanel.tsx',
    lines: ['\x1b[36m● Edit\x1b[0m src/renderer/src/components/PixelPanel.tsx', '   +14 / -3'],
    thought: "Ajustando o cálculo da borda do painel — o traço interno estava um pixel fora no modo inset."
  },
  {
    tool: 'Bash', what: 'executando testes',
    lines: ['\x1b[36m● Bash\x1b[0m npm test', '   ✓ 24 passed'],
    thought: "Executando a suíte do renderer para garantir que nada regrediu antes de seguir."
  },
  {
    tool: 'WebFetch', what: 'buscando documentação',
    lines: ['\x1b[36m● WebFetch\x1b[0m https://docs.example.com/hooks', '   ok 200 (1.2kb)'],
    thought: "Consultando a documentação de hooks para conferir o formato do payload do PreToolUse — não lembro bem os nomes dos campos."
  },
  {
    tool: 'Glob', what: 'procurando arquivos de skill',
    lines: ['\x1b[36m● Glob\x1b[0m **/*.skill.md', '   23 matches'],
    thought: "Listando todos os arquivos de skill para revisar cada um e procurar caminhos de script desatualizados."
  },
  {
    tool: 'TodoWrite', what: 'atualizando o quadro de tarefas',
    lines: ['\x1b[36m● TodoWrite\x1b[0m 4 items'],
    thought: "Dividindo o trabalho restante em quatro tarefas para acompanhar cada uma."
  }
];

function pickSample() {
  return TOOL_SAMPLES[Math.floor(Math.random() * TOOL_SAMPLES.length)];
}

const TICK_MS = 1800;

function stepAgent(agent: Agent) {
  const { updateAgent, pushFeed } = useStore.getState();

  if (agent.status === 'blocked') {
    // Wait for user action; don't move automatically.
    return;
  }

  // Decision based on current status
  if (agent.status === 'idle') {
    // Maybe start a new task
    if (Math.random() < 0.4) {
      const sample = pickSample();
      const station = STATION_BY_TOOL[sample.tool];
      updateAgent(agent.id, {
        status: 'thinking',
        action: `indo para ${station}`,
        currentStation: station,
        progress: 1
      });
    }
    return;
  }

  if (agent.status === 'thinking') {
    // Arrived at the station — kick off the tool
    // (in real life this fires on PreToolUse arrival)

    const station = agent.currentStation ?? 'desk';
    const tool: ToolKind = station === 'shelf' ? (Math.random() < 0.5 ? 'Read' : 'Edit')
      : station === 'terminal' ? 'Bash'
      : station === 'web' ? 'WebFetch'
      : station === 'board' ? 'TodoWrite' : 'Read';
    const sample = pickSample();
    updateAgent(agent.id, {
      status: 'working',
      action: sample.what,
      carrying: tool,
      progress: Math.min(agent.progress + 1, 8),
      recentAssistantText: sample.thought,
      recentTextTs: Date.now()
    });
    sample.lines.forEach(l => pushFeed(agent.id, l));
    return;
  }

  if (agent.status === 'working') {
    // Finish the tool and either keep going or settle
    if (Math.random() < 0.5) {
      updateAgent(agent.id, {
        status: 'thinking',
        action: 'voltando para a mesa',
        currentStation: 'desk',
        progress: Math.min(agent.progress + 1, 8)
      });
    } else {
      // Move to a new station
      const sample = pickSample();
      const station = STATION_BY_TOOL[sample.tool];
      updateAgent(agent.id, {
        status: 'thinking',
        action: `indo para ${station}`,
        currentStation: station,
        progress: Math.min(agent.progress + 1, 8)
      });
    }
    return;
  }
}

const MOCK_ACTS = ['request', 'inform', 'propose', 'query', 'agree'] as const;

/** Occasionally fire a synthetic agent-to-agent message so the office floor's
 *  envelope-handoff animation is visible in demo mode (no live hive routing
 *  happens without real `claude` agents). The scene listens for this event and
 *  flies an envelope between the two avatars; see OfficeFloor's demo path. */
function maybeFlyMessage(mockIds: string[]): void {
  if (mockIds.length < 2 || Math.random() >= 0.45) return;
  const from = mockIds[Math.floor(Math.random() * mockIds.length)];
  let to = from;
  for (let i = 0; i < 6 && to === from; i++) {
    to = mockIds[Math.floor(Math.random() * mockIds.length)];
  }
  if (to === from) return;
  const act = MOCK_ACTS[Math.floor(Math.random() * MOCK_ACTS.length)];
  window.dispatchEvent(new CustomEvent('cth:demo-handoff', { detail: { from, to, act } }));
}

let interval: number | null = null;

export function startMockLoop() {
  if (interval !== null) return;
  interval = window.setInterval(() => {
    const { agents } = useStore.getState();
    // Only step mock agents (no ptyId). Real agents are driven by the pty parser.
    for (const a of agents) if (!a.ptyId) stepAgent(a);

    const { agents: a2, updateAgent } = useStore.getState();
    for (const a of a2) {
      if (a.ptyId) continue;
      if (a.status === 'thinking' && a.currentStation === 'desk' && Math.random() < 0.4) {
        updateAgent(a.id, {
          status: 'idle',
          action: 'aguardando',
          carrying: undefined,
          recentAssistantText: 'Terminei essa. Qual é a próxima?',
          recentTextTs: Date.now()
        });
      }
    }

    maybeFlyMessage(a2.filter((a) => !a.ptyId).map((a) => a.id));
  }, TICK_MS) as unknown as number;
}

export function stopMockLoop() {
  if (interval !== null) {
    window.clearInterval(interval);
    interval = null;
  }
}
