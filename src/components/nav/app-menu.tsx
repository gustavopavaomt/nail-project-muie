"use client";

import { useState } from "react";
import { BookOpen, Info, MapPin, Menu, MessageCircle } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SheetItem } from "@/components/ui/sheet-item";
import { STUDIO, whatsappLink } from "@/lib/studio";

/*
  Menu do hamburger. Fica isolado num client component pra que o AppHeader continue
  sendo Server Component — so este pedacinho precisa de estado.

  O conteudo e deliberadamente secundario: e o que nao merece um slot na bottom nav.
*/
export function AppMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="text-ink active:bg-primary-50 -mr-2 flex size-10 items-center justify-center rounded-full transition-colors"
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={STUDIO.name}
      >
        <nav className="flex flex-col pb-2">
          <SheetItem
            icon={MessageCircle}
            label="Falar no WhatsApp"
            href={whatsappLink("Oi! Vim pelo app 💅")}
          />
          <SheetItem icon={BookOpen} label="Ver serviços" href="/servicos" />
          <SheetItem icon={MapPin} label={STUDIO.address} href="/servicos" />
          <SheetItem
            icon={Info}
            label="Política de cancelamento"
            href="/servicos"
          />
        </nav>
      </BottomSheet>
    </>
  );
}
