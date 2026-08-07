import Link from "next/link";
import { CalendarDays, CalendarPlus, Check, Clock, MessageCircle, User } from "lucide-react";
import { getBooking } from "@/lib/bookings";
import { formatFullDate } from "@/lib/date";
import { formatBRL } from "@/lib/services";
import { whatsappLink } from "@/lib/studio";

export const metadata = { title: "Agendamento confirmado" };

export default async function ConfirmadoPage({
  searchParams,
}: PageProps<"/agendar/[servico]/confirmado">) {
  const { id } = await searchParams;

  const booking = typeof id === "string" ? await getBooking(id) : null;

  // O store e em memoria (docs/PENDENCIAS.md #2): um restart do servidor apaga os
  // agendamentos. Em vez de 404 numa tela de sucesso, explica e oferece saida.
  if (!booking) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-ink text-[15px]">
          Não encontramos esse agendamento.
        </p>
        <p className="text-muted mt-2 text-[13px]">
          Fale com a Adriana no WhatsApp que ela confirma pra você.
        </p>
        <Link
          href={whatsappLink("Oi! Fiz um agendamento pelo app e queria confirmar")}
          className="bg-primary mt-6 flex min-h-12 items-center justify-center rounded-sm px-6 text-[14px] font-semibold text-white"
        >
          Falar no WhatsApp
        </Link>
      </div>
    );
  }

  const mensagem = `Oi Adriana! Confirmei meu agendamento pelo app 💅

Código: ${booking.id}
Serviço: ${booking.serviceName}
Data: ${formatFullDate(booking.date)} às ${booking.time}
Nome: ${booking.customerName}

Queria combinar o sinal de ${formatBRL(booking.depositCents)}.`;

  return (
    <div className="flex flex-1 flex-col px-4 pb-8">
      <div className="flex flex-col items-center pt-6 text-center">
        <span
          className="bg-primary flex size-16 items-center justify-center rounded-full"
          aria-hidden="true"
        >
          <Check size={30} strokeWidth={2.5} className="text-white" />
        </span>
        <h1 className="font-display text-ink mt-5 text-[26px] leading-tight">
          Agendamento
          <span className="block">confirmado! 🎉</span>
        </h1>
        <p className="text-muted mt-3 text-[13px]">
          Você receberá lembretes antes do seu horário.
        </p>
      </div>

      <div
        className="bg-card border-line mt-7 rounded-md border p-4"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <p className="text-ink text-[15px] font-semibold">
          {booking.serviceName}
        </p>
        <div className="mt-3 flex flex-col gap-2.5">
          {[
            { icon: CalendarDays, label: formatFullDate(booking.date) },
            { icon: Clock, label: booking.time },
            { icon: User, label: "Adriana" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon
                size={16}
                strokeWidth={1.7}
                className="text-muted shrink-0"
                aria-hidden="true"
              />
              <span className="text-ink text-[14px]">{label}</span>
            </div>
          ))}
        </div>
        <p className="border-line text-muted mt-4 border-t pt-3 text-[12px]">
          Código do agendamento:{" "}
          <span className="text-ink font-semibold">{booking.id}</span>
        </p>
      </div>

      {/*
        Enquanto o pagamento online for pendencia, a acao principal daqui e levar a
        cliente pro WhatsApp com o resumo pronto — e ali que o sinal e combinado.
        A mensagem ja vai preenchida pra ela nao ter que redigitar nada.
      */}
      <Link
        href={whatsappLink(mensagem)}
        className="bg-primary mt-6 flex min-h-14 items-center justify-center gap-2 rounded-sm text-[15px] font-semibold tracking-[0.06em] text-white uppercase transition-opacity active:opacity-80"
      >
        <MessageCircle size={18} aria-hidden="true" />
        Combinar o sinal
      </Link>

      <a
        href={`/ics/${booking.id}`}
        className="border-primary text-primary active:bg-primary-50 mt-3 flex min-h-14 items-center justify-center gap-2 rounded-sm border text-[15px] font-semibold tracking-[0.06em] uppercase transition-colors"
      >
        <CalendarPlus size={18} aria-hidden="true" />
        Adicionar ao calendário
      </a>

      <Link
        href={`/agendar`}
        className="text-muted mt-6 text-center text-[13px] underline underline-offset-4"
      >
        Agendar outro serviço
      </Link>
    </div>
  );
}
