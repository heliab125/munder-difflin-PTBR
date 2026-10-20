/**
 * Catálogo de provedores e planos de assinatura de primeira classe.
 *
 * O Munder Difflin nasceu em torno do Claude Code e de chaves BYOK genéricas
 * compatíveis com OpenAI. Este catálogo adiciona o ecossistema real de planos de
 * tokens (Alibaba Model Studio / DashScope, BytePlus Ark, Z.ai, DeepSeek, OpenCode)
 * e é a ÚNICA fonte de verdade para:
 *   - URL base padrão e modelos recomendados de cada provedor;
 *   - nome do backend usado no cofre de segredos (`apikey:<backend>`);
 *   - tabela de planos e o teto de subagentes simultâneos de cada plano.
 *
 * O limite de subagentes é aplicado no processo principal (ver
 * `subagentLimitFor` + `isSubagentSpawnBlocked` e o uso em `spawnAgentCore`),
 * nunca apenas na interface. O renderer lê o mesmo catálogo para exibir o
 * medidor de quota, então UI e backend jamais divergem.
 *
 * Módulo compartilhado entre main e renderer: sem dependências de Electron, sem
 * acesso a disco e sem segredos. Apenas dados + funções puras.
 */

export type ProviderProfileId =
  | 'alibaba'
  | 'opencode'
  | 'byteplus'
  | 'zai'
  | 'deepseek'
  | 'openai'
  | 'anthropic'
  | 'custom';

export type SubscriptionBilling = 'mensal' | 'anual' | 'gratuito' | 'pago-por-uso' | 'sob-consulta';

export interface SubscriptionPlan {
  /** Identificador estável persistido em HarnessConfig.providerPlanId. */
  id: string;
  /** Rótulo curto exibido na UI. */
  label: string;
  /** Preço mensal em dólares; null quando o provedor não publica um valor fixo. */
  priceUsd: number | null;
  billing: SubscriptionBilling;
  /** Teto de subagentes SIMULTÂNEOS. null = ilimitado. */
  subagentLimit: number | null;
  /** Plano sugerido na configuração inicial. */
  recommended?: boolean;
  /** Observação exibida abaixo do plano. */
  note?: string;
}

export interface ProviderProfile {
  id: ProviderProfileId;
  label: string;
  shortLabel: string;
  description: string;
  /** Como a chave é enviada no header de autorização. */
  authStyle: 'bearer' | 'x-api-key' | 'none';
  /** URL base compatível com OpenAI (ou endpoint nativo da Anthropic). */
  defaultBaseUrl: string;
  /** Modelos recomendados, em ordem de exibição. */
  models: string[];
  /** Backend do cofre de segredos (`apikey:<backend>`). */
  backend: string;
  /** Variável de ambiente injetada no processo do agente. */
  envKey: string;
  docsUrl: string;
  /** Como o provedor é consumido pelo harness. */
  kind: 'token-plan' | 'coding-plan' | 'api' | 'cli' | 'custom';
  plans: SubscriptionPlan[];
}

const ALIBABA_PLANS: SubscriptionPlan[] = [
  {
    id: 'lite',
    label: 'Lite / Starter',
    priceUsd: 9,
    billing: 'mensal',
    subagentLimit: 2,
    note: 'Indicado para uso individual e testes.'
  },
  {
    id: 'standard',
    label: 'Standard',
    priceUsd: 18,
    billing: 'mensal',
    subagentLimit: 4,
    recommended: true,
    note: 'Plano padrão do Alibaba AI Token Plan.'
  },
  {
    id: 'pro',
    label: 'Pro / Plus',
    priceUsd: 36,
    billing: 'mensal',
    subagentLimit: 8,
    note: 'Para equipes e cargas maiores de subagentes.'
  },
  {
    id: 'custom',
    label: 'Personalizado',
    priceUsd: null,
    billing: 'sob-consulta',
    subagentLimit: null,
    note: 'Use o limite personalizado nas configurações.'
  }
];

const EQUIVALENT_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    label: 'Starter',
    priceUsd: null,
    billing: 'sob-consulta',
    subagentLimit: 2
  },
  {
    id: 'standard',
    label: 'Standard',
    priceUsd: null,
    billing: 'sob-consulta',
    subagentLimit: 4,
    recommended: true
  },
  {
    id: 'pro',
    label: 'Pro',
    priceUsd: null,
    billing: 'sob-consulta',
    subagentLimit: 8
  },
  {
    id: 'custom',
    label: 'Personalizado',
    priceUsd: null,
    billing: 'sob-consulta',
    subagentLimit: null,
    note: 'Use o limite personalizado nas configurações.'
  }
];

