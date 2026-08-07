import { Menu } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";

/*
  Header das telas com bottom nav. No print: wordmark a esquerda, hamburger a
  direita. O hamburger abre um drawer (contato, endereco, politica de
  cancelamento) — conteudo secundario que nao merece espaco na bottom nav.
*/
export function AppHeader() {
  return (
    <header className="border-line bg-card sticky top-0 z-10 border-b">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Wordmark />
        {/* TODO: abre o drawer — Sprint 2 */}
        <button
          type="button"
          aria-label="Abrir menu"
          className="text-ink -mr-2 flex size-10 items-center justify-center rounded-full"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
