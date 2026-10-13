// Content for "علوم" — Grade 1 science (Kuwait): plants we eat and animals.
// Source: the Grade 1 science book, term 1 part 1 (lesson pages 33–65 and their evaluations).
// Screen text follows the book's wording without diacritics; narration is a warm
// Kuwaiti-dialect explanation of the same idea (no diacritics, per the dialect guide).
// Question keys are permanent Hub identifiers: never rename or reuse one.
// This file is self-contained so Node scripts can import it directly.

export const QUIZ_ID = 'science-grade1'

export type TopicId = 'plants' | 'movement' | 'covering' | 'food' | 'breathing' | 'reproduction'
export type QuestionKind = 'pick' | 'sort' | 'tf'

export interface Thing {
  art: string
  name: string
  label: string
  feminine?: boolean
}

export interface Option {
  id: string
  art: string[]
  label: string
  /** Narration clip that names this option while its tile lights up. */
  clip: string
  say: string
}

export interface Question {
  key: string
  topic: TopicId
  kind: QuestionKind
  prompt: string
  say: string
  subject: string[]
  subjectLabel?: string
  options: Option[]
  answer: string
  fact: string
  difficulty: number
  skills: string[]
}

export interface Fact {
  id: string
  topic: TopicId
  /** Short line shown on screen, in the book's words. */
  text: string
  /** Spoken explanation in Kuwaiti dialect, often with an example. */
  say: string
  /** Pictures: a THINGS key (shown with its name) or a raw emoji / `svg:` drawing. */
  art: string[]
  /** Shown in the learn cards; explanation-only facts are false. */
  learn: boolean
}

export interface Topic {
  id: TopicId
  title: string
  short: string
  say: string
  art: string[]
}

// ── Things that appear as pictures ──────────────────────────────────────────
export const THINGS: Record<string, Thing> = {
  cat: { art: '🐈', name: 'القطة', label: 'قطة', feminine: true },
  dog: { art: '🐕', name: 'الكلب', label: 'كلب' },
  horse: { art: '🐎', name: 'الحصان', label: 'حصان' },
  rabbit: { art: '🐇', name: 'الأرنب', label: 'أرنب' },
  kangaroo: { art: '🦘', name: 'الكنغر', label: 'كنغر' },
  snake: { art: '🐍', name: 'الثعبان', label: 'ثعبان' },
  fish: { art: '🐟', name: 'السمكة', label: 'سمكة', feminine: true },
  colorfish: { art: '🐠', name: 'السمكة الملونة', label: 'سمكة ملونة', feminine: true },
  shark: { art: '🦈', name: 'القرش', label: 'قرش' },
  whale: { art: '🐋', name: 'الحوت', label: 'حوت' },
  octopus: { art: '🐙', name: 'الأخطبوط', label: 'أخطبوط' },
  crab: { art: '🦀', name: 'سرطان البحر', label: 'سرطان البحر' },
  turtle: { art: '🐢', name: 'السلحفاة', label: 'سلحفاة', feminine: true },
  crocodile: { art: '🐊', name: 'التمساح', label: 'تمساح' },
  lizard: { art: '🦎', name: 'السحلية', label: 'سحلية', feminine: true },
  parrot: { art: '🦜', name: 'الببغاء', label: 'ببغاء' },
  sparrow: { art: '🐦', name: 'العصفور', label: 'عصفور' },
  pigeon: { art: '🕊️', name: 'الحمامة', label: 'حمامة', feminine: true },
  owl: { art: '🦉', name: 'البومة', label: 'بومة', feminine: true },
  hawk: { art: '🦅', name: 'الصقر', label: 'صقر' },
  duck: { art: '🦆', name: 'البطة', label: 'بطة', feminine: true },
  penguin: { art: '🐧', name: 'البطريق', label: 'بطريق' },
  chicken: { art: '🐔', name: 'الدجاجة', label: 'دجاجة', feminine: true },
  sheep: { art: '🐑', name: 'الخروف', label: 'خروف' },
  camel: { art: '🐫', name: 'الجمل', label: 'جمل' },
  zebra: { art: '🦓', name: 'الحمار الوحشي', label: 'حمار وحشي' },
  giraffe: { art: '🦒', name: 'الزرافة', label: 'زرافة', feminine: true },
  elephant: { art: '🐘', name: 'الفيل', label: 'فيل' },
  lion: { art: '🦁', name: 'الأسد', label: 'أسد' },
  tiger: { art: '🐅', name: 'النمر', label: 'نمر' },
  bear: { art: '🐻', name: 'الدب', label: 'دب' },
  wolf: { art: '🐺', name: 'الذئب', label: 'ذئب' },
  fox: { art: '🦊', name: 'الثعلب', label: 'ثعلب' },
  deer: { art: '🦌', name: 'الغزال', label: 'غزال' },
  butterfly: { art: '🦋', name: 'الفراشة', label: 'فراشة', feminine: true },
  carrot: { art: '🥕', name: 'الجزر', label: 'جزر' },
  lettuce: { art: '🥬', name: 'الخس', label: 'خس' },
  mint: { art: '🌿', name: 'النعناع', label: 'نعناع' },
  broccoli: { art: '🥦', name: 'البروكلي', label: 'بروكلي' },
  sugarcane: { art: 'svg:sugarcane', name: 'قصب السكر', label: 'قصب السكر' },
  cauliflower: { art: 'svg:cauliflower', name: 'القرنبيط', label: 'قرنبيط' },
  radish: { art: 'svg:radish', name: 'الفجل الأبيض', label: 'فجل أبيض' },
}

// ── Answer concepts ────────────────────────────────────────────────────────
type Concept = Option

function concept(id: string, art: string, label: string, say = label): Concept {
  return { id, art: [art], label, say, clip: `o/${art.replace('svg:', '')}` }
}

