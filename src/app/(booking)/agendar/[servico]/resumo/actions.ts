"use server";

import { redirect } from "next/navigation";
import { getSlots } from "@/lib/availability";
import { createBooking } from "@/lib/bookings";
import { getService } from "@/lib/services";

export type ConfirmState = { error?: string };

/** So digitos. Aceita o que a mascara produzir. */
function digits(v: string): string {
  return v.replace(/\D/g, "");
}

export async function confirmBooking(
  _prev: ConfirmState,
  formData: FormData,
): Promise<ConfirmState> {
  const serviceSlug = String(formData.get("serviceSlug") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const customerName = String(formData.get("name") ?? "").trim();
  const phone = digits(String(formData.get("phone") ?? ""));

  if (customerName.length < 2) {
    return { error: "Escreva seu nome." };
  }
  // 10 digitos = fixo com DDD, 11 = celular com DDD. Menos que isso falta o DDD.
  if (phone.length < 10 || phone.length > 11) {
    return { error: "Confira o WhatsApp com DDD, ex.: (11) 91234-5678." };
  }

  const service = await getService(serviceSlug);
  if (!service) return { error: "Serviço não encontrado." };

  /*
    Revalida o horario no servidor antes de gravar.

    Entre a cliente abrir o resumo e apertar confirmar podem passar minutos, e
    nesse meio outra pessoa pode ter fechado o mesmo horario. Confiar no que veio
    do formulario aceitaria a dupla marcacao — e quem descobre e a Adriana, com
    duas clientes na porta.
  */
  const slots = await getSlots(serviceSlug, date);
  const stillFree = slots.some((s) => s.time === time && s.available);
  if (!stillFree) {
    return {
      error: "Esse horário acabou de ser reservado. Escolha outro, por favor.",
    };
  }

  const booking = await createBooking({
    serviceSlug,
    serviceName: service.name,
    date,
    time,
    customerName,
    customerPhone: phone,
    durationMinutes: service.durationMinutes,
    totalCents: service.priceFromCents,
  });

  redirect(`/agendar/${serviceSlug}/confirmado?id=${booking.id}`);
}
