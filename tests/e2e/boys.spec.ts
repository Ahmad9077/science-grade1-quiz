import { expect, test, type Page } from '@playwright/test'
import { YOU_LINES } from '../../src/data/catalog'
import { PRACTICE_SIZE } from '../../src/domain/round'
import { answer, noHorizontalScroll, start } from './helpers'

// Each copy speaks to its own child, on screen and aloud; everything else is shared.
const FEMININE = /بطلة|شاطرة|عالمة|إنتي|أنتي|تبين|اسمعي|ارجعي|افتحي|جاهزة/
const MASCULINE = /يا بطل!|يا شاطر!|عالم صغير|إنت عالم|اسمع مرة|ارجع إلى|جاهز للاختبار/

async function screenText(page: Page) {
  const labels = await page.locator('[aria-label]').evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')).join(' '))
  return `${await page.locator('body').innerText()} ${labels}`
}

function trackAudio(page: Page) {
  const played: string[] = []
  page.on('response', (res) => {
    const path = new URL(res.url()).pathname
    if (path.includes('/audio/')) played.push(path)
  })
  return played
}

test('the boys copy speaks to a boy through a whole lesson', async ({ page }) => {
  test.setTimeout(120_000)
  const played = trackAudio(page)
  await start(page, '/boys/')
  expect(await screenText(page)).not.toMatch(FEMININE)
  await page.locator('.topic-card[data-topic="habitats"]').click()
  for (let n = 0; n < PRACTICE_SIZE; n += 1) {
    await answer(page, true)
    const title = await page.locator('.feedback-title').innerText()
    expect(YOU_LINES.girls.cheer.some((line) => title.includes(line.replace('!', '')))).toBe(false)
    expect(await screenText(page)).not.toMatch(FEMININE)
    await page.locator('.next-button').click()
  }
  await expect(page.locator('.results-card')).toBeVisible()
  expect(await screenText(page)).not.toMatch(FEMININE)
  await noHorizontalScroll(page)
  // The boys' own lines come from their folder; the girls' are never loaded.
  expect(played.some((path) => path.includes('/audio/ar/ui/boys/'))).toBe(true)
  expect(played.filter((path) => path.includes('/audio/ar/ui/girls/'))).toEqual([])
  // Each copy keeps its own stars on a shared device.
  const saved = await page.evaluate(() => [localStorage.getItem('science-grade1-boys:progress:v2'), localStorage.getItem('science-grade1:progress:v2')])
  expect(saved[0]).toContain('habitats')
  expect(saved[1]).toBeNull()
})

test('the girls copy speaks to a girl', async ({ page }) => {
  test.setTimeout(90_000)
  const played = trackAudio(page)
  await start(page)
  expect(await screenText(page)).not.toMatch(MASCULINE)
  await page.locator('.topic-card[data-topic="protect"]').click()
  for (let n = 0; n < 4; n += 1) {
    await answer(page, true)
    expect(await screenText(page)).not.toMatch(MASCULINE)
    await page.locator('.next-button').click()
  }
  expect(played.some((path) => path.includes('/audio/ar/ui/girls/'))).toBe(true)
  expect(played.filter((path) => path.includes('/audio/ar/ui/boys/'))).toEqual([])
})
