import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  AR_LINES,
  ASK_LINES,
  FACTS,
  INSTRUCTIONS,
  PICS,
  QUESTIONS,
  TOPICS,
  YOU_LINES,
  audioCues,
  bare,
  dressQuestion,
  questionClips,
  roundClips,
  sceneCorrect,
  type Format,
} from '../../src/data/catalog'

const manifest = JSON.parse(fs.readFileSync('public/audio/manifest.json', 'utf8')) as { clips: Record<string, { text: string }> }
const DIACRITICS = /[ً-ْٰ]/

/** Every picture a question can show, in any round. */
function picturesOf(art: string | undefined): string[] {
  if (!art) return []
  const [kind, value = ''] = art.split(':')
  if (kind === 'pic') return [value]
  if (kind === 'pics') return value.split('+')
  return []
}

// The shared lines of the family's earlier quizzes: this quiz must sound like itself.
const OLD_LINES = [
  'كفو!',
  'ما شاء الله! صح',
  'مو مشكلة… الجواب الصح',
  'عفية!',
  'أحسنتي!',
  'شطورة!',
  'ممتاز يا بطلة!',
  'برافو عليج!',
  'هلا والله يا بطلة العلوم!',
  'صح مية بالمية!',
  'يا حلو هالجواب!',
  'ولا غلطة!',
  'ثلاث صح ورا بعض!',
]

