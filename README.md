# علوم — تدريب العلوم للصف الأول

موقع تدريبي لطفلة في الصف الأول للتحضير لاختبار العلوم في ستة دروس: أجزاء النبات التي نأكلها، وكيف تنتقل الحيوانات،
وماذا يغطي جسمها، وماذا تأكل، وكيف تتنفس، وكيف تتكاثر. كل الأسئلة مأخوذة من كتاب العلوم وأسئلة تقويمه.

- **تعلمي**: بطاقات مصوّرة مع أمثلة، يشرحها صوت كويتي (مريم عيسى) بهدوء.
- **تدربي**: ٨ أسئلة مصوّرة لكل درس، مع قراءة السؤال والخيارات بصوت، واحتفال عند الإجابة الصحيحة، والمعلومة الصحيحة عند الخطأ.
- **الاختبار التجريبي**: ١٢ سؤالًا من كل الدروس.

## الحالة
منشور على https://ahmad9077.github.io/science-grade1-quiz/ ومربوط بالـ Hub (13 أكتوبر 2026). غير مفعّل لأي حساب بعد.
تفاصيل الربط والتحقق في `integration/hub-catalog-entry.md`.

## Development
```bash
npm install
npm run dev            # preview mode at http://127.0.0.1:4183
npm run check          # lint, types, unit tests, seed check, preview build
npx playwright test    # iPhone/iPad WebKit + desktop Chromium flows and Hub contract
npm run build:hub      # production Hub build into dist-hub/ (base /science-grade1-quiz/)
```

- Content and permanent question keys: `src/data/catalog.ts`
- Narration: `python3 scripts/generate-audio.py` (skips unchanged clips), `python3 scripts/check-audio.py` (transcription check)
- Hub seed: `npm run generate:hub-seed` → `integration/seed-science-grade1.sql`
