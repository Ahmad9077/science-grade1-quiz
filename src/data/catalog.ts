// Content for «علوم» — the second Grade 1 science test (book part two, chapter three
// «المواطن الطبيعية»). The school's card names two lessons:
//   habitats — «أين تعيش الكائنات الحية؟» (book pages 12–18)
//   protect  — «كيف نحمي أماكن عيش الكائنات الحية؟» (book pages 19–25)
// and the chapter's end questions (pages 27–28) are shared between them.
//
// The questions copy the styles of the Ministry's question bank for this term (بنك الأسئلة،
// العلوم، الصف الأول، 2026-2027, pages 23–25) and of the book's own evaluations: ✓ in the box,
// ✓/✗ sentences, the numbers table, sorting animals by their home with numbers, «حوّط الكلمة»,
// circling in a picture, numbers on a picture, colouring by habitat, ✗ on harmful pictures.
// Each question shows the paper's own instruction line, so a first grader learns to recognise it.
// Pictures are the book's illustrations (public/pics/), cropped from the Ministry's copy, which
// carries no answers. Screen text has no diacritics (family preference).
//
// Narration: Maryam Essa (Kuwaiti), in Kuwaiti dialect. Every moment has several lines written
// for this quiz only (5 November 2026); a round deals them out of a shuffled deck, so nothing is
// said twice running (src/domain/variety.ts). Lines that both copies share never speak to a girl
// or a boy; the few that do are recorded twice (`ar/ui/girls/…`, `ar/ui/boys/…`).
// Question keys are permanent Hub ids: never rename or reuse one.
// This file is self-contained so Node scripts can import it directly.

// The same lessons are published twice: «علوم - بنات» speaks to a girl and
// «علوم - أولاد» to a boy. Each copy is its own Hub quiz with its own results.
export type Audience = 'girls' | 'boys'

export const AUDIENCES: Record<Audience, { quizId: string; title: string }> = {
  girls: { quizId: 'science-grade1', title: 'علوم - بنات' },
  boys: { quizId: 'science-grade1-boys', title: 'علوم - أولاد' },
}

export type TopicId = 'habitats' | 'protect'

/** How the child answers: one choice, circling pictures, colouring, numbers in rows, or a picture. */
export type QuestionKind = 'pick' | 'circle' | 'color' | 'rows' | 'scene'

/** The paper's question styles, used to lay the mock test out like the Ministry's model. */
export type Format = 'tick' | 'tf' | 'choose' | 'word' | 'sort' | 'table' | 'homes' | 'number' | 'scene' | 'color' | 'cross' | 'circle'

/**
 * What a tile shows:
 *   pic:<id>          one of the book's pictures
 *   pics:<id>+<id>    two pictures side by side (a group card)
 *   txt:<text>        a word or a short sentence
 *   tf:<yes|no>       the ✓ or ✗ mark
 */
export type ArtRef = string

export type Random = () => number

const DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
/** A number in the book's digits. */
export const A = (value: number) => String(value).replace(/\d/g, (d) => DIGITS[Number(d)]!)

// ── The book's pictures ───────────────────────────────────────────────────
/** Cropped from the book (scripts/crop-pictures.py); the name is what the picture shows. */
export const PICS = {
  // Lesson 1
  'line-octopus': 'أخطبوط',
  'line-fish': 'سمكة',
  'line-lizard': 'سحلية',
  'line-palm': 'نخلة',
  'line-camel': 'جمل',
  'line-coral': 'مرجان',
  desert: 'الصحراء',
  sea: 'البحر',
  forest: 'الغابة',
  'desert-life': 'الصحراء',
  'polar-life': 'المناطق الثلجية',
  savanna: 'السهول',
  reef: 'الشعاب المرجانية',
  fish: 'سمكة',
  squirrel: 'سنجاب',
  bird: 'عصفور',
  rabbit: 'أرنب',
  nest: 'عش',
  burrow: 'جحر',
  'coral-home': 'صخور في البحر',
  'tree-hole': 'فتحة في شجرة',
  'sea-rocks': 'صخور البحر',
  'rabbit-burrow': 'أرنب في جحره',
  'bird-nest': 'عصفور في عشه',
  'fennec-burrow': 'الحصني في جحره',
  'squirrel-tree': 'سنجاب في شجرة',
  'lost-home': 'حيوانات فقدت مأواها',
  'sand-burrow': 'جحر',
  'sea-mistake': 'تحت البحر',
  pine: 'شجرة صنوبر',
  seaweed: 'طحالب',
  tree: 'شجرة',
  cactus: 'صبار',
  dolphin: 'دلفين',
  zebra: 'حمار وحشي',
  whale: 'حوت',
  shark: 'سمك القرش',
  'harm-plant': 'نبات ذابل',
  'harm-fish': 'سمكة مريضة',
  'harm-river': 'نهر ملوث',
  'cough-small': 'إنسان يسعل',
  'bike-small': 'ركوب الدراجة الهوائية',
  'burning-small': 'حرق النفايات',
  'garbage-small': 'أكوام النفايات',
  'cutting-small': 'قطع الأشجار',
  'polar-scene': 'المناطق الثلجية',
  'harm-scene': 'مكان متضرر',
  'dead-fish': 'سمكة ميتة على الشاطئ',
  // Lesson 2
  'dirty-beach': 'شاطئ ملوث',
  'clean-beach': 'شاطئ نظيف',
  'smoke-land': 'دخان ونفايات',
  garden: 'حديقة جميلة',
  'fish-shore': 'سمكة ميتة',
  'water-trash': 'رمي القمامة في الماء',
  'factory-smoke': 'دخان المصانع',
  'tree-cutting': 'قطع الأشجار',
  'park-litter': 'رمي النفايات في الأماكن العامة',
  coughing: 'صعوبة التنفس',
  'oiled-bird': 'طائر مريض',
  'dead-trees': 'أشجار ميتة',
  'bin-food': 'نفايات الأطعمة',
  'bin-plastic': 'نفايات بلاستيكية',
  'bin-paper': 'نفايات ورقية',
  'boy-bin-art': 'رمي النفايات في السلة',
  'factory-art': 'دخان المصانع',
  'bike-art': 'ركوب الدراجة الهوائية',
  'cars-art': 'دخان السيارات',
  'boy-bin': 'رمي النفايات في المكان المخصص لها',
  'recycle-bins': 'فرز النفايات',
  cyclists: 'استخدام الدراجة الهوائية',
  'cloth-bag': 'كيس قماشي',
  farmer: 'زراعة النباتات',
  'dead-plants': 'نباتات متضررة',
  'turtle-plastic': 'سلاحف بين النفايات',
  'fruit-peel': 'قشور الفاكهة',
  'plastic-bottle': 'علبة بلاستيك',
  'burning-trash': 'حرق النفايات',
  'food-waste': 'بقايا الطعام',
  'plastic-waste': 'أشياء بلاستيكية',
  'paper-waste': 'أوراق',
  'litter-desert': 'رحلة في البر',
} as const
export type PicId = keyof typeof PICS

// ── Clip ids ──────────────────────────────────────────────────────────────
export const clip = {
  /** Maryam's spoken instruction for a question style: `ar/q/<format>-<n>`. */
  line: (format: Format, n = 0) => `ar/q/${format}-${n + 1}`,
  /** The question itself (or the ✓/✗ sentence). */
  prompt: (key: string) => `ar/p/${key.replace(':', '/')}`,
  /** A written choice, read while its tile lights up. */
  option: (id: string) => `ar/o/${id}`,
  /** A row of a numbers table, or a numbered sentence of a picture. */
  row: (id: string) => `ar/r/${id}`,
  /** The explanation after an answer. */
  fact: (id: FactId) => `ar/f/${id}`,
  /** A moment line both copies share. */
  ar: (group: ArGroup, n = 0) => `ar/ui/${group}-${n + 1}`,
  /** A line that speaks to the child, recorded for each copy. */
  you: (audience: Audience, group: YouGroup, n = 0) => `ar/ui/${audience}/${group}-${n + 1}`,
}

