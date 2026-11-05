import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Art } from '../art/Art'
import { celebrate } from '../art/confetti'
import { AUDIENCE } from '../audience'
import { useNarrator } from '../audio/NarratorContext'
import type { Cue } from '../audio/player'
import { sfx } from '../audio/sfx'
import { FACTS, clip, roundClips, sceneCorrect, shown, type Line, type Option, type Question, type Row, type Spot } from '../data/catalog'
import { TONES, toneStyle, type ToneId } from '../data/tones'
import { arabicNumber } from '../domain/format'
import { arrangeOptions, testSlot } from '../domain/round'
import { cheerFor, kindWord, sayLine } from '../domain/voice'
import type { Attempt } from '../hub/bridge'
import { ArrowIcon, BigButton, CloseButton, SpeakerButton, StarIcon, order } from './ui'

// Narration starts once the question has settled on screen.
const ASK_DELAY_MS = 380

const ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر']

export interface Round {
  id: number
  kind: 'practice' | 'test'
  tone: ToneId
  questions: Question[]
}

interface QuizScreenProps {
  round: Round
  /** Played once before question one: the mock-test introduction. */
  intro?: string
  onExit: () => void
  onFinish: (attempts: Attempt[]) => void
}

type Phase = 'asking' | 'answered'

/** What was said after the answer, and what the explanation button plays again. */
interface Said {
  line: Line
  replay: Cue[]
}

