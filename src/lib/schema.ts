/**
 * Schema.org (JSON-LD) -rakentajat. Kaikki funktiot palauttavat tavallisia
 * objekteja – renderöinti tapahtuu <JsonLd />-komponentilla.
 *
 * getSiteUrl() on tarkoituksella sama funktio kuin src/lib/resend.ts:ssä
 * (yksi totuuden lähde sivuston julkiselle osoitteelle NEXT_PUBLIC_SITE_URL:sta).
 */
import { getSiteUrl } from "@/lib/resend";
import { pricing } from "@content/pricing";
import type { FaqItem } from "@content/faq";

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

export function organizationSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Reilusoppari",
    url: siteUrl,
    logo: `${siteUrl}/logo-mark.svg`,
    description:
      "Reilusoppari on vuokranantajan ja vuokralaisen yhteinen työkalu koko vuokrasuhteen ajaksi: sopimus, katselmus, vuokrakuittaus ja todistus.",
    parentOrganization: {
      "@type": "Organization",
      name: "Adepta Oy",
      identifier: "2237131-2",
    },
  };
}

/**
 * SoftwareApplication-skeema etusivulle.
 *
 * Hinta on 0, koska se on se hinta, jolla palvelun voi ottaa käyttöön:
 * ensimmäinen vuokrasuhde on ilmainen ja vuokralaiselle palvelu on aina
 * maksuton. Kertamaksu kuvataan `description`-kentässä, jottei skeema lupaa
 * pysyvää nollahintaa (CLAUDE.md kohta 7: vain todennettavia väittämiä).
 */
export function softwareApplicationSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Reilusoppari",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: pricing.currency,
      description: `Ensimmäinen vuokrasuhde on ilmainen. Sen jälkeen ${pricing.tenancy.fee} € kertamaksuna vuokrasuhteelta, enintään ${pricing.tenancy.maxYears} vuodeksi. Vuokralaiselle aina maksuton.`,
    },
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbListSchema(entries: BreadcrumbEntry[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: `${siteUrl}${entry.path}`,
    })),
  };
}
