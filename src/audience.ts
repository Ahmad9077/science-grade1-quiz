import { AUDIENCES, type Audience } from './data/catalog'

// The page says which copy it is: index.html speaks to a girl, boys/index.html
// marks its root with data-audience="boys". Everything else is shared.
const root = typeof document === 'undefined' ? null : document.getElementById('root')

/** The private preview page holds both copies (its root says so): «#boys» opens the boys' copy. */
export const BOTH_COPIES = root?.dataset.copies === 'hash'
const hashBoys = BOTH_COPIES && typeof location !== 'undefined' && location.hash === '#boys'

export const AUDIENCE: Audience = root?.dataset.audience === 'boys' || hashBoys ? 'boys' : 'girls'
export const QUIZ_ID = AUDIENCES[AUDIENCE].quizId

/** Where public files (audio, pictures) live when this page sits in a subfolder (boys/ sets "../"). */
export const APP_ROOT: string | undefined = root?.dataset.appRoot

/** Screen text that speaks to the child. Shared, neutral text stays in the screens. */
export const WORDING = {
  girls: {
    listenAgain: 'اسمعي مرة ثانية',
    hello: 'جاهزة للاختبار؟',
    openFailed: 'ارجعي إلى صفحة الاختبارات ثم افتحي «علوم» مرة أخرى.',
  },
  boys: {
    listenAgain: 'اسمع مرة ثانية',
    hello: 'جاهز للاختبار؟',
    openFailed: 'ارجع إلى صفحة الاختبارات ثم افتح «علوم» مرة أخرى.',
  },
} satisfies Record<Audience, Record<string, string>>

export const WORDS = WORDING[AUDIENCE]
