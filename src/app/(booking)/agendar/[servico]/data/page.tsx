import { notFound } from "next/navigation";
import { Calendar } from "@/components/booking/calendar";
import { getAvailableDates } from "@/lib/availability";
import { parseMonthParam, toMonthParam } from "@/lib/date";
import { getService } from "@/lib/services";

export const metadata = { title: "Escolha a data" };

export default async function EscolherDataPage({
  params,
  searchParams,
}: PageProps<"/agendar/[servico]/data">) {
  const { servico } = await params;
  const { mes } = await searchParams;

  const service = await getService(servico);
  if (!service) notFound();

  const { year, month } = parseMonthParam(
    typeof mes === "string" ? mes : undefined,
  );
  const availableDates = await getAvailableDates(servico, year, month);

  return (
    // flex-1 + flex-col e o que faz o mt-auto do StickyAction ter pra onde crescer
    <div className="flex flex-1 flex-col px-4">
      <h1 className="text-ink text-[19px] font-semibold">Escolha a data</h1>

      <Calendar
        serviceSlug={servico}
        year={year}
        month={month}
        availableDates={availableDates}
        currentMonthParam={toMonthParam(year, month)}
      />
    </div>
  );
}
