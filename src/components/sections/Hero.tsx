"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";

type Party = "vuokranantaja" | "vuokralainen";

const copy: Record<Party, { lead: string; ctaLabel: string; ctaHref: string; note: string }> = {
  vuokranantaja: {
    lead: "Reilusoppari hoitaa sopimuksen, kuvat asunnon kunnosta, vuokrakuittaukset ja lopuksi todistuksen – molemmille. Ensimmäinen vuokrasuhde on ilmainen.",
    ctaLabel: "Liity odotuslistalle",
    ctaHref: "/#odotuslista",
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
 * Kytkin vaihtaa alaotsikon ja CTA:n, ja puhelimet vaihtavat paikkaa 300 ms:n
 * liukuliikkeellä – sivuston ainoa animaatio (kohta 5). Liike on käyttäjän
 * käynnistämä, mutta globaali reduced-motion-sääntö globals.css:ssä tekee
 * vaihdosta silti välittömän, jos käyttäjä on niin asettanut.
 *
 * Kytkimen tila muistetaan URL-parametrissa (`?osapuoli=`), ei evästeessä
 * (kohta 4.1). replaceState-kutsu ei aiheuta uudelleenrenderöintiä eikä
 * vieritä sivua, joten kytkin tuntuu välittömältä.
 *
 * @param initialParty palvelimella luettu `?osapuoli=`-arvo.
 */
export function Hero({ initialParty = "vuokranantaja" }: { initialParty?: Party }) {
  const [party, setParty] = useState<Party>(initialParty);
  const tenant = party === "vuokralainen";
  const variant = copy[party];

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
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    party === option ? "bg-ink text-paper" : "text-ink hover:bg-cloud"
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

          {/*
            Kaksipuolinen näkymä: kaksi puhelinta, keskellä sama sopimus.
            Puhelimet vaihtavat paikkaa, kun osapuoli vaihtuu – valittu
            osapuoli on aina vasemmalla, lähempänä lukijaa.
          */}
          <div className="relative">
            <div className="grid grid-cols-2 items-center">
              <div
                className={`party-swap ${tenant ? "translate-x-full" : "translate-x-0"}`}
                aria-hidden="true"
              >
                <PhonePanel tone="sky" label="Vuokranantaja" />
              </div>
              <div
                className={`party-swap ${tenant ? "-translate-x-full" : "translate-x-0"}`}
                aria-hidden="true"
              >
                <PhonePanel tone="coral" label="Vuokralainen" />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Image
                src="/illustrations/hero-kaksoisnakyma.svg"
                alt="Kaksi puhelinta ja niiden välissä sama vuokrasopimus"
                width={320}
                height={240}
                priority
                unoptimized
                className="w-[78%] max-w-[340px]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Puhelimen taustapaneeli. Molemmat ovat tarkoituksella täsmälleen saman
 * kokoiset – kun molemmat värit esiintyvät, ne ovat aina yhtä isoina
 * (CLAUDE.md kohta 5).
 */
function PhonePanel({ tone, label }: { tone: "sky" | "coral"; label: string }) {
  const toneClass = tone === "sky" ? "bg-sky/10 border-sky/30" : "bg-coral/10 border-coral/30";
  return (
    // Nimi on paneelin YLÄREUNASSA, ei keskellä: kuvitus on keskellä
    // paneelien päällä, ja keskitetty teksti jäisi sen alle.
    <div className={`h-64 rounded-[var(--radius-panel)] border px-4 pt-4 text-center ${toneClass}`}>
      <span className="text-xs font-medium tracking-wide text-ink/70">{label}</span>
    </div>
  );
}
