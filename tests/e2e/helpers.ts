import { expect, type Page } from '@playwright/test'

export async function start(page: Page, path = '/') {
  await page.goto(path)
  await page.getByRole('button', { name: /هيا نبدأ/ }).click()
  await expect(page.locator('.home')).toBeVisible()
}

const lastKey = new WeakMap<Page, string>()

interface Solution {
  answer: string
  good: string[]
  rows: string[]
  need: number | null
}

/** The question on screen now (after the previous answered one has animated out). */
export async function current(page: Page, answering = false) {
  const previous = lastKey.get(page)
  const section = previous ? page.locator(`section.question:not([data-question-key="${previous}"])`) : page.locator('section.question')
  await expect(section).toHaveCount(1)
  await expect(page.locator('section.question')).toHaveCount(1)
  const key = (await section.getAttribute('data-question-key'))!
  if (answering) lastKey.set(page, key)
  const solution = JSON.parse((await section.getAttribute('data-solution'))!) as Solution
  const format = (await section.getAttribute('class'))!.match(/format-(\w+)/)![1]!
  return { section, key, format, solution }
}

/** Answers the visible question, right or wrong, in whatever style it is asked. */
export async function answer(page: Page, correct: boolean) {
  const { section, key, format, solution } = await current(page, true)
  const check = () => section.getByRole('button', { name: 'تحقق' }).click()

  if (['tf', 'tick', 'sort', 'choose', 'word'].includes(format)) {
    const ids = await section.locator('[data-option]').evaluateAll((els) => els.map((el) => el.getAttribute('data-option')!))
    const id = correct ? solution.answer : ids.find((other) => other !== solution.answer)!
    await section.locator(`[data-option="${id}"]`).click()
  } else if (format === 'circle' || format === 'cross') {
    const ids = await section.locator('[data-option]').evaluateAll((els) => els.map((el) => el.getAttribute('data-option')!))
    for (const id of correct ? solution.good : [ids.find((other) => !solution.good.includes(other))!]) await section.locator(`[data-option="${id}"]`).click()
    await check()
  } else if (format === 'color') {
    const ids = await section.locator('[data-option]').evaluateAll((els) => els.map((el) => el.getAttribute('data-option')!))
    for (const paint of ['land', 'water'] as const) {
      await section.locator(`[data-crayon="${paint}"]`).click()
      for (const id of ids) if ((paint === 'land') === (correct ? solution.good.includes(id) : true)) await section.locator(`[data-option="${id}"]`).click()
    }
    await check()
  } else if (format === 'table' || format === 'homes') {
    if (!correct) {
      const keys = await section.locator('[data-key]').evaluateAll((els) => els.map((el) => el.getAttribute('data-key')!))
      await section.locator(`[data-key="${keys.find((other) => other !== solution.rows[0])}"]`).click()
    }
    for (const id of solution.rows) await section.locator(`[data-key="${id}"]`).click()
  } else if (format === 'number') {
    if (!correct) await section.locator(`[data-spot="${solution.rows[1]}"]`).click()
    for (const id of solution.rows) await section.locator(`[data-spot="${id}"]`).click()
  } else if (format === 'scene') {
    const spots = await section.locator('[data-spot]').evaluateAll((els) => els.map((el) => el.getAttribute('data-spot')!))
    const picks = correct ? solution.good.slice(0, solution.need ?? solution.good.length) : [spots.find((spot) => !solution.good.includes(spot))!]
    for (const id of picks) await section.locator(`[data-spot="${id}"]`).click({ force: true })
    await check()
  } else {
    throw new Error(`No way to answer ${key} (${format})`)
  }
  await expect(page.locator('.feedback')).toBeVisible()
  await expect(page.locator('.feedback')).toHaveClass(correct ? /feedback-good/ : /feedback-miss/)
  return { key, format }
}

export async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
}
