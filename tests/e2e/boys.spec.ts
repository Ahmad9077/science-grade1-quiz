import { expect, test, type Page } from '@playwright/test'
import { WORDING } from '../../src/audience'
import { PRACTICE_SIZE } from '../../src/domain/round'
import { answer, noHorizontalScroll, start } from './helpers'

// The boys' copy (boys/index.html) must never speak to a girl, on screen or aloud.
const FEMININE = /أحسنتي|شطورة|بطلة|عليج|إنتي|أنتي|تبين|تطلعين|تعلمي|تدربي|اسمعي|حاولي|ارجعي|افتحي|اختاري|شفتي|خلصتي/

async function speaksToABoy(page: Page) {
  expect(await page.locator('body').innerText()).not.toMatch(FEMININE)
  const labels = await page.locator('[aria-label]').evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')).join(' '))
  expect(labels).not.toMatch(FEMININE)
}

function trackAudio(page: Page) {
  const played: string[] = []
  const failed: string[] = []
  page.on('response', (res) => {
    const path = new URL(res.url()).pathname
    if (!path.includes('/audio/')) return
    played.push(path)
    if (res.status() >= 400) failed.push(path)
  })
  return { played, failed }
}

test('the boys copy speaks to a boy through a whole lesson', async ({ page }) => {
  test.setTimeout(120_000)
  const audio = trackAudio(page)
  await start(page, '/boys/')
  await speaksToABoy(page)

  await page.locator('.topic-card[data-topic="reproduction"]').click()
  await expect(page.locator('.mode-title')).toHaveText([WORDING.boys.learn, WORDING.boys.practice])
  await speaksToABoy(page)

  await page.locator('.mode-learn').click()
  await expect(page.locator('.learn-card')).toBeVisible()
  await speaksToABoy(page)
  while (!(await page.locator('.learn-done').isVisible())) await page.locator('.learn-next').click()
  await speaksToABoy(page)
  await page.getByRole('button', { name: WORDING.boys.practiceNow }).click()

  for (let n = 0; n < PRACTICE_SIZE; n += 1) {
    const correct = n !== 1
    await answer(page, correct)
    if (correct) await expect(page.locator('.feedback-title')).toHaveText(new RegExp(WORDING.boys.praise.join('|')))
    await speaksToABoy(page)
    if (n === 3) {
      await page.locator('.round-button[aria-label="خروج"]').click()
      await expect(page.locator('#exit-title')).toHaveText(WORDING.boys.exitTitle)
      await page.getByRole('button', { name: 'أكمل اللعب' }).click()
    }
    await page.locator('.next-button').click()
  }

  await expect(page.locator('.results-card')).toBeVisible()
  await expect(page.getByRole('button', { name: WORDING.boys.tryAgain })).toBeVisible()
  await speaksToABoy(page)
  await noHorizontalScroll(page)

  // Narration: the boys' own lines, shared lines from the main audio folder, nothing missing.
  expect(audio.failed).toEqual([])
  expect(audio.played).toContain('/audio/ui/boys/welcome.mp3')
  expect(audio.played).toContain('/audio/f/boys/r-nest.mp3')
  expect(audio.played).toContain('/audio/ui/boys/learn-done.mp3')
  expect(audio.played.some((path) => path.startsWith('/audio/q/reproduction/'))).toBe(true)
  for (const girls of ['/audio/ui/welcome.mp3', '/audio/ui/praise-1.mp3', '/audio/ui/learn-done.mp3', '/audio/f/r-nest.mp3']) {
    expect(audio.played).not.toContain(girls)
  }

  // Each copy keeps its own stars on a shared device.
  const saved = await page.evaluate(() => [localStorage.getItem('science-grade1-boys:progress:v1'), localStorage.getItem('science-grade1:progress:v1')])
  expect(saved[0]).toContain('reproduction')
  expect(saved[1]).toBeNull()
})

test('the girls copy is unchanged', async ({ page }) => {
  const audio = trackAudio(page)
  await start(page)
  await page.locator('.topic-card[data-topic="reproduction"]').click()
  await expect(page.locator('.mode-title')).toHaveText(['تعلمي', 'تدربي'])
  await page.locator('.mode-practice').click()
  await answer(page, true)
  await expect(page.locator('.feedback-title')).toHaveText(/أحسنتي!|شطورة!|ممتاز يا بطلة!|برافو عليج!/)
  expect(audio.played).toContain('/audio/ui/welcome.mp3')
  expect(audio.played.filter((path) => path.includes('/boys/'))).toEqual([])
})
