/**
 * Launch-mode-riippuvat tekstinpalat tietosuojaselosteelle ja käyttöehdoille
 * (PLAN.md Vaihe D: "Tietosuojaselosteen ja käyttöehtojen live-muotoiset
 * luonnokset", Jukka 25.10.2026).
 *
 * Nykyinen teksti (`soon` ja `waitlist`) pysyy ennallaan. Tämä tiedosto lisää
 * `live`-tilan variantit samoihin kohtiin, jotka tähän asti olettivat, että
 * palvelu ei ole vielä avoinna (päivämäärälupaus, "suunniteltu käsittely",
 * "ennen kuin palvelu avautuu"). Eriytetty omaan tiedostoon, jotta kumpikin
 * voidaan yksikkötestata suoraan ilman React-renderöintiä (ks.
 * tests/unit/legal-copy.test.ts).
 *
 * Huom: `soon`-tila ei saa luvata päivämäärää (ks. `LAUNCH_TARGET`:n
 * dokumentaatio `src/lib/launch.ts`:ssä) – korjattu tässä samalla, koska
 * molemmat sivut käyttivät `LAUNCH_TARGET`-vakiota ehdoitta myös
 * `soon`-tilassa ennen tätä muutosta.
 */
import type { LaunchMode } from "@/lib/launch";
import { LAUNCH_TARGET } from "@/lib/launch";

export function tietosuojaHeroLead(mode: LaunchMode): string {
  if (mode === "live") {
    return "Reilusoppari on avoinna. Tässä kuvataan, miten käsittelemme vuokrasuhteisiin liittyviä tietoja palvelussa – odotuslistaa koskeva osa on historiatietoa niille, jotka liittyivät sille aiemmin.";
  }
  if (mode === "waitlist") {
    return "Reilusoppari kerää kahdenlaisia tietoja: odotuslistan sähköpostiosoitteita nyt, ja vuokrasuhteen tietoja sitten kun palvelu avautuu. Tässä molemmat erikseen.";
  }
  return "Sivusto ei kerää nyt henkilötietoja. Tässä kuvataan, miten tietoja käsitellään odotuslistalla, jos se avataan, ja palvelussa, kun se avautuu.";
}

export function tietosuojaOsa2Heading(mode: LaunchMode): string {
  if (mode === "live") return "Osa 2: Palvelun tiedot";
  if (mode === "waitlist") return `Osa 2: Palvelun tiedot (alkaa ${LAUNCH_TARGET})`;
  return "Osa 2: Palvelun tiedot (ei vielä käytössä)";
}

export function tietosuojaOsa2Intro(mode: LaunchMode): string {
  if (mode === "live") {
    return "Reilusoppari on avoinna, ja tässä kuvataan vuokrasuhteisiin liittyvien tietojen käsittely sellaisena kuin se tapahtuu palvelussa.";
  }
  return "Kun palvelu avautuu, Reilusopparissa käsitellään vuokrasuhteeseen liittyviä tietoja. Tämä osa kuvaa suunnitellun käsittelyn. Se tarkistetaan ja täsmennetään ennen palvelun avaamista.";
}

/**
 * Käsittelysopimus eSinetin (Adepta Oy) kanssa.
 *
 * HUOM Jukalle (ks. PR-kuvaus): `live`-variantti olettaa, että sopimus on
 * allekirjoitettu siinä vaiheessa kun `LAUNCH_MODE=live` asetetaan. Tätä ei
 * voi todentaa koodista – tarkista ennen kuin hyväksyt tämän PR:n tai
 * vaihdat tilan.
 */
export function tietosuojaEsinettiSopimus(mode: LaunchMode): string {
  if (mode === "live") {
    return "Käsittelystä on sovittu yhtiöiden välillä tietosuoja-asetuksen 28 artiklan mukaisella kirjallisella sopimuksella.";
  }
  return "Käsittelystä sovitaan yhtiöiden välillä tietosuoja-asetuksen 28 artiklan mukaisella kirjallisella sopimuksella ennen kuin palvelu avautuu.";
}

export function tietosuojaMuutoksetIntro(mode: LaunchMode): string {
  if (mode === "live") {
    return "Merkittävät muutokset tähän selosteeseen päivitetään tälle sivulle.";
  }
  return "Tätä selostetta täydennetään ennen palvelun avaamista. Merkittävät muutokset päivitetään tälle sivulle, ja jos odotuslista on auki, niistä kerrotaan listalle liittyneille sähköpostitse.";
}

export function kayttoehdotHeroLead(mode: LaunchMode): string {
  if (mode === "live") {
    return "Nämä ehdot koskevat Reilusoppari-palvelua.";
  }
  if (mode === "waitlist") {
    return `Nämä ehdot koskevat Reilusoppari-palvelua, joka avautuu ${LAUNCH_TARGET}. Odotuslistalle liittymiseen sovelletaan vain kohtia 1 ja 9.`;
  }
  return "Nämä ehdot koskevat Reilusoppari-palvelua, joka avautuu pian.";
}
