import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { setDynamicModelsForProvider, type HarnessConfig } from '@/store/config';
import {
  PROVIDER_PROFILES,
  providerProfile,
  providerPlan,
  planPriceLabel,
  subagentLimitLabel
} from '@shared/providerCatalog';
import type { SubscriptionStatus } from '@shared/subscription';
import { PixelButton } from './PixelButton';

/**
 * Painel de assinatura e provedor (Configurações → Agentes e Modelos).
 *
 * Persistência: as escolhas de provedor/plano vão direto pelo canal
 * `subscription:set` (main valida contra o catálogo e reescreve a config). Isso é
 * intencional — o teto de subagentes precisa valer no instante em que o plano
 * muda, sem depender do botão Salvar do modal. Chaves continuam write-only no
 * cofre (`providerKey:*`) e nunca voltam para a interface.
 */

const labelStyle: CSSProperties = {
  fontFamily: 'var(--cth-font-display)',
  fontSize: 8,
  lineHeight: '12px',
  color: 'var(--cth-ink-700)',
  textTransform: 'uppercase'
};
const headStyle: CSSProperties = {
  fontFamily: 'var(--cth-font-display)',
  fontSize: 8,
  lineHeight: '12px',
  color: 'var(--cth-ink-500)',
  textTransform: 'uppercase',
  marginBottom: 2
};
const inputStyle: CSSProperties = {
  width: '100%',
  padding: '6px 8px 4px',
  background: 'var(--cth-paper-100)',
  border: 'none',
  boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
  fontFamily: 'var(--cth-font-ui)',
  fontSize: 13,
  color: 'var(--cth-ink-900)',
  outline: 'none'
};
const rowStyle: CSSProperties = { display: 'flex', gap: 8, alignItems: 'flex-end' };
const hintStyle: CSSProperties = { fontSize: 12, color: 'var(--cth-ink-500)', lineHeight: '17px' };

function statusColor(status: SubscriptionStatus | null): string {
  switch (status?.quota.state) {
    case 'full': return 'var(--cth-red, #b3261e)';
    case 'warning': return 'var(--cth-yellow, #b26a00)';
    case 'ok': return 'var(--cth-green, #1f7a3d)';
    default: return 'var(--cth-ink-300)';
  }
}

