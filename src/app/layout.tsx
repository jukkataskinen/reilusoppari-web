import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { sans, jetbrainsMono } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://reilusoppari.fi"),
  title: {
    default: "Reilusoppari – vuokrasopimus, jonka molemmat allekirjoittavat mielellään",
    template: "%s | Reilusoppari",
  },
  description:
    "Sopimus pankkitunnuksilla, kuvat asunnon kunnosta, vuokrakuittaukset ja lopuksi todistus – molemmille. Ensimmäinen vuokrasuhde on ilmainen, vuokralaiselle aina maksuton.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="fi" className={`${sans.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Siirry sisältöön
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        {plausibleDomain && (
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={plausibleDomain}
            strategy="afterInteractive"
            nonce={nonce}
          />
        )}
      </body>
    </html>
  );
}
