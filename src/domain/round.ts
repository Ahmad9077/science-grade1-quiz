import { QUESTIONS, dressQuestion, type Format, type Option, type Question, type Random, type TopicId } from '../data/catalog'
import { shuffle } from './variety'
import { lineOf, voiceQuestion } from './voice'

export { shuffle }
export type { Random }

export const PRACTICE_SIZE = 8

/**
 * The mock test, laid out like the Ministry's question bank for this term: «السؤال الأول» ✓ in
 * the box, «الثاني» ✓/✗ sentences, «الثالث» the numbers table, «الرابع» the animals and their
 * homes, then one of the book's picture questions and one written question. `slot` is the
 * paper's «السؤال الأول، الثاني…» an entry belongs to.
 */
export const TEST_PLAN: { slot: number; formats: Format[] }[] = [
  { slot: 1, formats: ['tick'] },
  { slot: 1, formats: ['tick'] },
  { slot: 1, formats: ['tick'] },
  { slot: 2, formats: ['tf'] },
  { slot: 2, formats: ['tf'] },
  { slot: 2, formats: ['tf'] },
  { slot: 3, formats: ['table'] },
  { slot: 4, formats: ['homes'] },
  { slot: 5, formats: ['scene', 'number', 'color', 'cross', 'circle'] },
  { slot: 6, formats: ['choose', 'word', 'sort'] },
]
export const TEST_SIZE = TEST_PLAN.length

/** Hub-preferred keys first (in plan order), then questions not seen recently, then the rest. */
export function orderQuestions(
  pool: readonly Question[],
  preferredKeys: readonly string[],
  recentKeys: readonly string[],
  random: Random = Math.random,
): Question[] {
  const byKey = new Map(pool.map((question) => [question.key, question]))
  const preferred = preferredKeys.map((key) => byKey.get(key)).filter((q): q is Question => Boolean(q))
  const used = new Set(preferred.map((question) => question.key))
  const recent = new Set(recentKeys)
  const rest = shuffle(pool.filter((question) => !used.has(question.key)), random)
  const fresh = rest.filter((question) => !recent.has(question.key))
  const stale = rest.filter((question) => recent.has(question.key))
  return [...preferred, ...fresh, ...stale]
}

export function questionsFor(topic: TopicId): Question[] {
  return QUESTIONS.filter((question) => question.topic === topic)
}

export function buildPractice(
  topic: TopicId,
  preferredKeys: readonly string[] = [],
  recentKeys: readonly string[] = [],
  random: Random = Math.random,
  /** Keep the preferred questions first, in their order (a preview opened with chosen keys). */
  keepOrder = false,
): Question[] {
  const ordered = orderQuestions(questionsFor(topic), preferredKeys, recentKeys, random)
  if (keepOrder && preferredKeys.length > 0) {
    const first = ordered.filter((question) => preferredKeys.includes(question.key))
    const rest = ordered.filter((question) => !first.includes(question)).slice(0, Math.max(0, PRACTICE_SIZE - first.length))
    return dressRound([...first, ...mixKinds(rest, random)].slice(0, PRACTICE_SIZE), random)
  }
  // At most two of any one style, so a lesson round shows the paper's different questions.
  const counts = new Map<Format, number>()
  const chosen: Question[] = []
  for (const question of ordered) {
    if (chosen.length >= PRACTICE_SIZE) break
    const seen = counts.get(question.format) ?? 0
    if (seen >= 2) continue
    counts.set(question.format, seen + 1)
    chosen.push(question)
  }
  for (const question of ordered) if (chosen.length < PRACTICE_SIZE && !chosen.includes(question)) chosen.push(question)
  return dressRound(mixKinds(chosen, random), random)
}

/** One question per entry of the plan, spreading the two lessons as evenly as the plan allows. */
export function buildTest(
  preferredKeys: readonly string[] = [],
  recentKeys: readonly string[] = [],
  random: Random = Math.random,
): Question[] {
  const ordered = orderQuestions(QUESTIONS, preferredKeys, recentKeys, random)
  const picked: Question[] = []
  const perTopic = new Map<TopicId, number>()
  for (const entry of TEST_PLAN) {
    const candidates = ordered.filter((question) => entry.formats.includes(question.format) && !picked.includes(question))
    const least = Math.min(...candidates.map((question) => perTopic.get(question.topic) ?? 0))
    const pick = candidates.find((question) => (perTopic.get(question.topic) ?? 0) === least) ?? candidates[0]!
    picked.push(pick)
    perTopic.set(pick.topic, (perTopic.get(pick.topic) ?? 0) + 1)
  }
  return dressRound(picked, random)
}

/**
 * This round's pictures for every question, and its instruction lines: a style's lines are dealt
 * from one deck, and a line already said in this round goes to the back of the next pass.
 */
function dressRound(questions: Question[], random: Random): Question[] {
  const said = new Map<Format, number[]>()
  return questions.map((question) => {
    const before = said.get(question.format) ?? []
    const voiced = voiceQuestion(dressQuestion(question, random), random, before)
    said.set(question.format, [...before, lineOf(voiced)])
    return voiced
  })
}

/** The paper's question number for a test question. */
export function testSlot(index: number): { slot: number; part: number; parts: number } {
  const entry = TEST_PLAN[index]
  if (!entry) return { slot: index + 1, part: 1, parts: 1 }
  const same = TEST_PLAN.filter((other) => other.slot === entry.slot)
  return { slot: entry.slot, part: TEST_PLAN.slice(0, index + 1).filter((other) => other.slot === entry.slot).length, parts: same.length }
}

/** Avoid runs of the same question style so a round keeps changing pace. */
function mixKinds(questions: Question[], random: Random): Question[] {
  const result: Question[] = []
  const pool = shuffle(questions, random)
  while (pool.length > 0) {
    const last = result.at(-1)
    const index = pool.findIndex((question) => question.format !== last?.format)
    const pickIndex = index === -1 ? 0 : index
    result.push(...pool.splice(pickIndex, 1))
  }
  return result
}

/** Choices are shuffled every time, except «صح/خطأ», the two words in brackets and fixed sets. */
export function arrangeOptions(question: Question, random: Random = Math.random): Option[] {
  if (question.kind === 'pick') return question.fixedOrder ? [...question.options] : shuffle(question.options, random)
  return [...question.options]
}

export function starsFor(score: number, total: number): 1 | 2 | 3 {
  if (total === 0) return 1
  const ratio = score / total
  if (ratio >= 0.9) return 3
  if (ratio >= 0.6) return 2
  return 1
}
