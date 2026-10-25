/**
 * Kevyt tapahtumaseuranta Plausiblen kautta (CLAUDE.md kohta 2: Plausible, ei evästeitä).
 *
 * Vain tapahtuman nimi ja kiinteät, sallitut ominaisuudet (esim. ehdotuksen tyyppi).
 * Ei koskaan keskustelun sisältöä, lomakkeen kenttiä tai muita henkilötietoja. Jos
 * Plausible-skriptiä ei ole ladattu (muuttuja puuttuu tai mainosesto), kutsu ei tee mitään.
 */

import type { CtaType } from "@/lib/chat/cta";
import type { ContactSource, ContactTopic } from "@/lib/contact-schema";

export type TrackEvent =
  | "Chat: keskustelu alkoi"
  | "Chat: ehdotus näytetty"
  | "Chat: ehdotus painettu"
  | "Yhteydenotto lähetetty";

// Vain kiinteät arvot: ehdotuksen tyyppi, lomakkeen aihe ja lähde. Ei vapaata tekstiä.
type Props = Record<string, CtaType | ContactTopic | ContactSource>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function track(event: TrackEvent, props?: Props): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // Seuranta ei saa koskaan rikkoa sivua.
  }
}