// ── Explanations ──────────────────────────────────────────────────────────
// `text` is the book's sentence, shown under the answer; `say` is how Maryam explains it.
export const FACTS = {
  // Lesson 1 · أين تعيش الكائنات الحية؟
  'places-differ': {
    text: 'تختلف الكائنات الحية في الأماكن التي تعيش فيها.',
    say: 'الكائنات الحية… مو كلها تعيش بنفس المكان. كل واحد له مكان يناسبه.',
  },
  'land-water': {
    text: 'بعض الكائنات الحية تعيش على اليابسة، وبعضها في الماء.',
    say: 'في كائنات تعيش على اليابسة… يعني على الأرض. وفي كائنات تعيش في الماي.',
  },
  'land-places': {
    text: 'من أماكن عيش الكائنات الحية على اليابسة: الغابات والصحراء والمناطق الثلجية والسهول.',
    say: 'على اليابسة… في الغابة، والصحرا، والثلج، والسهول… كلها أماكن تعيش فيها الكائنات الحية.',
  },
  'water-places': {
    text: 'من أماكن عيش الكائنات الحية في الماء: البحار والشعاب المرجانية.',
    say: 'وفي الماي… البحر، والشعاب المرجانية… مليانة كائنات حية.',
  },
  'on-land': {
    text: 'الجمل والسحلية والنخلة تعيش على اليابسة.',
    say: 'الجمل، والسحلية، والنخلة… كلهم يعيشون على اليابسة، في البر.',
  },
  'in-water': {
    text: 'الأخطبوط والسمكة والمرجان تعيش في الماء.',
    say: 'الأخطبوط، والسمكة، والمرجان… بيتهم الماي، ما يعيشون برا البحر.',
  },
  'sea-animals': {
    text: 'الحوت والدلفين وسمك القرش تعيش في الماء، والحمار الوحشي يعيش على اليابسة.',
    say: 'الحوت، والدلفين، والقرش… يسبحون في البحر. أما الحمار الوحشي، فيمشي على اليابسة.',
  },
  'water-plant': {
    text: 'الطحالب نبات يعيش في الماء، والصبار والأشجار تعيش على اليابسة.',
    say: 'الطحالب نبات… ينبت في الماي. أما الصبار والشجر، فينبتون على اليابسة.',
  },
  'shelter-why': {
    text: 'المأوى يساعد الحيوانات على البقاء وحماية نفسها من الخطر.',
    say: 'المأوى هو بيت الحيوان… يحميه من الخطر، ويساعده يعيش ويبقى.',
  },
  'shelter-differs': {
    text: 'يختلف نوع المأوى من حيوان لآخر.',
    say: 'مو كل الحيوانات لها نفس البيت… العصفور له عش، والأرنب له جحر، والسمكة لها صخور البحر.',
  },
  nest: {
    text: 'عش الشجرة هو مأوى لأنواع كثيرة من الطيور.',
    say: 'العش… بيت الطيور. تبنيه فوق الشجرة، وتحط فيه بيضها.',
  },
  burrow: {
    text: 'الجحور هي مأوى للأرانب وبعض الحيوانات الصحراوية مثل الحصني.',
    say: 'الجحر حفرة في الأرض… يسكن فيها الأرنب، والحصني بعد.',
  },
  'tree-home': {
    text: 'السناجب تتخذ من الأشجار مأوى لها.',
    say: 'السنجاب… يسكن في الشجرة، داخل فتحة في جذعها.',
  },
  'sea-rocks': {
    text: 'الكائنات البحرية تستخدم الصخور في البحر كمأوى لها.',
    say: 'والسمك… يتخبى بين الصخور والمرجان اللي في البحر. هذا بيته.',
  },
  'lost-home': {
    text: 'إذا فقد الحيوان مأواه يصعب عليه الحصول على الحماية.',
    say: 'إذا الحيوان خسر بيته… ما يلقى مكان يحميه من المطر والبرد والخطر.',
  },
  'sea-mistake': {
    text: 'الأرنب والعصفور لا يعيشان في البحر.',
    say: 'الأرنب والعصفور… مكانهم مو في البحر! الأرنب على اليابسة، والعصفور فوق الشجر.',
  },
  'polar-water': {
    text: 'الحوت والسمكة يعيشان في الماء.',
    say: 'في الصورة… الحوت والسمكة بس يعيشون في الماي. الباقين يمشون على الثلج.',
  },
  // Lesson 2 · كيف نحمي أماكن عيش الكائنات الحية؟
  'harm-behaviors': {
    text: 'بعض السلوكيات تضر أماكن عيش الكائنات الحية، مثل: رمي النفايات، ودخان المصانع، وقطع الأشجار، وعوادم السيارات.',
    say: 'في أشياء تضر الأماكن اللي تعيش فيها الكائنات… مثل رمي الزبالة، ودخان المصانع، وقطع الشجر، ودخان السيارات.',
  },
  'waste-harm': {
    text: 'النفايات في أماكن عيش الكائنات الحية تسبب لها الضرر.',
    say: 'الزبالة في البحر وفي البر… تضر الكائنات الحية، وتخرب بيوتها.',
  },
  'smoke-sick': {
    text: 'دخان المصانع يسبب المرض للإنسان.',
    say: 'دخان المصانع يوصخ الهوا… والناس يمرضون، ويكحون، ويصعب عليهم التنفس.',
  },
  'harm-animals': {
    text: 'السلوكيات الضارة تسبب مرض الحيوانات وموتها.',
    say: 'لما نوصخ البحر والبر… الحيوانات تمرض، وممكن تموت.',
  },
  'plants-harmed': {
    text: 'إذا تضررت النباتات تمرض أو تموت الكائنات الحية الأخرى.',
    say: 'إذا النبات تضرر… الكائنات الثانية بعد تمرض أو تموت، لأنها تحتاجه.',
  },
  'put-in-bin': {
    text: 'نرمي النفايات في المكان المخصص لها.',
    say: 'الزبالة مكانها السلة… مو الأرض، ولا البحر.',
  },
  bike: {
    text: 'نستخدم الدراجة الهوائية بدلا من السيارات.',
    say: 'السيكل ما يطلع دخان… فهو أحسن للهوا من السيارة.',
  },
  'plant-trees': {
    text: 'نزرع النباتات ولا نقطع الأشجار.',
    say: 'نزرع الشجر… وما نقطعه. الشجر ينظف الهوا، ويصير بيت للطيور.',
  },
  'cloth-bag': {
    text: 'نستخدم الأكياس القماشية بدلا من البلاستيكية.',
    say: 'كيس القماش… نستخدمه مرة ومرتين وثلاث، بدل كيس البلاستيك.',
  },
  recycle: {
    text: 'إعادة تدوير النفايات تساعدنا، وتحمي أرضنا.',
    say: 'إعادة التدوير… يعني نسوي من النفايات أشياء جديدة، وتقل الزبالة في أرضنا.',
  },
  'sort-paper': {
    text: 'الأوراق نضعها في صندوق النفايات الورقية.',
    say: 'الورق… مكانه صندوق النفايات الورقية.',
  },
  'sort-plastic': {
    text: 'الأشياء البلاستيكية نضعها في صندوق النفايات البلاستيكية.',
    say: 'البلاستيك… مكانه صندوق النفايات البلاستيكية.',
  },
  'sort-food': {
    text: 'بقايا الطعام نضعها في صندوق نفايات الأطعمة.',
    say: 'بقايا الأكل، والقشور… مكانها صندوق نفايات الأطعمة.',
  },
  burning: {
    text: 'حرق النفايات يضر الهواء والتربة.',
    say: 'لما نحرق الزبالة… الدخان يوصخ الهوا، والرماد يضر التربة.',
  },
  'dead-fish': {
    text: 'رمي النفايات في البحر يسبب موت الأسماك.',
    say: 'السمكة ماتت… لأن الناس قطوا الزبالة في البحر.',
  },
  'harm-places': {
    text: 'أكياس النفايات تضر التربة، والدخان يضر الهواء، والنفايات في الماء تضر الماء.',
    say: 'أكياس الزبالة على الأرض تضر التربة… والدخان فوق يضر الهوا… والزبالة في الماي تضر الماي.',
  },
  'clean-beach': {
    text: 'الشاطئ النظيف نلعب ونسبح فيه بأمان.',
    say: 'الشاطي النظيف… نلعب فيه ونسبح بأمان. أما الوصخ، فيضرنا ويضر السمك.',
  },
  'litter-harm': {
    text: 'العلب والأكياس والدخان تسبب الضرر للمكان.',
    say: 'القواطي، والأكياس، والدخان… كلها تضر المكان اللي نلعب فيه.',
  },
  'turtle-plastic': {
    text: 'بعض الحيوانات تظن أن النفايات طعام فتأكلها، فتمرض.',
    say: 'السلحفاة أحيانا تحسب كيس البلاستيك أكل… وتاكله وتمرض.',
  },
} as const satisfies Record<string, { text: string; say: string }>

export type FactId = keyof typeof FACTS

// ── Topics ────────────────────────────────────────────────────────────────
export interface Topic {
  id: TopicId
  title: string
  /** The lesson's place in the chapter, shown on its card like the book's page corner. */
  field: string
  pages: string
  art: ArtRef[]
}

export const TOPICS: Topic[] = [
  { id: 'habitats', title: 'أين تعيش الكائنات الحية؟', field: 'الدرس الأول', pages: 'صفحة ١٢ – ١٨', art: ['pic:fish', 'pic:rabbit'] },
  { id: 'protect', title: 'كيف نحمي أماكن عيش الكائنات الحية؟', field: 'الدرس الثاني', pages: 'صفحة ١٩ – ٢٥', art: ['pic:boy-bin-art', 'pic:bike-art'] },
]

// ── The paper's instruction lines ─────────────────────────────────────────
// As printed in the Ministry's question bank and the book's evaluations.
export const INSTRUCTIONS: Record<Format, string> = {
  tick: 'اختر الإجابة الصحيحة علميا بوضع علامة (✓) في المربع المقابل لها:',
  tf: 'ضع علامة (✓) للعبارة الصحيحة، وعلامة (✗) للعبارة غير الصحيحة:',
  choose: 'أجب عن المطلوب فيما يلي:',
  word: 'حوط الكلمة التي تعبر عن استنتاجك:',
  sort: 'افرز النفايات في صناديق الفرز حسب ما هو مكتوب على كل صندوق:',
  table: 'اختر الصورة من المجموعة (ب) واكتب رقمها أمام ما يناسبها من العبارات في المجموعة (أ):',
  homes: 'صنف الحيوانات التالية بوضع الرقم المناسب للمأوى الذي تعيش فيه:',
  number: 'ضع الرقم المناسب على الصورة:',
  scene: 'اكتشف الخطأ في الصورة التالية وضع حوله (○):',
  color: 'لون الكائنات الحية التي تعيش على اليابسة باللون البرتقالي، والكائنات الحية التي تعيش في الماء باللون الأزرق:',
  cross: 'ضع (✗) على الصور التي تمثل الأضرار التي تحدث للكائنات الحية بسبب السلوكيات الخاطئة:',
  circle: 'حوط الصور التي تبين بعض طرق الحفاظ على أماكن عيش الكائنات الحية:',
}

/**
 * How Maryam says each instruction: several ways for every style, so the child hears it afresh.
 * Each is an image, a tip, a challenge or a question, and none speaks to a girl or a boy.
 */
