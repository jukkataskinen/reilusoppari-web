import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/sections/CtaSection";

const title = "Miten Reilusoppari toimii";
const description =
  "Koko vuokrasuhteen kaari: sopimus, alkukatselmus, kuukausikuittaus, huoltokirja, loppukatselmus ja todistus molemmille.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/miten-toimii" },
  openGraph: { title, description, type: "website" },
};

/**
 * Koko kaari kuvina (CLAUDE.md kohta 3). Vaiheet ovat aito sekvenssi, joten
 * ne on numeroitu. Jokaisessa vaiheessa kerrotaan erikseen mitä kumpikin
 * osapuoli tekee – sivu ei kerro tarinaa vain toiselle.
 */
const stages = [
  {
    title: "Sopimus",
    illustration: null,
    landlord: "Täytät vuokrasopimuksen ja lähetät sen allekirjoitettavaksi.",
    tenant: "Allekirjoitat pankkitunnuksilla tai mobiilivarmenteella omalla puhelimellasi.",
    fact: "Allekirjoitus on eIDAS-asetuksen mukainen kehittynyt sähköinen allekirjoitus, joka on laillisesti pätevä. Molemmat saavat saman kappaleen.",
  },
  {
    title: "Alkukatselmus",
    illustration: {
      src: "/illustrations/katselmus.svg",
      alt: "Puhelin, jonka näytöllä on kuva ovikellosta",
    },
    landlord: "Kuvaat huoneet ennen muuttoa ja merkitset tiedossa olevat viat.",
    tenant: "Kuvaat samat huoneet omalta kannaltasi ja lisäät mitä huomaat.",
    fact: "Kuvat aikaleimataan palvelimella, tiivistetään ja sinetöidään sopimuksen liitteeksi. Kumpikaan osapuoli ei voi muuttaa tai poistaa niitä.",
  },
  {
    title: "Vuokrakuittaus",
    illustration: {
      src: "/illustrations/kuittaus.svg",
      alt: "Ilmoitus, jossa kysytään maksoiko vuokralainen vuokran",
    },
    landlord: "Saat kerran kuussa kysymyksen ja vastaat kyllä, ei vielä tai osittain.",
    tenant: "Näet kuittauksen heti ja voit kommentoida sitä.",
    fact: "Kuittaukset ovat vuokranantajan omia merkintöjä, jotka vuokralainen näkee ja voi kommentoida. Pankkitiliä ei liitetä palveluun.",
  },
  {
    title: "Huoltokirja",
    illustration: null,
    landlord: "Kirjaat korjaukset ja näet, mitä on ilmoitettu ja milloin.",
    tenant: "Ilmoitat viasta, ja ilmoitus jää talteen aikaleimalla.",
    fact: "Sama lista näkyy molemmille koko vuokrasuhteen ajan: milloin ilmoitettiin, milloin korjattiin ja mitä sovittiin.",
  },
  {
    title: "Loppukatselmus",
    illustration: null,
    landlord: "Käytte huoneet läpi ja vertaatte alkukuviin.",
    tenant: "Näet samat kuvat kuin vuokranantaja – ei muistelua kummallakaan.",
    fact: "Vakuudesta ja mahdollisista korjauksista sovitaan samojen kuvien äärellä. Sopimus ei muutu jälkikäteen.",
  },
  {
    title: "Todistus",
    illustration: {
      src: "/illustrations/todistus.svg",
      alt: "Sinetöity todistus, jossa nimet on peitetty",
    },
    landlord: "Saat oman todistuksesi: vakuus palautettu ajallaan, viat korjattu.",
    tenant: "Saat vuokratodistuksen, jonka voit näyttää seuraavalle vuokranantajalle.",
    fact: "Todistuksen numerot tulevat kuittauksista automaattisesti. Todistus on sen omistajan oma asiakirja, ja aitouden voi tarkistaa linkistä.",
  },
];

export default function MitenToimiiPage() {
  return (
    <>
      <OgImageMeta title={title} eyebrow="Miten toimii" alt="Reilusopparin vaiheet" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Miten toimii", path: "/miten-toimii" },
        ]}
      />
      <PageHero
        eyebrow="Koko kaari"
        title="Yksi sopimus, kuusi vaihetta, kaksi tyytyväistä osapuolta"
        lead="Reilusoppari kulkee mukana koko vuokrasuhteen ajan. Jokaisessa vaiheessa molemmat näkevät saman tiedon – siinä on koko juju."
      />

      <section className="bg-paper py-12 md:py-[72px]">
        <Container>
          <ol className="flex flex-col gap-14">
            {stages.map((stage, index) => (
              <li key={stage.title} className="border-t border-line pt-8 first:border-t-0 first:pt-0">
                <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
                  <div>
                    <span className="font-mono text-sm text-ink/60">{`0${index + 1}`}</span>
                    <h2 className="mt-2 text-2xl">{stage.title}</h2>
                    <p className="prose-measure mt-3 text-ink/70">{stage.fact}</p>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <PartyNote tone="sky" label="Vuokranantaja" text={stage.landlord} />
                      <PartyNote tone="coral" label="Vuokralainen" text={stage.tenant} />
                    </div>
                  </div>

                  {stage.illustration && (
                    <div className="flex justify-center rounded-[var(--radius-panel)] border border-line bg-cloud p-6">
                      <Image
                        src={stage.illustration.src}
                        alt={stage.illustration.alt}
                        width={280}
                        height={210}
                        unoptimized
                        className="w-full max-w-[240px]"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-12">
            <Link href="/katselmus" className="font-medium underline underline-offset-4">
              Katselmus tarkemmin
            </Link>
          </p>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}

function PartyNote({ tone, label, text }: { tone: "sky" | "coral"; label: string; text: string }) {
  const bar = tone === "sky" ? "bg-sky" : "bg-coral";
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${bar}`} aria-hidden="true" />
        <h3 className="text-sm font-medium">{label}</h3>
      </div>
      <p className="mt-2 text-ink/80">{text}</p>
    </div>
  );
}
