/**
 * The setup catalog — every EXTERNAL tool the harness can use, what it buys the
 * user, and how to install it on this platform.
 *
 * Why this file exists: the app ships as one Electron bundle, but several of its
 * best features are thin wrappers over tools that live outside it — mempalace for
 * semantic memory, uv to install mempalace, git for worktrees, and one CLI per
 * agent engine. Every one of them degrades SILENTLY when absent (that is the
 * deliberate design — `memory.start()` is a documented no-op without mempalace),
 * which is friendly right up until the user cannot tell "off" from "broken" and
 * has no single place that says which is which. This catalog is that place.
 *
 * The engine rows are DERIVED from AGENT_PROVIDER_PRESETS rather than restated
 * here: those presets already carry `defaultCommand`, `installCommand`,
 * `nativeInstallCommand` and `docsUrl`, and a second hand-maintained copy would
 * drift the moment a provider is added.
 */

import { AGENT_PROVIDER_PRESETS } from './agentProvider';

export type ToolKind = 'prerequisite' | 'memory' | 'engine';

export interface ToolSpec {
  /** Stable row id. For a probed binary this is also the name we look up. */
  id: string;
  /** The executable to probe on PATH, or null when presence is derived some
   *  other way (mempalace comes from the memory subsystem's own status). */
  bin: string | null;
  label: string;
  kind: ToolKind;
  /** One line, benefit-framed: what the user LOSES without it. */
  why: string;
  /** Part of "set up everything". Everything else is opt-in. */
  essential: boolean;
  /** Install command per platform. Empty string = no scripted install. */
  install: { posix: string; win32: string };
  /** Shown when there is no scripted install, or as extra context. */
  note?: string;
  docsUrl?: string;
}

/** Base rows — the non-engine tools. Engines are appended by `toolCatalog()`. */
const BASE_TOOLS: ToolSpec[] = [
  {
    id: 'uv',
    bin: 'uv',
    label: 'uv',
    kind: 'prerequisite',
    why: 'Instala e executa o mempalace. Uma toolchain Python autocontida — não mexe no Python que você já tem.',
    essential: true,
    install: {
      posix: 'curl -LsSf https://astral.sh/uv/install.sh | sh',
      // PowerShell, not cmd.exe: astral ships install.ps1 for Windows and there
      // is no .bat equivalent. Quoted so it survives being pasted into either.
      win32: 'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"'
    },
    docsUrl: 'https://docs.astral.sh/uv/'
  },
  {
    id: 'mempalace',
    bin: null, // presence comes from MemoryStatus.available, not a PATH probe
    label: 'MemPalace — memória semântica',
    kind: 'memory',
    why: 'Recordação por significado em tudo o que seus agentes aprenderam. Sem ele, as notas em markdown continuam existindo, mas não podem ser buscadas por significado.',
    essential: true,
    install: {
      posix: 'uv tool install mempalace',
      win32: 'uv tool install mempalace'
    },
    note: 'Requer o uv primeiro.'
  },
  {
    id: 'git',
    bin: 'git',
    label: 'git',
    kind: 'prerequisite',
    why: 'As worktrees permitem que os agentes trabalhem em paralelo sem disputar um único checkout, e a colmeia mantém seu próprio histórico no git.',
    essential: true,
    install: {
      posix: 'xcode-select --install   # macOS · or: sudo apt install git',
      win32: 'winget install --id Git.Git -e'
    },
    docsUrl: 'https://git-scm.com/downloads'
  },
  {
    id: 'node',
    bin: 'node',
    label: 'Node.js',
    kind: 'prerequisite',
    why: 'Executa os motores de agente instalados via npm (OpenCode e Claude Code em máquinas sem o build nativo).',
    essential: false,
    // Deliberately no scripted command: the app already ships a checksum-verified
    // Node installer (nodeInstall.ts) that runs automatically when an engine needs
    // one. Printing a rival curl|sh here would compete with it.
    install: { posix: '', win32: '' },
    note: 'O app instala isso para você quando um motor precisa — nada de fazer à mão.',
    docsUrl: 'https://nodejs.org'
  }
];

/**
 * The full catalog for a platform. `platform` is a `process.platform` value; only
 * win32 vs everything-else matters.
 */
export function toolCatalog(): ToolSpec[] {
  const engines: ToolSpec[] = AGENT_PROVIDER_PRESETS
    // `custom` is whatever the user typed — there is nothing to detect or install.
    .filter((p) => p.id !== 'custom' && !!p.defaultCommand)
    .map((p) => ({
      id: `engine:${p.id}`,
      bin: p.defaultCommand,
      label: p.label,
      kind: 'engine' as const,
      why: `Motor de agente — ${p.defaultCommand}.`,
      // Claude Code is the recommended engine and the only one the floor assumes
      // by default, so it is the one engine "set up everything" will install.
      essential: p.id === 'claude',
      install: {
        posix: p.installCommand ?? p.nativeInstallCommand?.posix ?? '',
        win32: p.installCommand ?? p.nativeInstallCommand?.win32 ?? ''
      },
      docsUrl: p.docsUrl
    }));
  return [...BASE_TOOLS, ...engines];
}

/** A catalog row plus what we found on THIS machine. */
export interface ToolStatus extends ToolSpec {
  found: boolean;
  /** Absolute path when found, or null. */
  path: string | null;
  /** Extra live context — e.g. "palace initialised", a version string. */
  detail?: string;
  /** `install` already resolved for the running platform. */
  installCommand: string;
}

/**
 * The prompt handed to Michael by "ask Michael to set up everything".
 *
 * Written as an explicit contract rather than a wish: name the exact commands so
 * he does not have to guess or search, tell him to VERIFY rather than assume, and
 * make the ordering dependency (uv before mempalace) explicit — an orchestrator
 * that installs mempalace first just fails and reports failure.
 */
export function setupPrompt(missing: ToolStatus[]): string {
  if (missing.length === 0) return '';
  const lines = missing.map((t) => {
    const cmd = t.installCommand ? `\n  install: ${t.installCommand}` : '';
    const note = t.note ? `\n  note: ${t.note}` : '';
    return `- ${t.label} (${t.id})${cmd}${note}`;
  });
  return [
    'Set up my missing local tooling. These are the tools this harness uses that are not installed on this machine:',
    '',
    ...lines,
    '',
    'For each one: run the install command in your own terminal, then VERIFY it actually resolves',
    '(`which <bin>`, or `where <bin>` on Windows) before moving on — do not assume an installer that',
    'printed no error succeeded. Install uv BEFORE mempalace; mempalace is installed BY uv and will',
    'fail outright without it.',
    '',
    'If a command needs my password or a decision only I can make, stop and ask me rather than',
    'guessing or working around it. When you are done, report one line per tool: installed, already',
    'present, or failed with the reason.'
  ].join('\n');
}