export const ASK_LINES = {
  tick: [
    'نختار الجواب الصح… ونحط علامة صح بالمربع اللي جنبه.',
    'أي وحدة الصح؟ مربعها ياخذ علامة صح.',
    'نطالع الخيارات كلها زين… وبعدين نختار.',
  ],
  tf: [
    'نسمع الجملة… إذا صح نحط صح، وإذا غلط نحط خطأ.',
    'هالكلام صح ولا غلط؟ نفكر شوي قبل لا نجاوب.',
    'جملة وحدة… ونحكم عليها: صح ولا خطأ؟',
  ],
  choose: [
    'نطالع الصورة… ونختار الجواب المناسب.',
    'الصورة فيها سالفة… شنو الجواب الصح؟',
    'نسمع السؤال زين… وبعدين نختار من الدواير.',
  ],
  word: [
    'بين القوسين كلمتين… نحوط الكلمة الصح.',
    'أي كلمة تكمل الجملة صح؟ نحوطها.',
    'كلمة وحدة بس تناسب… خلنا نلقاها.',
  ],
  sort: [
    'كل نوع نفايات له صندوق… وين نحط هذا؟',
    'نطالع اللي مكتوب على الصناديق… ونختار الصندوق الصح.',
    'نفرز… الورق بصندوق، والبلاستيك بصندوق، والأكل بصندوق.',
  ],
  table: [
    'كل جملة لها صورة… ندور رقمها ونكتبه جدامها.',
    'نسمع الجملة اللي بالجدول… ونختار رقم الصورة اللي تناسبها.',
    'الجدول يبي أرقام… كل جملة ورقم صورتها.',
  ],
  homes: [
    'كل حيوان له بيت… نحط رقم الحيوان على مأواه.',
    'وين يسكن كل حيوان؟ نكتب رقمه تحت بيته.',
    'نرجع كل حيوان لمأواه… بالأرقام.',
  ],
  number: [
    'في الصورة دواير فاضية… نحط في كل وحدة رقمها.',
    'نسمع الجملة… ونحط رقمها في مكانه بالصورة.',
    'ثلاث أرقام… وثلاث أماكن في الصورة.',
  ],
  scene: [
    'نطالع الصورة كلها زين… ونحوط فيها.',
    'عيون مفتحة! ندور في الصورة ونحوط.',
    'الصورة كبيرة… وكل ما نلقى وحدة نحوطها.',
  ],
  color: [
    'وقت التلوين! اللي يعيش على اليابسة برتقالي… واللي يعيش في الماي أزرق.',
    'البرتقالي لليابسة… والأزرق للماي. يلا نلون!',
    'نلون كل كائن حي حسب مكانه… البرتقالي لليابسة، والأزرق للماي.',
  ],
  cross: [
    'الصور اللي فيها ضرر… نحط عليها علامة خطأ.',
    'وين الضرر؟ صورته تاخذ علامة خطأ.',
    'نطالع كل صورة… إذا فيها ضرر نحط عليها خطأ.',
  ],
  circle: [
    'يمكن أكثر من صورة صح… نحوطهم كلهم.',
    'ندور على كل الصور اللي يبيها السؤال… ونحوطها.',
    'نحوط الصور الصح… وبعدين نضغط تحقق.',
  ],
} as const satisfies Record<Format, readonly string[]>

/** The text shown for a spoken line: the pauses («…») become commas. */
export function shown(text: string): string {
  return text.replace(/\s*…\s*/g, '، ').replace(/[،\s]+$/, '').trim()
}

// ── Questions ─────────────────────────────────────────────────────────────
export interface Option {
  id: string
  art: ArtRef
  label: string
  /** Printed under a picture, as the paper names some of its pictures. */
  caption?: string
  /** Read while the tile lights up (written choices only). */
  clip?: string
}

/** One line of a numbers table or a sorting board: it takes the number of `answer`. */
export interface Row {
  id: string
  /** A sentence (group (أ) of a table, a numbered sentence of a picture)… */
  text?: string
  /** …or a picture (a home waiting for its animal's number). */
  art?: ArtRef
  clip?: string
  answer: string
}

/** A place in a picture that can be circled or numbered: a box in percent of the picture. */
export interface Spot {
  id: string
  label: string
  box: [number, number, number, number]
}

export interface Scene {
  pic: PicId
  spots: Spot[]
  /** The spots to circle. */
  good: string[]
  /** Enough to circle when the picture holds many (any three of its harms); otherwise all of them. */
  need?: number
}

/** A circling in a picture is right when nothing wrong is circled and enough right things are. */
export function sceneCorrect(scene: Scene, picked: readonly string[]): boolean {
  const good = picked.filter((id) => scene.good.includes(id))
  return good.length === picked.length && good.length >= (scene.need ?? scene.good.length)
}

/** A question about one picture, drawn afresh every round. */
export interface Subject {
  picture: ArtRef
  answer: string
  fact: FactId
}

/** New pictures for every round: one right answer from `right`, and `count` wrong ones. */
export interface Draw {
  right: Option[]
  wrong: Option[]
  count: number
  fact?: (right: Option) => FactId
}

/** New pictures for every round: `goodCount` from `good` and `badCount` from `bad`. */
export interface PictureDraw {
  good: Option[]
  bad: Option[]
  goodCount: number
  badCount: number
}

/** New rows for every round: `rows` pairs, and keys for them plus `extra` that fit none. */
export interface RowDraw {
  pairs: { row: Row; key: Option }[]
  rows: number
  extra: Option[]
  extraCount: number
}

export interface Question {
  key: string
  topic: TopicId
  kind: QuestionKind
  format: Format
  /** The paper's instruction line. */
  instruction: string
  /** The question itself, when there is more than the instruction. */
  prompt: string
  /** A picture beside the question («الحيوانات التي يمكن أن تعيش في هذا المأوى»). */
  picture?: ArtRef
  /** A small picture inside a ✓/✗ sentence, as the Ministry's bank draws one. */
  inline?: ArtRef
  /** «حوط الكلمة»: the sentence around the two words in brackets. */
  word?: { before: string; after: string }
  /** Spoken: Maryam's instruction line, then the question. */
  ask: string[]
  /** The instruction line said this time, shown under the paper's line. */
  help: string
  /** pick: the choices · circle and color: the pictures · rows: the numbered keys. */
  options: Option[]
  /** «صح» before «خطأ», the bins in the paper's order. */
  fixedOrder?: boolean
  /** pick: the right option. */
  answer: string
  /** circle: the pictures to mark · color: the pictures that live on land. */
  good: string[]
  /** circle: a pen ring, or the paper's ✗. */
  marks?: 'ring' | 'cross'
  rows: Row[]
  scene?: Scene
  fact: FactId
  draw?: Draw
  pictureDraw?: PictureDraw
  rowDraw?: RowDraw
  subjects?: Subject[]
  difficulty: number
  skills: string[]
}

const d = (difficulty: number) => difficulty

function base(topic: TopicId, slug: string, kind: QuestionKind, format: Format, prompt: string, say: string | null, fact: FactId, difficulty: number, skill: string) {
  const key = `${topic}:${format}-${slug}`
  const ask = [clip.line(format), ...(say ? [clip.prompt(key)] : [])]
  return {
    key,
    topic,
    kind,
    format,
    instruction: INSTRUCTIONS[format],
    prompt,
    ask,
    help: shown(ASK_LINES[format][0]),
    options: [] as Option[],
    answer: '',
    good: [] as string[],
    rows: [] as Row[],
    fact,
    difficulty,
    skills: [topic, `format_${format}`, skill],
  }
}

const YES: Option = { id: 'yes', art: 'tf:yes', label: 'صح' }
const NO: Option = { id: 'no', art: 'tf:no', label: 'خطأ' }

const pic = (id: PicId, caption = false): Option => ({ id, art: `pic:${id}`, label: PICS[id], ...(caption ? { caption: PICS[id] } : {}) })
const pics = (ids: PicId[], caption = false) => ids.map((id) => pic(id, caption))

/** A written choice with its spoken form (Kuwaiti, when the book's word is said differently). */
type Said = [text: string, say: string] | string
const textOf = (item: Said) => (typeof item === 'string' ? item : item[0])
const sayOf = (item: Said) => (typeof item === 'string' ? item : item[1])

/** Every spoken text, by clip id: questions, choices and rows add theirs here as they are built. */
const SPOKEN = new Map<string, string>()

function speak(id: string, text: string): string {
  const known = SPOKEN.get(id)
  if (known !== undefined && known !== text) throw new Error(`Clip ${id} is used for "${known}" and "${text}".`)
  SPOKEN.set(id, text)
  return id
}

function said(question: ReturnType<typeof base>, say: string | null) {
  if (say) speak(clip.prompt(question.key), say)
  return question
}

function written(prefix: string, items: Said[]): Option[] {
  return items.map((item, n) => {
    const id = `${prefix}-${n + 1}`
    return { id: `o${n + 1}`, art: `txt:${textOf(item)}`, label: textOf(item), clip: speak(clip.option(id), sayOf(item)) }
  })
}

/** «اختر… بوضع علامة (✓) في المربع»: one right picture among others, drawn afresh every round. */
function tick(topic: TopicId, slug: string, prompt: string, say: string, right: PicId[], wrong: PicId[], count: number, fact: FactId | ((right: Option) => FactId), difficulty: number, skill: string): Question {
  const draw: Draw = { right: pics(right), wrong: pics(wrong), count, ...(typeof fact === 'function' ? { fact } : {}) }
  const first = typeof fact === 'function' ? fact(draw.right[0]!) : fact
  return withDraw(said(base(topic, slug, 'pick', 'tick', prompt, say, first, difficulty, skill), say), draw)
}

/** «في المجموعة رقم»: cards of two pictures; the first card is right. */
function groups(topic: TopicId, slug: string, prompt: string, say: string, right: [PicId, PicId], wrong: [PicId, PicId][], fact: FactId, difficulty: number, skill: string): Question {
  const question = said(base(topic, slug, 'pick', 'tick', prompt, say, fact, difficulty, skill), say)
  const options = [right, ...wrong].map(([a, b], n): Option => ({ id: `g${n + 1}`, art: `pics:${a}+${b}`, label: `${PICS[a]} و${PICS[b]}` }))
  return { ...question, options, answer: options[0]!.id }
}

