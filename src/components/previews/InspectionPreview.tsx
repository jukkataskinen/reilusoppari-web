import { PartyDot, Sheet, SheetHead } from "./parts";

/**
 * Katselmuspöytäkirja.
 *
 * ===========================================================================
 * EI PIIRRETTYJÄ VALOKUVIA
 *
 * Ensimmäisessä versiossa kuvaruuduissa oli viivapiirrokset liedestä,
 * lattiasta ja jääkaapista. Ne näyttivät lelulta: piirros, joka esittää
 * valokuvaa, ei ole kumpikaan. Pöytäkirjassa kuva on todiste, ja piirretty
 * todiste on sisäisesti ristiriitainen.
 *
 * Nyt pöytäkirja esitetään samalla tavalla kuin todistus ja verolaskelma:
 * riveinä, joissa on selite, kuvaaja ja tiivisteen alku. Se on asiakirjan
 * oikea sisältö eikä sen kuvitus – ja juuri tiiviste tekee kuvasta todisteen
 * eikä muistikuvan.
 *
 * KUVAAJA NÄKYY JOKA RIVILLÄ
 *
 * Väripiste kertoo, kumpi osapuoli kuvan otti. Se on koko tuotteen ero
 * tavalliseen muuttotarkastukseen: vuokralaisen kuva ei ole alaviite vaan
 * samanarvoinen rivi.
 *
 * KAKSI TILAA, EI KUUTTA
 *
 * Asunnossa on kuusi tilaa (luku näkyy alarivillä), mutta esimerkissä
 * näytetään kaksi. Kuusi olisi taulukko, ei kuva siitä miltä asiakirja
 * näyttää.
 *
 * Jos oikeita valokuvia joskus lisätään, ne tulevat näiden rivien viereen –
 * eivät niiden tilalle. Rivi tiivisteineen on se, mikä asiakirjassa pitää.
 * ===========================================================================
 */

const rooms = [
  {
    name: "Eteinen",
    photos: [
      { note: "Ovikellon nappi jumittaa", who: "tenant", hash: "9d40b2" },
      { note: "Parketissa kulumaa oven edessä", who: "tenant", hash: "2e77af" },
    ],
  },
  {
    name: "Keittiö",
    photos: [
      { note: "Liesi ja uuni, toimivat", who: "landlord", hash: "a1f3c8" },
      { note: "Naarmu kaapin edessä", who: "tenant", hash: "7b20de" },
      { note: "Jääkaapin ovessa kolhu", who: "landlord", hash: "4c9a11" },
    ],
  },
] as const;

export function InspectionPreview() {
  return (
    <Sheet label="Alkukatselmuksen pöytäkirja: eteinen ja keittiö, viisi kuvaa selitteineen, kuvaajineen ja tiivisteineen. Lukittu 14.8.2026 klo 16.02, yhteensä 12 kuvaa kuudesta tilasta.">
      <SheetHead
        kicker="Katselmuspöytäkirja"
        title="Alkukatselmus"
        subtitle="Asunto Oy Esimerkki · Helsinki"
        badge={{ text: "lukittu", done: true }}
      />

      {rooms.map((room) => (
        <div key={room.name} className="mt-3">
          <p className="text-[12px] font-semibold">{room.name}</p>

          <ul className="mt-1 divide-y divide-line border-t border-line">
            {room.photos.map((photo) => (
              <li key={photo.hash} className="flex items-baseline justify-between gap-3 py-1.5">
                <span className="flex min-w-0 items-baseline gap-1.5 text-[12px] text-ink/70">
                  <span className="translate-y-[-1px]">
                    <PartyDot role={photo.who} />
                  </span>
                  {photo.note}
                </span>
                {/* Tiiviste on aina monospacea, kuten tarkistuskoodit muuallakin. */}
                <span className="shrink-0 font-mono text-[11px] text-ink/45">{photo.hash}…</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3 text-[10px] text-ink/55">
        <span>12 kuvaa · 6 tilaa</span>
        <span className="font-mono">lukittu 14.8. 16.02</span>
      </div>
    </Sheet>
  );
}
