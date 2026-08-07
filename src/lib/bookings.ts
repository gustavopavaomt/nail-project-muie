import type { ISODate } from "./date";

/*
  Agendamentos.

  GUEST-FIRST: um Booking nasce SEM `uid`. A cliente e identificada por telefone,
  porque o funil inteiro roda sem login. Quando a area logada existir, os
  agendamentos antigos sao reivindicados casando o telefone. Se o modelo exigisse
  uid agora, isso viraria migracao depois.

  PERSISTENCIA: hoje e um Map em memoria do processo — reiniciar o servidor apaga
  tudo. Serve pra validar o fluxo, nao pra producao. Ver docs/PENDENCIAS.md.
  Trocar por Firestore mexe so em createBooking/getBooking.

  DINHEIRO EM CENTAVOS, sempre. Total 17999 dividido em float daria 89,995 e o
  centavo sumiria entre o app e o extrato. Math.round no inteiro nao tem esse
  problema.
*/

export type PaymentStatus = "pending" | "paid";

export type Booking = {
  id: string;
  serviceSlug: string;
  serviceName: string;
  date: ISODate;
  time: string; // "14:00"
  customerName: string;
  customerPhone: string; // so digitos
  /** Snapshot da duracao no momento do agendamento. Se a Adriana mudar a duracao
      do servico depois, os agendamentos ja feitos mantem o bloco que reservaram. */
  durationMinutes: number;
  totalCents: number;
  depositCents: number;
  /** Sempre "pending" enquanto o pagamento do sinal for pendencia. */
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO
  /** Nulo ate a cliente criar conta. Guest-first. */
  uid: string | null;
};

/*
  O store precisa morar em globalThis, nao num `const` de modulo.

  Em dev o Next avalia o mesmo modulo em contextos separados (bundle das paginas x
  bundle dos Route Handlers), e o hot reload recria os modulos. Com `const` de
  modulo, o agendamento gravado pela Server Action e invisivel pro route do .ics —
  foi exatamente o 404 que apareceu no teste ponta a ponta. Prender no globalThis
  garante uma instancia so. Mesmo padrao que se usa pra client de banco em dev.
*/
const globalStore = globalThis as typeof globalThis & {
  __bookings?: Map<string, Booking>;
};
const store: Map<string, Booking> = (globalStore.__bookings ??= new Map());

/** Metade do total, arredondada pro centavo. */
export function depositFor(totalCents: number): number {
  return Math.round(totalCents / 2);
}

/** Codigo curto e legivel, pra cliente citar no WhatsApp. */
function newId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export type NewBooking = Omit<
  Booking,
  "id" | "createdAt" | "paymentStatus" | "uid" | "depositCents"
>;

export async function createBooking(input: NewBooking): Promise<Booking> {
  const booking: Booking = {
    ...input,
    id: newId(),
    depositCents: depositFor(input.totalCents),
    paymentStatus: "pending",
    uid: null,
    createdAt: new Date().toISOString(),
  };
  store.set(booking.id, booking);
  return booking;
}

export async function getBooking(id: string): Promise<Booking | null> {
  return store.get(id) ?? null;
}

/** Agendamentos de um dia, de todos os servicos — a agenda da Adriana e uma so. */
export async function getBookingsByDate(date: ISODate): Promise<Booking[]> {
  return [...store.values()].filter((b) => b.date === date);
}

/** Base pra area da cliente (Sprint 5) reivindicar agendamentos por telefone. */
export async function getBookingsByPhone(phone: string): Promise<Booking[]> {
  return [...store.values()]
    .filter((b) => b.customerPhone === phone)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}
