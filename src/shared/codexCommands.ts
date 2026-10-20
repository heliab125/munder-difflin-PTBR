/**
 * Command reference for the OpenAI Codex CLI.
 *
 * Mirrors the shape of claudeCommands.ts so any component that renders a
 * command reference can switch on provider. Curated from the Codex CLI
 * reference + slash-commands docs (developers.openai.com/codex/cli/).
 *
 * `kind` semantics match claudeCommands.ts:
 *   - `slash`  — typed inside the Codex interactive REPL session
 *   - `cli`    — shell flags / sub-commands passed at launch
 */
import type { CmdGroup } from './claudeCommands';

export const CODEX_COMMAND_GROUPS: CmdGroup[] = [
  {
    title: 'SESSÃO',
    items: [
      { cmd: '/clear', kind: 'slash', desc: 'Inicia um chat novo sem sair — limpa o contexto da conversa.' },
      // Verified present in the codex 0.137.0 binary's own command table. It was
      // missing here while providerAutomation sent it, so the two disagreed.
      // Unlike Claude's, this one ignores any trailing focus text.
      { cmd: '/compact', kind: 'slash', desc: 'Resume a conversa até agora para permanecer dentro do limite de contexto.' },
      { cmd: '/help', kind: 'slash', desc: 'Lista todos os comandos de barra disponíveis.' },
      { cmd: '/copy', kind: 'slash', desc: 'Copia a última saída do modelo para a área de transferência.' },
      { cmd: '/logout', kind: 'slash', desc: 'Limpa as credenciais armazenadas localmente.' },
      { cmd: '/rename', kind: 'slash', desc: 'Renomeia a conversa atual.' }
    ]
  },
  {
    title: 'INTERFACE E PREFERÊNCIAS',
    items: [
      { cmd: '/theme', kind: 'slash', desc: 'Alterna entre os temas claro e escuro.' },
      { cmd: '/vim', kind: 'slash', desc: 'Liga/desliga os atalhos do Vim na caixa de entrada.' },
      { cmd: '/raw', kind: 'slash', desc: 'Liga/desliga a saída bruta (sem formatação) da resposta do modelo.' }
    ]
  },
  {
    title: 'MEMÓRIA E SKILLS',
    items: [
      { cmd: '/memories', kind: 'slash', desc: 'Visualiza e gerencia o que o Codex lembrou sobre você.' },
      { cmd: '/skills', kind: 'slash', desc: 'Navega e gerencia as skills/extensões do Codex instaladas.' },
      { cmd: '/hooks', kind: 'slash', desc: 'Visualiza os hooks de ciclo de vida configurados.' }
    ]
  },
  {
    title: 'APROVAÇÕES E PERMISSÕES',
    items: [
      { cmd: 'codex --dangerously-bypass-approvals-and-sandbox', kind: 'cli', desc: 'Ignora TODOS os prompts de aprovação E remove o sandbox do SO (acesso total ao sistema de arquivos). O Munder Difflin não usa mais isso no modo automático; ele mantém o sandbox e adiciona a pasta do agente via --add-dir.' },
      { cmd: 'codex -a never -s workspace-write', kind: 'cli', desc: 'Nunca pergunta por aprovação (-a never), mas mantém o sandbox limitado ao workspace do projeto (-s workspace-write). É o que o Munder Difflin usa no modo automático; a pasta do agente é adicionada com --add-dir <dir>.' },
      { cmd: 'codex -a untrusted', kind: 'cli', desc: 'Só executa comandos confiáveis sem perguntar; escala para o usuário em qualquer outro caso.' },
      { cmd: 'codex -s danger-full-access', kind: 'cli', desc: 'Remove todas as restrições de sandbox (flag granular — combine com -a para controle total).' }
    ]
  },
  {
    title: 'AUTOMAÇÃO (HEADLESS)',
    items: [
      { cmd: 'codex -p "seu prompt"', kind: 'cli', desc: 'Modo print não interativo: executa um prompt e encerra.', usage: 'codex -p "resuma este arquivo"' },
      { cmd: 'CODEX_NON_INTERACTIVE=1 codex', kind: 'cli', desc: 'Suprime todos os prompts interativos de instalador/primeira execução. Definido automaticamente pelo Munder Difflin no modo automático.' }
    ]
  },
  {
    title: 'CONFIGURAÇÃO',
    items: [
      { cmd: 'codex --model <modelo>', kind: 'cli', desc: 'Escolhe o modelo (por exemplo, o4-mini, o3).', usage: 'codex --model o4-mini' },
      { cmd: 'codex --provider <provedor>', kind: 'cli', desc: 'Seleciona o provedor de API (openai, azure, anthropic…).', usage: 'codex --provider openai' }
    ]
  }
];