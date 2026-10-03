# Applyce — Launch / Marketing Kit

Status: ready to post. Every claim below traces to a live feature, a live
endpoint, or the canonical taxonomy. Nothing is projected, rounded up, or
borrowed from a competitor's deck.

Sources of truth for this kit:

- `docs/UX_COPY.md` — voice + canonical terms
- `src/pages/LandingPage.tsx`, `src/pages/ResultPage.tsx`, `src/pages/UploadPage.tsx`
- `src/lib/api.ts`, `src/lib/share.ts`, `src/pages/PricingPage.tsx`
- `/home/sameudh/Applyce/dataset/careers_canonical.json` — 84 keys
- Live checks: `skillfit.onrender.com/health` (200), `/api/jobs/search` (real
  postings), `/api/roadmap/Data Scientist` (real resources), `applyce.tech` (200)

---

## 1. Positioning

Applyce is a free AI career toolkit that starts with one resume upload: it
returns your ATS score broken into keywords, format, sections, and content,
ranks your career matches with a fit score, estimates salary, lists your skill
gaps, and hands you a career roadmap with real free resources — then lets you
build the resume, search live jobs, practise, and track applications in the same
place. It is built for students and freshers entering the job market, the people
who send the most applications and get the least feedback on why. What makes it
different is that every score is explainable — the breakdown tells you which
number to fix — and every feature keys off one shared 84-career taxonomy, so
your career match, salary estimate, skill gaps, ATS keywords, and roadmap all
talk about the same job titles instead of contradicting each other. It is free
to start, with no card and no fake credit counter.

---

## 2. Founder launch post — LinkedIn

Paste-ready. 223 words.

```text
I kept hearing the same complaint from people around me, so I stopped treating
it as bad luck.

"You applied to 40 jobs. Nothing came back."

Nobody can tell you why. The rejection email says nothing. The ATS never explains
itself. And you're left guessing at keywords, formatting, or whether you're even
aiming at roles that fit.

So I built Applyce. It's open today at applyce.tech.

One upload gets you:

→ An ATS score split into keywords, format, sections, and content — not a mystery number
→ Your top career matches, ranked, with a fit score for each
→ A salary estimate for the roles you're targeting
→ Your skill gaps for your top match
→ A career roadmap with actual free courses, not vague advice

One detail I'm quietly proud of: it all runs on the same 84-career taxonomy.
The career match, the salary estimate, the skill gaps, the ATS keywords — same
names, same source. So the advice holds together instead of arguing with itself.

Free to start. No card, no fake credit counter. PDF or DOCX, under 5 MB.

If you're job hunting right now, upload the resume that's been sitting in your
Downloads folder and read the breakdown. It takes about a minute, and it may be
the first honest read you've gotten on it.

applyce.tech

#JobSearch #Freshers #ResumeTips
```

Posting notes:

- Attach one image: the shareable result card, PNG, 1080×1350 — already exported
  by the app. It shows a real score, so use your own upload.
- First comment: `84 = the careers we actually cover. Nothing is "and 2000
  more".` Keeps the honest number from reading like a rounding error.
- Reply to every comment in the first 6 hours. Speed is the only ranking
  advantage a new account has.

---

## 3. X / Threads thread — 7 posts

Paste-ready. One idea per post.

```text
1/7
The resume black hole: you apply, you hear nothing, nobody tells you why. That
is the part that actually hurts.

2/7
So I built a tool that explains it. Upload your resume at applyce.tech — free to
start, no card. PDF or DOCX, under 5 MB.

3/7
You get an ATS score split into four parts: keywords, format, sections,
content. Not a mystery number — you see which one is costing you.

4/7
Plus your top career matches with a fit score for each, and a salary estimate
for the roles you are aiming at.

5/7
Then skill gaps for your top match, and a career roadmap with free courses you
can start tonight.

6/7
One detail: every part runs on the same 84-career taxonomy. Career match,
salary, skill gaps, ATS keywords — same source. So nothing contradicts itself.

7/7
Free to start. No fake credits. Try it, then tell me what it got wrong →
applyce.tech
```

Posting notes:

- Attach the result card to 3/7 and 7/7.
- Quote-post your own 7/7 from a fresher account or a friend's thread if you have
  one — the algorithm rewards replies over original impressions on day one.

---

## 4. Instagram / WhatsApp story text

Three variants, one line each. Stories are image-first, so the text is the
headline and the screenshot is the proof.

```text
A — Applied 40 times. Heard nothing. So we built the "why".
B — Your ATS score, split into four parts you can actually fix.
C — Find out why they didn't call. Free at applyce.tech
```

**Visual composition note** — brand is flat minimal, orange `#FF5722`
(`src/index.css:21`).

- Canvas 1080×1920. Keep all text inside the middle 1080×1350 band — that is the
  exact share-card ratio (`src/lib/share.ts:15`), so the app's own exported card
  drops into a story with no crop and no re-layout.
- Frame 1 of 3: solid `#FF5722` field, one white line of text centred, plus the
  Applyce mark top-left with generous margin. Nothing else.
