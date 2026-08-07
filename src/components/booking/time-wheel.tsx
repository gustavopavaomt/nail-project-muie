"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
  Wheel picker de horario, no espirito do time picker nativo de Android e iOS:
  rola com o polegar, para encaixado num item, item central e o escolhido.

  DECISOES DE IMPLEMENTACAO (e por que nao dependem de JS de scroll):

  - O encaixe e CSS puro (scroll-snap-type: y mandatory + scroll-snap-align:
    center). Fazer snap na mao com JS briga com o momentum nativo e da aquela
    sensacao de elastico com bug. O CSS roda no compositor, entao acompanha o dedo
    a 60fps mesmo com a thread principal ocupada.

  - scroll-snap-stop: always impede que um fling forte atravesse varios horarios.
    Sem isso um flick passa direto de 09:00 pras 17:00 e a cliente perde a
    referencia.

  - overscroll-behavior: contain isola o gesto. Sem ele, rolar o wheel no fim da
    lista arrasta a pagina atras — que no Android dispara pull-to-refresh e no iOS
    o bounce do body. E o defeito classico de scroller aninhado em PWA.

  - O item ativo sai de scrollTop/ITEM_H, nao de IntersectionObserver: e uma conta
    so, sincrona, sem custo de observer por item.

  IOS x ANDROID:
  - `scrollend` so existe em Chrome 114+ e Safari 18+. Tem fallback com debounce,
    entao iOS antigo continua funcionando.
  - navigator.vibrate nao existe em iOS nenhum. A chamada e opcional e falha
    silenciosa — Android ganha o tique tatil, iOS so nao ganha.
*/

const ITEM_H = 52; // px — acima dos 44 de area de toque minima
const VISIBLE = 5; // itens visiveis (2 acima + ativo + 2 abaixo)
const PAD = ((VISIBLE - 1) / 2) * ITEM_H; // respiro pro 1o e ultimo chegarem ao centro

export function TimeWheel({
  times,
  value,
  onChange,
}: {
  times: string[];
  value: string | null;
  onChange: (time: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(() =>
    Math.max(0, value ? times.indexOf(value) : 0),
  );
  const lastHaptic = useRef(active);

  const scrollToIndex = useCallback((i: number, smooth: boolean) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: i * ITEM_H, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Posiciona no item inicial sem animar (evita o wheel "girando" ao abrir a tela).
  useEffect(() => {
    scrollToIndex(active, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const i = Math.max(0, Math.min(times.length - 1, Math.round(el.scrollTop / ITEM_H)));
    setActive(i);
    onChange(times[i]);
  }, [times, onChange]);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const i = Math.max(0, Math.min(times.length - 1, Math.round(el.scrollTop / ITEM_H)));
    setActive(i);
    // Tique curto a cada horario que passa, como no picker nativo.
    if (i !== lastHaptic.current) {
      lastHaptic.current = i;
      navigator.vibrate?.(8);
    }
  }, [times.length]);

  // scrollend quando existir; senao debounce no scroll.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Testa em window, nao em `el`: `"onscrollend" in el` faz o TS estreitar o
    // elemento pra never, ja que scrollend ainda nao esta no lib.dom desta versao.
    if ("onscrollend" in window) {
      const onEnd = settle as EventListener;
      el.addEventListener("scrollend", onEnd);
      return () => el.removeEventListener("scrollend", onEnd);
    }

    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(settle, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
    };
  }, [settle]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = Math.max(
      0,
      Math.min(times.length - 1, active + (e.key === "ArrowDown" ? 1 : -1)),
    );
    scrollToIndex(next, true);
    setActive(next);
    onChange(times[next]);
  };

  return (
    <div className="relative" style={{ height: VISIBLE * ITEM_H }}>
      {/* trilho do item ativo, atras dos horarios */}
      <div
        aria-hidden="true"
        className="bg-primary-50 border-primary-200 pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 rounded-sm border"
        style={{ height: ITEM_H }}
      />

      <div
        ref={ref}
        role="listbox"
        aria-label="Horários disponíveis"
        aria-activedescendant={`hora-${times[active]}`}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={onKeyDown}
        className="scrollbar-none relative z-10 h-full overflow-y-auto outline-none"
        style={{
          scrollSnapType: "y mandatory",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
          paddingBlock: PAD,
          // some com as pontas pra sugerir que a lista continua
          maskImage:
            "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
        }}
      >
        {times.map((time, i) => {
          const selected = i === active;
          const distance = Math.abs(i - active);
          return (
            <button
              key={time}
              id={`hora-${time}`}
              role="option"
              aria-selected={selected}
              type="button"
              onClick={() => {
                scrollToIndex(i, true);
                setActive(i);
                onChange(time);
              }}
              className={[
                "flex w-full items-center justify-center transition-all duration-150",
                selected
                  ? "text-primary-700 text-[19px] font-semibold"
                  : distance === 1
                    ? "text-ink/55 text-[16px]"
                    : "text-muted/40 text-[15px]",
              ].join(" ")}
              style={{ height: ITEM_H, scrollSnapAlign: "center", scrollSnapStop: "always" }}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
