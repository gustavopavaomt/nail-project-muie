# Pendências

Decisões adiadas conscientemente. Cada item diz **o que falta**, **por que foi
adiado** e **o que já está preparado** pra receber a implementação.

---

## 1. Pagamento do sinal de 50% — ADIADO

**Status:** adiado em 07/08/2026 pra destravar o MVP funcional.

### O que o produto pede

`01_PRODUCT_VISION.md` lista "Pagamento de sinal (50%)" no MVP, e o print mostra a
tela de resumo com `Valor total` / `Entrada (50%)` / `Saldo no atendimento`,
seletor de PIX e botão **PAGAR ENTRADA**.

### O que existe hoje

O fluxo vai até a confirmação **sem cobrar nada**. A tela de resumo continua
mostrando a divisão dos valores (é informação útil pra cliente saber quanto levar),
mas o botão confirma o agendamento em vez de abrir pagamento. O combinado do sinal
acontece pelo WhatsApp, como já acontece hoje no negócio da Adriana.

### O que já está preparado

- **Valores em centavos** (`priceFromCents`), nunca float. `Math.round(total / 2)`
  pra entrada não introduz erro de arredondamento. Isso é o que evita a classe de
  bug em que R$ 179,99 vira R$ 89,995 e some um centavo entre o app e o extrato.
- `Booking` já tem os campos `totalCents`, `depositCents` e `paymentStatus`
  (`"pending" | "paid"`), então plugar o provedor não muda o modelo de dados.
- O botão da tela de resumo é o único ponto que precisa mudar de "confirma" pra
  "confirma e cobra".

### O que falta decidir antes de implementar

1. **Provedor.** Mercado Pago e Asaas têm PIX nativo e são os mais usados por
   autônomo no Brasil; Stripe só ganhou PIX recentemente e cobra mais caro.
2. **Chave PIX x PIX via API.** Chave estática é grátis mas exige conferência
   manual do comprovante. Via API tem webhook de confirmação e taxa por transação.
3. **Política de reembolso.** Se a cliente cancela com 24h, o sinal volta? Isso
   muda o fluxo de estorno e o texto da confirmação.
4. **Quem é o titular da conta** que recebe — precisa ser a Adriana, com CNPJ ou CPF.

### Onde mexer quando voltar

- `src/lib/services.ts` — valores
- `src/lib/bookings.ts` — `paymentStatus` e transição de estado
- `src/app/(booking)/agendar/[servico]/resumo/` — o botão e o bloco de pagamento
- **novo**: webhook de confirmação (Route Handler) + reconciliação

---

## 2. Persistência em Firestore — PARCIAL

**Status:** a camada existe, o banco não.

Os agendamentos são gravados por `src/lib/bookings.ts`, que hoje guarda em memória
do processo. **Isso significa que reiniciar o servidor apaga tudo** — serve pra
validar o fluxo, não pra produção.

O que falta: projeto Firebase criado e as credenciais em `.env.local`. A troca é
dentro de `createBooking` / `getBooking`; nenhuma tela muda.

Guest-first já está respeitado no modelo: o agendamento nasce **sem `uid`**,
identificado por telefone. Quando a área logada existir, os agendamentos antigos
são reivindicados por esse telefone.

---

## 3. Dados reais do estúdio — PENDENTE

`src/lib/studio.ts` tem placeholder de **WhatsApp**, **endereço** e **política de
cancelamento**. O WhatsApp é o mais urgente: é o link mais clicado do menu e hoje
aponta pra um número inexistente.

Também são placeholder:

- **Fotos dos serviços** (`public/placeholders/*.png` — gradientes gerados)
- **Preços** (os do print: 180 / 90 / 120 / 50)
- **Horário de funcionamento** e **antecedência mínima** (`src/lib/availability.ts`):
  hoje terça a sábado, 09:00–12:00 e 13:00–19:00, com 2h de antecedência

---

## 4. Telas ainda não construídas

| Tela | Rota | Sprint |
| --- | --- | --- |
| Início (área logada) | `/inicio` | 5 |
| Catálogo com galeria | `/servicos` | 2 (parcial) |
| Perfil / login | `/perfil` | 5 |
| Dashboard da profissional | — | 6 |
