import { useEffect, useMemo, useRef, useState } from 'react'
import { Art } from '../art/Art'
import { celebrate } from '../art/confetti'
import { useNarrator } from '../audio/NarratorContext'
import { sfx } from '../audio/sfx'
import { FACTS, clip, roundClips, type Option, type Question, type UiClip } from '../data/catalog'
import { TONES, toneStyle, type ToneId } from '../data/tones'
import { arabicNumber } from '../domain/format'
import { arrangeOptions } from '../domain/round'
import type { Attempt } from '../hub/bridge'
import { ArrowIcon, BigButton, CloseButton, SpeakerButton, StarIcon, order } from './ui'

const PRAISE: { text: string; clip: UiClip }[] = [
  { text: 'أحسنتي!', clip: 'praise-1' },
  { text: 'شطورة!', clip: 'praise-2' },
  { text: 'ممتاز يا بطلة!', clip: 'praise-3' },
  { text: 'برافو عليج!', clip: 'praise-4' },
]

// Narration starts once the question has settled on screen.
const ASK_DELAY_MS = 380

export interface Round {
  id: number
  kind: 'practice' | 'test'
  tone: ToneId
  questions: Question[]
}

interface QuizScreenProps {
  round: Round
  /** Play the mock-test introduction before the first question. */
  intro?: boolean
  onExit: () => void
  onFinish: (attempts: Attempt[]) => void
}

type Phase = 'asking' | 'answered'

export function QuizScreen({ round, intro = false, onExit, onFinish }: QuizScreenProps) {
  const narrator = useNarrator()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('asking')
  const [chosen, setChosen] = useState<string | null>(null)
  const [speakingOption, setSpeakingOption] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [praise, setPraise] = useState(PRAISE[0]!)
  const [confirmExit, setConfirmExit] = useState(false)
  const tileRefs = useRef(new Map<string, HTMLButtonElement>())
  const optionsRef = useRef<HTMLDivElement>(null)

  const question = round.questions[index]!
  const options = useMemo(() => arrangeOptions(question), [question])
  const fact = FACTS.find((entry) => entry.id === question.fact)
  const correctOption = question.options.find((option) => option.id === question.answer)!
  const tone = round.kind === 'test' ? question.topic : round.tone

  const askCues = useMemo(
    () => [
      { clip: clip.question(question.key), onStart: () => setSpeakingOption(null) },
      ...options.map((option) => ({ clip: option.clip, onStart: () => setSpeakingOption(option.id) })),
    ],
    [question, options],
  )

  // Load every clip of the round up front, so no question waits for its audio.
  useEffect(() => {
    narrator.preload(roundClips(round.questions))
  }, [narrator, round.questions])

  useEffect(() => {
    const opening = intro && index === 0 ? [{ clip: clip.ui('test-intro') }, { ...askCues[0]!, gap: 500 }, ...askCues.slice(1)] : askCues
    const timer = window.setTimeout(() => {
      void narrator.play(opening).then(() => setSpeakingOption(null))
    }, ASK_DELAY_MS)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the intro plays once, before question one
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
      if (overlap > 0) window.scrollBy({ top: overlap, behavior: 'smooth' })
    }, 650)
    return () => window.clearTimeout(timer)
  }, [phase])

  function replay() {
    if (phase === 'asking') void narrator.play(askCues).then(() => setSpeakingOption(null))
    else if (fact) void narrator.play([{ clip: clip.fact(fact.id) }])
  }

  function answer(option: Option) {
    if (phase !== 'asking') return
    narrator.stop()
    setSpeakingOption(null)
    const correct = option.id === question.answer
    setChosen(option.id)
    setPhase('answered')
    setAttempts((list) => [...list, { questionKey: question.key, chosen: option.id, correct }])

    if (correct) {
      sfx.correct()
      const pick = PRAISE[attempts.filter((attempt) => attempt.correct).length % PRAISE.length]!
      setPraise(pick)
      celebrate(tileRefs.current.get(option.id), TONES[tone].tone)
      void narrator.play([
        { clip: clip.ui(pick.clip), gap: 300 },
        { clip: clip.fact(question.fact), gap: 450 },
      ])
    } else {
      sfx.wrong()
      void narrator.play([
        { clip: clip.ui('correct-is'), gap: 450 },
        { clip: correctOption.clip, gap: 120 },
        { clip: clip.fact(question.fact), gap: 500 },
      ])
    }
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
  }

  const lastCorrect = attempts.at(-1)?.correct ?? false

  return (
    <main className={`screen quiz-screen ${phase === 'answered' ? 'has-feedback' : ''}`} style={toneStyle(tone)}>
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

      <section key={question.key} className={`question question-${question.kind} question-in`} data-question-key={question.key}>
        <div className="prompt-row">
          <SpeakerButton onClick={replay} />
          <h1 className="prompt">{question.prompt}</h1>
        </div>

        {question.subject.length > 0 ? (
          <div className={`subject pop ${question.kind === 'sort' ? 'subject-hero' : ''}`} style={order(0, { '--base-delay': '80ms' })} aria-hidden="true">
            <span className="subject-art bob">
              {question.subject.map((art) => (
                <Art key={art} art={art} />
              ))}
            </span>
            {question.subjectLabel ? <span className="subject-label">{question.subjectLabel}</span> : null}
          </div>
        ) : null}

        <div ref={optionsRef} className={`options options-${question.kind} count-${options.length}`}>
          {options.map((option, n) => {
            const isChosen = chosen === option.id
            const isAnswer = option.id === question.answer
            const state =
              phase === 'answered'
                ? isChosen
                  ? isAnswer
                    ? 'is-correct'
                    : 'is-wrong'
                  : isAnswer
                    ? 'is-reveal'
                    : 'is-dim'
                : speakingOption === option.id
                  ? 'is-speaking'
                  : ''
            return (
              <div key={option.id} className="option-slot rise" style={order(n, { '--base-delay': '140ms' })}>
                <button
                  ref={(node) => {
                    if (node) tileRefs.current.set(option.id, node)
                    else tileRefs.current.delete(option.id)
                  }}
                  type="button"
                  className={`option option-${option.id} ${state}`}
                  onClick={() => answer(option)}
                  disabled={phase === 'answered'}
                  aria-label={option.label}
                >
                  <span className={`option-art art-count-${option.art.length}`} aria-hidden="true">
                    {option.art.map((art, k) => (
                      <Art key={`${art}-${k}`} art={art} />
                    ))}
                  </span>
                  <span className="option-label">{option.label}</span>
                  {state === 'is-correct' || state === 'is-reveal' ? (
                    <span className="option-badge badge-good pop">✓</span>
                  ) : state === 'is-wrong' ? (
                    <span className="option-badge badge-miss pop">✕</span>
                  ) : null}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {phase === 'answered' ? (
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
              <p className="feedback-title">{lastCorrect ? praise.text : 'الجواب الصحيح:'}</p>
              {!lastCorrect ? <p className="feedback-answer">{correctOption.label}</p> : null}
            </div>
          </div>
          {fact ? <p className="feedback-fact">{fact.text}</p> : null}
          <div className="feedback-actions">
            <SpeakerButton onClick={() => fact && void narrator.play([{ clip: clip.fact(fact.id) }])} label="اسمعي الشرح" />
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
            <p id="exit-title" className="sheet-title">تبين تطلعين؟</p>
            <p className="sheet-sub">إجابات هذي الجولة ما راح تنحفظ.</p>
            <div className="sheet-actions">
              <BigButton onClick={() => setConfirmExit(false)}>أكمل اللعب</BigButton>
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
