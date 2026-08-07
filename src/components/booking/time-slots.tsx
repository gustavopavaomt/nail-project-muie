"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TimeWheel } from "./time-wheel";
import { StickyAction } from "@/components/ui/sticky-action";
import type { Slot } from "@/lib/availability";
import type { ISODate } from "@/lib/date";

/*
  Escolha do horario.

  Usa wheel picker (gesto de polegar, igual ao time picker nativo) em vez da lista
  do print. O print e um mockup estatico e nao tem como representar um gesto; num
  PWA que vai viver no celular, rolar e encaixar ganha de cacar o item certo numa
  lista de 12 botoes.

  Consequencia do formato: o wheel so oferece horarios LIVRES. Num picker nativo
  todo item e selecionavel — deixar horario ocupado ali faria o snap parar em algo
  que nao da pra escolher, e ia ler como bug. A informacao que se perde ao tirar os
  ocupados volta como contagem embaixo.
*/
export function TimeSlots({
  serviceSlug,
  date,
  slots,
}: {
  serviceSlug: string;
  date: ISODate;
  slots: Slot[];
}) {
  const router = useRouter();
  const available = slots.filter((s) => s.available).map((s) => s.time);
  const taken = slots.length - available.length;

  // Wheel sempre tem um item no centro, entao ja nasce com valor — igual ao
  // comportamento nativo. Nao existe estado "nada selecionado" aqui.
  const [selected, setSelected] = useState<string | null>(available[0] ?? null);

  if (available.length === 0) {
    return (
      <p className="text-muted mt-8 text-center text-sm">
        Nenhum horário livre nesse dia.
      </p>
    );
  }

  return (
    <>
      <div className="mt-6">
        <TimeWheel times={available} value={selected} onChange={setSelected} />
      </div>

      <p className="text-muted mt-3 text-center text-[12px]">
        {available.length} {available.length === 1 ? "horário" : "horários"}{" "}
        {available.length === 1 ? "livre" : "livres"}
        {taken > 0 && ` · ${taken} já ${taken === 1 ? "reservado" : "reservados"}`}
      </p>

      <StickyAction>
        <button
          type="button"
          disabled={!selected}
          onClick={() =>
            router.push(
              `/agendar/${serviceSlug}/resumo?data=${date}&hora=${selected}`,
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