const API_PLANS: SubscriptionPlan[] = [
  {
    id: 'payg',
    label: 'Pago por uso',
    priceUsd: null,
    billing: 'pago-por-uso',
    subagentLimit: null,
    recommended: true,
    note: 'Sem teto de subagentes; o custo segue o consumo da API.'
  },
  {
    id: 'custom',
    label: 'Limite personalizado',
    priceUsd: null,
    billing: 'sob-consulta',
    subagentLimit: null
  }
];

export const PROVIDER_PROFILES: ProviderProfile[] = [
  {
    id: 'alibaba',
    label: 'Alibaba AI Token Plan',
    shortLabel: 'Alibaba',
    description:
      'Alibaba Cloud Model Studio (DashScope) — endpoint compatível com OpenAI, com planos mensais de tokens.',
    authStyle: 'bearer',
    defaultBaseUrl: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
    models: [
      'qwen-max',
      'qwen-plus',
      'qwen-coder-plus',
      'deepseek-v3',
      'deepseek-4.1-flash',
      'glm-4.5'
    ],
    backend: 'alibaba',
    envKey: 'DASHSCOPE_API_KEY',
    docsUrl: 'https://www.alibabacloud.com/help/en/model-studio/',
    kind: 'token-plan',
    plans: ALIBABA_PLANS
  },
  {
    id: 'opencode',
    label: 'OpenCode Nativo',
    shortLabel: 'OpenCode',
    description:
      'Detecta a CLI OpenCode instalada e sincroniza provedores, modelos e MCPs a partir da configuração local.',
    authStyle: 'none',
    defaultBaseUrl: '',
    models: ['opencode/grok-code', 'opencode/claude-sonnet-4', 'opencode/gpt-5'],
    backend: 'opencode',
    envKey: 'OPENCODE_API_KEY',
    docsUrl: 'https://opencode.ai/docs/',
    kind: 'cli',
    plans: [
      {
        id: 'community',
        label: 'Community',
        priceUsd: 0,
        billing: 'gratuito',
        subagentLimit: null,
        recommended: true
      },
      {
        id: 'pro',
        label: 'Pro',
        priceUsd: null,
        billing: 'sob-consulta',
        subagentLimit: 8
      },
      {
        id: 'custom',
        label: 'Personalizado',
        priceUsd: null,
        billing: 'sob-consulta',
        subagentLimit: null
      }
    ]
  },
  {
    id: 'byteplus',
    label: 'BytePlus Coding Plan (Ark)',
    shortLabel: 'BytePlus',
    description: 'BytePlus ModelArk — endpoints compatíveis com OpenAI para modelos DeepSeek, Seed e Kimi.',
    authStyle: 'bearer',
    defaultBaseUrl: 'https://ark.ap-southeast.bytepluses.com/api/v3',
    models: ['deepseek-v3-1-250821', 'seed-1-6-250615', 'kimi-k2-250711'],
    backend: 'byteplus',
    envKey: 'ARK_API_KEY',
    docsUrl: 'https://docs.byteplus.com/en/docs/ModelArk/',
    kind: 'coding-plan',
    plans: EQUIVALENT_PLANS
  },
  {
    id: 'zai',
    label: 'Z.ai (GLM Coding Plan)',
    shortLabel: 'Z.ai',
    description: 'Z.ai — família GLM com endpoint compatível com OpenAI e plano de codificação.',
    authStyle: 'bearer',
    defaultBaseUrl: 'https://api.z.ai/api/paas/v4',
    models: ['glm-4.6', 'glm-4.5', 'glm-4.5-air'],
    backend: 'zai',
    envKey: 'ZAI_API_KEY',
    docsUrl: 'https://docs.z.ai/',
    kind: 'coding-plan',
    plans: EQUIVALENT_PLANS
  },
  {
    id: 'deepseek',
    label: 'DeepSeek API Direta',
    shortLabel: 'DeepSeek',
    description: 'API oficial da DeepSeek, compatível com OpenAI.',
    authStyle: 'bearer',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-v4.1-flash'],
    backend: 'deepseek',
    envKey: 'DEEPSEEK_API_KEY',
    docsUrl: 'https://api-docs.deepseek.com/',
    kind: 'api',
    plans: API_PLANS
  },
  {
    id: 'openai',
    label: 'OpenAI',
    shortLabel: 'OpenAI',
    description: 'API oficial da OpenAI.',
    authStyle: 'bearer',
    defaultBaseUrl: 'https://api.openai.com/v1',
    models: ['gpt-5', 'gpt-4.1', 'o3'],
    backend: 'openai',
    envKey: 'OPENAI_API_KEY',
    docsUrl: 'https://platform.openai.com/docs/',
    kind: 'api',
    plans: API_PLANS
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    shortLabel: 'Anthropic',
    description: 'API oficial da Anthropic (Claude).',
    authStyle: 'x-api-key',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-opus-4-8', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
    backend: 'anthropic',
    envKey: 'ANTHROPIC_API_KEY',
    docsUrl: 'https://docs.anthropic.com/',
    kind: 'api',
    plans: API_PLANS
  },
  {
    id: 'custom',
    label: 'Personalizado (OpenAI-compatível)',
    shortLabel: 'Personalizado',
    description: 'Qualquer endpoint compatível com OpenAI: Ollama, LM Studio, vLLM ou gateway próprio.',
    authStyle: 'bearer',
    defaultBaseUrl: 'http://localhost:11434/v1',
    models: ['local'],
    backend: 'custom',
    envKey: 'OPENAI_API_KEY',
    docsUrl: 'https://platform.openai.com/docs/api-reference',
    kind: 'custom',
    plans: API_PLANS
  }
];

