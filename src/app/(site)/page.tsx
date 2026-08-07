import Link from "next/link";
import { Bell, CalendarClock, Heart, Lock } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";

/*
  Landing do print.
  Composicao: logo centralizado no topo, e do headline pra baixo tudo alinhado a
  esquerda. Esse contraste (marca centrada / conteudo a esquerda) e do print e da
  o ar editorial — centralizar tudo deixaria com cara de template.
*/

const BENEFITS = [
  { icon: CalendarClock, label: "Agendamento online" },
  { icon: Lock, label: "Pagamento seguro" },
  { icon: Bell, label: "Lembretes automáticos" },
  { icon: Heart, label: "Seu histórico e vantagens" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col px-7 pt-10 pb-8">
      <Wordmark size="lg" />

      <h1 className="font-display text-ink mt-10 text-[44px] leading-[1.08] tracking-[-0.01em]">
        Sua beleza,
        <span className="text-primary-600 block">no seu tempo.</span>
      </h1>

      <p className="text-muted mt-5 max-w-[19rem] text-[15px] leading-relaxed">
        Agende seu horário de forma rápida e prática e realce sua melhor versão.
      </p>

      <ul className="mt-9 flex flex-col gap-5">
        {BENEFITS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3.5">
            <Icon
              size={22}
              strokeWidth={1.6}
              className="text-primary shrink-0"
              aria-hidden="true"
            />
            <span className="text-ink/85 text-[15px]">{label}</span>
          </li>
        ))}
      </ul>

      {/* Segue o fluxo logo apos os beneficios, como no print. mt-auto colava o CTA
          no rodape e abria um vazio no meio da tela em telas altas. */}
      <Link
        href="/agendar"
        className="bg-primary mt-10 flex min-h-14 items-center justify-center rounded-sm px-6 text-[15px] font-semibold tracking-[0.08em] text-white uppercase"
      >
        Agendar agora
      </Link>
    </div>
  );
}
