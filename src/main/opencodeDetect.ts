/**
 * Detecção segura do OpenCode local.
 *
 * Objetivo: dizer à UI se a CLI `opencode` está instalada, qual versão responde
 * e quais provedores/modelos/MCPs aparecem na configuração local — SEM nunca ler
 * ou devolver chaves de API.
 *
 * Regras de segurança:
 *  - só lê arquivos JSON de configuração conhecidos (nunca `auth.json` inteiro;
 *    dele só registramos a EXISTÊNCIA);
 *  - nunca devolve valores de `apiKey`, `token` ou `secret`;
 *  - executa apenas `opencode --version`, com timeout e sem shell;
 *  - qualquer falha degrada para "não detectado", nunca lança.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join } from 'node:path';

export interface OpenCodeDetection {
  /** A CLI foi encontrada no PATH? */
  found: boolean;
  /** Caminho absoluto do binário, quando encontrado. */
  binaryPath: string | null;
  /** Versão reportada por `opencode --version` (null quando indisponível). */
  version: string | null;
  /** Arquivo de configuração efetivamente lido. */
  configPath: string | null;
  /** Provedores declarados na configuração (apenas nomes). */
  providers: string[];
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
  defaultModel: null,
  mcpCount: 0,
  authConfigured: false,
  configReadable: false
};

function isExecutable(path: string): boolean {
  try {
    // existsSync evita lançar em caminhos inválidos; o acesso real ocorre na
    // execução com timeout. Em Windows o sufixo é resolvido pelos candidatos.
    return existsSync(path);
  } catch {
    return false;
  }
}

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

function readConfig(path: string): { providers: string[]; defaultModel: string | null; mcpCount: number } | null {
  try {
    const raw = readFileSync(path, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    const providerBlock = parsed.provider;
    const providers =
      providerBlock && typeof providerBlock === 'object'
        ? Object.keys(providerBlock as Record<string, unknown>).sort()
        : [];
    const model = typeof parsed.model === 'string' ? parsed.model : null;
    const mcp = parsed.mcp;
    const mcpCount = mcp && typeof mcp === 'object' ? Object.keys(mcp as Record<string, unknown>).length : 0;
    return { providers, defaultModel: model, mcpCount };
  } catch {
    return null;
  }
}

let cached: { at: number; value: OpenCodeDetection } | null = null;
const CACHE_MS = 300_000;

/** Detecta o OpenCode com cache de 5 min: `opencode --version` é síncrono e não
 *  pode bloquear o processo principal a cada poll da UI. O botão de teste força
 *  uma nova detecção (`detectOpenCode(true)`). */
export function detectOpenCode(force = false): OpenCodeDetection {
  const now = Date.now();
  if (!force && cached && now - cached.at < CACHE_MS) return cached.value;

  let out: OpenCodeDetection = { ...EMPTY };
  const binary = findOnPath('opencode');

  if (binary) {
    out.found = true;
    out.binaryPath = binary;
    try {
      const version = execFileSync(binary, ['--version'], {
        encoding: 'utf8',
        timeout: 2500,
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
        defaultModel: parsed.defaultModel,
        mcpCount: parsed.mcpCount
      };
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