# Project Design Document
## Agent-Readable Skills Infrastructure — Interactive Learning Curriculum

**Version:** 1.1  
**Status:** Active development — Phases 1, 2, 3, and 4a complete. Next: Phase 4b (Modules 4, 5, 6)  
**Last updated:** End of "Coaching System Review" conversation  

---

## Purpose of This Document

This document is the authoritative briefing file for all future conversations in this project. Every new conversation should read this document before beginning work. It captures decisions already made, patterns already established, and the full implementation plan so that no decision needs to be re-litigated and no context needs to be reconstructed from scratch.

---

## Project Overview

This project builds a complete, interactive, AI-assessed learning curriculum for a non-developer adult learner. The subject is **Agent-Readable Skills Infrastructure** — the practice of writing `skill.markdown` files that replace brittle ad-hoc LLM prompts with deterministic, version-controlled behavioral contracts for enterprise AI systems.

The curriculum has three levels and nine modules. All instructional content has been authored and exists in the project file `Agent_Skills_Curriculum.docx`. The engagement tracker, flashcard system, and Level 1 modules (1–3) are complete. The work remaining is encoding Level 2 (Modules 4–6) and Level 3 (Modules 7–9) into interactive lesson artifacts, then building the progress dashboard.

The learning system is grounded in evidence-based principles drawn from the project's reference files: chunking, spaced repetition, retrieval practice, interleaving, deliberate practice, illusion-of-competence detection, focused vs. diffuse modes, and habit formation.

---

## Project Files

| File | Purpose |
|---|---|
| `module1-lesson.jsx` | Interactive lesson — Module 1 (complete, enhanced, canonical template) |
| `module2-lesson.jsx` | Interactive lesson — Module 2 (complete) |
| `module3-lesson.jsx` | Interactive lesson — Module 3 (complete) |
| `engagement-tracker.jsx` | Phase 1 artifact — engagement tracking, scores, timestamps, session logs |
| `flashcard-system.jsx` | Phase 2 artifact — adaptive flashcard review with Leitner box SRS |
| `Agent_Skills_Curriculum.docx` | Full authored curriculum content for all 9 modules — source of truth for lesson content |
| `Agent_Readable_Skills_Curriculum.pdf` | Original source curriculum document |
| `In-Section_Activity_Content_Specification.docx` | Activity content specification — used across all nine modules |
| `Learning_How_to_Learn_-_Module_1_Flashcards.docx` | Learning science reference — flashcard principles |
| `Learning_How_to_Learn_-_Module_2_Transcripts.docx` | Learning science reference — neuromodulators, chunking, interleaving |
| `Learning_How_to_Learn_-_Module_3_1.docx` | Learning science reference — procrastination and habit formation |
| `Learning_How_to_Learn_-_Module_3_2.docx` | Learning science reference — memory techniques |
| `Learning_How_to_Learn_-_Module_3_2_Answer_Key.docx` | Learning science reference — memory answer key |
| `What_is_a_Chunk_Transcript.docx` | Learning science reference — chunking transcript |
| `PROJECT_DESIGN_DOCUMENT.md` | This file |

**Files to be created (not yet built):**

| File | Phase | Purpose |
|---|---|---|
| `module4-lesson.jsx` through `module6-lesson.jsx` | Phase 4b | Interactive lessons for Modules 4–6 (Level 2) |
| `module7-lesson.jsx` through `module9-lesson.jsx` | Phase 4c | Interactive lessons for Modules 7–9 (Level 3) |
| `progress-dashboard.jsx` | Phase 5 | Home screen showing all modules, flashcard queue, recommended next action |

---

## Curriculum Map

### Level 1 — Foundations
| Module | Title | Status |
|---|---|---|
| 1 | Why Skills Matter: The Problem With Prompts | ✅ Built (enhanced — canonical template) |
| 2 | Anatomy of a Skill Primitive | ✅ Built |
| 3 | Writing Your First Skill | ✅ Built |