const BY_ID = new Map<string, ProviderProfile>(PROVIDER_PROFILES.map((p) => [p.id, p]));

export function isProviderProfileId(value: unknown): value is ProviderProfileId {
  return typeof value === 'string' && BY_ID.has(value);
}

export function providerProfile(id: string | null | undefined): ProviderProfile | undefined {
  return id ? BY_ID.get(id) : undefined;
}

export function providerPlan(
  profileId: string | null | undefined,
  planId: string | null | undefined
): SubscriptionPlan | undefined {
  const profile = providerProfile(profileId);
  if (!profile) return undefined;
  return profile.plans.find((p) => p.id === planId) ?? profile.plans.find((p) => p.recommended) ?? profile.plans[0];
}

/** Normaliza um limite digitado pelo usuário: inteiro entre 0 e 100; null = inválido. */
export function normalizeSubagentLimit(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const n = Math.trunc(value);
  if (n < 0 || n > 100) return null;
  return n;
}

/**
 * Teto efetivo de subagentes simultâneos.
 *
 * - Sem provedor/plano configurado: ilimitado (null). O app continua utilizável
 *   antes de o usuário conectar uma assinatura.
 * - Plano `custom` (ou perfil sem plano): usa `customLimit` quando válido.
 * - Qualquer outro plano: o teto da tabela do catálogo.
 *
 * O orquestrador NUNCA entra nessa conta — o limite vale para subagentes.
 */
export function subagentLimitFor(
  profileId: string | null | undefined,
  planId: string | null | undefined,
  customLimit?: number | null
): number | null {
  const normalizedCustom = normalizeSubagentLimit(customLimit);
  if (!profileId) return normalizedCustom;
  const profile = providerProfile(profileId);
  if (!profile) return normalizedCustom;
  const plan = providerPlan(profileId, planId);
  if (!plan || plan.id === 'custom') {
    return normalizedCustom ?? plan?.subagentLimit ?? null;
  }
  return plan.subagentLimit;
}

/** Texto PT-BR do preço de um plano (nunca inventa valor ausente). */
export function planPriceLabel(plan: SubscriptionPlan | undefined): string {
  if (!plan) return 'Plano não definido';
  if (plan.billing === 'gratuito') return 'Gratuito';
  if (plan.priceUsd === null) {
    if (plan.billing === 'pago-por-uso') return 'Pago por uso';
    if (plan.billing === 'sob-consulta') return 'Sob consulta';
    return 'Preço não informado';
  }
  return `US$ ${plan.priceUsd}/mês`;
}

/** Descrição curta do teto, para badges e tooltips. */
export function subagentLimitLabel(limit: number | null): string {
  if (limit === null) return 'subagentes ilimitados';
  if (limit === 0) return 'nenhum subagente permitido';
  if (limit === 1) return '1 subagente simultâneo';
  return `${limit} subagentes simultâneos`;
}