import { useEffect, useState } from 'react';
import type { SubscriptionStatus } from '@shared/subscription';

/**
 * Selo compacto de assinatura na barra de título.
 *
 * Fica visível nos dois modos (Clássico e PRO) para que provedor, plano e quota
 * de subagentes estejam sempre a um olhar de distância. Lê o status do processo
 * principal (sem segredos) e atualiza a cada 10s. Clicar abre Configurações →
 * Agentes e Modelos, onde o provedor/plano são editados.
 */
export function SubscriptionBadge({ onOpen }: { onOpen: () => void }) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const next = await window.cth.subscriptionStatus();
        if (alive) setStatus(next);
      } catch { /* mantém o último bom */ }
    };
    void load();
    const timer = setInterval(() => { void load(); }, 10_000);
    return () => { alive = false; clearInterval(timer); };
  }, []);

  const limit = status?.limit ?? null;
  const active = status?.active ?? 0;
  const state = status?.quota.state ?? 'unlimited';
  const color =
    state === 'full' ? 'var(--cth-coral)'
      : state === 'warning' ? 'var(--cth-lemon)'
        : state === 'ok' ? 'var(--cth-mint)'
          : 'var(--cth-ink-300)';
  const label = status?.configured
    ? `${status.profileLabel.split(' (')[0]} · ${status.planLabel} · ${active}/${limit ?? '∞'} subagentes`
    : 'Provedor não configurado';

  return (
    <button
      className="cth-titlebar-nodrag cth-tip"
      onClick={onOpen}
      data-tip={
        status?.configured
          ? `${status.providerModel} · ${status.priceLabel}. Clique para gerenciar a assinatura.`
          : 'Conecte um provedor e um plano. Clique para configurar.'
      }
      aria-label="Gerenciar assinatura e provedor"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 24,
        maxWidth: 320,
        padding: '0 8px',
        border: 'none',
        cursor: 'pointer',
        background: 'var(--cth-paper-100)',
        boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)',
        fontFamily: 'var(--cth-font-ui)',
        fontSize: 11,
        color: 'var(--cth-ink-700)',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{
        width: 8, height: 8, flexShrink: 0,
        background: color,
        boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)'
      }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </button>
  );
}