describe('catalog', () => {
  it('has the two lessons of the card, with enough questions each', () => {
    expect(TOPICS.map((topic) => topic.id)).toEqual(['habitats', 'protect'])
    expect(TOPICS.map((topic) => topic.title)).toEqual(['أين تعيش الكائنات الحية؟', 'كيف نحمي أماكن عيش الكائنات الحية؟'])
    for (const topic of TOPICS) expect(QUESTIONS.filter((question) => question.topic === topic.id).length).toBeGreaterThanOrEqual(30)
  })

  it('keeps permanent, readable question keys', () => {
    const keys = QUESTIONS.map((question) => question.key)
    expect(new Set(keys).size).toBe(keys.length)
    for (const question of QUESTIONS) expect(question.key).toMatch(new RegExp(`^${question.topic}:${question.format}-[a-z0-9-]+$`))
  })

  it('asks every style of the Ministry bank and the book', () => {
    const formats = new Set(QUESTIONS.map((question) => question.format))
    for (const format of Object.keys(INSTRUCTIONS) as Format[]) expect(formats).toContain(format)
  })

  it('shows the paper instruction line and no diacritics on screen', () => {
    for (const question of QUESTIONS) {
      expect(question.instruction.length).toBeGreaterThan(10)
      for (const text of [question.instruction, question.prompt, question.word?.before ?? '', question.word?.after ?? '', ...question.options.map((option) => option.label), ...question.rows.map((row) => row.text ?? '')]) {
        expect(text).not.toMatch(DIACRITICS)
      }
    }
    for (const fact of Object.values(FACTS)) expect(fact.text).not.toMatch(DIACRITICS)
  })

  it('has a right answer for every question, in every round', () => {
    for (const question of QUESTIONS) {
      for (let round = 0; round < 12; round += 1) {
        const dressed = dressQuestion(question)
        const ids = dressed.options.map((option) => option.id)
        expect(new Set(ids).size).toBe(ids.length)
        if (dressed.kind === 'pick') expect(ids).toContain(dressed.answer)
        if (dressed.kind === 'circle') {
          expect(dressed.good.length).toBeGreaterThan(0)
          expect(dressed.good.every((id) => ids.includes(id))).toBe(true)
          expect(dressed.good.length).toBeLessThan(ids.length)
        }
        if (dressed.kind === 'color') {
          expect(dressed.good.length).toBeGreaterThan(0)
          expect(dressed.good.length).toBeLessThan(ids.length)
        }
        if (dressed.kind === 'rows') {
          expect(dressed.rows.length).toBeGreaterThan(1)
          for (const row of dressed.rows) expect(ids).toContain(row.answer)
          expect(new Set(dressed.rows.map((row) => row.answer)).size).toBe(dressed.rows.length)
        }
        if (dressed.kind === 'scene') {
          const spots = dressed.scene!.spots.map((spot) => spot.id)
          for (const id of [...dressed.scene!.good, ...dressed.rows.map((row) => row.answer)]) expect(spots).toContain(id)
          for (const spot of dressed.scene!.spots) {
            const [x0, y0, x1, y1] = spot.box
            expect(x0 < x1 && y0 < y1 && x0 >= 0 && y0 >= 0 && x1 <= 100 && y1 <= 100).toBe(true)
          }
        }
      }
    }
  })

  it('draws new pictures and answers between rounds', () => {
    // A two-picture choice (the clean beach or the dirty one) has nothing to draw.
    const fixed = (question: (typeof QUESTIONS)[number]) => question.draw && question.draw.right.length === 1 && question.draw.wrong.length <= 1
    const drawn = QUESTIONS.filter((question) => (question.draw || question.pictureDraw || question.rowDraw || question.subjects) && !fixed(question))
    expect(drawn.length).toBeGreaterThanOrEqual(20)
    for (const question of drawn) {
      const seen = new Set<string>()
      for (let round = 0; round < 30; round += 1) {
        const dressed = dressQuestion(question)
        seen.add(`${dressed.picture}|${dressed.answer}|${dressed.options.map((option) => option.id).join()}|${dressed.rows.map((row) => row.id).join()}`)
      }
      expect(seen.size).toBeGreaterThan(1)
    }
  })

  it('judges circling in a picture: nothing wrong, and enough right', () => {
    const litter = QUESTIONS.find((question) => question.key === 'protect:scene-litter-desert')!.scene!
    expect(sceneCorrect(litter, ['smoke', 'can', 'bag'])).toBe(true)
    expect(sceneCorrect(litter, ['smoke', 'can'])).toBe(false)
    expect(sceneCorrect(litter, ['smoke', 'can', 'bag', 'tent'])).toBe(false)
    const sea = QUESTIONS.find((question) => question.key === 'habitats:scene-sea-mistake')!.scene!
    expect(sceneCorrect(sea, ['rabbit', 'bird'])).toBe(true)
    expect(sceneCorrect(sea, ['rabbit'])).toBe(false)
  })

  it('has every picture it shows, and no picture it never shows', () => {
    const files = fs.readdirSync('public/pics').map((file) => file.replace(/\.jpg$/, ''))
    expect(files.sort()).toEqual(Object.keys(PICS).sort())
    const used = new Set<string>(['fish', 'squirrel', 'bird', 'rabbit', 'whale', 'cactus', 'seaweed', 'zebra', 'polar-scene'])
    for (const topic of TOPICS) topic.art.flatMap(picturesOf).forEach((id) => used.add(id))
    for (const question of QUESTIONS) {
      const arts = [
        question.picture,
        question.inline,
        ...question.options.map((option) => option.art),
        ...question.rows.map((row) => row.art),
        ...(question.draw ? [...question.draw.right, ...question.draw.wrong].map((option) => option.art) : []),
        ...(question.pictureDraw ? [...question.pictureDraw.good, ...question.pictureDraw.bad].map((option) => option.art) : []),
        ...(question.rowDraw ? question.rowDraw.pairs.flatMap((pair) => [pair.key.art, pair.row.art]) : []),
        ...(question.subjects ? question.subjects.map((subject) => subject.picture) : []),
      ]
      arts.flatMap(picturesOf).forEach((id) => used.add(id))
      if (question.scene) used.add(question.scene.pic)
    }
    expect([...used].sort()).toEqual(Object.keys(PICS).sort())
  })
})

