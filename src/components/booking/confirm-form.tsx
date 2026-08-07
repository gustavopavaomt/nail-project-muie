"use client";

import { useActionState, useState } from "react";
import { AlertCircle } from "lucide-react";
import { StickyAction } from "@/components/ui/sticky-action";
import {
  confirmBooking,
  type ConfirmState,
} from "@/app/(booking)/agendar/[servico]/resumo/actions";

/*
  Identificacao da cliente — o unico formulario do funil guest-first.

  Nome e WhatsApp bastam: o WhatsApp e a chave que liga a pessoa aos agendamentos
  dela quando a area logada existir, e e por onde a Adriana ja fala com as clientes
  hoje. Pedir e-mail e senha aqui derrubaria a conversao no ultimo passo.

  MOBILE:
  - `text-base` (16px) nos inputs e obrigatorio: com fonte menor o iOS da zoom
    sozinho ao focar o campo e a tela salta.
  - `inputMode="tel"` abre o teclado numerico sem forçar type="tel", que em alguns
    Android traz um teclado de discagem com letras.
  - `autoComplete` deixa o preenchimento automatico do sistema funcionar.
*/

/** (11) 91234-5678 — formata enquanto digita, sem travar o apagar. */
function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function ConfirmForm({
  serviceSlug,
  date,
  time,
}: {
  serviceSlug: string;
  date: string;
  time: string;
}) {
  const [state, formAction, pending] = useActionState<ConfirmState, FormData>(
    confirmBooking,
    {},
  );
  const [phone, setPhone] = useState("");

  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="serviceSlug" value={serviceSlug} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="time" value={time} />

      <fieldset className="mt-6" disabled={pending}>
        <legend className="text-ink text-[15px] font-semibold">
          Seus dados
        </legend>

        <label className="mt-3 block">
          <span className="text-muted text-[13px]">Nome</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Como a Adriana te chama"
            className="border-line bg-card text-ink placeholder:text-muted/50 focus:border-primary mt-1 block min-h-12 w-full rounded-sm border px-3 text-base outline-none"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-muted text-[13px]">WhatsApp</span>
          <input
            name="phone"
            type="text"
            required
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            placeholder="(11) 91234-5678"
            className="border-line bg-card text-ink placeholder:text-muted/50 focus:border-primary mt-1 block min-h-12 w-full rounded-sm border px-3 text-base outline-none"
          />
        </label>

        <p className="text-muted mt-2 text-[12px]">
          É por aqui que você recebe o lembrete do seu horário.
        </p>
      </fieldset>

      {state.error && (
        <p
          role="alert"
          className="text-primary-700 bg-primary-50 mt-4 flex items-start gap-2 rounded-sm p-3 text-[13px]"
        >
          <AlertCircle size={16} className="mt-px shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      <StickyAction>
        <button
          type="submit"
          disabled={pending}
          className="bg-primary min-h-14 w-full rounded-sm text-[15px] font-semibold tracking-[0.08em] text-white uppercase transition-opacity active:opacity-80 disabled:opacity-50"
        >
          {pending ? "Confirmando…" : "Confirmar agendamento"}
        </button>
      </StickyAction>
    </form>
  );
}
