# علوم — اختبار العلوم الثاني للصف الأول

موقع لتحضير طفل الصف الأول لاختبار العلوم الثاني: الجزء الثاني من الكتاب، الفصل الثالث «المواطن الطبيعية»،
بدرسيه «أين تعيش الكائنات الحية؟» (ص ١٢–١٨) و«كيف نحمي أماكن عيش الكائنات الحية؟» (ص ١٩–٢٥) وأسئلة نهاية الفصل (ص ٢٧–٢٨).
الاختبار الأول (أجزاء النبات وحركة الحيوانات وغطاؤها وغذاؤها وتنفسها وتكاثرها) أزيل.

- الأسئلة بأسلوب بنك أسئلة الوزارة لهذا الفصل (ص ٢٣–٢٥) وتقويمات الكتاب: ✓ في المربع، ✓/✗، جدول الأرقام،
  تصنيف الحيوانات حسب المأوى بالأرقام، أجب عن المطلوب، حوّط الكلمة، اكتشف الخطأ في الصورة، ضع الرقم على الصورة،
  لوّن البر بالبرتقالي والماء بالأزرق، ضع ✗ على الأضرار، حوّط طرق الحماية، فرز النفايات.
- ٧٥ سؤالًا (٣٩ و٣٦)، وكثير منها يسحب صورًا وإجابات جديدة كل جولة. الصور من نسخة الوزارة للكتاب (بدون حلول).
- **تدرب**: ٨ أسئلة من الدرس، لا يتكرر أسلوب أكثر من مرتين. **نموذج الاختبار**: ١٠ أسئلة مرتبة مثل بنك الوزارة.
- الصوت: مريم عيسى باللهجة الكويتية، ٢٦٥ مقطعًا كُتبت لهذا الاختبار وحده؛ لكل لحظة أكثر من جملة تُوزع بدون تكرار متتالٍ.

## نسختان
- **علوم - بنات** (`science-grade1`): الصفحة الرئيسية `/science-grade1-quiz/`.
- **علوم - أولاد** (`science-grade1-boys`): الصفحة `/science-grade1-quiz/boys/`.

النسختان تشتركان في الأسئلة والأصوات؛ الجمل التي تخاطب الطفل في `YOU_LINES` (`ar/ui/girls/`، `ar/ui/boys/`) وفي `src/audience.ts`.
لكل نسخة نتائجها ونجومها الخاصة.

## الحالة
منشور ومربوط بالـ Hub (5 نوفمبر 2026): https://haya-nt3lm.com/science-grade1-quiz/ و`/boys/`، الـ Hub `f4f9962` (v=41)، والهجرة 025
(75 سؤالًا لكل نسخة). التعيينات لم تتغير. التفاصيل في `integration/hub-catalog-entry.md`.

## Development
```bash
npm install
npm run dev            # preview mode at http://127.0.0.1:4183
npm run check          # lint, types, unit tests, seed check, preview build
npx playwright test    # iPhone/iPad WebKit + desktop Chromium flows and Hub contract
npm run build:hub      # production Hub build into dist-hub/ (base /science-grade1-quiz/)
```

- Content and permanent question keys: `src/data/catalog.ts`
- Narration: `python3 scripts/generate-audio.py` (skips unchanged clips), `python3 scripts/check-audio.py` (local whisper check, no cloud)
- Preview page: `npm run build:preview && node scripts/make-artifact-page.mjs` (one page for both copies; `#boys` opens the boys' copy)
- Pictures: `python3 scripts/crop-pictures.py <renders> public/pics` (from the Ministry book, PDF page = printed + 71)
- Hub seed: `npm run generate:hub-seed` → `integration/seed-science-grade1.sql`

## Sound after leaving the page
Safari on iPhone and iPad takes the sound away from a page that is left (another app, the home screen,
a locked screen) and wakes it only inside a finished tap, not when the finger goes down. Since 8 November
2026, leaving the page stops what is being said, and the first tap after coming back starts a fresh sound
context (`src/audio/context.ts`); clips still loading are decoded again in it. `tests/e2e/sound.spec.ts`
checks it, under that tap rule too.

## Narration notes of 8 November 2026
The family asked for no sighs, Kuwaiti words and Kuwaiti numbers. 45 of Maryam's clips were recorded
again: every clip with a breath of 0.24 s or more at a «…» pause, every «نحوط» (now «نحط دائرة على»),
counts said «ثلاثة», «خمسة», «فديت» removed from the cheers, and «السيكل» changed to «القاري». The voice
read «القاري» the formal way («القارئ»), so it is sent as «الگاري» (`voiced()` in `src/data/catalog.ts`);
the screen keeps «القاري». `tests/unit/catalog.test.ts` holds these rules.
