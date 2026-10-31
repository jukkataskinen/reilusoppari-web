import { Container } from "@/components/Container";
import { company } from "@content/company";

/**
 * "Miksi Reilusoppari?" – kehittäjän oma perustelu (Jukka hyväksyi tekstin ja
 * allekirjoituksen 31.10.2026, ks. DECISIONS.md). Tämä on aito, nimetty
 * lausuma, ei keksitty asiakassitaatti (CLAUDE.md kohta 7).
 *
 * Yhtiön nimi tulee content/company.ts:stä, ei kovakoodattuna.
 */
const quote =
  "Olen nähnyt tilitoimistotyössäni liian monta vuokrasuhteen riitaa, jotka olisivat olleet vältettävissä selkeällä sopimuksella ja kunnon kuvilla. Kehitin Reilusopparin, jotta vuokraaminen olisi konstailematonta, reilua ja turvallista molemmille osapuolille.";

export function Tarina() {
  return (
    <section className="border-b border-line bg-paper py-14 md:py-[88px]">
      <Container>
        <h2 className="text-2xl md:text-[32px]">Miksi Reilusoppari?</h2>
        <figure className="mt-8">
          <blockquote>
            <p className="prose-measure text-lg leading-[1.6] md:text-xl">{quote}</p>
          </blockquote>
          <figcaption className="mt-4 text-ink/70">Jukka Taskinen, {company.name}</figcaption>
        </figure>
      </Container>
    </section>
  );
}
