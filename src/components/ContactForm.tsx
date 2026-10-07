"use client";

import { useActionState } from "react";
import Script from "next/script";
import { sendContactMessage } from "@/app/actions/contact";
import { initialContactState } from "@/lib/contact-state";

interface ContactFormProps {
  /** Palvelinpuolelta luettu TURNSTILE_SITE_KEY, ei NEXT_PUBLIC_-muuttuja
   * (ei tarvitse olla julkinen env, koska server component välittää arvon
   * propsina – ks. src/app/yhteystiedot/page.tsx). Null kunnes Jukka
   * asettaa tunnukset (BLOCKERS.md), jolloin widgettiä ei renderöidä
   * lainkaan eikä Turnstile-skriptiä ladata (ei CSP-vaikutusta). */
  turnstileSiteKey: string | null;
  /** CSP-nonce script-tagille, jos widget joskus aktivoituu. */
  nonce?: string;
}

export function ContactForm({ turnstileSiteKey, nonce }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialContactState);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-[var(--radius-panel)] border border-moss/30 bg-moss/5 p-6">
        <p className="font-medium text-moss">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {/* Honeypot: piilotettu ihmiskäyttäjiltä, botit täyttävät sen usein. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Älä täytä tätä kenttää</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nimi
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="rounded-[var(--radius-panel)] border border-line bg-paper px-4 py-2.5 placeholder:text-ink/40"
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
        />
        {state.fieldErrors?.name && (
          <p id="name-error" className="text-sm text-coral">
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Sähköposti
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="etunimi.sukunimi@esimerkki.fi"
          className="rounded-[var(--radius-panel)] border border-line bg-paper px-4 py-2.5 placeholder:text-ink/40"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="text-sm text-coral">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Viesti
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Kerro lyhyesti, mistä on kyse."
          className="rounded-[var(--radius-panel)] border border-line bg-paper px-4 py-2.5 placeholder:text-ink/40"
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
        />
        {state.fieldErrors?.message && (
          <p id="message-error" className="text-sm text-coral">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      {/* Turnstile-widget renderöidään vain kun site key on asetettu
          (ks. BLOCKERS.md) – tähän asti honeypot riittää perussuojaksi. */}
      {turnstileSiteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
            nonce={nonce}
            async
            defer
          />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
          {state.fieldErrors?.turnstile && <p className="text-sm text-coral">{state.fieldErrors.turnstile}</p>}
        </>
      )}

      {state.status === "error" && state.message && !state.fieldErrors && (
        <p role="alert" className="text-sm text-coral">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-ink-strong disabled:opacity-60"
      >
        {pending ? "Lähetetään…" : "Lähetä viesti"}
      </button>
    </form>
  );
}
