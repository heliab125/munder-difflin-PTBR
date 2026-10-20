/**
 * Motor puro de quota de subagentes.
 *
 * Separado do catálogo para que main, renderer e testes compartilhem exatamente
 * a mesma matemática de "quantos subagentes ainda cabem". Nenhum efeito
 * colateral: recebe o limite efetivo e a contagem ativa, devolve um retrato.
 */

export type QuotaState = 'unlimited' | 'ok' | 'warning' | 'full';

/** Retrato seguro do OpenCode local, sem segredos. */
export interface OpenCodeStatusPayload {
  found: boolean;
  version: string | null;
  configPath: string | null;
  providers: string[];
  defaultModel: string | null;
  mcpCount: number;
  authConfigured: boolean;
  configReadable: boolean;
}

/** Status completo da assinatura exibido na tela inicial e nas configurações. */
export interface SubscriptionStatus {
  /** Existe um provedor/plano configurado? */
  configured: boolean;
  profileId: string | null;
  profileLabel: string;
  planId: string | null;
  planLabel: string;
  /** Preço já formatado em PT-BR (ex.: "US$ 18/mês"). */
  priceLabel: string;
  providerModel: string;
  baseUrl: string;
  /** A chave do backend está presente no cofre (nunca o valor). */
  apiKeyPresent: boolean;
  limit: number | null;
  active: number;
  pending: number;
  quota: QuotaSnapshot;
  connectedAt: number | null;
  /** Presente sempre que a CLI OpenCode for detectável. */
  opencode: OpenCodeStatusPayload;
}

export interface QuotaSnapshot {
  /** Teto efetivo; null = ilimitado. */
  limit: number | null;
  /** Subagentes ativos no momento da leitura (nunca negativo). */
  active: number;
  /** Vagas restantes; null quando ilimitado. */
  remaining: number | null;
  /** Percentual usado (0-100); null quando ilimitado. */
  percent: number | null;
  /** Faixa semântica usada pelas cores e mensagens da UI. */
  state: QuotaState;
  /** Um novo subagente pode ser iniciado agora? */
  canSpawn: boolean;
}

function normalizeCount(value: number | null | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 0;
  return Math.trunc(value);
}

/**
 * Faixa de alerta: o último quarto do plano (mínimo de 1 vaga) fica amarelo.
 * Ex.: limite 4 → 3/4 amarelo, 4/4 vermelho; limite 8 → 6-7/8 amarelo, 8/8 vermelho.
 */
export function quotaSnapshot(limit: number | null, active: number | null | undefined): QuotaSnapshot {
  const used = normalizeCount(active);
  if (limit === null || limit === undefined) {
    return { limit: null, active: used, remaining: null, percent: null, state: 'unlimited', canSpawn: true };
  }
  const cap = normalizeCount(limit);
  const remaining = Math.max(0, cap - used);
  const percent = cap === 0 ? 100 : Math.min(100, Math.round((used / cap) * 100));
  const warningFloor = Math.max(1, Math.floor(cap * 0.25));
  const state: QuotaState =
    remaining === 0 ? 'full' : remaining <= warningFloor ? 'warning' : 'ok';
  return { limit: cap, active: used, remaining, percent, state, canSpawn: remaining > 0 };
}

/** Mensagem de bloqueio exibida na UI e devolvida pelo processo principal. */
export function quotaBlockedMessage(input: {
  providerLabel: string;
  planLabel: string;
  limit: number;
  active: number;
  priceLabel?: string;
}): string {
  const hasConcretePrice = !!input.priceLabel && /US\$|R\$|€|£/.test(input.priceLabel);
  const plan = hasConcretePrice
    ? `${input.providerLabel} — ${input.planLabel} (${input.priceLabel})`
    : `${input.providerLabel} — ${input.planLabel}`;
  return (
    `Limite do plano atingido: sua assinatura ${plan} permite no máximo ` +
    `${input.limit} subagente${input.limit === 1 ? '' : 's'} simultâneo${input.limit === 1 ? '' : 's'} ` +
    `e ${input.active} já estão ativos. Encerre um subagente ou aguarde a conclusão de uma tarefa ` +
    `para liberar uma vaga.`
  );
}