import {
  ASK_LINES,
  RETRIES,
  STREAKS,
  arLines,
  cheers,
  clip,
  doneLines,
  ownCheers,
  shown,
  type ArGroup,
  type Audience,
  type Line,
  type Question,
  type Random,
} from '../data/catalog'
import { deck } from './variety'

/**
 * The question with its style's next instruction line: said first, and shown under the paper's
 * line. `avoid` holds the lines of this style already said in the round.
 */
export function voiceQuestion(question: Question, random: Random = Math.random, avoid: readonly number[] = []): Question {
  const texts = ASK_LINES[question.format]
  const n = deck(`ask:${question.format}`, texts.map((_, k) => k)).next(random, avoid)
  return { ...question, ask: [clip.line(question.format, n), ...question.ask.slice(1)], help: shown(texts[n]!) }
}

/** Which of its style's lines a voiced question says. */
export function lineOf(question: Question): number {
  return Number(question.ask[0]!.split('-').at(-1)) - 1
}

/** One of Maryam's lines for a moment, never the one said last time. */
export function sayLine(group: ArGroup, random: Random = Math.random): Line {
  return deck(`ar:${group}`, arLines(group)).next(random)
}

/**
 * The cheer for a right answer: a streak cheer on the third and fifth right answer running,
 * otherwise now and then one made for this kind of question, otherwise any cheer.
 */
export function cheerFor(question: Question, streak: number, audience: Audience, random: Random = Math.random): Line {
  const streakLines = STREAKS[streak]
  if (streakLines) return deck(`streak:${streak}`, streakLines).next(random)
  const own = ownCheers(question)
  if (own.length > 0 && random() < 0.4) return deck(`cheer:${own.map((line) => line.clip).join()}`, own).next(random)
  return deck(`cheer:${audience}`, cheers(audience)).next(random)
}

/** The kind word after a wrong choice. */
export function kindWord(random: Random = Math.random): Line {
  return deck('retry', RETRIES).next(random)
}

/** The line at the end of a round. */
export function doneLine(great: boolean, audience: Audience, random: Random = Math.random): Line {
  return deck(`done:${audience}:${great}`, doneLines(audience, great)).next(random)
}
