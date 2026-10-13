import { AUDIENCES, clipsFor, type Audience } from './data/catalog'

// The page says which copy it is: index.html speaks to a girl, boys/index.html
// marks its root with data-audience="boys". Everything else is shared.
const root = typeof document === 'undefined' ? null : document.getElementById('root')

export const AUDIENCE: Audience = root?.dataset.audience === 'boys' ? 'boys' : 'girls'
export const QUIZ_ID = AUDIENCES[AUDIENCE].quizId
export const clip = clipsFor(AUDIENCE)

/** Where public files (audio) live when this page sits in a subfolder (boys/ sets "../"). */
export const APP_ROOT: string | undefined = root?.dataset.appRoot

/** Screen text that speaks to the child. Shared, neutral text stays in the screens. */
export const WORDING = {
  girls: {
    learn: 'تعلمي',
    practice: 'تدربي',
    practiceNow: 'تدربي الآن',
    listenAgain: 'اسمعي مرة ثانية',
    listenFact: 'اسمعي الشرح',
    praise: ['أحسنتي!', 'شطورة!', 'ممتاز يا بطلة!', 'برافو عليج!'],
    exitTitle: 'تبين تطلعين؟',
    doneGreat: 'واو! أنتي بطلة العلوم',
    doneGood: 'أحسنتي!',
    tryAgain: 'حاولي مرة ثانية',
    openFailed: 'ارجعي إلى صفحة الاختبارات ثم افتحي «علوم» مرة أخرى.',
  },
  boys: {
    learn: 'تعلم',
    practice: 'تدرب',
    practiceNow: 'تدرب الآن',
    listenAgain: 'اسمع مرة ثانية',
    listenFact: 'اسمع الشرح',
    praise: ['أحسنت!', 'شطور!', 'ممتاز يا بطل!', 'برافو عليك!'],
    exitTitle: 'تبي تطلع؟',
    doneGreat: 'واو! أنت بطل العلوم',
    doneGood: 'أحسنت!',
    tryAgain: 'حاول مرة ثانية',
    openFailed: 'ارجع إلى صفحة الاختبارات ثم افتح «علوم» مرة أخرى.',
  },
} satisfies Record<Audience, Record<string, string | string[]>>

export const WORDS = WORDING[AUDIENCE]
