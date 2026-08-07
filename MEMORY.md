# MEMORY — estado do projeto

> Ponto de partida pra qualquer sessão de agente, em qualquer máquina.
> **Atualize este arquivo ao fim de cada bloco de trabalho.**
> Última atualização: 07/08/2026

---

## O que é

PWA de agendamento para **Adriana**, nail designer. Construído pelo Gustavo
(desenvolvedor) para a esposa.

⚠️ **O print de referência diz "Studio da Ana" — isso é placeholder do mockup.**
O nome é **Adriana**, e a marca é **Adriana Nail Designer**. Nunca escrever "Ana"
na UI. ("Ana Paula" nas telas de exemplo é uma cliente fictícia, essa pode ficar.)

## Stack

| | |
| --- | --- |
| Framework | Next.js **16.3** (App Router, Turbopack) |
| Linguagem | TypeScript |
| Estilo | Tailwind **v4** (`@theme static` em `src/app/globals.css`) |
| Ícones | lucide-react |
| Backend | **Firebase** (decidido, ainda não integrado) |
| Repo | `gustavopavaomt/nail-project-muie` (privado), branch `main` |

`npm run dev` — atenção: a porta 3000 costuma estar ocupada, o Next cai na **3001**.

## Fontes da verdade

1. **`ref/src/prints/image-referencia.png`** — o print. Manda no visual, **acima**
   dos `.md`. O `02_DESIGN_SYSTEM.md` está incompleto (só 6 cores, uma fonte, sem
   radius nem sombra).
2. **`ref/src/prints/unha-home.png`** — ilustração oficial da marca.
3. **`docs/PENDENCIAS.md`** — o que foi adiado e por quê. **Ler antes de começar.**
4. `ref/src/0*.md` — visão de produto, design system, ordem das sprints.

**Exceção ao print:** interação de gesto. O print é estático e não representa
gesto; num PWA mobile o padrão nativo ganha (foi assim que a lista de horários
virou wheel picker).

## Estado atual

