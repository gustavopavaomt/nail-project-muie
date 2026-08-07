import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, Clock, Info, User } from "lucide-react";
import { ConfirmForm } from "@/components/booking/confirm-form";
import { getSlots } from "@/lib/availability";
import { depositFor } from "@/lib/bookings";
import { formatFullDate } from "@/lib/date";
import { formatBRL, getService } from "@/lib/services";
import { STUDIO } from "@/lib/studio";

export const metadata = { title: "Resumo do agendamento" };

export default async function ResumoPage({
  params,
  searchParams,
}: PageProps<"/agendar/[servico]/resumo">) {
  const { servico } = await params;
  const { data, hora } = await searchParams;

  const service = await getService(servico);
  if (!service) notFound();

  const dateOk = typeof data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data);
  const timeOk = typeof hora === "string" && /^\d{2}:\d{2}$/.test(hora);
  if (!dateOk) redirect(`/agendar/${servico}/data`);
  if (!timeOk) redirect(`/agendar/${servico}/horario?data=${data}`);

  // Se o horario caiu entre a escolha e o resumo, devolve pra lista em vez de
  // deixar a cliente preencher os dados a toa.
  const slots = await getSlots(servico, data);
  if (!slots.some((s) => s.time === hora && s.available)) {
    redirect(`/agendar/${servico}/horario?data=${data}`);
  }

  const total = service.priceFromCents;
  const deposit = depositFor(total);

  return (
    <div className="flex flex-1 flex-col px-4">
      <h1 className="text-ink text-[19px] font-semibold">
        Resumo do agendamento
      </h1>

      <div
        className="bg-card border-line mt-4 flex items-stretch rounded-md border"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="relative w-[32%] shrink-0 overflow-hidden rounded-md">
          <Image
            src={service.image}
            alt=""
            fill
            sizes="(max-width: 448px) 32vw, 140px"
            className="object-cover"
          />
        </div>
        <div className="flex min-h-[84px] flex-col justify-center gap-1 px-4 py-3">
          <p className="text-ink text-[15px] font-semibold">{service.name}</p>
          <p className="text-muted text-[13px]">
            {Math.floor(service.durationMinutes / 60)}h
            {service.durationMinutes % 60 > 0 &&
              String(service.durationMinutes % 60).padStart(2, "0")}
          </p>
        </div>
      </div>

      <dl className="mt-4 flex flex-col gap-3">
        {[
          { icon: CalendarDays, label: formatFullDate(data) },
          { icon: Clock, label: hora },
          { icon: User, label: "Adriana" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon
              size={17}
              strokeWidth={1.7}
              className="text-muted shrink-0"
              aria-hidden="true"
            />
            <dd className="text-ink text-[14px]">{label}</dd>
          </div>
        ))}
      </dl>

      <div className="border-line mt-5 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-ink text-[14px] font-semibold">Valor total</span>
          <span className="text-ink text-[15px] font-semibold">
            {formatBRL(total)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-muted text-[13px]">Entrada (50%)</span>
          <span className="text-muted text-[13px]">{formatBRL(deposit)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-muted text-[13px]">Saldo no atendimento</span>
          <span className="text-muted text-[13px]">
            {formatBRL(total - deposit)}
          </span>
        </div>
      </div>

      {/*
        Pagamento online e pendencia (docs/PENDENCIAS.md). A divisao dos valores
        continua visivel de proposito — a cliente precisa saber quanto levar — mas
        o combinado do sinal acontece no WhatsApp, como ja acontece hoje.
      */}
      <p className="text-muted bg-primary-50/60 mt-4 flex items-start gap-2 rounded-sm p-3 text-[12px] leading-relaxed">
        <Info size={15} className="text-primary mt-px shrink-0" aria-hidden="true" />
        <span>
          O sinal de {formatBRL(deposit)} é combinado pelo WhatsApp depois da
          confirmação. {STUDIO.cancellationPolicy}
        </span>
      </p>

      <ConfirmForm serviceSlug={servico} date={data} time={hora} />
    </div>
  );
}