const PART = {
  root: concept('root', 'svg:part-root', 'الجذر'),
  stem: concept('stem', 'svg:part-stem', 'الساق'),
  leaf: concept('leaf', 'svg:part-leaf', 'الورقة'),
  flower: concept('flower', 'svg:part-flower', 'الزهرة'),
}
// The book labels movement with these verbs (يطير، يزحف، يمشي، يسبح، يقفز).
const MOVE = {
  fly: concept('fly', 'svg:move-fly', 'يطير'),
  swim: concept('swim', 'svg:move-swim', 'يسبح'),
  walk: concept('walk', 'svg:move-walk', 'يمشي'),
  crawl: concept('crawl', 'svg:move-crawl', 'يزحف'),
  jump: concept('jump', 'svg:move-jump', 'يقفز'),
}
const COVER = {
  scales: concept('scales', 'svg:cover-scales', 'قشور'),
  feathers: concept('feathers', 'svg:cover-feathers', 'ريش'),
  fur: concept('fur', 'svg:cover-fur', 'شعر'),
  plates: concept('plates', 'svg:cover-plates', 'حراشف'),
  shell: concept('shell', 'svg:cover-shell', 'صندوق عظمي'),
}
const TRUE_FALSE: Option[] = [
  { id: 'true', art: ['svg:check'], label: 'صح', say: 'صح', clip: 'o/true' },
  { id: 'false', art: ['svg:cross'], label: 'خطأ', say: 'خطأ', clip: 'o/false' },
]
const FOOD: Option[] = [
  { id: 'plants', art: ['svg:food-plants'], label: 'نباتات', say: 'نباتات', clip: 'o/food-plants' },
  { id: 'meat', art: ['svg:food-meat'], label: 'لحوم', say: 'لحوم', clip: 'o/food-meat' },
]
const BREATH: Option[] = [
  { id: 'lungs', art: ['svg:lungs'], label: 'الرئتين', say: 'بالرئتين', clip: 'o/lungs' },
  { id: 'gills', art: ['svg:gills'], label: 'الخياشيم', say: 'بالخياشيم', clip: 'o/gills' },
]
const BIRTH: Option[] = [
  { id: 'birth', art: ['svg:birth'], label: 'ولادة', say: 'بالولادة', clip: 'o/birth' },
  { id: 'egg', art: ['svg:egg'], label: 'بيض', say: 'بالبيض', clip: 'o/egg' },
]

// ── Facts: learn cards and the explanation after each answer ──────────────
function fact(id: string, topic: TopicId, text: string, say: string, art: string[], learn = true): Fact {
  return { id, topic, text, say, art, learn }
}