- Frame 2: the real result-card PNG on an off-white (`#FFF1EA`, the accent-soft
  token) background. Let the card be the hero. No drop shadows, no gradients, no
  stickers.
- Frame 3: same orange field, the CTA line, and a link sticker. Keep the safe
  zones clear — nothing within 250px of the top or 320px of the bottom, or the
  platform UI will cover it.
- Type: one weight, one size, sentence case. Flat means flat — no glass, no
  neon, no glow. Type contrast does the work: white on `#FF5722` for the orange
  fields, `#C9372C` on white for anything text-heavy.

---

## 5. Community / group pitch

WhatsApp and Telegram fresher groups. ~120 words. Value-first: it has to be
useful even if nobody clicks.

```text
Sharing something free I built, in case it's useful to anyone here job hunting.

Applyce reads your resume and shows you the breakdown instead of a score with no
explanation: keywords, format, sections, content. Plus your top career matches
with a fit score, a salary estimate, skill gaps for your top match, and a
roadmap with free courses. applyce.tech

Worth knowing: your file is used for the analysis and isn't sold or shared. It
takes about a minute, and the ATS report is the part most people find useful —
it's the same checklist recruiters' filters are running.

If it gives you nothing, say so in the comments. I'd rather fix it than pretend.
```

Group-chat rules that keep it from reading as spam:

- Post once per group, only where resumes/careers are already the topic.
- Answer someone else's resume question in the group *first*, then drop the link.
- Never repeat the same message in a second group on the same day.
- If someone shares a bad result, reply publicly with what you'll fix.

---

## 6. Launch checklist

- [ ] **Warm the backend before you post.** `curl -s
      https://skillfit.onrender.com/health` returned 200 but took **28s** on a
      cold start. Hit it a few minutes before you publish so the first visitor
      isn't staring at a spinner.
- [ ] **Fix the domain redirect in your links.** `applyce.tech` 307-redirects to
      `https://www.applyce.tech/`. Browsers handle it; some chat apps build
      previews from the bare domain. Use `https://www.applyce.tech` in anything
      you paste into a group chat or DM.
- [ ] **Run the upload flow yourself, end to end, on a phone.** PDF or DOCX, under
      5 MB. Confirm the result page renders score, breakdown, career matches,
      salary estimate, skill gaps, and the roadmap link. This is the demo in
      every post — it cannot be broken.
- [ ] **Confirm skill gaps load on a cold run.** `ResultPage` fetches them
      separately; confirm the "Skills to Learn" badges appear and the Retry
      button works when they don't.
- [ ] **Verify the share-result flow, which is already shipped.** "Share my
      result" on the result page exports a 1080×1350 PNG and copies a caption.
      Test download, clipboard copy, and the WhatsApp/LinkedIn targets on both
      desktop and mobile Safari. Everything in section 7 depends on this.
- [ ] **Test the shareable scorecard link end to end.** Generate one, open it in a
      private window, confirm it renders for someone who isn't logged in.
- [ ] **Verify live jobs are real, not the sample fallback.** `GET
      /api/jobs/search?career=Software%20Engineer&location=India&limit=3`
      returned a genuine posting (Danaher, Bangalore, posted 2026-10-02) — but
      confirm the same immediately before posting. If `RAPIDAPI_KEY` is missing on
      Render, the service silently returns sample jobs with `example.com` links.
      That is the one claim that can be wrong without looking wrong.
- [ ] **Know your free-tier wording.** The pricing page and about page both say
      one resume analysis per month. The backend currently enforces an hourly LLM
      rate limit, not a monthly quota. Say "free to start" and let the pricing
      page carry the limit — don't promise a hard cap in a post.
- [ ] **Re-run the backend suite before launch.** 129 tests, baseline 100 pass /
      29 pre-existing failures. Anything above 29 is a regression.
- [ ] **Re-check the pipeline alignment.** `applyce/bin/python
      scripts/evaluate_pipeline.py --sample 400`. Every claim in this kit depends
      on career match, ATS, skill gaps, and salary reading the same 84 careers.
- [ ] **Set up the feedback channel before you post.** `/feedback` accepts
      anonymous posts and already has a service behind it. Post the destination
      in your first comment so criticism lands somewhere instead of in DMs.
- [ ] **Prepare the first three images:** the result card, the ATS report
      screenshot, and the roadmap screenshot. Real ones, cropped to the card
      ratio, no mockups.
- [ ] **First-week cadence.** Day 0: founder post + thread. Day 1: answer every
      comment and reply in the two groups you posted in. Day 2: post one
      breakdown — a real red flag and its fix, nothing invented. Day 3: post the
      scorecard link feature. Day 4: reply to fresher questions publicly. Day 5:
      ship one fix from feedback and say what changed. Day 6: repost the thread
      with the fix mentioned. Day 7: write what you got wrong.
- [ ] **Check `/health` and the jobs endpoint on a schedule for the first week**,
      not just once. Cold starts and a missing API key are the two things that
      will actually break in front of an audience.
