// The tool end to end against the built site (vite preview): cover → three cards →
// reload lands on the first unanswered card, never card 1; a whole deck on a phone →
// reveal → plan → ownership → summary; the plan as a file. Every request must be a
// same-origin static file: there is no API and no third party.
import { test, expect, type Page } from '@playwright/test';

const STATIC = /\.(html|js|css|woff2|svg|json|map)(\?.*)?$|\/$/;

function watch(page: Page, baseURL: string | undefined) {
  const origin = new URL(baseURL || 'http://127.0.0.1:4173').origin;
  const bad: string[] = [];
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(origin) || !STATIC.test(new URL(u).pathname)) bad.push(u); });
  return bad;
}

test('cover → deck → reload lands on the first unanswered card; the plan can be saved as a file', async ({ page, baseURL }) => {
  const bad = watch(page, baseURL);
  await page.goto('/');
  await page.locator('.intro-page').getByRole('button', { name: /^Aloita/ }).click(); // the intro page, once per visit
  await expect(page.getByRole('heading', { name: 'Tuotantosuunnitelma' })).toBeVisible();
  const start = page.getByRole('button', { name: /^Aloita/ });
  await expect(start).toBeDisabled();

  await page.getByRole('button', { name: 'Keikka' }).click();
  await page.getByLabel(/Montako ihmistä/).fill('120');
  await expect(start).toBeEnabled();
  await start.click();

  // Card 1 is the venue card: two answers, no ↑.
  const front = page.locator('.card.front');
  await expect(front).toContainText('Onko sinulla jo tila mielessä');
  await expect(front.getByRole('button', { name: /Ei vielä/ })).toBeVisible();
  await expect(front.locator('.actions .btn')).toHaveCount(2);

  await front.getByRole('button', { name: /^Kyllä/ }).click();          // venue = own
  await expect(front).toContainText('Millaista ohjelmaa');
  await front.getByRole('button', { name: 'Livemusiikki' }).click();   // programme (multi)
  await front.getByRole('button', { name: /^Valmis/ }).click();
  await expect(front).toContainText('Yhtenä päivänä vai useampana');
  await front.getByRole('button', { name: 'Yhtenä päivänä' }).click(); // performances

  await page.reload();
  await expect(front).toBeVisible();
  await expect(front).not.toContainText('Onko sinulla jo tila mielessä');
  await expect(front).not.toContainText('Yhtenä päivänä vai useampana');
  await expect(page.locator('.prog .muted')).toHaveText(/^4 \/ \d+$/);

  // Tallenna ja lopeta: the plan as a file.
  await page.getByRole('button', { name: 'Tallenna ja lopeta' }).click();
  await expect(page.getByText('Tallennettu.')).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Lataa tiedosto' }).click()]);
  expect(download.suggestedFilename()).toMatch(/^tuotantosuunnitelma-\d{4}-\d{2}-\d{2}\.json$/);

  expect(bad).toEqual([]);
});

// Phone width: the plan renders as the list (the matrix at ≥ 1200 px has no why button).
test.describe('phone', () => {
test.use({ viewport: { width: 390, height: 844 } });
test('a whole deck by buttons → reveal → plan with a CSV download → ownership → summary', async ({ page, baseURL }) => {
  const bad = watch(page, baseURL);
  await page.goto('/');
  await page.locator('.intro-page').getByRole('button', { name: /^Aloita/ }).click(); // the intro page, once per visit
  await page.getByRole('button', { name: 'Keikka' }).click();
  await page.getByLabel(/Montako ihmistä/).fill('120');
  await page.getByRole('button', { name: /^Aloita/ }).click();
  await expect(page.locator('.card.front')).toBeVisible();
  // Answer every card: tap cards take their first option (multi confirms), swipe cards take "right" — except the venue card, which we leave open (← Ei vielä).
  for (let i = 0; i < 40; i += 1) {
    if (await page.getByRole('button', { name: /Näytä suunnitelma/ }).isVisible().catch(() => false)) break;
    const front = page.locator('.card.front');
    if (!(await front.isVisible().catch(() => false))) break;
    if (await front.getByRole('button', { name: /Ei vielä/ }).isVisible().catch(() => false)) { await front.getByRole('button', { name: /Ei vielä/ }).click(); await page.waitForTimeout(300); continue; }
    const opt = front.locator('.opt').first();
    if (await opt.isVisible().catch(() => false)) {
      await opt.click();
      const confirm = front.getByRole('button', { name: /^Valmis/ });
      if (await confirm.isVisible().catch(() => false)) await confirm.click();
      await page.waitForTimeout(150);
      continue;
    }
    // Swipe cards: "Kyllä →" is the primary button whether ↑ is offered (three buttons) or not (two).
    await front.locator('.actions .btn.primary').click();
    await page.waitForTimeout(300);
  }
  await expect(page.getByRole('button', { name: /Näytä suunnitelma/ })).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: /Näytä suunnitelma/ }).click();
  await expect(page.getByRole('heading', { name: /^Keikka, / })).toBeVisible();
  await expect(page.locator('.task').first()).toBeVisible();
  // Tick a task: the store persists it and the row strikes through.
  const first = page.locator('.task input[type=checkbox]').first();
  await first.check();
  await expect(page.locator('.task.done').first()).toBeVisible();
  // Why lines open in place with the rule id.
  await page.locator('.task .whybtn').first().click();
  await expect(page.locator('.task .why').first()).toContainText('sääntö');
  // CSV download.
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Lataa taulukkona' }).click()]);
  expect(download.suggestedFilename()).toMatch(/^tuotantosuunnitelma-\d{4}-\d{2}-\d{2}\.csv$/);
  // Reload lands on the plan (revealed), never on the reveal again.
  await page.reload();
  await expect(page.getByRole('heading', { name: /^Keikka, / })).toBeVisible();
  await expect(page.locator('.task.done').first()).toBeVisible();
  // Ownership pass: "Kaikki minun" on every category → the summary; reload lands on the summary.
  await page.getByRole('button', { name: /^Kuka hoitaa mitä/ }).click();
  await expect(page.getByText(/^Kokonaisuus 1 \//)).toBeVisible();
  for (let i = 0; i < 12; i += 1) {
    if (await page.getByText('Tässä suunnitelmasi.').isVisible().catch(() => false)) break;
    await page.getByRole('button', { name: /^Kaikki minun/ }).click();
    await page.waitForTimeout(350);
  }
  await expect(page.getByText('Tässä suunnitelmasi.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Tässä suunnitelmasi.')).toBeVisible();
  // Back to the plan: its button now reads Yhteenveto.
  await page.getByRole('button', { name: 'Takaisin suunnitelmaan' }).click();
  await expect(page.getByRole('button', { name: /^Yhteenveto/ })).toBeVisible();
  expect(bad).toEqual([]);
});
});

test('the rules page renders without a server', async ({ page, baseURL }) => {
  const bad = watch(page, baseURL);
  await page.goto('/saannot.html');
  await expect(page.getByRole('heading', { name: 'Näin suunnitelma syntyy' })).toBeVisible();
  await page.getByRole('link', { name: 'Ajot A–I' }).click();
  await expect(page.getByText(/^Ajo A/)).toBeVisible();
  expect(bad).toEqual([]);
});
