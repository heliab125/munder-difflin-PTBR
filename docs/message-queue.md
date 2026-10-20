# A fila de mensagens — como qualquer coisa é digitada no terminal de um agente

Cada agente roda uma CLI real em um PTY real. Essa CLI tem exatamente uma linha de
entrada, e você não é o único que quer usá-la: você digita diretamente no terminal, e
o harness também tem mensagens próprias para entregar. Este documento é o contrato
de quem fica com essa linha e quando.

Duas filas diferentes são chamadas de "a fila". Elas não são a mesma coisa:

| Nome | Onde vive | O que guarda |
|---|---|---|
| **Fila MD** | o harness (store zustand, por agente) | mensagens estacionadas pelo *Munder Difflin* até o terminal daquele agente ficar livre |
| **Fila do Claude** | dentro do próprio Claude Code | texto que o Claude Code aceitou mas ainda não começou a executar |

Tudo abaixo é sobre a **fila MD**. O harness não consegue ver a fila do Claude e
nunca raciocina sobre ela.

---

## 1. Um único portão

Um só lugar digita mensagens automáticas no PTY de um agente vivo: o **loop de
drenagem**, efeito #4 de `useHive.ts`. Tudo o que quer alcançar um agente em execução
enfileira na fila MD e deixa a drenagem decidir quando.

(A única exceção é a sequência de boot do agente god, `useHive.ts:284`, que escreve
o comando de controle remoto e o prompt de orientação diretamente. Esse PTY foi
criado milissegundos antes e está coberto pela janela de tolerância de boot, então
não há rascunho do usuário onde ele possa cair.)

```
composer / entrada do Slack ─┐
nudge da caixa de entrada (#3) ──┼──▶ enqueueMessage(agentId, text) ──▶ fila MD ──▶ drenagem (#4) ──▶ PTY
/compact agendado (#6) ──┘
```

Isso é estrutural. Quando o nudge da caixa de entrada escrevia direto no terminal,
era um segundo escritor com a própria ideia de quando o prompt estava livre — e o
texto dele caía em cima de uma linha pela metade, então o nudge e a frase do usuário
eram enviados juntos como um único prompt embaralhado. Rotear pela fila significa que
um loop é dono de toda decisão de "este terminal está livre?", e o nudge não precisa
de lógica de prompt própria.

A drenagem roda a cada mudança no store (com debounce de 200 ms, para que uma rajada
de saída do PTY se agrupe) mais um tick de segurança a cada 3 s.

## 2. O que a drenagem verifica

A frente da fila MD de um agente só é entregue quando **todas** estas condições valem:

| Condição | Por quê |
|---|---|
| status do agente é `idle` | não interromper um turno em execução |
| entrega automática não pausada — **ou a mensagem foi liberada manualmente** | interruptor do andar inteiro (Central de Comando); veja abaixo |
| passou da janela de tolerância de boot | a CLI ainda está desenhando o banner |
| `isTerminalAutomationSafe(ptyId)` | o usuário é dono do prompt — veja abaixo |
| 4,5 s desde a última entrega a este agente | envios em sequência travam a TUI |

**Liberação manual (v0.3.5).** Enquanto a entrega automática do andar está pausada,
cada linha enfileirada mostra um link **enviar agora**. Clicar nele define
`manual: true` naquela mensagem e a move para a frente da fila. A drenagem então
ignora **somente a verificação de pausa** para essa mensagem — todas as outras
condições desta tabela continuam valendo, então uma mensagem liberada manualmente
espera o ócio, respeita seu rascunho/seletor e é confirmada da mesma forma. O portão
de pausa mantém todo o resto intacto.

A entrega só é confirmada depois que ambas as escritas no PTY (o texto e depois o
envio) deram certo. Uma falha deixa a mensagem visível na fila e ela tenta de novo.

## 3. O usuário é dono do prompt

`isTerminalAutomationSafe` é o portão que protege o que você digita. Ele recusa a
entrega enquanto qualquer um destes estiver ativo (`terminalAutomation.ts`):

| Bloqueio | Definido por | Limpo por |
|---|---|---|
| `exited` | o PTY morreu | novo spawn |
| `picker` | você enviou um comando tipo `/model` que abre um menu | um Enter / Escape / Ctrl-C digitado naquele terminal, ou expiração |
| `draft` | você tem texto não enviado no prompt | enviar ou limpar o texto, ou expiração |
| `settling` | uma janela curta de repintura depois que a linha foi liberada | tempo |

