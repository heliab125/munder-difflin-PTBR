// Cafeteria small-talk — The Office edition.
//
// The cast ARE Dunder Mifflin (see cast.ts), so an agent's coffee break is an
// excuse for a one-liner in character. Two kinds of line:
//   • solo  — one quip shown above a single agent at a break spot
//   • pair  — a two-beat exchange between two agents at the same table
//
// Lines are kept short so they fit the ThoughtBubble (≈MAX_WIDTH). Character
// keys match OfficeCharacterName; anyone without bespoke lines falls back to the
// shared GENERIC pool so the floor never feels empty.

import type { OfficeCharacterName } from './cast';

/** Where an agent is lingering — picks a contextual line pool. */
export type BreakSpot = 'coffee' | 'vending' | 'snack' | 'table';

const pick = <T,>(arr: readonly T[], seed: number): T =>
  arr[((seed % arr.length) + arr.length) % arr.length];

// ─── solo lines, by spot ─────────────────────────────────────────────────────

const COFFEE: readonly string[] = [
  'isto é… descafeinado?? quem fez isso',
  'acabaram os grãos de novo',
  'caneca do Melhor Chefe do Mundo',
  'primeira xícara do dia. e a quinta.',
  'o café daqui é basicamente um abraço',
  'quem pegou minha caneca?',
];

const VENDING: readonly string[] = [
  'a máquina comeu minha moeda',
  'B4… por favor, seja o salgadinho',
  'travou. clássico.',
  'sacudindo. com carinho. com respeito.',
  'um (1) salgadinho de apoio emocional',
  'A1 de novo. vivendo perigosamente.',
];

const SNACK: readonly string[] = [
  'hoje é Dia do Pretzel?',
  'quem acabou com as batatas??',
  'só um docinho',
  'esses são de todo mundo? legal, legal, legal',
  'segundo café da manhã',
];

const TABLE: readonly string[] = [
  'dia cheio. muitas reuniões.',
  'só mais cinco minutinhos',
  'você viu as notas da reunião diária?',
  'fingindo ler minhas anotações',
  'eu precisava dessa pausa, sinceramente',
  'NÃO conte ao Michael que estou aqui',
];

const SPOT_POOL: Record<BreakSpot, readonly string[]> = {
  coffee: COFFEE, vending: VENDING, snack: SNACK, table: TABLE,
};

// ─── character flavour — overrides the generic pool when present ─────────────

const BY_CHARACTER: Partial<Record<OfficeCharacterName, readonly string[]>> = {
  michael:  ['EU DECLARO… FALÊNCIA!', 'foi o que ela disse', 'não sou supersticioso. só um pouquinho sticioso.', 'nada de reuniões antes do café. essa é a regra.'],
  dwight:   ['FALSO.', 'roubo de identidade não é piada', 'essa caneca é regulamentar', 'esta geladeira precisa de uma gaveta de beterraba', 'A Fazenda Schrute tem café melhor'],
  jim:      ['...foi o que ela disse', 'ursos. beterrabas. Battlestar Galactica.', 'movi o grampeador do Dwight de novo', 'só vim pela fofoca'],
  pam:      ['Dunder Mifflin, Pam falando', 'desenhando a máquina de snacks', 'a aquarela da sala de descanso'],
  kevin:    ['o chili NÃO está pronto', 'por que perder tempo falando muito', 'quero lanche', 'biscoito? biscoito.'],
  angela:   ['esta sala de descanso é uma imundície', 'comitê de festas, 15h', 'estou julgando a geladeira'],
  oscar:    ['na verdade, é “espresso”', 'bem, na verdade…', 'o orçamento de snacks é preocupante'],
  stanley:  ['hoje é Dia do Pretzel?', 'eu gaguejei?', 'palavras cruzadas e café. me deixe em paz.', 'vou me aposentar antes disso passar'],
  phyllis:  ['Bob vai me buscar às cinco', 'tricô e uma boa xícara de chá'],
  andy:     ['Cornell, já ouviu falar?', 'rit-dit-dit, pausa para o café!', 'Big Tuna, puxa uma cadeira'],
  kelly:    ['você SOUBE o que aconteceu??', 'tanta. coisa. para contar.', 'eu sou a rainha da fofoca'],
  ryan:     ['sou meio importante', 'o estagiário precisa de cafeína', 'vou começar uma startup de café, na verdade'],
  toby:     ['eu deveria registrar isso…', 'do ponto de vista do RH, esta pausa está ok', 'ninguém nunca senta comigo'],
  creed:    ['qual de vocês é o novato?', 'já comi pior daquela geladeira', 'feijão-mungo. debaixo da minha mesa.'],
  meredith: ['já são cinco horas?', 'alguém colocou algo no café?'],
};

