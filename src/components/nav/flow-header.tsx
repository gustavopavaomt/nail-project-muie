"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, MoreHorizontal, X } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SheetItem } from "@/components/ui/sheet-item";
import { whatsappLink } from "@/lib/studio";

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="text-ink active:bg-primary-50 -ml-2 flex size-10 items-center justify-center rounded-full transition-colors"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Mais opções"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          className="text-muted active:bg-primary-50 -mr-2 flex size-10 items-center justify-center rounded-full transition-colors"
        >
          <MoreHorizontal size={20} aria-hidden="true" />
        </button>
      </header>

      <BottomSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Precisa de ajuda?"
      >
        <nav className="flex flex-col pb-2">
          <SheetItem
            icon={MessageCircle}
            label="Falar no WhatsApp"
            href={whatsappLink("Oi! Estou agendando pelo app e preciso de ajuda")}
          />
          {/* Desistir e uma saida legitima: escondida atras do "...", mas sem
              fricção artificial quando a cliente decide sair. */}
          <SheetItem
            icon={X}
            label="Cancelar agendamento"
            tone="danger"
            onClick={() => {
              setMenuOpen(false);
              router.push("/agendar");
            }}
          />
        </nav>
      </BottomSheet>
    </>
  );
}
