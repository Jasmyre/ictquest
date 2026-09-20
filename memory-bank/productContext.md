# Product Context — ICTQuest

Why this project exists, what it does, and how it should feel. Vocabulary per
`projectbrief.md`; guards/shells per ADR 0003; stats policy per ADR 0005.

## Why it exists

Learners need a single place to study ICT incrementally (Lesson → Topic →
Subtopic-Step), try concepts inline (browser demos, code blocks), get quiz feedback,
and see their Progress and Achievements accumulate. Maintainers need one shared
domain language so agents stop drifting to synonyms (`Post`, `dashboard`).

## How it should work (learner journeys)

- Browse the lessons index; open a Lesson Topic and step through Subtopic-Steps.
- Read code-highlight and code-block Content-blocks; run interactive browser-demo
  Content-blocks without leaving the lesson (ADR 0001 component map: `CodeBlock`,
  `CodeHighlight`, `Browser`, `PracticeQuiz`, `MultipleChoiceQuiz` as thin wrappers
  injecting stepper callbacks).
- Answer `PracticeQuiz` / `MultipleChoiceQuiz` Content-blocks; stepper records
  correctness (finished flag, correct/incorrect counts).
- Progress (`Topic` + completed Subtopics) saved per User; resume where left off.
- Progress-stats view with stats and completion counts (progress-stats router shape, not a
  `dashboard` router); Achievements unlock at milestones; Achievements inventory page.
- Compliments page for encouragement (page only, not an entity).
- Profile view/edit; another user's public stats profile; social feed + mock social
  post flow (stays mock; no moderator gate).
- Register with credentials and receive the default learner role atomically; sign in
  via credentials or OAuth with roles in session; session heals to default learner
  role when membership is empty (ADR 0002).

## Route experience (shells + guards, ADR 0003)

- `(marketing)` minimal SEO shell, no login: root `/`, lessons index `/lessons`
  (exact only), `/terms`, `/privacy`.
- `(app)` full nav-plus-footer shell, auth required: lesson details, lesson subtopic,
  progress, profile, user pages, social (+ mock social-new), compliments, settings.
- Standalone shell-less: auth pages (redirect-if-logged-in), auth-error, maintenance
  (env-gated bypass).
- `(admin)` separate sidebar shell, `ADMIN`-only: home, users, lessons, achievements,
  progress. No public nav leakage.
- Retired with no placement: access toggle, misspelled achivement click-test,
  components stub.

## UX goals

- Public pages fast and evaluable with no login; authed pages protect personal data.
- Lesson list reads cacheable; per-user stats fresh (network-only or short-lived,
  keyed cache — never long cache).
- Flaky internet shows a helpful offline fallback (`/~offline`), not a browser error;
  mutations/POSTs never served from cache (ADR 0005).
- API consumers use versioned REST (`/api/v1`) with bearer PAT or cookie; OpenAPI
  JSON is public, interactive Scalar/Redoc UI is dev/admin-only.

## Non-goals

Non-developer curriculum editing, headless CMS, user-generated-content moderation
semantics, lesson writes at cutover.