const FACT_SOURCE: Fact[] = [
  // Plants we eat
  fact('p-parts', 'plants', 'للنبات أربعة أجزاء: الجذر والساق والأوراق والزهرة.',
    'النبات له أربعة أجزاء… الجذر، والساق، والأوراق، والزهرة.', ['svg:plant']),
  fact('p-root', 'plants', 'الجذر يكون داخل التربة.',
    'الجذر يكون تحت التراب… ويشرب الماي للنبتة. ومن الجذور اللي ناكلها: الجزر.', ['svg:part-root', 'carrot']),
  fact('p-stem', 'plants', 'الساق يحمل النبات.',
    'الساق يشيل النبتة ويخليها واقفة… ومن السيقان اللي ناكلها: قصب السكر.', ['svg:part-stem', 'sugarcane']),
  fact('p-leaf', 'plants', 'نأكل أوراق الخس والنعناع.',
    'الأوراق لونها أخضر… وفي أوراق ناكلها، مثل: الخس، والنعناع.', ['svg:part-leaf', 'lettuce', 'mint']),
  fact('p-flower', 'plants', 'نأكل زهرة القرنبيط والبروكلي.',
    'والزهرة… في نباتات ناكل زهرتها، مثل: القرنبيط، والبروكلي.', ['svg:part-flower', 'cauliflower', 'broccoli']),
  fact('p-different', 'plants', 'نأكل من النبات أجزاء مختلفة.',
    'يعني… مو كل النباتات ناكل منها نفس الجزء! من الجزر ناكل الجذر، ومن الخس ناكل الأوراق، ومن القرنبيط ناكل الزهرة.',
    ['carrot', 'lettuce', 'cauliflower']),
  fact('p-radish', 'plants', 'الفجل الأبيض نأكل منه الجذر والأوراق.',
    'وفي نباتات ناكل منها أكثر من جزء… مثل الفجل الأبيض: ناكل جذره الأبيض، وناكل أوراقه بعد.', ['radish']),
  fact('p-carrot', 'plants', 'الجزر نأكل منه الجذر.',
    'الجزر… هو جذر النبتة! ينمو تحت التراب، وإحنا ناكله.', ['carrot', 'svg:part-root'], false),
  fact('p-sugarcane', 'plants', 'قصب السكر نأكل منه الساق.',
    'قصب السكر… ناكل ساقه الطويل، ومنه يسوون السكر.', ['sugarcane', 'svg:part-stem'], false),
  fact('p-lettuce', 'plants', 'الخس نأكل منه الأوراق.',
    'الخس… ناكل أوراقه الخضرا.', ['lettuce', 'svg:part-leaf'], false),
  fact('p-cauliflower', 'plants', 'القرنبيط نأكل منه الزهرة.',
    'القرنبيط… الجزء الأبيض اللي ناكله هو زهرته. والبروكلي بعد ناكل زهرته.',
    ['cauliflower', 'broccoli', 'svg:part-flower'], false),

  // Movement
  fact('m-different', 'movement', 'تنتقل الحيوانات من مكان لآخر بطرق مختلفة.',
    'الحيوانات تتحرك من مكان لمكان… بس كل حيوان له طريقته!', ['rabbit', 'parrot', 'fish', 'snake']),
  fact('m-fly', 'movement', 'الطيور تطير.',
    'الطيور تطير بجناحاتها في السما… مثل الببغاء، والحمامة، والبومة.', ['parrot', 'pigeon', 'owl', 'svg:move-fly']),
  fact('m-swim', 'movement', 'السمكة تسبح.',
    'السمكة تسبح في الماي… والحوت بعد يسبح.', ['fish', 'whale', 'svg:move-swim']),
  fact('m-walk', 'movement', 'الحصان يمشي.',
    'الحصان يمشي على رجوله… والكلب والأسد بعد يمشون.', ['horse', 'dog', 'lion', 'svg:move-walk']),
  fact('m-crawl', 'movement', 'الثعبان يزحف.',
    'الثعبان ما عنده رجول… فيزحف على بطنه.', ['snake', 'svg:move-crawl']),
  fact('m-jump', 'movement', 'الأرنب والكنغر يقفزان.',
    'الأرنب يقفز… والكنغر يقفز قفزات كبيرة!', ['rabbit', 'kangaroo', 'svg:move-jump']),
  fact('m-duck', 'movement', 'البطة تتحرك بأكثر من طريقة: تسبح وتمشي وتطير.',
    'في حيوانات تتحرك بأكثر من طريقة… البطة: تسبح في الماي، وتمشي على الأرض، وتطير في السما!',
    ['duck', 'svg:move-swim', 'svg:move-walk', 'svg:move-fly']),
  fact('m-penguin', 'movement', 'البطريق يمشي ويسبح.',
    'والبطريق يمشي ويسبح… بس ما يطير.', ['penguin', 'svg:move-walk', 'svg:move-swim']),
  fact('m-seaturtle', 'movement', 'السلحفاة البحرية تزحف وتسبح.',
    'والسلحفاة البحرية… تزحف على الرمل، وتسبح في البحر.', ['turtle', 'svg:move-crawl', 'svg:move-swim']),

  // Body covering
  fact('c-different', 'covering', 'لكل حيوان غطاء، وأغطية الحيوانات مختلفة.',
    'كل حيوان له غطا يغطي جسمه… والأغطية مو نفس الشي، مختلفة.',
    ['svg:cover-scales', 'svg:cover-feathers', 'svg:cover-fur', 'svg:cover-plates']),
  fact('c-fish', 'covering', 'السمكة يغطي جسمها قشور.',
    'السمكة جسمها مغطى بقشور… صغيرة ولامعة.', ['fish', 'svg:cover-scales']),
  fact('c-birds', 'covering', 'الطيور يغطي جسمها ريش.',
    'الطيور جسمها مغطى بريش… مثل الببغاء، والبطريق، والبطة.', ['parrot', 'penguin', 'duck', 'svg:cover-feathers']),
  fact('c-fur', 'covering', 'الثعلب والأسد والذئب يغطي جسمها شعر.',
    'الثعلب، والأسد، والذئب… جسمهم مغطى بشعر.', ['fox', 'lion', 'wolf', 'svg:cover-fur']),
  fact('c-crocodile', 'covering', 'التمساح يغطي جسمه حراشف.',
    'التمساح جسمه مغطى بحراشف… قوية وخشنة.', ['crocodile', 'svg:cover-plates']),
  fact('c-turtle', 'covering', 'السلحفاة يغطي جسمها صندوق عظمي.',
    'السلحفاة جسمها مغطى بصندوق عظمي… قوي، يحميها.', ['turtle', 'svg:cover-shell']),
  fact('c-protect', 'covering', 'غطاء الجسم يحمي الحيوان.',
    'وليش الغطا مهم؟ لأنه يحمي جسم الحيوان.', ['svg:cover-fur', 'svg:cover-feathers']),
  fact('c-warm', 'covering', 'شعر الذئب يساعده على الدفء.',
    'شعر الذئب يدفيه… عشان ما يبرد.', ['wolf', 'svg:warmth']),
  fact('c-duck', 'covering', 'ريش البطة يمنع دخول الماء إلى جسمها.',
    'وريش البطة يمنع الماي يدخل جسمها… عشان جذي ما تتبلل وهي تسبح.', ['duck', 'svg:cover-feathers']),

  // Food
  fact('f-different', 'food', 'نوع غذاء الحيوانات مختلف.',
    'الحيوانات مو كلها تاكل نفس الأكل… أكلها مختلف.', ['svg:food-plants', 'svg:food-meat']),
  fact('f-plants', 'food', 'الأرنب والحصان والجمل تأكل النباتات.',
    'في حيوانات تاكل نباتات… مثل الأرنب، والحصان، والجمل.', ['rabbit', 'horse', 'camel', 'svg:food-plants']),
  fact('f-elephant', 'food', 'الفيل والزرافة يأكلان النباتات.',
    'والفيل، والزرافة… بعد ياكلون نباتات.', ['elephant', 'giraffe', 'svg:food-plants']),
  fact('f-meat', 'food', 'الذئب والثعبان والصقر تأكل اللحوم.',
    'وفي حيوانات تاكل لحوم… مثل الذئب، والثعبان، والصقر.', ['wolf', 'snake', 'hawk', 'svg:food-meat']),
  fact('f-lion', 'food', 'الأسد يأكل اللحوم، وصغاره تأكل اللحوم أيضا.',
    'الأسد ياكل لحوم… واللبوة تعطي صغارها لحم ياكلونه.', ['lion', 'svg:food-meat']),
  fact('f-crocodile', 'food', 'التمساح يأكل لحوم حيوانات أخرى.',
    'التمساح ياكل لحوم حيوانات ثانية.', ['crocodile', 'svg:food-meat']),
  fact('f-chain', 'food', 'آكلات اللحوم تتغذى على آكلات الأعشاب.',
    'والحيوانات اللي تاكل لحوم… تاكل الحيوانات اللي تاكل أعشاب.', ['lion', 'zebra']),

  // Breathing
  fact('b-like-us', 'breathing', 'الحيوانات تتنفس مثلنا.',
    'الحيوانات تتنفس مثلنا… بس مو كلها بنفس الطريقة.', ['cat', 'fish', 'chicken']),
  fact('b-lungs', 'breathing', 'القطة والأرنب والدجاجة والسلحفاة تتنفس بالرئتين.',
    'القطة، والأرنب، والدجاجة، والسلحفاة… تتنفس الهوا بالرئتين، مثلنا بالضبط.',
    ['cat', 'rabbit', 'chicken', 'turtle', 'svg:lungs']),
  fact('b-lungs-more', 'breathing', 'الزرافة والدب والطيور تتنفس بالرئتين أيضا.',
    'والزرافة، والدب، والطيور… بعد تتنفس بالرئتين.', ['giraffe', 'bear', 'sparrow', 'svg:lungs']),
  fact('b-gills', 'breathing', 'السمكة والقرش يتنفسان في الماء بالخياشيم.',
    'أما السمكة والقرش… يتنفسون داخل الماي بالخياشيم.', ['fish', 'shark', 'svg:gills']),
  fact('b-crab', 'breathing', 'سرطان البحر يتنفس بالخياشيم.',
    'وسرطان البحر بعد… يتنفس بالخياشيم.', ['crab', 'svg:gills']),
  fact('b-fish-out', 'breathing', 'السمكة تحتاج إلى الماء لكي تعيش.',
    'السمكة تحتاج الماي عشان تعيش… إذا طلعت من الماي وقت طويل، تموت.', ['fish', 'svg:water']),

  // Reproduction
  fact('r-ways', 'reproduction', 'الولادة والبيض من طرق تكاثر الحيوانات.',
    'الحيوانات تتكاثر… يعني تجيب صغار. وفيه طريقتين: الولادة، والبيض.', ['svg:birth', 'svg:egg']),
  fact('r-birth', 'reproduction', 'القطة والخروف والدب تتكاثر بالولادة.',
    'القطة، والخروف، والدب… تتكاثر بالولادة: تولد صغارها.', ['cat', 'sheep', 'bear', 'svg:birth']),
  fact('r-eggs', 'reproduction', 'السلحفاة والسمكة تتكاثران بالبيض.',
    'والسلحفاة، والسمكة… تتكاثر بالبيض.', ['turtle', 'colorfish', 'svg:egg']),
  fact('r-birds', 'reproduction', 'الطيور كلها تتكاثر بالبيض.',
    'وكل الطيور تتكاثر بالبيض… مثل الدجاجة، والعصفور، والبطة.', ['chicken', 'sparrow', 'duck', 'svg:egg']),
  fact('r-giraffe', 'reproduction', 'الزرافة تأكل النباتات وتتكاثر بالولادة.',
    'الزرافة… تاكل نباتات، وتتكاثر بالولادة.', ['giraffe', 'svg:food-plants', 'svg:birth']),
  fact('r-nest', 'reproduction', 'البيض في العش تضعه الطيور مثل الحمامة والعصفور.',
    'إذا شفتي بيض في عش… فهذا بيض طيور، مثل الحمامة والعصفور.', ['🪺', 'pigeon', 'sparrow']),
]

