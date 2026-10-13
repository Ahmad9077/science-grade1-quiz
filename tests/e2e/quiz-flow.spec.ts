import { expect, test } from '@playwright/test'
import { PRACTICE_SIZE } from '../../src/domain/round'
import { answer, noHorizontalScroll, start } from './helpers'

test('home lists the six lessons and the mock test, in Arabic RTL', async ({ page }) => {
  await start(page)
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('.topic-card')).toHaveCount(6)
  await expect(page.locator('.test-banner')).toBeVisible()
  await expect(page.locator('.preview-badge').first()).toBeVisible()
  await noHorizontalScroll(page)
})

test('learn cards narrate and lead into practice', async ({ page }) => {
  await start(page)
  const narration = page.waitForRequest((req) => req.url().includes('/audio/f/b-like-us'))
  await page.locator('.topic-card[data-topic="breathing"]').click()
  await narration
  await page.getByRole('button', { name: /تعلمي/ }).click()
  await expect(page.locator('.learn-card')).toBeVisible()
  await expect(page.locator('.learn-art-label').first()).toBeVisible()
  for (let n = 0; n < 6; n += 1) {
    await page.locator('.learn-next').click()
  }
  await expect(page.locator('.learn-done')).toBeVisible()
  await page.getByRole('button', { name: /تدربي الآن/ }).click()
  await expect(page.locator('section.question')).toBeVisible()
})

test('a full practice round gives feedback, stars and a review of misses', async ({ page }) => {
  test.setTimeout(120_000)
  await start(page)
  await page.locator('.topic-card[data-topic="plants"]').click()
  await page.getByRole('button', { name: /تدربي/ }).click()

  for (let n = 0; n < PRACTICE_SIZE; n += 1) {
    const correct = n !== 2 && n !== 5
    await answer(page, correct)
    await expect(page.locator(correct ? '.feedback-good' : '.feedback-miss')).toBeVisible()
    if (!correct) await expect(page.locator('.option.is-reveal')).toHaveCount(1)
    await noHorizontalScroll(page)
    await page.locator('.next-button').click()
  }

  await expect(page.locator('.results-card')).toBeVisible()
  await expect(page.locator('.results-number')).toHaveText('٦')
  await expect(page.locator('.review-item')).toHaveCount(2)
  await page.getByRole('button', { name: /الدروس/ }).click()
  await expect(page.locator('.topic-card[data-topic="plants"] .star-icon.is-filled')).toHaveCount(2)
})

test('the mock test mixes all six lessons', async ({ page }) => {
  test.setTimeout(120_000)
  await start(page)
  await page.locator('.test-banner').click()
  const topics = new Set<string>()
  for (let n = 0; n < 12; n += 1) {
    const question = await answer(page, true)
    topics.add(question.topic)
    await page.locator('.next-button').click()
  }
  expect(topics.size).toBe(6)
  await expect(page.locator('.results-number')).toHaveText('١٢')
})

test('options are read aloud with their tile highlighted', async ({ page }) => {
  await start(page)
  await page.locator('.topic-card[data-topic="food"]').click()
  await page.getByRole('button', { name: /تدربي/ }).click()
  await expect(page.locator('.option.is-speaking')).toHaveCount(1, { timeout: 10_000 })
})