/** One question asked about a picture that changes every round; the choices stay. */
function about(topic: TopicId, slug: string, format: Format, prompt: string, say: string, options: Option[], subjects: Subject[], difficulty: number, skill: string, fixedOrder = false): Question {
  const first = subjects[0]!
  const question = said(base(topic, slug, 'pick', format, prompt, say, first.fact, difficulty, skill), say)
  return { ...question, picture: first.picture, options, answer: first.answer, subjects, ...(fixedOrder ? { fixedOrder } : {}) }
}

/** «ضع علامة (✓) للعبارة الصحيحة، وعلامة (✗) للعبارة غير الصحيحة». */
function tf(topic: TopicId, slug: string, sentence: string, say: string, truth: boolean, fact: FactId, difficulty: number, inline?: PicId): Question {
  return {
    ...said(base(topic, slug, 'pick', 'tf', sentence, say, fact, difficulty, 'statement'), say),
    ...(inline ? { inline: `pic:${inline}` } : {}),
    options: [YES, NO],
    fixedOrder: true,
    answer: truth ? 'yes' : 'no',
  }
}

/** «أجب عن المطلوب»: a picture and written choices in circles; the first choice is right. */
function choose(topic: TopicId, slug: string, prompt: string, say: string, picture: PicId, right: Said, wrong: Said[], fact: FactId, difficulty: number, skill: string): Question {
  const question = said(base(topic, slug, 'pick', 'choose', prompt, say, fact, difficulty, skill), say)
  const options = written(`${topic}-${slug}`, [right, ...wrong])
  return { ...question, picture: `pic:${picture}`, options, answer: options[0]!.id }
}

/** «حوط الكلمة التي تعبر عن استنتاجك»: the sentence is said with both words. */
function word(topic: TopicId, slug: string, before: string, after: string, right: Said, wrong: Said, say: string, fact: FactId, difficulty: number, skill: string, rightFirst = true): Question {
  const question = said(base(topic, slug, 'pick', 'word', '', say, fact, difficulty, skill), say)
  const pair = rightFirst ? [right, wrong] : [wrong, right]
  const options = pair.map((item, n) => ({ id: `o${n + 1}`, art: `txt:${textOf(item)}`, label: textOf(item) }))
  return { ...question, word: { before, after }, options, fixedOrder: true, answer: options[rightFirst ? 0 : 1]!.id }
}

/** «ضع (✗) على الصور…» or «حوط الصور…»: every right picture is marked, and nothing else. */
function marks(topic: TopicId, slug: string, format: 'cross' | 'circle', prompt: string, say: string | null, good: PicId[], bad: PicId[], goodCount: number, badCount: number, fact: FactId, difficulty: number, skill: string, instruction?: string): Question {
  const pictureDraw: PictureDraw = { good: pics(good), bad: pics(bad), goodCount, badCount }
  const question = said(base(topic, slug, 'circle', format, prompt, say, fact, difficulty, skill), say)
  return withPictures({ ...question, ...(instruction ? { instruction } : {}), marks: format === 'cross' ? 'cross' : 'ring' }, pictureDraw)
}

/** «لون…»: each creature takes orange (land) or blue (water). */
function color(topic: TopicId, slug: string, land: PicId[], water: PicId[], fact: FactId, difficulty: number): Question {
  const pictureDraw: PictureDraw = { good: pics(land), bad: pics(water), goodCount: land.length, badCount: water.length }
  return withPictures(base(topic, slug, 'color', 'color', '', null, fact, difficulty, 'classify_habitat'), pictureDraw)
}

/** The Ministry's table: sentences in group (أ), numbered pictures in group (ب). */
function table(topic: TopicId, slug: string, pairs: [sentence: Said, answer: PicId][], extra: PicId[], rows: number, fact: FactId, difficulty: number, skill: string): Question {
  const rowDraw: RowDraw = {
    pairs: pairs.map(([sentence, answer], n) => {
      const id = `${topic}-${slug}-${n + 1}`
      return { row: { id: `r${n + 1}`, text: textOf(sentence), clip: speak(clip.row(id), sayOf(sentence)), answer }, key: pic(answer) }
    }),
    rows,
    extra: pics(extra),
    extraCount: 1,
  }
  return withRows(base(topic, slug, 'rows', 'table', '', null, fact, difficulty, skill), rowDraw)
}

/** «صنف الحيوانات بوضع الرقم المناسب للمأوى»: numbered animals above, their homes below. */
function homes(topic: TopicId, slug: string, pairs: [animal: PicId, home: PicId][], rows: number, fact: FactId, difficulty: number): Question {
  const rowDraw: RowDraw = {
    pairs: pairs.map(([animal, home]) => ({ row: { id: home, art: `pic:${home}`, answer: animal }, key: pic(animal) })),
    rows,
    extra: [],
    extraCount: 0,
  }
  return withRows(base(topic, slug, 'rows', 'homes', '', null, fact, difficulty, 'shelter_classify'), rowDraw)
}

/** A big picture to circle in: the spots in `good` are circled, and nothing else. */
function sceneQ(topic: TopicId, slug: string, prompt: string, say: string, scene: Scene, fact: FactId, difficulty: number, skill: string, instruction?: string): Question {
  const question = said(base(topic, slug, 'scene', 'scene', prompt, say, fact, difficulty, skill), say)
  return { ...question, ...(instruction ? { instruction } : {}), scene, good: scene.good }
}

/** «ضع الرقم المناسب على الصورة»: numbered sentences, each placed on its spot. */
function numberQ(topic: TopicId, slug: string, scene: Scene, rows: [sentence: Said, spot: string][], fact: FactId, difficulty: number): Question {
  const question = base(topic, slug, 'scene', 'number', '', null, fact, difficulty, 'harm_places')
  return {
    ...question,
    scene,
    rows: rows.map(([sentence, spot], n) => ({ id: `r${n + 1}`, text: textOf(sentence), clip: speak(clip.row(`${topic}-${slug}-${n + 1}`), sayOf(sentence)), answer: spot })),
  }
}

function withDraw(question: ReturnType<typeof base>, draw: Draw): Question {
  const right = draw.right[0]!
  return { ...question, options: [right, ...draw.wrong.slice(0, draw.count)], answer: right.id, draw }
}

function withPictures(question: ReturnType<typeof base> & { marks?: 'ring' | 'cross'; instruction?: string }, pictureDraw: PictureDraw): Question {
  const good = pictureDraw.good.slice(0, pictureDraw.goodCount)
  const bad = pictureDraw.bad.slice(0, pictureDraw.badCount)
  return { ...question, options: [...good, ...bad], good: good.map((option) => option.id), pictureDraw }
}

function withRows(question: ReturnType<typeof base>, rowDraw: RowDraw): Question {
  const chosen = rowDraw.pairs.slice(0, rowDraw.rows)
  return { ...question, rows: chosen.map((pair) => pair.row), options: [...chosen.map((pair) => pair.key), ...spareKeys(rowDraw, chosen).slice(0, rowDraw.extraCount)], rowDraw }
}

/** Pictures that answer none of the chosen rows: the draw's extras, then the other pairs' keys. */
function spareKeys(rowDraw: RowDraw, chosen: RowDraw['pairs']): Option[] {
  const used = new Set(chosen.map((pair) => pair.key.id))
  return [...rowDraw.extra, ...rowDraw.pairs.map((pair) => pair.key).filter((key) => !used.has(key.id))]
}

// ── The pictures to draw from ─────────────────────────────────────────────
const IN_WATER: PicId[] = ['fish', 'whale', 'dolphin', 'shark']
const ON_LAND: PicId[] = ['zebra', 'rabbit', 'squirrel', 'bird']
const LAND_PLANTS: PicId[] = ['cactus', 'tree', 'pine']
const PROTECTING: PicId[] = ['bike-art', 'bike-small', 'boy-bin-art', 'farmer', 'cloth-bag', 'cyclists', 'boy-bin', 'recycle-bins']
const HARMING: PicId[] = ['factory-art', 'cars-art', 'burning-small', 'cutting-small', 'garbage-small', 'factory-smoke', 'tree-cutting', 'park-litter', 'water-trash']
const HARMED: PicId[] = ['smoke-land', 'fish-shore', 'oiled-bird', 'dead-trees', 'dead-plants', 'turtle-plastic']
const UNHARMED: PicId[] = ['garden', 'clean-beach']

/** Where each picture lives, for «أين يعيش هذا الكائن الحي؟». */
const WHERE: [PicId, 'desert' | 'sea'][] = [
  ['line-camel', 'desert'],
  ['line-lizard', 'desert'],
  ['line-palm', 'desert'],
  ['line-octopus', 'sea'],
  ['line-fish', 'sea'],
  ['line-coral', 'sea'],
]

/** Each animal and its home (book page 15). */
const HOMES: [animal: PicId, home: PicId, fact: FactId][] = [
  ['bird', 'nest', 'nest'],
  ['rabbit', 'burrow', 'burrow'],
  ['fish', 'coral-home', 'sea-rocks'],
  ['squirrel', 'tree-hole', 'tree-home'],
]

const HARM_SHOWN: [PicId, number, FactId][] = [
  ['tree-cutting', 1, 'plant-trees'],
  ['cutting-small', 1, 'plant-trees'],
  ['factory-smoke', 0, 'smoke-sick'],
  ['factory-art', 0, 'smoke-sick'],
  ['park-litter', 3, 'waste-harm'],
  ['water-trash', 3, 'waste-harm'],
  ['garbage-small', 3, 'waste-harm'],
]

const WASTE: [PicId, 'bin-paper' | 'bin-plastic' | 'bin-food', FactId][] = [
  ['paper-waste', 'bin-paper', 'sort-paper'],
  ['plastic-waste', 'bin-plastic', 'sort-plastic'],
  ['plastic-bottle', 'bin-plastic', 'sort-plastic'],
  ['food-waste', 'bin-food', 'sort-food'],
  ['fruit-peel', 'bin-food', 'sort-food'],
]

