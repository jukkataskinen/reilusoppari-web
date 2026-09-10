"use client";

import { useActionState, useState } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";
import { initialWaitlistState } from "@/lib/waitlist-state";
import { asksApartments, parties, partyLabels, type Party } from "@/lib/waitlist-schema";

/**
 * Odotuslistalomake (CLAUDE.md kohta 2). Asuntojen määrä kysytään vain
 * vuokranantajalta ja "molempia"-valinnalta – vuokralaiselta ei koskaan.
 *
 * @param defaultParty esivalittu osapuoli, jonka hero-kytkin välittää.
 */
export function WaitlistForm({ defaultParty = "vuokranantaja" }: { defaultParty?: Party }) {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialWaitlistState);
  const [party, setParty] = useState<Party>(defaultParty);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-[var(--radius-panel)] border border-moss/30 bg-moss/5 p-6">
        <p className="font-medium text-moss">{state.message}</p>
      </div>
    );
  }

  const showApartments = asksApartments(party);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {/* Honeypot: piilotettu ihmiskäyttäjiltä, botit täyttävät sen usein. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Älä täytä tätä kenttää</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
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

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-medium">Kumpi olet?</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {parties.map((option) => {
            const selected = party === option;
            return (
              <label
                key={option}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper hover:border-ink/40"
                }`}
              >
                <input
                  type="radio"
                  name="party"
                  value={option}
                  checked={selected}
                  onChange={() => setParty(option)}
                  className="sr-only"
                />
                {partyLabels[option]}
              </label>
            );
          })}
        </div>
        {state.fieldErrors?.party && (
          <p className="text-sm text-coral">{state.fieldErrors.party}</p>
        )}
      </fieldset>

      {/*
        Kenttä poistetaan DOM:ista kokonaan vuokralaiselta, ei vain piiloteta:
        piilotettu kenttä lähtisi silti mukaan lomakkeen datassa.
      */}
      {showApartments && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="apartments" className="text-sm font-medium">
            Montako asuntoa vuokraat?{" "}
            <span className="font-normal text-ink/60">(vapaaehtoinen)</span>
          </label>
          <input
            id="apartments"
            name="apartments"
            type="number"
            inputMode="numeric"
            min={1}
            max={1000}
            placeholder="1"
            className="w-32 rounded-[var(--radius-panel)] border border-line bg-paper px-4 py-2.5 placeholder:text-ink/40"
            aria-invalid={Boolean(state.fieldErrors?.apartments)}
            aria-describedby={state.fieldErrors?.apartments ? "apartments-error" : undefined}
          />
          {state.fieldErrors?.apartments && (
            <p id="apartments-error" className="text-sm text-coral">
              {state.fieldErrors.apartments}
            </p>
          )}
        </div>
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
        {pending ? "Lähetetään…" : "Liity odotuslistalle"}
      </button>
      <p className="text-xs text-ink/60">
        Lähetämme vahvistuslinkin sähköpostiisi. Tietoja ei jaeta kolmansille osapuolille.
      </p>
    </form>
  );
}