Tanto `picker` quanto `draft` expiram após **30 minutos** (`STALE_PICKER_MS`,
`STALE_INPUT_MS`). A expiração existe porque os dois sinais são inferidos, não
reportados — um seletor fechado de um jeito que não conseguimos observar, ou um
sinal de rascunho deixado por uma TUI que engoliu teclas, travaria a fila MD daquele
agente pelo resto da sessão.

Duas regras sobre o que acontece quando um bloqueio expira:

- **A automação nunca apaga o seu texto.** Expirar significa que a mensagem
  enfileirada é digitada *depois* do que estiver na linha; as duas se fundem em um
  prompt. Uma versão anterior enviava Ctrl-U primeiro, o que destruía silenciosamente
  rascunhos reais que só tinham ficado parados por um minuto.
- **A automação nunca fecha o seu menu.** Não enviamos Escape em um seletor. Você
  pode tê-lo aberto de propósito e se afastado; derrubá-lo para abrir espaço para uma
  mensagem enfileirada não é decisão do harness, e não temos como verificar se o
  Escape funcionou. O composer tem um botão que faz isso — porque aí *você* pediu.

As duas janelas são longas de propósito. Tratar um rascunho vivo como abandonado é o
erro caro; deixar uma mensagem enfileirada parada por mais tempo é o erro barato.

## 4. Ler o prompt em vez de modelá-lo

`inputDirty` é inferido contando teclas em `term.onData`. Esse modelo deriva: uma TUI
que engole teclas para a própria interface deixa a contagem acima de zero enquanto o
prompt está visivelmente vazio — um **rascunho fantasma**, que bloqueia a fila MD
contra um texto que não existe.

O xterm já mantém a tela renderizada, então `promptLineHasText` a lê diretamente
(`term.buffer.active`, a linha em `baseY + cursorY`, removendo o chrome do prompt).

É deliberadamente **unidirecional**: a leitura do buffer só pode *limpar* um rascunho,
nunca inventar um.

- a tela diz vazia ⇒ acredite, remova o bloqueio
- a tela diz texto, ou não pode ser lida ⇒ volte para a contagem de teclas

A assimetria é o ponto, porque os dois erros não custam o mesmo. Um "vazio" errado
abre o portão e funde uma mensagem enfileirada no que você está escrevendo. Um "tem
texto" errado apenas estaciona a mensagem até o rascunho expirar. Então o erro barato
é o que permitimos acontecer.

Um caso em que a tela não é evidência alguma: `inputDirty` é definido no momento em
que você pressiona uma tecla, mas o caractere só chega ao buffer do xterm depois que
o PTY o ecoa de volta. Nessa lacuna o buffer ainda mostra o estado anterior, então
uma leitura de um rascunho recém-iniciado retornaria "vazio" — a direção cara. Uma
leitura dentro de `ECHO_GRACE_MS` (1 s) da última tecla, portanto, retorna "não sei"
e não limpa nada.

## 5. Vendo por que nada está sendo entregue

Uma fila MD retida costumava parecer exatamente um agente ocioso sem nada para fazer.
O selo `typing` (`--cth-status-typing`, rótulo **"seu rascunho"**) corrige isso: ele
aparece nos cartões de agente e na lista em tela cheia sempre que
`hasTerminalDraft(ptyId)` é verdadeiro.

Não é um status de agente e nunca é armazenado no agente — o parser do PTY é dono
desse campo e o sobrescreveria. É derivado na renderização a partir da mesma detecção
de rascunho que o portão usa, então o selo reporta o mesmo rascunho que o portão vê.

Ele **não** aplica a expiração de 30 minutos que o portão aplica. Passada essa janela,
o portão começa a entregar enquanto o selo ainda mostra "seu rascunho" — o que é
honesto: seu texto realmente continua no prompt. O selo responde "meu texto está aí",
não "a fila está bloqueada".

## 6. Onde o código vive

| Arquivo | Papel |
|---|---|
| `src/renderer/src/components/terminalAutomation.ts` | política pura — bloqueios, janelas de expiração. Sem DOM, totalmente testada (`test/terminal-automation.test.cjs`) |
| `src/renderer/src/components/terminalPool.ts` | o xterm agrupado por PTY; leituras de buffer, latches, `isTerminalAutomationSafe`, `hasTerminalDraft` |
| `src/renderer/src/hooks/useHive.ts` | efeito #3 nudge da caixa de entrada (enfileira), efeito #4 drenagem (o único escritor), efeito #6 `/compact` agendado |
| `src/renderer/src/store/store.ts` | as próprias filas MD + persistência do agente |