// ── The pictures to circle in (spots in percent of the picture) ──────────
const SEA_MISTAKE: Scene = {
  pic: 'sea-mistake',
  spots: [
    { id: 'rabbit', label: 'أرنب', box: [33, 44, 51, 85] },
    { id: 'bird', label: 'عصفور', box: [49, 30, 65, 53] },
    { id: 'shark', label: 'سمك القرش', box: [1, 11, 36, 41] },
    { id: 'jellyfish', label: 'قنديل البحر', box: [75, 11, 87, 34] },
    { id: 'stripes', label: 'سمكة مخططة', box: [72, 43, 90, 57] },
    { id: 'clown', label: 'سمكة صغيرة', box: [22, 57, 34, 70] },
    { id: 'crab', label: 'سلطعون', box: [60, 67, 77, 88] },
    { id: 'octopus', label: 'أخطبوط', box: [78, 57, 97, 92] },
  ],
  good: ['rabbit', 'bird'],
}

const POLAR_WATER: Scene = {
  pic: 'polar-scene',
  spots: [
    { id: 'orca', label: 'حوت', box: [0, 35, 30, 56] },
    { id: 'fish', label: 'سمكة', box: [34, 89, 60, 100] },
    { id: 'bear', label: 'دب قطبي', box: [45, 10, 72, 40] },
    { id: 'deer', label: 'غزال', box: [82, 13, 100, 59] },
    { id: 'rabbit', label: 'أرنب', box: [9, 61, 32, 86] },
    { id: 'wolf', label: 'ذئب', box: [58, 55, 96, 90] },
  ],
  good: ['orca', 'fish'],
}

const LITTER_DESERT: Scene = {
  pic: 'litter-desert',
  // The things that harm come last, so they sit above the children where the two meet.
  spots: [
    { id: 'tent', label: 'خيمة', box: [2, 24, 34, 62] },
    { id: 'boy-red', label: 'ولد يلعب', box: [25, 20, 47, 80] },
    { id: 'boy-yellow', label: 'ولد يلعب', box: [60, 30, 82, 80] },
    { id: 'ball', label: 'كرة', box: [47, 74, 58, 93] },
    { id: 'smoke', label: 'دخان المصانع', box: [76, 14, 99, 48] },
    { id: 'smoke-left', label: 'دخان', box: [0, 6, 24, 32] },
    { id: 'bottle-left', label: 'علبة بلاستيك', box: [6, 70, 22, 86] },
    { id: 'bag-black', label: 'كيس أسود', box: [12, 88, 25, 100] },
    { id: 'can', label: 'علبة', box: [28, 85, 40, 100] },
    { id: 'bag', label: 'كيس', box: [70, 82, 84, 96] },
    { id: 'bottle-right', label: 'علبة زجاج', box: [84, 85, 100, 100] },
  ],
  good: ['smoke', 'smoke-left', 'bottle-left', 'bag-black', 'can', 'bag', 'bottle-right'],
  need: 3,
}

const HARM_SCENE: Scene = {
  pic: 'harm-scene',
  spots: [
    { id: 'air', label: 'الدائرة فوق', box: [57, 1, 73, 19] },
    { id: 'soil', label: 'الدائرة في الوسط', box: [72, 42, 89, 61] },
    { id: 'water', label: 'الدائرة تحت', box: [29, 74, 46, 92] },
  ],
  good: [],
}