| Sprint | O que | Status |
| --- | --- | --- |
| 1 | Setup, design tokens, shells de navegação | ✅ |
| 2 | Landing + catálogo de serviços | ✅ |
| 3 | Calendário + wheel de horário | ✅ |
| 4 | Resumo + confirmação | ✅ **sem pagamento** (ver PENDENCIAS #1) |
| 5 | Área da cliente logada | ⬜ |
| 6 | Dashboard da profissional | ⬜ |

**O funil funciona ponta a ponta:** landing → serviço → data → horário → resumo →
confirmação → WhatsApp com o resumo pronto + `.ics` pro calendário.

Telas ainda em stub: `/inicio`, `/servicos`, `/perfil`.
`/tokens` é página de dev (swatches contra o print) — remover quando estabilizar.

## Decisões que não são óbvias no código

**Guest-first.** O funil inteiro roda sem login. `Booking` nasce **sem `uid`**,
identificado por telefone. Quando a área logada existir, os agendamentos antigos
são reivindicados casando o telefone. Não introduzir login antes da confirmação.

**Quatro route groups, quatro shells.** `(site)` sem chrome · `(app)` com header +
bottom nav · `(booking)` com header de funil e **sem bottom nav** · `(studio)` ainda
não existe. A bottom nav some no funil de propósito: barra fixa com 4 saídas no
rodapé, a três toques de pagar, é convite pra abandonar.

**Dinheiro sempre em centavos** (`priceFromCents`, `totalCents`). Float faz
R$ 179,99 virar 89,995 no split de 50% e some um centavo.

**Datas como `"YYYY-MM-DD"` local, nunca `new Date(string)`.** `new Date("2026-08-12")`
é meia-noite **UTC**, que em Brasília vira 11/08 21:00 — agendamento de quarta
aparece como terça. Sempre `parseISODate()` / `toISODate()` de `src/lib/date.ts`.

**Mês do calendário mora na URL** (`?mes=2026-09`), não em estado. Seta de mês é
`<Link>`, o Server Component busca o mês novo, e o voltar do navegador funciona.

**Disponibilidade depende do serviço, não só do dia.** Alongamento (2h30) não cabe
num vão de 1h. E o bloqueio é por **intervalo**: um agendamento das 09:00 com 150min
derruba 09:30, 10:00, 10:30 e 11:00 também.

**`@theme static`, não `@theme`.** O Tailwind v4 só emite no `:root` as variáveis
usadas por algum utilitário. Vários tokens são consumidos direto em CSS (gradiente
do mauve, box-shadow) — sem `static` eles somem do bundle em silêncio.

**Mauve tem token próprio.** O header da área da cliente é `hsl(327,30%,72%)`,
mais roxo e menos saturado que a primária `hsl(338,42%,59%)`. Não é a primária
clareada; usar `primary-300` ali sai visivelmente errado.

## Armadilhas já pagas — não repetir

**`<dialog>` estilizado precisa do `display` preso ao `[open]`.** O UA esconde com
`dialog:not([open]){display:none}`; um `display:flex` solto tem especificidade maior
e vale fechado — o sheet vira um retângulo transparente de tela inteira comendo
todos os cliques da página, sem nada visível denunciando.

**Store em memória tem que morar em `globalThis`.** Em dev o Next avalia o módulo em
contextos separados (páginas × Route Handlers) e o hot reload recria tudo. Com
`const` de módulo, o agendamento gravado pela Server Action fica invisível pro route
do `.ics` — 404 numa tela de sucesso.

**Revalidar o horário no servidor antes de gravar.** Entre abrir o resumo e apertar
confirmar passam minutos; sem revalidar, aceita dupla marcação e quem descobre é a
Adriana, com duas clientes na porta.

**`.ics` com hora flutuante** (`DTSTART:20260812T090000`, sem `Z` e sem `TZID`).
Com `Z` o Google mostra 09:00 como 06:00; com `TZID` exige bloco `VTIMEZONE` junto.

## Mobile — o PWA tem que parecer app nativo

Gustavo é explícito nisso: *"tudo aqui nesse pwa pensa em MOBILE style"*. Antes de
construir qualquer interação, perguntar como o Android/iOS nativo resolveria.

- Área de toque ≥ 44px (o wheel usa 52)
- `overscroll-behavior: contain` em **todo** scroller aninhado — sem isso o scroll
  interno arrasta a página e dispara pull-to-refresh no Android / bounce no iOS
- `scroll-snap-stop: always` pra fling forte não atravessar vários itens
- Snap por CSS, nunca por JS (JS briga com o momentum nativo)
- Input com `font-size` **≥ 16px**, senão o iOS dá zoom sozinho ao focar
- `navigator.vibrate?.()` pro tique tátil — **não existe em iOS**, chamada opcional
- `scrollend` só em Chrome 114+ / Safari 18+ — sempre ter fallback de debounce
- `env(safe-area-inset-bottom)` com `max(1rem, …)`: o Android reporta 0

## Como trabalhar com o Gustavo

- **Uma etapa por vez**, parando pra ele revisar. Ele é dev e quer decidir junto,
  não auditar código pronto. Explicar o *porquê*, não só o *o quê*.
- **Não commitar nem dar push sem ele pedir.** Ele valida rodando antes.
- Commits separados por decisão (setup / tokens / shells / telas), não commitão.
- **Validar UI com screenshot antes de entregar.** A extensão Claude-in-Chrome não
  conecta nesta máquina; usar Playwright instalado no **scratchpad** (nunca no
  `package.json` do projeto). Foi assim que apareceram o vazio no meio da landing,
  a ilustração com dedo faltando e o `<dialog>` bloqueando cliques.
- Ele escreve em português informal. Responder em português.

## Dados que ainda são placeholder

`src/lib/studio.ts` (WhatsApp ⚠️ urgente, endereço, política) ·
`src/lib/services.ts` (preços do print) · `public/placeholders/*.png` (gradientes,
não fotos) · horário de funcionamento e antecedência em `src/lib/availability.ts`.
