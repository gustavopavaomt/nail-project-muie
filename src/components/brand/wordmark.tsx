import { LogoMark } from "./logo-mark";

/*
  Wordmark. Composicao do print: ilustracao acima, nome em serifada de alto
  contraste, "NAIL DESIGNER" embaixo em caixa alta com tracking largo.

  size="lg" — landing (empilhado, com a ilustracao)
  size="sm" — header das telas com bottom nav (uma linha)
*/
export function Wordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  if (size === "lg") {
    return (
      <div className="flex flex-col items-center">
        <LogoMark size={72} />
        <span className="font-display text-ink mt-1 text-[32px] leading-tight">
          Adriana
        </span>
        <span className="text-muted mt-1 text-[11px] tracking-[0.34em] uppercase">
          Nail Designer
        </span>
      </div>
    );
  }

  return (
    <span className="flex items-center gap-1.5">
      <LogoMark size={28} />
      <span className="font-display text-ink text-lg leading-none">Adriana</span>
    </span>
  );
}
