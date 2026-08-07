import { getBooking } from "@/lib/bookings";
import { parseISODate } from "@/lib/date";
import { getService } from "@/lib/services";
import { STUDIO } from "@/lib/studio";

/*
  Gera o .ics do "Adicionar ao calendario".

  HORA FLUTUANTE de proposito: DTSTART sai como 20260812T090000, sem Z e sem TZID.

  - Com `Z` o horario seria UTC e o Google Calendar mostraria 09:00 como 06:00 pra
    quem esta em Brasilia.
  - Com `TZID=America/Sao_Paulo` seria correto, mas exige um bloco VTIMEZONE
    completo junto, e cliente que nao entende o TZID descarta o evento.

  Hora flutuante significa "esse horario no relogio local de quem abrir" — que e
  exatamente a semantica certa aqui: a cliente esta no mesmo fuso do estudio.
*/

/** RFC 5545: virgula, ponto-e-virgula, barra e quebra de linha sao especiais. */
function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function stamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `T${p(d.getHours())}${p(d.getMinutes())}00`
  );
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/ics/[id]">,
) {
  const { id } = await params;

  const booking = await getBooking(id);
  if (!booking) return new Response("Not found", { status: 404 });

  const service = await getService(booking.serviceSlug);
  const duration = service?.durationMinutes ?? 60;

  const [h, m] = booking.time.split(":").map(Number);
  const start = parseISODate(booking.date);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + duration * 60_000);

  const now = new Date();
  const utcStamp =
    now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  // RFC 5545 exige CRLF entre as linhas.
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Adriana Nail Designer//Agendamento//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.id}@adriana-nail-designer`,
    `DTSTAMP:${utcStamp}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(`${booking.serviceName} — ${STUDIO.name}`)}`,
    `DESCRIPTION:${esc(
      `Código do agendamento: ${booking.id}\nCliente: ${booking.customerName}`,
    )}`,
    `LOCATION:${esc(STUDIO.address)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(`${booking.serviceName} em 2 horas`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="agendamento-${booking.id}.ics"`,
    },
  });
}