export const QUESTIONS: Question[] = [
  // 1. أين تعيش الكائنات الحية؟ ─────────────────────────────────────────────
  tick('habitats', 'lives-in-water', 'كائن حي يعيش في الماء:', 'كائن حي يعيش في الماي… أي واحد؟', IN_WATER, [...ON_LAND, ...LAND_PLANTS], 3, 'sea-animals', d(15), 'water_animals'),
  tick('habitats', 'lives-on-land', 'حيوان يعيش على اليابسة:', 'حيوان يعيش على اليابسة… منو هو؟', ['zebra', 'rabbit', 'squirrel'], IN_WATER, 3, 'sea-animals', d(15), 'land_animals'),
  tick('habitats', 'land-place', 'مكان تعيش فيه الكائنات الحية على اليابسة:', 'مكان تعيش فيه الكائنات الحية على اليابسة… وينه؟', ['forest', 'desert-life', 'polar-life', 'savanna'], ['reef', 'sea'], 2, 'land-places', d(20), 'habitats_land'),
  tick('habitats', 'water-place', 'مكان تعيش فيه الكائنات الحية في الماء:', 'وين المكان اللي تعيش فيه الكائنات الحية في الماي؟', ['reef', 'sea'], ['forest', 'desert-life', 'polar-life', 'savanna'], 3, 'water-places', d(20), 'habitats_water'),
  tick('habitats', 'water-plant', 'نبات يعيش في الماء:', 'نبات ينبت في الماي… وينه؟', ['seaweed'], LAND_PLANTS, 3, 'water-plant', d(25), 'water_plants'),
  groups(
    'habitats',
    'tree-group',
    'الحيوانات التي تتخذ من الشجر مأوى لها في المجموعة:',
    'الحيوانات اللي تسكن في الشجر… في أي مجموعة؟',
    ['squirrel', 'bird'],
    [['rabbit', 'squirrel'], ['fish', 'bird'], ['rabbit', 'fish']],
    'tree-home',
    d(35),
    'shelter_trees',
  ),
  about(
    'habitats',
    'where-lives',
    'tick',
    'أين يعيش هذا الكائن الحي؟',
    'وين يعيش هذا الكائن الحي؟',
    pics(['desert', 'sea'], true),
    WHERE.map(([picture, place]) => ({ picture: `pic:${picture}`, answer: place, fact: place === 'desert' ? 'on-land' : 'in-water' })),
    d(15),
    'classify_habitat',
    true,
  ),
  about(
    'habitats',
    'which-home',
    'tick',
    'أي مأوى يناسب هذا الحيوان؟',
    'أي مأوى يناسب هذا الحيوان؟',
    pics(['nest', 'burrow', 'coral-home', 'tree-hole']),
    HOMES.map(([animal, home, fact]) => ({ picture: `pic:${animal}`, answer: home, fact })),
    d(20),
    'shelter_match',
  ),
  about(
    'habitats',
    'whose-home',
    'tick',
    'من يعيش في هذا المأوى؟',
    'هذا المأوى… منو يسكن فيه؟',
    pics(['bird', 'rabbit', 'fish', 'squirrel']),
    HOMES.map(([animal, home, fact]) => ({ picture: `pic:${home}`, answer: animal, fact })),
    d(20),
    'shelter_match',
  ),
  choose(
    'habitats',
    'burrow-animals',
    'الحيوانات التي يمكن أن تعيش في هذا المأوى هي:',
    'الحيوانات اللي ممكن تعيش في هالمأوى… منو؟',
    'sand-burrow',
    ['الأرنب والحصني', 'الأرنب والحصني'],
    [['الدب والسنجاب', 'الدب والسنجاب'], ['العصفور والذئب', 'العصفور والذيب'], ['الأرنب والسنجاب', 'الأرنب والسنجاب']],
    'burrow',
    d(40),
    'shelter_burrow',
  ),
  choose(
    'habitats',
    'lost-home',
    'ماذا يحدث للحيوان إذا فقد مأواه؟',
    'إذا الحيوان خسر مأواه… شنو يصير له؟',
    'lost-home',
    ['يصعب عليه الحصول على الحماية', 'ما يلقى مكان يحميه'],
    [['يصبح أقوى', 'يصير أقوى'], ['لا يتغير شيء', 'ما يتغير شي']],
    'lost-home',
    d(40),
    'shelter_why',
  ),
  choose(
    'habitats',
    'rabbit-home',
    'ما مأوى هذا الحيوان؟',
    'هذا الأرنب… شنو مأواه؟',
    'rabbit-burrow',
    ['الجحر', 'الجحر'],
    [['العش', 'العش'], ['صخور البحر', 'صخور البحر']],
    'burrow',
    d(20),
    'shelter_burrow',
  ),
  choose(
    'habitats',
    'bird-home',
    'ما مأوى هذا الطائر؟',
    'هذا الطير… شنو مأواه؟',
    'bird-nest',
    ['العش', 'العش'],
    [['الجحر', 'الجحر'], ['صخور البحر', 'صخور البحر']],
    'nest',
    d(15),
    'shelter_nest',
  ),
  choose(
    'habitats',
    'fennec-home',
    'يعيش الحصني الصحراوي في:',
    'الحصني اللي يعيش في الصحرا… وين بيته؟',
    'fennec-burrow',
    ['الجحر', 'الجحر'],
    [['البحر', 'البحر'], ['العش', 'العش']],
    'burrow',
    d(30),
    'shelter_burrow',
  ),
  choose(
    'habitats',
    'squirrel-home',
    'أين يتخذ السنجاب مأواه؟',
    'السنجاب… وين يسوي بيته؟',
    'squirrel-tree',
    ['في الأشجار', 'في الشجر'],
    [['في البحر', 'في البحر'], ['في جحر تحت الأرض', 'في جحر تحت الأرض']],
    'tree-home',
    d(25),
    'shelter_trees',
  ),
  choose(
    'habitats',
    'sea-shelter',
    'تستخدم الكائنات البحرية مأوى لها:',
    'سمك البحر… شنو يستخدم بيت له؟',
    'sea-rocks',
    ['الصخور في البحر', 'الصخور اللي في البحر'],
    [['أعشاش الطيور', 'أعشاش الطيور'], ['جحور الأرانب', 'جحور الأرانب']],
    'sea-rocks',
    d(30),
    'shelter_sea',
  ),
  word('habitats', 'places', 'أماكن عيش الحيوانات والنباتات', '.', 'مختلفة', 'متشابهة', 'أماكن عيش الحيوانات والنباتات… متشابهة؟ ولا مختلفة؟', 'places-differ', d(25), 'habitats_differ', false),
  word('habitats', 'survive', 'لكل كائن حي مأوى يحميه ويساعده على', '.', 'البقاء', 'الانتقال', 'لكل كائن حي مأوى يحميه… ويساعده على شنو؟ البقاء؟ ولا الانتقال؟', 'shelter-why', d(35), 'shelter_why'),
  word('habitats', 'fish-water', 'الأسماك من الحيوانات التي تعيش في', '.', 'الماء', 'اليابسة', 'الأسماك من الحيوانات اللي تعيش في… الماي؟ ولا اليابسة؟', 'sea-animals', d(15), 'water_animals'),
  word('habitats', 'camel-land', 'الجمل يعيش على', '.', 'اليابسة', 'الماء', 'الجمل يعيش على… اليابسة؟ ولا الماي؟', 'on-land', d(15), 'land_animals'),
  word('habitats', 'nest-birds', 'العش مأوى', '.', 'للطيور', 'للأسماك', 'العش مأوى… للطيور؟ ولا للسمك؟', 'nest', d(15), 'shelter_nest'),
  word('habitats', 'squirrel-trees', 'السنجاب يتخذ من', 'مأوى له.', 'الأشجار', 'البحر', 'السنجاب يسوي بيته في… البحر؟ ولا الشجر؟', 'tree-home', d(20), 'shelter_trees', false),
  tf('habitats', 'all-on-land', 'جميع الكائنات الحية تعيش على اليابسة.', 'كل الكائنات الحية تعيش على اليابسة.', false, 'land-water', d(20)),
  tf('habitats', 'fish-in-water', 'الأسماك من الحيوانات التي تعيش في الماء.', 'السمك من الحيوانات اللي تعيش في الماي.', true, 'sea-animals', d(10)),
  tf('habitats', 'some-land-some-water', 'بعض الكائنات الحية تعيش على اليابسة، وبعضها في الماء.', 'بعض الكائنات الحية تعيش على اليابسة… وبعضها في الماي.', true, 'land-water', d(20)),
  tf('habitats', 'places-differ', 'تختلف أماكن عيش الكائنات الحية.', 'أماكن عيش الكائنات الحية… تختلف.', true, 'places-differ', d(20)),
  tf('habitats', 'squirrel-burrow', 'يتخذ السنجاب من جحور الأرض مأوى له.', 'السنجاب يسكن في جحر تحت الأرض.', false, 'tree-home', d(35), 'squirrel'),
  tf('habitats', 'rabbit-burrow', 'الجحور مأوى للأرانب.', 'الجحور… بيوت للأرانب.', true, 'burrow', d(15), 'rabbit'),
  tf('habitats', 'same-shelter', 'جميع الحيوانات لها المأوى نفسه.', 'كل الحيوانات بيتها نفس الشي.', false, 'shelter-differs', d(30)),
  tf('habitats', 'shelter-protects', 'المأوى يساعد الحيوانات على حماية نفسها من الخطر.', 'المأوى يساعد الحيوانات تحمي نفسها من الخطر.', true, 'shelter-why', d(20)),
  tf('habitats', 'camel-in-water', 'يعيش الجمل في الماء.', 'الجمل يعيش في الماي.', false, 'on-land', d(10), 'line-camel'),
  tf('habitats', 'nest-birds', 'العش مأوى لأنواع كثيرة من الطيور.', 'العش بيت لأنواع وايد من الطيور.', true, 'nest', d(15), 'nest'),
  table(
    'habitats',
    'homes',
    [
      [['حيوان يتخذ الصخور في البحر مأوى له.', 'حيوان بيته الصخور اللي في البحر.'], 'fish'],
      [['حيوان يتخذ من الأشجار مأوى له.', 'حيوان بيته في الشجر.'], 'squirrel'],
      [['حيوان يتخذ من الجحور مأوى له.', 'حيوان بيته جحر في الأرض.'], 'rabbit'],
      [['حيوان يبني عشه فوق الشجرة.', 'حيوان يبني عشه فوق الشجرة.'], 'bird'],
    ],
    [],
    2,
    'shelter-differs',
    d(35),
    'shelter_match',
  ),
  table(
    'habitats',
    'land-water',
    [
      [['حيوان يعيش في الماء.', 'حيوان يعيش في الماي.'], 'whale'],
      [['حيوان يعيش على اليابسة.', 'حيوان يعيش على اليابسة.'], 'zebra'],
      [['نبات يعيش في الماء.', 'نبات ينبت في الماي.'], 'seaweed'],
      [['نبات يعيش على اليابسة.', 'نبات ينبت على اليابسة.'], 'cactus'],
    ],
    [],
    2,
    'land-water',
    d(35),
    'classify_habitat',
  ),
  homes('habitats', 'animal-homes', HOMES.map(([animal, home]) => [animal, home]), 3, 'shelter-differs', d(30)),
  sceneQ('habitats', 'sea-mistake', '', 'في البحر… في شي غلط. منو اللي مو مكانه هني؟', SEA_MISTAKE, 'sea-mistake', d(25), 'habitat_mistake'),
  sceneQ('habitats', 'polar-water', 'ضع (○) حول الحيوانات التي تعيش في الماء.', 'نحوط الحيوانات اللي تعيش في الماي… مو اللي على الثلج.', POLAR_WATER, 'polar-water', d(35), 'water_animals', 'ضع (○) حول الحيوانات التي تعيش في الماء:'),
  color('habitats', 'land-water', ['line-lizard', 'line-palm', 'line-camel'], ['line-octopus', 'line-fish', 'line-coral'], 'land-water', d(25)),
  marks('habitats', 'water-creatures', 'circle', 'حوط الكائنات الحية التي تعيش في الماء.', 'نحوط الكائنات الحية اللي تعيش في الماي… كلها.', [...IN_WATER, 'seaweed'], [...ON_LAND, ...LAND_PLANTS], 2, 2, 'land-water', d(25), 'water_animals', 'حوط الكائنات الحية التي تعيش في الماء:'),

  // 2. كيف نحمي أماكن عيش الكائنات الحية؟ ────────────────────────────────────
  about(
    'protect',
    'harm-shown',
    'tick',
    'أي من السلوكيات الضارة التالية يوضحه الشكل؟',
    'شنو السلوك الضار اللي في الصورة؟',
    written('protect-harm-shown', [
      ['دخان المصانع', 'دخان المصانع'],
      ['قطع الأشجار', 'قطع الشجر'],
      ['قلة الماء', 'قلة الماي'],
      ['رمي النفايات', 'رمي الزبالة'],
    ]),
    HARM_SHOWN.map(([picture, n, fact]) => ({ picture: `pic:${picture}`, answer: `o${n + 1}`, fact })),
    d(30),
    'harm_behaviors',
    true,
  ),
  tick('protect', 'protects', 'سلوك يحافظ على أماكن عيش الكائنات الحية:', 'أي سلوك يحمي الأماكن اللي تعيش فيها الكائنات الحية؟', PROTECTING, HARMING, 3, (right) => protectFact(right.id as PicId), d(20), 'protect_ways'),
  tick('protect', 'harms', 'سلوك يضر أماكن عيش الكائنات الحية:', 'أي سلوك يضر الأماكن اللي تعيش فيها الكائنات الحية؟', HARMING, PROTECTING, 3, 'harm-behaviors', d(20), 'harm_behaviors'),
  tick('protect', 'dirty-air', 'من أضرار الهواء غير النظيف على الإنسان:', 'الهوا الوصخ… شلون يضر الإنسان؟', ['cough-small'], ['harm-plant', 'harm-fish', 'harm-river'], 3, 'smoke-sick', d(35), 'harm_effects'),
  tick('protect', 'clean-beach', 'الشاطئ المناسب للعب والسباحة:', 'أي شاطي نقدر نلعب ونسبح فيه؟', ['clean-beach'], ['dirty-beach'], 1, 'clean-beach', d(10), 'clean_places'),
  tick('protect', 'harmed', 'صورة تمثل ضررا حدث للكائنات الحية:', 'أي صورة فيها ضرر صار للكائنات الحية؟', HARMED, UNHARMED, 2, (right) => harmedFact(right.id as PicId), d(20), 'harm_effects'),
  about(
    'protect',
    'sort-waste',
    'sort',
    'في أي صندوق نضع هذه النفايات؟',
    'هذي النفايات… في أي صندوق نحطها؟',
    pics(['bin-paper', 'bin-plastic', 'bin-food']),
    WASTE.map(([picture, bin, fact]) => ({ picture: `pic:${picture}`, answer: bin, fact })),
    d(20),
    'sort_waste',
    true,
  ),
  choose(
    'protect',
    'burning',
    'الصورة التي أمامك تسبب الضرر لـ:',
    'حرق الزبالة اللي في الصورة… يضر شنو؟',
    'burning-trash',
    ['الهواء والتربة', 'الهوا والتربة'],
    [['الماء والهواء', 'الماي والهوا'], ['التربة والهواء والماء', 'التربة والهوا والماي'], ['التربة والماء', 'التربة والماي']],
    'burning',
    d(50),
    'harm_effects',
  ),
  choose(
    'protect',
    'dead-fish',
    'ما السبب الذي أدى إلى هذه النتيجة؟',
    'ليش ماتت هالسمكة؟ شنو السبب؟',
    'dead-fish',
    ['رمي النفايات في البحر', 'قط الزبالة في البحر'],
    [['قلة الماء', 'قلة الماي'], ['الجو الحار', 'الجو الحار'], ['قلة الهواء', 'قلة الهوا']],
    'dead-fish',
    d(35),
    'harm_causes',
  ),
  choose(
    'protect',
    'plants-harmed',
    'ماذا يحدث للكائنات الحية الأخرى إذا تضررت النباتات؟',
    'إذا النبات تضرر… شنو يصير للكائنات الثانية؟',
    'dead-plants',
    ['تمرض أو تموت', 'تمرض أو تموت'],
    [['تكبر وتقوى', 'تكبر وتقوى'], ['لا يحدث لها شيء', 'ما يصير لها شي']],
    'plants-harmed',
    d(35),
    'harm_effects',
  ),
  choose(
    'protect',
    'coughing',
    'ماذا يسبب الهواء الملوث للإنسان؟',
    'الهوا الملوث… شنو يسوي في الإنسان؟',
    'coughing',
    ['الأمراض وصعوبة التنفس', 'المرض وصعوبة التنفس'],
    [['القوة والنشاط', 'القوة والنشاط'], ['النوم الهادئ', 'النوم الهادي']],
    'smoke-sick',
    d(25),
    'harm_effects',
  ),
  choose(
    'protect',
    'oiled-bird',
    'كيف تؤثر السلوكيات الضارة على الحيوان؟',
    'السلوكيات الضارة… شلون تأثر على الحيوان؟',
    'oiled-bird',
    ['مرض الحيوانات وموتها', 'تمرض الحيوانات وتموت'],
    [['تكبر الحيوانات بسرعة', 'تكبر الحيوانات بسرعة'], ['تبني الحيوانات بيوتا جديدة', 'تبني الحيوانات بيوت يديدة']],
    'harm-animals',
    d(35),
    'harm_effects',
  ),
  choose(
    'protect',
    'turtle',
    'لماذا تمرض السلحفاة؟',
    'ليش السلحفاة تمرض؟',
    'turtle-plastic',
    ['تأكل النفايات وتظنها طعاما', 'تاكل الزبالة وتحسبها أكل'],
    [['تسبح كثيرا', 'تسبح وايد'], ['تنام على الرمل', 'تنام على الرمل']],
    'turtle-plastic',
    d(45),
    'harm_causes',
  ),
  word('protect', 'waste-harm', 'النفايات في أماكن عيش الكائنات الحية تسبب لها', '.', 'الضرر', 'الأمان', 'النفايات في الأماكن اللي تعيش فيها الكائنات الحية… تسبب لها الأمان؟ ولا الضرر؟', 'waste-harm', d(25), 'harm_behaviors', false),
  word('protect', 'recycle', 'نحمي أرضنا من النفايات عن طريق', '.', 'إعادة تدويرها', 'رميها على الأرض', 'نحمي أرضنا من النفايات… بإعادة تدويرها؟ ولا برميها على الأرض؟', 'recycle', d(25), 'protect_ways'),
  word('protect', 'plant', 'من طرق حماية أماكن عيش الكائنات الحية: استخدام الدراجة الهوائية و', 'النباتات.', 'زراعة', 'قطع', 'نحمي الأماكن اللي تعيش فيها الكائنات… بالسيكل، و… زراعة النباتات؟ ولا قطعها؟', 'plant-trees', d(30), 'protect_ways'),
  word('protect', 'bags', 'من طرق الحماية: استخدام الأكياس', '.', 'القماشية', 'البلاستيكية', 'من طرق الحماية… نستخدم الأكياس القماشية؟ ولا البلاستيكية؟', 'cloth-bag', d(30), 'protect_ways'),
  word('protect', 'bike', 'نستخدم', 'لنحمي الهواء من الدخان.', 'الدراجة الهوائية', 'السيارات', 'عشان نحمي الهوا من الدخان… نستخدم السيارات؟ ولا السيكل؟', 'bike', d(20), 'protect_ways', false),
  word('protect', 'bin', 'نرمي النفايات في', '.', 'المكان المخصص لها', 'الشارع', 'وين نقط الزبالة؟ في المكان المخصص لها؟ ولا في الشارع؟', 'put-in-bin', d(10), 'protect_ways'),
  tf('protect', 'smoke-sick', 'دخان المصانع يسبب المرض للإنسان.', 'دخان المصانع يمرض الإنسان.', true, 'smoke-sick', d(15), 'factory-art'),
  tf('protect', 'planting', 'زراعة النباتات تحمي أماكن عيش الكائنات الحية من الضرر.', 'زراعة النباتات تحمي الأماكن اللي تعيش فيها الكائنات الحية من الضرر.', true, 'plant-trees', d(20), 'farmer'),
  tf('protect', 'smoke-keeps', 'دخان المصانع يحافظ على أماكن عيش الكائنات الحية.', 'دخان المصانع يحافظ على الأماكن اللي تعيش فيها الكائنات الحية.', false, 'smoke-sick', d(25)),
  tf('protect', 'recycling-helps', 'إعادة تدوير النفايات تساعدنا.', 'إعادة تدوير النفايات… تساعدنا.', true, 'recycle', d(15)),
  tf('protect', 'smoke-harms', 'دخان المصانع يسبب ضررا لأماكن عيش الكائنات الحية.', 'دخان المصانع يضر الأماكن اللي تعيش فيها الكائنات الحية.', true, 'harm-behaviors', d(20), 'factory-art'),
  tf('protect', 'sorting', 'نحمي أرضنا عن طريق فرز النفايات لإعادة تدويرها.', 'نحمي أرضنا لما نفرز النفايات… عشان نعيد تدويرها.', true, 'recycle', d(25), 'recycle-bins'),
  tf('protect', 'cutting-protects', 'قطع الأشجار يحمي أماكن عيش الكائنات الحية.', 'قطع الشجر يحمي الأماكن اللي تعيش فيها الكائنات الحية.', false, 'plant-trees', d(20), 'cutting-small'),
  tf('protect', 'park-litter', 'رمي النفايات في الأماكن العامة سلوك صحيح.', 'رمي الزبالة في الأماكن العامة… سلوك صح.', false, 'put-in-bin', d(15)),
  tf('protect', 'bike-air', 'استخدام الدراجة الهوائية بدلا من السيارات يحمي الهواء.', 'لما نستخدم السيكل بدال السيارة… نحمي الهوا.', true, 'bike', d(25), 'bike-art'),
  tf('protect', 'plants-harmed', 'إذا تضررت النباتات تمرض أو تموت الكائنات الحية الأخرى.', 'إذا النبات تضرر… الكائنات الحية الثانية تمرض أو تموت.', true, 'plants-harmed', d(35)),
  table(
    'protect',
    'harms',
    [
      [['سلوك يضر الهواء.', 'سلوك يضر الهوا.'], 'factory-smoke'],
      [['سلوك يضر الماء.', 'سلوك يضر الماي.'], 'water-trash'],
      [['سلوك يضر النباتات.', 'سلوك يضر النباتات.'], 'tree-cutting'],
      [['سلوك يضر الأماكن العامة.', 'سلوك يضر الأماكن العامة.'], 'park-litter'],
    ],
    [],
    2,
    'harm-behaviors',
    d(40),
    'harm_behaviors',
  ),
  table(
    'protect',
    'protect-ways',
    [
      [['نزرع النباتات.', 'نزرع النباتات.'], 'farmer'],
      [['نرمي النفايات في المكان المخصص لها.', 'نقط الزبالة في مكانها.'], 'boy-bin'],
      [['نستخدم الأكياس القماشية.', 'نستخدم أكياس القماش.'], 'cloth-bag'],
      [['نستخدم الدراجة الهوائية.', 'نستخدم السيكل.'], 'cyclists'],
      [['نفرز النفايات لإعادة تدويرها.', 'نفرز النفايات عشان نعيد تدويرها.'], 'recycle-bins'],
    ],
    [],
    2,
    'recycle',
    d(30),
    'protect_ways',
  ),
  numberQ(
    'protect',
    'harm-places',
    HARM_SCENE,
    [
      [['أضرار التربة.', 'رقم واحد… أضرار التربة.'], 'soil'],
      [['أضرار الهواء.', 'رقم اثنين… أضرار الهوا.'], 'air'],
      [['أضرار الماء.', 'رقم ثلاثة… أضرار الماي.'], 'water'],
    ],
    'harm-places',
    d(45),
  ),
  sceneQ(
    'protect',
    'litter-desert',
    'حوط في الصورة ثلاثة أشياء تسبب ضررا في هذا المكان.',
    'رحلة في البر… بس في أشياء تضر المكان. نلقى ثلاث منها ونحوطها.',
    LITTER_DESERT,
    'litter-harm',
    d(35),
    'harm_behaviors',
    'حوط في الصورة الأشياء التي تسبب ضررا في هذا المكان:',
  ),
  marks('protect', 'harmed', 'cross', '', null, HARMED, [...UNHARMED, 'farmer'], 2, 1, 'harm-animals', d(25), 'harm_effects'),
  marks('protect', 'protect-ways', 'circle', '', 'نحوط الصور اللي نحمي فيها الأماكن اللي تعيش فيها الكائنات الحية.', PROTECTING, HARMING, 2, 2, 'recycle', d(25), 'protect_ways'),
  marks('protect', 'harmful', 'circle', 'حوط الصور التي تبين سلوكيات تضر أماكن عيش الكائنات الحية.', 'هالمرة… نحوط الصور اللي فيها سلوك يضر.', HARMING, PROTECTING, 2, 2, 'harm-behaviors', d(25), 'harm_behaviors', 'حوط الصور التي تبين سلوكيات تضر أماكن عيش الكائنات الحية:'),
]

