import { useEffect, useState } from 'react';
import { useStore, selectedAgent } from '@/store/store';
import { startMockLoop, stopMockLoop } from '@/store/mockEvents';
import type { HarnessConfig } from '@/store/config';
import { MODEL_CATALOG_EVENT, setDynamicModelsForProvider } from '@/store/config';
import { DEFAULT_ORG_TRIGGER } from '@shared/triggers';
import { OfficeFloor } from '@/scene/office/OfficeFloor';
import { useHive } from '@/hooks/useHive';
import { useResolvedGodName } from '@/hooks/useResolvedGodName';
import { useGodNameSync } from '@/i18n/useGodNameSync';
import { useDirectionSync } from '@/i18n/useDirection';
import { useArabicTerminalSync } from '@/terminal/useArabicTerminalSync';
import { MemoryPanel } from '@/components/MemoryPanel';
import { AgentDetailPanel } from '@/components/AgentDetailPanel';
import { AgentStrip } from '@/components/AgentStrip';
import { AddAgentModal } from '@/components/AddAgentModal';
import { MichaelBooting } from '@/components/MichaelBooting';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { HivePicker } from '@/components/HivePicker';
import { QuitWarningModal, type ClosingTimeState } from '@/components/QuitWarningModal';
import { CompletionToast } from '@/realtime/CompletionToast';
import { UpdateToast } from '@/components/UpdateToast';
import { UpdateBadge } from '@/components/UpdateBadge';
import { useAppTheme, toggleAppTheme } from '@/design/theme';
import { SettingsModal, type Section as SettingsSection } from '@/components/SettingsModal';
import { PixelPanel } from '@/components/PixelPanel';
import { PixelButton } from '@/components/PixelButton';
import { Icon } from '@/components/Icon';
import { SidebarSplitter } from '@/components/SidebarSplitter';
import { acquireTerminal, notifyThemeChangeAll } from '@/components/terminalPool';
import { FullscreenTerminal } from '@/components/FullscreenTerminal';
import { TaskDetailOverlay } from '@/components/TaskDetailOverlay';
import { IdePanel } from '@/ide/IdePanel';
import { ProDashboard } from '@/components/ProDashboard';
import { ProIcon } from '@/components/ProIcon';
import { useHoldOptionToTalk } from '@/freeflow/holdOption';

// Injected at build time from package.json (see electron.vite.config.ts).
declare const __APP_VERSION__: string;

