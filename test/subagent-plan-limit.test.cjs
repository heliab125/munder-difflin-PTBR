'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const loadTs = require('./load-ts.cjs');

const catalog = loadTs('src/shared/providerCatalog.ts');
const { quotaSnapshot, quotaBlockedMessage } = loadTs('src/shared/subscription.ts');

const {
  PROVIDER_PROFILES,
  providerProfile,
  providerPlan,
  subagentLimitFor,
  planPriceLabel,
  normalizeSubagentLimit
} = catalog;

test('Alibaba standard ($18/mês) permite 4 subagentes e barra o 5º', () => {
  const limit = subagentLimitFor('alibaba', 'standard');
  assert.equal(limit, 4);

  assert.equal(quotaSnapshot(limit, 4).canSpawn, false);
  assert.equal(quotaSnapshot(limit, 4).state, 'full');
  assert.equal(quotaSnapshot(limit, 5).canSpawn, false);
  assert.equal(quotaSnapshot(limit, 3).canSpawn, true);
  assert.equal(quotaSnapshot(limit, 3).state, 'warning');
});

test('tabela de planos da Alibaba bate com a regra de negócio', () => {
  const lite = providerPlan('alibaba', 'lite');
  const standard = providerPlan('alibaba', 'standard');
  const pro = providerPlan('alibaba', 'pro');
  assert.equal(lite.priceUsd, 9);
  assert.equal(lite.subagentLimit, 2);
  assert.equal(standard.priceUsd, 18);
  assert.equal(standard.subagentLimit, 4);
  assert.equal(pro.priceUsd, 36);
  assert.equal(pro.subagentLimit, 8);
});

test('limite efetivo por provedor/plano', () => {
  assert.equal(subagentLimitFor('alibaba', 'lite'), 2);
  assert.equal(subagentLimitFor('alibaba', 'pro'), 8);
  assert.equal(subagentLimitFor('byteplus', 'starter'), 2);
  assert.equal(subagentLimitFor('byteplus', 'pro'), 8);
  assert.equal(subagentLimitFor('zai', 'standard'), 4);
  assert.equal(subagentLimitFor('deepseek', 'payg'), null);
  assert.equal(subagentLimitFor('openai', 'payg'), null);
  assert.equal(subagentLimitFor('opencode', 'pro'), 8);
});

test('sem provedor configurado não há teto (app continua utilizável)', () => {
  assert.equal(subagentLimitFor(undefined, undefined), null);
  assert.equal(quotaSnapshot(null, 99).canSpawn, true);
  assert.equal(quotaSnapshot(null, 99).state, 'unlimited');
});

test('plano personalizado usa o limite digitado e aceita 0', () => {
  assert.equal(subagentLimitFor('alibaba', 'custom', 6), 6);
  assert.equal(subagentLimitFor('alibaba', 'custom', 0), 0);
  assert.equal(quotaSnapshot(0, 0).canSpawn, false);
  assert.equal(quotaSnapshot(0, 0).state, 'full');

  assert.equal(normalizeSubagentLimit(-1), null);
  assert.equal(normalizeSubagentLimit(101), null);
  assert.equal(normalizeSubagentLimit(4.9), 4);
});

test('mensagem de bloqueio é PT-BR e cita plano, preço e limite', () => {
  const msg = quotaBlockedMessage({
    providerLabel: 'Alibaba AI Token Plan',
    planLabel: 'Standard',
    priceLabel: 'US$ 18/mês',
    limit: 4,
    active: 4
  });
  assert.match(msg, /Limite do plano atingido/);
  assert.match(msg, /US\$ 18\/mês/);
  assert.match(msg, /4 subagentes simultâneos/);
});

test('catálogo de provedores está completo e íntegro', () => {
  const ids = PROVIDER_PROFILES.map((p) => p.id);
  for (const id of ['alibaba', 'opencode', 'byteplus', 'zai', 'deepseek', 'openai', 'anthropic', 'custom']) {
    assert.ok(ids.includes(id), `provedor ausente: ${id}`);
  }
  for (const p of PROVIDER_PROFILES) {
    assert.ok(p.label.length > 0, `${p.id}: label vazio`);
    assert.ok(p.plans.length > 0, `${p.id}: sem planos`);
    assert.ok(p.envKey.length > 0, `${p.id}: sem variável de ambiente`);
    assert.ok(p.models.length > 0, `${p.id}: sem modelos`);
  }
  assert.equal(providerProfile('alibaba').defaultBaseUrl, 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1');
  assert.equal(providerProfile('zai').defaultBaseUrl, 'https://api.z.ai/api/paas/v4');
  assert.equal(providerProfile('deepseek').defaultBaseUrl, 'https://api.deepseek.com/v1');
  assert.equal(planPriceLabel(providerPlan('alibaba', 'standard')), 'US$ 18/mês');
});