import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { DRAWINGS } from '../../src/art/drawings'
import { WORDING } from '../../src/audience'
import { AUDIENCES, FACTS, QUESTIONS, THINGS, TOPICS, UI_CLIPS, audioCues, clipsFor, factArt, type UiClip } from '../../src/data/catalog'
import { PRACTICE_SIZE } from '../../src/domain/round'

const allArt = [
  ...QUESTIONS.flatMap((q) => [...q.subject, ...q.options.flatMap((o) => o.art)]),
  ...FACTS.flatMap((f) => f.art.map((item) => factArt(item).art)),
  ...TOPICS.flatMap((t) => t.art),
  ...Object.values(THINGS).map((t) => t.art),
]

describe('question bank', () => {
  it('uses the permanent quiz ids for the girls\' and boys\' copies', () => {
    expect(AUDIENCES.girls).toEqual({ quizId: 'science-grade1', title: 'علوم - بنات' })
    expect(AUDIENCES.boys).toEqual({ quizId: 'science-grade1-boys', title: 'علوم - أولاد' })
  })

  it('keeps every published question key', () => {
    const keys = new Set(QUESTIONS.map((q) => q.key))
    const permanent = new Set(fs.readFileSync('integration/seed-science-grade1.sql', 'utf8').match(/'[a-z]+:[a-z0-9-]+'/g) ?? [])
    expect(permanent.size).toBe(79)
    for (const key of permanent) expect(keys.has(key.slice(1, -1)), key).toBe(true)
  })

  it('has unique, well-formed permanent keys', () => {
    const keys = QUESTIONS.map((q) => q.key)
    expect(new Set(keys).size).toBe(keys.length)
    for (const q of QUESTIONS) expect(q.key).toMatch(new RegExp(`^${q.topic}:[a-z0-9-]+$`))
  })

  it('covers every lesson with enough questions for a full practice round', () => {
    expect(TOPICS.map((t) => t.id)).toEqual(['plants', 'movement', 'covering', 'food', 'breathing', 'reproduction'])
    for (const topic of TOPICS) {
      expect(QUESTIONS.filter((q) => q.topic === topic.id).length).toBeGreaterThanOrEqual(PRACTICE_SIZE + 3)
    }
  })

  it('has exactly one valid answer per question and distinct options', () => {
    for (const q of QUESTIONS) {
      const ids = q.options.map((o) => o.id)
      expect(new Set(ids).size, q.key).toBe(ids.length)
      expect(ids, q.key).toContain(q.answer)
      expect(q.options.length, q.key).toBeGreaterThanOrEqual(2)
      if (q.kind !== 'pick') expect(q.options.length, q.key).toBe(2)
    }
  })

  it('links every question to an explanation from the same lesson', () => {
    for (const q of QUESTIONS) {
      const fact = FACTS.find((f) => f.id === q.fact)
      expect(fact, q.key).toBeDefined()
      expect(fact?.topic, q.key).toBe(q.topic)
    }
  })

  it('stores adaptive difficulty in the Hub range with skill tags', () => {
    for (const q of QUESTIONS) {
      expect(q.difficulty).toBeGreaterThanOrEqual(1)
      expect(q.difficulty).toBeLessThanOrEqual(100)
      expect(q.skills.length).toBeGreaterThan(0)
    }
  })

  it('has a drawing for every svg reference', () => {
    for (const art of allArt.filter((a) => a.startsWith('svg:'))) {
      expect(DRAWINGS[art.slice(4)], art).toBeDefined()
    }
  })

  it('balances true and false statements', () => {
    const tf = QUESTIONS.filter((q) => q.kind === 'tf')
    const falses = tf.filter((q) => q.answer === 'false').length
    expect(falses).toBeGreaterThanOrEqual(Math.floor(tf.length / 4))
  })
})

describe('learn cards', () => {
  it('give every lesson at least six explained cards', () => {
    for (const topic of TOPICS) {
      const cards = FACTS.filter((f) => f.topic === topic.id && f.learn)
      expect(cards.length, topic.id).toBeGreaterThanOrEqual(6)
      for (const card of cards) expect(card.say.length, card.id).toBeGreaterThan(card.text.length * 0.6)
    }
  })

  it('only name pictures that exist', () => {
    for (const f of FACTS) for (const item of f.art) expect(factArt(item).art, `${f.id}:${item}`).toBeTruthy()
  })
})

describe('narration', () => {
  const manifest = JSON.parse(fs.readFileSync('public/audio/manifest.json', 'utf8')) as {
    voice: string
    clips: Record<string, { text: string }>
  }

  it('uses the Kuwaiti voice approved for «بصمة وأثر»', () => {
    expect(manifest.voice).toBe('Maryam Essa - Kuwaiti Calm & Warm')
  })

  it('sends no diacritics to the voice and shows none on screen', () => {
    const marks = /[\u064B-\u0652\u0670]/
    for (const cue of audioCues()) expect(cue.text, cue.id).not.toMatch(marks)
    for (const q of QUESTIONS) {
      expect(q.prompt, q.key).not.toMatch(marks)
      for (const o of q.options) expect(o.label, q.key).not.toMatch(marks)
    }
    for (const f of FACTS) expect(f.text, f.id).not.toMatch(marks)
  })

  it('has a current clip for every cue', () => {
    for (const cue of audioCues()) {
      expect(manifest.clips[cue.id]?.text, cue.id).toBe(cue.text)
      expect(fs.existsSync(`public/audio/${cue.id}.mp3`), cue.id).toBe(true)
    }
  })

  it('names every option with its own clip', () => {
    for (const q of QUESTIONS) for (const o of q.options) expect(o.clip).toMatch(/^o\//)
  })
})

describe('boys\' copy', () => {
  // Words that speak to a girl; none may reach the boys' screens or narration.
  const feminine = /أحسنتي|شطورة|بطلة|عليج|إنتي|أنتي|تبين|تطلعين|تعلمي|تدربي|اسمعي|حاولي|ارجعي|افتحي|اختاري|شفتي|خلصتي|تصيرين/
  const girls = clipsFor('girls')
  const boys = clipsFor('boys')
  const boysCues = new Map(audioCues().filter((cue) => cue.id.includes('/boys/')).map((cue) => [cue.id, cue.text]))
  const spoken = (id: string) => boysCues.get(id) ?? audioCues().find((cue) => cue.id === id)!.text

  it('speaks to a boy on every screen', () => {
    for (const [key, value] of Object.entries(WORDING.boys)) {
      for (const text of [value].flat()) expect(text, key).not.toMatch(feminine)
    }
  })

  it('re-records every narration line that speaks to a girl', () => {
    for (const id of Object.keys(UI_CLIPS) as UiClip[]) expect(spoken(boys.ui(id)), id).not.toMatch(feminine)
    for (const fact of FACTS) expect(spoken(boys.fact(fact.id)), fact.id).not.toMatch(feminine)
    for (const q of QUESTIONS) expect(spoken(boys.question(q.key)), q.key).not.toMatch(feminine)
  })

  it('keeps the girls\' copy as it was', () => {
    expect(girls.ui('welcome')).toBe('ui/welcome')
    expect(girls.fact('r-nest')).toBe('f/r-nest')
    expect(spoken(girls.ui('praise-1'))).toBe('أحسنتي!')
    expect(boys.ui('correct-is')).toBe('ui/correct-is')
  })
})
