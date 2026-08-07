/*
  ANDAIME — some conforme as sprints entregam as telas de verdade.
  Existe pra que a navegacao do Sprint 1.3 seja clicavel de ponta a ponta antes
  de qualquer tela existir: da pra sentir o fluxo e conferir os shells.
*/
export function Stub({
  title,
  sprint,
  note,
}: {
  title: string;
  sprint: string;
  note?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="font-display text-ink text-2xl">{title}</p>
      <p className="text-muted text-[11px] tracking-[0.2em] uppercase">
        {sprint}
      </p>
      {note && (
        <p className="text-muted mt-2 max-w-xs text-sm leading-relaxed">
          {note}
        </p>
      )}
    </div>
  );
}
