"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
  Bottom sheet — o componente que o 02_DESIGN_SYSTEM.md pede no lugar de modal.

  Construido sobre <dialog> + showModal() de proposito: o elemento nativo ja da
  focus trap, fechar no Esc, `inert` no resto da pagina e o ::backdrop. Refazer
  isso na mao e a origem classica de sheet que prende o leitor de tela atras do
  overlay ou que o Tab escapa.

  ARRASTAR PRA FECHAR: usa Pointer Events (nao touch), entao funciona igual com
  dedo, mouse e caneta, e setPointerCapture garante que o gesto continue sendo
  entregue mesmo se o dedo sair do handle no meio do arrasto.

  Durante o arrasto o transform e inline e a transicao fica desligada — o painel
  precisa colar no dedo, sem lag. A transicao so volta quando solta, pra animar o
  encaixe ou o retorno.

  Fecha se o arrasto passar de 96px OU se for rapido (flick curto conta): so
  distancia obriga a arrastar meia tela, so velocidade dispara sem querer.
*/

const CLOSE_DISTANCE = 96; // px
const CLOSE_VELOCITY = 0.5; // px/ms

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ y: 0, t: 0 });

  const finishClose = useCallback(() => {
    setClosing(false);
    setDragY(0);
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  const requestClose = useCallback(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return finishClose();
    setClosing(true);
    window.setTimeout(finishClose, 200); // casa com a animacao sheet-out
  }, [finishClose]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // O <dialog> nativo nao trava o scroll do body no iOS Safari.
      document.body.style.overflow = "hidden";
    }
    if (!open && d.open) d.close();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc dispara o `cancel` nativo; interceptamos pra animar a saida.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      requestClose();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [requestClose]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { y: e.clientY, t: performance.now() };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    // Só para baixo: arrastar pra cima nao deve descolar o sheet do rodape.
    setDragY(Math.max(0, e.clientY - start.current.y));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const dy = Math.max(0, e.clientY - start.current.y);
    const velocity = dy / Math.max(1, performance.now() - start.current.t);
    if (dy > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) requestClose();
    else setDragY(0);
  };

  return (
    <dialog
      ref={dialogRef}
      data-state={closing ? "closing" : "open"}
      className="sheet"
      onClick={(e) => {
        // clique no backdrop = clique no proprio <dialog>, fora do painel
        if (e.target === dialogRef.current) requestClose();
      }}
    >
      <div
        className="sheet-panel bg-card w-full rounded-t-lg"
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? "none" : undefined,
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* area de arrasto: o handle e o cabecalho inteiro, nao so a barrinha —
            alvo maior, menos tentativa frustrada */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="cursor-grab touch-none pt-3 pb-1 active:cursor-grabbing"
        >
          <div
            aria-hidden="true"
            className="bg-line mx-auto h-1 w-10 rounded-full"
          />
          <h2 className="text-ink mt-3 px-5 text-[17px] font-semibold">
            {title}
          </h2>
        </div>

        <div className="px-5 pt-2">{children}</div>
      </div>
    </dialog>
  );
}