export function QuizScreen({ round, intro, onExit, onFinish }: QuizScreenProps) {
  const narrator = useNarrator()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('asking')
  const [chosen, setChosen] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [said, setSaid] = useState<Said | null>(null)
  const [lit, setLit] = useState<string | null>(null)
  const [confirmExit, setConfirmExit] = useState(false)
  const streak = useRef(0)
  const tileRefs = useRef(new Map<string, HTMLElement>())
  const optionsRef = useRef<HTMLDivElement>(null)

  const question = round.questions[index]!
  const options = useMemo(() => arrangeOptions(question), [question])
  const correctOption = question.options.find((option) => option.id === question.answer)
  const tone = round.kind === 'test' ? question.topic : round.tone
  const fact = FACTS[question.fact]
  const factCues: Cue[] = [{ clip: clip.fact(question.fact), gap: 450 }]
  // The instruction line, the question, then each written choice while its tile lights up,
  // or the first sentence of a table or a numbered picture (the board reads the others in turn).
  const askCues = useMemo<Cue[]>(() => {
    const spoken = question.kind === 'pick' && question.format !== 'word' ? options.filter((option) => option.clip) : []
    const firstRow = question.rows[0]?.clip
    return [
      ...question.ask.map((id, n): Cue => ({ clip: id, gap: n === 0 ? 0 : 250, onStart: () => setLit(null) })),
      ...spoken.map((option, n): Cue => ({ clip: option.clip!, gap: n === 0 ? 350 : 260, onStart: () => setLit(option.id) })),
      ...(firstRow ? [{ clip: firstRow, gap: 350 }] : []),
    ]
  }, [question, options])

  // Load every clip of the round up front, so no question waits for its audio.
  useEffect(() => {
    narrator.preload(roundClips(round.questions, AUDIENCE))
  }, [narrator, round.questions])

  useEffect(() => {
    const opening = intro && index === 0 ? [{ clip: intro }, ...askCues.map((cue, n) => (n === 0 ? { ...cue, gap: 500 } : cue))] : askCues
    const timer = window.setTimeout(() => {
      void narrator.play(opening).then(() => setLit(null))
    }, ASK_DELAY_MS)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the introduction plays once, before question one
  }, [askCues, narrator])

  useEffect(() => () => narrator.stop(), [narrator])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [index])

  // Keep the answers in view above the feedback sheet on short phone screens.
  useEffect(() => {
    if (phase !== 'answered') return
    const timer = window.setTimeout(() => {
      const box = optionsRef.current?.getBoundingClientRect()
      const sheet = document.querySelector('.feedback')?.getBoundingClientRect()
      if (!box || !sheet) return
      const overlap = box.bottom + 12 - sheet.top
      if (overlap > 0) window.scrollBy({ top: Math.min(overlap, box.top - 70), behavior: 'smooth' })
    }, 650)
    return () => window.clearTimeout(timer)
  }, [phase])

  function settle(correct: boolean, chosenId: string, anchor?: HTMLElement | null) {
    setPhase('answered')
    setLit(null)
    setAttempts((list) => [...list, { questionKey: question.key, chosen: chosenId, correct }])
    if (correct) {
      streak.current += 1
      sfx.correct()
      const cheer = cheerFor(question, streak.current, AUDIENCE)
      setSaid({ line: cheer, replay: factCues })
      celebrate(anchor ?? undefined, TONES[tone].tone)
      void narrator.play([{ clip: cheer.clip, gap: 300 }])
      return
    }
    streak.current = 0
    sfx.wrong()
    if (question.kind !== 'pick') {
      const review = sayLine('review')
      setSaid({ line: review, replay: factCues })
      void narrator.play([{ clip: review.clip, gap: 450 }, ...factCues])
      return
    }
    const kind = kindWord()
    const reveal: Cue[] = correctOption?.clip ? [{ clip: correctOption.clip, gap: 200 }] : []
    setSaid({ line: kind, replay: [...reveal, ...factCues] })
    void narrator.play([{ clip: kind.clip, gap: 450 }, ...reveal, ...factCues])
  }

  function answer(option: Option) {
    if (phase !== 'asking') return
    narrator.stop()
    setChosen(option.id)
    settle(option.id === question.answer, option.id, tileRefs.current.get(option.id))
  }

  function boardMiss() {
    sfx.wrong()
    void narrator.play([{ clip: sayLine('board-wrong').clip }])
  }

  function next() {
    sfx.tap()
    narrator.stop()
    if (index + 1 >= round.questions.length) {
      onFinish(attempts)
      return
    }
    setIndex(index + 1)
    setPhase('asking')
    setChosen(null)
    setSaid(null)
  }

  const lastCorrect = attempts.at(-1)?.correct ?? false
  const answered = phase === 'answered'
  const register = (id: string) => (node: HTMLElement | null) => {
    if (node) tileRefs.current.set(id, node)
    else tileRefs.current.delete(id)
  }

  // The paper's heading: «السؤال الأول :» in the mock test, the question's number in a lesson.
  const slot = round.kind === 'test' ? testSlot(index) : null
  const heading = slot ? `السؤال ${ORDINALS[slot.slot - 1] ?? arabicNumber(slot.slot)}` : `السؤال ${ORDINALS[index] ?? arabicNumber(index + 1)}`
  const part = slot && slot.parts > 1 ? slot.part : null
  const tfMark = question.format === 'tf' && answered ? question.answer : null
  const optionState = (option: Option) => {
    const isChosen = chosen === option.id
    const isAnswer = option.id === question.answer
    return answered ? (isChosen ? (isAnswer ? 'is-correct' : 'is-wrong') : isAnswer ? 'is-reveal' : 'is-dim') : lit === option.id ? 'is-lit' : ''
  }

  return (
    <main className={`screen quiz-screen ${answered ? 'has-feedback' : ''}`} style={toneStyle(tone)}>
      <header className="top-bar quiz-top">
        <CloseButton onClick={() => setConfirmExit(true)} />
        <div className="track" aria-label={`السؤال ${arabicNumber(index + 1)} من ${arabicNumber(round.questions.length)}`}>
          {round.questions.map((entry, n) => {
            const attempt = attempts[n]
            const state = attempt ? (attempt.correct ? 'is-right' : 'is-miss') : n === index ? 'is-current' : ''
            return (
              <span key={entry.key} className={`track-step ${state}`}>
                {attempt?.correct ? (
                  <span className="track-star pop">
                    <StarIcon />
                  </span>
                ) : null}
              </span>
            )
          })}
        </div>
        <span className="quiz-count">
          {arabicNumber(index + 1)}/{arabicNumber(round.questions.length)}
        </span>
      </header>

      <section
        key={question.key}
        className={`question question-${question.kind} format-${question.format} question-in`}
        data-question-key={question.key}
        data-solution={__QUIZ_BUILD_MODE__ === 'preview' ? solution(question) : undefined}
      >
        <div className="paper-head">
          <span className="paper-pill">
            <span className="paper-leaf" aria-hidden="true">
              ✿
            </span>
            {heading} :
          </span>
          <p className="instruction">{question.instruction}</p>
          <SpeakerButton onClick={() => void narrator.play(askCues).then(() => setLit(null))} />
        </div>
        <p className="voice-help">{question.help}</p>

        {question.format === 'tf' ? (
          <div className="statement pop" style={order(0, { '--base-delay': '80ms' })}>
            {part ? <span className="statement-number">{arabicNumber(part)}</span> : null}
            <p className="statement-text">
              {question.inline ? <InlineSentence text={question.prompt} art={question.inline} /> : question.prompt}
            </p>
            <span className="statement-slot" aria-hidden="true">
              (<span className={`slot-mark ${tfMark ? `ink-mark mark-${tfMark}` : ''}`}>{tfMark === 'yes' ? '✓' : tfMark === 'no' ? '✗' : ''}</span>)
            </span>
          </div>
        ) : question.word ? (
          <div ref={optionsRef} className="word-card pop" style={order(0, { '--base-delay': '80ms' })}>
            {part ? <span className="statement-number">{arabicNumber(part)}</span> : null}
            <p className="word-sentence">
              {question.word.before}{' '}
              <span className="word-brackets">
                (
                {options.map((option, n) => (
                  <span key={option.id} className="word-slot">
                    {n > 0 ? <span className="word-dash"> - </span> : null}
                    <button
                      ref={register(option.id)}
                      type="button"
                      className={`word-choice ${optionState(option)}`}
                      onClick={() => answer(option)}
                      disabled={answered}
                      data-option={option.id}
                    >
                      {option.label}
                      {chosen === option.id || (answered && option.id === question.answer) ? <InkRing tone={optionState(option) === 'is-wrong' ? 'miss' : 'good'} /> : null}
                    </button>
                  </span>
                ))}
                )
              </span>{' '}
              {question.word.after}
            </p>
          </div>
        ) : question.prompt || question.picture ? (
          <div className={`prompt-card pop ${question.picture ? 'has-picture' : ''}`} style={order(0, { '--base-delay': '80ms' })}>
            {part ? <span className="statement-number">{arabicNumber(part)}</span> : null}
            {question.prompt ? <p className="prompt">{question.prompt}</p> : null}
            {question.picture ? (
              <span className="prompt-picture" aria-hidden="true">
                <Art art={question.picture} />
              </span>
            ) : null}
          </div>
        ) : null}

        {question.kind === 'pick' && question.format === 'tf' ? (
          <div ref={optionsRef} className="options tf-options holds-option-tf count-2">
            {options.map((option, n) => (
              <div key={option.id} className="option-slot rise" style={order(n, { '--base-delay': '140ms' })}>
                <button
                  ref={register(option.id)}
                  type="button"
                  className={`option option-tf ${optionState(option)}`}
                  onClick={() => answer(option)}
                  disabled={answered}
                  aria-label={option.label}
                  data-option={option.id}
                >
                  <span className="option-art" aria-hidden="true">
                    <Art art={option.art} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {question.kind === 'pick' && question.format === 'choose' ? (
          <div ref={optionsRef} className="circle-list">
            {options.map((option, n) => {
              const state = optionState(option)
              return (
                <button
                  key={option.id}
                  ref={register(option.id)}
                  type="button"
                  className={`circle-choice press rise ${state}`}
                  style={order(n, { '--base-delay': '140ms' })}
                  onClick={() => answer(option)}
                  disabled={answered}
                  data-option={option.id}
                >
                  <span className={`circle-dot ${chosen === option.id || (answered && option.id === question.answer) ? 'is-filled' : ''}`} aria-hidden="true" />
                  <span className="circle-text">{option.label}</span>
                </button>
              )
            })}
          </div>
        ) : null}

        {question.kind === 'pick' && (question.format === 'tick' || question.format === 'sort') ? (
          <div ref={optionsRef} className={`tick-grid count-${options.length} holds-${artKind(options[0]?.art ?? '')}`}>
            {options.map((option, n) => {
              const state = optionState(option)
              const marked = chosen === option.id || (answered && option.id === question.answer)
              return (
                <button
                  key={option.id}
                  ref={register(option.id)}
                  type="button"
                  className={`tick-option press rise kind-${artKind(option.art)} ${state}`}
                  style={order(n, { '--base-delay': '140ms' })}
                  onClick={() => answer(option)}
                  disabled={answered}
                  aria-label={option.label}
                  data-option={option.id}
                >
                  <span className="tick-art" aria-hidden="true">
                    <Art art={option.art} />
                  </span>
                  {option.caption ? <span className="picture-caption">{option.caption}</span> : null}
                  <span className="tick-box" aria-hidden="true">
                    {marked ? <span className={`ink-mark ${state === 'is-wrong' ? 'mark-no' : 'mark-yes'}`}>✓</span> : null}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}

        {question.kind === 'circle' ? (
          <div ref={optionsRef}>
            <CircleBoard question={question} options={options} locked={answered} onCheck={(picked, board) => settle(sameSet(picked, question.good), picked.join(',') || 'none', board)} />
          </div>
        ) : null}

        {question.kind === 'color' ? (
          <div ref={optionsRef}>
            <ColorBoard
              question={question}
              options={options}
              locked={answered}
              onCheck={(colors, board) => {
                const wrong = options.filter((option) => (colors[option.id] === 'land') !== question.good.includes(option.id)).length
                settle(wrong === 0, `wrong:${wrong}`, board)
              }}
            />
          </div>
        ) : null}

        {question.kind === 'rows' ? (
          <div ref={optionsRef}>
            <RowsBoard
              question={question}
              locked={answered}
              onRow={(row) => {
                if (row.clip) void narrator.play([{ clip: row.clip, gap: 250 }])
              }}
              onHit={() => sfx.tap()}
              onMiss={boardMiss}
              onDone={(mistakes, board) => settle(mistakes === 0, `mistakes:${mistakes}`, board)}
            />
          </div>
        ) : null}

        {question.kind === 'scene' ? (
          <div ref={optionsRef}>
            <SceneBoard
              question={question}
              locked={answered}
              onRow={(row) => {
                if (row.clip) void narrator.play([{ clip: row.clip, gap: 250 }])
              }}
              onHit={() => sfx.tap()}
              onMiss={boardMiss}
              onCheck={(correct, chosenId, board) => settle(correct, chosenId, board)}
            />
          </div>
        ) : null}
      </section>

      {answered && said ? (
        <aside key={`feedback-${question.key}`} className={`feedback ${lastCorrect ? 'feedback-good' : 'feedback-miss'}`} role="status">
          <div className="feedback-head">
            {lastCorrect ? (
              <span className="feedback-star spin-in">
                <StarIcon />
              </span>
            ) : (
              <span className="feedback-bulb" aria-hidden="true">
                <Art art="💡" />
              </span>
            )}
            <div className="feedback-titles">
              <p className={lastCorrect ? 'feedback-title' : 'feedback-encourage'}>{shown(said.line.text)}</p>
              {!lastCorrect && question.kind === 'pick' && correctOption ? (
                <p className="feedback-title">
                  الجواب الصحيح:{' '}
                  {correctOption.art.startsWith('txt:') ? <span className="feedback-word">{correctOption.label}</span> : null}
                </p>
              ) : null}
              {!lastCorrect && question.kind === 'pick' && correctOption && !correctOption.art.startsWith('txt:') ? (
                <span className={`feedback-answer option-${artKind(correctOption.art)}`} aria-label={correctOption.label}>
                  <Art art={correctOption.art} />
                </span>
              ) : null}
            </div>
          </div>
          <p className="feedback-fact">{fact.text}</p>
          <div className="feedback-actions">
            <SpeakerButton onClick={() => void narrator.play(said.replay)} label="اسمع الشرح" />
            <BigButton onClick={next} pulse className="next-button">
              {index + 1 >= round.questions.length ? 'النتيجة' : 'التالي'}
              <ArrowIcon direction="next" />
            </BigButton>
          </div>
        </aside>
      ) : null}

      {confirmExit ? (
        <div className="sheet-backdrop fade-in">
          <div className="sheet pop" role="dialog" aria-modal="true" aria-labelledby="exit-title">
            <p id="exit-title" className="sheet-title">
              نطلع من الجولة؟
            </p>
            <p className="sheet-sub">إجابات هذي الجولة ما راح تنحفظ.</p>
            <div className="sheet-actions">
              <BigButton onClick={() => setConfirmExit(false)}>نكمل</BigButton>
              <BigButton tone="paper" onClick={onExit}>
                خروج
              </BigButton>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

/** The answers of this round's question, for the preview's automatic checks (never in the Hub build). */
function solution(question: Question): string {
  return JSON.stringify({ answer: question.answer, good: question.good, rows: question.rows.map((row) => row.answer), need: question.scene?.need ?? null })
}

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((id) => b.includes(id))
}

/** The art code's kind: `pic:nest` → `pic`; emoji have none. */
function artKind(art: string): string {
  const match = /^([a-z]+):/.exec(art)
  return match ? match[1]! : 'emoji'
}

/** A sentence with the bank's small picture after its first word («تتخذ 🐿 من جحور الأرض…»). */
function InlineSentence({ text, art }: { text: string; art: string }) {
  const space = text.indexOf(' ')
  const head = space > 0 ? text.slice(0, space) : text
  const tail = space > 0 ? text.slice(space) : ''
  return (
    <>
      {head}{' '}
      <span className="inline-picture" aria-hidden="true">
        <Art art={art} />
      </span>
      {tail}
    </>
  )
}

/** A hand-drawn ring, like the pen circle on a marked exam paper («حوّط»). */
function InkRing({ tone }: { tone: 'good' | 'miss' | 'pen' | 'hint' }) {
  return (
    <svg className={`ink-ring ink-${tone}`} viewBox="0 0 120 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M62 7 C 96 6, 116 24, 114 50 C 112 79, 86 95, 56 94 C 24 93, 5 74, 6 49 C 7 24, 30 8, 66 9 C 78 10, 88 13, 95 18" pathLength="100" />
    </svg>
  )
}

/** The paper's ✗ drawn over a picture. */
function InkCross({ tone }: { tone: 'good' | 'miss' | 'pen' | 'hint' }) {
  return (
    <svg className={`ink-cross ink-${tone}`} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M22 20 C 40 40, 60 62, 80 82" pathLength="100" />
      <path d="M79 19 C 60 40, 41 60, 21 81" pathLength="100" />
    </svg>
  )
}

function PictureTile({ option, children, className = '' }: { option: Option; children?: ReactNode; className?: string }) {
  return (
    <span className={`picture-tile ${className}`}>
      <span className="picture-frame" aria-hidden="true">
        <Art art={option.art} />
      </span>
      {option.caption ? <span className="picture-caption">{option.caption}</span> : null}
      {children}
    </span>
  )
}

function CheckButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`big-button big-button-leaf press check-button ${disabled ? 'is-waiting' : 'is-pulsing'}`} onClick={onClick} disabled={disabled}>
      تحقق
    </button>
  )
}

// ── «حوط الصور…» and «ضع (✗) على الصور…» ────────────────────────────────────
interface CircleBoardProps {
  question: Question
  options: Option[]
  locked: boolean
  onCheck: (picked: string[], board: HTMLElement | null) => void
}

function CircleBoard({ question, options, locked, onCheck }: CircleBoardProps) {
  const [picked, setPicked] = useState<string[]>([])
  const boardRef = useRef<HTMLDivElement>(null)
  const Mark = question.marks === 'cross' ? InkCross : InkRing

  function toggle(id: string) {
    if (locked) return
    sfx.tap()
    setPicked((list) => (list.includes(id) ? list.filter((other) => other !== id) : [...list, id]))
  }

  return (
    <div ref={boardRef} className={`picture-board marks-${question.marks ?? 'ring'} count-${options.length}`}>
      <div className="picture-grid">
        {options.map((option, n) => {
          const isPicked = picked.includes(option.id)
          const isGood = question.good.includes(option.id)
          const state = locked ? (isPicked ? (isGood ? 'is-correct' : 'is-wrong') : isGood ? 'is-reveal' : 'is-dim') : isPicked ? 'is-picked' : ''
          return (
            <button
              key={option.id}
              type="button"
              className={`picture-button rise ${state}`}
              style={order(n, { '--base-delay': '140ms' })}
              onClick={() => toggle(option.id)}
              disabled={locked}
              aria-pressed={isPicked}
              aria-label={option.label}
              data-option={option.id}
            >
              <PictureTile option={option}>{isPicked || (locked && isGood) ? <Mark tone={locked ? (isGood ? (isPicked ? 'good' : 'hint') : 'miss') : 'pen'} /> : null}</PictureTile>
            </button>
          )
        })}
      </div>
      {!locked ? (
        <div className="check-row rise" style={order(options.length, { '--base-delay': '140ms' })}>
          <CheckButton disabled={picked.length === 0} onClick={() => onCheck(picked, boardRef.current)} />
        </div>
      ) : null}
    </div>
  )
}

// ── «لون… باللون البرتقالي… وباللون الأزرق» ─────────────────────────────────
type Paint = 'land' | 'water'

const CRAYONS: { id: Paint; label: string }[] = [
  { id: 'land', label: 'اليابسة' },
  { id: 'water', label: 'الماء' },
]

interface ColorBoardProps {
  question: Question
  options: Option[]
  locked: boolean
  onCheck: (colors: Record<string, Paint>, board: HTMLElement | null) => void
}

function ColorBoard({ question, options, locked, onCheck }: ColorBoardProps) {
  const [crayon, setCrayon] = useState<Paint>('land')
  const [colors, setColors] = useState<Record<string, Paint>>({})
  const boardRef = useRef<HTMLDivElement>(null)
  const done = options.every((option) => option.id in colors)

  function paint(id: string) {
    if (locked) return
    sfx.tap()
    setColors((current) => ({ ...current, [id]: crayon }))
  }

  return (
    <div ref={boardRef} className="color-board">
      {!locked ? (
        <div className="crayon-box rise" role="radiogroup" aria-label="الألوان">
          {CRAYONS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="radio"
              aria-checked={crayon === entry.id}
              className={`crayon crayon-${entry.id} press ${crayon === entry.id ? 'is-on' : ''}`}
              onClick={() => {
                sfx.tap()
                setCrayon(entry.id)
              }}
              data-crayon={entry.id}
            >
              <span className="crayon-stick" aria-hidden="true" />
              <span className="crayon-label">{entry.label}</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className={`picture-grid color-grid count-${options.length}`}>
        {options.map((option, n) => {
          const mine = colors[option.id]
          const truth: Paint = question.good.includes(option.id) ? 'land' : 'water'
          const state = locked ? (mine === truth ? 'is-correct' : 'is-wrong') : ''
          return (
            <button
              key={option.id}
              type="button"
              className={`picture-button color-cell rise ${mine ? `paint-${mine}` : ''} ${state}`}
              style={order(n, { '--base-delay': '140ms' })}
              onClick={() => paint(option.id)}
              disabled={locked}
              aria-label={`${option.label}${mine ? `: ${mine === 'land' ? 'برتقالي' : 'أزرق'}` : ''}`}
              data-option={option.id}
            >
              <PictureTile option={option} />
              {locked && mine !== truth ? <span className={`paint-truth paint-${truth}`} aria-hidden="true" /> : null}
            </button>
          )
        })}
      </div>
      {!locked ? (
        <div className="check-row rise" style={order(options.length, { '--base-delay': '140ms' })}>
          <CheckButton disabled={!done} onClick={() => onCheck(colors, boardRef.current)} />
        </div>
      ) : null}
    </div>
  )
}

// ── The numbers table and «صنف الحيوانات بوضع الرقم المناسب للمأوى» ──────────
interface RowsBoardProps {
  question: Question
  locked: boolean
  onRow: (row: Row) => void
  onHit: () => void
  onMiss: () => void
  onDone: (mistakes: number, board: HTMLElement | null) => void
}

function RowsBoard({ question, locked, onRow, onHit, onMiss, onDone }: RowsBoardProps) {
  const [filled, setFilled] = useState<Record<string, string>>({})
  const [mistakes, setMistakes] = useState(0)
  const [shaking, setShaking] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const keys = question.options
  const numberOf = (id: string) => arabicNumber(keys.findIndex((key) => key.id === id) + 1)
  const current = question.rows.find((row) => !(row.id in filled))
  const homes = question.format === 'homes'

  // The first sentence is read with the question; the others when their turn comes.
  const spoken = useRef(new Set<string>())
  useEffect(() => {
    if (!current || locked || spoken.current.has(current.id)) return
    const first = spoken.current.size === 0
    spoken.current.add(current.id)
    if (!first) onRow(current)
  }, [current, locked, onRow])

  function tap(key: Option) {
    if (locked || !current) return
    if (key.id === current.answer) {
      onHit()
      const done = { ...filled, [current.id]: key.id }
      setFilled(done)
      if (question.rows.every((row) => row.id in done)) window.setTimeout(() => onDone(mistakes, boardRef.current), 380)
      return
    }
    setMistakes((count) => count + 1)
    setShaking(key.id)
    onMiss()
    window.setTimeout(() => setShaking(null), 450)
  }

  const keyCards = (
    <div className={`key-row count-${keys.length}`}>
      {keys.map((key, n) => (
        <button
          key={key.id}
          type="button"
          className={`key-card press rise ${shaking === key.id ? 'shake' : ''}`}
          style={order(n, { '--base-delay': '140ms' })}
          onClick={() => tap(key)}
          disabled={locked}
          aria-label={`${arabicNumber(n + 1)}: ${key.label}`}
          data-key={key.id}
        >
          <span className="key-number">{arabicNumber(n + 1)}</span>
          <span className="key-art" aria-hidden="true">
            <Art art={key.art} />
          </span>
        </button>
      ))}
    </div>
  )

  if (homes) {
    return (
      <div ref={boardRef} className="rows-board homes-board">
        {keyCards}
        <div className={`home-row count-${question.rows.length}`}>
          {question.rows.map((row, n) => {
            const value = filled[row.id] ?? (locked ? row.answer : null)
            return (
              <div key={row.id} className={`home-cell rise ${current?.id === row.id && !locked ? 'is-current' : ''}`} style={order(n + keys.length, { '--base-delay': '140ms' })}>
                <span className="home-art" aria-hidden="true">
                  <Art art={row.art!} />
                </span>
                <span className={`number-box ${value ? 'is-filled' : ''}`}>{value ? <span className="ink-number pop">{numberOf(value)}</span> : null}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div ref={boardRef} className="rows-board table-board">
      <div className="table-sheet">
        <div className="table-head">
          <span>الرقم</span>
          <span>المجموعة (أ)</span>
        </div>
        {question.rows.map((row, n) => {
          const value = filled[row.id] ?? (locked ? row.answer : null)
          return (
            <div key={row.id} className={`table-row rise ${current?.id === row.id && !locked ? 'is-current' : ''}`} style={order(n, { '--base-delay': '120ms' })}>
              <span className="table-blank">
                (<span className="table-value">{value ? <span className="ink-number pop">{numberOf(value)}</span> : '..'}</span>)
              </span>
              <span className="table-text">{row.text}</span>
            </div>
          )
        })}
      </div>
      <p className="group-head">المجموعة (ب)</p>
      {keyCards}
    </div>
  )
}

// ── A big picture: circle in it, or place the numbers on it ─────────────────
interface SceneBoardProps {
  question: Question
  locked: boolean
  onRow: (row: Row) => void
  onHit: () => void
  onMiss: () => void
  onCheck: (correct: boolean, chosenId: string, board: HTMLElement | null) => void
}

function SceneBoard({ question, locked, onRow, onHit, onMiss, onCheck }: SceneBoardProps) {
  const scene = question.scene!
  const numbers = question.format === 'number'
  const [picked, setPicked] = useState<string[]>([])
  const [placed, setPlaced] = useState<Record<string, string>>({})
  const [mistakes, setMistakes] = useState(0)
  const [shaking, setShaking] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const current = question.rows.find((row) => !(row.id in placed))

  // The first sentence is read with the question; the others when their turn comes.
  const spoken = useRef(new Set<string>())
  useEffect(() => {
    if (!numbers || !current || locked || spoken.current.has(current.id)) return
    const first = spoken.current.size === 0
    spoken.current.add(current.id)
    if (!first) onRow(current)
  }, [current, locked, numbers, onRow])

  function tap(spot: Spot) {
    if (locked) return
    if (!numbers) {
      sfx.tap()
      setPicked((list) => (list.includes(spot.id) ? list.filter((other) => other !== spot.id) : [...list, spot.id]))
      return
    }
    if (!current || Object.values(placed).includes(spot.id)) return
    if (spot.id === current.answer) {
      onHit()
      const done = { ...placed, [current.id]: spot.id }
      setPlaced(done)
      if (question.rows.every((row) => row.id in done)) window.setTimeout(() => onCheck(mistakes === 0, `mistakes:${mistakes}`, boardRef.current), 380)
      return
    }
    setMistakes((count) => count + 1)
    setShaking(spot.id)
    onMiss()
    window.setTimeout(() => setShaking(null), 450)
  }

  const rowOf = (spotId: string) => question.rows.findIndex((row) => (placed[row.id] ?? (locked ? row.answer : null)) === spotId)

  return (
    <div ref={boardRef} className={`scene-board ${numbers ? 'scene-numbers' : 'scene-circle'}`}>
      {numbers ? (
        <ol className="scene-rows">
          {question.rows.map((row, n) => (
            <li key={row.id} className={`scene-row ${current?.id === row.id && !locked ? 'is-current' : ''} ${row.id in placed ? 'is-done' : ''}`}>
              <span className="scene-row-number">{arabicNumber(n + 1)}-</span> {row.text}
            </li>
          ))}
        </ol>
      ) : null}
      <div className="scene-frame rise">
        <Art art={`pic:${scene.pic}`} />
        {scene.spots.map((spot) => {
          const [x0, y0, x1, y1] = spot.box
          const isPicked = picked.includes(spot.id)
          const isGood = scene.good.includes(spot.id)
          const n = numbers ? rowOf(spot.id) : -1
          const tone = locked ? (isGood ? (isPicked ? 'good' : 'hint') : 'miss') : 'pen'
          return (
            <button
              key={spot.id}
              type="button"
              className={`scene-spot ${numbers ? 'is-slot' : ''} ${shaking === spot.id ? 'shake' : ''}`}
              style={{ left: `${x0}%`, top: `${y0}%`, width: `${x1 - x0}%`, height: `${y1 - y0}%` }}
              onClick={() => tap(spot)}
              disabled={locked}
              aria-pressed={numbers ? undefined : isPicked}
              aria-label={spot.label}
              data-spot={spot.id}
            >
              {!numbers && (isPicked || (locked && isGood)) ? <InkRing tone={tone} /> : null}
              {numbers && n >= 0 ? <span className="ink-number pop">{arabicNumber(n + 1)}</span> : null}
            </button>
          )
        })}
      </div>
      {!numbers && !locked ? (
        <div className="check-row rise">
          <CheckButton disabled={picked.length === 0} onClick={() => onCheck(sceneCorrect(scene, picked), picked.join(',') || 'none', boardRef.current)} />
        </div>
      ) : null}
    </div>
  )
}
