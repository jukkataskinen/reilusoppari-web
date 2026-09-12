"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { ContractPreview } from "@/components/previews/ContractPreview";

type Party = "vuokranantaja" | "vuokralainen";

const copy: Record<Party, { lead: string; ctaLabel: string; ctaHref: string; note: string }> = {
  vuokranantaja: {
    lead: "Reilusoppari hoitaa sopimuksen, kuvat asunnon kunnosta, vuokrakuittaukset ja lopuksi todistuksen – molemmille. Ensimmäinen vuokrasuhde on ilmainen.",
    // Korvataan `landlordCta`-propsilla: teksti riippuu LAUNCH_MODE:sta, jota
    // client-komponentti ei voi lukea. Nämä ovat vain tyypin täyttöä.
    ctaLabel: "",
    ctaHref: "",
    note: "Vuokralaiselle aina maksuton.",
  },
  vuokralainen: {
    lead: "Samat kuvat, sama sopimus, ilmoitus kun vuokra on kuitattu – ja lopuksi todistus, jonka otat mukaan seuraavaan asuntoon. Sinulle palvelu on aina maksuton.",
    ctaLabel: "Pyydä vuokranantajaa käyttämään",
    ctaHref: "/vuokralaiselle#pyyda",
    note: "Valmis viestipohja, jonka voit lähettää sellaisenaan.",
  },
};

/**
 * Etusivun hero (CLAUDE.md kohta 4.1).
 *
 * ===========================================================================
 * KAKSIPUOLINEN NÄKYMÄ: KAKSI SOPIMUSKORTTIA
 *
 * Oikealla on sama vuokrasopimus kahtena näkymänä – vuokranantajan ja
 * vuokralaisen. Kortit ovat samankokoiset ja niiden alla on yksi yhteinen
 * rivi, joka sitoo ne yhdeksi asiakirjaksi. Kaksi osapuolta, yksi sopimus.
 *
 * Aiemmin tässä oli kaksi tyhjää väripaneelia ja niiden päällä SVG-kuvitus.
 * Se kertoi rakenteen muttei sisältöä: lukija näki, että osapuolia on kaksi,
 * muttei sitä mitä palvelu tekee. Kortit näyttävät sopimuksen kentät –
 * vuokra, alkamispäivä, vastapuoli – ja hinnan juuri sille osapuolelle.
 *
 * Kytkin vaihtaa alaotsikon, CTA:n ja korttien järjestyksen: valittu osapuoli
 * on aina vasemmalla, lähempänä lukijaa. Liike on 300 ms:n liukuliike ja
 * sivuston ainoa animaatio (kohta 5). Se on käyttäjän käynnistämä, mutta
 * globaali reduced-motion-sääntö globals.css:ssä tekee vaihdosta silti
 * välittömän, jos käyttäjä on niin asettanut.
 *
 * Siirtymä on `100% + 0.75rem`, koska korttien välissä on `gap-3`. Pelkkä
 * `translate-x-full` jättäisi kortit päällekkäin gapin verran.
 *
 * Kytkimen tila muistetaan URL-parametrissa (`?osapuoli=`), ei evästeessä
 * (kohta 4.1). replaceState-kutsu ei aiheuta uudelleenrenderöintiä eikä
 * vieritä sivua, joten kytkin tuntuu välittömältä.
 *
 * @param initialParty palvelimella luettu `?osapuoli=`-arvo.
 * @param landlordCta vuokranantajan CTA:n teksti ja kohde. Tulee palvelimelta,
 *   koska se riippuu LAUNCH_MODE:sta (ks. src/lib/launch.ts). Vuokralaisen CTA
 *   on aina sama – hän pyytää vuokranantajaa, riippumatta julkaisutilasta.
 * ===========================================================================
 */
export function Hero({
  initialParty = "vuokranantaja",
  landlordCta,
}: {
  initialParty?: Party;
  landlordCta: { label: string; href: string };
}) {
  const [party, setParty] = useState<Party>(initialParty);
  const tenant = party === "vuokralainen";
  const variant = tenant
    ? copy.vuokralainen
    : { ...copy.vuokranantaja, ctaLabel: landlordCta.label, ctaHref: landlordCta.href };

  function choose(next: Party) {
    setParty(next);
    const url = new URL(window.location.href);
    if (next === "vuokranantaja") {
      url.searchParams.delete("osapuoli");
    } else {
      url.searchParams.set("osapuoli", next);
    }
    window.history.replaceState(null, "", url);
  }

  return (
    <section className="border-b border-line bg-paper py-14 md:py-[88px]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div
              role="group"
              aria-label="Valitse osapuoli"
              className="inline-flex rounded-full border border-line p-1"
            >
              {(["vuokranantaja", "vuokralainen"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(option)}
                  aria-pressed={party === option}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    party === option ? "bg-ink text-paper" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {option === "vuokranantaja" ? "Olen vuokranantaja" : "Olen vuokralainen"}
                </button>
              ))}
            </div>

            <h1 className="mt-6 text-[34px] md:text-[52px]">
              Vuokrasopimus, jonka molemmat allekirjoittavat mielellään.
            </h1>

            <p className="prose-measure mt-5 text-ink/80">{variant.lead}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={variant.ctaHref}
                className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition-colors hover:bg-ink-strong"
              >
                {variant.ctaLabel}
              </Link>
              <Link href="/miten-toimii" className="text-[15px] underline underline-offset-4">
                Katso koko kaari
              </Link>
            </div>

            <p className="mt-4 text-sm text-ink/70">{variant.note}</p>
          </div>

          <div>
            <div className="grid grid-cols-2 items-stretch gap-3">
              <div
                className={`party-swap ${tenant ? "translate-x-[calc(100%+0.75rem)]" : "translate-x-0"}`}
              >
                <ContractPreview role="landlord" />
              </div>
              <div
                className={`party-swap ${tenant ? "-translate-x-[calc(100%+0.75rem)]" : "translate-x-0"}`}
              >
                <ContractPreview role="tenant" />
              </div>
            </div>

            {/*
              Yhteinen rivi korttien alla. Tämä on se, mikä tekee kahdesta
              kortista yhden sopimuksen – ilman sitä ne olisivat kaksi eri
              asiakirjaa vierekkäin.
            */}
            <p className="mt-3 rounded-[var(--radius-panel)] border border-line bg-cloud px-4 py-3 text-center text-[13px] text-ink/70">
              Yksi sopimus · allekirjoitettu pankkitunnuksilla{" "}
              <span className="font-mono">14.8.2026</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
