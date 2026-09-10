"use client";

import { useState } from "react";

/**
 * Valmis viestipohja, jonka vuokralainen voi lähettää vuokranantajalle
 * (CLAUDE.md kohta 4.1: "valmis viestipohja jaettavaksi").
 *
 * Teksti on aina näkyvissä ja valittavissa myös ilman nappia – kopiointi
 * on kätevyys, ei ainoa tapa saada viesti. navigator.clipboard puuttuu
 * osasta selaimia ja ei-turvallisista konteksteista, joten napin
 * epäonnistuminen ei saa jättää käyttäjää tyhjän päälle.
 */
export function MessageTemplate({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setFailed(true);
    }
  }

  return (
    <div className="rounded-[var(--radius-panel)] border border-line bg-paper p-6">
      <p className="whitespace-pre-line text-ink/90">{text}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-strong"
        >
          Kopioi viesti
        </button>
        <span role="status" className="text-sm text-ink/70">
          {copied && "Kopioitu."}
          {failed && "Kopiointi ei onnistunut – voit maalata tekstin ja kopioida sen itse."}
        </span>
      </div>
    </div>
  );
}
