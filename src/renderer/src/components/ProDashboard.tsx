import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useStore, type Agent } from '@/store/store';
import type { HarnessConfig } from '@/store/config';
import type { SubscriptionStatus } from '@shared/subscription';
import { parseTasks, openQuestion, waitsOnHuman, type HiveTask } from './TasksKanban';
import { IntegrationsRegistry } from './IntegrationsRegistry';
import { SpritePortrait } from './SpritePortrait';
import { ProviderLogo } from './ProviderLogo';
import { ProIcon, type ProIconName } from './ProIcon';
import type { ToolStatus } from '@shared/toolCatalog';

declare const __APP_VERSION__: string;

type ProSection =
  | 'agents'
  | 'tasks'
  | 'inbox'
  | 'automations'
  | 'memory'
  | 'capabilities'
  | 'integrations'
  | 'stapler'
  | 'temps'
  | 'you';

const NAV: Array<{ id: ProSection; label: string; icon: ProIconName }> = [
  { id: 'tasks', label: 'Tarefas', icon: 'tasks' },
  { id: 'inbox', label: 'Caixa de Entrada', icon: 'inbox' },
  { id: 'automations', label: 'Automações', icon: 'automations' },
  { id: 'memory', label: 'Memória', icon: 'memory' },
  { id: 'capabilities', label: 'Capacidades', icon: 'capabilities' },
  { id: 'integrations', label: 'Integrações', icon: 'integrations' },
  { id: 'stapler', label: 'Grampeador', icon: 'stapler' }
];

const TITLES: Record<ProSection, string> = {
  agents: 'Agentes',
  tasks: 'Tarefas',
  inbox: 'Caixa de Entrada',
  automations: 'Automações',
  memory: 'Memória',
  capabilities: 'Capacidades',
  integrations: 'Integrações',
  stapler: 'Grampeador',
  temps: 'Subagentes',
  you: 'Você'
};

const STATUS_PT: Record<string, string> = {
  idle: 'Ocioso',
  thinking: 'Trabalhando',
  working: 'Trabalhando',
  waiting: 'Aguardando',
  blocked: 'Bloqueado',
  success: 'Concluído',
  ghost: 'Ausente',
  compacting: 'Compactando',
  looping: 'Em loop',
  typing: 'Digitando'
};

const STATUS_DOT: Record<string, string> = {
  idle: 'var(--cth-dot-idle, var(--cth-status-idle))',
  thinking: 'var(--cth-status-thinking)',
  working: 'var(--cth-dot-working, var(--cth-status-working))',
  waiting: 'var(--cth-status-waiting)',
  blocked: 'var(--cth-status-blocked)',
  success: 'var(--cth-status-success)',
  ghost: 'var(--cth-status-ghost)',
  compacting: 'var(--cth-status-compacting)',
  looping: 'var(--cth-status-looping)',
  typing: 'var(--cth-status-typing)'
};

const panel: CSSProperties = {
  background: 'var(--cth-cream-50)',
  border: '1px solid var(--cth-ink-300)',
  borderRadius: 12,
  minWidth: 0
};

const inner: CSSProperties = {
  background: 'var(--cth-cream-100)',
  border: '1px solid var(--cth-ink-300)',
  borderRadius: 8,
  minWidth: 0
};

const label: CSSProperties = {
  display: 'block',
  fontSize: 10.5,
  lineHeight: '14px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontWeight: 600,
  color: 'var(--cth-ink-500)'
};

const muted: CSSProperties = {
  fontSize: 12,
  lineHeight: '16px',
  color: 'var(--cth-ink-500)'
};

const body: CSSProperties = {
  fontSize: 13,
  lineHeight: '18px',
  color: 'var(--cth-ink-700)'
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  lineHeight: '20px',
  fontWeight: 600,
  color: 'var(--cth-ink-900)',
  whiteSpace: 'nowrap'
};

function Button({
  children,
  onClick,
  variant = 'secondary',
  disabled,
  title,
  style
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  title?: string;
  style?: CSSProperties;
}) {
  const primary = variant === 'primary';
  const ghost = variant === 'ghost';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        height: 32,
        padding: ghost ? '0 8px' : '0 12px',
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
        border: ghost ? '1px solid transparent' : `1px solid ${primary ? 'var(--cth-accent)' : 'var(--cth-ink-300)'}`,
        background: primary ? 'var(--cth-accent)' : ghost ? 'transparent' : 'var(--cth-cream-100)',
        color: primary ? 'var(--cth-accent-ink)' : ghost ? 'var(--cth-ink-500)' : 'var(--cth-ink-900)',
        fontFamily: 'var(--cth-font-ui)',
        fontSize: 13,
        fontWeight: primary ? 600 : 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        ...style
      }}
    >
      {children}
    </button>
  );
}

