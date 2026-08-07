import { Wordmark } from "@/components/brand/wordmark";
import { AppMenu } from "./app-menu";

/*
  Header das telas com bottom nav. No print: wordmark a esquerda, hamburger a
  direita. Continua Server Component — so o AppMenu, que precisa de estado pro
  bottom sheet, e cliente.
*/
export function AppHeader() {
  return (
    <header className="border-line bg-card sticky top-0 z-10 border-b">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Wordmark />
        <AppMenu />
      </div>
    </header>
  );
}
