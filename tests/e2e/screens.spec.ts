import { test } from '@playwright/test'
import { answer, start } from './helpers'

// Visual review captures: run with SCREENS=1 npx playwright test screens
// (add SCREENS_PATH=/boys/ for the boys' copy).
const path = process.env.SCREENS_PATH ?? '/'
const copy = path.includes('boys') ? 'boys' : 'girls'
test.skip(!process.env.SCREENS, 'screenshots only on request')

test('capture every screen', async ({ page }, info) => {
  test.setTimeout(180_000)
  const shot = (name: string) => page.screenshot({ path: `test-results/screens/${copy}-${info.project.name}-${name}.png`, fullPage: true })
  await page.goto(path)
  await page.waitForTimeout(1500)
  await shot('1-splash')
  await start(page, path)
  await page.waitForTimeout(1200)
  await shot('2-home')
  await page.locator('.test-banner').click()
  for (let n = 0; n < 10; n += 1) {
    await page.waitForTimeout(900)
    await shot(`3-test-${n + 1}`)
    await answer(page, n % 4 !== 1)
    await page.waitForTimeout(900)
    await shot(`3-test-${n + 1}-answered`)
    await page.locator('.next-button').click()
  }
  await page.waitForTimeout(2500)
  await shot('4-results')
})
