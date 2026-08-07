/*
  Catalogo de servicos.

  Os precos sao os do print e o Gustavo confirmou que sao exemplo — trocar pelos
  reais da Adriana. As fotos sao placeholders gerados; trocar pelo acervo dela.

  A leitura passa por getServices() de proposito, e nao pelo array direto: quando
  o Firestore entrar, so esta funcao muda. Ela e async desde ja pra que as telas
  ja nascam esperando await e nao precisem virar de cabeca pra baixo depois.
*/

export type Service = {
  slug: string;
  name: string;
  /** Em centavos. Dinheiro em float da erro de arredondamento na entrada de 50%. */
  priceFromCents: number;
  durationMinutes: number;
  image: string;
};

const SERVICES: Service[] = [
  {
    slug: "alongamento",
    name: "Alongamento",
    priceFromCents: 18000,
    durationMinutes: 150,
    image: "/placeholders/alongamento.png",
  },
  {
    slug: "manutencao",
    name: "Manutenção",
    priceFromCents: 9000,
    durationMinutes: 90,
    image: "/placeholders/manutencao.png",
  },
  {
    slug: "blindagem",
    name: "Blindagem",
    priceFromCents: 12000,
    durationMinutes: 120,
    image: "/placeholders/blindagem.png",
  },
  {
    slug: "esmaltacao",
    name: "Esmaltação",
    priceFromCents: 5000,
    durationMinutes: 60,
    image: "/placeholders/esmaltacao.png",
  },
];

export async function getServices(): Promise<Service[]> {
  return SERVICES;
}

export async function getService(slug: string): Promise<Service | null> {
  return SERVICES.find((s) => s.slug === slug) ?? null;
}

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  });
}
