/**
 * Palvelun tarjoava yhtiö – yksi totuuden lähde.
 *
 * ===========================================================================
 * MIKSI OMA TIEDOSTO
 *
 * Yhtiön nimi ja Y-tunnus esiintyvät käyttöehdoissa, tietosuojaselosteessa,
 * alatunnisteessa, yhteystiedoissa ja kahdessa JSON-LD-skeemassa. Ne olivat
 * aiemmin kuudessa paikassa kovakoodattuina, ja kun yhtiö vaihtui, kaikki
 * kuusi piti löytää käsin. Yksikin unohtunut kohta olisi väärä tieto
 * juridisessa tekstissä.
 *
 * KAKSI ERI YHTIÖTÄ
 *
 * Reilusoppari on **Adepta Tilat Oy:n** tuote (Jukan linjaus 2026-09-13).
 * eSinetti on **Adepta Oy:n** tuote. Ne ovat eri oikeushenkilöitä, vaikka
 * omistaja on sama, eikä niitä saa esittää yhtenä "talona": eSinetti on
 * Reilusopparille ulkopuolinen palveluntarjoaja.
 *
 * Tietosuojan kannalta tämä ei ole muotoseikka. Kun eSinetti käsittelee
 * tunnistautumis- ja allekirjoitustietoja Reilusopparin lukuun, se on eri
 * yhtiönä **henkilötietojen käsittelijä**, ja suhde kuuluu
 * tietosuojaselosteeseen. Ks. BLOCKERS.md.
 * ===========================================================================
 */

export const company = {
  name: "Adepta Tilat Oy",
  businessId: "2145627-7",
  domicile: "Joutsa",
} as const;

/** Allekirjoitusmoottorin tarjoaja. Eri yhtiö kuin `company`. */
export const signingProvider = {
  name: "Adepta Oy",
  businessId: "2237131-2",
  product: "eSinetti",
  url: "https://esinetti.fi",
} as const;

/** "Adepta Tilat Oy (Y-tunnus 2145627-7), Joutsa" – juridisten tekstien muoto. */
export function companyLegalName(): string {
  return `${company.name} (Y-tunnus ${company.businessId}), ${company.domicile}`;
}

/**
 * Y-tunnuksen tarkistusmerkki (PRH:n painot 7,9,10,5,8,4,2).
 *
 * Tämä on olemassa testiä varten. Väärä Y-tunnus käyttöehdoissa ja
 * tietosuojaselosteessa on virhe, jota kukaan ei huomaa lukemalla – yksi
 * väärä numero näyttää täsmälleen yhtä uskottavalta kuin oikea.
 */
export function isValidBusinessId(value: string): boolean {
  const osat = /^(\d{7})-(\d)$/.exec(value);
  if (!osat) return false;

  const painot = [7, 9, 10, 5, 8, 4, 2];
  const summa = [...osat[1]].reduce((yht, merkki, i) => yht + Number(merkki) * painot[i], 0);
  const jaannos = summa % 11;

  // Jäännös 1 on mahdoton: tarkistusmerkiksi tulisi 10.
  if (jaannos === 1) return false;

  return (jaannos === 0 ? 0 : 11 - jaannos) === Number(osat[2]);
}
