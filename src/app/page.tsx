import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { Steps } from "@/components/sections/Steps";
import { StoryBlock } from "@/components/sections/StoryBlock";
import { MolemmilleJotain } from "@/components/sections/MolemmilleJotain";
import { HomePricing } from "@/components/sections/HomePricing";
import { TuoKaveri } from "@/components/sections/TuoKaveri";
import { Faq } from "@/components/sections/Faq";
import { CtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, softwareApplicationSchema } from "@/lib/schema";

/**
 * Etusivu (CLAUDE.md kohta 4). Osioiden järjestys on speksin mukainen eikä
 * sitä muuteta ilman, että kohta 4 muutetaan ensin.
 *
 * Kolmen kertomusosion sitaatit ovat Jukan kirjoittamia ja SITOVIA. Niitä ei
 * muotoilla uudelleen. Sivulla on kaksi "Reilua."-loppua (kohdat 3 ja 5) –
 * kolmatta ei lisätä, koska sana kuluu.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ osapuoli?: string }>;
}) {
  const params = await searchParams;
  const initialParty = params.osapuoli === "vuokralainen" ? "vuokralainen" : "vuokranantaja";

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={softwareApplicationSchema()} />

      <Hero initialParty={initialParty} />

      <Steps />

      {/* Kohta 4.3 – sivun sydän. Sitaatti on sitova. */}
      <StoryBlock
        quote="Parketissa kulumaa? Ovikellon nappi jumii? Ainahan asunnoissa jotain on, kun eivät uusia ole. Turha niistä on kuitenkaan riidellä; otetaan kuva ja laitetaan se talteen niin ei tarvitse vikoja muistella. Reilua."
        fact="Alkukatselmus on osa sopimusta: molemmat kuvaavat samat huoneet, kuvat aikaleimataan ja sinetöidään sopimuksen liitteeksi. Muuttopäivänä katsotaan samoja kuvia."
        illustration={{
          src: "/illustrations/katselmus.svg",
          alt: "Puhelin, jonka näytöllä on kuva ovikellosta",
        }}
        caption="tallennettu 14.8. 16:02"
      >
        <p className="mt-4">
          <Link href="/katselmus" className="font-medium underline underline-offset-4">
            Näin katselmus tehdään
          </Link>
        </p>
      </StoryBlock>

      <MolemmilleJotain />

      {/* Kohta 4.5 – sitaatti on sitova. */}
      <StoryBlock
        quote="Olikos sen Liisan tämän kuun vuokra jo tullut? No joo, yleensä se tulee ajallaan niin kuin nytkin. Laitetaan siitä viesti menemään. Reilua."
        fact="Vuokralainen näkee kuittauksen heti, ja vuoden päästä kummallakin on sama maksuhistoria – ilman pankkitiliä, ilman perintätoimistoa."
        illustration={{
          src: "/illustrations/kuittaus.svg",
          alt: "Ilmoitus, jossa kysytään maksoiko vuokralainen vuokran, ja kolme vastausvaihtoehtoa",
        }}
        caption="Maksoiko Liisa 850 € eräpäivään 2.9. mennessä?"
        reverse
      />

      {/* Kohta 4.6 – vuokralaisen äänellä, sitaatti on sitova. */}
      <StoryBlock
        quote="Sitten kun on aika muuttaa seuraavaan kotiin niin muistoksi saat yhteenvedon vuokrien maksusta ajallaan ja vuokranantajan terveiset. Allekirjoitettu dokumentti hyvästä vuokrasuhteesta on kovaa valuuttaa, kun näytät sen seuraavalle vuokranantajalle."
        fact="Todistus on sinun: sinä päätät, kenelle sen näytät. Aitouden voi tarkistaa linkistä."
        illustration={{
          src: "/illustrations/todistus.svg",
          alt: "Sinetöity todistus, jossa nimet on peitetty",
        }}
        tone="cloud"
      >
        <p className="mt-4 text-ink/70">
          Vuokranantaja saa omansa – vakuus palautettu ajallaan, viat korjattu.
        </p>
        <p className="mt-4">
          <Link href="/todistus" className="font-medium underline underline-offset-4">
            Mitä todistuksessa lukee
          </Link>
        </p>
      </StoryBlock>

      <HomePricing />

      <TuoKaveri />

      <Faq />

      <CtaSection />
    </>
  );
}
