"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StickyAction } from "@/components/ui/sticky-action";
import {
  buildMonthGrid,
  formatMonthTitle,
  shiftMonth,
  toISODate,
  toMonthParam,
  WEEKDAY_LABELS,
  type ISODate,
} from "@/lib/date";

/*
  Calendario de escolha de data.

  O mes visivel mora na URL (?mes=2026-08) e nao em estado local: assim a troca de
  mes e um Link normal, o Server Component busca a disponibilidade do mes novo, e
  o botao voltar do navegador funciona. So a selecao do dia e estado de cliente.
*/
export function Calendar({
  serviceSlug,
  year,
  month,
  availableDates,
  currentMonthParam,
}: {
  serviceSlug: string;
  year: number;
  month: number;
  availableDates: ISODate[];
  currentMonthParam: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<ISODate | null>(null);

  const available = new Set(availableDates);
  const grid = buildMonthGrid(year, month);

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const now = new Date();
  // Nao deixa navegar pra tras do mes corrente: nao ha o que agendar no passado.
  const canGoBack = toMonthParam(year, month) > toMonthParam(now.getFullYear(), now.getMonth() + 1);

  const href = (y: number, m: number) =>
    `/agendar/${serviceSlug}/data?mes=${toMonthParam(y, m)}`;

  return (
    <>
      <div
        className="bg-card border-line mt-4 rounded-md border p-4"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between">
          {canGoBack ? (
            <Link
              href={href(prev.year, prev.month)}
              aria-label="Mês anterior"
              className="text-ink flex size-9 items-center justify-center rounded-full"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </Link>
          ) : (
            <span className="size-9" aria-hidden="true" />
          )}

          <h2 className="text-ink text-[15px] font-semibold" aria-live="polite">
            {formatMonthTitle(year, month)}
          </h2>

          <Link
            href={href(next.year, next.month)}
            aria-label="Próximo mês"
            className="text-ink flex size-9 items-center justify-center rounded-full"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-muted py-2 text-center text-[10px] tracking-wider"
            >
              {label}
            </div>
          ))}

          {grid.map((date) => {
            const iso = toISODate(date);
            const inMonth = date.getMonth() === month - 1;
            const isAvailable = available.has(iso);
            const isSelected = selected === iso;

            return (
              <button
                key={iso}
                type="button"
                disabled={!isAvailable}
                onClick={() => setSelected(iso)}
                aria-pressed={isSelected}
                aria-label={
                  isAvailable ? `Dia ${date.getDate()}, disponível` : undefined
                }
                className={[
                  "flex h-10 items-center justify-center rounded-[10px] text-[13px] transition-colors",
                  isSelected
                    ? "bg-primary font-semibold text-white"
                    : isAvailable
                      ? "bg-primary-200 text-primary-800 font-semibold"
                      : inMonth
                        ? "text-ink"
                        : "text-muted/40",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-muted mt-4 flex items-center gap-5 text-[12px]">
        <span className="flex items-center gap-2">
          <span className="bg-primary-300 size-3 rounded-full" aria-hidden="true" />
          Disponível
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-line size-3 rounded-full" aria-hidden="true" />
          Indisponível
        </span>
      </div>

      <StickyAction>
        <button
          type="button"
          disabled={!selected}
          onClick={() =>
            router.push(
              `/agendar/${serviceSlug}/horario?data=${selected}&mes=${currentMonthParam}`,
            )
          }
          className="bg-primary min-h-14 w-full rounded-sm text-[15px] font-semibold tracking-[0.08em] text-white uppercase transition-opacity active:opacity-80 disabled:opacity-40"
        >
          Continuar
        </button>
      </StickyAction>
    </>
  );
}
