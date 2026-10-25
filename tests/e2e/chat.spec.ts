import { test, expect } from "@playwright/test";

// Anthropicia ei kutsuta: /api/chat vastataan selaimessa mockilla. Chat-painike renderöityy
// vain avaimella, joten playwright.config.ts asettaa palvelimelle ANTHROPIC_API_KEY=testi.
// Se ei ole oikea avain, ja jokainen /api/chat-pyyntö pysäytetään selaimessa ennen palvelinta.

const LAUNCHER = "Kysy Reilusopparista";
const SUGGESTION = "Mitä Reilusoppari maksaa kolmelle asunnolle?";

test.describe("chat", () => {
  test("avautuu, vastaa mock-vastauksella ja sulkeutuu Esc-näppäimellä", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    let posted: { messages: { role: string; content: string }[] } | null = null;
    await page.route("**/api/chat", async (route) => {
      const req = route.request();
      if (req.method() === "GET") {
        await route.fulfill({ json: { enabled: true } });
        return;
      }
      posted = req.postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "text/plain; charset=utf-8",
        body: "Kolme asuntoa Plussalla maksaa **36 € vuodessa** (sis. ALV 25,5 %).\n\nLähde: [Hinnat](/hinnat)",
      });
    });

    await page.goto("/");
    const launcher = page.getByRole("button", { name: LAUNCHER });
    await expect(launcher).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await launcher.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Älä kirjoita henkilötunnusta")).toBeVisible();
    await expect(dialog.getByRole("button", { name: SUGGESTION })).toBeVisible();

    await dialog.getByRole("button", { name: SUGGESTION }).click();
    await expect(dialog.getByText("36 € vuodessa")).toBeVisible();
    expect(posted!.messages.at(-1)).toEqual({ role: "user", content: SUGGESTION });
    await expect(dialog.getByRole("link", { name: "Hinnat" })).toHaveAttribute("href", "/hinnat");

    // Syöte kirjoitetaan ja lähetetään Enterillä.
    await dialog.getByLabel("Kysymyksesi").fill("Entä vuokralainen?");
    await dialog.getByLabel("Kysymyksesi").press("Enter");
    await expect.poll(() => posted?.messages.length).toBe(3);

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(launcher).toBeFocused();
    expect(errors).toEqual([]);
  });

  test("näyttää ystävällisen ilmoituksen ja yhteydenottolinkin kun chat ei ole käytössä", async ({ page }) => {
    await page.route("**/api/chat", (route) => route.fulfill({ json: { enabled: false } }));
    await page.goto("/");
    await page.getByRole("button", { name: LAUNCHER }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Chat ei ole vielä käytössä")).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Ota yhteyttä" })).toHaveAttribute("href", "/yhteystiedot");
    await expect(dialog.getByLabel("Kysymyksesi")).toHaveCount(0);
  });

  test("näyttää virheen, kun rajapinta palauttaa nopeusrajoituksen", async ({ page }) => {
    await page.route("**/api/chat", async (route) => {
      if (route.request().method() === "GET") return route.fulfill({ json: { enabled: true } });
      return route.fulfill({ status: 429, json: { error: "rate_limited" } });
    });
    await page.goto("/");
    await page.getByRole("button", { name: LAUNCHER }).click();
    await page.getByRole("button", { name: SUGGESTION }).click();
    await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Odota hetki");
  });

  test("toimii puhelinleveydellä ilman vaakavieritystä", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.route("**/api/chat", (route) => route.fulfill({ json: { enabled: true } }));
    await page.goto("/");
    await page.getByRole("button", { name: LAUNCHER }).click();
    const box = await page.getByRole("dialog").boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test("näyttää ehdotusnapin ilman raakatagia ja esitäyttää lomakkeen aiheen", async ({ page }) => {
    let posted: { messages: { role: string; content: string }[] } | null = null;
    await page.route("**/api/chat", async (route) => {
      const req = route.request();
      if (req.method() === "GET") {
        await route.fulfill({ json: { enabled: true } });
        return;
      }
      posted = req.postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "text/plain; charset=utf-8",
        body: 'Kahdelletoista asunnolle salkkuhinta on 180 € vuodessa (sis. ALV 25,5 %).\n\nLähde: [Hinnat](/hinnat)\u001E{"cta":"tarjous"}',
      });
    });
    await page.goto("/");
    await page.getByRole("button", { name: LAUNCHER }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Kysymyksesi").fill("Paljonko 12 asuntoa maksaa?");
    await dialog.getByLabel("Kysymyksesi").press("Enter");
    const cta = dialog.getByRole("link", { name: "Pyydä tarjous salkulle" });
    await expect(cta).toHaveAttribute("href", "/yhteystiedot?aihe=tarjous&lahde=chat");
    await expect(dialog).not.toContainText("ehdotus");

    // Seuraavassa kysymyksessä aiempi ehdotus kulkee historiassa tagina.
    await dialog.getByLabel("Kysymyksesi").fill("Entä verolaskelma?");
    await dialog.getByLabel("Kysymyksesi").press("Enter");
    await expect.poll(() => posted?.messages.length).toBe(3);
    expect(posted!.messages[1].content).toContain("[[ehdotus:tarjous]]");

    await dialog.getByRole("link", { name: "Pyydä tarjous salkulle" }).last().click();
    await expect(page).toHaveURL(/\/yhteystiedot\?aihe=tarjous&lahde=chat/);
    await expect(page.getByLabel("Aihe")).toHaveValue("tarjous");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
