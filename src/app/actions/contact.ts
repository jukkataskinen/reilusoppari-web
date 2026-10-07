"use server";

import { parseContactFormData, type ContactFieldErrors } from "@/lib/contact-schema";
import {
  getResendClient,
  getContactEmail,
  getEmailFromAddress,
  isContactDeliveryMock,
} from "@/lib/resend";
import { verifyTurnstileToken, getTurnstileSiteKey } from "@/lib/turnstile";
import type { ContactState } from "@/lib/contact-state";

/**
 * Yhteydenottolomakkeen Server Action (PLAN.md Vaihe D: "Yhteydenottotapa").
 *
 * Turvallisuus (CLAUDE.md kohta 9.4):
 *  - Syöte validoidaan zodilla, honeypot tarkistetaan ensin.
 *  - Viestin sisältöä TAI lähettäjän tietoja ei koskaan lokiteta
 *    (ei console.log, ei virheviesteissä).
 *  - Turnstile varmennetaan palvelinpuolella jos site key on käytössä
 *    (ks. src/lib/turnstile.ts) – ohitetaan laiskasti kunnes tunnukset
 *    on asetettu (BLOCKERS.md).
 */
export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = parseContactFormData(formData);

  if (!parsed.success) {
    const honeypotIssue = parsed.error.issues.find((issue) => issue.path[0] === "company");
    if (honeypotIssue) {
      return { status: "success", message: "Kiitos viestistä. Vastaamme mahdollisimman pian." };
    }

    const fieldErrors: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" && !fieldErrors.name) fieldErrors.name = issue.message;
      if (field === "email" && !fieldErrors.email) fieldErrors.email = issue.message;
      if (field === "message" && !fieldErrors.message) fieldErrors.message = issue.message;
    }
    return { status: "error", message: "Tarkista lomakkeen tiedot.", fieldErrors };
  }

  const { name, email, message, turnstileToken } = parsed.data;

  if (getTurnstileSiteKey()) {
    const turnstileOk = await verifyTurnstileToken(turnstileToken ?? null);
    if (!turnstileOk) {
      return {
        status: "error",
        message: "Vahvistus epäonnistui. Yritä uudelleen.",
        fieldErrors: { turnstile: "Vahvista, että olet ihminen." },
      };
    }
  }

  // Testitilassa viestiä ei lähetetä eikä sen sisältöä kirjoiteta minnekään.
  if (isContactDeliveryMock()) {
    return {
      status: "success",
      message: "Kiitos viestistä. Testitila: viestiä ei lähetetty.",
    };
  }

  const resend = getResendClient();
  const contactEmail = getContactEmail();

  if (!resend || !contactEmail) {
    return {
      status: "error",
      message:
        "Yhteydenottolomake ei ole vielä täysin käytössä (sähköpostiyhteyttä ei ole konfiguroitu). Ota yhteyttä kirjeitse – ks. yhteystiedot tältä sivulta.",
    };
  }

  try {
    await resend.emails.send({
      from: getEmailFromAddress(),
      to: contactEmail,
      replyTo: email,
      subject: `Yhteydenotto verkkosivulta: ${name}`,
      text: [`Nimi: ${name}`, `Sähköposti: ${email}`, "", message].join("\n"),
    });
  } catch {
    return {
      status: "error",
      message: "Viestin lähetys epäonnistui. Yritä hetken kuluttua uudelleen.",
    };
  }

  return {
    status: "success",
    message: "Kiitos viestistä. Vastaamme mahdollisimman pian.",
  };
}