export function App() {
  // Point every {{godName}} string at the orchestrator's real, renameable name.
  useGodNameSync();
  // Mirror the document only for a user who has picked an RTL app language.
  useDirectionSync();
  // Let terminals that are ALREADY open follow a language switch too.
  useArabicTerminalSync();
  const agent = useStore(selectedAgent);
  const agents = useStore(s => s.agents);
  const agentCount = agents.length;
  const bootingGodName = useResolvedGodName();
  const addAgentOpen = useStore(s => s.addAgentOpen);
  const setAddAgentOpen = useStore(s => s.setAddAgentOpen);
  const clearPendingHires = useStore(s => s.clearPendingHires);
  const godStatus = useStore(s => s.godStatus);
  const fullscreenAgentId = useStore(s => s.fullscreenAgentId);
  const appThemeNow = useAppTheme();
  const sidebarWidth = useStore(s => s.sidebarWidth);
  const setSidebarWidth = useStore(s => s.setSidebarWidth);
  const ideOpen = useStore(s => s.ideOpen);
  const setIdeOpen = useStore(s => s.setIdeOpen);

  const [config, setConfig] = useState<HarnessConfig | null>(null);
  // Modo de interface: Clássico (escritório 2D) ou PRO (painel executivo).
  // A escolha é local a esta máquina e sobrevive a reinícios.
  const [uiMode, setUiMode] = useState<'classic' | 'pro'>(() => {
    try { return window.localStorage.getItem('cth.mode') === 'pro' ? 'pro' : 'classic'; } catch { return 'classic'; }
  });
  const setMode = (next: 'classic' | 'pro') => {
    setUiMode(next);
    try { window.localStorage.setItem('cth.mode', next); } catch { /* best-effort */ }
  };
  // OpenCode's own model list is runtime data, not a baked catalog. Load it
  // once, refresh on the same 5-minute cache the detector uses, and bump a
  // counter so every open picker re-reads modelsForProvider(). The event also
  // carries remote catalog refreshes.
  const [, bumpModelCatalog] = useState(0);
  useEffect(() => {
    const bump = () => bumpModelCatalog((v) => v + 1);
    window.addEventListener(MODEL_CATALOG_EVENT, bump);
    let alive = true;
    const load = async () => {
      try {
        const d = await window.cth.opencodeStatus();
        if (alive && d.models.length > 0) setDynamicModelsForProvider('opencode', d.models);
      } catch { /* detection is best-effort; the static catalog stays */ }
    };
    void load();
    const timer = setInterval(() => { void load(); }, 5 * 60_000);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener(MODEL_CATALOG_EVENT, bump);
    };
  }, []);
  // Whether the user has passed the launch-time hive picker this session. Starts
  // true (skip the picker) right after a hive SWITCH — changeHome relaunches and
  // leaves a one-shot localStorage flag so we don't bounce back onto the picker for
  // the hive we just chose. Also set true on onboarding completion (below).
  const [hiveOpened, setHiveOpened] = useState<boolean>(() => {
    try {
      if (window.localStorage.getItem('cth.skipHivePickerOnce')) {
        window.localStorage.removeItem('cth.skipHivePickerOnce');
        return true;
      }
    } catch { /* localStorage unavailable — show the picker */ }
    return false;
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  /** Which tab Settings opens on. Set by a `cth:open-settings` deep link, reset
   *  to undefined (→ General) whenever the modal is opened the normal way. */
  const [settingsSection, setSettingsSection] = useState<SettingsSection | undefined>(undefined);
  const [quitWarn, setQuitWarn] = useState<{ ptyCount: number } | null>(null);
  const [closing, setClosing] = useState<ClosingTimeState | null>(null);
  const [vpWidth, setVpWidth] = useState<number>(window.innerWidth);

  // Deep link into Settings from anywhere in the tree. Settings' open state is
  // local to App, so a nested control (e.g. "set it now" beside a disabled Talk
  // button) has no path to it without threading a prop through every layer
  // between; a window event keeps that plumbing out of the components in
  // between, matching the existing `cth:` CustomEvent convention.
  useEffect(() => {
    const onOpenSettings = (e: Event): void => {
      const section = (e as CustomEvent<{ section?: SettingsSection }>).detail?.section;
      setSettingsSection(section);
      setSettingsOpen(true);
    };
    window.addEventListener('cth:open-settings', onOpenSettings);
    return () => window.removeEventListener('cth:open-settings', onOpenSettings);
  }, []);

  // Initial config load
  useEffect(() => {
    let cancelled = false;
    window.cth.getConfig().then(c => {
      if (cancelled) return;
      setConfig(c);
      // Mirror the Free Flow flag into the store so the composer mic button shows
      // only when enabled (Settings keeps this in sync on save).
      useStore.getState().setFreeflowEnabled(!!c.freeflowEnabled);
      // Mirror boolean key-presence ONLY (never the key value) so the composer can
      // show the voice button disabled-with-tooltip when Free Flow is on but no
      // Groq key is set (Settings keeps this in sync on save).
      useStore.getState().setHasGroqKey(!!c.groqApiKey);
      // Mirror the active office theme so OfficeFloor renders it (gated on the
      // tvShowOffices flag; off = always the office). Settings keeps this synced.
      useStore.getState().setOfficeTheme(c.tvShowOffices ? (c.officeTheme ?? 'office') : 'office');
      // Mirror the triggers so Settings → Connections and the Command Center's
      // Triggers tab read one list, not two copies that drift — whichever surface
      // saves calls these same setters and the other repaints. No extra IPC: main
      // deep-fills both fields on every config read (withTriggerDefaults), so
      // getConfig() already serves what listWebhooks()/getOrgTrigger() would.
      // `c` is typed as the PRELOAD's HarnessConfig, which hasn't picked the two
      // fields up yet (another lane's file); the renderer mirror type declares them.
      const withTriggers = c as HarnessConfig;
      useStore.getState().setWebhookTriggers(withTriggers.webhookTriggers ?? []);
      useStore.getState().setOrgTrigger(withTriggers.orgTrigger ?? DEFAULT_ORG_TRIGGER);
    });
    // Mirror BYOK OpenAI key presence (boolean only; the key never leaves main) so the
    // Realtime Michael voice toggle can gate on it. Lives in the secret broker, not
    // config — so fetch it rather than derive from c.
    window.cth.realtimeHasOpenAiKey().then(has => {
      if (!cancelled) useStore.getState().setHasOpenAiKey(has);
    });
    return () => { cancelled = true; };
  }, []);

  // Free Flow entry point B — hold-Option (⌥) to talk. In-renderer push-to-talk
  // for whichever agent the user is viewing; gated on the flag, terminal-safe
  // (solo-hold threshold, aborts on any other key). See freeflow/holdOption.ts.
  useHoldOptionToTalk();

  // Config subscription — the copy loaded above would otherwise go stale the
  // moment anything saves a setting.
  useEffect(() => window.cth.onConfigChanged(setConfig), []);

  // Quit warning subscription
  useEffect(() => window.cth.onCloseRequested((info) => setQuitWarn(info)), []);

  // Shareable hires: a validated manifest arriving via the munderdifflin://
  // deep link (or file import) pre-fills the Add-Agent modal. Never spawns by itself.
  const enqueuePendingHires = useStore(s => s.enqueuePendingHires);
  const closeAddAgentReview = () => {
    clearPendingHires();
    setAddAgentOpen(false);
  };
  useEffect(() => {
    const unsub = window.cth.onHireImport?.((m) => {
      enqueuePendingHires([m]);
      setAddAgentOpen(true);
    });
    // Pull anything that arrived before this subscription existed (cold-start
    // deep links; packaged renderers load too fast for push-on-load).
    void window.cth.drainPendingHires?.().then((queued) => {
      if (queued && queued.length > 0) {
        enqueuePendingHires(queued);
        setAddAgentOpen(true);
      }
    });
    return unsub;
  }, [enqueuePendingHires, setAddAgentOpen]);
  useEffect(() => window.cth.onHireError?.((info) => {
    console.error('[hire] import failed:', info.error);
  }), []);

  // Closing-time progress: drives the quit dialog's "wrapping up" view. The
  // dialog stays up through the whole protocol; on 'complete' the main process
  // tears down and quits by itself moments later.
  useEffect(() => window.cth.onClosingTime?.((ev) => {
    if (ev.phase === 'cancelled') { setClosing(null); return; }
    setClosing({ phase: ev.phase, acked: ev.acked, total: ev.total });
    if (ev.phase === 'started' || ev.phase === 'progress') setQuitWarn((w) => w ?? { ptyCount: 0 });
  }), []);

  const startClosingTime = async () => {
    const res = await window.cth.startClosingTime();
    if (!res.ok) setClosing({ phase: 'error', acked: 0, total: 0, error: res.error });
  };
  const cancelClosingTime = () => {
    void window.cth.cancelClosingTime();
    setClosing(null);
  };

  // The hive: god-agent bootstrap, hook-driven avatars, idle-agent waking. Held
  // off until the user opens a hive in the launch picker (passing null no-ops the
  // hook) so Michael doesn't boot against the current home while the user may be
  // about to switch to a different one.
  useHive(hiveOpened ? config : null);

  // Pre-warm a persistent terminal for every live agent so its output is
  // buffered from spawn. Switching agents then re-attaches an already-rendered
  // terminal instantly (with full history) instead of building a blank one.
  useEffect(() => {
    for (const a of agents) if (a.ptyId) acquireTerminal(a.ptyId);
  }, [agents]);

  // Synthetic demo loop — CAGED (#5B). It must never animate alongside a live
  // hive (it would fire fake envelope handoffs and step seeded agents). Run it
  // only as an explicit showcase (VITE_CTH_DEMO=1 in dev) or on a genuinely
  // empty floor, and stop it the instant the first real PTY agent appears
  // (Michael always spawns, so in normal operation it effectively never runs).
  useEffect(() => {
    if (!config?.onboardingComplete) return;
    const DEMO = import.meta.env.DEV && import.meta.env.VITE_CTH_DEMO === '1';
    const evaluate = () => {
      const hasLive = useStore.getState().agents.some((a) => a.ptyId);
      if (DEMO || !hasLive) startMockLoop();
      else stopMockLoop();
    };
    evaluate();
    const unsub = useStore.subscribe(evaluate);
    return () => { unsub(); stopMockLoop(); };
  }, [config?.onboardingComplete]);

  // Reconcile restored agents against the PTYs still alive in the main process.
  // After a renderer reload (e.g. the laptop slept and Vite reloaded the page),
  // this keeps agents whose process survived and drops any that truly died.
  useEffect(() => {
    if (!config?.onboardingComplete) return;
    let cancelled = false;
    window.cth.listPtys().then((list) => {
      if (cancelled) return;
      useStore.getState().reconcileWithLivePtys(list.map((p) => p.id));
    }).catch(() => { /* ignore — keep restored agents as-is */ });
    return () => { cancelled = true; };
  }, [config?.onboardingComplete]);

  // Re-apply the persisted focus-mode preference as the roster fills in.
  //
  // Not a one-shot at store construction: at launch every restored agent still
  // carries the PREVIOUS session's PTY id, so the reconcile above prunes the lot
  // and correctly drops focus mode to null before god has respawned. The
  // preference therefore has to be re-checked once agents with live terminals
  // actually exist. `restoreFocusMode` is a no-op unless the preference is on and
  // focus mode is currently off, so re-running it on every roster change is safe
  // and pressing Esc stays sticky.
  useEffect(() => {
    if (!config?.onboardingComplete) return;
    useStore.getState().restoreFocusMode();
  }, [config?.onboardingComplete, agents]);

  // Track viewport width for splitter clamping
  useEffect(() => {
    const onResize = () => setVpWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!config) {
    return <div style={{ width: '100vw', height: '100vh', background: 'var(--cth-cream-100)' }} />;
  }

  if (!config.onboardingComplete) {
    // Just-onboarded users go straight into the hive they set up — skip the picker.
    return <OnboardingWizard onComplete={(next) => { setConfig(next); setHiveOpened(true); }} />;
  }

  // Launch-time hive picker: on reopen, let the user open their current hive,
  // switch to a recent one, or open/create another. Skipped right after onboarding
  // and right after a switch-relaunch (see hiveOpened init).
  if (!hiveOpened) {
    return <HivePicker config={config} onOpenCurrent={() => setHiveOpened(true)} />;
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100vw', height: '100vh',
      overflow: 'hidden'
    }}>
      {/* rt-12: global fixed-overlay toast for voice-Michael completions ("Oscar
          finished X"). Self-positions bottom-right; renders null until one arrives. */}
      <CompletionToast />
      {/* v0.3.4: background-update toast ("restart to update"); renders null until
          main's updater pushes a status. */}
      <UpdateToast />
      {/* Title bar */}
      <div
        className="cth-titlebar-drag"
        style={{
          height: 38, minHeight: 38,
          background: 'var(--cth-cream-50)',
          borderBottom: '1px solid var(--cth-ink-300)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 96,
          paddingRight: 12,
          gap: 10,
          userSelect: 'none'
        }}
      >
        {/* 0.5.7 titlebar: version/update chip on the left; theme, settings and
            the Classic/PRO switcher on the right. The logo lives in the PRO
            sidebar now, not in the OS chrome. */}
        <UpdateBadge />
        {uiMode === 'classic' && (
          <span style={{
            fontFamily: 'var(--cth-font-ui)',
            fontSize: 12,
            color: 'var(--cth-ink-500)'
          }}>
            {config.autoMode ? 'modo automático ativado' : 'modo automático desativado'}
          </span>
        )}
        <span style={{ flex: 1 }} />
        <button
          className="cth-titlebar-nodrag cth-tip"
          onClick={() => {
            const next = toggleAppTheme();
            notifyThemeChangeAll(next === 'dark' ? 'dark' : 'light');
            void window.cth.updateConfig({ terminalTheme: next });
          }}
          data-tip={appThemeNow === 'dark' ? 'Tema claro' : 'Tema escuro'}
          aria-label="Alternar modo escuro"
          style={{
            display: 'inline-grid', placeItems: 'center',
            width: 28, height: 28, padding: 0,
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: 7, cursor: 'pointer',
            color: 'var(--cth-ink-500)', fontSize: 14, lineHeight: 1
          }}
        >
          <ProIcon name={appThemeNow === 'dark' ? 'sun' : 'moon'} size={15} />
        </button>
        <button
          className="cth-titlebar-nodrag cth-settings-btn cth-tip"
          onClick={() => { setSettingsSection(undefined); setSettingsOpen(true); }}
          data-tip="Configurações"
          aria-label="Configurações"
          style={{
            display: 'inline-grid', placeItems: 'center',
            width: 28, height: 28, padding: 0,
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: 7, cursor: 'pointer',
            color: 'var(--cth-ink-500)'
          }}
        >
          <ProIcon name="gear" size={15} />
        </button>
        {uiMode === 'classic' && (
          <button
            className="cth-titlebar-nodrag cth-tip"
            onClick={() => {
              if (fullscreenAgentId) { useStore.getState().setFullscreen(null); return; }
              const all = useStore.getState().agents;
              const target = all.find((x) => x.id === useStore.getState().selectedId && x.ptyId)
                ?? all.find((x) => x.isGod && x.ptyId)
                ?? all.find((x) => x.ptyId);
              if (target) useStore.getState().setFullscreen(target.id);
            }}
            data-tip={fullscreenAgentId ? 'Sair do modo foco (Esc)' : 'Modo foco'}
            aria-label="Alternar modo foco"
            style={{
              display: 'inline-grid', placeItems: 'center',
              width: 28, height: 28, padding: 0,
              background: 'transparent',
              border: '1px solid transparent',
              borderRadius: 7, cursor: 'pointer',
              color: 'var(--cth-ink-500)'
            }}
          >
            <ProIcon name={fullscreenAgentId ? 'collapse' : 'expand'} size={15} />
          </button>
        )}
        <div
          className="cth-titlebar-nodrag"
          role="group"
          aria-label="Modo de interface"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            height: 28,
            padding: 2,
            background: 'var(--cth-cream-100)',
            border: '1px solid var(--cth-ink-300)',
            borderRadius: 8
          }}
        >
          {(['classic', 'pro'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setMode(mode)}
              aria-pressed={uiMode === mode}
              style={{
                height: 22,
                padding: '0 9px',
                border: 'none',
                cursor: uiMode === mode ? 'default' : 'pointer',
                borderRadius: 6,
                background: uiMode === mode ? 'var(--cth-accent)' : 'transparent',
                color: uiMode === mode ? 'var(--cth-accent-ink)' : 'var(--cth-ink-500)',
                fontFamily: 'var(--cth-font-ui)',
                fontSize: 11.5,
                fontWeight: uiMode === mode ? 600 : 500,
                letterSpacing: '0.02em'
              }}
            >{mode === 'classic' ? 'Clássico' : 'PRO'}</button>
          ))}
        </div>
      </div>

      {uiMode === 'pro' ? (
        <ProDashboard
          config={config}
          onOpenSettings={() => { setSettingsSection('Agents & Models'); setSettingsOpen(true); }}
          onOpenAgent={(id) => {
            useStore.getState().select(id);
            setMode('classic');
          }}
          onConfigureModel={(id) => {
            useStore.getState().select(id);
            useStore.getState().requestCommandCenterTab('floor');
            setMode('classic');
          }}
          onClassic={() => setMode('classic')}
        />
      ) : (
      <>
      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex',
        padding: 16,
        gap: 0
      }}>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, position: 'relative' }}>
          <OfficeFloor />
          <MemoryPanel />
          {agentCount === 0 && godStatus === 'booting' && <MichaelBooting />}
          {agentCount === 0 && godStatus !== 'booting' && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{ pointerEvents: 'auto', width: 360 }}>
                <PixelPanel variant="dialog" title="ANDAR VAZIO" noPadding>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: '20px' }}>
                      Ainda não há agentes no andar. Contrate um para ver a saída real do Claude em tempo real aqui.
                    </p>
                    <PixelButton variant="primary" size="md" onClick={() => setAddAgentOpen(true)}>
                      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <Icon name="plus" /> adicionar agente
                      </span>
                    </PixelButton>
                  </div>
                </PixelPanel>
              </div>
            </div>
          )}
        </div>

        <SidebarSplitter
          width={sidebarWidth}
          onChange={setSidebarWidth}
          viewportWidth={vpWidth}
        />

        <div style={{
          width: sidebarWidth, flexShrink: 0,
          minHeight: 0, display: 'flex', flexDirection: 'column'
        }}>
          {agent ? (
            <AgentDetailPanel agent={agent} />
          ) : godStatus === 'booting' ? (
            <PixelPanel variant="default" noPadding style={{
              padding: 16, height: '100%',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', gap: 12
            }}>
              <div style={{
                fontFamily: 'var(--cth-font-display)', fontSize: 10, lineHeight: '14px',
                color: 'var(--cth-ink-500)'
              }}>ACORDANDO O ANDAR</div>
              <p style={{ margin: 0, fontSize: 13, textAlign: 'center', color: 'var(--cth-ink-700)' }}>
                {bootingGodName} está batendo o ponto.<br />
                O terminal aparecerá aqui assim que ele se acomodar.
              </p>
            </PixelPanel>
          ) : (
            <PixelPanel variant="default" noPadding style={{
              padding: 16, height: '100%',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', gap: 12
            }}>
              <div style={{
                fontFamily: 'var(--cth-font-display)', fontSize: 10, lineHeight: '14px',
                color: 'var(--cth-ink-500)'
              }}>NENHUM AGENTE SELECIONADO</div>
              <p style={{ margin: 0, fontSize: 13, textAlign: 'center', color: 'var(--cth-ink-700)' }}>
                Contrate um agente na faixa abaixo.<br />
                O terminal e a barra de comandos aparecerão aqui.
              </p>
              <PixelButton variant="secondary" size="md" onClick={() => setAddAgentOpen(true)}>
                <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                  <Icon name="plus" /> adicionar agente
                </span>
              </PixelButton>
            </PixelPanel>
          )}
        </div>
      </div>

      <AgentStrip config={config} />
      </>
      )}

      {addAgentOpen && (
        <AddAgentModal
          onClose={closeAddAgentReview}
          config={config}
          onConfigChange={setConfig}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          config={config}
          initialSection={settingsSection}
          onClose={() => { setSettingsOpen(false); setSettingsSection(undefined); }}
        />
      )}

      {quitWarn && (
        <QuitWarningModal
          ptyCount={quitWarn.ptyCount}
          closing={closing}
          onCancel={() => {
            if (closing) cancelClosingTime();
            window.cth.cancelClose();
            setQuitWarn(null);
          }}
          onConfirm={async () => { await window.cth.confirmClose(); }}
          onClosingTime={startClosingTime}
        />
      )}

      {fullscreenAgentId && <FullscreenTerminal config={config} />}
      {ideOpen && <IdePanel />}
      <TaskDetailOverlay />
    </div>
  );
}
