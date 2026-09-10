import Image from "next/image";

type LogoVariant = "full" | "mark";

interface LogoProps {
  /** "full" = merkki + sanamerkki, "mark" = pelkkä merkki. */
  variant?: LogoVariant;
  className?: string;
  /** Näkyvä nimi ruudunlukijoille. */
  title?: string;
  /** Merkin korkeus pikseleinä; leveys on sama (neliömäinen viewBox). */
  markSize?: number;
}

/**
 * Reilusoppari-logo (CLAUDE.md kohta 5).
 *
 * Merkki on yksi koti, jonka sisällä on kaksi yhtä suurta neliötä: `sky`
 * vuokranantaja ja `coral` vuokralainen. Samankokoisuus on koko brändin
 * väite, joten merkkiä ei saa muuttaa niin, että toinen väri hallitsee.
 *
 * Sanamerkki on tässä komponentissa eikä erillisessä SVG-tiedostossa, jotta
 * se perii värin currentColorina ja toimii sekä vaalealla että tummalla
 * pohjalla (alatunniste on `ink`-pohjainen).
 */
export function Logo({
  variant = "full",
  className,
  title = "Reilusoppari",
  markSize = 36,
}: LogoProps) {
  const mark = (
    <Image
      src="/logo-mark.svg"
      alt=""
      width={markSize}
      height={markSize}
      // Logo on ensimmäisiä näkyviä elementtejä – ei laiskaa latausta, muuten
      // se välkkyy sisään ja heikentää LCP:tä. SVG:tä Next.js ei optimoi.
      priority
      unoptimized
      className="shrink-0"
    />
  );

  if (variant === "mark") {
    return (
      <span className={className} role="img" aria-label={title}>
        {mark}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
      role="img"
      aria-label={title}
    >
      {mark}
      {/*
        Sanamerkki on yksivärinen: kaikki yhteinen on `ink` (CLAUDE.md kohta 5),
        ja kaksi väriä kantaa merkki. aria-hidden, koska saavutettava nimi tulee
        ulomman spanin aria-labelista – muuten ruudunlukija lukisi nimen kahdesti.
      */}
      <svg
        viewBox="0 0 196 34"
        aria-hidden="true"
        focusable="false"
        className="h-[24px] w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="26"
          fontFamily="var(--font-sans-local), sans-serif"
          fontWeight="800"
          fontSize="29"
          letterSpacing="-0.8"
          fill="currentColor"
        >
          Reilusoppari
        </text>
      </svg>
    </span>
  );
}
