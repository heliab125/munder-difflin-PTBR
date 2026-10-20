/**
 * Detecção segura do OpenCode local.
 *
 * Objetivo: dizer à UI se a CLI `opencode` está instalada, qual versão responde,
 * quais provedores/modelos/MCPs aparecem na configuração local e quais modelos a
 * própria CLI lista (`opencode models`) — SEM nunca ler ou devolver chaves.
 *
 * Por que não usar só `process.env.PATH`: no macOS um app empacotado aberto pelo
 * Finder recebe o PATH mínimo do launchd, não o PATH do seu shell. O binário do
 * OpenCode costuma ficar em `~/.opencode/bin`, que não está nesse PATH mínimo.
 * Por isso a resolução passa pelo login shell (`resolveCommand` em shellEnv.ts),
 * que é o mesmo caminho usado para iniciar os agentes.
 *
 * Regras de segurança:
 *  - só lê arquivos JSON de configuração conhecidos (nunca `auth.json` inteiro;
 *    dele só registramos a EXISTÊNCIA);
 *  - nunca devolve valores de `apiKey`, `token` ou `secret`;
 *  - executa apenas `opencode --version` e `opencode models`, com timeout e sem shell;
 *  - qualquer falha degrada para "não detectado", nunca lança.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join } from 'node:path';
import { resolveCommand } from './shellEnv';

export interface OpenCodeDetection {
  /** A CLI foi encontrada no PATH do shell do usuário? */
  found: boolean;
  /** Caminho absoluto do binário, quando encontrado. */
  binaryPath: string | null;
  /** Versão reportada por `opencode --version` (null quando indisponível). */
  version: string | null;
  /** Arquivo de configuração efetivamente lido. */
  configPath: string | null;
  /** Provedores declarados na configuração (apenas nomes). */
  providers: string[];
  /** Modelos em formato `provedor/modelo`, vindos da config + `opencode models`. */
  models: string[];
  /** Modelo padrão declarado (`provider/modelo`), se houver. */
  defaultModel: string | null;
  /** Quantidade de servidores MCP configurados. */
  mcpCount: number;
  /** Há credenciais locais do OpenCode (presença, nunca conteúdo). */
  authConfigured: boolean;
  /** Configuração legível e parseável. */
  configReadable: boolean;
}

const EMPTY: OpenCodeDetection = {
  found: false,
  binaryPath: null,
  version: null,
  configPath: null,
  providers: [],
  models: [],
  defaultModel: null,
  mcpCount: 0,
  authConfigured: false,
  configReadable: false
};

function isExecutable(path: string): boolean {
  try {
    return existsSync(path);
  } catch {
    return false;
  }
}

/** Fallback direto para o PATH do processo, útil em dev/CLI. O caminho principal
 *  é `resolveCommand`, que consulta o login shell e locais conhecidos. */
function findOnPath(name: string): string | null {
  const pathValue = process.env.PATH ?? '';
  const exts = process.platform === 'win32'
    ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';')
    : [''];
  for (const dir of pathValue.split(delimiter)) {
    if (!dir) continue;
    for (const ext of exts) {
      const candidate = join(dir, `${name}${ext.toLowerCase()}`);
      if (isExecutable(candidate)) return candidate;
      const upper = join(dir, `${name}${ext.toUpperCase()}`);
      if (upper !== candidate && isExecutable(upper)) return upper;
    }
  }
  return null;
}

function findOpenCodeBinary(): string | null {
  const fromPath = findOnPath('opencode');
  if (fromPath) return fromPath;
  // Login-shell PATH + common locations. `opencode` installs itself under
  // ~/.opencode/bin on macOS/Linux and %USERPROFILE%\.opencode\bin on Windows;
  // neither is guaranteed to be in a packaged app's launchd PATH.
  const resolved = resolveCommand('opencode');
  if (resolved && resolved !== 'opencode' && isExecutable(resolved)) return resolved;
  const home = homedir();
  const candidates = [
    join(home, '.opencode', 'bin', 'opencode'),
    join(home, '.opencode', 'bin', 'opencode.exe'),
    join(home, '.local', 'bin', 'opencode'),
    join(home, '.bun', 'bin', 'opencode'),
    ...(process.platform === 'win32' ? [join(home, 'AppData', 'Local', 'Programs', 'opencode', 'opencode.exe')] : [])
  ];
  for (const candidate of candidates) if (isExecutable(candidate)) return candidate;
  return null;
}

