"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV } from "@/lib/nav";

/*
  Client component so por causa do usePathname (estado ativo). O resto do shell
  do (app) continua sendo Server Component.

  pb com safe-area: no iPhone a barra de gestos come o rodape. Sem isso os labels
  ficam por baixo do indicador de home. Combina com viewportFit:"cover" no layout.
*/
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="border-line bg-card sticky bottom-0 z-10 border-t"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md">
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
          // startsWith pra que subrotas marquem o pai — ex.: /servicos/alongamento
          // mantem "Servicos" ativo. (Nao vale pro funil: /agendar/x/data esta no
          // grupo (booking), que nao renderiza esta nav.)
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
                  active ? "text-primary font-semibold" : "text-muted"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden="true"
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
