# Internal Hub project brief — «علوم»

- Working title: علوم
- Child/group audience: one 5-year-old girl in Grade 1 (Kuwait, girls' primary school); pre-reader / early reader
- Learning goal: prepare for the Grade 1 science test of 19–21 Oct 2026 (date depends on class section)
- Lessons (from the test schedule): plant parts we eat; how animals move; animal body covering; what animals eat; how animals breathe; how animals reproduce
- Content source: «حل كتاب أول علوم ٢٠٢٧» (Grade 1 science, term 1 part 1), lesson and evaluation pages 33–65
- Project type: graded adaptive quiz with a learn mode; no Challenge Mode
- Language and direction: Arabic, RTL; on-screen text without diacritics (family preference); narration from vowelled source text
- Core interaction: learn cards (narrated facts) → 8-question practice per lesson → 12-question mock test (2 per lesson)
- Audio: ElevenLabs Maryam Essa - Kuwaiti Calm & Warm (approved for «بصمة وأثر»), eleven_v4, Kuwaiti dialect, no diacritics; explanations at 0.88 speed with examples
- Stable project ID: `science-grade1`
- Stable question-key strategy: `<lesson>:<slug>` written by hand, never derived from order or wording
- Preview scope: separate preview build, no Hub or Supabase calls, stars stored on the device only
- Production actions currently authorized: none
- Account assignments currently authorized: none
- Acceptance checks: unit tests (content, narration, rounds, Hub contract, seed), Playwright on iPhone/iPad WebKit and desktop Chromium
