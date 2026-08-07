/*
  Dados do estudio.

  PLACEHOLDER: telefone e endereco ainda nao sao os reais da Adriana. Ficam num
  lugar so pra que a troca seja um arquivo, e nao uma cacada por hardcode espalhado
  em componente. Vira documento de configuracao no Firestore quando o dashboard
  existir.
*/
export const STUDIO = {
  name: "Adriana Nail Designer",
  /** Formato E.164 sem "+", que e o que o wa.me espera. */
  whatsapp: "5511900000000",
  address: "Endereço a definir",
  cancellationPolicy:
    "Cancelamentos com menos de 24h de antecedência não têm devolução do sinal.",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(message)}`;
}