### Level 2 — Intermediate
| Module | Title | Status |
|---|---|---|
| 4 | Agentic Contracts | Not built |
| 5 | Composability & Pipelines | Not built |
| 6 | Debugging Failure Modes | Not built |

### Level 3 — Advanced
| Module | Title | Status |
|---|---|---|
| 7 | Governance Tiers | Not built |
| 8 | Quantitative Testing | Not built |
| 9 | Enterprise Deployment | Not built |

---

## Design System

All artifacts in this project use a consistent design system. Do not deviate from these values without explicit instruction.

### Color Palette

```javascript
const G = {
  navy:   "#0F1B2D",   // primary background
  navyM:  "#162236",   // header, sidebar background
  navyL:  "#1D2E45",   // elevated surfaces, callout backgrounds
  slate:  "#2A3F5C",   // inactive UI elements
  muted:  "#4A6080",   // secondary labels
  border: "#2E4060",   // all borders
  amber:  "#E8A835",   // primary accent, active states, headings
  amberL: "#F5C055",   // amber highlight, gradient end
  cream:  "#F5F0E8",   // primary heading text
  creamD: "#E8E0D0",   // secondary heading text
  text:   "#D8CFC0",   // body text
  textD:  "#A09888",   // muted body text, labels
  red:    "#C44040",   // warning states, incorrect answers
  green:  "#3A9E6E",   // success states, correct answers
  white:  "#FFFFFF",   // high-contrast text on dark surfaces
  code:   "#0D2030",   // code block backgrounds
};
```

### Typography

```
Display / Section titles:  Crimson Pro (serif) — weights 300, 400, 600 including italic
UI / Body / Buttons:       DM Sans (sans-serif) — weights 300, 400, 500, 600
Code blocks / Monospace:   JetBrains Mono — weights 400, 500
```

Google Fonts import string (always include at top of CSS):
```
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Layout

- Shell: CSS Grid, `grid-template-columns` driven by `sidebarOpen` state
- Sidebar expanded: 260px | Sidebar collapsed: 44px
- Header: 56px fixed height, `grid-column: 1 / -1`
- Main content: max-width 820px, padding `48px 56px 80px`
- **Critical:** `.lesson-main` MUST have `background: ${G.navy}` explicitly set — Claude artifact iframes default to white, which breaks all text contrast

### Component Inventory

Every lesson module uses these components. Build them identically in each module file — do not import across files, as each artifact is self-contained.

| Component | Class/Pattern | Notes |
|---|---|---|
| Section eyebrow | `.sec-eyebrow` | Amber, uppercase, 11px, letter-spaced |
| Section title | `.sec-title` | Crimson Pro, 34px, cream |
| Section subtitle | `.sec-sub` | Crimson Pro, 22px, text |
| Body prose | `.prose` | DM Sans, with `strong` → cream, `em` → amberL |
| Bullet list | `ul.content-list` | Custom amber chevron, no standard list markers |
| Insight callout | `.callout.callout-insight` | navyL background, amber left border |
| Warning callout | `.callout.callout-warning` | `#2A1515` background, red left border |
| Tip callout | `.callout.callout-tip` | `#0F2A1D` background, green left border |
| Compare grid | `.compare-grid` | 2-column, red-tinted left / green-tinted right |
| Code block | `.code-block pre` | JetBrains Mono, `#8EC8F0` text on `#0D2030` |
| Recall box | `.recall-box` | navyL, amber border, Claude-assessed free text |
| Quiz option | `.quiz-option` | Multi-state: default / selected / correct / wrong / locked |
| Feedback box | `.feedback-box` | Three variants: correct (green), partial (gold), incorrect (red) |
| Primary button | `.btn.btn-primary` | Amber background, navy text |
| Next button | `.btn.btn-next` | navyL background, amber text and border |
| Spinner | `.spinner` | CSS animation, amber top-border |

