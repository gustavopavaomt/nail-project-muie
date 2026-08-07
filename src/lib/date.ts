/*
  Datas do agendamento sao tratadas como "YYYY-MM-DD" em horario LOCAL, nunca como
  instante UTC.

  O motivo e concreto: `new Date("2026-07-18")` e interpretado pelo JS como
  meia-noite UTC, e no fuso de Brasilia (UTC-3) isso vira 17/07 21:00 local. Um
  agendamento de sabado apareceria como sexta pra cliente. Por isso todo parse
  passa por parseISODate() e todo format por toISODate() — nunca `new Date(string)`
  direto.
*/

export type ISODate = string; // "YYYY-MM-DD"

export function parseISODate(iso: ISODate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(date: Date): ISODate {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

export function todayISO(): ISODate {
  return toISODate(new Date());
}

/** "2026-07" -> {year, month} com month 1-12. Invalido cai no mes corrente. */
export function parseMonthParam(param?: string): { year: number; month: number } {
  const now = new Date();
  if (!param) return { year: now.getFullYear(), month: now.getMonth() + 1 };
  const m = /^(\d{4})-(\d{2})$/.exec(param);
  if (!m) return { year: now.getFullYear(), month: now.getMonth() + 1 };
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) {
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }
  return { year, month };
}

export function toMonthParam(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function shiftMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const d = new Date(year, month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

/**
 * Grid do calendario: 6 semanas x 7 dias, sempre. Altura fixa evita o calendario
 * "pular" ao trocar de mes, que e o que acontece quando o numero de linhas varia.
 * Semana comeca na SEGUNDA, como no print.
 */
export function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month - 1, 1);
  // getDay(): 0=domingo. Queremos 0=segunda.
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month - 1, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

const MONTH_YEAR = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

/** "julho de 2026" -> "Julho 2026", como no print. */
export function formatMonthTitle(year: number, month: number): string {
  const raw = MONTH_YEAR.format(new Date(year, month - 1, 1));
  const noDe = raw.replace(" de ", " ");
  return noDe.charAt(0).toUpperCase() + noDe.slice(1);
}

const FULL_DATE = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** "Sábado, 18 de julho" */
export function formatFullDate(iso: ISODate): string {
  const raw = FULL_DATE.format(parseISODate(iso));
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export const WEEKDAY_LABELS = [
  "SEG",
  "TER",
  "QUA",
  "QUI",
  "SEX",
  "SÁB",
  "DOM",
] as const;
