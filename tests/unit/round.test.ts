import { describe, expect, it } from 'vitest'
import { ASK_LINES, QUESTIONS, STREAKS, cheers, shown } from '../../src/data/catalog'
import { PRACTICE_SIZE, TEST_PLAN, TEST_SIZE, arrangeOptions, buildPractice, buildTest, orderQuestions, starsFor, testSlot } from '../../src/domain/round'
import { Deck } from '../../src/domain/variety'
import { cheerFor, lineOf } from '../../src/domain/voice'

function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648
    return value / 2147483648
  }
}

describe('rounds', () => {
  it('builds a lesson round of different styles from one lesson', () => {
    for (let seed = 1; seed < 40; seed += 1) {
      const round = buildPractice('habitats', [], [], seeded(seed))
      expect(round).toHaveLength(PRACTICE_SIZE)
      expect(round.every((question) => question.topic === 'habitats')).toBe(true)
      expect(new Set(round.map((question) => question.key)).size).toBe(PRACTICE_SIZE)
      const formats = round.map((question) => question.format)
      for (const format of new Set(formats)) expect(formats.filter((other) => other === format).length).toBeLessThanOrEqual(2)
    }
  })

  it('lays the mock test out like the Ministry paper and spreads both lessons', () => {
    for (let seed = 1; seed < 40; seed += 1) {
      const test = buildTest([], [], seeded(seed))
      expect(test).toHaveLength(TEST_SIZE)
      test.forEach((question, n) => expect(TEST_PLAN[n]!.formats).toContain(question.format))
      const habitats = test.filter((question) => question.topic === 'habitats').length
      expect(habitats).toBeGreaterThanOrEqual(4)
      expect(habitats).toBeLessThanOrEqual(6)
    }
    expect(testSlot(0)).toEqual({ slot: 1, part: 1, parts: 3 })
    expect(testSlot(5)).toEqual({ slot: 2, part: 3, parts: 3 })
    expect(testSlot(7)).toEqual({ slot: 4, part: 1, parts: 1 })
  })

  it('puts Hub-preferred keys first and recently seen questions last', () => {
    const pool = QUESTIONS.filter((question) => question.topic === 'protect')
    const ordered = orderQuestions(pool, [pool[5]!.key], [pool[0]!.key], seeded(3))
    expect(ordered[0]!.key).toBe(pool[5]!.key)
    expect(ordered.at(-1)!.key).toBe(pool[0]!.key)
  })

  it('keeps chosen questions first when a preview asks for them', () => {
    const round = buildPractice('protect', ['protect:number-harm-places', 'protect:scene-litter-desert'], [], seeded(2), true)
    expect(round.slice(0, 2).map((question) => question.key)).toEqual(['protect:number-harm-places', 'protect:scene-litter-desert'])
  })

  it('keeps ✓ before ✗ and the two bracketed words in the book order', () => {
    const tf = QUESTIONS.find((question) => question.format === 'tf')!
    expect(arrangeOptions(tf, seeded(9)).map((option) => option.id)).toEqual(['yes', 'no'])
    const word = QUESTIONS.find((question) => question.key === 'habitats:word-places')!
    expect(arrangeOptions(word, seeded(9)).map((option) => option.label)).toEqual(['متشابهة', 'مختلفة'])
  })

  it('gives stars like the other Hub quizzes', () => {
    expect(starsFor(8, 8)).toBe(3)
    expect(starsFor(5, 8)).toBe(2)
    expect(starsFor(2, 8)).toBe(1)
  })
})

describe('variety', () => {
  it('deals every item before any comes back, and never one twice running', () => {
    const deck = new Deck([1, 2, 3, 4])
    const random = seeded(5)
    const dealt = Array.from({ length: 40 }, () => deck.next(random))
    for (let n = 0; n < 40; n += 4) expect(new Set(dealt.slice(n, n + 4)).size).toBe(4)
    for (let n = 1; n < 40; n += 1) expect(dealt[n]).not.toBe(dealt[n - 1])
  })

  it('says a different instruction line for each question of a style in a round', () => {
    for (let seed = 1; seed < 30; seed += 1) {
      const test = buildTest([], [], seeded(seed))
      const ticks = test.filter((question) => question.format === 'tick').map(lineOf)
      expect(new Set(ticks).size).toBe(ticks.length)
      for (const question of test) expect(question.help).toBe(shown(ASK_LINES[question.format][lineOf(question)]!))
    }
  })

  it('cheers a streak, and otherwise mixes general and own cheers', () => {
    const question = QUESTIONS.find((entry) => entry.format === 'scene')!
    expect(STREAKS[3]!.map((line) => line.clip)).toContain(cheerFor(question, 3, 'girls').clip)
    expect(STREAKS[5]!.map((line) => line.clip)).toContain(cheerFor(question, 5, 'boys').clip)
    const said = Array.from({ length: 40 }, (_, n) => cheerFor(question, 1, 'boys', seeded(n + 1)).clip)
    expect(new Set(said).size).toBeGreaterThan(8)
    expect(said.some((clip) => clip.includes('/girls/'))).toBe(false)
    for (let n = 1; n < said.length; n += 1) expect(said[n]).not.toBe(said[n - 1])
    expect(cheers('girls').some((line) => line.clip.includes('/girls/'))).toBe(true)
  })
})
