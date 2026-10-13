# Hub integration for «علوم - بنات» (`science-grade1`) and «علوم - أولاد» (`science-grade1-boys`)

## Boys' copy release (2026-10-13, approved by the family: «انشر»)
- Site: `science-grade1-quiz@6e1acc0` deployed; boys' page live at https://ahmad9077.github.io/science-grade1-quiz/boys/
  (and https://haya-nt3lm.com/science-grade1-quiz/boys/). Same bundle and audio as the girls' page; `boys/index.html`
  marks its root `data-audience="boys"`, so the page reports as `science-grade1-boys` and keeps its own local stars.
- Hub `quizzes-hub@7ffbec6`: `quizCatalog` renames `science-grade1` to «علوم - بنات» and adds `science-grade1-boys`
  «علوم - أولاد» (color `#dcecfb`); `schema.sql` seed rows; `script.js?v=33`; migration `017_science_grade1_boys_copy.sql`
  (identical to `integration/seed-science-grade1.sql`).
- Migration 017 applied once in the Supabase SQL editor and verified: both quizzes have 79 profiles; titles renamed;
  `science-grade1` keeps its 4 existing assignments; `science-grade1-boys` has 0 assignments (needs a named approval).
- Live check: both pages load the access guard with their own quiz id; boys' wording and `audio/*/boys/` clips served.

## Girls' copy (first release)
Status (2026-10-13, approved by the family): **published and connected**.
- Production site live at https://ahmad9077.github.io/science-grade1-quiz/ (signed-out visitors are redirected to the Hub).
- Hub `quizzes-hub@5799097`: catalog entry, schema seed row, `script.js?v=29`, migration `016_seed_science_grade1_quiz.sql`.
- Migration 016 applied once in the Supabase SQL editor and verified: 79 profiles across 6 lessons, catalog row present,
  0 assignments for `science-grade1`; profiles 3, assignments 20, progress 214 unchanged before and after.
- Not assigned to any account yet (needs a named approval).

## 1. Production site
- Repository: `Ahmad9077/science-grade1-quiz` (GitHub Pages, branch `gh-pages` or Actions deploy of `dist-hub/`).
- Build: `npm run build:hub` → `dist-hub/` with base `/science-grade1-quiz/`.
- Live URL: `https://ahmad9077.github.io/science-grade1-quiz/` (currently 404, no conflict).
- Verify the live page redirects a signed-out visitor to the Hub (access guard) and loads every asset.

## 2. Hub catalog (`script.js`, scored quizzes)
Add to `quizCatalog` (graded, adaptive, no Challenge Mode):

```js
  {
    id: "science-grade1",
    title: "علوم",
    icon: "🔬",
    color: "#e3f6dc",
    url: "https://ahmad9077.github.io/science-grade1-quiz/"
  }
```

Then bump the `script.js` cache query string in `index.html` and deploy the Hub from a fresh worktree of `origin/main`.

## 3. Supabase
- Add `supabase/migrations/016_seed_science_grade1_quiz.sql` with the contents of `integration/seed-science-grade1.sql`
  (catalog row, 79 adaptive question profiles, count check; **no assignments**).
- Apply once, then verify: `select count(*) from question_difficulty_profiles where quiz_id = 'science-grade1'` → 79.

## 4. Assignment (separate approval)
Only for named accounts. Read the account's full assignment list first, add `science-grade1`, and save the complete list
with `admin_set_assignments`. Verify in Admin and by opening the quiz from that child's Hub.

## Contract summary
| Item | Value |
| --- | --- |
| quizId / manifest / catalog / Supabase id | `science-grade1` |
| Shared clients | `config.js?v=4`, `access-guard.js?v=3`, `progress-client.js?v=6`, `adaptive-client.js?v=2` |
| Reporting | per-question attempts via `QuizzesHubAdaptive.recordAttempt`, aggregate `QuizzesHubProgress.record` only as fallback |
| Question keys | `<lesson>:<slug>`, permanent (see `src/data/catalog.ts`) |
| Challenge Mode | not enabled |