/** A solo break-room line. Character flavour ~60% of the time, else the line
 *  fits the spot the agent is standing at. `seed` keeps it deterministic per
 *  call site (avoids Math.random, which Pixi/Electron CSP-safe code prefers). */
export function pickSoloLine(character: OfficeCharacterName, spot: BreakSpot, seed: number): string {
  const flavour = BY_CHARACTER[character];
  if (flavour && seed % 5 < 3) return pick(flavour, Math.floor(seed / 5));
  return pick(SPOT_POOL[spot], seed);
}

// ─── paired exchanges (two agents at one table) ──────────────────────────────
//
// Each exchange is a list of beats that ALTERNATE between the two agents:
// beat[0] = the speaker who sat down, beat[1] = their table-mate, beat[2] =
// speaker again, and so on. The director plays them out one beat at a time.
// Lines are trimmed to fit the thought cloud; longer ones auto-truncate.

type Exchange = readonly string[];

// Generic banter — works between any two agents (they're all Dunder Mifflin).
const EXCHANGES: readonly Exchange[] = [
  ['o melhor chefe do mundo.', 'você é. eu mandei fazer a caneca.', 'e eu a guardo com carinho.'],
  ['um idiota faria isso?', '...se sim, eu não.', 'esse é o meu garoto.'],
  ['temido ou amado? os dois.', 'isso é lindo.', 'eu sei.'],
  ['editei sua página da wiki de novo.', 'eu sei. obrigado.'],
  ['pergunta. quantos ursos?', 'um.', 'é muito.'],
  ['fato: ursos comem beterraba.', 'ursos. beterrabas. Galactica.', 'o que está acontecendo.'],
  ['cresci em uma fazenda de beterraba.', 'chocante.', '...nem um pouco chocante.'],
  ['qual é o cheiro da Fazenda Schrute?', 'vitória. e beterraba.'],
  ['você acabou de jogar o telefone?', 'não gostei do que ele disse.', 'legal.'],
  ['cachorro-quente é sanduíche?', 'é.', 'né? eu sei.'],
  ['o Jim do furo de três voltou.', 'nunca cansa.'],
  ['por que pouca palavra quando muita palavra?', '...genuinamente profundo.', 'eu sei.'],
  ['não sou uma pessoa má.', '...', 'também não sou uma ótima pessoa.', 'aí está.'],
  ['amo meus gatos mais que as pessoas.', 'inclusive nós?', 'especialmente você.'],
  ['gatos são melhores que cachorros.', 'cachorros são melhores.', '...desculpa.'],
  ['você me ama?', 'eu amo… estar aqui.', 'isso é um sim.'],
  ['sou meio importante.', 'é?', 'na minha cabeça. sim.'],
  ['sentiu minha falta?', 'não.', 'um pouquinho?', '...aí está.'],
  ['você acabou de revirar os olhos?', 'acabei.', 'por quê?', 'memória muscular.'],
  ['olho esse relógio desde as 4.', 'você não estava trabalhando?', 'olhando o relógio.'],
  ['o que a gente vende mesmo?', 'papel.', 'certo, tá.'],
  ['quantos anos você tem?', 'é.', 'isso não é uma resposta.', 'claro que é.'],
  ['matemática não funciona assim.', 'eu sei.', 'então por quê?', 'mais rápido.'],
  ['não sou alcoólatra.', 'você foi a uma reunião.', 'pela comida.'],
  ['eu fui para Cornell.', 'ninguém se importa.', 'eu fui para Cornell.', 'ainda ninguém se importa.'],
  ['tenho muitos sentimentos.', 'dá para ver.', 'isso é ruim?', 'para nós? sim.'],
  ['por que você é do jeito que é?', '...', 'sinceramente.'],
  ['seu gato morreu.', 'eu sei.', 'sinto muito.', '...obrigado.'],
  ['pare de me olhar.', 'você pare de me olhar.'],
  ['assina isso.', 'o que é?', 'não importa.', '...tá.'],
  ['você não pode dizer isso.', 'acabei de dizer.', 'vai me impedir?', '...não.'],
  ['isso é uma faixa de incêndio.', 'o incêndio ainda não aconteceu.'],
  ['embrulhei seu grampeador em gelatina.', 'vou comer em volta.', 'justo.'],
  ['plano contra zumbis?', 'especialmente isso.', 'claro.'],
  ['só vendo se você respondia.', 'eu te odeio.', 'eu sei.'],
  ['um pouquinho sticioso, não supersticioso.', 'isso não é uma palavra.', 'agora é.'],
  ['a pessoa mais engraçada do escritório?', 'e nas outras horas?', 'nas outras horas eu sei que sou.'],
  ['foi o que ela disse.', '...toda vez.', 'qual é.'],
  ['eu comecei o incêndio.', 'não, não começou.', 'nos nossos corações, comecei.'],
  ['hoje é um dia terminado em “o”?', 'sim.', 'então não.'],
  ['Bob Vance.', 'Phyllis Vance.', 'Vance Refrigeração.'],
  ['você está linda hoje.', '...eu sei.'],
  ['sou melhor que você em tudo.', 'provavelmente.', 'com certeza.', 'tá.'],
  ['sou um cara legal.', 'você é ok.', 'a coisa mais legal que você já disse.'],
  ['você está bem?', 'já estive pior.', 'quando?', 'não consigo precisar.'],
  ['tem uma aranha na sua mesa.', 'onde?', '...você comeu.', 'proteína.'],
  ['almas gêmeas podem ser chefes.', 'você é meu chefe.', 'exatamente.'],
  ['a reunião diária durou 40 minutos.', 'poderia ter sido um e-mail.'],
  ['o build já está verde?', '...não olha.'],
  ['quem respondeu para todos?', 'a gente não fala sobre isso.'],
];