// ── Topics ──────────────────────────────────────────────────────────────────
const TOPIC_SOURCE: Topic[] = [
  { id: 'plants', title: 'أي أجزاء النبات نأكل؟', short: 'النبات', say: 'أي أجزاء النبات ناكل؟', art: ['🥕', '🥬'] },
  { id: 'movement', title: 'كيف تنتقل الحيوانات؟', short: 'الحركة', say: 'شلون تتحرك الحيوانات؟', art: ['🐇', '🦜'] },
  { id: 'covering', title: 'ماذا يغطي جسم الحيوانات؟', short: 'الغطاء', say: 'شنو يغطي جسم الحيوانات؟', art: ['🐢', '🦜'] },
  { id: 'food', title: 'ماذا تأكل الحيوانات؟', short: 'الغذاء', say: 'شنو تاكل الحيوانات؟', art: ['🐫', '🦁'] },
  { id: 'breathing', title: 'كيف تتنفس الحيوانات؟', short: 'التنفس', say: 'شلون تتنفس الحيوانات؟', art: ['🦈', '🐈'] },
  { id: 'reproduction', title: 'كيف تتكاثر الحيوانات؟', short: 'التكاثر', say: 'شلون تتكاثر الحيوانات؟', art: ['🐣', '🐑'] },
]

// ── Question helpers ───────────────────────────────────────────────────────
function thing(id: string): Thing {
  const found = THINGS[id]
  if (!found) throw new Error(`Unknown thing: ${id}`)
  return found
}

function v(id: string, masculine: string, feminine: string): string {
  return thing(id).feminine ? feminine : masculine
}

// Choices keep a fixed source order so the right answer is never always first.
function canonical<K extends string>(set: Record<K, Concept>, keys: K[]): Concept[] {
  return (Object.keys(set) as K[]).filter((key) => keys.includes(key)).map((key) => set[key])
}

function animals(ids: string[]): Option[] {
  return ids.map((id) => ({ id, art: [thing(id).art], label: thing(id).label, say: thing(id).label, clip: `o/${id}` }))
}

type Base = Pick<Question, 'fact' | 'difficulty' | 'skills'>

function tf(topic: TopicId, slug: string, statement: string, say: string, answer: boolean, base: Base): Question {
  return { key: `${topic}:${slug}`, topic, kind: 'tf', prompt: statement, say, subject: [], options: TRUE_FALSE, answer: answer ? 'true' : 'false', ...base }
}

function pick(
  topic: TopicId,
  slug: string,
  prompt: string,
  say: string,
  ids: string[],
  answer: string,
  base: Base,
  subject: string[] = [],
): Question {
  return { key: `${topic}:${slug}`, topic, kind: 'pick', prompt, say, subject, options: animals(ids), answer, ...base }
}

function partQ(slug: string, id: string, answer: keyof typeof PART, base: Base): Question {
  return {
    key: `plants:${slug}`,
    topic: 'plants',
    kind: 'pick',
    prompt: `أي جزء نأكل من ${thing(id).name}؟`,
    say: `أي جزء ناكل من ${thing(id).name}؟`,
    subject: [thing(id).art],
    subjectLabel: thing(id).label,
    options: [PART.root, PART.stem, PART.leaf, PART.flower],
    answer,
    ...base,
  }
}

function moveQ(id: string, answer: keyof typeof MOVE, others: (keyof typeof MOVE)[], base: Base): Question {
  return {
    key: `movement:${id}`,
    topic: 'movement',
    kind: 'pick',
    prompt: `كيف ${v(id, 'ينتقل', 'تنتقل')} ${thing(id).name}؟`,
    say: `شلون ${v(id, 'يتحرك', 'تتحرك')} ${thing(id).name}؟`,
    subject: [thing(id).art],
    subjectLabel: thing(id).label,
    options: canonical(MOVE, [answer, ...others]),
    answer,
    ...base,
  }
}

function coverQ(id: string, answer: keyof typeof COVER, others: (keyof typeof COVER)[], base: Base): Question {
  return {
    key: `covering:${id}`,
    topic: 'covering',
    kind: 'pick',
    prompt: `ماذا يغطي جسم ${thing(id).name}؟`,
    say: `شنو يغطي جسم ${thing(id).name}؟`,
    subject: [thing(id).art],
    subjectLabel: thing(id).label,
    options: canonical(COVER, [answer, ...others]),
    answer,
    ...base,
  }
}

function foodQ(id: string, answer: 'plants' | 'meat', base: Base): Question {
  return {
    key: `food:${id}`,
    topic: 'food',
    kind: 'sort',
    prompt: `ماذا ${v(id, 'يأكل', 'تأكل')} ${thing(id).name}؟`,
    say: `شنو ${v(id, 'ياكل', 'تاكل')} ${thing(id).name}؟`,
    subject: [thing(id).art],
    subjectLabel: thing(id).label,
    options: FOOD,
    answer,
    ...base,
  }
}

