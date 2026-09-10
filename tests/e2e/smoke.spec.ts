import { test, expect, type ConsoleMessage } from "@playwright/test";

/**
 * Savutesti (CLAUDE.md kohta 8): jokainen sivukartan sivu vastaa 200,
 * konsoliin ei tule virheitä ja odotuslistalomake validoi.
 */
const paths = [
  "/",
  "/miten-toimii",
  "/vuokranantajalle",
  "/vuokralaiselle",
  "/katselmus",
  "/verolaskelma",
  "/hinnat",
  "/todistus",
  "/blogi",
  "/ukk",
  "/yhteystiedot",
  "/tietosuoja",
  "/kayttoehdot",
];

for (const path of paths) {
  test(`sivu ${path} latautuu ilman konsolivirheitä`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message: ConsoleMessage) => {
      if (message.type() === "error") errors.push(message.text());
    });

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("blogiartikkelit latautuvat ja niissä on UKK-osio", async ({ page }) => {
  await page.goto("/blogi");

  const links = page.locator('a[href^="/blogi/"]');
  const count = await links.count();
  expect(count).toBeGreaterThan(0);

  // Ensimmäinen artikkeli riittää: kaikki käyttävät samaa sivupohjaa.
  await links.first().click();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByText("Lyhyesti")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Usein kysytyt kysymykset" })).toBeVisible();
});

test("robots ja sitemap vastaavat", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/rss.xml"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
  }
});

test("hero-kytkin vaihtaa osapuolen ja muistaa sen URL-parametrissa", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Olen vuokralainen" }).click();

  await expect(page.getByRole("link", { name: "Pyydä vuokranantajaa käyttämään" })).toBeVisible();
  await expect(page).toHaveURL(/osapuoli=vuokralainen/);
});

test("odotuslistalomake näyttää asuntokentän vain vuokranantajalle", async ({ page }) => {
  await page.goto("/#odotuslista");

  const apartments = page.getByLabel(/Montako asuntoa/);
  await expect(apartments).toBeVisible();

  // Hero-kytkimessä on samat tekstit, joten valinta rajataan odotuslistan
  // osioon – muuten valitsin osuisi kahteen elementtiin. Klikkaus kohdistuu
  // labeliin, koska itse radio on sr-only eikä ota vastaan osoitintapahtumia.
  await page.locator("#odotuslista").getByText("Olen vuokralainen").click();
  await expect(apartments).toHaveCount(0);
});

test("odotuslistalomake validoi sähköpostin", async ({ page }) => {
  await page.goto("/#odotuslista");

  await page.getByLabel("Sähköposti").fill("ei-sahkoposti");
  await page.getByRole("button", { name: "Liity odotuslistalle" }).click();

  await expect(page.getByText("Anna kelvollinen sähköpostiosoite.")).toBeVisible();
});