// ─── "foi o que ela disse" ──────────────────────────────────────────────────
//
// The office's favourite bit. These are generic (added to the shared pool
// below) so ANY two agents at a table can run them: whoever sits down first
// delivers the innocent setup (beat 0) and their table-mate lands the punchline
// (beat 1). Some carry the show's follow-up beats — a sheepish clarification and
// the inevitable "still counts." Setups are trimmed to fit the thought cloud.
const TWSS_EXCHANGES: readonly Exchange[] = [
  ['está demorando muito mais do que eu esperava.', 'foi o que ela disse.'],
  ['é grande demais, não cabe na minha boca.', 'foi o que ela disse.'],
  ['você realmente precisa ir mais devagar.', 'foi o que ela disse.'],
  ['vou precisar de um maior.', 'foi o que ela disse.'],
  ['socorro, não consigo fazer entrar.', 'foi o que ela disse.'],
  ['não é tão difícil se você só empurrar.', 'foi o que ela disse.'],
  ['não consigo fazer isso a noite toda.', 'foi o que ela disse.'],
  ['preciso agora, não posso esperar.', 'foi o que ela disse.'],
  ['tá quente aqui, estou suando.', 'foi o que ela disse.'],
  ['fica escorregando das minhas mãos.', 'foi o que ela disse.'],
  ['por que não enfia logo de uma vez?', 'foi o que ela disse.', '*olha para a câmera*'],
  ['só preciso de mais alguns centímetros.', 'foi o que ela disse.', 'para a prateleira!', 'ainda conta.'],
  ['aumenta o volume, mal consigo sentir.', 'foi o que ela disse.'],
  ['dá para resolver isso rapidinho?', 'foi o que ela disse.', 'eu quis dizer a reunião.', 'sei.'],
  ['só preciso que você segure firme.', 'foi o que ela disse.'],
  ['não acredito que fiz isso a manhã toda.', 'foi o que ela disse.'],
  ['minhas mãos estão travando.', 'foi o que ela disse.', 'de digitar!', 'foi o que ela disse.'],
  ['horas nisso e nem na metade.', 'foi o que ela disse.'],
  ['surpreendentemente pesado para o tamanho.', 'foi o que ela disse.'],
  ['seja mais preciso. menos desleixado.', 'foi o que ela disse.', 'eu quis dizer a planilha.', 'eu sei.'],
  ['quanto tempo durou?', 'foi o que ela disse.', '*a sala inteira fica em silêncio*', 'desculpa, não me controlo.'],
  ['apertado demais, cortando minha circulação.', 'foi o que ela disse.', '*agradece em silêncio*'],
  ['acho que não vai caber.', 'foi o que ela disse.', '*levanta e aplaude*'],
  ['para, você está fazendo errado.', 'foi o que ela disse.', 'nunca estive tão orgulhoso.'],
  ['isso só fica cada vez mais difícil.', 'foi o que ela disse.', 'ele está pronto.'],
  ['não é largo o suficiente, preciso de mais espaço.', 'foi o que ela disse.'],
  ['consigo segurar por muito tempo.', 'foi o que ela disse.', 'a respiração!', 'ainda conta.'],
  ['por que está demorando tanto?', 'foi o que ela disse.', 'eu te odeio.', 'então por que me deu a deixa?'],
  ['não consigo fazer com gente olhando.', 'foi o que ela disse.', 'a apresentação!', 'sei.'],
  ['é mais fundo do que parece.', 'foi o que ela disse.', 'o buraco, Michael!', 'não importa.'],
  ['muito mais longo que da última vez.', 'foi o que ela disse.', 'o relatório, Michael.', 'certo, certo.'],
  ['meu Deus, durou uma ETERNIDADE.', 'foi o que ela disse.', 'o filme do Crepúsculo!', 'clássico.'],
  ['não acredito como isso é grosso.', 'foi o que ela disse.', 'a pasta. *encara*'],
  ['coube TUDO isso em um dia?', 'foi o que ela disse.', 'foi exatamente o que eu disse!', 'meta.'],
  ['peguei pesado hoje de manhã.', 'foi o que ela disse.', 'na academia!', 'irrelevante.'],
  ['alguém me ajuda a terminar isso.', 'foi o que ela disse.', 'o bolo que sobrou!', 'ainda funciona.'],
  ['entra, faço o que tenho que fazer, saio.', 'foi o que ela disse.', '*não levanta os olhos das palavras cruzadas*'],
  ['não acredito que levou tanto tempo.', 'foi o que ela disse.', 'o aumento. oito anos.', 'essa foi por minha conta.'],
  ['faz mais devagar, dói menos.', 'foi o que ela disse.', 'na revisão trimestral.', 'claro, Oscar.'],
  ['não imaginei que seria tão grande.', 'foi o que ela disse.', 'o calzone, é enorme!', 'amo este escritório.'],
  ['*para ninguém* foi o que ela disse.', 'ninguém falou nada.', 'só pensando no que aconteceu antes.'],
  ['*ao telefone* foi o que ela disse.', 'quem era?', 'minha mãe. sobre um sanduíche.'],
  ['tá quente aqui! foi o que ela disse.', 'você disse as duas partes.', 'eu contenho multidões.'],
  ['*para a TV* foi o que ela disse.', 'você está sozinho, Michael.', 'ela não sabe disso.'],
  ['você precisa ser mais profissional.', 'foi o que ela disse.', 'eu sou ela.', '...foi o que ela disse.'],
  ['para. só para. toda vez—', 'foi o que ela disse.', '*sai da sala*', '*sussurra* foi o que ela disse.'],
  ['como você pode ver, está subindo.', 'foi o que ela disse.', '*todo mundo geme*', 'essa eu armei sozinho.'],
  ['eu declarei falência uma vez. foi bom.', 'o que isso tem a ver com—', 'foi o que ela disse.', 'nada.', 'eu sei.'],
  ['você não disse.', 'eu sei.', 'por quê?', 'estou evoluindo.', '...foi o que ela disse.', 'aí está.'],
  ['impressionante você ter se segurado hoje.', 'obrigado.', 'contei zero vezes.', 'foi o que ela disse.', 'ainda conta.'],
];