---

## Quiz Component Design Requirements

**These three requirements are mandatory for all quiz components in all modules. They exist because a flaw in the pre-Phase-3 `module1-lesson.jsx` allowed correct answers to be identified without answering the question. Phase 3 corrects that artifact. All subsequent builds must comply from the start.**

### 1. Randomized Answer Positions

Correct answers must never occupy a predictable position. Store each question as an object with labeled options and a `correctIndex` field pointing to the correct answer, then shuffle the options array at render time before displaying.

```javascript
// Data structure
const question = {
  text: "Question text here",
  options: [
    { text: "Correct answer", correct: true },
    { text: "Distractor A",   correct: false },
    { text: "Distractor B",   correct: false },
    { text: "Distractor C",   correct: false },
  ],
};

// Shuffle before render — call once per question on component mount
function shuffleOptions(options) {
  return [...options].sort(() => Math.random() - 0.5);
}

// In component — map over the questions array, shuffle each question's options once on mount
const [shuffled] = useState(() => QUIZ_QUESTIONS.map(q => ({
  ...q,
  options: shuffleOptions(q.options)
})));
```

The correct answer must appear in positions A, B, C, and D with roughly equal frequency across a session. No hardcoded position is acceptable.

### 2. Uniform Pre-Selection Styling

All four answer choices must be visually identical before the student submits. No option may carry styling — color, weight, border, background, padding — that distinguishes it from the others in the unselected state. The existing design system color states apply only *after* submission:

| State | When applied | Style |
|---|---|---|
| Default (unselected) | Before submission | `navyL` background, `border` border, `text` text — identical for all options |
| Selected (pending) | After click, before submit | `slate` background, `amber` border — identical regardless of correctness |
| Correct (revealed) | After submission, correct option | `green` left border or background tint |
| Incorrect (revealed) | After submission, wrong selection | `red` left border or background tint |
| Locked | After submission, all options | Pointer events disabled |

The `correct: true` field in the data structure must never drive any CSS class or inline style before the answer is submitted.

### 3. Answer Key Separation (Static Documents)

This requirement applies when quiz content appears in any static or printable format (PDF supplements, worksheets, or reference documents):

- The answer key must appear on a separate page or clearly delineated section, not inline with the questions.
- At the question block, include a conspicuous instruction directing the student to the key, e.g.: *"Answer key for questions 1–5: see Answer Key section, p. 7."*
- This requirement does not apply to interactive `.jsx` artifacts (answers are revealed only after submission), but the randomization and styling requirements above still apply to those.

---

## Sidebar Collapse Pattern

The sidebar is collapsible. This pattern must be replicated in all lesson modules and the dashboard.

```jsx
// State
const [sidebarOpen, setSidebarOpen] = useState(true);

// Shell — inline style drives grid columns
<div className="lesson-shell" 
  style={{ gridTemplateColumns: sidebarOpen ? "260px 1fr" : "44px 1fr" }}>

// Sidebar — collapsed class hides labels, centers dots
<nav className={`lesson-sidebar ${sidebarOpen ? "" : "collapsed"}`}
  style={{ background: G.navyM, borderRight: `1px solid ${G.border}`, 
           overflowY: "auto", padding: "16px 0", transition: "width .25s ease" }}>
  <div className="sidebar-toggle-row">
    {sidebarOpen && <span className="sidebar-section-label">Contents</span>}
    <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
      {sidebarOpen ? "←" : "→"}
    </button>
  </div>
  {SECTIONS.map((sec, idx) => (
    <div className={`sidebar-item ${idx === sectionIdx ? "active" : ""} 
                    ${completed.has(sec.id) ? "completed" : ""}`}
         onClick={() => goTo(idx)}
         title={!sidebarOpen ? sec.label : undefined}>
      <div className="si-dot" />
      {sidebarOpen && <div className="si-label">{sec.label}</div>}
    </div>
  ))}
</nav>
```