describe('narration', () => {
  // The family's notes of 8 November 2026.
  it('uses Kuwaiti words: «نحط دائرة», «القاري», counts said as ثلاثة and خمسة, no «فديت»', () => {
    const shortCounts = /(?<![\u0600-\u06FF])(ثلاث|أربع|خمس|ست|سبع|ثمان|تسع|عشر)(?![\u0600-\u06FF])/
    for (const cue of audioCues()) {
      expect(cue.text, cue.id).not.toMatch(/حو[ّ]?ط|سيكل|فديت/)
      expect(cue.text, cue.id).not.toMatch(shortCounts)
      expect(cue.text, cue.id).not.toMatch(/(?<![\u0600-\u06FF])(امم|أوه|آه|اوه)(?![\u0600-\u06FF])/)
    }
    // «القاري» is shown as written and sent to the voice as «الگاري», so its ق sounds like the one in «نقول».
    expect(FACTS.bike.say).toContain('القاري')
    expect(audioCues().find((cue) => cue.id === 'ar/f/bike')!.text).toContain('الگاري')
    expect(audioCues().filter((cue) => cue.text.includes('قاري'))).toEqual([])
  })

  const cues = audioCues()
  const texts = cues.map((cue) => cue.text)

  it('has a recorded clip, with the same text, for every cue', () => {
    expect(new Set(cues.map((cue) => cue.id)).size).toBe(cues.length)
    for (const cue of cues) {
      expect(fs.existsSync(`public/audio/${cue.id}.mp3`), cue.id).toBe(true)
      expect(manifest.clips[cue.id]?.text, cue.id).toBe(cue.text)
    }
    expect(Object.keys(manifest.clips).sort()).toEqual(cues.map((cue) => cue.id).sort())
  })

  it('reaches every clip it plays', () => {
    const ids = new Set(cues.map((cue) => cue.id))
    for (const audience of ['girls', 'boys'] as const) {
      for (const id of roundClips(QUESTIONS, audience)) expect(ids.has(id), id).toBe(true)
    }
    for (const question of QUESTIONS) for (const id of questionClips(question)) expect(ids.has(id), id).toBe(true)
  })

  it('says every style at least three different ways', () => {
    for (const format of Object.keys(INSTRUCTIONS) as Format[]) {
      expect(ASK_LINES[format].length).toBeGreaterThanOrEqual(3)
      expect(new Set(ASK_LINES[format]).size).toBe(ASK_LINES[format].length)
    }
  })

  it('has many cheers and kind words, written for this quiz only', () => {
    expect(AR_LINES.cheer.length).toBeGreaterThanOrEqual(12)
    expect(AR_LINES.retry.length).toBeGreaterThanOrEqual(6)
    const norm = (text: string) => text.replace(/[\s…،.!؟?:,]+/g, '')
    const old = new Set(OLD_LINES.map(norm))
    for (const text of texts) expect(old.has(norm(text)), text).toBe(false)
    const lines = [...Object.values(AR_LINES).flat(), ...Object.values(ASK_LINES).flat()]
    expect(new Set(lines).size).toBe(lines.length)
  })

  it('never speaks to a girl or a boy in the lines both copies share', () => {
    const shared = [...Object.values(AR_LINES).flat(), ...Object.values(ASK_LINES).flat(), ...Object.values(FACTS).map((fact) => fact.say)]
    for (const text of shared) expect(text, text).not.toMatch(/(عليج|عليك|إنتي|إنت |بطلة|بطل!|شاطرة|شاطر!|ي\b.*ين\b)/)
    expect(YOU_LINES.girls.cheer.join()).toMatch(/بطلة|شاطرة|عالمة/)
    expect(YOU_LINES.boys.cheer.join()).not.toMatch(/بطلة|شاطرة|عالمة/)
  })

  it('sends the voice plain text', () => {
    for (const cue of cues) expect(cue.text).toBe(bare(cue.text))
  })
})
