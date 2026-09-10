"use server";

import { parseWaitlistFormData, partyLabels, type WaitlistFieldErrors } from "@/lib/waitlist-schema";
import { createWaitlistToken, verifyWaitlistToken } from "@/lib/waitlist-token";
import { getEmailFromAddress, getResendClient, getSiteUrl, getWaitlistSegmentId } from "@/lib/resend";
import type { WaitlistState, ConfirmWaitlistResult } from "@/lib/waitlist-state";

/**
 * Odotuslistan Server Action (CLAUDE.md kohta 2).
 *
 * Kulku: 1) validoi zodilla, 2) luo allekirjoitettu vahvistustoken,
 * 3) lähetä vahvistussähköposti Resendillä. Vasta kun käyttäjä klikkaa
 * linkkiä /vahvista?token=..., kontakti lisätään Resendin
 * "reilusoppari-waitlist" -segmenttiin (kaksoisvarmistus).
 *
 * RESEND_API_KEY/RESEND_SEGMENT_ID puuttuvat vielä (ks. BLOCKERS.md), joten
 * getResendClient() palauttaa nullin ja lomake näyttää selkeän
 * virheilmoituksen sen sijaan, että kaataisi buildin.
 *
 * Huom: tämä tiedosto saa exportata vain async-funktioita ("use server"
 * -rajoitus) – tilan tyypit ja aloitusarvo ovat src/lib/waitlist-state.ts:ssä.
 */
export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const parsed = parseWaitlistFormData(formData);

  if (!parsed.success) {
    // Honeypot-kenttä täytetty -> teeskennellään onnistumista botille,
    // mutta ei tehdä mitään oikeaa.
    const honeypotIssue = parsed.error.issues.find((issue) => issue.path[0] === "company");
    if (honeypotIssue) {
      return {
        status: "success",
        message: "Kiitos. Tarkista sähköpostisi, niin liittyminen on valmis.",
      };
    }

    const fieldErrors: WaitlistFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "email" && !fieldErrors.email) fieldErrors.email = issue.message;
      if (field === "party" && !fieldErrors.party) fieldErrors.party = issue.message;
      if (field === "apartments" && !fieldErrors.apartments) fieldErrors.apartments = issue.message;
    }
    return {
      status: "error",
      message: "Tarkistetaanpa vielä lomakkeen tiedot.",
      fieldErrors,
    };
  }

  const { email, party, apartments } = parsed.data;
  const resend = getResendClient();

  if (!resend) {
    return {
      status: "error",
      message:
        "Odotuslista ei ole vielä täysin käytössä (sähköpostiyhteyttä ei ole konfiguroitu). Yritetään myöhemmin uudelleen.",
    };
  }

  const token = createWaitlistToken({ email, party, apartments });
  const confirmUrl = `${getSiteUrl()}/vahvista?token=${encodeURIComponent(token)}`;

  try {
    const { error } = await resend.emails.send({
      from: getEmailFromAddress(),
      to: email,
      subject: "Vahvista liittymisesi Reilusopparin odotuslistalle",
      text: [
        "Kiitos kiinnostuksesta Reilusopparia kohtaan.",
        "",
        `Vahvista liittymisesi odotuslistalle (${partyLabels[party].toLowerCase()}) klikkaamalla alla olevaa linkkiä:`,
        confirmUrl,
        "",
        "Linkki vanhenee 48 tunnin kuluttua. Jos et pyytänyt tätä, voit jättää viestin huomiotta.",
      ].join("\n"),
    });
    // HUOM: Resendin SDK EI heitä poikkeusta API-tason virheistä (esim.
    // vahvistamaton lähettäjädomain) – se palauttaa ne { data: null, error }
    // -muodossa. Pelkkä try/catch ei siis havaitse epäonnistunutta lähetystä.
    // Tarkistettava AINA `error`-kenttä eksplisiittisesti tämän SDK:n kanssa.
    if (error) {
      console.error(
        "[waitlist] Vahvistussähköpostin lähetys epäonnistui:",
        error.name,
        error.message,
      );
      return {
        status: "error",
        message: "Vahvistussähköpostin lähetys epäonnistui. Yritetään hetken kuluttua uudelleen.",
      };
    }
  } catch (err) {
    console.error("[waitlist] Vahvistussähköpostin lähetys heitti poikkeuksen:", err);
    return {
      status: "error",
      message: "Vahvistussähköpostin lähetys epäonnistui. Yritetään hetken kuluttua uudelleen.",
    };
  }

  return {
    status: "success",
    message: "Kiitos. Lähetimme vahvistuslinkin sähköpostiisi – klikkaa sitä, niin olet listalla.",
  };
}

/**
 * Kutsutaan /vahvista-sivulta kun käyttäjä klikkaa sähköpostin linkkiä.
 * Vasta tässä vaiheessa kontakti lisätään Resendin "reilusoppari-waitlist"
 * -segmenttiin (kaksoisvarmistus, CLAUDE.md kohta 2).
 *
 * Huom: käytetään `segments`-parametria, ei `audienceId`:tä – Resend on
 * siirtänyt kontaktien ryhmittelyn Audiencesta Segmentteihin ja `audienceId`
 * on SDK:ssa merkitty deprecated:ksi. Ks. DECISIONS.md.
 */
export async function confirmWaitlistSubscription(token: string): Promise<ConfirmWaitlistResult> {
  const result = verifyWaitlistToken(token);
  if (!result.valid) {
    return result.reason === "expired" ? { status: "expired" } : { status: "invalid" };
  }

  const resend = getResendClient();
  const segmentId = getWaitlistSegmentId();
  if (!resend || !segmentId) {
    return { status: "unavailable" };
  }

  try {
    const { error } = await resend.contacts.create({
      email: result.payload.email,
      unsubscribed: false,
      segments: [{ id: segmentId }],
    });
    // Sama SDK-huomio kuin joinWaitlist:issa – error ei heitä poikkeusta.
    if (error) {
      console.error(
        "[waitlist] Kontaktin lisäys segmenttiin epäonnistui:",
        error.name,
        error.message,
      );
      return { status: "error" };
    }
  } catch (err) {
    console.error("[waitlist] Kontaktin lisäys heitti poikkeuksen:", err);
    return { status: "error" };
  }

  return { status: "confirmed", email: result.payload.email };
}
