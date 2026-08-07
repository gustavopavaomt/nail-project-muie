import { getBookingsByDate } from "./bookings";
import { getService } from "./services";
import { parseISODate, toISODate, todayISO, type ISODate } from "./date";

/*
  Disponibilidade da agenda.

  MOCK deliberado: as regras abaixo (dias de atendimento, janela de almoco, slots
  ocupados) sao fixtures deterministicas. No Firestore isso vira duas colecoes —
  a agenda configurada pela Adriana e os agendamentos ja marcados — e so estas
  funcoes mudam. As telas nao sabem a diferenca.

  O que ja esta certo aqui e o CONTRATO: disponibilidade depende do servico, nao
  so do dia. Alongamento leva 2h30 e nao cabe num vao de 1h que sobrou entre dois
  agendamentos; esmaltacao cabe. Se a assinatura ignorasse o servico agora, a
  regra real nao teria onde entrar depois.
*/

/** Terca a sabado. Domingo e segunda o estudio nao abre. */
const WORKING_WEEKDAYS = new Set([2, 3, 4, 5, 6]); // getDay(): 0=dom

const OPENING = [
  { start: "09:00", end: "12:00" },
  { start: "13:00", end: "19:00" }, // almoco 12h-13h
];

const SLOT_MINUTES = 30;

/**
 * Antecedencia minima. Sem isso a cliente marca alongamento pras 13:00 as 12h55 e
 * a Adriana descobre em cima da hora. Duas horas dao margem pra ela ver e se
 * organizar. Valor de negocio — vira configuracao dela no dashboard.
 */
const MIN_NOTICE_MINUTES = 120;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Hash estavel: mesma data sempre gera a mesma agenda falsa entre server e client. */
function seed(iso: ISODate): number {
  let h = 0;
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) % 9973;
  return h;
}

function isWorkingDay(iso: ISODate): boolean {
  return WORKING_WEEKDAYS.has(parseISODate(iso).getDay());
}

function isPast(iso: ISODate): boolean {
  return iso < todayISO(); // ISO ordena lexicograficamente
}

export type Slot = {
  time: string; // "14:00"
  available: boolean;
};

export async function getSlots(
  serviceSlug: string,
  date: ISODate,
): Promise<Slot[]> {
  const service = await getService(serviceSlug);
  if (!service || !isWorkingDay(date) || isPast(date)) return [];

  const s = seed(date);
  const slots: Slot[] = [];

  /*
    Agendamentos ja feitos bloqueiam o horario — de qualquer servico, porque a
    agenda da Adriana e uma so.

    O bloqueio e por INTERVALO, nao por horario igual: um alongamento as 09:00
    ocupa ate 11:30, entao 09:30, 10:00, 10:30 e 11:00 tambem caem. Comparar so
    o horario de inicio deixaria marcar uma manutencao as 10:00 por cima.
  */
  const booked = (await getBookingsByDate(date)).map((b) => {
    const start = toMinutes(b.time);
    return { start, end: start + b.durationMinutes };
  });
  const collides = (start: number, end: number) =>
    booked.some((b) => start < b.end && b.start < end);

  // Se a data e hoje, horarios que ja passaram (ou estao dentro da antecedencia
  // minima) nao podem ser oferecidos.
  const now = new Date();
  const isToday = date === todayISO();
  const cutoff = isToday
    ? now.getHours() * 60 + now.getMinutes() + MIN_NOTICE_MINUTES
    : -Infinity;

  for (const window of OPENING) {
    const from = toMinutes(window.start);
    const to = toMinutes(window.end);
    // O ultimo slot precisa caber o servico inteiro dentro da janela.
    for (let t = from; t + service.durationMinutes <= to; t += SLOT_MINUTES) {
      if (t < cutoff) continue;
      // ~1/3 ocupados por fixture (some quando o Firestore entrar) + os
      // agendamentos reais ja gravados
      const occupied =
        (s + t) % 3 === 0 || collides(t, t + service.durationMinutes);
      slots.push({ time: toHHMM(t), available: !occupied });
    }
  }

  return slots;
}

/**
 * Datas do mes com pelo menos um horario livre.
 *
 * TODO(firestore): hoje isso roda getSlots dia a dia — 31 iteracoes. Contra o
 * banco vira 31 leituras por navegacao de mes. Substituir por uma consulta unica
 * do intervalo, agregando os agendamentos do mes de uma vez.
 */
export async function getAvailableDates(
  serviceSlug: string,
  year: number,
  month: number,
): Promise<ISODate[]> {
  const daysInMonth = new Date(year, month, 0).getDate();
  const out: ISODate[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = toISODate(new Date(year, month - 1, day));
    if (!isWorkingDay(iso) || isPast(iso)) continue;
    const slots = await getSlots(serviceSlug, iso);
    if (slots.some((s) => s.available)) out.push(iso);
  }

  return out;
}
