import { notFound, redirect } from "next/navigation";
import { TimeSlots } from "@/components/booking/time-slots";
import { getSlots } from "@/lib/availability";
import { formatFullDate } from "@/lib/date";
import { getService } from "@/lib/services";

export const metadata = { title: "Escolha o horário" };

export default async function EscolherHorarioPage({
  params,
  searchParams,
}: PageProps<"/agendar/[servico]/horario">) {
  const { servico } = await params;
  const { data, mes } = await searchParams;

  const service = await getService(servico);
  if (!service) notFound();

  // Sem data na URL nao ha o que listar. Pode acontecer se a cliente receber um
  // link truncado no WhatsApp — devolve pro calendario em vez de quebrar.
  if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const suffix = typeof mes === "string" ? `?mes=${mes}` : "";
    redirect(`/agendar/${servico}/data${suffix}`);
  }

  const slots = await getSlots(servico, data);

  return (
    <div className="flex flex-1 flex-col px-4">
      <h1 className="text-ink text-[19px] font-semibold">Escolha o horário</h1>
      <p className="text-muted mt-1 text-[13px]">{formatFullDate(data)}</p>

      {slots.length === 0 ? (
        <p className="text-muted mt-8 text-center text-sm">
          Nenhum horário disponível nesse dia.
        </p>
      ) : (
        <TimeSlots serviceSlug={servico} date={data} slots={slots} />
      )}
    </div>
  );
}
