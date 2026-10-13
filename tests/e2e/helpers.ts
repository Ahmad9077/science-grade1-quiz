import { expect, type Page } from '@playwright/test'
import { QUESTIONS } from '../../src/data/catalog'

export async function start(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /هيا نبدأ/ }).click()
  await expect(page.locator('.home')).toBeVisible()
}

const lastKey = new WeakMap<Page, string>()

/** Answers the visible question; `correct` picks the right option or a wrong one. */
export async function answer(page: Page, correct: boolean) {
  // The previous question animates out before the next one mounts.
  const previous = lastKey.get(page)
  const section = previous
    ? page.locator(`section.question:not([data-question-key="${previous}"])`)
    : page.locator('section.question')
  await expect(section).toHaveCount(1)
  await expect(page.locator('section.question')).toHaveCount(1)
  const key = await section.getAttribute('data-question-key')
  if (key) lastKey.set(page, key)
  const question = QUESTIONS.find((q) => q.key === key)
  if (!question) throw new Error(`Unknown question on screen: ${key}`)
  const option = correct
    ? question.options.find((o) => o.id === question.answer)!
    : question.options.find((o) => o.id !== question.answer)!
  await section.getByRole('button', { name: option.label, exact: true }).click()
  await expect(page.locator('.feedback')).toBeVisible()
  return question
}

export async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
}