function IconButton({ name, title, onClick, active }: { name: ProIconName; title: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        padding: 0,
        display: 'inline-grid',
        placeItems: 'center',
        borderRadius: 7,
        border: '1px solid transparent',
        background: active ? 'var(--cth-cream-200)' : 'transparent',
        color: active ? 'var(--cth-ink-900)' : 'var(--cth-ink-500)',
        cursor: 'pointer',
        flexShrink: 0
      }}
    >
      <ProIcon name={name} size={16} />
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 20,
      padding: '0 7px',
      borderRadius: 6,
      background: 'var(--cth-cream-200)',
      color: 'var(--cth-ink-500)',
      fontSize: 11,
      fontWeight: 500,
      whiteSpace: 'nowrap'
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: 999,
        background: STATUS_DOT[status] ?? 'var(--cth-ink-500)',
        flexShrink: 0
      }} />
      {STATUS_PT[status] ?? status}
    </span>
  );
}

function Metric({
  title,
  value,
  hint,
  onClick
}: {
  title: string;
  value: ReactNode;
  hint: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick, title: hint } : {})}
      style={{
        ...inner,
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        textAlign: 'start',
        font: 'inherit',
        color: 'inherit',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <span style={label}>{title}</span>
      <span style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 5,
        fontSize: 16,
        lineHeight: '20px',
        fontWeight: 600,
        color: 'var(--cth-ink-900)',
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {value}
        <small style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--cth-ink-500)' }}>{hint}</small>
      </span>
    </Tag>
  );
}

function quotaColor(status: SubscriptionStatus | null): string {
  switch (status?.quota.state) {
    case 'full': return 'var(--cth-status-blocked)';
    case 'warning': return 'var(--cth-status-waiting)';
    case 'ok': return 'var(--cth-status-success)';
    default: return 'var(--cth-ink-500)';
  }
}

function missionLabel(id: string, fallback: string): string {
  switch (id) {
    case 'ops-standup': return 'Reunião operacional de hora em hora';
    case 'heartbeat': return 'Batimento do escritório';
    case 'compact-maintenance': return 'Compactação automática';
    default: return fallback;
  }
}

function agentEngine(agent: Agent | undefined, status: SubscriptionStatus | null): string {
  if (!agent) return status?.providerModel ?? 'modelo padrão';
  const provider = agent.provider ?? 'claude';
  const model = agent.model ?? status?.providerModel;
  return model ? `${provider} · ${model}` : provider;
}

function orchestratorDescription(agent: Agent | undefined): string {
  const raw = (agent?.description ?? '').trim();
  if (!raw || /^god\b/i.test(raw)) {
    return 'comando central — coordena o escritório, faz a triagem de demandas e escala apenas decisões críticas para você';
  }
  return raw;
}