---

## API Assessment Pattern

All recall and quiz feedback uses a live Claude API call. This is the established pattern — replicate exactly.

```javascript
async function assessWithClaude(systemPrompt, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });
  const data = await res.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { grade: "partial", label: "Feedback", message: text };
  }
}
```

**Recall assessment system prompt returns:**
```json
{ "grade": "correct|partial|incorrect", "label": "2-4 word verdict", "message": "instructor feedback" }
```

**Quiz explanation system prompt returns:**
```json
{ "message": "2-3 sentence explanation" }
```

---

## Module File Structure

Every lesson module (module1 through module9) follows this identical structure. The content changes; the scaffolding does not.

```
SECTIONS array: [intro, content-1, content-2, content-3, content-4, recall, quiz, complete]

Each module contains:
  - SectionIntro          — module overview, learning objectives, time estimate
  - 4× Content Sections   — reading material with callouts, lists, code blocks, compare grids
  - SectionRecall         — 3 open-ended questions, Claude-assessed
  - SectionQuiz           — 3–5 multiple choice questions, Claude-explained
  - SectionComplete       — weighted score, recommendation, spaced repetition reminder

Score weighting:
  - Recall correct  = 2 points
  - Recall partial  = 1 point
  - Quiz correct    = 2 points
  - Score ≥ 80%     → advance recommendation
  - Score 55–79%    → review gaps before advancing
  - Score < 55%     → re-read module
```

---

## Persistent Storage Pattern

Phases 1–5 use the artifact persistent storage API. This is available in Claude artifacts via `window.storage`. Key rules:

- Keys: hierarchical, under 200 chars, no whitespace/slashes/quotes — e.g., `engagement:module1:recall:r1`
- Values: JSON strings under 5MB per key
- `shared: false` (default) — data is per-user, not shared
- Always wrap in try/catch; non-existent keys throw rather than returning null
- Batch related data into single keys to minimize sequential storage calls

```javascript
// Write
await window.storage.set('engagement:module1:recall:r1', 
  JSON.stringify({ grade: 'partial', timestamp: Date.now() }));

// Read
try {
  const result = await window.storage.get('engagement:module1:recall:r1');
  const data = result ? JSON.parse(result.value) : null;
} catch (e) {
  // key doesn't exist yet
}
```

---

## Phase 3 Enhancements — Completed

These features were added to `module1-lesson.jsx` in Phase 3 and are now part of the canonical module template. All subsequent module builds (4–9) must include them.

1. **Pre-lesson prediction prompt** — Before content begins, asks: "Before reading, write one sentence about what you think causes AI prompts to fail at scale." Assessed by Claude, logged to engagement tracker.
2. **Written summary assignment** — After the quiz, before the score screen: "In 3–5 sentences, summarize what a skill primitive is and why it matters." Claude-assessed, logged.
3. **Pomodoro timer** — 25-minute countdown visible in header. At expiry: callout prompts a break before continuing.
4. **Review mode** — If engagement log shows module previously completed, displays a "REVIEW" badge in header and hides prior answers so retrieval must happen fresh.
5. **Engagement log writes** — On every recall submission and quiz answer, writes result + timestamp to the engagement tracker via `window.storage`.

---

## Flashcard Inventory

All flashcard content is sourced from `Agent_Skills_Curriculum.docx`. Each module's flashcard reference section defines the cards for that module.

### Leitner Box Schedule
| Box | Review frequency | Promoted from |
|---|---|---|
| Box 1 (New) | Every session | Initial state |
| Box 2 | Every 2 days | Correct in Box 1 |
| Box 3 | Every 4 days | Correct in Box 2 |
| Box 4 | Every 7 days | Correct in Box 3 |
| Box 5 | Every 14 days | Correct in Box 4 |

A card demotes one box on an incorrect answer. Cards in Box 5 with a correct answer stay in Box 5.

