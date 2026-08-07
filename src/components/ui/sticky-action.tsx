/*
  Barra de acao fixa no rodape.

  `sticky bottom-0` + `mt-auto` cobre os dois casos com uma regra so:
  - conteudo curto: o mt-auto empurra a barra pro fim do espaco livre
  - conteudo longo: o sticky gruda ela no rodape enquanto a tela rola
  Um `fixed` resolveria o segundo caso mas flutuaria sobre o conteudo no primeiro,
  e exigiria padding de compensacao no container.

  O padding usa max(1rem, safe-area) pra que o botao nao encoste na barra de gestos
  do iPhone nem fique com folga exagerada no Android, que reporta inset 0.

  O gradiente acima e o que evita a barra parecer colada por cima do conteudo:
  o texto some suavemente atras dela em vez de ser cortado numa linha dura.
*/
export function StickyAction({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 mt-auto -mx-4">
      <div
        aria-hidden="true"
        className="pointer-events-none h-6 bg-gradient-to-t from-[var(--color-surface)] to-transparent"
      />
      <div
        className="bg-surface px-4 pt-1"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        {children}
      </div>
    </div>
  );
}
