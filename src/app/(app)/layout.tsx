import { AppHeader } from "@/components/nav/app-header";
import { BottomNav } from "@/components/nav/bottom-nav";

/*
  SHELL (app) — telas de navegacao livre: inicio, catalogo, escolha de servico, perfil.
  Header + bottom nav. A cliente entra e sai daqui a vontade, sem estar logada:
  o login so aparece quando ela quiser ver historico/cupons.
*/
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