function breathQ(id: string, answer: 'lungs' | 'gills', base: Base): Question {
  return {
    key: `breathing:${id}`,
    topic: 'breathing',
    kind: 'sort',
    prompt: `بماذا ${v(id, 'يتنفس', 'تتنفس')} ${thing(id).name}؟`,
    say: `شلون ${v(id, 'يتنفس', 'تتنفس')} ${thing(id).name}؟`,
    subject: [thing(id).art],
    subjectLabel: thing(id).label,
    options: BREATH,
    answer,
    ...base,
  }
}

function birthQ(id: string, answer: 'birth' | 'egg', base: Base): Question {
  return {
    key: `reproduction:${id}`,
    topic: 'reproduction',
    kind: 'sort',
    prompt: `كيف ${v(id, 'يتكاثر', 'تتكاثر')} ${thing(id).name}؟`,
    say: `شلون ${v(id, 'يتكاثر', 'تتكاثر')} ${thing(id).name}؟`,
    subject: [thing(id).art],
    subjectLabel: thing(id).label,
    options: BIRTH,
    answer,
    ...base,
  }
}

const S = {
  recall: ['recall'],
  classify: ['classify'],
  apply: ['apply'],
  odd: ['compare', 'odd_one_out'],
  statement: ['true_false'],
}

