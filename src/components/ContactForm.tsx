"use client";

import { useActionState, useEffect } from "react";
import Script from "next/script";
import { sendContactMessage } from "@/app/actions/contact";
import { initialContactState } from "@/lib/contact-state";
import { Nappi } from "@/components/painike";
import { CONTACT_TOPICS, CONTACT_TOPIC_LABELS, type ContactSource, type ContactTopic } from "@/lib/contact-schema";
import { track } from "@/lib/analytics";

interface ContactFormProps {
  /** Palvelinpuolelta luettu TURNSTILE_SITE_KEY, ei NEXT_PUBLIC_-muuttuja
   * (ei tarvitse olla julkinen env, koska server component välittää arvon
   * propsina – ks. src/app/yhteystiedot/page.tsx). Null kunnes Jukka
   * asettaa tunnukset (BLOCKERS.md), jolloin widgettiä ei renderöidä
   * lainkaan eikä Turnstile-skriptiä ladata (ei CSP-vaikutusta). */
  turnstileSiteKey: string | null;
  /** CSP-nonce script-tagille, jos widget joskus aktivoituu. */
  nonce?: string;
  /** Esitäytetty aihe (?aihe=), esim. chatin ehdotusnapista. */
  defaultTopic?: ContactTopic;
  /** Mistä kävijä tuli (?lahde=chat), kulkee piilokenttänä seurantaa varten. */
  source?: ContactSource;
}

const MESSAGE_HINTS: Record<ContactTopic, string> = {
  kysymys: "Kerro lyhyesti, mistä on kyse.",
  tarjous: "Kerro, montako asuntoa salkussa on ja mitä toivot. Riittää arvio.",
  palaute: "Mikä toimi, mikä ei? Kaikki palaute luetaan.",
  muu: "Kerro lyhyesti, mistä on kyse.",
};

export function ContactForm({ turnstileSiteKey, nonce, defaultTopic = "kysymys", source = "sivusto" }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialContactState);

  // Seuranta: lähetetty lomake aiheineen ja lähteineen, ei kenttien sisältöä.
  useEffect(() => {
    if (state.status === "success" && state.sent) {
      track("Yhteydenotto lähetetty", { aihe: state.sent.topic, lahde: state.sent.source });
    }
  }, [state]);

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

      <input type="hidden" name="source" value={source} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="topic" className="text-sm font-medium">
          Aihe
        </label>
        <select
          id="topic"
          name="topic"
          defaultValue={defaultTopic}
          className="rounded-[var(--radius-panel)] border border-line bg-paper px-4 py-2.5"
        >
          {CONTACT_TOPICS.map((t) => (
            <option key={t} value={t}>
              {CONTACT_TOPIC_LABELS[t]}
            </option>
          ))}
        </select>
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
          placeholder={MESSAGE_HINTS[defaultTopic]}
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

      <Nappi
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-ink-strong disabled:opacity-60"
      >
        {pending ? "Lähetetään…" : "Lähetä viesti"}
      </Nappi>
    </form>
  );
}
