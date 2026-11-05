import { expect, test, type Page } from '@playwright/test'
import { ASK_LINES, shown, type Format } from '../../src/data/catalog'
import { PRACTICE_SIZE, TEST_PLAN, TEST_SIZE } from '../../src/domain/round'
import { answer, current, noHorizontalScroll, start } from './helpers'

function trackAudio(page: Page) {
  const played: string[] = []
  const failed: string[] = []
  page.on('response', (res) => {
    const path = new URL(res.url()).pathname
    if (!path.includes('/audio/')) return
    played.push(path)
    if (res.status() >= 400) failed.push(path)
  })
  page.on('requestfailed', (req) => {
    if (req.url().includes('/audio/') || req.url().includes('/pics/')) failed.push(req.url())
  })
  return { played, failed }
}

for (const topic of ['habitats', 'protect'] as const) {
  test(`a whole ${topic} lesson can be answered, right and wrong`, async ({ page }) => {
    test.setTimeout(120_000)
    const audio = trackAudio(page)
    await start(page)
    await page.locator(`.topic-card[data-topic="${topic}"]`).click()
    const formats: string[] = []
    for (let n = 0; n < PRACTICE_SIZE; n += 1) {
      const { key, format } = await answer(page, n !== 2)
      expect(key.startsWith(`${topic}:`)).toBe(true)
      formats.push(format)
      await expect(page.locator('.feedback-fact')).not.toBeEmpty()
      await noHorizontalScroll(page)
      await page.locator('.next-button').click()
    }
    // A lesson shows the paper's different styles, never more than two of one.
    for (const format of new Set(formats)) expect(formats.filter((other) => other === format).length).toBeLessThanOrEqual(2)
    await expect(page.locator('.results-card')).toBeVisible()
    await expect(page.locator('.results-number')).toHaveText('٧')
    await expect(page.locator('.review-item')).toHaveCount(1)
    expect(audio.failed).toEqual([])
    expect(audio.played.some((path) => path.includes('/audio/ar/q/'))).toBe(true)
    expect(audio.played.some((path) => path.includes('/audio/ar/f/'))).toBe(true)
  })
}

test('the mock test is laid out like the Ministry paper', async ({ page }) => {
  test.setTimeout(120_000)
  await start(page)
  await page.locator('.test-banner').click()
  const ordinals = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس']
  for (let n = 0; n < TEST_SIZE; n += 1) {
    const { format } = await current(page)
    expect(TEST_PLAN[n]!.formats).toContain(format as Format)
    await expect(page.locator('.paper-pill')).toContainText(`السؤال ${ordinals[TEST_PLAN[n]!.slot - 1]}`)
    await answer(page, true)
    await page.locator('.next-button').click()
  }
  await expect(page.locator('.results-card')).toBeVisible()
  await expect(page.locator('.results-number')).toHaveText('١٠')
})

test('the spoken instruction changes from one question to the next of the same style', async ({ page }) => {
  test.setTimeout(90_000)
  await start(page)
  await page.locator('.test-banner').click()
  // The test opens with three ✓-in-the-box questions: each says a different line.
  const helps: string[] = []
  for (let n = 0; n < 3; n += 1) {
    await current(page)
    helps.push((await page.locator('.voice-help').innerText()).trim())
    await answer(page, true)
    await page.locator('.next-button').click()
  }
  expect(new Set(helps).size).toBe(3)
  for (const help of helps) expect(ASK_LINES.tick.map(shown)).toContain(help)
})

test('a wrong choice is explained, and the explanation can be heard again', async ({ page }) => {
  const audio = trackAudio(page)
  await start(page, '/?keys=protect:choose-dead-fish')
  await page.locator('.topic-card[data-topic="protect"]').click()
  await answer(page, false)
  await expect(page.locator('.feedback-word')).toHaveText('رمي النفايات في البحر')
  await expect(page.locator('.feedback-fact')).toHaveText('رمي النفايات في البحر يسبب موت الأسماك.')
  await page.getByRole('button', { name: 'اسمع الشرح' }).click()
  // The round loads every clip it can play before question one, the explanation among them.
  expect(audio.played).toContain('/audio/ar/f/dead-fish.mp3')
  expect(audio.played.some((path) => path.startsWith('/audio/ar/o/protect-dead-fish-'))).toBe(true)
  expect(audio.failed).toEqual([])
})