// ── Questions ──────────────────────────────────────────────────────────────
const QUESTION_SOURCE: Question[] = [
  // Plants we eat (book pages 33–38)
  tf('plants', 'eat-some-parts', 'نأكل بعض أجزاء النبات.', 'ناكل بعض أجزاء النبات.', true, { fact: 'p-different', difficulty: 15, skills: S.statement }),
  tf('plants', 'four-parts', 'يتكون النبات من ثلاثة أجزاء فقط: جذر وساق وزهرة.', 'النبات يتكون من ثلاثة أجزاء بس: جذر، وساق، وزهرة.', false, { fact: 'p-parts', difficulty: 42, skills: S.statement }),
  tf('plants', 'lettuce-leaves', 'يأكل الإنسان أوراق الخس.', 'إحنا ناكل أوراق الخس.', true, { fact: 'p-lettuce', difficulty: 20, skills: S.statement }),
  tf('plants', 'radish-two-parts', 'الفجل الأبيض نأكل منه الجذر والأوراق.', 'الفجل الأبيض ناكل منه الجذر والأوراق.', true, { fact: 'p-radish', difficulty: 55, skills: S.statement }),
  partQ('carrot', 'carrot', 'root', { fact: 'p-carrot', difficulty: 20, skills: S.recall }),
  partQ('lettuce', 'lettuce', 'leaf', { fact: 'p-lettuce', difficulty: 22, skills: S.recall }),
  partQ('sugarcane', 'sugarcane', 'stem', { fact: 'p-sugarcane', difficulty: 38, skills: S.recall }),
  partQ('cauliflower', 'cauliflower', 'flower', { fact: 'p-cauliflower', difficulty: 38, skills: S.recall }),
  partQ('mint', 'mint', 'leaf', { fact: 'p-leaf', difficulty: 40, skills: S.apply }),
  {
    key: 'plants:root-in-soil',
    topic: 'plants',
    kind: 'pick',
    prompt: 'أي جزء من النبات يكون داخل التربة؟',
    say: 'أي جزء من النبات يكون تحت التراب؟',
    subject: [],
    options: [PART.root, PART.stem, PART.leaf, PART.flower],
    answer: 'root',
    fact: 'p-root',
    difficulty: 25,
    skills: S.recall,
  },
  pick('plants', 'which-flower', 'أي نبات نأكل منه الزهرة؟', 'أي نبات ناكل منه الزهرة؟', ['sugarcane', 'lettuce', 'carrot', 'cauliflower'], 'cauliflower', { fact: 'p-cauliflower', difficulty: 45, skills: S.apply }),
  pick('plants', 'which-root', 'أي نبات نأكل منه الجذر؟', 'أي نبات ناكل منه الجذر؟', ['lettuce', 'carrot', 'broccoli', 'sugarcane'], 'carrot', { fact: 'p-carrot', difficulty: 30, skills: S.apply }),
  pick('plants', 'which-stem', 'أي نبات نأكل منه الساق؟', 'أي نبات ناكل منه الساق؟', ['carrot', 'sugarcane', 'lettuce', 'cauliflower'], 'sugarcane', { fact: 'p-sugarcane', difficulty: 42, skills: S.apply }),

  // How animals move (book pages 42–45, 64–65)
  moveQ('parrot', 'fly', ['swim', 'crawl', 'jump'], { fact: 'm-fly', difficulty: 15, skills: S.recall }),
  moveQ('fish', 'swim', ['fly', 'walk', 'jump'], { fact: 'm-swim', difficulty: 15, skills: S.recall }),
  moveQ('horse', 'walk', ['crawl', 'swim', 'fly'], { fact: 'm-walk', difficulty: 20, skills: S.recall }),
  moveQ('snake', 'crawl', ['walk', 'jump', 'fly'], { fact: 'm-crawl', difficulty: 25, skills: S.recall }),
  moveQ('rabbit', 'jump', ['crawl', 'swim', 'fly'], { fact: 'm-jump', difficulty: 25, skills: S.recall }),
  tf('movement', 'kangaroo-jumps', 'ينتقل الكنغر من مكان لآخر بالقفز.', 'الكنغر يتحرك من مكان لمكان بالقفز.', true, { fact: 'm-jump', difficulty: 30, skills: S.statement }),
  tf('movement', 'all-same-way', 'جميع الحيوانات لها طريقة انتقال واحدة.', 'كل الحيوانات تتحرك بنفس الطريقة.', false, { fact: 'm-different', difficulty: 40, skills: S.statement }),
  tf('movement', 'penguin-walks-swims', 'البطريق يمشي ويسبح.', 'البطريق يمشي ويسبح.', true, { fact: 'm-penguin', difficulty: 50, skills: S.statement }),
  tf('movement', 'rabbit-swims', 'ينتقل الأرنب من مكان لآخر بالسباحة.', 'الأرنب يتحرك من مكان لمكان بالسباحة.', false, { fact: 'm-jump', difficulty: 35, skills: S.statement }),
  pick('movement', 'which-flies', 'أي حيوان ينتقل بالطيران؟', 'أي حيوان يطير؟', ['penguin', 'fish', 'owl', 'lizard'], 'owl', { fact: 'm-fly', difficulty: 45, skills: S.apply }),
  pick('movement', 'which-crawls', 'أي حيوان يزحف؟', 'أي حيوان يزحف؟', ['sheep', 'chicken', 'snake', 'cat'], 'snake', { fact: 'm-crawl', difficulty: 20, skills: S.apply }),
  pick('movement', 'which-jumps', 'أي حيوان يقفز؟', 'أي حيوان يقفز؟', ['bear', 'hawk', 'rabbit'], 'rabbit', { fact: 'm-jump', difficulty: 20, skills: S.apply }),
  pick('movement', 'more-than-one-way', 'أي حيوان يتحرك بأكثر من طريقة؟', 'أي حيوان يتحرك بأكثر من طريقة؟', ['sheep', 'duck', 'snake', 'horse'], 'duck', { fact: 'm-duck', difficulty: 50, skills: S.apply }),
  pick('movement', 'like-pigeon', 'أي حيوان يتحرك مثل الحمامة؟', 'أي حيوان يتحرك مثل الحمامة؟', ['dog', 'owl', 'whale'], 'owl', { fact: 'm-fly', difficulty: 40, skills: S.odd }, ['🕊️']),
  {
    key: 'movement:duck-ways',
    topic: 'movement',
    kind: 'pick',
    prompt: 'كيف تتحرك البطة؟',
    say: 'شلون تتحرك البطة؟',
    subject: ['🦆'],
    subjectLabel: 'بطة',
    options: [
      { id: 'swim-walk-fly', art: ['svg:move-swim', 'svg:move-walk', 'svg:move-fly'], label: 'تسبح وتمشي وتطير', say: 'تسبح، وتمشي، وتطير', clip: 'o/duck-swim-walk-fly' },
      { id: 'crawl-walk-jump', art: ['svg:move-crawl', 'svg:move-walk', 'svg:move-jump'], label: 'تزحف وتمشي وتقفز', say: 'تزحف، وتمشي، وتقفز', clip: 'o/duck-crawl-walk-jump' },
      { id: 'fly-walk-crawl', art: ['svg:move-fly', 'svg:move-walk', 'svg:move-crawl'], label: 'تطير وتمشي وتزحف', say: 'تطير، وتمشي، وتزحف', clip: 'o/duck-fly-walk-crawl' },
    ],
    answer: 'swim-walk-fly',
    fact: 'm-duck',
    difficulty: 58,
    skills: ['apply', 'multi_step'],
  },

  // Body covering (book pages 46–49, 64–65)
  coverQ('fish', 'scales', ['feathers', 'fur', 'plates'], { fact: 'c-fish', difficulty: 22, skills: S.recall }),
  coverQ('parrot', 'feathers', ['scales', 'fur', 'plates'], { fact: 'c-birds', difficulty: 15, skills: S.recall }),
  coverQ('fox', 'fur', ['feathers', 'scales', 'plates'], { fact: 'c-fur', difficulty: 20, skills: S.recall }),
  coverQ('crocodile', 'plates', ['fur', 'feathers', 'scales'], { fact: 'c-crocodile', difficulty: 42, skills: S.recall }),
  coverQ('turtle', 'shell', ['fur', 'feathers', 'scales'], { fact: 'c-turtle', difficulty: 50, skills: S.recall }),
  pick('covering', 'which-scales', 'أي حيوان يغطي جسمه قشور؟', 'أي حيوان جسمه مغطى بقشور؟', ['snake', 'zebra', 'fish', 'sparrow'], 'fish', { fact: 'c-fish', difficulty: 35, skills: S.apply }),
  pick('covering', 'keeps-water-out', 'أي حيوان يمنع غطاؤه دخول الماء إلى جسمه؟', 'أي حيوان غطاه يمنع الماي يدخل جسمه؟', ['snake', 'elephant', 'crocodile', 'duck'], 'duck', { fact: 'c-duck', difficulty: 60, skills: S.apply }),
  pick('covering', 'odd-one-out', 'أي حيوان غطاء جسمه مختلف؟', 'أي حيوان غطا جسمه مختلف عن الباقين؟', ['bear', 'lion', 'pigeon', 'tiger'], 'pigeon', { fact: 'c-birds', difficulty: 48, skills: S.odd }),
  {
    key: 'covering:wolf-warmth',
    topic: 'covering',
    kind: 'pick',
    prompt: 'غطاء جسم الذئب يساعده على...',
    say: 'غطا جسم الذئب… يساعده على شنو؟',
    subject: ['🐺'],
    subjectLabel: 'ذئب',
    options: [
      { id: 'swim', art: ['svg:move-swim'], label: 'السباحة', say: 'السباحة', clip: 'o/the-swimming' },
      { id: 'warmth', art: ['svg:warmth'], label: 'الدفء', say: 'الدفا', clip: 'o/warmth' },
      { id: 'fly', art: ['svg:move-fly'], label: 'الطيران', say: 'الطيران', clip: 'o/the-flying' },
    ],
    answer: 'warmth',
    fact: 'c-warm',
    difficulty: 55,
    skills: ['apply', 'function'],
  },
  {
    key: 'covering:same-cover-group',
    topic: 'covering',
    kind: 'pick',
    prompt: 'أي مجموعة لها غطاء الجسم نفسه؟',
    say: 'أي مجموعة جسمهم مغطى بنفس الغطا؟',
    subject: [],
    options: [
      { id: 'fish-tiger', art: ['🐟', '🐅'], label: 'سمكة ونمر', say: 'سمكة ونمر', clip: 'o/fish-tiger' },
      { id: 'sparrow-penguin', art: ['🐦', '🐧'], label: 'عصفور وبطريق', say: 'عصفور وبطريق', clip: 'o/sparrow-penguin' },
      { id: 'parrot-rabbit', art: ['🦜', '🐇'], label: 'ببغاء وأرنب', say: 'ببغاء وأرنب', clip: 'o/parrot-rabbit' },
    ],
    answer: 'sparrow-penguin',
    fact: 'c-birds',
    difficulty: 62,
    skills: ['compare', 'group'],
  },
  tf('covering', 'protects', 'أغطية أجسام الحيوانات تساعد على حماية الحيوان.', 'غطا جسم الحيوان يحميه.', true, { fact: 'c-protect', difficulty: 25, skills: S.statement }),
  tf('covering', 'all-same', 'أغطية أجسام الحيوانات كلها متشابهة.', 'كل الحيوانات غطا جسمها نفس الشي.', false, { fact: 'c-different', difficulty: 30, skills: S.statement }),
  tf('covering', 'crocodile-plates', 'يغطي جسم التمساح حراشف.', 'جسم التمساح مغطى بحراشف.', true, { fact: 'c-crocodile', difficulty: 40, skills: S.statement }),

  // Food (book pages 50–54, 64)
  foodQ('rabbit', 'plants', { fact: 'f-plants', difficulty: 15, skills: S.classify }),
  foodQ('horse', 'plants', { fact: 'f-plants', difficulty: 18, skills: S.classify }),
  foodQ('camel', 'plants', { fact: 'f-plants', difficulty: 22, skills: S.classify }),
  foodQ('giraffe', 'plants', { fact: 'f-elephant', difficulty: 22, skills: S.classify }),
  foodQ('wolf', 'meat', { fact: 'f-meat', difficulty: 22, skills: S.classify }),
  foodQ('snake', 'meat', { fact: 'f-meat', difficulty: 32, skills: S.classify }),
  foodQ('hawk', 'meat', { fact: 'f-meat', difficulty: 36, skills: S.classify }),
  tf('food', 'elephant-plants', 'الفيل حيوان يتغذى على النباتات.', 'الفيل ياكل نباتات.', true, { fact: 'f-elephant', difficulty: 25, skills: S.statement }),
  tf('food', 'all-eat-meat', 'جميع الحيوانات حولنا تأكل اللحوم.', 'كل الحيوانات اللي حولنا تاكل لحوم.', false, { fact: 'f-different', difficulty: 30, skills: S.statement }),
  tf('food', 'food-differs', 'نوع غذاء الحيوانات مختلف.', 'الحيوانات أكلها مختلف.', true, { fact: 'f-different', difficulty: 20, skills: S.statement }),
  pick('food', 'which-eats-meat', 'أي حيوان يأكل اللحوم؟', 'أي حيوان ياكل لحوم؟', ['zebra', 'sheep', 'lion'], 'lion', { fact: 'f-lion', difficulty: 25, skills: S.apply }),
  pick('food', 'eats-other-animals', 'أي حيوان يأكل لحوم حيوانات أخرى؟', 'أي حيوان ياكل لحوم حيوانات ثانية؟', ['camel', 'deer', 'crocodile', 'sheep'], 'crocodile', { fact: 'f-crocodile', difficulty: 45, skills: S.apply }),
  {
    key: 'food:lion-cubs',
    topic: 'food',
    kind: 'pick',
    prompt: 'ماذا تطعم اللبؤة صغارها؟',
    say: 'اللبوة… شنو تعطي صغارها ياكلون؟',
    subject: ['🦁'],
    subjectLabel: 'لبؤة وصغارها',
    options: [
      { id: 'plants-only', art: ['svg:food-plants'], label: 'نباتات فقط', say: 'نباتات بس', clip: 'o/plants-only' },
      { id: 'meat-only', art: ['svg:food-meat'], label: 'لحوم فقط', say: 'لحوم بس', clip: 'o/meat-only' },
      { id: 'both', art: ['svg:food-plants', 'svg:food-meat'], label: 'نباتات ولحوم', say: 'نباتات ولحوم', clip: 'o/plants-and-meat' },
    ],
    answer: 'meat-only',
    fact: 'f-lion',
    difficulty: 52,
    skills: ['apply', 'reasoning'],
  },

  // Breathing (book pages 55–58, 64)
  breathQ('cat', 'lungs', { fact: 'b-lungs', difficulty: 15, skills: S.classify }),
  breathQ('fish', 'gills', { fact: 'b-gills', difficulty: 15, skills: S.classify }),
  breathQ('chicken', 'lungs', { fact: 'b-lungs', difficulty: 25, skills: S.classify }),
  breathQ('giraffe', 'lungs', { fact: 'b-lungs-more', difficulty: 22, skills: S.classify }),
  breathQ('shark', 'gills', { fact: 'b-gills', difficulty: 36, skills: S.classify }),
  breathQ('turtle', 'lungs', { fact: 'b-lungs', difficulty: 48, skills: S.classify }),
  pick('breathing', 'breathes-in-water', 'أي حيوان يتنفس الهواء في الماء؟', 'أي حيوان يتنفس داخل الماي؟', ['crocodile', 'chicken', 'colorfish', 'snake'], 'colorfish', { fact: 'b-gills', difficulty: 30, skills: S.apply }),
  pick('breathing', 'has-lungs', 'أي حيوان له رئتان؟', 'أي حيوان عنده رئتين؟', ['shark', 'octopus', 'rabbit', 'fish'], 'rabbit', { fact: 'b-lungs', difficulty: 42, skills: S.apply }),
  pick('breathing', 'odd-one-out', 'أي حيوان يتنفس بطريقة مختلفة؟', 'أي حيوان يتنفس بطريقة مختلفة عن الباقين؟', ['lizard', 'crab', 'tiger', 'owl'], 'crab', { fact: 'b-crab', difficulty: 62, skills: S.odd }),
  tf('breathing', 'lungs-air', 'تتنفس بعض الحيوانات الهواء الجوي بالرئتين.', 'بعض الحيوانات تتنفس الهوا بالرئتين.', true, { fact: 'b-lungs', difficulty: 30, skills: S.statement }),
  tf('breathing', 'fish-air-gills', 'تتنفس الأسماك الهواء الجوي بالخياشيم.', 'السمك يتنفس هوا الجو بالخياشيم.', false, { fact: 'b-gills', difficulty: 58, skills: S.statement }),
  tf('breathing', 'fish-needs-water', 'السمكة تحتاج إلى الماء لكي تعيش.', 'السمكة تحتاج الماي عشان تعيش.', true, { fact: 'b-fish-out', difficulty: 28, skills: S.statement }),

  // Reproduction (book pages 59–62, 64–65)
  birthQ('cat', 'birth', { fact: 'r-birth', difficulty: 15, skills: S.classify }),
  birthQ('chicken', 'egg', { fact: 'r-birds', difficulty: 15, skills: S.classify }),
  birthQ('sheep', 'birth', { fact: 'r-birth', difficulty: 20, skills: S.classify }),
  birthQ('sparrow', 'egg', { fact: 'r-birds', difficulty: 20, skills: S.classify }),
  birthQ('bear', 'birth', { fact: 'r-birth', difficulty: 25, skills: S.classify }),
  birthQ('turtle', 'egg', { fact: 'r-eggs', difficulty: 32, skills: S.classify }),
  birthQ('colorfish', 'egg', { fact: 'r-eggs', difficulty: 38, skills: S.classify }),
  birthQ('giraffe', 'birth', { fact: 'r-giraffe', difficulty: 30, skills: S.classify }),
  tf('reproduction', 'all-give-birth', 'جميع الحيوانات تتكاثر بالولادة.', 'كل الحيوانات تتكاثر بالولادة.', false, { fact: 'r-ways', difficulty: 35, skills: S.statement }),
  tf('reproduction', 'birds-lay-eggs', 'الطيور تتكاثر بالبيض.', 'الطيور تتكاثر بالبيض.', true, { fact: 'r-birds', difficulty: 25, skills: S.statement }),
  tf('reproduction', 'giraffe-plants-birth', 'الزرافة تأكل النباتات وتتكاثر بالولادة.', 'الزرافة تاكل نباتات وتتكاثر بالولادة.', true, { fact: 'r-giraffe', difficulty: 55, skills: S.statement }),
  pick('reproduction', 'nest-eggs', 'وجدنا بيضا في عش بجانب النافذة. من وضعه؟', 'لقينا بيض في عش جنب الدريشة… منو حطه؟', ['cat', 'pigeon', 'sheep', 'bear'], 'pigeon', { fact: 'r-nest', difficulty: 40, skills: S.apply }, ['🪺']),
  pick('reproduction', 'eggs-and-feathers', 'أي حيوان يتكاثر بالبيض ويغطي جسمه ريش؟', 'أي حيوان يتكاثر بالبيض، وجسمه مغطى بريش؟', ['snake', 'butterfly', 'turtle', 'duck'], 'duck', { fact: 'r-birds', difficulty: 60, skills: ['apply', 'multi_step'] }),
]