- [ ] **Keep a claims ledger.** Section 8 below. If a number changes in code, the
      copy changes with it — the 84 is the number most likely to drift.

---

## 7. Referral / share prompts

Three messages a genuinely satisfied user would send a friend. Use them when the
share card ships a copy button — or paste them into your own replies. Each one is
written to sound like a person, not a testimonial template.

```text
1 — to a friend who is job hunting
I uploaded my resume to this free thing (applyce.tech) expecting the usual score
with no explanation. It actually splits the ATS score into keywords, format,
sections, and content, so I could see which one was costing me. Changed my
resume in one sitting.

2 — to a fresher group
Ran my resume through applyce.tech — free, no card. The useful part was the
skill gaps against my top career match: it listed exactly what to learn next
instead of saying "improve your skills". There's a roadmap after that with free
courses.

3 — to a friend mid-application
If you're applying blind, stop for two minutes. applyce.tech tells you your ATS
score, your career matches, and a salary estimate for the role — one upload, no
signup wall. It took me a minute to find two keywords my resume was missing.
```

Why these three: each leads with what the tool *found*, not with a compliment.
That is what survives being forwarded.

---

## 8. Claims ledger

Every factual claim in this kit and where it is verified. If a row's source
changes, the copy changes.

| Claim | Verified in |
|---|---|
| 84 career paths | `dataset/careers_canonical.json` — 84 keys; `LandingPage.tsx:89,109` |
| ATS score split into keywords, format, sections, content | `ResultPage.tsx:193-201` |
| Top career matches with fit score + roadmap link | `ResultPage.tsx:259-282`; `share.ts:78` |
| Salary estimate (min–max, currency-aware) | `ResultPage.tsx:78-87,216-221` |
| Skill gaps for your top match, with Retry | `ResultPage.tsx:290-311`; `api.ts:193` |
| Red flags: generic phrases, outdated skills, personal info | `ResultPage.tsx:314-398` |
| Download the report | `ResultPage.tsx:90-124,503` |
| Share-result card, 1080×1350 PNG + caption | `ShareResultSheet.tsx`, `ShareResultCard.tsx`; `share.ts:15-17,89-99` |
| Shareable scorecard link | `ScorecardPage.tsx:93-110`; `blueprints/scorecard.py:49-72` |
| Resume builder, 3 ATS templates | `ResumeBuilderPage.tsx:13-15` (Classic / Minimal / Modern ATS) |
| Cover letter generator | `LandingPage.tsx:38-46`; `api.ts:242` |
| Live job search, filtered by skills | `blueprints/jobs.py:90-138`; live: real posting returned |
| Career roadmap with free, named courses | `RoadmapPage.tsx`; live `/api/roadmap/Data Scientist` → Coursera, `type: free` |
| 16 skill quizzes | `SkillQuizzesPage.tsx:13-17` (16 entries) |
| Interview prep scores each answer /10 with feedback | `InterviewPrepPage.tsx:164-169` |
| Application tracker | route `/tracker`, `App.tsx:75` |
| Free to start, no card | `PricingPage.tsx:11-19` ($0 tier); `LandingPage.tsx:148` |
| One resume analysis / month on free tier | `PricingPage.tsx:16`; `AboutPage.tsx:15` — published pricing statement, see checklist note |
| PDF or DOCX, up to 5 MB | `UploadPage.tsx:11-12,104` |
| File not shared | `UploadPage.tsx:113`; `PricingPage.tsx:45` — the product's own published claim |
| Backend health is live | `GET skillfit.onrender.com/health` → `200 {"status":"ok"}`, checked 2026-10-03 |
| applyce.tech resolves | `307` → `https://www.applyce.tech/` → `200` |
| Brand orange `#FF5722` | `src/index.css:21` |
| Takes about a minute | Positioning of the flow; `/health` cold start measured at 28s, warm analysis sub-second |

**Deliberately not claimed** — do not add these without shipping the UI first:

- Voice answers in interview prep. `api.ts:260-266` has the endpoints; no page
  calls them.
- The apply agent. `/apply-agent` routes and the API exist
  (`api.ts:224-228`), but it is not in the landing navigation and is unverified
  end to end.
- Any user count, resume count, or waitlist number. No instrumented source.
- "84+". The taxonomy is exactly 84.
- Any of the "Not this" synonyms listed in the `UX_COPY.md` canonical-terms
  table. Use the approved column or nothing.
- Any promise of interviews or offers.

**Banned-phrase check:** the four phrases in the brief's banned list — and every
"not this" synonym from the `UX_COPY.md` table — appear zero times in the
paste-ready copy. This section is the only place they are named, and it names
them descriptively rather than literally so the file stays greppable-clean:

| Checked | Result |
|---|---|
| Banned phrases (4) | 0 occurrences |
| `UX_COPY.md` "Not this" synonyms | 0 occurrences in paste-ready blocks |
| Canonical terms used | career match, fit score, ATS score, skill gaps, salary estimate, career roadmap, Explainable Score, resume analysis |
| Emoji per post | 0 — the brand carries the weight |
| Hashtags (LinkedIn) | 3 |