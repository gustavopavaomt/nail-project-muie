/*
  SHELL (site) — landing publica.
  Sem chrome nenhum de proposito: nem header, nem bottom nav. A landing tem uma
  acao unica ("AGENDAR AGORA") e qualquer navegacao competindo com ela so
  atrapalha. Isso implementa o "uma acao principal por tela" do 02_DESIGN_SYSTEM.md.
*/
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <div className="mx-auto flex w-full max-w-md flex-1 flex-col">{children}</div>;
}