// ── Display text ───────────────────────────────────────────────────────────
// The screen never shows diacritics (family preference); this guards any that slip in.
export function bare(text: string): string {
  return text.replace(/[ً-ْٰ]/g, '')
}

export const FACTS: Fact[] = FACT_SOURCE.map((entry) => ({ ...entry, text: bare(entry.text) }))

export const TOPICS: Topic[] = TOPIC_SOURCE.map((topic) => ({ ...topic, title: bare(topic.title), short: bare(topic.short) }))

export const QUESTIONS: Question[] = QUESTION_SOURCE.map((question) => ({
  ...question,
  prompt: bare(question.prompt),
  subjectLabel: question.subjectLabel === undefined ? undefined : bare(question.subjectLabel),
  options: question.options.map((option) => ({ ...option, label: bare(option.label) })),
}))

/** A fact picture: a known thing shows its name under the picture. */
export function factArt(item: string): { art: string; label?: string } {
  const known = THINGS[item]
  return known ? { art: known.art, label: known.label } : { art: item }
}

// ── Narration ──────────────────────────────────────────────────────────────
// Every clip is generated once with ElevenLabs (Maryam Essa - Kuwaiti Calm & Warm,
// the voice approved for «بصمة وأثر») into public/audio. Text sent to the voice has
// no diacritics: they pull the voice away from Gulf pronunciation.
export const UI_CLIPS = {
  welcome: 'هلا والله يا بطلة العلوم! اختاري درس… ويلا نبدأ.',
  'praise-1': 'أحسنتي!',
  'praise-2': 'شطورة!',
  'praise-3': 'ممتاز يا بطلة!',
  'praise-4': 'برافو عليج!',
  'correct-is': 'الجواب الصح هو…',
  'done-great': 'واو! إنتي بطلة العلوم!',
  'done-good': 'أحسنتي! تدربي مرة ثانية… وبتصيرين أقوى.',
  'test-intro': 'هذا اختبار تجريبي… فيه أسئلة من كل الدروس. يلا نبدأ!',
  'learn-done': 'شطورة! خلصتي الدرس… يلا نتدرب.',
} as const

