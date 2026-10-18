"use client";

import Link, { useLinkStatus } from "next/link";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

/**
 * Painikepalaute (Jukka 18.10.2026): jokainen painike näyttää heti painalluksen jälkeen, että
 * painallus meni perille ja työ on käynnissä, kunnes tulos näkyy. Ilman sitä käyttäjä painaa
 * uudelleen tai epäilee, ettei mitään tapahtunut.
 *
 * Palvelintoiminnon lomakkeessa tila luetaan `useFormStatus`-koukulla, joten painikkeen vaihto
 * `Nappi`-komponenttiin riittää: lomakkeen kaikki lähetyspainikkeet lukittuvat (ei tuplapainallusta),
 * ja painettu painike näyttää pyörivän ilmaisimen ja tekstin "Käsitellään…" (tai `kesken`-tekstin).
 */

/** Pyörivä ilmaisin. Teksti kertoo tilan, joten ilmaisin on vain koriste (`aria-hidden`). */
export function Pyorii({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={`size-4 shrink-0 animate-spin motion-reduce:animate-none ${className}`}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const OLETUS_KESKEN = "Käsitellään…";

/** Tavallisimmat painiketekstit passiivimuodossa. Muut saavat yleisen tekstin. */
const KESKEN_SANAT: Record<string, string> = {
  tallenna: "Tallennetaan…",
  poista: "Poistetaan…",
  lähetä: "Lähetetään…",
  hyväksy: "Hyväksytään…",
  peru: "Perutaan…",
  lisää: "Lisätään…",
  luo: "Luodaan…",
  tuo: "Tuodaan…",
  lataa: "Ladataan…",
  kirjaa: "Kirjataan…",
  vahvista: "Vahvistetaan…",
  muodosta: "Muodostetaan…",
  merkitse: "Merkitään…",
  päivitä: "Päivitetään…",
  tee: "Tehdään…",
  näytä: "Haetaan…",
  hae: "Haetaan…",
  tulkitse: "Tulkitaan…",
  kutsu: "Lähetetään…",
  ota: "Otetaan…",
  siirrä: "Siirretään…",
  avaa: "Avataan…",
  sulje: "Suljetaan…",
  kumoa: "Kumotaan…",
  hylkää: "Hylätään…",
  kirjaudu: "Kirjaudutaan…",
  jatka: "Jatketaan…",
  valitse: "Valitaan…",
  tilaa: "Tilataan…",
};

/**
 * Teksti käynnissä olon ajaksi, kun kutsuja ei antanut `kesken`-tekstiä. Jos teksti on jo
 * "…"-loppuinen (kutsuja vaihtaa sen itse), se jää. Muu kuin teksti (kuvake, rakenne) jää
 * ennalleen ja ilmaisin tulee sen eteen.
 */
function keskenTeksti(children: ReactNode): ReactNode {
  if (typeof children !== "string") return children;
  const teksti = children.trim();
  if (teksti.endsWith("…")) return children;
  return KESKEN_SANAT[teksti.split(/\s+/)[0]!.toLowerCase()] ?? OLETUS_KESKEN;
}

/**
 * Painike, joka tietää ympäröivän lomakkeen tilan. Käytä tätä aina, kun painike käynnistää
 * palvelinkutsun (lähetyspainike, poisto, hyväksyntä). `type="button"` -painike ei lukitu lomakkeen
 * mukana, mutta voi saada tilansa `kaynnissa`-arvona (esim. `useTransition`).
 */
export function Nappi({
  children,
  kesken,
  kaynnissa,
  natiivi: natiiviKaytossa = true,
  disabled,
  onClick,
  type,
  className,
  ...props
}: ComponentProps<"button"> & {
  /** Teksti käynnissä olon ajan, esim. "Tallennetaan…". */
  kesken?: ReactNode;
  /** Käynnissä olo, jos sitä ei saada lomakkeelta (esim. `useTransition`). */
  kaynnissa?: boolean;
  /**
   * Näytä ilmaisin heti painalluksesta myös tavallisessa lähetyksessä. Pois päältä, kun lomake
   * käsittelee lähetyksen itse (`onSubmit` ilman sivunvaihtoa, esim. chat) ja antaa tilan `kaynnissa`-arvona.
   */
  natiivi?: boolean;
}) {
  const lomake = useFormStatus();
  const lahettaa = type !== "button" && type !== "reset";
  const lomakkeessa = lahettaa && lomake.pending;
  const viimeisinPainallus = useRef(0);
  const [painettu, setPainettu] = useState(false);
  // Tavallinen (ei palvelintoiminnon) lähetys, esim. hakulomake `method="get"`: sivu vaihtuu
  // vasta palvelimen vastattua, eikä `useFormStatus` kerro mitään. Ilmaisin näkyy siksi heti
  // painalluksesta. Painiketta ei lukita, koska lukitus klikkauksen aikana voi estää lähetyksen.
  const [natiivi, setNatiivi] = useState(false);

  // Vain painettu painike saa ilmaisimen; saman lomakkeen muut painikkeet vain lukittuvat.
  useEffect(() => {
    setPainettu(lomake.pending && Date.now() - viimeisinPainallus.current < 3000);
    if (!lomake.pending) setNatiivi(false);
  }, [lomake.pending]);

  // Selaimen "takaisin" palauttaa sivun välimuistista ilmaisin päällä; nollataan se.
  useEffect(() => {
    const nollaa = () => setNatiivi(false);
    window.addEventListener("pageshow", nollaa);
    return () => window.removeEventListener("pageshow", nollaa);
  }, []);
  useEffect(() => {
    if (!natiivi) return;
    // Lataus (tiedostovastaus) ei vaihda sivua, joten ilmaisin ei jää ikuisesti päälle.
    const ajastin = setTimeout(() => setNatiivi(false), 15000);
    return () => clearTimeout(ajastin);
  }, [natiivi]);

  const nayta = kaynnissa ?? ((lomakkeessa && painettu) || (natiiviKaytossa && natiivi));
  const lukossa = disabled || lomakkeessa || kaynnissa === true;

  return (
    <button
      {...props}
      type={type}
      className={[className, lukossa ? "cursor-not-allowed opacity-60" : "", nayta ? "inline-flex items-center justify-center gap-2" : ""]
        .filter(Boolean)
        .join(" ")}
      disabled={lukossa}
      aria-busy={nayta || undefined}
      onClick={(e) => {
        if (natiiviKaytossa && natiivi && Date.now() - viimeisinPainallus.current < 3000) {
          // Lomake on juuri lähtenyt: toinen painallus ei saa lähettää sitä uudelleen.
          e.preventDefault();
          return;
        }
        viimeisinPainallus.current = Date.now();
        onClick?.(e);
        const lomake = e.currentTarget.form;
        if (natiiviKaytossa && lahettaa && !e.defaultPrevented && lomake && lomake.target !== "_blank" && e.currentTarget.formTarget !== "_blank") {
          if (lomake.noValidate || e.currentTarget.formNoValidate || lomake.checkValidity()) setNatiivi(true);
        }
      }}
    >
      {nayta ? (
        <>
          <Pyorii />
          <span role="status" aria-live="polite">
            {kesken ?? keskenTeksti(children)}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Linkin sisään: pyörivä ilmaisin, kun siirtyminen on kesken. Next.js:n `useLinkStatus` toimii
 * vain `Link`-komponentin lapsena. Hidas sivunvaihto näyttää muuten siltä, ettei painallus
 * tehnyt mitään.
 */
export function LinkinTila() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <>
      <Pyorii />
      <span className="sr-only" role="status" aria-live="polite">
        Avataan…
      </span>
    </>
  );
}

/**
 * Linkki, joka latautuu tiedostona (PDF, CSV). Selain ei kerro, milloin lataus alkaa, joten
 * ilmaisin näkyy muutaman sekunnin painalluksen jälkeen eikä painiketta lukita.
 */
export function LataaLinkki({
  children,
  kesken = "Ladataan…",
  onClick,
  className = "",
  ...props
}: Omit<ComponentProps<typeof Link>, "prefetch"> & { kesken?: ReactNode }) {
  const [ladataan, setLadataan] = useState(false);
  const ajastin = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (ajastin.current) clearTimeout(ajastin.current);
    },
    [],
  );
  return (
    <Link
      {...props}
      prefetch={false}
      className={className}
      aria-busy={ladataan || undefined}
      onClick={(e) => {
        onClick?.(e);
        setLadataan(true);
        if (ajastin.current) clearTimeout(ajastin.current);
        ajastin.current = setTimeout(() => setLadataan(false), 4000);
      }}
    >
      {ladataan ? (
        <>
          <Pyorii />
          <span role="status" aria-live="polite">
            {kesken}
          </span>
        </>
      ) : (
        children
      )}
    </Link>
  );
}