/** The explanation for a protecting picture. */
function protectFact(id: PicId): FactId {
  if (id === 'bike-art' || id === 'cyclists') return 'bike'
  if (id === 'farmer') return 'plant-trees'
  if (id === 'cloth-bag') return 'cloth-bag'
  if (id === 'recycle-bins') return 'recycle'
  return 'put-in-bin'
}

/** The explanation for a picture of harm. */
function harmedFact(id: PicId): FactId {
  if (id === 'smoke-land') return 'smoke-sick'
  if (id === 'dead-trees' || id === 'dead-plants') return 'plants-harmed'
  if (id === 'turtle-plastic') return 'turtle-plastic'
  return 'harm-animals'
}

// ── Narration ─────────────────────────────────────────────────────────────

/** Maryam's lines for the moments around the questions, shared by both copies. */
export const AR_LINES = {
  welcome: [
    'حياكم! اليوم بنعرف وين تعيش الكائنات الحية… وشلون نحميها.',
    'أهلا وسهلا! من البحر للبر… يلا نستكشف.',
    'مستعدين؟ البر والبحر ينطرونا!',
  ],
  'test-intro': ['هذا نموذج اختبار… مثل ورقة المدرسة بالضبط.', 'يلا نجرب الاختبار… سؤال ورا سؤال، وعلى راحتنا.'],
  /** A board (a table, the homes, the numbers): a wrong number was tried. */
  'board-wrong': ['لا مو هذا… نجرب غيره.', 'امم… مو هني مكانه.', 'شوي بعد… نطالع مرة ثانية.'],
  /** A board, a picture or a colouring that missed: before the explanation. */
  review: ['نطالع الحل الصح سوا…', 'هذا هو الحل… ونتعلم منه.', 'خلنا نشوف وين الصح…'],
  /** A wrong choice: a kind word, then the right answer and the explanation. */
  retry: [
    'ما عليه… الغلط يعلمنا.',
    'قربنا وايد! هذا هو الصح.',
    'هالمرة لا… بس الحين عرفناها.',
    'عادي… حتى العلماء يغلطون!',
    'شوي شوي… ونصير أشطر.',
    'المحاولة حلوة… والصح هذا.',
    'كل غلطة… درس جديد.',
  ],
  cheer: [
    'فديت هالجواب!',
    'يا سلام عليه من جواب!',
    'الله الله… جواب علماء!',
    'تبارك الرحمن!',
    'بالضبط جذي!',
    'إي والله صح!',
    'جواب يبيض الوجه!',
    'حلو حيل!',
    'هذا هو الجواب!',
    'زين زين زين!',
    'من أول مرة… صح!',
    'فكرة حلوة… وجواب صح!',
    'طلع صح!',
    'صح صح صح!',
  ],
  'cheer-habitats': ['عرفنا وين يعيش!', 'حتى السمك فرحان!'],
  'cheer-protect': ['الأرض تقول: شكرا!', 'البحر صار أنظف!', 'جذي نحمي بيئتنا!'],
  'cheer-scene': ['عيون صقر!', 'ما فاتنا شي!'],
  'cheer-homes': ['كل حيوان رجع بيته!', 'البيوت كلها صح!'],
  'cheer-numbers': ['الأرقام كلها بمكانها!', 'رقم رقم… وكلها صح!'],
  'cheer-color': ['ألوان حلوة… وكلها صح!'],
  /** Three, then five right answers running. */
  'streak-3': ['ثلاثة على التوالي… يا سلام!', 'ثلاثة صح… والرابع جاي!'],
  'streak-5': ['خمسة على التوالي… شي ولا أروع!', 'خمس مرات صح! نجم العلوم!'],
  'done-great': ['خلصنا… والنتيجة تبيض الوجه!', 'كل النجوم! البر والبحر فرحانين.'],
  'done-good': ['زين ما سوينا! ومرة ثانية نصير أحسن.', 'خلصنا الجولة… والمرة الياية نجمع نجوم أكثر.'],
} as const satisfies Record<string, readonly string[]>