export function SubscriptionSettings({ config }: { config: HarnessConfig }) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [profileId, setProfileId] = useState<string>(config.providerProfileId ?? '');
  const [planId, setPlanId] = useState<string>(config.providerPlanId ?? '');
  const [baseUrl, setBaseUrl] = useState<string>(config.providerBaseUrl ?? '');
  const [model, setModel] = useState<string>(config.providerModel ?? '');
  const [customLimit, setCustomLimit] = useState<string>(
    typeof config.customSubagentLimit === 'number' ? String(config.customSubagentLimit) : ''
  );
  const [draftKey, setDraftKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [note, setNote] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const profile = providerProfile(profileId);
  const plan = profile ? providerPlan(profile.id, planId) : undefined;
  const opencodeModels = status?.opencode.models ?? [];
  const isOpenCodeProfile = profile?.id === 'opencode';

  const refresh = useCallback(async () => {
    try {
      const next = await window.cth.subscriptionStatus();
      setStatus(next);
      if (next.profileId) setProfileId((cur) => cur || next.profileId || '');
      if (next.planId) setPlanId((cur) => cur || next.planId || '');
    } catch {
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => { void refresh(); }, 5_000);
    return () => clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    let alive = true;
    if (!profile || profile.authStyle === 'none') { setHasKey(false); return; }
    void window.cth.providerKeyHas(profile.backend).then((v) => { if (alive) setHasKey(v); }).catch(() => { if (alive) setHasKey(false); });
    return () => { alive = false; };
  }, [profile]);

  const save = async (patch: Parameters<typeof window.cth.subscriptionSet>[0]) => {
    setBusy(true);
    setNote('');
    try {
      const res = await window.cth.subscriptionSet(patch);
      if (!res.ok) setNote(res.error ?? 'Não foi possível salvar.');
      else {
        setNote('Configuração salva.');
        if (res.status) setStatus(res.status);
        else await refresh();
      }
    } catch (e) {
      setNote(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const onProfileChange = async (nextId: string) => {
    setProfileId(nextId);
    setNote('');
    if (!nextId) {
      setPlanId('');
      setBaseUrl('');
      setModel('');
      setCustomLimit('');
      await save({ profileId: null });
      return;
    }
    const nextProfile = providerProfile(nextId);
    const recommended = nextProfile?.plans.find((p) => p.recommended) ?? nextProfile?.plans[0];
    const detected = nextId === 'opencode' && opencodeModels.length > 0
      ? (status?.opencode.defaultModel && opencodeModels.includes(status.opencode.defaultModel)
          ? status.opencode.defaultModel
          : opencodeModels[0])
      : nextProfile?.models[0];
    setPlanId(recommended?.id ?? '');
    setBaseUrl('');
    setModel(detected ?? '');
    setCustomLimit('');
    await save({
      profileId: nextId,
      planId: recommended?.id ?? null,
      baseUrl: null,
      model: detected ?? null,
      customSubagentLimit: null
    });
  };

  const refreshAll = async () => {
    setBusy(true);
    try {
      const d = await window.cth.opencodeStatus(true);
      if (d.models.length > 0) setDynamicModelsForProvider('opencode', d.models);
      setStatus(await window.cth.subscriptionStatus());
      setNote(d.found ? `OpenCode: ${d.models.length} modelo(s) detectados.` : 'OpenCode não encontrado no PATH.');
    } catch (e) {
      setNote(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const onPlanChange = async (nextPlan: string) => {
    setPlanId(nextPlan);
    await save({ planId: nextPlan });
  };

  const saveKey = async () => {
    if (!profile || !draftKey.trim()) return;
    setBusy(true);
    try {
      const res = await window.cth.providerKeySet({ backend: profile.backend, key: draftKey.trim() });
      if (res.ok) {
        setHasKey(true);
        setDraftKey('');
        setNote('Chave salva no cofre seguro.');
      } else setNote(res.error ?? 'Falha ao salvar a chave.');
    } catch (e) {
      setNote(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const clearKey = async () => {
    if (!profile) return;
    setBusy(true);
    try {
      await window.cth.providerKeyClear(profile.backend);
      setHasKey(false);
      setNote('Chave removida.');
    } finally {
      setBusy(false);
    }
  };

  const test = async () => {
    setBusy(true);
    setNote('Testando conexão…');
    try {
      const res = await window.cth.providerTest({
        profileId: profileId || undefined,
        baseUrl: baseUrl.trim() || undefined,
        model: model.trim() || undefined
      });
      setNote(res.message);
      if (profile?.kind === 'cli') {
        const d = await window.cth.opencodeStatus();
        if (d.models.length > 0) setDynamicModelsForProvider('opencode', d.models);
      }
      await refresh();
    } catch (e) {
      setNote(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  // Um modelo antigo (opencode/grok-code) não existe na CLI do usuário. Assim
  // que a detecção entrega a lista real, troca pelo padrão da CLI — só quando o
  // valor atual é um dos defaults antigos, nunca um slug que o usuário digitou.
  useEffect(() => {
    if (!isOpenCodeProfile || opencodeModels.length === 0) return;
    const legacy = new Set(['', 'opencode/grok-code', 'opencode/claude-sonnet-4', 'opencode/gpt-5', 'alibaba/qwen-max']);
    if (!legacy.has(model.trim())) return;
    const preferred = status?.opencode.defaultModel && opencodeModels.includes(status.opencode.defaultModel)
      ? status.opencode.defaultModel
      : opencodeModels[0];
    if (!preferred || preferred === model) return;
    setModel(preferred);
    void save({ model: preferred });
  }, [isOpenCodeProfile, opencodeModels, model, status?.opencode.defaultModel]);

  const modelChoices = isOpenCodeProfile && opencodeModels.length > 0 ? opencodeModels : (profile?.models ?? []);
  const quota = status?.quota;
  const percent = quota?.percent ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={headStyle}>Assinatura e provedor</div>
        <div style={{ fontSize: 12, color: 'var(--cth-ink-700)', lineHeight: '18px' }}>
          Conecte um plano de tokens de primeira classe. O teto de subagentes é aplicado no processo
          principal antes de criar o terminal — não é apenas visual.
        </div>
      </div>

      {/* Cartão de quota */}
      <div style={{
        padding: 10,
        background: 'var(--cth-paper-100)',
        boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
        display: 'flex', flexDirection: 'column', gap: 6
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--cth-ink-900)' }}>
            <strong>{status?.profileLabel ?? 'Nenhum provedor conectado'}</strong>
            {status?.configured ? ` · ${status.planLabel} · ${status.priceLabel}` : ''}
          </span>
          <span style={{ fontSize: 12, color: 'var(--cth-ink-700)' }}>
            {status?.configured
              ? quota?.limit === null
                ? `${status.active} subagente(s) · sem teto`
                : `${status.active} de ${quota?.limit} subagentes em uso`
              : 'Sem teto de subagentes'}
          </span>
        </div>
        <div style={{
          height: 8,
          background: 'var(--cth-cream-200)',
          boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${quota?.limit === null ? 0 : percent}%`,
            height: '100%',
            background: statusColor(status),
            transition: 'width 200ms ease, background 200ms ease'
          }} />
        </div>
        <div style={hintStyle}>
          {status?.configured
            ? `${subagentLimitLabel(quota?.limit ?? null)} · ${status.providerModel}`
            : 'Escolha um provedor e um plano abaixo para ativar o controle de concorrência.'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Provedor</label>
          <select
            value={profileId}
            onChange={(e) => { void onProfileChange(e.target.value); }}
            style={inputStyle}
            disabled={busy}
          >
            <option value="">Nenhum (sem limite de subagentes)</option>
            {PROVIDER_PROFILES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Plano de assinatura</label>
          <select
            value={planId}
            onChange={(e) => { void onPlanChange(e.target.value); }}
            style={inputStyle}
            disabled={busy || !profile}
          >
            {!profile && <option value="">—</option>}
            {profile?.plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} · {planPriceLabel(p)} · {subagentLimitLabel(p.subagentLimit)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {profile && (
        <div style={{ fontSize: 12, color: 'var(--cth-ink-700)', lineHeight: '18px' }}>
          {profile.description}{' '}
          <a
            href={profile.docsUrl}
            onClick={(e) => { e.preventDefault(); void window.cth.openExternal(profile.docsUrl); }}
            style={{ color: 'var(--cth-ink-900)', textDecoration: 'underline', cursor: 'pointer' }}
          >Documentação</a>
          {plan ? ` · ${planPriceLabel(plan)}` : ''}
        </div>
      )}

      {plan?.note && <div style={hintStyle}>{plan.note}</div>}

      {profile && profile.kind !== 'cli' && (
        <div style={{
          padding: 8,
          background: 'var(--cth-cream-100)',
          boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
          ...hintStyle
        }}>
          Para usar este endpoint nos agentes, selecione o motor <strong>OpenCode</strong> ao criar ou
          editar o agente. O Munder injeta a URL base, a chave e os modelos do plano automaticamente no
          OpenCode — sem colar segredos no terminal.
        </div>
      )}

      {profile?.kind === 'cli' ? (
        <div style={{
          padding: 10,
          background: 'var(--cth-paper-100)',
          boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
          display: 'flex', flexDirection: 'column', gap: 4
        }}>
          <div style={{ fontSize: 12, color: 'var(--cth-ink-900)' }}>
            <strong>Detecção local do OpenCode</strong>
          </div>
          <div style={hintStyle}>
            {status?.opencode.found
              ? `CLI encontrada${status.opencode.version ? ` · v${status.opencode.version}` : ''}`
              : 'CLI do OpenCode não encontrada no PATH.'}
            {status?.opencode.configReadable
              ? ` · ${status.opencode.providers.length} provedor(es) · ${status.opencode.mcpCount} MCP(s)`
              : ''}
            {status?.opencode.models.length
              ? ` · ${status.opencode.models.length} modelo(s)`
              : ''}
          </div>
          {status?.opencode.binaryPath && (
            <div style={hintStyle}>Binário: {status.opencode.binaryPath}</div>
          )}
          {status?.opencode.configPath && (
            <div style={hintStyle}>Configuração: {status.opencode.configPath}</div>
          )}
          {status?.opencode.providers && status.opencode.providers.length > 0 && (
            <div style={hintStyle}>Provedores: {status.opencode.providers.join(', ')}</div>
          )}
          {status?.opencode.defaultModel && (
            <>
              <div style={hintStyle}>Padrão da CLI OpenCode: {status.opencode.defaultModel}</div>
              <div style={hintStyle}>O agente usa o modelo de “Modelo principal” abaixo; o padrão da CLI só é usado quando o agente está em “CLI default”.</div>
            </>
          )}
          <div style={hintStyle}>
            Nenhuma chave é lida: apenas nomes de provedores, modelos e MCPs.
          </div>
        </div>
      ) : profile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>
            Chave de API ({profile.envKey}) {hasKey ? '· configurada' : ''}
          </label>
          <div style={rowStyle}>
            <input
              type="password"
              autoComplete="off"
              placeholder={hasKey ? 'Chave já armazenada — digite para substituir' : 'Cole a chave do provedor'}
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              style={inputStyle}
            />
            <PixelButton variant="secondary" size="sm" onClick={() => { void saveKey(); }} disabled={busy || !draftKey.trim()}>
              Salvar
            </PixelButton>
            {hasKey && (
              <PixelButton variant="secondary" size="sm" onClick={() => { void clearKey(); }} disabled={busy}>
                Remover
              </PixelButton>
            )}
          </div>
        </div>
      ) : null}

      {profile && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>URL base</label>
            <input
              placeholder={profile.defaultBaseUrl || 'https://…'}
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              onBlur={() => { void save({ baseUrl: baseUrl.trim() || null }); }}
              style={inputStyle}
              disabled={profile.kind === 'cli'}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Modelo principal</label>
            {isOpenCodeProfile && opencodeModels.length > 0 ? (
              <>
                <select
                  value={model}
                  onChange={(e) => {
                    const next = e.target.value;
                    setModel(next);
                    void save({ model: next });
                  }}
                  style={inputStyle}
                >
                  {!opencodeModels.includes(model) && model && (
                    <option value={model}>{model} (não encontrado na CLI)</option>
                  )}
                  {opencodeModels.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <span style={hintStyle}>{opencodeModels.length} modelo(s) lidos da sua CLI OpenCode.</span>
              </>
            ) : (
              <>
                <input
                  list={`provider-models-${profile.id}`}
                  placeholder={modelChoices[0] ?? 'modelo'}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  onBlur={() => { void save({ model: model.trim() || null }); }}
                  style={inputStyle}
                />
                <datalist id={`provider-models-${profile.id}`}>
                  {modelChoices.map((m) => <option key={m} value={m} />)}
                </datalist>
              </>
            )}
          </div>
        </div>
      )}

      {plan?.id === 'custom' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Limite personalizado de subagentes simultâneos</label>
          <div style={rowStyle}>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="Vazio = ilimitado"
              value={customLimit}
              onChange={(e) => setCustomLimit(e.target.value)}
              onBlur={() => {
                const raw = customLimit.trim();
                void save({ customSubagentLimit: raw === '' ? null : Number(raw) });
              }}
              style={{ ...inputStyle, maxWidth: 220 }}
            />
            <span style={hintStyle}>0 bloqueia todos; vazio libera todos.</span>
          </div>
        </div>
      )}

      {profile && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <PixelButton variant="secondary" size="sm" onClick={() => { void test(); }} disabled={busy}>
            Testar conexão
          </PixelButton>
          <PixelButton variant="secondary" size="sm" onClick={() => { void refreshAll(); }} disabled={busy}>
            Atualizar status
          </PixelButton>
          {note && <span style={{ ...hintStyle, color: 'var(--cth-ink-900)' }}>{note}</span>}
        </div>
      )}

      {!profile && note && <div style={hintStyle}>{note}</div>}
    </div>
  );
}