"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

/*
  Header do funil de agendamento. No print e so "<-" a esquerda e "..." a direita,
  sem titulo e sem bottom nav — o titulo da etapa fica no corpo da tela
  ("Escolha a data", "Escolha o horario").

  router.back() e nao um href fixo: as etapas sao lineares e voltar precisa
  devolver a cliente exatamente pra onde ela estava, inclusive se ela chegou ali
  por um link direto.
*/
export function FlowHeader() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="text-ink -ml-2 flex size-10 items-center justify-center rounded-full"
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </button>

      {/* TODO: abre um menu (cancelar agendamento, falar no WhatsApp) — Sprint 3 */}
      <button
        type="button"
        aria-label="Mais opções"
        className="text-muted -mr-2 flex size-10 items-center justify-center rounded-full"
      >
        <MoreHorizontal size={20} aria-hidden="true" />
      </button>
    </header>
  );
}