// Everything any table-mate pair can draw from.
const PAIR_POOL: readonly Exchange[] = [...EXCHANGES, ...TWSS_EXCHANGES];

// Keyed off the SPEAKER so, when the right character sits down first, they get
// to open with their signature bit.
const KEYED_EXCHANGES: Partial<Record<OfficeCharacterName, Exchange>> = {
  michael:  ['foi o que ela disse.', '...aí está.'],
  dwight:   ['roubo de identidade não é piada.', 'ninguém tocou no seu grampeador, Dwight.'],
  kevin:    ['por que pouca palavra quando muita palavra?', '...só use as palavras, Kevin.'],
  kelly:    ['ok, não surta, mas—', 'eu já estou surtando.'],
  oscar:    ['bem, na verdade—', '...lá vamos nós.'],
  angela:   ['esta mesa é uma imundície.', 'é uma sala de descanso, Angela.'],
  creed:    ['qual de vocês é você mesmo?', '...a gente senta lado a lado.'],
  stanley:  ['hoje é Dia do Pretzel?', 'não, Stanley.', '...eu gaguejei?'],
  andy:     ['eu fui para Cornell.', 'ninguém se importa.', '...eu fui para Cornell.'],
  jim:      ['pergunta.', 'sim.', 'nada. só conferindo.'],
};

/** A multi-beat exchange for two agents sharing a table. Beats alternate:
 *  index 0 = `speaker`, 1 = the table-mate, 2 = speaker, … */
export function pickExchange(speaker: OfficeCharacterName, seed: number): Exchange {
  const keyed = KEYED_EXCHANGES[speaker];
  if (keyed && seed % 4 === 0) return keyed;
  return pick(PAIR_POOL, seed);
}