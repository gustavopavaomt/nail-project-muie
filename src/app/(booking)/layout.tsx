import { FlowHeader } from "@/components/nav/flow-header";

/*
  SHELL (booking) — o funil, e o motivo de existir um grupo separado.

  Repare que aqui NAO tem bottom nav. No print ela desaparece a partir da escolha
  da data, e isso e intencional: a cliente esta a poucos toques de pagar o sinal,
  e uma barra fixa com 4 saidas no rodape e um convite pra abandonar o funil.
  A unica navegacao e o "<-", que volta uma etapa.

  Guest-first: nenhuma etapa daqui exige login. A cliente se identifica por
  telefone la no resumo, e o agendamento nasce sem uid.
*/
export default function BookingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <FlowHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