### Card ID Convention
`fc-m[module]-[sequence]` — e.g., `fc-m1-01` through `fc-m1-10` for Module 1's 10 cards.

### Level 1 Cards (Module 1) — 10 cards
| ID | Term | Definition |
|---|---|---|
| fc-m1-01 | skill.markdown | A structured markdown file in a dedicated directory providing a deterministic, version-controlled behavioral contract for an LLM to execute. |
| fc-m1-02 | Routing Description | The single-line frontmatter field an LLM gateway uses to match user intent to a skill. Must contain concrete trigger phrases and output shape. |
| fc-m1-03 | Routing Failure | Occurs when the model fails to invoke a skill despite a matching query — typically caused by a vague or multi-line description. |
| fc-m1-04 | Reasoning Framework | Declarative decision principles in the skill body that allow the model to generalize to unanticipated situations. |
| fc-m1-05 | Deterministic Output Spec | An explicit schema defining exact output structure — columns, fields, row counts — that downstream agents parse reliably. |
| fc-m1-06 | Edge Case Documentation | Explicit instructions for constraint failure states replacing the model's default hallucinated behavior with defined policy. |
| fc-m1-07 | Pattern-Matching Exemplar | Static example output stored in the skill directory providing few-shot performance anchoring. |
| fc-m1-08 | Contextual Economy | The discipline of keeping skill files under 150 lines to prevent context window overrun in production gateways. |
| fc-m1-09 | 150-Line Constraint | Maximum recommended skill file length, enforced to maintain context efficiency and design discipline. |
| fc-m1-10 | Brittle Prompt | A conversational, ad-hoc prompt lacking a deterministic contract — behaves inconsistently and cannot be reliably versioned or tested. |

*(Cards for Modules 2–9 to be added as each module is built in Phase 4.)*

---

## Five-Phase Implementation Plan

### Phase 1 — Engagement Tracker ✅ Complete
**Deliverable:** `engagement-tracker.jsx` — saved to project  
**Stores:** Module completion timestamps, recall grades per question ID, quiz results per question ID, flashcard review history, session start/end times, written summary grades

### Phase 2 — Flashcard System ✅ Complete
**Deliverable:** `flashcard-system.jsx` — saved to project  
**Behavior:** Reads engagement log to determine due cards per Leitner box schedule; shows cards in randomized due-order; accepts know-it/almost/didn't-know response; writes result back to engagement tracker

### Phase 3 — Enhanced Module 1 ✅ Complete
**Deliverable:** Updated `module1-lesson.jsx` — saved to project, now the canonical template  
**Changes delivered:** Five enhancements listed in Phase 3 Enhancements section above

### Phase 4a — Modules 2 and 3 ✅ Complete
**Deliverables:** `module2-lesson.jsx`, `module3-lesson.jsx` — saved to project  
**Content source:** `Agent_Skills_Curriculum.docx` — Level 1 modules

### Phase 4b — Modules 4, 5, and 6
**Conversation scope:** Single focused conversation  
**Deliverables:** `module4-lesson.jsx`, `module5-lesson.jsx`, `module6-lesson.jsx`  
**Content source:** `Agent_Skills_Curriculum.docx` — Level 2 modules  
**Opening prompt:**  
*"I'm working on Phase 4b of the Agent-Readable Skills curriculum project. Please read the PROJECT_DESIGN_DOCUMENT.md and module1-lesson.jsx as the template. We are building Modules 4, 5, and 6 using content from Agent_Skills_Curriculum.docx."*

### Phase 4c — Modules 7, 8, and 9
**Conversation scope:** Single focused conversation  
**Deliverables:** `module7-lesson.jsx`, `module8-lesson.jsx`, `module9-lesson.jsx`  
**Content source:** `Agent_Skills_Curriculum.docx` — Level 3 modules  
**Opening prompt:**  
*"I'm working on Phase 4c of the Agent-Readable Skills curriculum project. Please read the PROJECT_DESIGN_DOCUMENT.md and module1-lesson.jsx as the template. We are building Modules 7, 8, and 9 using content from Agent_Skills_Curriculum.docx."*