export type ArGroup = keyof typeof AR_LINES

/** Lines that speak to the child: a girl in «علوم - بنات», a boy in «علوم - أولاد». */
export const YOU_LINES = {
  girls: {
    cheer: ['يا بطلة!', 'يا شاطرة!', 'يا عالمة صغيرة!'],
    'done-great': ['إنتي عالمة صغيرة!'],
  },
  boys: {
    cheer: ['يا بطل!', 'يا شاطر!', 'يا عالم صغير!'],
    'done-great': ['إنت عالم صغير!'],
  },
} as const satisfies Record<Audience, Record<string, readonly string[]>>

export type YouGroup = keyof (typeof YOU_LINES)['girls']

export interface Line {
  text: string
  clip: string
}

export function arLines(group: ArGroup): Line[] {
  return AR_LINES[group].map((text, n) => ({ text, clip: clip.ar(group, n) }))
}

export function youLines(audience: Audience, group: YouGroup): Line[] {
  return YOU_LINES[audience][group].map((text, n) => ({ text, clip: clip.you(audience, group, n) }))
}

/** Cheers for any question: the shared ones and the copy's own. */
export function cheers(audience: Audience): Line[] {
  return [...arLines('cheer'), ...youLines(audience, 'cheer')]
}

export function doneLines(audience: Audience, great: boolean): Line[] {
  return great ? [...arLines('done-great'), ...youLines(audience, 'done-great')] : arLines('done-good')
}

/** Kind words after a wrong choice. */
export const RETRIES: Line[] = arLines('retry')

/** Cheers made for this kind of question: its board, its picture, its lesson. */
export function ownCheers(question: Pick<Question, 'format' | 'topic'>): Line[] {
  const groups: ArGroup[] = [question.topic === 'habitats' ? 'cheer-habitats' : 'cheer-protect']
  if (question.format === 'scene') groups.push('cheer-scene')
  if (question.format === 'homes') groups.push('cheer-homes')
  if (question.format === 'table' || question.format === 'number') groups.push('cheer-numbers')
  if (question.format === 'color') groups.push('cheer-color')
  return groups.flatMap(arLines)
}

/** The streak cheers, by how many right answers ran. */
export const STREAKS: Record<number, Line[]> = { 3: arLines('streak-3'), 5: arLines('streak-5') }

// ── Audio cues ────────────────────────────────────────────────────────────
export interface AudioCue {
  id: string
  /** Kuwaiti (Maryam), without diacritics. */
  text: string
}

export function bare(text: string): string {
  return text.replace(/[ً-ْٰ]/g, '')
}

export function audioCues(): AudioCue[] {
  const cues: AudioCue[] = [
    ...(Object.keys(ASK_LINES) as Format[]).flatMap((format) => ASK_LINES[format].map((text, n) => ({ id: clip.line(format, n), text }))),
    ...[...SPOKEN].map(([id, text]) => ({ id, text })),
    ...(Object.keys(FACTS) as FactId[]).map((id) => ({ id: clip.fact(id), text: FACTS[id].say })),
    ...(Object.keys(AR_LINES) as ArGroup[]).flatMap((group) => arLines(group).map((line) => ({ id: line.clip, text: line.text }))),
    ...(Object.keys(YOU_LINES) as Audience[]).flatMap((audience) =>
      (Object.keys(YOU_LINES[audience]) as YouGroup[]).flatMap((group) => youLines(audience, group).map((line) => ({ id: line.clip, text: line.text }))),
    ),
  ]
  return cues.map((cue) => ({ ...cue, text: bare(cue.text) }))
}

/** Every clip one question can play, in any round. */
export function questionClips(question: Question): string[] {
  const subjectFacts = question.subjects?.map((subject) => subject.fact) ?? []
  const drawFacts = question.draw?.fact ? question.draw.right.map((option) => question.draw!.fact!(option)) : []
  const rows = question.rowDraw ? question.rowDraw.pairs.map((pair) => pair.row) : question.rows
  return [
    ...ASK_LINES[question.format].map((_, n) => clip.line(question.format, n)),
    ...question.ask.slice(1),
    ...question.options.flatMap((option) => (option.clip ? [option.clip] : [])),
    ...rows.flatMap((row) => (row.clip ? [row.clip] : [])),
    ...[question.fact, ...subjectFacts, ...drawFacts].map(clip.fact),
  ]
}

/** Every clip a round needs, so it can be loaded before the first question. */
export function roundClips(questions: Question[], audience: Audience): string[] {
  const moments: ArGroup[] = ['board-wrong', 'review', 'retry']
  return [
    ...new Set([
      ...questions.flatMap(questionClips),
      ...moments.flatMap((group) => arLines(group).map((line) => line.clip)),
      ...[...cheers(audience), ...questions.flatMap(ownCheers), ...Object.values(STREAKS).flat()].map((line) => line.clip),
      ...[...doneLines(audience, true), ...doneLines(audience, false)].map((line) => line.clip),
    ]),
  ]
}

// ── A question for one round ──────────────────────────────────────────────
function pickSome<T>(items: readonly T[], count: number, random: Random): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy.slice(0, count)
}

/** A copy of the question for one round: drawn questions get this round's pictures and rows. */
export function dressQuestion(question: Question, random: Random = Math.random): Question {
  const { draw, pictureDraw, rowDraw, subjects } = question
  if (subjects) {
    const subject = subjects[Math.floor(random() * subjects.length)]!
    return { ...question, picture: subject.picture, answer: subject.answer, fact: subject.fact }
  }
  if (draw) {
    const right = draw.right[Math.floor(random() * draw.right.length)]!
    const wrong = pickSome(
      draw.wrong.filter((option) => option.id !== right.id),
      draw.count,
      random,
    )
    return { ...question, options: [right, ...wrong], answer: right.id, fact: draw.fact ? draw.fact(right) : question.fact }
  }
  if (pictureDraw) {
    const good = pickSome(pictureDraw.good, pictureDraw.goodCount, random)
    const bad = pickSome(pictureDraw.bad, pictureDraw.badCount, random)
    return { ...question, options: pickSome([...good, ...bad], good.length + bad.length, random), good: good.map((option) => option.id) }
  }
  if (rowDraw) {
    const chosen = pickSome(rowDraw.pairs, rowDraw.rows, random)
    const extra = pickSome(spareKeys(rowDraw, chosen), rowDraw.extraCount, random)
    // The book numbers its pictures in a new order every time.
    const keys = pickSome([...chosen.map((pair) => pair.key), ...extra], chosen.length + extra.length, random)
    return { ...question, rows: chosen.map((pair) => pair.row), options: keys }
  }
  return question
}