export type UiClip = keyof typeof UI_CLIPS

export const clip = {
  question: (key: string) => `q/${key.replace(':', '/')}`,
  fact: (id: string) => `f/${id}`,
  topic: (id: TopicId) => `t/${id}`,
  ui: (id: UiClip) => `ui/${id}`,
}

export interface AudioCue {
  id: string
  text: string
}

export function audioCues(): AudioCue[] {
  return [
    ...(Object.keys(UI_CLIPS) as UiClip[]).map((id) => ({ id: clip.ui(id), text: UI_CLIPS[id] })),
    ...TOPIC_SOURCE.map((topic) => ({ id: clip.topic(topic.id), text: topic.say })),
    ...FACT_SOURCE.map((entry) => ({ id: clip.fact(entry.id), text: entry.say })),
    ...QUESTION_SOURCE.map((question) => ({ id: clip.question(question.key), text: question.say })),
    ...optionCues(),
  ].map((cue) => ({ ...cue, text: bare(cue.text) }))
}

function optionCues(): AudioCue[] {
  const byClip = new Map<string, string>()
  for (const option of QUESTION_SOURCE.flatMap((question) => question.options)) {
    const known = byClip.get(option.clip)
    if (known !== undefined && known !== option.say) {
      throw new Error(`Option clip ${option.clip} is used for "${known}" and "${option.say}".`)
    }
    byClip.set(option.clip, option.say)
  }
  return [...byClip].map(([id, text]) => ({ id, text }))
}

/** Every clip a round needs, so it can be loaded before the first question. */
export function roundClips(questions: Question[]): string[] {
  return [
    ...questions.flatMap((question) => [clip.question(question.key), ...question.options.map((option) => option.clip), clip.fact(question.fact)]),
    clip.ui('correct-is'),
    clip.ui('praise-1'),
    clip.ui('praise-2'),
    clip.ui('praise-3'),
    clip.ui('praise-4'),
    clip.ui('done-great'),
    clip.ui('done-good'),
  ]
}
