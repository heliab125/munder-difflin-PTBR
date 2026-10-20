/**
 * Command reference for the xAI Grok CLI.
 *
 * Kept in the same shape as the Claude/Codex references so the Command Center
 * and generated hive command guide can render provider-native commands.
 */
import type { CmdGroup } from './claudeCommands';

export const GROK_COMMAND_GROUPS: CmdGroup[] = [
  {
    title: 'SESSÃO',
    items: [
      { cmd: '/new', kind: 'slash', desc: 'Inicia uma sessão nova e limpa o contexto atual.' },
      { cmd: '/load', kind: 'slash', desc: 'Carrega uma sessão anterior do workspace.', usage: '/load [workspace] [sessão]' },
      { cmd: '/compact', kind: 'slash', desc: 'Compacta o histórico da conversa mantendo o contexto de trabalho importante.', usage: '/compact mantenha a tarefa atual e o próximo passo' },
      { cmd: 'grok --resume <id-da-sessão>', kind: 'cli', desc: 'Retoma uma sessão Grok existente por ID ou título.' }
    ]
  },
  {
    title: 'MODELOS E PERMISSÕES',
    items: [
      { cmd: '/model', kind: 'slash', desc: 'Troca o modelo usado pela sessão atual.' },
      { cmd: 'grok --model grok-4.6', kind: 'cli', desc: 'Inicia o Grok com o modelo de programação Grok 4.6 (padrão da CLI).' },
      { cmd: '/always-approve', kind: 'slash', desc: 'Liga/desliga a aprovação automática de execuções de ferramentas.' },
      { cmd: 'grok --permission-mode bypassPermissions', kind: 'cli', desc: 'Inicia no modo de aprovação automática. O Munder usa isto quando o modo automático está ligado.' }
    ]
  },
  {
    title: 'FERRAMENTAS E FLUXO DE TRABALHO',
    items: [
      { cmd: '/rewind', kind: 'slash', desc: 'Volta a um prompt anterior e restaura o estado dos arquivos.' },
      { cmd: '/hooks-list', kind: 'slash', desc: 'Mostra os hooks de ciclo de vida ativos nesta sessão.' },
      { cmd: '/skills', kind: 'slash', desc: 'Lista ou carrega as skills instaladas.' },
      { cmd: '/multiline', kind: 'slash', desc: 'Liga/desliga a entrada de prompt em várias linhas.' }
    ]
  }
];