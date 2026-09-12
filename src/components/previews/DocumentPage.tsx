import Image from "next/image";

/**
 * Oikea asiakirja sivustolla.
 *
 * ===========================================================================
 * NÄMÄ EIVÄT OLE KUVITUKSIA VAAN TUOTE
 *
 * Kuvat ovat sovelluksen todellisten PDF-pohjien (`reilusoppari`-repo,
 * `src/documents/`) ensimmäisiä sivuja. Sivustolla näkyy siis täsmälleen se
 * asiakirja, jonka käyttäjä saa – ei sivustoa varten piirretty mukaelma.
 *
 * Aiemmin tässä oli sivustolla erikseen tehtyjä korttiversioita samoista
 * asiakirjoista. Ne olivat toinen totuus: kun sovelluksen pohja muuttuu,
 * sivusto ei muutu, eikä kukaan huomaa eroa ennen kuin asiakas huomaa.
 *
 * PÄIVITTÄMINEN
 *
 * Kuvat eivät synny tässä repossa. Kun asiakirjapohja muuttuu, aja
 * `reilusoppari`-repossa:
 *
 *     npm run samples
 *     node scripts/pdf-to-png.mjs esimerkit/vuokrasopimus.pdf sivu
 *
 * ja kopioi `sivu-1.png` tänne `public/asiakirjat/`-hakemistoon. Komento on
 * kirjattu myös sinne (`src/documents/README.md`).
 *
 * ESIMERKKIHENKILÖT
 *
 * Maija Meikäläinen ja Matti Virtanen, Mäkitie 12 A 4. Nimet näkyvät
 * kokonaan, koska ne ovat tunnistettavasti keksittyjä ja koska todistuksen
 * arvo on juuri siinä, että siinä lukee jonkun nimi.
 * ===========================================================================
 */

const documents = {
  vuokrasopimus: {
    src: "/asiakirjat/vuokrasopimus.png",
    alt: "Vuokrasopimuksen ensimmäinen sivu: koti, vuokra, osapuolet ja sopimuksen ehdot.",
    caption: "Vuokrasopimus · sivu 1/3",
  },
  alkukatselmus: {
    src: "/asiakirjat/alkukatselmus.png",
    alt: "Alkukatselmuksen pöytäkirjan ensimmäinen sivu: koti, lukitusaika, kuvien määrä ja huoneet kuvineen.",
    caption: "Alkukatselmuksen pöytäkirja · sivu 1/3",
  },
  vuokratodistus: {
    src: "/asiakirjat/vuokratodistus.png",
    alt: "Vuokratodistus: vuokrasuhteen kesto, vuokranmaksu, vakuus, vuokranantajan tervehdys ja tarkistuskoodi.",
    caption: "Vuokratodistus · sinetöity",
  },
} as const;

export function DocumentPage({
  name,
  caption = true,
  priority = false,
}: {
  name: keyof typeof documents;
  /** Kuvateksti kertoo, monesko sivu on kyseessä. Pois, jos se toistuisi. */
  caption?: boolean;
  priority?: boolean;
}) {
  const doc = documents[name];

  return (
    <figure>
      {/*
        Reunus ja pyöristys kuvan päälle, jotta valkoinen A4 erottuu
        valkoisesta taustasta. Ei varjoa (CLAUDE.md 5) – reunus riittää.
      */}
      <div className="overflow-hidden rounded-[var(--radius-panel)] border border-line">
        <Image
          src={doc.src}
          alt={doc.alt}
          width={910}
          height={1287}
          priority={priority}
          sizes="(min-width: 768px) 420px, 100vw"
          className="block h-auto w-full"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-ink/60">{doc.caption}</figcaption>
      )}
    </figure>
  );
}
