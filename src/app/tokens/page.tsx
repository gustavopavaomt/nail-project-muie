import type { Metadata } from "next";

/*
  PAGINA DE DEV — nao faz parte do produto.
  Existe pra conferir os tokens do Sprint 1.2 contra o print antes de virarem tela.
  Remover (ou trancar atras de NODE_ENV) quando o design system estabilizar.

  Nota: as cores usam style={{ background: "var(--color-x)" }} de proposito, e nao
  classes tipo bg-primary-500. O scanner do Tailwind v4 nao enxerga classe montada
  em runtime, entao um .map() com template string sairia sem estilo nenhum.
*/

export const metadata: Metadata = { title: "Tokens" };

const PRIMARY = [
  ["50", "#FDEEF2", "badge, tiles do acesso rapido"],
  ["100", "#F9DDE4", ""],
  ["200", "#F0C4D0", "dias disponiveis no calendario"],
  ["300", "#E3A3B6", ""],
  ["400", "#D4899F", "slot de horario selecionado"],
  ["500", "#C26A8A", "botoes, dia selecionado, icones"],
  ["600", "#B55175", '"no seu tempo.", barras da agenda'],
  ["700", "#96405F", "fatias escuras do donut"],
  ["800", "#78334C", ""],
  ["900", "#5D283B", ""],
];

const SURFACES = [
  ["surface", "#FFF8F7", "fundo do app"],
  ["card", "#FFFFFF", "cards"],
  ["line", "#ECECEC", "bordas e divisores"],
  ["muted", "#666666", "texto secundario"],
  ["ink", "#1E1E1E", "texto principal"],
  ["sidebar", "#222528", "sidebar do dashboard"],
];

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line border-t pt-6">
      <h2 className="font-display text-ink text-2xl">{title}</h2>
      {note && <p className="text-muted mt-1 max-w-prose text-sm">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Swatch({
  name,
  hex,
  use,
  varName,
}: {
  name: string;
  hex: string;
  use?: string;
  varName: string;
}) {
  return (
    <div className="w-36">
      <div
        className="border-line h-16 rounded-md border"
        style={{ background: `var(${varName})` }}
      />
      <p className="text-ink mt-2 text-xs font-semibold">{name}</p>
      <p className="text-muted font-mono text-[11px]">{hex}</p>
      {use && <p className="text-muted mt-1 text-[11px] leading-snug">{use}</p>}
    </div>
  );
}

export default function TokensPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6 pb-24">
      <header>
        <h1 className="font-display text-ink text-4xl">Design tokens</h1>
        <p className="text-muted mt-2 text-sm">
          Sprint 1.2 · Adriana Nail Designer · confira contra o print no fim da
          pagina
        </p>
      </header>

      <Section
        title="Primaria"
        note="Pivo 500 = #C26A8A, o valor do 02_DESIGN_SYSTEM.md — confirmado no print (o dia selecionado no calendario do dashboard amostrou #C67187). A escala varia so a luminosidade."
      >
        <div className="flex flex-wrap gap-3">
          {PRIMARY.map(([n, hex, use]) => (
            <Swatch
              key={n}
              name={`primary-${n}`}
              hex={hex}
              use={use}
              varName={`--color-primary-${n}`}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Mauve"
        note="Header da area da cliente. Nao e a primaria clareada: hsl(327,30%,72%) contra hsl(338,42%,59%) — mais roxo e menos saturado. Se usarmos primary-300 aqui, sai visivelmente errado."
      >
        <div
          className="flex h-28 items-end rounded-lg p-4"
          style={{
            background:
              "linear-gradient(135deg, var(--color-mauve-from), var(--color-mauve-to))",
          }}
        >
          <p className="text-sm font-semibold text-white">
            Ola, Ana Paula 💗
            <span className="block font-normal text-white/80">
              Que bom te ver por aqui!
            </span>
          </p>
        </div>
        <p className="text-muted mt-2 font-mono text-[11px]">
          #C89BB8 → #D6AFC6
        </p>
      </Section>

      <Section
        title="Semanticas"
        note="Dourado aprovado por voce. Verde e a minha proposta — o icone no print e pequeno demais pra amostrar com confianca."
      >
        <div className="flex flex-wrap gap-3">
          <Swatch
            name="gold"
            hex="#E8B45C"
            use="barras da agenda, donut, nivel Ouro"
            varName="--color-gold"
          />
          <Swatch
            name="success"
            hex="#30A97C"
            use="icone de faturamento"
            varName="--color-success"
          />
        </div>
      </Section>

      <Section title="Superficies">
        <div className="flex flex-wrap gap-3">
          {SURFACES.map(([n, hex, use]) => (
            <Swatch
              key={n}
              name={n}
              hex={hex}
              use={use}
              varName={`--color-${n}`}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Tipografia"
        note="Duas familias. O .md so previa Inter, mas o wordmark e o headline do print tem serifa de alto contraste."
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-muted mb-1 text-[11px] tracking-wider uppercase">
              display · Playfair
            </p>
            <p className="font-display text-ink text-5xl leading-tight">
              Sua beleza,
              <span className="text-primary-600 block">no seu tempo.</span>
            </p>
          </div>
          <div>
            <p className="text-muted mb-1 text-[11px] tracking-wider uppercase">
              sans · Inter
            </p>
            <p className="text-ink text-base font-normal">
              400 — Agende seu horario de forma rapida e pratica.
            </p>
            <p className="text-ink text-base font-medium">500 — Alongamento</p>
            <p className="text-ink text-base font-semibold">
              600 — O que deseja fazer hoje?
            </p>
            <p className="text-ink text-base font-bold">700 — R$ 720,00</p>
          </div>
        </div>
      </Section>

      <Section
        title="Raio e elevacao"
        note="Um nivel de sombra so. O print e quase flat: os cards se separam do fundo creme por uma sombra que mal se ve, nao por profundidade."
      >
        <div className="flex flex-wrap items-end gap-4">
          {[
            ["sm · 8px", "rounded-sm", "botao, input"],
            ["md · 12px", "rounded-md", "card, tile"],
            ["lg · 16px", "rounded-lg", "sheet, hero"],
          ].map(([label, cls, use]) => (
            <div key={label} className="w-36">
              <div
                className={`bg-card border-line h-20 border ${cls}`}
                style={{ boxShadow: "var(--shadow-card)" }}
              />
              <p className="text-ink mt-2 text-xs font-semibold">{label}</p>
              <p className="text-muted text-[11px]">{use}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Print de referencia"
        note="Fonte da verdade. Compare os chapados acima com as telas."
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/_ref/image-referencia.png"
          alt="Print de referencia do projeto"
          className="border-line w-full rounded-md border"
        />
      </Section>
    </main>
  );
}