export function ProDashboard({
  config,
  onOpenSettings,
  onOpenAgent,
  onClassic
}: {
  config: HarnessConfig;
  onOpenSettings: () => void;
  onOpenAgent: (id: string) => void;
  onClassic: () => void;
}) {
  const agents = useStore((s) => s.agents);
  const setAddAgentOpen = useStore((s) => s.setAddAgentOpen);
  const openTaskDetail = useStore((s) => s.openTaskDetail);
  const god = agents.find((a) => a.isGod);
  const [section, setSection] = useState<ProSection>('agents');
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [tasks, setTasks] = useState<HiveTask[]>([]);
  const [tools, setTools] = useState<ToolStatus[]>([]);
  const [memory, setMemory] = useState<{ enabled: boolean; available: boolean; initialized: boolean; active: boolean; model?: string } | null>(null);
  const [search, setSearch] = useState('');
  const [composer, setComposer] = useState('');
  const [composerNote, setComposerNote] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [memoryQuery, setMemoryQuery] = useState('');
  const [memoryResult, setMemoryResult] = useState<string | null>(null);
  const [memoryBusy, setMemoryBusy] = useState(false);
  const [agentListOpen, setAgentListOpen] = useState(true);
  const composerRef = useRef<HTMLInputElement | null>(null);

  const refresh = useCallback(async () => {
    try { setStatus(await window.cth.subscriptionStatus()); } catch { /* mantém o último bom */ }
    try { setTasks(parseTasks(await window.cth.hiveTasks())); } catch { /* mantém o último bom */ }
    try { setTools(await window.cth.toolsStatus()); } catch { /* mantém o último bom */ }
    try { setMemory(await window.cth.memoryStatus()); } catch { /* mantém o último bom */ }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => { void refresh(); }, 5_000);
    return () => clearInterval(timer);
  }, [refresh]);

  const waiting = useMemo(() => tasks.filter(waitsOnHuman), [tasks]);
  const counts = useMemo(() => ({
    todo: tasks.filter((t) => t.status === 'todo').length,
    doing: tasks.filter((t) => t.status === 'doing').length,
    blocked: tasks.filter((t) => t.status === 'blocked').length,
    done: tasks.filter((t) => t.status === 'done').length
  }), [tasks]);
  const nonGod = agents.filter((a) => !a.isGod && !a.isAssistant);
  const activeSubs = status?.quota.active ?? nonGod.filter((a) => !a.archived).length;
  const limit = status?.quota.limit ?? null;
  const percent = status?.quota.percent ?? (limit ? Math.round((activeSubs / limit) * 100) : 0);
  const configured = !!status?.configured;

  const filtered = agents.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
  });

  const send = async () => {
    const text = composer.trim();
    if (!text || sending) return;
    setSending(true);
    setComposerNote(null);
    try {
      const res = await window.cth.hiveSend(
        { to: 'god', act: 'request', subject: 'Solicitação do painel PRO', body: text },
        'human'
      );
      if (res.ok) {
        setComposer('');
        setComposerNote(`Enviado para ${god?.name ?? 'o orquestrador'}.`);
      } else {
        setComposerNote(res.error ?? 'Não foi possível enviar.');
      }
    } catch (e) {
      setComposerNote(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
      setTimeout(() => setComposerNote(null), 4000);
    }
  };

  const attach = async () => {
    try {
      const res = await window.cth.attachFiles();
      if (res.ok && res.files.length > 0) {
        const paths = res.files.map((f) => f.path).join(' ');
        setComposer((cur) => (cur.trim() ? `${cur.trim()} ${paths}` : paths));
        composerRef.current?.focus();
      }
    } catch { /* picker cancelled or unavailable */ }
  };

  const answer = async (task: HiveTask) => {
    const q = openQuestion(task);
    const text = (answers[task.id] ?? '').trim();
    if (!q || !text) return;
    try {
      const next = tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              humanQA: (t.humanQA ?? []).map((entry) =>
                entry.q === q.q && !entry.a && !entry.dismissedAt
                  ? { ...entry, a: text, answeredAt: new Date().toISOString() }
                  : entry
              )
            }
          : t
      );
      const updated = next.find((c) => c.id === task.id);
      const saved = updated ? await window.cth.hivePatchTask(task.id, { humanQA: updated.humanQA }) : { ok: false };
      if (!saved.ok) throw new Error('A tarefa mudou antes da resposta ser salva.');
      await window.cth.hiveSend(
        {
          to: 'god',
          act: 'inform',
          subject: `RESPOSTA HUMANA na tarefa "${task.title}"`,
          body: [
            `O humano respondeu à pergunta aberta na tarefa ${task.id} ("${task.title}"):`,
            `P: ${q.q}`,
            `R: ${text}`,
            'A resposta também está registrada no humanQA do cartão. Aja, desbloqueie o cartão e continue o trabalho.'
          ].join('\n')
        },
        'human'
      );
      setAnswers((s) => ({ ...s, [task.id]: '' }));
      await refresh();
    } catch (e) {
      setComposerNote(e instanceof Error ? e.message : String(e));
    }
  };

  const toggleMission = async (id: string) => {
    const next = (config.missions ?? []).map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m));
    try { await window.cth.updateConfig({ missions: next }); } catch { /* mantém */ }
  };

  const runMemorySearch = async () => {
    const q = memoryQuery.trim();
    if (!q) return;
    setMemoryBusy(true);
    setMemoryResult(null);
    try {
      const res = await window.cth.searchMemory(q);
      setMemoryResult(res.ok ? (res.output || 'Nada encontrado.') : `Falha na busca: ${res.error}`);
    } catch (e) {
      setMemoryResult(e instanceof Error ? e.message : String(e));
    } finally {
      setMemoryBusy(false);
    }
  };

  const enabledMcp = Object.values(config.mcpDefaults ?? {}).filter((v) => v?.enabled).length;
  const subtitle =
    section === 'agents' ? `${nonGod.length} agentes · ${nonGod.filter((a) => !a.archived).length} subagentes`
      : section === 'tasks' ? `${counts.doing} em andamento · ${counts.blocked} bloqueadas`
        : section === 'inbox' ? `${waiting.length} pergunta${waiting.length === 1 ? '' : 's'}`
          : section === 'temps' ? `${nonGod.length} subagente${nonGod.length === 1 ? '' : 's'}`
            : '';

  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      background: 'var(--cth-cream-50)',
      color: 'var(--cth-ink-900)',
      fontFamily: 'var(--cth-font-ui)',
      fontSize: 13
    }}>
      {/* Rail */}
      <aside style={{
        width: 288,
        flexShrink: 0,
        background: 'var(--cth-cream-100)',
        borderRight: '1px solid var(--cth-ink-300)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 14px 10px' }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, overflow: 'hidden', flexShrink: 0, display: 'grid', placeItems: 'center' }}>
            <SpritePortrait character={god?.character ?? 'michael'} scale={1} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Munder Difflin
            </div>
            <div style={{ fontSize: 11, lineHeight: '16px', color: 'var(--cth-ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {configured ? `PRO plan · ${activeSubs}/${limit ?? '∞'}` : 'PRO plan'}
            </div>
            {configured && (
              <div
                title={`${status?.profileLabel} · ${status?.planLabel} · ${status?.priceLabel}`}
                style={{ fontSize: 10, lineHeight: '14px', color: 'var(--cth-ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {status?.profileLabel} · {status?.providerModel}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: 8 }}>
          <nav style={{ padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {NAV.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    height: 32,
                    padding: '6px 8px',
                    borderRadius: 7,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: active ? 500 : 400,
                    background: active ? 'var(--cth-surface-active)' : 'transparent',
                    color: active ? 'var(--cth-ink-900)' : 'var(--cth-ink-700)',
                    fontFamily: 'inherit',
                    fontSize: 13
                  }}
                >
                  <ProIcon name={item.icon} size={16} />
                  <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  {item.id === 'inbox' && waiting.length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--cth-accent-text)' }}>{waiting.length}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 16px 4px' }}>
            <span style={{ ...label, flex: 1 }}>AGENTES</span>
            <button
              type="button"
              title="Adicionar agente"
              aria-label="Adicionar agente"
              onClick={() => setAddAgentOpen(true)}
              style={{
                width: 18, height: 18, padding: 0, borderRadius: 5,
                border: '1px solid var(--cth-ink-300)', background: 'transparent',
                color: 'var(--cth-ink-500)', display: 'grid', placeItems: 'center', cursor: 'pointer'
              }}
            >
              <ProIcon name="plus" size={11} />
            </button>
          </div>

          <nav style={{ padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <button
              type="button"
              onClick={() => setSection('agents')}
              aria-current={section === 'agents' ? 'page' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', height: 32,
                padding: '6px 8px', borderRadius: 7, border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: section === 'agents' ? 500 : 400,
                background: section === 'agents' ? 'var(--cth-surface-active)' : 'transparent',
                color: section === 'agents' ? 'var(--cth-ink-900)' : 'var(--cth-ink-700)',
                fontFamily: 'inherit', fontSize: 13
              }}
            >
              <ProIcon name="agents" size={16} />
              <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Agentes</span>
              <span
                role="button"
                tabIndex={0}
                aria-label={agentListOpen ? 'Recolher lista de agentes' : 'Expandir lista de agentes'}
                title={agentListOpen ? 'Recolher lista de agentes' : 'Expandir lista de agentes'}
                onClick={(e) => { e.stopPropagation(); setAgentListOpen((v) => !v); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setAgentListOpen((v) => !v); } }}
                style={{
                  display: 'inline-grid', placeItems: 'center', width: 18, height: 18,
                  borderRadius: 5, color: 'var(--cth-ink-500)'
                }}
              >
                <ProIcon name={agentListOpen ? 'chevron-up' : 'chevron-down'} size={12} />
              </span>
            </button>

            {agentListOpen && god && (
              <div style={{ padding: '2px 0 4px 10px' }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenAgent(god.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onOpenAgent(god.id); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 6px 6px 10px',
                    borderRadius: 8, cursor: 'pointer', color: 'var(--cth-ink-700)'
                  }}
                >
                  <SpritePortrait character={god.character} scale={1} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cth-ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{god.name}</span>
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--cth-accent-text)', background: 'var(--cth-accent-soft)', borderRadius: 5, padding: '0 5px', lineHeight: '16px', whiteSpace: 'nowrap' }}>orquestrador</span>
                    </span>
                    <span style={{ fontSize: 10.5, color: 'var(--cth-ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {agentEngine(god, status)} · {STATUS_PT[god.status] ?? god.status}
                    </span>
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSection('temps')}
              aria-current={section === 'temps' ? 'page' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', height: 32,
                padding: '6px 8px', borderRadius: 7, border: 'none', cursor: 'pointer',
                textAlign: 'left', fontWeight: section === 'temps' ? 500 : 400,
                background: section === 'temps' ? 'var(--cth-surface-active)' : 'transparent',
                color: section === 'temps' ? 'var(--cth-ink-900)' : 'var(--cth-ink-700)',
                fontFamily: 'inherit', fontSize: 13
              }}
            >
              <ProIcon name="temps" size={16} />
              <span style={{ flex: 1, minWidth: 0 }}>Subagentes</span>
              <span style={{ fontSize: 11, color: 'var(--cth-ink-500)' }}>{nonGod.length}</span>
            </button>
          </nav>
        </div>

        <div style={{ padding: '4px 6px', borderTop: '1px solid var(--cth-ink-100)' }}>
          <button
            type="button"
            onClick={() => setSection('you')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '4px 6px', borderRadius: 8, border: 'none', background: 'transparent',
              color: 'var(--cth-ink-900)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit'
            }}
          >
            <span style={{
              width: 22, height: 22, borderRadius: '50%', background: 'var(--cth-cream-200)',
              display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0
            }}>V</span>
            <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 12, lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Você</span>
              <span style={{ fontSize: 10.5, lineHeight: '14px', color: 'var(--cth-ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                'Sessão local'
              </span>
            </span>
            <span style={{ flex: 1 }} />
            <ProIcon name="chevron-up" size={12} style={{ color: 'var(--cth-ink-500)' }} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, background: 'var(--cth-cream-50)', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, height: 52, padding: '0 18px',
          borderBottom: '1px solid var(--cth-ink-300)', flexShrink: 0,
          background: 'var(--cth-cream-50)'
        }}>
          <h1 style={titleStyle}>{TITLES[section]}</h1>
          {subtitle && <span style={{ fontSize: 12, color: 'var(--cth-ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</span>}
          <span style={{ flex: 1 }} />
          {section === 'agents' && (
            <>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 6, height: 30,
                padding: '0 9px', borderRadius: 8, border: '1px solid var(--cth-ink-300)',
                background: 'var(--cth-cream-100)', color: 'var(--cth-ink-500)', minWidth: 180
              }}>
                <ProIcon name="search" size={14} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar agentes"
                  style={{
                    flex: 1, minWidth: 0, border: 'none', background: 'transparent',
                    outline: 'none', fontFamily: 'inherit', fontSize: 12.5,
                    color: 'var(--cth-ink-900)'
                  }}
                />
              </label>
              <Button variant="secondary" onClick={() => setSection('capabilities')}>Capacidades</Button>
              <Button variant="primary" onClick={() => setAddAgentOpen(true)}>Adicionar agente</Button>
            </>
          )}
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18 }}>
          {section === 'agents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Orchestrator */}
              {god && (
                <div style={panel}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 0' }}>
                    <SpritePortrait character={god.character} scale={1} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, lineHeight: '20px' }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{god.name}</span>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 7px',
                          borderRadius: 6, background: 'var(--cth-accent-soft)', color: 'var(--cth-accent-text)',
                          fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap'
                        }}>orquestrador</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, fontSize: 11.5, color: 'var(--cth-ink-500)', minWidth: 0 }}>
                        <ProviderLogo provider={god.provider ?? 'claude'} size={12} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {agentEngine(god, status)} · {configured ? `${status?.profileLabel}` : 'Local · OpenAI-compatible'}
                        </span>
                      </div>
                    </div>
                    <span style={{ flex: 1 }} />
                    <StatusPill status={god.status} />
                  </div>

                  <div style={{ padding: '10px 16px 0', ...body }}>
                    {orchestratorDescription(god)}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, padding: '12px 16px 14px' }}>
                    <Metric
                      title="ORÇAMENTO HOJE"
                      value={config.costCapUsd ? `US$ ${config.costCapUsd.toFixed(2)}` : '$0.00'}
                      hint={config.costCapUsd ? 'limite definido' : 'sem limite definido'}
                    />
                    <Metric
                      title="DISJUNTOR"
                      value="—"
                      hint={config.circuitBreaker?.enabled === false ? 'desativado' : 'sem incidentes'}
                    />
                    <Metric
                      title="TAREFAS"
                      value={counts.doing}
                      hint={`${counts.blocked} bloqueadas`}
                      onClick={() => setSection('tasks')}
                    />
                    <Metric
                      title="AGUARDANDO VOCÊ"
                      value={waiting.length}
                      hint={`pergunta${waiting.length === 1 ? '' : 's'}`}
                      onClick={() => setSection('inbox')}
                    />
                  </div>
                </div>
              )}

              {/* Composer */}
              <div style={{ ...panel, padding: '10px 12px' }}>
                <div style={{ ...inner, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 4px 4px 12px', background: 'var(--cth-cream-100)' }}>
                  <input
                    ref={composerRef}
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        if (god) onOpenAgent(god.id);
                        return;
                      }
                      e.preventDefault();
                      void send();
                    }}
                    placeholder={`Diga algo para ${god?.name ?? 'o orquestrador'}. Enter envia, ⌘↵ abre a tela do terminal.`}
                    aria-label={`Diga algo para ${god?.name ?? 'o orquestrador'}`}
                    style={{
                      flex: '1 1 240px', border: 'none', background: 'none', outline: 'none',
                      height: 32, font: 'inherit', color: 'var(--cth-ink-900)', minWidth: 0
                    }}
                  />
                  <IconButton name="attach" title="Anexar arquivos ou pastas" onClick={() => { void attach(); }} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 28 }}>
                    <IconButton name="mic" title="Segure Option para ditar" onClick={() => composerRef.current?.focus()} />
                    <span style={{ fontSize: 10.5, lineHeight: '16px', color: 'var(--cth-ink-500)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      Segure Option
                    </span>
                  </span>
                  <Button variant="primary" onClick={() => { void send(); }} disabled={!composer.trim() || sending}>
                    <ProIcon name="send" size={14} />
                    {sending ? 'Enviando…' : 'Enviar'}
                  </Button>
                </div>
                {composerNote && <div style={{ padding: '6px 4px 0', ...muted }}>{composerNote}</div>}
              </div>

              {/* Agent grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                {filtered.filter((a) => !a.isGod && !a.isAssistant).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onOpenAgent(a.id)}
                    style={{
                      ...panel,
                      aspectRatio: '1 / 1',
                      padding: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      textAlign: 'start',
                      cursor: 'pointer',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <SpritePortrait character={a.character} scale={1} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                        <div style={{ ...muted, fontSize: 10.5 }}>{STATUS_PT[a.status] ?? a.status}</div>
                      </div>
                      <span style={{ flex: 1 }} />
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_DOT[a.status] ?? 'var(--cth-ink-500)', flexShrink: 0 }} />
                    </div>
                    <div style={{ ...body, fontSize: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {a.description || 'sem descrição'}
                    </div>
                    <span style={{ flex: 1 }} />
                    <div style={{ ...muted, fontSize: 10.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {agentEngine(a, status)}
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAddAgentOpen(true)}
                  style={{
                    ...panel,
                    aspectRatio: '1 / 1',
                    padding: 14,
                    border: '1px dashed var(--cth-ink-300)',
                    background: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    color: 'var(--cth-ink-500)',
                    cursor: 'pointer',
                    font: 'inherit',
                    fontSize: 13
                  }}
                >
                  <ProIcon name="plus" size={18} />
                  Adicionar agente
                </button>
              </div>
            </div>
          )}

          {section === 'tasks' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
              {(['todo', 'doing', 'blocked', 'done'] as const).map((col) => (
                <div key={col} style={{ ...panel, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={label}>{col === 'todo' ? 'Pendentes' : col === 'doing' ? 'Em andamento' : col === 'blocked' ? 'Bloqueadas' : 'Concluídas'}</span>
                    <span style={{ ...muted, fontSize: 11 }}>{tasks.filter((t) => t.status === col).length}</span>
                  </div>
                  {tasks.filter((t) => t.status === col).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => openTaskDetail(t.id)}
                      style={{
                        ...inner, padding: '8px 10px', textAlign: 'left', cursor: 'pointer',
                        color: 'inherit', font: 'inherit', display: 'flex', flexDirection: 'column', gap: 3
                      }}
                    >
                      <span style={{ fontSize: 12, lineHeight: '16px', color: 'var(--cth-ink-900)' }}>{t.title}</span>
                      <span style={{ ...muted, fontSize: 10.5 }}>
                        {t.assignee ? (agents.find((a) => a.id === t.assignee)?.name ?? t.assignee) : 'sem responsável'}
                        {waitsOnHuman(t) ? ' · aguardando você' : ''}
                      </span>
                    </button>
                  ))}
                  {tasks.filter((t) => t.status === col).length === 0 && <div style={{ ...muted, fontSize: 11 }}>Nenhuma tarefa.</div>}
                </div>
              ))}
            </div>
          )}

          {section === 'inbox' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {waiting.length === 0 && (
                <div style={{ ...panel, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Nada exige você agora.</div>
                  <div style={muted}>Quando a equipe bloquear uma tarefa esperando sua resposta, ela aparece aqui.</div>
                </div>
              )}
              {waiting.map((task) => {
                const q = openQuestion(task);
                if (!q) return null;
                return (
                  <div key={task.id} style={{ ...panel, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{task.title}</span>
                      <button type="button" onClick={() => openTaskDetail(task.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--cth-ink-500)', fontSize: 12 }}>
                        abrir tarefa
                      </button>
                    </div>
                    <div style={body}>{q.q}</div>
                    <textarea
                      value={answers[task.id] ?? ''}
                      onChange={(e) => setAnswers((s) => ({ ...s, [task.id]: e.target.value }))}
                      placeholder="Sua resposta — ou “concluído”, com o resultado…"
                      rows={3}
                      style={{
                        ...inner, width: '100%', resize: 'vertical', padding: '8px 10px',
                        fontFamily: 'inherit', fontSize: 13, color: 'var(--cth-ink-900)', outline: 'none'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={muted}>Enviada ao orquestrador e registrada no cartão.</span>
                      <Button variant="primary" onClick={() => { void answer(task); }} disabled={!answers[task.id]?.trim()}>
                        Responder e desbloquear
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {section === 'automations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(config.missions ?? []).map((m) => (
                <div key={m.id} style={{ ...panel, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{missionLabel(m.id, m.label)}</div>
                    <div style={muted}>
                      {m.kind === 'heartbeat'
                        ? 'Observa o escritório e reengaja agentes parados quando o time fica quieto.'
                        : m.kind === 'compact'
                          ? 'Compacta o contexto dos agentes em intervalos seguros.'
                          : 'Revisa o time, o quadro de tarefas e o andamento do trabalho.'}
                      {' · '}{m.enabled ? 'ativa' : 'desativada'}
                    </div>
                  </div>
                  <Button variant={m.enabled ? 'secondary' : 'primary'} onClick={() => { void toggleMission(m.id); }}>
                    {m.enabled ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              ))}
              {(config.missions ?? []).length === 0 && <div style={{ ...panel, padding: 16 }}><div style={muted}>Nenhuma automação configurada.</div></div>}
              <div style={{ ...muted, paddingLeft: 2 }}>Agendamentos, webhooks e gatilhos avançados ficam em Configurações → Conexões.</div>
            </div>
          )}

          {section === 'memory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ ...panel, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={label}>MEMÓRIA SEMÂNTICA</span>
                <div style={body}>
                  {memory?.available
                    ? memory.enabled
                      ? `Ativa${memory.initialized ? ' e pronta' : ' — preparando o índice'}${memory.model ? ` · ${memory.model}` : ''}`
                      : 'Instalada, mas desligada.'
                    : 'Não instalada nesta máquina.'}
                </div>
                <div style={muted}>A memória é compartilhada entre os agentes e sobrevive a reinícios.</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" onClick={onOpenSettings}>Gerenciar memória</Button>
                  <Button variant="ghost" onClick={() => { void refresh(); }}>Atualizar</Button>
                </div>
              </div>
              <div style={{ ...panel, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={label}>BUSCAR NA MEMÓRIA</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={memoryQuery}
                    onChange={(e) => setMemoryQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void runMemorySearch(); } }}
                    placeholder="O que você quer lembrar?"
                    style={{ ...inner, flex: 1, padding: '8px 10px', fontFamily: 'inherit', fontSize: 13, color: 'var(--cth-ink-900)', outline: 'none' }}
                  />
                  <Button variant="primary" onClick={() => { void runMemorySearch(); }} disabled={memoryBusy || !memoryQuery.trim()}>
                    {memoryBusy ? 'Buscando…' : 'Buscar'}
                  </Button>
                </div>
                {memoryResult && (
                  <pre style={{
                    margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--cth-font-mono)', fontSize: 12,
                    color: 'var(--cth-ink-900)', background: 'var(--cth-cream-100)', padding: 10,
                    border: '1px solid var(--cth-ink-300)', borderRadius: 8, maxHeight: 320, overflow: 'auto'
                  }}>{memoryResult}</pre>
                )}
              </div>
            </div>
          )}

          {section === 'capabilities' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ ...panel, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={label}>CAPACIDADES E MCPs</span>
                <div style={body}>{enabledMcp} servidor(es) MCP habilitado(s) para novos agentes.</div>
                <div style={muted}>Cada agente recebe apenas as capacidades consentidas.</div>
                <div><Button variant="secondary" onClick={onOpenSettings}>Gerenciar capacidades</Button></div>
              </div>
              <div style={{ ...panel, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={label}>FERRAMENTAS DO AMBIENTE</span>
                {tools.length === 0 && <div style={muted}>Nenhuma ferramenta reportada.</div>}
                {tools.map((t) => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '5px 0', borderBottom: '1px solid var(--cth-ink-100)' }}>
                    <span style={{ fontSize: 12, color: 'var(--cth-ink-900)' }}>{t.label}</span>
                    <span style={{ ...muted, fontSize: 11 }}>{t.found ? (t.detail ? `disponível · ${t.detail}` : 'disponível') : 'ausente'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'integrations' && <IntegrationsRegistry />}

          {section === 'stapler' && (
            <div style={{ ...panel, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={label}>GRAMPEADOR</span>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Ditado e notas de reunião com transcrição local.</div>
              <div style={muted}>
                O Grampeador flutua sobre os aplicativos: dita texto em qualquer campo e transcreve reuniões sem enviar o áudio para fora da máquina.
              </div>
              <div><Button variant="secondary" onClick={onOpenSettings}>Configurar voz e ditado</Button></div>
            </div>
          )}

          {section === 'temps' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ ...panel, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={label}>SUBAGENTES / TEMPORÁRIOS</span>
                <div style={body}>
                  {activeSubs} ativo(s){limit === null ? ' · sem teto de plano' : ` de ${limit} permitidos pelo plano`}.
                </div>
                <div style={{ height: 8, borderRadius: 999, background: 'var(--cth-cream-200)', overflow: 'hidden' }}>
                  <div style={{ width: `${limit === null ? 0 : Math.min(100, percent)}%`, height: '100%', background: quotaColor(status), transition: 'width 200ms ease' }} />
                </div>
              </div>
              {nonGod.map((a) => (
                <div key={a.id} style={{ ...panel, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <SpritePortrait character={a.character} scale={1} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                    <div style={muted}>{a.archived ? 'arquivado' : STATUS_PT[a.status] ?? a.status} · {a.description || 'sem descrição'}</div>
                  </div>
                  <Button variant="secondary" onClick={() => onOpenAgent(a.id)}>Abrir</Button>
                </div>
              ))}
              {nonGod.length === 0 && <div style={{ ...panel, padding: 16 }}><div style={muted}>Nenhum subagente ativo.</div></div>}
            </div>
          )}

          {section === 'you' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ ...panel, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={label}>VOCÊ</span>
                <div style={body}>Operador do escritório · {config.harnessHome ?? 'nenhuma pasta escolhida'}</div>
                <div style={muted}>Munder Difflin v{typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '—'} · interface PT-BR</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button variant="secondary" onClick={onOpenSettings}>Preferências</Button>
                  <Button variant="ghost" onClick={onClassic}>Voltar ao Clássico</Button>
                </div>
              </div>
              <div style={{ ...panel, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={label}>CONTA E ASSINATURA</span>
                <div style={body}>{status?.profileLabel ?? 'Nenhum provedor conectado'}</div>
                <div style={muted}>{status?.planLabel ?? 'Sem plano'} · {status?.priceLabel ?? '—'} · {status?.providerModel ?? '—'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 8, borderRadius: 999, background: 'var(--cth-cream-200)', overflow: 'hidden' }}>
                    <div style={{ width: `${limit === null ? 0 : Math.min(100, percent)}%`, height: '100%', background: quotaColor(status) }} />
                  </div>
                  <span style={{ ...muted, fontSize: 11 }}>{activeSubs}/{limit ?? '∞'} subagentes</span>
                </div>
                <div><Button variant="primary" onClick={onOpenSettings}>Gerenciar assinatura</Button></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}