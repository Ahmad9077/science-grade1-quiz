import { expect, test } from '@playwright/test'
import { QUESTIONS } from '../../src/data/catalog'
import { answer, start } from './helpers'

test.skip(!process.env.OVERFLOW, 'on request')
for (const correct of [true, false]) {
  test(`no question overflows after answering (${correct ? 'right' : 'wrong'})`, async ({ page }) => {
    test.setTimeout(600_000)
    const bad: string[] = []
    for (const question of QUESTIONS) {
      await start(page, `/?keys=${question.key}`)
      await page.locator(`.topic-card[data-topic="${question.topic}"]`).click()
      await answer(page, correct)
      await page.waitForTimeout(300)
      const over = await page.evaluate(() => {
        const over = document.documentElement.scrollWidth - window.innerWidth
        if (over <= 1) return ''
        const wide = [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 || el.getBoundingClientRect().left < -1).map((el) => `${el.tagName}.${el.getAttribute('class')}`).slice(0, 5)
        return `${over} ${wide.join(' | ')}`
      })
      if (over) bad.push(`${question.key}: ${over}`)
    }
    expect(bad).toEqual([])
  })
}