### Phase 5 — Progress Dashboard
**Conversation scope:** Single focused conversation  
**Deliverable:** `progress-dashboard.jsx` saved to project  
**Features:** Module status cards with last-accessed date and best score; flashcard queue showing cards due today and overdue count; "Recommended Next Action" derived from engagement log; links to launch any module or flashcard review; Leitner box retention visualization  
**Opening prompt:**  
*"I'm working on Phase 5 of the Agent-Readable Skills curriculum project. Please read the PROJECT_DESIGN_DOCUMENT.md. All module files and the engagement-tracker.jsx and flashcard-system.jsx should be in the project. We are building the progress-dashboard.jsx that ties everything together."*

---

## Decisions Made — Do Not Revisit Without Good Reason

- **No localStorage or sessionStorage** — not supported in Claude artifacts. Use `window.storage` only.
- **Each artifact is self-contained** — no imports between files. Shared components (Spinner, FeedbackBox, etc.) are duplicated in each module file.
- **Leitner box, not SM-2** — simpler to implement in browser artifact, no floating-point intervals, well-validated for this material type.
- **claude-sonnet-4-20250514** — model used for all API assessment calls. Do not substitute without testing.
- **max_tokens: 1000** — sufficient for all assessment responses. Do not increase without reason.
- **Dark theme only** — no light/dark toggle. The dark theme is intentional and consistent.
- **Collapsible sidebar default: open** — `useState(true)` in every module and in the dashboard.
- **Score weighting: recall correct = 2pts, recall partial = 1pt, quiz correct = 2pts** — consistent across all modules.
- **Module structure: always 4 content sections** — intro + 4 content + recall + quiz + complete = 8 sidebar items.

---

## Learner Profile Notes

- Adult learner, non-developer background — applies to both the builder role and the student role
- Engages seriously and methodically with material
- Responsive to direct feedback without excessive softening
- Asks precise, practical questions — does not need concepts over-explained
- Do not assume familiarity with React, Node.js, or API concepts beyond what the curriculum itself covers — this applies in both builder and student contexts
- Has not yet completed a formal learning session (Modules 1–3 are built and ready; learning has not yet begun)

---

## Open Items — Planned but Not Yet Built

These were identified during the "Coaching System Review" conversation and should be addressed in future work.

1. **Per-module reset in engagement-tracker.jsx** — Current reset options are global (all data, all flashcards, all sessions). A per-module reset is needed to clear test data from a specific module under active development without wiping legitimate learning history from completed modules. Add to the tracker's data management section.

2. **Coaching system prompt corrections** — Two corrections are needed to the learning coach system prompt used in this project:
   - *Engagement data access:* The coach cannot query `window.storage` directly. The coach must ask the student to report current scores, last session date, and Leitner box states from the tracker or dashboard before making spaced repetition recommendations. The current instruction implies direct access that does not exist.
   - *Scoring rubric:* Add explicit notation of the scoring convention — recall correct = 2pts, recall partial = 1pt, quiz correct = 2pts — so manual chat-based assessments are consistent with what the artifacts apply.

---

## Document Maintenance Protocol

**The document drifts because updating it is the last thing on your mind when a phase finishes.** To prevent this, add the following as a closing step to every phase conversation before ending it:

*"Update the PROJECT_DESIGN_DOCUMENT.md to reflect what was completed in this conversation: [brief description of what was built or decided]. Mark the relevant phases and modules as complete, add any new decisions to the Decisions Made section, and update the status line at the top."*

This is a one-prompt ritual. It takes less than a minute and keeps every future conversation fully oriented.

---

*End of document. Update this file when significant decisions are made or the plan changes.*
