import { expect, test } from '@playwright/test'
import { answer, start } from './helpers'

test('preview never calls the Hub or Supabase', async ({ page }) => {
  const external: string[] = []
  page.on('request', (req) => {
    const url = req.url()
    if (url.includes('ahmad9077.github.io') || url.includes('supabase')) external.push(url)
  })
  await start(page)
  await page.locator('.topic-card[data-topic="habitats"]').click()
  await answer(page, true)
  expect(external).toEqual([])
})

test('production build loads the Hub access guard for science-grade1 first', async ({ page }) => {
  const requested: string[] = []
  await page.route('https://ahmad9077.github.io/quizzes-hub/**', async (route) => {
    const url = route.request().url()
    requested.push(url)
    if (url.includes('config.js')) return route.fulfill({ contentType: 'text/javascript', body: 'window.QUIZZES_HUB_CONFIG = {}' })
    if (url.includes('access-guard.js')) {
      return route.fulfill({
        contentType: 'text/javascript',
        body: `window.__guardQuizId = document.currentScript.dataset.quizId;
               window.QuizzesHubAccessReady = Promise.resolve({ ok: true, quizId: 'science-grade1', difficulty: 'easy' });`,
      })
    }
    return route.fulfill({ contentType: 'text/javascript', body: '' })
  })
  await page.goto('http://127.0.0.1:4184/science-grade1-quiz/')
  await expect(page.getByRole('button', { name: /هيا نبدأ/ })).toBeVisible()
  expect(await page.evaluate(() => (window as unknown as { __guardQuizId: string }).__guardQuizId)).toBe('science-grade1')
  expect(requested[0]).toContain('/config.js?v=4')
  expect(requested[1]).toContain('/access-guard.js?v=3')
  await expect(page.locator('.preview-badge')).toHaveCount(0)
})

test('production build stops when the Hub denies access', async ({ page }) => {
  await page.route('https://ahmad9077.github.io/quizzes-hub/**', (route) => {
    const url = route.request().url()
    if (url.includes('access-guard.js')) {
      return route.fulfill({ contentType: 'text/javascript', body: 'window.QuizzesHubAccessReady = Promise.reject(new Error("denied"));' })
    }
    return route.fulfill({ contentType: 'text/javascript', body: '' })
  })
  await page.goto('http://127.0.0.1:4184/science-grade1-quiz/')
  await expect(page.locator('.bootstrap-error')).toBeVisible()
  await expect(page.getByRole('button', { name: /هيا نبدأ/ })).toHaveCount(0)
})

test('production boys copy registers as science-grade1-boys and reads the shared audio and pictures', async ({ page }) => {
  await page.route('https://ahmad9077.github.io/quizzes-hub/**', async (route) => {
    const url = route.request().url()
    if (url.includes('access-guard.js')) {
      return route.fulfill({
        contentType: 'text/javascript',
        body: `window.__guardQuizId = document.currentScript.dataset.quizId;
               window.QuizzesHubAccessReady = Promise.resolve({ ok: true, quizId: 'science-grade1-boys', difficulty: 'medium' });`,
      })
    }
    return route.fulfill({ contentType: 'text/javascript', body: '' })
  })
  const welcome = page.waitForResponse((res) => res.url().includes('/audio/ar/ui/welcome-'))
  await page.goto('http://127.0.0.1:4184/science-grade1-quiz/boys/')
  await page.getByRole('button', { name: /هيا نبدأ/ }).click()
  const response = await welcome
  expect(new URL(response.url()).pathname).toMatch(/^\/science-grade1-quiz\/audio\/ar\/ui\/welcome-\d\.mp3$/)
  expect(response.status()).toBe(200)
  expect(await page.evaluate(() => (window as unknown as { __guardQuizId: string }).__guardQuizId)).toBe('science-grade1-boys')
  await expect(page.locator('.topic-card img').first()).toBeVisible()
  // The boys' page sits one folder down, but its pictures come from the shared folder.
  const pictures = await page.locator('img').evaluateAll((imgs) => imgs.map((img) => [new URL((img as HTMLImageElement).src).pathname, (img as HTMLImageElement).naturalWidth] as const))
  expect(pictures.length).toBeGreaterThan(0)
  for (const [path] of pictures) expect(path).toMatch(/^\/science-grade1-quiz\/pics\/[a-z-]+\.jpg$/)
  await expect(page.locator('.preview-badge')).toHaveCount(0)
})