function configCandidates(): string[] {
  const home = homedir();
  const xdg = process.env.XDG_CONFIG_HOME;
  const appData = process.env.APPDATA;
  const list = [
    process.env.OPENCODE_CONFIG,
    xdg ? join(xdg, 'opencode', 'opencode.json') : null,
    join(home, '.config', 'opencode', 'opencode.json'),
    join(home, '.config', 'opencode', 'opencode.jsonc'),
    join(home, '.config', 'opencode', 'config.json'),
    appData ? join(appData, 'opencode', 'opencode.json') : null,
    appData ? join(appData, 'opencode', 'opencode.jsonc') : null,
    join(home, 'AppData', 'Roaming', 'opencode', 'opencode.json')
  ];
  return list.filter((p): p is string => typeof p === 'string' && p.length > 0);
}

function normalizeModel(value: string): string | null {
  const slug = value.trim();
  if (!slug || slug.length > 160 || /\s/.test(slug) || !slug.includes('/')) return null;
  return slug;
}

function modelsFromProviderConfig(providerBlock: unknown): string[] {
  if (!providerBlock || typeof providerBlock !== 'object') return [];
  const out: string[] = [];
  for (const [provider, raw] of Object.entries(providerBlock as Record<string, unknown>)) {
    if (!raw || typeof raw !== 'object') continue;
    const models = (raw as Record<string, unknown>).models;
    if (!models || typeof models !== 'object') continue;
    for (const model of Object.keys(models as Record<string, unknown>)) {
      const slug = normalizeModel(`${provider}/${model}`);
      if (slug) out.push(slug);
    }
  }
  return out;
}

function modelsFromCli(binary: string): string[] {
  try {
    const raw = execFileSync(binary, ['models'], {
      encoding: 'utf8',
      timeout: 8000,
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true
    });
    return raw
      .replace(/\x1b\[[0-9;]*m/g, '')
      .split(/\r?\n/)
      .map(normalizeModel)
      .filter((m): m is string => !!m);
  } catch {
    return [];
  }
}

function readConfig(path: string): { providers: string[]; defaultModel: string | null; mcpCount: number; models: string[] } | null {
  try {
    const raw = readFileSync(path, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    const providerBlock = parsed.provider;
    const providers =
      providerBlock && typeof providerBlock === 'object'
        ? Object.keys(providerBlock as Record<string, unknown>).sort()
        : [];
    const model = normalizeModel(typeof parsed.model === 'string' ? parsed.model : '');
    const mcp = parsed.mcp;
    const mcpCount = mcp && typeof mcp === 'object' ? Object.keys(mcp as Record<string, unknown>).length : 0;
    return { providers, defaultModel: model, mcpCount, models: modelsFromProviderConfig(providerBlock) };
  } catch {
    return null;
  }
}

function uniqueModels(models: readonly string[]): string[] {
  return [...new Set(models)];
}

let cached: { at: number; value: OpenCodeDetection } | null = null;
const CACHE_MS = 300_000;

/** Detecta o OpenCode com cache de 5 min: `opencode --version` e `opencode models`
 *  são síncronos e não podem bloquear o processo principal a cada poll da UI. O
 *  botão de testar/atualizar força uma nova detecção (`detectOpenCode(true)`). */
export function detectOpenCode(force = false): OpenCodeDetection {
  const now = Date.now();
  if (!force && cached && now - cached.at < CACHE_MS) return cached.value;

  let out: OpenCodeDetection = { ...EMPTY };
  const binary = findOpenCodeBinary();

  if (binary) {
    out.found = true;
    out.binaryPath = binary;
    try {
      const version = execFileSync(binary, ['--version'], {
        encoding: 'utf8',
        timeout: 4000,
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true
      }).trim();
      out.version = version.split(/\r?\n/)[0]?.slice(0, 120) || null;
    } catch {
      out.version = null;
    }
  }

  let configPath: string | null = null;
  for (const candidate of configCandidates()) {
    if (existsSync(candidate)) {
      configPath = candidate;
      break;
    }
  }
  if (configPath) {
    out.configPath = configPath;
    const parsed = readConfig(configPath);
    if (parsed) {
      out = {
        ...out,
        configReadable: true,
        providers: parsed.providers,
        models: parsed.models,
        defaultModel: parsed.defaultModel,
        mcpCount: parsed.mcpCount
      };
    }
  }

  // `opencode models` is the authoritative list (it includes built-in providers
  // and models the user added through other configs). Merge it over the config
  // list, never replacing the config fallback when the command fails.
  if (binary) {
    out.models = uniqueModels([...modelsFromCli(binary), ...out.models]);
    if (!out.defaultModel) {
      out.defaultModel = out.models.find((m) => m.startsWith('opencode/')) ?? out.models[0] ?? null;
    }
  }

  // Presença de credenciais — nunca conteúdo.
  const home = homedir();
  out.authConfigured =
    existsSync(join(home, '.local', 'share', 'opencode', 'auth.json')) ||
    existsSync(join(home, '.config', 'opencode', 'auth.json')) ||
    existsSync(join(home, 'AppData', 'Roaming', 'opencode', 'auth.json'));

  cached = { at: now, value: out };
  return out;
}