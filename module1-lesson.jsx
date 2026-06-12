import { useState, useRef, useEffect } from "react";

// ── palette & global styles ──────────────────────────────────────────────────
const G = {
  navy:   "#0F1B2D",
  navyM:  "#162236",
  navyL:  "#1D2E45",
  slate:  "#2A3F5C",
  muted:  "#4A6080",
  border: "#2E4060",
  amber:  "#E8A835",
  amberL: "#F5C055",
  cream:  "#F5F0E8",
  creamD: "#E8E0D0",
  text:   "#D8CFC0",
  textD:  "#A09888",
  red:    "#C44040",
  green:  "#3A9E6E",
  white:  "#FFFFFF",
  code:   "#0D2030",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${G.navy};
    color: ${G.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    line-height: 1.7;
  }

  .lesson-shell {
    display: grid;
    grid-template-rows: 56px 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* header */
  .lesson-header {
    grid-column: 1 / -1;
    background: ${G.navyM};
    border-bottom: 1px solid ${G.border};
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
  }
  .header-badge {
    background: ${G.amber};
    color: ${G.navy};
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 4px;
  }
  .header-title {
    font-family: 'Crimson Pro', serif;
    font-size: 18px;
    font-weight: 400;
    color: ${G.cream};
    flex: 1;
  }
  .progress-bar-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .progress-bar-track {
    width: 160px;
    height: 4px;
    background: ${G.slate};
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, ${G.amber}, ${G.amberL});
    border-radius: 2px;
    transition: width .5s ease;
  }
  .progress-label {
    font-size: 12px;
    color: ${G.textD};
    min-width: 40px;
    text-align: right;
  }
  .timer-display {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: ${G.textD};
    background: ${G.navyL};
    border: 1px solid ${G.border};
    border-radius: 5px;
    padding: 3px 10px;
    letter-spacing: .06em;
    flex-shrink: 0;
    transition: color .3s, border-color .3s;
  }
  .timer-warning { color: ${G.amber}; border-color: ${G.amber}60; }
  .timer-expired { color: ${G.red}; border-color: ${G.red}60; animation: timerPulse 2s ease-in-out infinite; }
  @keyframes timerPulse { 0%,100% { opacity:1; } 50% { opacity:.6; } }
  .break-banner { background: #1A1000; border: 1px solid ${G.amber}60; border-radius: 6px; padding: 14px 20px; margin: 0 0 24px; display: flex; align-items: center; gap: 12px; font-size: 14px; }
  .break-banner-icon { font-size: 20px; }

  /* sidebar */
  .lesson-sidebar {
    background: ${G.navyM};
    border-right: 1px solid ${G.border};
    overflow-y: auto;
    padding: 20px 0;
  }
  .sidebar-section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: ${G.muted};
    padding: 8px 20px 6px;
  }
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 20px;
    cursor: pointer;
    transition: background .15s;
    border-left: 2px solid transparent;
  }
  .sidebar-item:hover { background: ${G.navyL}; }
  .sidebar-item.active {
    background: ${G.navyL};
    border-left-color: ${G.amber};
  }
  .sidebar-item.completed .si-dot { background: ${G.green}; }
  .si-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${G.slate};
    flex-shrink: 0;
    transition: background .3s;
  }
  .si-label {
    font-size: 13px;
    color: ${G.textD};
    line-height: 1.3;
  }
  .sidebar-item.active .si-label { color: ${G.cream}; }

  /* main */
  .lesson-main {
    background: ${G.navy};
    overflow-y: auto;
    padding: 48px 56px 80px;
  }
  .lesson-main-inner { max-width: 820px; }

  /* sidebar collapse */
  .lesson-sidebar {
    transition: width .25s ease;
    overflow: hidden;
  }
  .lesson-sidebar.collapsed {
    padding: 20px 0 20px;
  }
  .sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 5px;
    background: ${G.slate};
    border: none;
    cursor: pointer;
    color: ${G.textD};
    font-size: 14px;
    flex-shrink: 0;
    transition: background .15s, color .15s;
    margin: 0 auto 8px;
  }
  .sidebar-toggle:hover { background: ${G.amber}30; color: ${G.amber}; }
  .sidebar-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px 4px;
  }
  .collapsed .sidebar-toggle-row {
    justify-content: center;
    padding: 0 0 4px;
  }
  .collapsed .sidebar-section-label,
  .collapsed .si-label { display: none; }
  .collapsed .sidebar-item {
    justify-content: center;
    padding: 8px 0;
  }
  .collapsed .si-dot { margin: 0; }

  /* typography */
  .sec-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: ${G.amber};
    margin-bottom: 10px;
  }
  .sec-title {
    font-family: 'Crimson Pro', serif;
    font-size: 34px;
    font-weight: 600;
    color: ${G.cream};
    line-height: 1.25;
    margin-bottom: 8px;
  }
  .sec-sub {
    font-family: 'Crimson Pro', serif;
    font-size: 22px;
    font-weight: 400;
    color: ${G.text};
    line-height: 1.35;
    margin-bottom: 24px;
  }
  .prose { color: ${G.text}; margin-bottom: 18px; }
  .prose strong { color: ${G.cream}; font-weight: 600; }
  .prose em { color: ${G.amberL}; font-style: italic; }

  h3 {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: ${G.amber};
    margin: 28px 0 12px;
  }

  ul.content-list {
    list-style: none;
    padding: 0;
    margin-bottom: 18px;
  }
  ul.content-list li {
    padding: 6px 0 6px 20px;
    position: relative;
    color: ${G.text};
    border-bottom: 1px solid ${G.border}20;
  }
  ul.content-list li::before {
    content: '›';
    position: absolute;
    left: 0;
    color: ${G.amber};
    font-size: 16px;
    line-height: 1.4;
  }

  /* callouts */
  .callout {
    border-radius: 6px;
    padding: 16px 20px;
    margin: 24px 0;
    border-left: 3px solid;
  }
  .callout-insight {
    background: ${G.navyL};
    border-color: ${G.amber};
  }
  .callout-warning {
    background: #2A1515;
    border-color: ${G.red};
  }
  .callout-tip {
    background: #0F2A1D;
    border-color: ${G.green};
  }
  .callout-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .callout-insight .callout-label { color: ${G.amber}; }
  .callout-warning .callout-label { color: ${G.red}; }
  .callout-tip .callout-label { color: ${G.green}; }
  .callout p { font-size: 14px; line-height: 1.65; margin: 0; }

  /* compare table */
  .compare-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin: 24px 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid ${G.border};
  }
  .cg-header {
    padding: 10px 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .cg-bad-h { background: #2A1515; color: ${G.red}; }
  .cg-good-h { background: #0F2A1D; color: ${G.green}; }
  .cg-bad { background: #1A0E0E; padding: 16px; font-size: 14px; color: #C08080; font-style: italic; line-height: 1.6; }
  .cg-good { background: #0A1A12; padding: 16px; font-size: 14px; color: #80C0A0; font-style: italic; line-height: 1.6; }
  .cg-note-bad { background: #1A0E0E; padding: 10px 16px; font-size: 12px; color: #906060; border-top: 1px solid ${G.border}30; }
  .cg-note-good { background: #0A1A12; padding: 10px 16px; font-size: 12px; color: #609060; border-top: 1px solid ${G.border}30; }

  /* code block */
  .code-block {
    background: ${G.code};
    border: 1px solid ${G.border};
    border-radius: 6px;
    padding: 16px 20px;
    margin: 16px 0;
    overflow-x: auto;
  }
  .code-block pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
    color: #8EC8F0;
    line-height: 1.7;
    white-space: pre;
  }
  .code-block .cm { color: #6A9060; }
  .code-block .cs { color: #C8A060; }

  /* divider */
  .divider {
    border: none;
    border-top: 1px solid ${G.border};
    margin: 36px 0;
  }

  /* recall check */
  .recall-box {
    background: ${G.navyL};
    border: 1px solid ${G.amber}40;
    border-radius: 8px;
    padding: 24px;
    margin: 32px 0;
  }
  .recall-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }
  .recall-icon {
    width: 32px;
    height: 32px;
    background: ${G.amber}20;
    border: 1px solid ${G.amber}60;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .recall-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: ${G.amber};
    letter-spacing: .06em;
    text-transform: uppercase;
  }
  .recall-sub {
    font-size: 12px;
    color: ${G.textD};
    margin-top: 2px;
  }
  .recall-prompt {
    font-family: 'Crimson Pro', serif;
    font-size: 17px;
    color: ${G.cream};
    margin-bottom: 10px;
    line-height: 1.45;
  }
  .recall-input {
    width: 100%;
    background: ${G.navy};
    border: 1px solid ${G.border};
    border-radius: 6px;
    color: ${G.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    resize: vertical;
    min-height: 72px;
    margin-bottom: 10px;
    outline: none;
    transition: border-color .2s;
  }
  .recall-input:focus { border-color: ${G.amber}80; }
  .recall-input:disabled { opacity: 0.6; }

  /* quiz */
  .quiz-box {
    background: ${G.navyL};
    border: 1px solid ${G.border};
    border-radius: 8px;
    padding: 24px;
    margin: 32px 0;
  }
  .quiz-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: ${G.muted};
    margin-bottom: 16px;
  }
  .quiz-q {
    font-family: 'Crimson Pro', serif;
    font-size: 18px;
    color: ${G.cream};
    line-height: 1.45;
    margin-bottom: 18px;
  }
  .quiz-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  .quiz-option {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid ${G.border};
    border-radius: 6px;
    cursor: pointer;
    transition: all .15s;
    background: ${G.navy};
  }
  .quiz-option:hover:not(.locked) { border-color: ${G.amber}60; background: ${G.navyM}; }
  .quiz-option.selected { border-color: ${G.amber}; background: ${G.amber}10; }
  .quiz-option.correct { border-color: ${G.green}; background: ${G.green}12; }
  .quiz-option.wrong { border-color: ${G.red}; background: ${G.red}10; }
  .quiz-option.locked { cursor: default; }
  .option-letter {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background: ${G.slate};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: ${G.text};
    flex-shrink: 0;
    transition: background .15s, color .15s;
  }
  .quiz-option.selected .option-letter { background: ${G.amber}; color: ${G.navy}; }
  .quiz-option.correct .option-letter { background: ${G.green}; color: ${G.white}; }
  .quiz-option.wrong .option-letter { background: ${G.red}; color: ${G.white}; }
  .option-text { font-size: 14px; color: ${G.text}; line-height: 1.5; padding-top: 2px; }
  .quiz-option.correct .option-text { color: #90D0A8; }
  .quiz-option.wrong .option-text { color: #C08080; }

  /* feedback */
  .feedback-box {
    border-radius: 6px;
    padding: 14px 18px;
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.6;
    animation: fadeIn .3s ease;
  }
  .feedback-correct { background: #0A1A12; border: 1px solid ${G.green}50; color: #90C0A0; }
  .feedback-partial { background: #1A1500; border: 1px solid #8A7020; color: #C0A860; }
  .feedback-incorrect { background: #1A0808; border: 1px solid ${G.red}50; color: #C09090; }
  .feedback-loading {
    background: ${G.navyL};
    border: 1px solid ${G.border};
    color: ${G.textD};
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .fb-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .feedback-correct .fb-label { color: ${G.green}; }
  .feedback-partial .fb-label { color: #D0A030; }
  .feedback-incorrect .fb-label { color: ${G.red}; }

  /* buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all .15s;
    letter-spacing: .02em;
  }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-primary {
    background: ${G.amber};
    color: ${G.navy};
  }
  .btn-primary:hover:not(:disabled) { background: ${G.amberL}; }
  .btn-ghost {
    background: transparent;
    color: ${G.textD};
    border: 1px solid ${G.border};
  }
  .btn-ghost:hover:not(:disabled) { border-color: ${G.amber}60; color: ${G.text}; }
  .btn-next {
    background: ${G.navyL};
    color: ${G.amber};
    border: 1px solid ${G.amber}40;
  }
  .btn-next:hover:not(:disabled) { background: ${G.amber}20; border-color: ${G.amber}; }

  /* nav footer */
  .sec-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid ${G.border};
  }

  /* spinner */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid ${G.border};
    border-top-color: ${G.amber};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  /* score summary */
  .score-card {
    background: ${G.navyL};
    border: 1px solid ${G.border};
    border-radius: 10px;
    padding: 32px;
    text-align: center;
    margin: 24px 0;
  }
  .score-big {
    font-family: 'Crimson Pro', serif;
    font-size: 64px;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 8px;
  }
  .score-label { font-size: 14px; color: ${G.textD}; margin-bottom: 24px; }
  .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; }
  .score-item { background: ${G.navy}; border-radius: 6px; padding: 12px; }
  .score-item-n { font-family: 'Crimson Pro', serif; font-size: 28px; color: ${G.cream}; }
  .score-item-l { font-size: 11px; color: ${G.textD}; margin-top: 2px; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.slate}; border-radius: 3px; }
`;

// ── API helper ───────────────────────────────────────────────────────────────
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

const RECALL_SYSTEM = `You are an expert instructor assessing a student's answer to a recall question about "Agent-Readable Skills Infrastructure" — a framework for writing skill.markdown files that replace brittle LLM prompts with deterministic, version-controlled primitives.

Assess the student's answer and return ONLY a JSON object (no markdown, no explanation outside the JSON):
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "2-4 sentences of instructor feedback that: (1) affirms what they got right if anything, (2) corrects or fills in what was missing, (3) reinforces the key concept in memorable terms. Tone: encouraging but precise. Do not be sycophantic."
}

Grading: "correct" = student captured the essential concept accurately. "partial" = student got part of it but missed something important. "incorrect" = student misunderstood or left blank.`;

const QUIZ_SYSTEM = `You are an expert instructor explaining why a quiz answer is correct or incorrect for a course on "Agent-Readable Skills Infrastructure."

The student selected option {{SELECTED}} ({{CORRECT_OR_NOT}}) for the question.

Return ONLY a JSON object:
{
  "message": "2-3 sentences: explain why the correct answer is right and, if the student was wrong, why their choice was incorrect. Be specific. Use concrete examples from the skill.markdown domain. Tone: clear, informative, not harsh."
}`;

// ── lesson content ────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "intro", label: "Introduction", type: "content" },
  { id: "brittle", label: "1.1 The Brittle Prompt Problem", type: "content" },
  { id: "skill-primitive", label: "1.2 The Skill Primitive", type: "content" },
  { id: "comparison", label: "1.3 A Concrete Comparison", type: "content" },
  { id: "where-skills-live", label: "1.4 Where Skills Live", type: "content" },
  { id: "recall", label: "Recall Check", type: "recall" },
  { id: "quiz", label: "Mini-Quiz", type: "quiz" },
  { id: "complete", label: "Module Complete", type: "complete" },
];

const RECALL_QUESTIONS = [
  {
    id: "r1",
    prompt: "What is the core problem that skill primitives solve? Explain in one or two sentences.",
    rubric: "Looking for: prompts are fluid/conversational/inconsistent, break across model updates or team members, can't be reliably versioned or parsed by agents. The core problem is non-determinism at scale."
  },
  {
    id: "r2",
    prompt: "What is the difference between a brittle prompt and a skill primitive?",
    rubric: "Key distinction: brittle prompts are written for human conversation — they're flexible, ambiguous, hard to version. Skill primitives are structured API-like contracts with defined trigger phrases, output schemas, and edge cases. They're deterministic and machine-parseable."
  },
  {
    id: "r3",
    prompt: "Where does a skill.markdown file live, and why does that location matter?",
    rubric: "Skills live in their own named directory in a version-controlled repository. Location matters because: (1) version control makes skills auditable and recoverable, (2) the directory structure provides organizational hierarchy, (3) it separates skills from chat windows or ad-hoc documents."
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "What is the primary failure mode of conversational prompts used at scale?",
    options: [
      "They are too short to be useful",
      "They are fluid, context-dependent, and hard to version-control — behaving inconsistently across model updates, agents, and team members",
      "They require too much computing power",
      "They cannot be written in markdown"
    ],
    correct: 1,
    explanation: `The correct answer is B. Conversational prompts fail at scale because they were designed for human dialogue — flexible and context-sensitive — not for deterministic machine execution. When a model updates, or a different team member phrases a query differently, or an autonomous agent calls the same prompt hundreds of times, the output structure varies in ways that break downstream processes. Skills solve this by providing a contract instead of a conversation.`
  },
  {
    id: "q2",
    text: "Which analogy best describes the purpose of a skill.markdown file?",
    options: [
      "A personal diary entry",
      "A software function with defined inputs, outputs, and documented edge cases",
      "A freeform brainstorming document",
      "A conversational chat history"
    ],
    correct: 1,
    explanation: `The correct answer is B. Like a software function, a skill has a clear interface — it defines when it fires (the description/trigger), what it does (the reasoning framework), what it returns (the output specification), and where it fails predictably (edge cases). This function-like contract is precisely what makes skills reusable, testable, and composable in ways that ad-hoc prompts are not.`
  },
  {
    id: "q3",
    text: "Why is storing skills in version-controlled repositories important?",
    options: [
      "So they take up less storage space",
      "So they can be shared on social media",
      "So they are auditable, testable, updatable, and recoverable when team members leave",
      "So the AI model can update them automatically"
    ],
    correct: 2,
    explanation: `The correct answer is C. Version control provides all the governance properties that conversational prompts completely lack: you can audit what changed and when, run tests against specific versions, roll back a bad change, and recover a critical skill even after the person who wrote it leaves the organization. Skills are organizational intellectual property — they need the same protection as source code.`
  },
];

// ── components ───────────────────────────────────────────────────────────────
function Spinner() {
  return <div className="spinner" />;
}

function FeedbackBox({ result }) {
  if (!result) return null;
  if (result.loading) {
    return (
      <div className="feedback-box feedback-loading">
        <Spinner /> <span>Assessing your answer…</span>
      </div>
    );
  }
  const cls = `feedback-box feedback-${result.grade}`;
  return (
    <div className={cls}>
      <div className="fb-label">{result.label}</div>
      <div>{result.message}</div>
    </div>
  );
}

function RecallItem({ q, onSubmit }) {
  const [val, setVal] = useState("");
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!val.trim()) return;
    setSubmitted(true);
    setResult({ loading: true });
    const sys = RECALL_SYSTEM;
    const msg = `RECALL QUESTION: ${q.prompt}\n\nRUBRIC (for your reference): ${q.rubric}\n\nSTUDENT ANSWER: ${val}`;
    const res = await assessWithClaude(sys, msg);
    setResult(res);
    onSubmit(res.grade);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="recall-prompt">{q.prompt}</div>
      <textarea
        className="recall-input"
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Type your answer here…"
        disabled={submitted && result && !result.loading}
        rows={3}
      />
      {!submitted || (result && result.loading) ? (
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!val.trim() || (submitted && result?.loading)}
        >
          {result?.loading ? <><Spinner /> Assessing…</> : "Submit Answer"}
        </button>
      ) : null}
      <FeedbackBox result={result} />
    </div>
  );
}

function QuizItem({ q, onResult }) {
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (idx) => {
    if (locked) return;
    setSelected(idx);
    setLocked(true);
    setLoading(true);
    const correct = idx === q.correct;
    const sys = QUIZ_SYSTEM
      .replace("{{SELECTED}}", String.fromCharCode(65 + idx))
      .replace("{{CORRECT_OR_NOT}}", correct ? "which is correct" : "which is incorrect");
    const msg = `QUESTION: ${q.text}\n\nOPTIONS:\n${q.options.map((o, i) => `${String.fromCharCode(65+i)}. ${o}`).join("\n")}\n\nCORRECT ANSWER: ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}\n\nSTUDENT SELECTED: ${String.fromCharCode(65 + idx)}. ${q.options[idx]}`;
    const res = await assessWithClaude(sys, msg);
    setFeedback(res.message || q.explanation);
    setLoading(false);
    onResult(correct);
  };

  const optClass = (idx) => {
    let base = "quiz-option";
    if (locked) base += " locked";
    if (idx === selected && idx === q.correct) base += " correct";
    else if (idx === selected && idx !== q.correct) base += " wrong";
    else if (locked && idx === q.correct) base += " correct";
    else if (idx === selected) base += " selected";
    return base;
  };

  return (
    <div className="quiz-box">
      <div className="quiz-label">Question</div>
      <div className="quiz-q">{q.text}</div>
      <div className="quiz-options">
        {q.options.map((opt, idx) => (
          <div key={idx} className={optClass(idx)} onClick={() => handleSelect(idx)}>
            <div className="option-letter">{String.fromCharCode(65 + idx)}</div>
            <div className="option-text">{opt}</div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="feedback-box feedback-loading"><Spinner /><span>Getting explanation…</span></div>
      )}
      {!loading && feedback && (
        <div className={`feedback-box ${selected === q.correct ? "feedback-correct" : "feedback-incorrect"}`}>
          <div className="fb-label">{selected === q.correct ? "✓ Correct" : "✗ Incorrect"}</div>
          <div>{feedback}</div>
        </div>
      )}
    </div>
  );
}

// ── section renderers ─────────────────────────────────────────────────────────
function SectionIntro({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Level 1 · Module 1</div>
      <div className="sec-title">Why Skills Matter</div>
      <div className="sec-sub">The Problem With Prompts — and a Better Abstraction</div>
      <p className="prose">
        Welcome to Module 1. This lesson introduces the foundational problem that the entire skills infrastructure is built to solve, and the key insight that makes skill.markdown files work.
      </p>
      <p className="prose">
        By the end of this module you will be able to <strong>explain the brittle prompt problem</strong>, describe a skill primitive and why it's a better abstraction, read a before-and-after comparison and identify what improved, and answer a three-question quiz from memory.
      </p>
      <div className="callout callout-tip">
        <div className="callout-label">How to use this lesson</div>
        <p>Read each section fully before moving on. When you reach a <strong>Recall Check</strong>, close your eyes and try to answer from memory before typing. The act of retrieving information is what builds lasting understanding — not re-reading.</p>
      </div>
      <div className="callout callout-insight">
        <div className="callout-label">Estimated time</div>
        <p>This module is sized for one focused 25-minute session. Consider setting a timer.</p>
      </div>
      <div className="sec-nav">
        <span />
        <button className="btn btn-next" onClick={onNext}>Begin Lesson →</button>
      </div>
    </div>
  );
}

function SectionBrittle({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 1.1</div>
      <div className="sec-title">The Brittle Prompt Problem</div>
      <p className="prose">
        Imagine your company uses an AI assistant for dozens of tasks: summarizing meeting notes, auditing cloud configurations, formatting compliance reports, analyzing competitor data. Your team has written custom prompts for each of these. Everything works — <em>until it doesn't.</em>
      </p>
      <p className="prose">
        Prompts break for a surprising number of reasons:
      </p>
      <ul className="content-list">
        <li>A colleague edits a shared prompt to fix one use case, accidentally breaking three others.</li>
        <li>The AI model is updated by the vendor; old prompts produce unexpected output formats.</li>
        <li>A new team member phrases a request differently — and gets a completely different structure back.</li>
        <li>An autonomous agent calls the same prompt hundreds of times per session; your prose prompt tells it to "be helpful" but gives no contract about what to actually output.</li>
      </ul>
      <p className="prose">
        These are not edge cases. They are the <strong>normal lifecycle of prompt-based workflows at scale.</strong>
      </p>
      <p className="prose">
        The root cause is structural: prompts are written for human conversation. They are fluid, context-dependent, and assume a reasoning reader who can handle ambiguity. That assumption fails the moment a machine needs to parse the output reliably, or the moment a different human reads the same prompt differently.
      </p>
      <div className="callout callout-warning">
        <div className="callout-label">The Hidden Cost</div>
        <p>Most prompt failures are <strong>silent</strong>. The pipeline does not crash — it continues running with output that looks plausible but is structurally wrong. A numbering sequence that shifts. A field that appears in one run and disappears in the next. These silent failures are far more dangerous than visible errors.</p>
      </div>
      <div className="sec-nav">
        <span />
        <button className="btn btn-next" onClick={onNext}>Next: The Skill Primitive →</button>
      </div>
    </div>
  );
}

function SectionSkillPrimitive({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 1.2</div>
      <div className="sec-title">The Skill Primitive</div>
      <div className="sec-sub">A Better Abstraction</div>
      <p className="prose">
        A <strong>skill.markdown file</strong> solves the brittle prompt problem by replacing ad-hoc conversations with structured, version-controlled primitives.
      </p>
      <p className="prose">
        Think of a skill the way a software engineer thinks of a function: it has a clear name, defined inputs, specified outputs, and documented edge cases. Unlike a function, it is written in markdown so that an LLM can read and execute it — but it is engineered with the rigor of code.
      </p>
      <div className="callout callout-insight">
        <div className="callout-label">Key Insight — The ZIP File Analogy</div>
        <p>Just as chunking in human memory condenses complex information into a single, easily-accessible unit, a skill.markdown file condenses complex behavioral instructions into a single, reliably-routable primitive. Your LLM's working memory is limited — a well-designed skill reduces cognitive load on the model the same way chunking reduces load on human working memory.</p>
      </div>
      <h3>What a skill is NOT</h3>
      <ul className="content-list">
        <li>It is not a system prompt buried in a chat window</li>
        <li>It is not a shared Google Doc with informal instructions</li>
        <li>It is not a step-by-step recipe that breaks whenever the model encounters step 2.5</li>
        <li>It is not something that exists only in one person's memory or files</li>
      </ul>
      <h3>What a skill IS</h3>
      <ul className="content-list">
        <li>A structured markdown file with a frontmatter section and a body section</li>
        <li>Stored in its own named directory in a version-controlled repository</li>
        <li>A contract that declares trigger conditions, output schema, reasoning policies, and edge cases</li>
        <li>Testable, versionable, and recoverable — organizational intellectual property</li>
      </ul>
      <div className="sec-nav">
        <span />
        <button className="btn btn-next" onClick={onNext}>Next: A Concrete Comparison →</button>
      </div>
    </div>
  );
}

function SectionComparison({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 1.3</div>
      <div className="sec-title">A Concrete Comparison</div>
      <p className="prose">
        Consider the difference between asking an AI to analyze competitors two ways. Read both carefully — the contrast illustrates everything that follows in this curriculum.
      </p>
      <div className="compare-grid">
        <div className="cg-header cg-bad-h">❌  Brittle Prompt</div>
        <div className="cg-header cg-good-h">✅  Skill Primitive</div>
        <div className="cg-bad">
          "You are a helpful assistant. When asked about competitors, please provide a useful and thorough analysis covering things like their pricing, what their product does, and any weaknesses you know about. Try to be comprehensive and helpful."
        </div>
        <div className="cg-good">
          Triggers on "analyze competitors" or "market players." Outputs a 4-column markdown matrix: Competitor Name | Pricing Tier | Market Share Estimate | Key Technical Gap. Always outputs exactly 5 rows. Excludes companies under $10M revenue.
        </div>
        <div className="cg-note-bad">
          No guaranteed structure. Output changes with every run. An agent cannot parse it reliably. Any change breaks unknown downstream consumers.
        </div>
        <div className="cg-note-good">
          Deterministic structure. Parseable by downstream agents. Clear trigger phrase. Versioned and testable.
        </div>
      </div>
      <p className="prose">
        Notice what the skill primitive does that the brittle prompt cannot:
      </p>
      <ul className="content-list">
        <li><strong>Explicit trigger phrases</strong> ("analyze competitors" OR "market players") — the LLM gateway knows exactly when to invoke this skill</li>
        <li><strong>Named output schema</strong> — four specific column names that don't change between runs</li>
        <li><strong>Deterministic constraints</strong> — always 5 rows, never include sub-$10M companies</li>
        <li><strong>Machine-parseable</strong> — a downstream agent can split on | and reliably extract field values</li>
      </ul>
      <div className="callout callout-insight">
        <div className="callout-label">The Core Trade-off</div>
        <p>You sacrifice conversational flexibility in exchange for reliability. For any task that runs more than once, or is called by an automated system, or produces output that someone else depends on — reliability is almost always worth it.</p>
      </div>
      <div className="sec-nav">
        <span />
        <button className="btn btn-next" onClick={onNext}>Next: Where Skills Live →</button>
      </div>
    </div>
  );
}

function SectionWhereLive({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 1.4</div>
      <div className="sec-title">Where Skills Live</div>
      <p className="prose">
        A skill is a <strong>directory</strong> containing a single required file: <code style={{fontFamily:"'JetBrains Mono',monospace",background:G.code,padding:"2px 6px",borderRadius:3,fontSize:13,color:"#8EC8F0"}}>skill.markdown</code>. The directory name identifies the skill. The file contains everything the model needs to execute it.
      </p>
      <div className="code-block">
        <pre>{`skills/
  competitor-analysis/
    skill.markdown
  meeting-summary/
    skill.markdown
    example-input.txt      <span class="cm">← optional supporting files</span>
  tenant-health-audit/
    skill.markdown`}</pre>
      </div>
      <p className="prose">
        Skills are stored in <strong>version-controlled repositories</strong> — not buried in individual chat windows, shared documents, or personal files on someone's laptop.
      </p>
      <p className="prose">
        This matters for four reasons:
      </p>
      <ul className="content-list">
        <li><strong>Auditability</strong> — every change to a skill is recorded with who made it and when</li>
        <li><strong>Recoverability</strong> — when a team member leaves, their skills don't leave with them</li>
        <li><strong>Testability</strong> — you can run a skill against a test suite before deploying changes</li>
        <li><strong>Composability</strong> — skills can reference and build on each other in documented ways</li>
      </ul>
      <div className="callout callout-warning">
        <div className="callout-label">A Common Mistake</div>
        <p>Many teams begin by writing skills as system prompts saved in a shared doc or personal notes file. This preserves none of the governance benefits. The moment a skill exists only in one person's account, it becomes a single point of organizational failure.</p>
      </div>
      <div className="sec-nav">
        <span />
        <button className="btn btn-next" onClick={onNext}>Continue to Recall Check →</button>
      </div>
    </div>
  );
}

function SectionRecall({ onNext, onScore }) {
  const [scores, setScores] = useState({});
  const allAnswered = Object.keys(scores).length === RECALL_QUESTIONS.length;

  const handleScore = (id, grade) => {
    setScores(prev => ({ ...prev, [id]: grade }));
    onScore(id, grade);
  };

  return (
    <div>
      <div className="sec-eyebrow">Recall Check</div>
      <div className="sec-title">Retrieve From Memory</div>
      <div className="callout callout-insight">
        <div className="callout-label">Before you answer</div>
        <p>Close your eyes, look away from the screen, and try to recall each answer from memory before typing. The act of retrieval — not re-reading — is what builds lasting retention. Your answers will be assessed and you'll receive specific feedback.</p>
      </div>
      <div style={{ marginTop: 24 }}>
        {RECALL_QUESTIONS.map((q, i) => (
          <div key={q.id}>
            <div className="recall-box">
              <div className="recall-header">
                <div className="recall-icon">↩</div>
                <div>
                  <div className="recall-title">Recall {i + 1} of {RECALL_QUESTIONS.length}</div>
                  <div className="recall-sub">Answer without looking back at the content</div>
                </div>
              </div>
              <RecallItem q={q} onSubmit={(grade) => handleScore(q.id, grade)} />
            </div>
          </div>
        ))}
      </div>
      {allAnswered && (
        <div>
          <div className="callout callout-tip" style={{ marginTop: 8 }}>
            <div className="callout-label">Good work</div>
            <p>You've completed all recall checks. The quiz ahead tests the same concepts with multiple-choice questions — each answer comes with a detailed explanation.</p>
          </div>
          <div className="sec-nav">
            <span />
            <button className="btn btn-next" onClick={onNext}>Continue to Quiz →</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionQuiz({ onNext, onScore }) {
  const [results, setResults] = useState({});
  const allAnswered = Object.keys(results).length === QUIZ_QUESTIONS.length;

  const handleResult = (id, correct) => {
    setResults(prev => ({ ...prev, [id]: correct }));
    onScore(id, correct);
  };

  return (
    <div>
      <div className="sec-eyebrow">Mini-Quiz</div>
      <div className="sec-title">Test Your Understanding</div>
      <p className="prose">Three questions on Module 1 content. Select the best answer — you'll receive an explanation for each one regardless of whether you're right or wrong.</p>
      {QUIZ_QUESTIONS.map((q, i) => (
        <QuizItem key={q.id} q={q} onResult={(c) => handleResult(q.id, c)} />
      ))}
      {allAnswered && (
        <div>
          <div className="sec-nav">
            <span />
            <button className="btn btn-next" onClick={onNext}>See Results →</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionComplete({ recallScores, quizScores }) {
  const recallList = Object.values(recallScores);
  const quizList = Object.values(quizScores);
  const recallCorrect = recallList.filter(g => g === "correct").length;
  const recallPartial = recallList.filter(g => g === "partial").length;
  const quizCorrect = quizList.filter(Boolean).length;
  const total = recallCorrect * 2 + recallPartial * 1 + quizCorrect * 2;
  const max = RECALL_QUESTIONS.length * 2 + QUIZ_QUESTIONS.length * 2;
  const pct = Math.round((total / max) * 100);

  const color = pct >= 80 ? G.green : pct >= 55 ? G.amber : G.red;

  return (
    <div>
      <div className="sec-eyebrow">Module 1 Complete</div>
      <div className="sec-title">Results & Next Steps</div>

      <div className="score-card">
        <div className="score-big" style={{ color }}>{pct}%</div>
        <div className="score-label">Overall module score</div>
        <div style={{ fontSize: 13, color: G.textD }}>Recall: {recallCorrect} correct · {recallPartial} partial · Quiz: {quizCorrect}/{QUIZ_QUESTIONS.length} correct</div>
        <div className="score-grid">
          <div className="score-item">
            <div className="score-item-n" style={{ color: G.green }}>{recallCorrect}</div>
            <div className="score-item-l">Recall Correct</div>
          </div>
          <div className="score-item">
            <div className="score-item-n" style={{ color: G.amber }}>{recallPartial}</div>
            <div className="score-item-l">Recall Partial</div>
          </div>
          <div className="score-item">
            <div className="score-item-n" style={{ color: G.green }}>{quizCorrect}</div>
            <div className="score-item-l">Quiz Correct</div>
          </div>
        </div>
      </div>

      {pct >= 80 && (
        <div className="callout callout-tip">
          <div className="callout-label">Strong result</div>
          <p>You've demonstrated solid understanding of Module 1's core concepts. You're ready to move on to Module 2: Anatomy of a Skill Primitive, which dives into the five subsystems that make a skill work.</p>
        </div>
      )}
      {pct >= 55 && pct < 80 && (
        <div className="callout callout-insight">
          <div className="callout-label">Good foundation — some gaps to address</div>
          <p>You have the main ideas but some concepts didn't fully land yet. Review the sections where your recall was marked "partial" before proceeding. Focus especially on the brittle vs. skill primitive distinction, and the reasons version control matters.</p>
        </div>
      )}
      {pct < 55 && (
        <div className="callout callout-warning">
          <div className="callout-label">Re-read recommended before continuing</div>
          <p>The foundational concepts in this module are prerequisites for everything in Levels 2 and 3. Re-read sections 1.1–1.4, then revisit the recall check from memory without looking at your previous answers.</p>
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <h3>Spaced Repetition Reminder</h3>
        <p className="prose" style={{ marginTop: 8 }}>
          Research shows that reviewing this material at <strong>24 hours</strong>, <strong>3 days</strong>, and <strong>1 week</strong> dramatically improves long-term retention. Come back to this module's flashcard reference at each of those intervals. Even 5 minutes of active recall at the right moment is worth more than an hour of re-reading.
        </p>
      </div>

      <div style={{ marginTop: 28 }}>
        <h3>Key Concepts to Carry Forward</h3>
        <ul className="content-list">
          <li><strong>Brittle prompt</strong> — fluid, context-dependent, cannot be versioned or reliably parsed</li>
          <li><strong>Skill primitive</strong> — structured contract with trigger phrases, output schema, edge cases</li>
          <li><strong>Version-controlled repository</strong> — the required home for all skills; enables auditability, recoverability, testability</li>
          <li><strong>Silent failure</strong> — the danger of pipelines that continue with corrupted output rather than crashing visibly</li>
        </ul>
      </div>
    </div>
  );
}

// ── main app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [recallScores, setRecallScores] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timerSecs, setTimerSecs]     = useState(25 * 60);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showBreak, setShowBreak]     = useState(false);
  const mainRef = useRef(null);

  const goTo = (idx) => {
    setSectionIdx(idx);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  useEffect(() => {
    if (timerExpired) return;
    const id = setInterval(() => {
      setTimerSecs(s => {
        if (s <= 1) { clearInterval(id); setTimerExpired(true); setShowBreak(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerExpired]);

  const timerMins = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const timerSec2 = String(timerSecs % 60).padStart(2, "0");
  const timerDisplay = `${timerMins}:${timerSec2}`;
  const timerClass = timerExpired ? "timer-expired" : timerSecs < 300 ? "timer-warning" : "";

  const next = () => {
    setCompleted(prev => new Set([...prev, SECTIONS[sectionIdx].id]));
    goTo(Math.min(sectionIdx + 1, SECTIONS.length - 1));
  };

  const progress = Math.round(((sectionIdx) / (SECTIONS.length - 1)) * 100);

  const renderSection = () => {
    const sec = SECTIONS[sectionIdx];
    switch (sec.id) {
      case "intro":          return <SectionIntro onNext={next} />;
      case "brittle":        return <SectionBrittle onNext={next} />;
      case "skill-primitive":return <SectionSkillPrimitive onNext={next} />;
      case "comparison":     return <SectionComparison onNext={next} />;
      case "where-skills-live": return <SectionWhereLive onNext={next} />;
      case "recall":
        return <SectionRecall
          onNext={next}
          onScore={(id, grade) => setRecallScores(prev => ({ ...prev, [id]: grade }))}
        />;
      case "quiz":
        return <SectionQuiz
          onNext={next}
          onScore={(id, c) => setQuizScores(prev => ({ ...prev, [id]: c }))}
        />;
      case "complete":
        return <SectionComplete recallScores={recallScores} quizScores={quizScores} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="lesson-shell" style={{ gridTemplateColumns: sidebarOpen ? "260px 1fr" : "44px 1fr" }}>
        {/* header */}
        <header className="lesson-header">
          <span className="header-badge">Level 1</span>
          <span className="header-title">Module 1 — Why Skills Matter: The Problem With Prompts</span>
          <span className={`timer-display ${timerClass}`}>⏱ {timerDisplay}</span>
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-label">{progress}%</span>
          </div>
        </header>

        {/* sidebar */}
        <nav className={`lesson-sidebar ${sidebarOpen ? "" : "collapsed"}`}
          style={{ background: G.navyM, borderRight: `1px solid ${G.border}`, overflowY: "auto", padding: "16px 0", transition: "width .25s ease" }}>
          <div className="sidebar-toggle-row">
            {sidebarOpen && <span className="sidebar-section-label" style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: G.muted }}>Contents</span>}
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(o => !o)}
              title={sidebarOpen ? "Collapse menu" : "Expand menu"}
            >
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>
          {SECTIONS.map((sec, idx) => (
            <div
              key={sec.id}
              className={`sidebar-item ${idx === sectionIdx ? "active" : ""} ${completed.has(sec.id) ? "completed" : ""}`}
              onClick={() => goTo(idx)}
              title={!sidebarOpen ? sec.label : undefined}
            >
              <div className="si-dot" />
              {sidebarOpen && <div className="si-label">{sec.label}</div>}
            </div>
          ))}
        </nav>

        {/* main */}
        <main className="lesson-main" ref={mainRef}>
          <div className="lesson-main-inner">
            {showBreak && (
              <div className="break-banner">
                <span className="break-banner-icon">☕</span>
                <span style={{ color: G.creamD }}>
                  <strong style={{ color: G.amber }}>25-minute session complete.</strong> Take a 5-minute break. Your next 25-minute session will begin when you're ready — dismiss this to restart the timer.
                </span>
                <button className="btn btn-ghost" style={{ marginLeft: "auto", fontSize: 12, padding: "5px 12px" }} onClick={() => { setTimerSecs(25 * 60); setTimerExpired(false); setShowBreak(false); }}>
                  Dismiss
                </button>
              </div>
            )}
            {renderSection()}
          </div>
        </main>
      </div>
    </>
  );
}
