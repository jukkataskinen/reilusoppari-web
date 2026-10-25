import { handleChat } from "@/lib/chat/handler";
import { availableCtas } from "@/lib/chat/config";
import { isChatEnabled } from "@/lib/chat/enabled";
import { getLaunchMode } from "@/lib/launch";
import { siteUrl } from "@/lib/site";

// Vastaus suoratoistetaan eikä sitä välimuistiteta.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LAUNCH_NOTES = {
  live: "TILANNE: Palvelu on avoinna. Aloittaminen: Aloita ilmaiseksi -painikkeella sivustolta. Ensimmäinen vuokrasuhde on ilmainen.",
  waitlist:
    "TILANNE: Palvelu ei ole vielä avoinna, joten aloittaa ei voi vielä itse. Sivuston etusivulla on odotuslista. Hinnat ovat julkaistut hinnastosivulla (/hinnat).",
  soon: "TILANNE: Palvelu avautuu pian, mutta aloittaa ei voi vielä itse eikä odotuslistaa ole. Hinnat ovat julkaistut hinnastosivulla (/hinnat). Kysymyksiä voi lähettää yhteydenottolomakkeella (/yhteystiedot).",
} as const;

export async function POST(request: Request) {
  const mode = getLaunchMode();
  const ctas = availableCtas(mode);
  // Tilanne ja sallitut ehdotukset tulevat välimuistitetun järjestelmäohjeen jälkeen.
  return handleChat(request, {
    siteUrl,
    launchNote: `${LAUNCH_NOTES[mode]} Käytettävissä olevat ehdotukset: ${ctas.join(", ")}.`,
    ctas,
  });
}

// Selain kysyy avautuessaan, onko chat käytössä (avain asetettu). Ei kuluja eikä sisältöä.
export async function GET() {
  return Response.json({ enabled: isChatEnabled() }, { headers: { "Cache-Control": "no-store" } });
}
