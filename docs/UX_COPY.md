# UX Copy Guide — Applyce

Source of truth for the voice and terms used across the Applyce React SPA.
Keep this file in sync when you change user-facing copy.

## Voice principles

1. **Specific beats generic.** Say exactly what the tool does ("Matches you to
   84 careers" only if we can back it — prefer honest, concrete phrasing).
2. **One primary action per screen.** Verb-first buttons, shorter CTAs.
   "Get My Results", not "Analyze Resume".
3. **No dead-end states.** Every empty, error, and loading state offers a next
   step or a clear "try again".
4. **Human, not robotic.** No filler phrases, no generic error wording. Write
   the way a good career coach talks.
5. **Consistent terms.** Use the canonical terms below; never mix synonyms.

## Canonical terms

| Use this            | Not this            |
|---------------------|---------------------|
| career match        | career fit, prediction, recommendation |
| fit score           | match %, AI-matched |
| ATS score           | ATS compatibility %, checklist score |
| skill gaps          | missing skills, gaps detection |
| salary estimate     | salary prediction, band |
| career roadmap      | learning path, AI plan |
| Explainable Score   | AI Verified, AI Confidence |
| resume analysis     | resume parsing, scan |

## Signal states

- **Loading:** skeleton components (`SkeletonCard`, `SkeletonLine`) — never a
  bare spinner. Label with the real action: "Matching your skills to careers…"
- **Empty:** a helpful next-step CTA: "Upload a resume and we'll show your
  scores…" + a button.
- **Error:** surface the message, give a Retry when the action is retryable
  (Jobs search, skill gaps, trackers). No silent `catch {}`.

## Example rewrites (before → after)

| Before                                | After                                  |
|---------------------------------------|----------------------------------------|
| Quick Career Prediction               | Find Your Career Match                 |
| Get Career Predictions                | Get My Matches                         |
| Your AI-powered career insights.      | Your Resume, Decoded.                  |
| Ready to Find Your Dream Career?      | Ready to find your path?               |
| Generic "something failed" toast          | We couldn't load jobs. Check your connection and try again. |
| No applications yet. Click "Add Application" to get started. | Nothing tracked yet — add your first application and never lose a follow-up. |
| Loading…                              | Checking for updates… / Matching you to careers… |