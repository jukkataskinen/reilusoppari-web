/**
 * Renderöi JSON-LD-skeeman <script type="application/ld+json">-tagiin.
 *
 * Ei nonce-attribuuttia: selaimet eivät sovella script-src-CSP:tä
 * ei-suoritettaviin script-tyyppeihin (application/ld+json ei ole
 * JavaScript-MIME-tyyppi), joten tämä ei vaadi CSP-noncea toimiakseen.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
