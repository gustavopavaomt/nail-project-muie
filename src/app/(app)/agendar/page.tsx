import Image from "next/image";
import Link from "next/link";
import { formatBRL, getServices } from "@/lib/services";

/*
  Escolha do servico — primeira tela do fluxo da cliente no print.
  Cada card leva direto pra /agendar/[servico]/data, que ja e o grupo (booking):
  a partir daqui a bottom nav some e a cliente entra no funil.

  Server Component: getServices() e await direto, sem estado de loading. Quando
  virar Firestore continua igual.
*/
export default async function EscolherServicoPage() {
  const services = await getServices();

  return (
    <div className="px-4 pt-5 pb-6">
      <h1 className="text-ink text-[19px] leading-snug font-semibold">
        Olá! <span aria-hidden="true">👋</span>
        <span className="block">O que deseja fazer hoje?</span>
      </h1>

      <ul className="mt-5 flex flex-col gap-3">
        {services.map((service, i) => (
          <li key={service.slug}>
            <Link
              href={`/agendar/${service.slug}/data`}
              className="bg-card border-line flex items-stretch rounded-md border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {/* A foto tem radius proprio nos 4 cantos e fica *sobre* o card, em vez
                  de ser recortada por ele — os cantos do lado do texto ficam
                  arredondados. E o que o print mostra. */}
              <div className="relative w-[38%] shrink-0 overflow-hidden rounded-md">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(max-width: 448px) 38vw, 170px"
                  // O primeiro card e o LCP da tela: sem priority ele entra na fila
                  // de lazy-load e a primeira coisa que a cliente ve chega atrasada.
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
              <div className="flex min-h-[88px] flex-col justify-center gap-1 px-4 py-3">
                <p className="text-ink text-[15px] font-semibold">
                  {service.name}
                </p>
                <p className="text-muted text-[13px]">
                  A partir de {formatBRL(service.priceFromCents)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
