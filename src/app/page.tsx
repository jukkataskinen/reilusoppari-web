import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { ConfirmationPreview } from "@/components/previews/ConfirmationPreview";
import { DocumentPage } from "@/components/previews/DocumentPage";
import { Steps } from "@/components/sections/Steps";
import { StoryBlock } from "@/components/sections/StoryBlock";
import { MolemmilleJotain } from "@/components/sections/MolemmilleJotain";
import { HomePricing } from "@/components/sections/HomePricing";
import { TuoKaveri } from "@/components/sections/TuoKaveri";
import { Tarina } from "@/components/sections/Tarina";
import { Faq } from "@/components/sections/Faq";
import { CtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, softwareApplicationSchema } from "@/lib/schema";
import { getLandlordCta } from "@/lib/launch";

/**
 * Etusivu (CLAUDE.md kohta 4). Osioiden järjestys on speksin mukainen eikä
 * sitä muuteta ilman, että kohta 4 muutetaan ensin.
 *
 * Etusivun tekstit uudistettiin Jukan hyväksymiksi 31.10.2026 (DECISIONS.md).
 * Kertomusosioiden tekstit ovat SITOVIA, eikä niitä muotoilla uudelleen.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ osapuoli?: string }>;
}) {
  const params = await searchParams;
  const initialParty = params.osapuoli === "vuokralainen" ? "vuokralainen" : "vuokranantaja";

  // Hero on client-komponentti eikä voi lukea LAUNCH_MODE:a, joten CTA
  // ratkaistaan täällä samalla funktiolla kuin PrimaryCta:ssa.
  const landlordCta = getLandlordCta();

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={softwareApplicationSchema()} />

      <Hero initialParty={initialParty} landlordCta={landlordCta} />

      <Steps />

      {/* Kohta 4.3 – sivun sydän. Teksti on sitova (Jukka 31.10.2026). */}
      <StoryBlock
        title="Vähemmän riitaa vakuusrahoista."
        quote="Ainahan asunnoissa jotain on, kun eivät uusia ole. Kun kuvat pinnoista ja kodinkoneista tallennetaan pankkitunnuksin vahvistettuun alkukatselmukseen, vikoja ei tarvitse muistella."
        fact="Alkukatselmus on osa sopimusta: kumpikin kuvaa ne kohdat, jotka itse pitää olennaisina, ja molemmat hyväksyvät kuvat allekirjoittaessaan vuokrasopimuksen. Muuttopäivänä katsotaan samoja kuvia."
        preview={<DocumentPage name="alkukatselmus" />}
      >
        <p className="mt-4">
          <Link href="/katselmus" className="font-medium underline underline-offset-4">
            Näin katselmus tehdään
          </Link>
        </p>
      </StoryBlock>

      <MolemmilleJotain />

      {/* Kohta 4.5 – teksti on sitova (Jukka 31.10.2026). */}
      <StoryBlock
        title="Selkeä maksuhistoria."
        quote="Ei enää pankkitositteiden kaivelua. Vuokranantaja vahvistaa vuokran saapuneeksi napin painalluksella, ja vuokralainen saa vahvistuksen heti."
        preview={<ConfirmationPreview />}
        reverse
      />

      {/* Kohta 4.6 – teksti on sitova (Jukka 31.10.2026). */}
      <StoryBlock
        title="Vuokratodistus seuraavaan asuntohakuun."
        quote="Vuokrasuhteen päättyessä vuokralainen saa allekirjoitetun vuokratodistuksen, joka osoittaa vuokrien hoituneen ajallaan."
        fact="Todistus on vuokralaisen oma: hän päättää, kenelle sen näyttää. Aitouden voi tarkistaa linkistä."
        preview={<DocumentPage name="vuokratodistus" />}
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

      <Tarina />

      <Faq />

      <CtaSection />
    </>
  );
}
