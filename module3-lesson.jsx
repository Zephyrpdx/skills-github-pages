import { useState, useRef, useEffect } from "react";

// ── palette ───────────────────────────────────────────────────────────────────
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

// ── CSS ───────────────────────────────────────────────────────────────────────
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

  /* ── header ── */
  .lesson-header {
    grid-column: 1 / -1;
    background: ${G.navyM};
    border-bottom: 1px solid ${G.border};
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 14px;
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
    flex-shrink: 0;
  }
  .header-badge-review {
    background: transparent;
    color: ${G.amber};
    border: 1px solid ${G.amber}60;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .header-title {
    font-family: 'Crimson Pro', serif;
    font-size: 17px;
    font-weight: 400;
    color: ${G.cream};
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  .progress-bar-wrap { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .progress-bar-track {
    width: 140px; height: 4px;
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
  .progress-label { font-size: 12px; color: ${G.textD}; min-width: 36px; text-align: right; }

  /* ── sidebar ── */
  .lesson-sidebar {
    background: ${G.navyM};
    border-right: 1px solid ${G.border};
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 0;
    transition: width .25s ease;
  }
  .lesson-sidebar.collapsed { padding: 16px 0; }
  .sidebar-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px 4px;
  }
  .collapsed .sidebar-toggle-row { justify-content: center; padding: 0 0 4px; }
  .sidebar-section-label {
    font-size: 10px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: ${G.muted};
  }
  .sidebar-toggle {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px;
    border-radius: 5px; background: ${G.slate}; border: none;
    cursor: pointer; color: ${G.textD}; font-size: 14px;
    flex-shrink: 0; transition: background .15s, color .15s;
    margin: 0 auto 8px;
  }
  .sidebar-toggle:hover { background: ${G.amber}30; color: ${G.amber}; }
  .sidebar-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 20px;
    cursor: pointer; transition: background .15s;
    border-left: 2px solid transparent;
  }
  .collapsed .sidebar-item { justify-content: center; padding: 8px 0; }
  .sidebar-item:hover { background: ${G.navyL}; }
  .sidebar-item.active { background: ${G.navyL}; border-left-color: ${G.amber}; }
  .sidebar-item.completed .si-dot { background: ${G.green}; }
  .si-dot { width: 8px; height: 8px; border-radius: 50%; background: ${G.slate}; flex-shrink: 0; transition: background .3s; }
  .si-label { font-size: 13px; color: ${G.textD}; line-height: 1.3; }
  .sidebar-item.active .si-label { color: ${G.cream}; }
  .collapsed .sidebar-section-label,
  .collapsed .si-label { display: none; }
  .collapsed .si-dot { margin: 0; }

  /* ── main ── */
  .lesson-main {
    background: ${G.navy};
    overflow-y: auto;
    padding: 48px 56px 80px;
  }
  .lesson-main-inner { max-width: 820px; }

  /* ── typography ── */
  .sec-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: .14em;
    text-transform: uppercase; color: ${G.amber}; margin-bottom: 10px;
  }
  .sec-title {
    font-family: 'Crimson Pro', serif; font-size: 34px; font-weight: 600;
    color: ${G.cream}; line-height: 1.25; margin-bottom: 8px;
  }
  .sec-sub {
    font-family: 'Crimson Pro', serif; font-size: 22px; font-weight: 400;
    color: ${G.text}; line-height: 1.35; margin-bottom: 24px;
  }
  .prose { color: ${G.text}; margin-bottom: 18px; }
  .prose strong { color: ${G.cream}; font-weight: 600; }
  .prose em { color: ${G.amberL}; font-style: italic; }
  h3 {
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase; color: ${G.amber};
    margin: 28px 0 12px;
  }
  ul.content-list { list-style: none; padding: 0; margin-bottom: 18px; }
  ul.content-list li {
    padding: 6px 0 6px 20px; position: relative; color: ${G.text};
    border-bottom: 1px solid ${G.border}20;
  }
  ul.content-list li::before {
    content: '›'; position: absolute; left: 0;
    color: ${G.amber}; font-size: 16px; line-height: 1.4;
  }

  /* ── callouts ── */
  .callout { border-radius: 6px; padding: 16px 20px; margin: 24px 0; border-left: 3px solid; }
  .callout-insight { background: ${G.navyL}; border-color: ${G.amber}; }
  .callout-warning { background: #2A1515; border-color: ${G.red}; }
  .callout-tip     { background: #0F2A1D; border-color: ${G.green}; }
  .callout-label {
    font-size: 11px; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; margin-bottom: 6px;
  }
  .callout-insight .callout-label { color: ${G.amber}; }
  .callout-warning .callout-label { color: ${G.red}; }
  .callout-tip .callout-label     { color: ${G.green}; }
  .callout p { font-size: 14px; line-height: 1.65; margin: 0; }

  /* ── compare grid ── */
  .compare-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
    margin: 24px 0; border-radius: 8px; overflow: hidden; border: 1px solid ${G.border};
  }
  .cg-header { padding: 10px 16px; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  .cg-bad-h  { background: #2A1515; color: ${G.red}; }
  .cg-good-h { background: #0F2A1D; color: ${G.green}; }
  .cg-bad    { background: #1A0E0E; padding: 16px; font-size: 14px; color: #C08080; font-style: italic; line-height: 1.6; }
  .cg-good   { background: #0A1A12; padding: 16px; font-size: 14px; color: #80C0A0; font-style: italic; line-height: 1.6; }
  .cg-note-bad  { background: #1A0E0E; padding: 10px 16px; font-size: 12px; color: #906060; border-top: 1px solid ${G.border}30; }
  .cg-note-good { background: #0A1A12; padding: 10px 16px; font-size: 12px; color: #609060; border-top: 1px solid ${G.border}30; }

  /* ── code block ── */
  .code-block {
    background: ${G.code}; border: 1px solid ${G.border}; border-radius: 6px;
    padding: 16px 20px; margin: 16px 0; overflow-x: auto;
  }
  .code-block pre {
    font-family: 'JetBrains Mono', monospace; font-size: 12.5px;
    color: #8EC8F0; line-height: 1.7; white-space: pre;
  }
  .code-block .cm { color: #6A9060; }
  .code-block .cs { color: #C8A060; }

  /* ── divider ── */
  .divider { border: none; border-top: 1px solid ${G.border}; margin: 36px 0; }

  /* ── step list ── */
  .step-list { list-style: none; padding: 0; margin: 20px 0; counter-reset: step-counter; }
  .step-list li {
    display: flex; gap: 16px; padding: 14px 0;
    border-bottom: 1px solid ${G.border}20;
    counter-increment: step-counter;
  }
  .step-num {
    font-family: 'Crimson Pro', serif; font-size: 22px; font-weight: 600;
    color: ${G.amber}; line-height: 1.2; flex-shrink: 0; width: 24px;
  }
  .step-body { flex: 1; }
  .step-title { font-size: 14px; font-weight: 600; color: ${G.cream}; margin-bottom: 4px; }
  .step-desc { font-size: 14px; color: ${G.text}; line-height: 1.6; }

  /* ── prediction box ── */
  .prediction-box {
    background: ${G.navyL}; border: 1px solid ${G.amber}30;
    border-radius: 8px; padding: 24px; margin: 28px 0;
  }
  .prediction-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .prediction-icon {
    font-size: 22px; width: 36px; height: 36px;
    background: ${G.amber}15; border: 1px solid ${G.amber}40;
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .prediction-title {
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: ${G.amber}; letter-spacing: .06em; text-transform: uppercase;
  }

  /* ── recall ── */
  .recall-box {
    background: ${G.navyL}; border: 1px solid ${G.amber}40;
    border-radius: 8px; padding: 24px; margin: 32px 0;
  }
  .recall-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
  .recall-icon {
    width: 32px; height: 32px; background: ${G.amber}20; border: 1px solid ${G.amber}60;
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .recall-title { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: ${G.amber}; letter-spacing: .06em; text-transform: uppercase; }
  .recall-sub { font-size: 12px; color: ${G.textD}; margin-top: 2px; }
  .recall-prompt { font-family: 'Crimson Pro', serif; font-size: 17px; color: ${G.cream}; margin-bottom: 10px; line-height: 1.45; }
  .recall-input {
    width: 100%; background: ${G.navy}; border: 1px solid ${G.border}; border-radius: 6px;
    color: ${G.text}; font-family: 'DM Sans', sans-serif; font-size: 14px;
    padding: 10px 14px; resize: vertical; min-height: 72px; margin-bottom: 10px;
    outline: none; transition: border-color .2s;
  }
  .recall-input:focus { border-color: ${G.amber}80; }
  .recall-input:disabled { opacity: 0.6; }

  /* ── quiz ── */
  .quiz-box { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 24px; margin: 32px 0; }
  .quiz-label { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: ${G.muted}; margin-bottom: 16px; }
  .quiz-q { font-family: 'Crimson Pro', serif; font-size: 18px; color: ${G.cream}; line-height: 1.45; margin-bottom: 18px; }
  .quiz-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  .quiz-option {
    display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px;
    border: 1px solid ${G.border}; border-radius: 6px; cursor: pointer;
    transition: all .15s; background: ${G.navy};
  }
  .quiz-option:hover:not(.locked) { border-color: ${G.amber}60; background: ${G.navyM}; }
  .quiz-option.selected { border-color: ${G.amber}; background: ${G.amber}10; }
  .quiz-option.correct  { border-color: ${G.green}; background: ${G.green}12; }
  .quiz-option.wrong    { border-color: ${G.red};   background: ${G.red}10;   }
  .quiz-option.locked   { cursor: default; }
  .option-letter {
    width: 24px; height: 24px; border-radius: 4px; background: ${G.slate};
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: ${G.text}; flex-shrink: 0; transition: background .15s, color .15s;
  }
  .quiz-option.selected .option-letter { background: ${G.amber}; color: ${G.navy}; }
  .quiz-option.correct  .option-letter { background: ${G.green}; color: ${G.white}; }
  .quiz-option.wrong    .option-letter { background: ${G.red};   color: ${G.white}; }
  .option-text { font-size: 14px; color: ${G.text}; line-height: 1.5; padding-top: 2px; }
  .quiz-option.correct .option-text { color: #90D0A8; }
  .quiz-option.wrong   .option-text { color: #C08080; }

  /* ── feedback ── */
  .feedback-box { border-radius: 6px; padding: 14px 18px; margin-top: 12px; font-size: 14px; line-height: 1.6; animation: fadeIn .3s ease; }
  .feedback-correct  { background: ${G.green}12; border: 1px solid ${G.green}40; }
  .feedback-partial  { background: #302010;      border: 1px solid #C08020; }
  .feedback-incorrect{ background: ${G.red}12;   border: 1px solid ${G.red}40; }
  .feedback-loading  { background: ${G.navyL};   border: 1px solid ${G.border}; display: flex; align-items: center; gap: 10px; }
  .fb-label { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 6px; }
  .feedback-correct  .fb-label { color: ${G.green}; }
  .feedback-partial  .fb-label { color: #D0A030; }
  .feedback-incorrect .fb-label { color: ${G.red}; }

  /* ── buttons ── */
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; letter-spacing: .02em; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-primary { background: ${G.amber}; color: ${G.navy}; }
  .btn-primary:hover:not(:disabled) { background: ${G.amberL}; }
  .btn-ghost { background: transparent; color: ${G.textD}; border: 1px solid ${G.border}; }
  .btn-ghost:hover:not(:disabled) { border-color: ${G.amber}60; color: ${G.text}; }
  .btn-next { background: ${G.navyL}; color: ${G.amber}; border: 1px solid ${G.amber}40; }
  .btn-next:hover:not(:disabled) { background: ${G.amber}20; border-color: ${G.amber}; }

  /* ── nav footer ── */
  .sec-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 40px; padding-top: 24px; border-top: 1px solid ${G.border}; }

  /* ── spinner ── */
  .spinner { width: 16px; height: 16px; border: 2px solid ${G.border}; border-top-color: ${G.amber}; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeIn  { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  /* ── score ── */
  .score-card { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 10px; padding: 32px; text-align: center; margin: 24px 0; }
  .score-big  { font-family: 'Crimson Pro', serif; font-size: 64px; font-weight: 600; line-height: 1; margin-bottom: 8px; }
  .score-label { font-size: 14px; color: ${G.textD}; margin-bottom: 24px; }
  .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; }
  .score-item { background: ${G.navy}; border-radius: 6px; padding: 12px; }
  .score-item-n { font-family: 'Crimson Pro', serif; font-size: 28px; color: ${G.cream}; }
  .score-item-l { font-size: 11px; color: ${G.textD}; margin-top: 2px; }

  /* ── break banner ── */
  .break-banner { background: #1A1000; border: 1px solid ${G.amber}60; border-radius: 6px; padding: 14px 20px; margin: 0 0 24px; display: flex; align-items: center; gap: 12px; font-size: 14px; }
  .break-banner-icon { font-size: 20px; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.slate}; border-radius: 3px; }
`;

// ── Storage helpers ───────────────────────────────────────────────────────────
const storageSet = async (key, val) => {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
};
const storageGet = async (key) => {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
};

// ── API helper ────────────────────────────────────────────────────────────────
async function assessWithClaude(systemPrompt, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await res.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return { grade: "partial", label: "Feedback", message: text };
  }
}

// ── System prompts ────────────────────────────────────────────────────────────
const PREDICTION_SYSTEM = `You are a learning coach for the Agent-Readable Skills Infrastructure curriculum.
The student is about to read Module 3: Writing Your First Skill. Their prediction is an activation exercise — not a test.
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "2-3 sentences: (1) note what shows good intuition, (2) hint at what the lesson adds or clarifies, (3) encourage forward. Correct = identified writing the routing description, choosing the right task type, or the iterative refinement process as challenges. Partial = touched something related but vague. Incorrect = off-base. Tone: warm, forward-looking."
}`;

const RECALL_SYSTEM = `You are an expert instructor assessing a student's recall answer for Module 3 of the Agent-Readable Skills Infrastructure curriculum: "Writing Your First Skill."
The module covers: identifying good skill candidates (repetitive, structured inputs, deterministic output, parseable by downstream systems), writing a compliant routing description (trigger phrases + artifact type + output shape, all on one line), building the skill body using the five subsystems, and the refinement loop (draft → test → identify failure → refine → re-test).
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "2-4 sentences: (1) affirm what was right, (2) correct or fill in what was missing, (3) reinforce the key concept. Tone: precise and direct. Not sycophantic."
}
Grading: correct = essential concept captured accurately. partial = got some but missed something important. incorrect = missed the concept or left blank.`;

const QUIZ_SYSTEM = `You are an expert instructor explaining a quiz answer for Module 3: Writing Your First Skill (Agent-Readable Skills Infrastructure curriculum).
The student selected an answer that was {{CORRECT_OR_NOT}}.
Return ONLY a JSON object:
{
  "message": "2-3 sentences: explain why the correct answer is right and, if the student was wrong, why their choice was incorrect. Be specific. Use concrete examples from the skill.markdown domain. Tone: clear, informative."
}`;

const SUMMARY_SYSTEM = `You are assessing a student's written summary of Module 3: "Writing Your First Skill" from the Agent-Readable Skills Infrastructure curriculum.
A complete correct answer covers ALL THREE of: (1) how to identify a good skill candidate (repetitive, structured, deterministic output needed); (2) what makes a good routing description (trigger phrases, artifact type, output shape — all on one line); (3) a common first-draft mistake (procedural steps, vague description, or skipping the refinement loop).
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "3-4 sentences: affirm what was captured, identify specifically what was missing or imprecise, reinforce the key concept. Tone: precise and direct."
}
Correct = all three dimensions present. Partial = 1-2 dimensions. Incorrect = missing the core concept.`;

// ── shuffle ───────────────────────────────────────────────────────────────────
function shuffleOptions(options) {
  return [...options].sort(() => Math.random() - 0.5);
}

// ── Lesson data ───────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "prediction",  label: "Pre-Lesson Prediction",      type: "prediction" },
  { id: "intro",       label: "Introduction",               type: "content"    },
  { id: "choose-task", label: "3.1 Choosing Your Task",     type: "content"    },
  { id: "routing-desc",label: "3.2 The Routing Description",type: "content"    },
  { id: "build-body",  label: "3.3 Building the Body",      type: "content"    },
  { id: "validate",    label: "3.4 Validate & Refine",      type: "content"    },
  { id: "recall",      label: "Recall Check",               type: "recall"     },
  { id: "quiz",        label: "Mini-Quiz",                  type: "quiz"       },
  { id: "summary",     label: "Written Summary",            type: "summary"    },
  { id: "complete",    label: "Module Complete",            type: "complete"   },
];

const RECALL_QUESTIONS = [
  {
    id: "r1",
    prompt: "What makes a workflow task a good candidate for a skill primitive? Name at least two characteristics.",
    rubric: "Looking for: (1) repetitive — happens regularly, not a one-off; (2) consistent structured inputs — same type of data or request each time; (3) deterministic output needed — downstream systems or team members depend on a predictable format; (4) fails silently if not structured — broken output isn't visible until downstream damage occurs. Bonus: noting explicitly that creative, exploratory, or open-ended tasks are NOT good candidates.",
  },
  {
    id: "r2",
    prompt: "A colleague shows you their routing description: 'This skill helps with various document analysis and data processing tasks across the organization.' What is wrong with it, and what are the three ingredients a good description needs?",
    rubric: "What's wrong: too abstract, no trigger phrases, no artifact type, no output shape — under-triggers in any gateway. Three ingredients: (1) trigger phrase(s) — specific quoted phrases that match user query language; (2) artifact type — what kind of output: markdown table, JSON object, Excel layout, PDF section; (3) output shape — column names, row count, field labels, exclusion rules. All three must fit on one line.",
  },
  {
    id: "r3",
    prompt: "What is the refinement loop for skill development, and why is a first passing test not the same as validation?",
    rubric: "Refinement loop: draft → test → identify failure mode → refine routing description or body → re-test. First passing test ≠ validation because: (1) routing may work on the exact phrase you tested but fail on slight variations; (2) edge cases only surface through realistic inputs you didn't anticipate; (3) output spec compliance needs verification across multiple test runs; (4) a skill that works for one person may fail for another who phrases the trigger differently. Plan for 2-3 refinement cycles minimum.",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "You are choosing your first task to convert into a skill. Which of the following is the best candidate?",
    options: [
      { text: "Generating a weekly CI/CD deployment report with consistent 5-column output every Monday.", correct: true  },
      { text: "Answering ad hoc strategic questions about the company's market position.", correct: false },
      { text: "Brainstorming creative names for a new product line.", correct: false },
      { text: "Having a philosophical discussion about software architecture principles.", correct: false },
    ],
    explanation: "Good skill candidates are repetitive, have consistent input patterns, and need a deterministic output format. Weekly deployment reports satisfy all three: they recur on a schedule, always draw from the same log structure, and need a consistent table that downstream teams depend on. Creative ideation, strategic Q&A, and open discussions gain nothing from skill constraints — they benefit from flexibility, not determinism.",
  },
  {
    id: "q2",
    text: "A developer writes: \"Triggers on 'weekly deployment summary' or 'CI/CD report' to output a 5-column markdown table: Date | Build_ID | Status | Duration_sec | Error_Count. Always 7 rows. Excludes cancelled builds.\" What has this developer done correctly?",
    options: [
      { text: "Written a description with trigger phrases, artifact type, output shape, and deterministic constraints — all on one line.", correct: true  },
      { text: "Used procedural step-by-step instructions in the description.", correct: false },
      { text: "Skipped the frontmatter block by embedding all logic in the description.", correct: false },
      { text: "Made the description too long and specific — a vague description routes better.", correct: false },
    ],
    explanation: "This description contains all three required ingredients: concrete trigger phrases ('weekly deployment summary' or 'CI/CD report'), artifact type (markdown table), and output shape (5 named columns, 7 rows, exclusion rule for cancelled builds). The specificity is a feature, not a flaw — it gives the gateway's router precise semantic anchors and gives downstream consumers an exact contract to rely on.",
  },
  {
    id: "q3",
    text: "After writing your first skill, you test it three times. Each time you type 'summarize deployment logs,' the model gives a general conversational response instead of invoking your skill. What should you check first?",
    options: [
      { text: "Whether the routing description contains trigger phrases that match the user's phrasing.", correct: true  },
      { text: "Whether the edge case documentation is comprehensive enough.", correct: false },
      { text: "Whether the output specification column names are correct.", correct: false },
      { text: "Whether the pattern-matching exemplar is stored in the right directory.", correct: false },
    ],
    explanation: "When a skill isn't being invoked, the routing description is always the first place to look. If your description says 'Triggers on \"generate CI/CD report\"' but you're typing 'summarize deployment logs,' the gateway router cannot make that connection — different semantic territory. Fix: add 'summarize deployment logs' as a trigger phrase, or broaden the description to cover the actual phrasing your users reach for. Body issues only matter after routing is confirmed.",
  },
];

// ── Shared components ─────────────────────────────────────────────────────────
function Spinner() { return <div className="spinner" />; }

function FeedbackBox({ result }) {
  if (!result) return null;
  if (result.loading) return (
    <div className="feedback-box feedback-loading">
      <Spinner /> <span style={{ color: G.textD, fontSize: 14 }}>Assessing your answer…</span>
    </div>
  );
  return (
    <div className={`feedback-box feedback-${result.grade}`}>
      <div className="fb-label">{result.label}</div>
      <div>{result.message}</div>
    </div>
  );
}

function RecallItem({ q, moduleN, onSubmit }) {
  const [val, setVal] = useState("");
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!val.trim()) return;
    setSubmitted(true);
    setResult({ loading: true });
    const msg = `RECALL QUESTION: ${q.prompt}\n\nRUBRIC (for your reference): ${q.rubric}\n\nSTUDENT ANSWER: ${val}`;
    const res = await assessWithClaude(RECALL_SYSTEM, msg);
    setResult(res);
    storageSet(`engagement:module${moduleN}:recall:${q.id}`, { grade: res.grade, timestamp: Date.now() });
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
      {(!submitted || (result && result.loading)) && (
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!val.trim() || (submitted && result?.loading)}
        >
          {result?.loading ? <><Spinner /> Assessing…</> : "Submit Answer"}
        </button>
      )}
      <FeedbackBox result={result} />
    </div>
  );
}

function QuizItem({ q, moduleN, onResult }) {
  const [shuffled] = useState(() => shuffleOptions(q.options));
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (idx) => {
    if (locked) return;
    setSelected(idx);
    setLocked(true);
    setLoading(true);
    const correct = shuffled[idx].correct;
    const sys = QUIZ_SYSTEM.replace("{{CORRECT_OR_NOT}}", correct ? "correct" : "incorrect");
    const msg = `QUESTION: ${q.text}\n\nOPTIONS:\n${shuffled.map((o, i) => `${String.fromCharCode(65+i)}. ${o.text}`).join("\n")}\n\nCORRECT ANSWER: ${shuffled.find(o => o.correct)?.text}\n\nSTUDENT SELECTED: ${shuffled[idx].text}\n\nSTATIC EXPLANATION: ${q.explanation}`;
    const res = await assessWithClaude(sys, msg);
    setFeedback(res.message || q.explanation);
    setLoading(false);
    storageSet(`engagement:module${moduleN}:quiz:${q.id}`, { correct, timestamp: Date.now() });
    onResult(correct);
  };

  const optClass = (idx) => {
    let base = "quiz-option";
    if (locked) base += " locked";
    if (idx === selected && shuffled[idx]?.correct)   base += " correct";
    else if (idx === selected && !shuffled[idx]?.correct) base += " wrong";
    else if (locked && shuffled[idx]?.correct) base += " correct";
    else if (idx === selected) base += " selected";
    return base;
  };

  return (
    <div className="quiz-box">
      <div className="quiz-label">Question</div>
      <div className="quiz-q">{q.text}</div>
      <div className="quiz-options">
        {shuffled.map((opt, idx) => (
          <div key={idx} className={optClass(idx)} onClick={() => handleSelect(idx)}>
            <div className="option-letter">{String.fromCharCode(65 + idx)}</div>
            <div className="option-text">{opt.text}</div>
          </div>
        ))}
      </div>
      {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Getting explanation…</span></div>}
      {!loading && feedback && (
        <div className={`feedback-box ${shuffled[selected]?.correct ? "feedback-correct" : "feedback-incorrect"}`}>
          <div className="fb-label">{shuffled[selected]?.correct ? "✓ Correct" : "✗ Incorrect"}</div>
          <div>{feedback}</div>
        </div>
      )}
    </div>
  );
}

// ── Section renderers ─────────────────────────────────────────────────────────
function SectionPrediction({ onNext }) {
  const [val, setVal] = useState("");
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!val.trim()) return;
    setSubmitted(true);
    setResult({ loading: true });
    const res = await assessWithClaude(PREDICTION_SYSTEM, `STUDENT PREDICTION: ${val}`);
    setResult(res);
    storageSet("engagement:module3:prediction", { grade: res.grade, timestamp: Date.now() });
  };

  return (
    <div>
      <div className="sec-eyebrow">Before You Read</div>
      <div className="sec-title">Pre-Lesson Prediction</div>
      <p className="prose">
        Before you encounter the lesson's arguments, activate what you already think. Writing a prediction before reading measurably improves how well the new material integrates with what you already know.
      </p>
      <div className="prediction-box">
        <div className="prediction-header">
          <div className="prediction-icon">🔮</div>
          <div>
            <div className="prediction-title">Your Prediction</div>
            <div className="recall-sub">One sentence — before reading anything</div>
          </div>
        </div>
        <div className="recall-prompt">
          In one sentence: what do you think is the hardest part about turning an informal workflow into a structured skill?
        </div>
        <textarea
          className="recall-input"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="Write your prediction here…"
          disabled={submitted && result && !result.loading}
          rows={2}
        />
        {(!submitted || (result && result.loading)) && (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!val.trim() || (submitted && result?.loading)}
          >
            {result?.loading ? <><Spinner /> Assessing…</> : "Submit Prediction"}
          </button>
        )}
        <FeedbackBox result={result} />
      </div>
      {result && !result.loading && (
        <div className="sec-nav"><span />
          <button className="btn btn-next" onClick={onNext}>Begin Lesson →</button>
        </div>
      )}
    </div>
  );
}

function SectionIntro({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Level 1 · Module 3</div>
      <div className="sec-title">Writing Your First Skill</div>
      <div className="sec-sub">From Blank File to Production-Ready Primitive</div>
      <p className="prose">
        Modules 1 and 2 built the conceptual foundation: why skills exist and what's inside one. This module puts you at the blank file. You will walk through the four-step process of identifying a task, writing the routing description, building the body, and validating what you've written before it touches production.
      </p>
      <p className="prose">
        By the end of this module you will be able to: <strong>identify a task that is a strong skill candidate</strong>, write a routing description that contains all three required ingredients, apply the five subsystems to build a skill body, and describe the refinement loop and why one passing test is not enough.
      </p>
      <div className="callout callout-tip">
        <div className="callout-label">How to use this lesson</div>
        <p>Read each section fully before moving on. This module is practical — as you read, think of a real workflow from your own context that might become a skill. The examples are more meaningful when you apply them to something concrete.</p>
      </div>
      <div className="callout callout-insight">
        <div className="callout-label">Estimated time</div>
        <p>This module is sized for one focused 25-minute session. Your timer is running in the header.</p>
      </div>
      <div className="sec-nav"><span />
        <button className="btn btn-next" onClick={onNext}>Begin Lesson →</button>
      </div>
    </div>
  );
}

function SectionChooseTask({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 3.1</div>
      <div className="sec-title">Choosing Your Task</div>
      <div className="sec-sub">Not Every Workflow Belongs in a Skill</div>
      <p className="prose">
        The most important decision in skill authorship happens before you write a single line. Choosing the wrong task produces a skill that no one uses, or worse, a skill that introduces rigid structure where flexibility was the point.
      </p>
      <h3>What makes a strong skill candidate</h3>
      <ul className="content-list">
        <li><strong>Repetitive</strong> — happens regularly, on a schedule, or in high volume; not a one-off request</li>
        <li><strong>Consistent structured inputs</strong> — the same type of data or prompt feeds the task each time</li>
        <li><strong>Deterministic output needed</strong> — a downstream system, team member, or agent expects a predictable format; variation breaks something</li>
        <li><strong>High failure cost from silent errors</strong> — if the output format shifts, something breaks visibly rather than recovering gracefully</li>
      </ul>
      <div className="compare-grid">
        <div className="cg-header cg-bad-h">❌  Poor candidates</div>
        <div className="cg-header cg-good-h">✅  Strong candidates</div>
        <div className="cg-bad">
          "Answer general questions about company strategy"<br /><br />
          "Brainstorm names for new features"<br /><br />
          "Explain a concept in multiple ways"
        </div>
        <div className="cg-good">
          "Generate weekly CI/CD deployment log summaries"<br /><br />
          "Audit M365 tenant health configurations"<br /><br />
          "Format customer feedback into a standard 4-field report"
        </div>
        <div className="cg-note-bad">One-off, creative, or open-ended — these need flexibility, not determinism. A skill constrains them without benefit.</div>
        <div className="cg-note-good">Repetitive, structured inputs, parseable output, high-volume — these benefit directly from a deterministic contract.</div>
      </div>
      <div className="callout callout-warning">
        <div className="callout-label">The complexity trap</div>
        <p>Teams often try to skill-ify their most complex, important workflow first. Resist this. Your first skill should be something genuinely simple and repetitive — a task where the expected output is so obvious you could write the Output Specification in two sentences. Save complex workflows for after you've built and deployed at least two simpler skills and understand the failure modes.</p>
      </div>
      <p className="prose">
        Once you've identified a candidate: ask one final question before proceeding. <em>If this skill returned slightly wrong output — wrong column order, missing a row, extra field — would you notice immediately, or only after damage was done?</em> If you'd notice immediately, the task is worth structuring as a skill. If output is too ambiguous to evaluate against a standard, the task isn't ready.
      </p>
      <div className="sec-nav"><span />
        <button className="btn btn-next" onClick={onNext}>Next: The Routing Description →</button>
      </div>
    </div>
  );
}

function SectionRoutingDesc({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 3.2</div>
      <div className="sec-title">Writing the Routing Description</div>
      <div className="sec-sub">The Hardest Line You Will Write</div>
      <p className="prose">
        The routing description is a single line of text that does more work than any other element in the file. It must simultaneously function as a <em>semantic match target</em> for the gateway router and a <em>behavioral contract summary</em> for any practitioner who reads it. Getting it right takes more iteration than any other part of the skill.
      </p>
      <div className="callout callout-insight">
        <div className="callout-label">Write it last</div>
        <p>The single most reliable technique for writing a good description: draft the entire body first. By the time you've written the Reasoning Framework, Output Specification, and Edge Cases, you know exactly what the skill does, what it returns, and what triggers it. Authors who write the description first frequently discover their body doesn't match their description — or write something so vague it could describe a dozen different skills.</p>
      </div>
      <h3>The three required ingredients</h3>
      <ul className="content-list">
        <li><strong>Trigger phrase(s)</strong> — exact quoted text that a user would type to invoke this skill. Must be concrete. Must be in the semantic neighborhood of real user language, not internal team jargon.</li>
        <li><strong>Artifact type</strong> — what kind of output: "markdown table," "JSON object," "Excel layout," "numbered list," "PDF data block." Name it explicitly.</li>
        <li><strong>Output shape</strong> — column names, field labels, row counts, exclusion rules. The constraints that make output deterministic rather than approximate.</li>
      </ul>
      <div className="compare-grid">
        <div className="cg-header cg-bad-h">❌  Before: missing ingredients</div>
        <div className="cg-header cg-good-h">✅  After: all three present</div>
        <div className="cg-bad">
          "Generates a structured summary of CI/CD deployment activity for engineering teams reviewing pipeline performance."
        </div>
        <div className="cg-good">
          {"Triggers on 'weekly deployment summary' or 'CI/CD report' to output a 5-column markdown table: Date | Build_ID | Status | Duration_sec | Error_Count. Always 7 rows. Excludes cancelled builds."}
        </div>
        <div className="cg-note-bad">No trigger phrases. No artifact type. No column names. No row constraint. Router cannot anchor on this.</div>
        <div className="cg-note-good">Trigger phrases in quotes. Artifact type named. All 5 columns specified. Row count and exclusion rule stated.</div>
      </div>
      <h3>Common authoring mistakes</h3>
      <ul className="content-list">
        <li><strong>Writing a purpose statement instead of a trigger</strong> — "helps teams analyze..." describes what the skill is for, not when to fire it</li>
        <li><strong>Using internal project names as triggers</strong> — "Project Hydra weekly status" only routes for users who know that name; write for how users actually phrase queries</li>
        <li><strong>Omitting output shape</strong> — trigger phrases alone leave the router uncertain; output shape anchors the match to a specific kind of task</li>
        <li><strong>Multi-line formatting</strong> — the description must be one continuous line; auto-formatters that wrap it will silently break routing</li>
      </ul>
      <div className="sec-nav"><span />
        <button className="btn btn-next" onClick={onNext}>Next: Building the Body →</button>
      </div>
    </div>
  );
}

function SectionBuildBody({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 3.3</div>
      <div className="sec-title">Building the Skill Body</div>
      <div className="sec-sub">Applying the Five Subsystems</div>
      <p className="prose">
        With a task chosen and a routing description drafted, you build the body. Apply the five subsystems in order — not because the order is structurally required, but because each one answers a question that depends on the previous one being resolved.
      </p>
      <ol className="step-list">
        <li>
          <div className="step-num">1</div>
          <div className="step-body">
            <div className="step-title">Reasoning Framework — write principles, not steps</div>
            <div className="step-desc">What decision criteria does the model need when data is imperfect, ambiguous, or missing? Write 3–5 declarative statements. Each should answer: "what do I do when X?" Not "first do A, then do B."</div>
          </div>
        </li>
        <li>
          <div className="step-num">2</div>
          <div className="step-body">
            <div className="step-title">Output Specification — be exact</div>
            <div className="step-desc">Name every column or field by its exact label. State row or section count absolutely. Specify format ("markdown table," not "a table"). Include fallback behavior for incomplete data ("populate with 'N/A'" not "do your best").</div>
          </div>
        </li>
        <li>
          <div className="step-num">3</div>
          <div className="step-body">
            <div className="step-title">Edge Cases — minimum three documented failure states</div>
            <div className="step-desc">List the scenarios where a human practitioner would rely on intuition but the model would otherwise guess. Each edge case replaces a default model behavior with defined policy. If you can't identify three, the skill isn't scoped tightly enough yet.</div>
          </div>
        </li>
        <li>
          <div className="step-num">4</div>
          <div className="step-body">
            <div className="step-title">Pattern-Matching Exemplar — one good example beats paragraphs of instruction</div>
            <div className="step-desc">Create an example output file in the skill directory. Don't embed it inline — reference it by filename. A concrete example anchors the model's output structure more reliably than any amount of prose description.</div>
          </div>
        </li>
        <li>
          <div className="step-num">5</div>
          <div className="step-body">
            <div className="step-title">Contextual Economy — budget your lines deliberately</div>
            <div className="step-desc">Count your lines before committing. Under 80 is a sign of disciplined authorship. Under 150 is the hard limit. If you're over 100 lines, the skill is probably doing too much — consider splitting it.</div>
          </div>
        </li>
      </ol>
      <div className="callout callout-insight">
        <div className="callout-label">The skeleton template</div>
        <p>Below is a minimal compliant template. Fill in the four sections; delete nothing. Every section header that exists in the template has a structural purpose — omitting one leaves a gap that the model will fill with default (often wrong) behavior.</p>
      </div>
      <div className="code-block">
        <pre>{`---
name: your-skill-name
description: "Triggers on 'TRIGGER PHRASE' to output ARTIFACT TYPE: FIELD_A | FIELD_B | FIELD_C. Always N rows. Excludes CONSTRAINT."
license: Proprietary
---

## Reasoning Framework
[3–5 declarative decision principles. No numbered steps.]

## Output Specification
[Exact output format. Named columns/fields. Row count. Fallback behavior.]

## Edge Cases
- [Failure state 1: policy]
- [Failure state 2: policy]
- [Failure state 3: policy]

## Pattern-Matching Exemplar
See your-skill-name/example-output.md for a correctly formatted output.`}</pre>
      </div>
      <div className="callout callout-warning">
        <div className="callout-label">The first-draft trap</div>
        <p>The single most common first-draft mistake: writing the Reasoning Framework as numbered steps. "1. Read the input. 2. Identify the relevant records. 3. Format as a table." This looks complete but breaks whenever reality deviates from your steps. Replace numbered steps with declarative principles — "When multiple records conflict, use the most recent timestamp. When a required field is absent, populate with 'Unavailable' rather than omitting the row."</p>
      </div>
      <div className="sec-nav"><span />
        <button className="btn btn-next" onClick={onNext}>Next: Validate & Refine →</button>
      </div>
    </div>
  );
}

function SectionValidate({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 3.4</div>
      <div className="sec-title">Validate and Refine</div>
      <div className="sec-sub">One Passing Test Is Not Validation</div>
      <p className="prose">
        Writing the file is not the end of skill authorship — it's the beginning of the refinement loop. Every skill requires at least two or three cycles of testing before it is ready for production. Teams that skip this step deploy skills that break in ways that took thirty seconds to prevent.
      </p>
      <h3>The refinement loop</h3>
      <ul className="content-list">
        <li><strong>Draft</strong> — write the skill following the template</li>
        <li><strong>Test</strong> — invoke it with three or more realistic query variations, including at least one edge case you documented</li>
        <li><strong>Identify failure mode</strong> — classify the failure: routing failure (skill not invoked) or body failure (skill invoked but output wrong)</li>
        <li><strong>Refine</strong> — routing failure → fix the description; body failure → fix the relevant subsystem</li>
        <li><strong>Re-test</strong> — run the same queries again, plus new variations; confirm the fix didn't introduce a new failure</li>
      </ul>
      <div className="callout callout-insight">
        <div className="callout-label">Routing failure vs. body failure — different diagnoses</div>
        <p>A routing failure means the gateway never invoked the skill — the description's trigger phrases didn't match the query's semantic space. Fix: revise the description. A body failure means the skill was invoked but output didn't match the specification — wrong columns, wrong count, edge case handled incorrectly. Fix: revise the relevant body section. Mixing up the diagnosis leads to fixing the wrong thing.</p>
      </div>
      <h3>Three things every test pass must verify</h3>
      <ul className="content-list">
        <li><strong>Routing fires correctly</strong> — the skill is invoked when a user types the trigger phrase, and not invoked for clearly unrelated queries</li>
        <li><strong>Output matches specification</strong> — column names, row count, and format match the Output Specification exactly, across multiple runs</li>
        <li><strong>Edge cases behave as documented</strong> — test at least one documented failure state and confirm the defined policy is applied</li>
      </ul>
      <div className="callout callout-warning">
        <div className="callout-label">The illusion of completeness</div>
        <p>The most dangerous moment in skill authorship is when your first test passes. It creates a feeling of completion that causes practitioners to stop testing. That first test was one query, one set of inputs, one run. It does not tell you what happens when the trigger phrasing varies, when input data is partial, or when an edge case fires. Plan for three refinement cycles before declaring a skill production-ready.</p>
      </div>
      <p className="prose">
        The refinement loop is not a sign that the skill was authored badly — it is the expected process. Even experienced skill authors produce first drafts that need two or three cycles. The goal isn't to write a perfect skill on the first attempt; it's to have a process that reliably catches failures before they reach production.
      </p>
      <div className="sec-nav"><span />
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
              <RecallItem q={q} moduleN={3} onSubmit={(grade) => handleScore(q.id, grade)} />
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
          <div className="sec-nav"><span />
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
      <p className="prose">Three questions on Module 3 content. Select the best answer — you'll receive an explanation for each one regardless of whether you're right or wrong.</p>
      {QUIZ_QUESTIONS.map(q => (
        <QuizItem key={q.id} q={q} moduleN={3} onResult={(c) => handleResult(q.id, c)} />
      ))}
      {allAnswered && (
        <div className="sec-nav"><span />
          <button className="btn btn-next" onClick={onNext}>Continue to Summary →</button>
        </div>
      )}
    </div>
  );
}

function SectionSummary({ onNext }) {
  const [val, setVal] = useState("");
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!val.trim()) return;
    setSubmitted(true);
    setResult({ loading: true });
    const res = await assessWithClaude(SUMMARY_SYSTEM, `STUDENT SUMMARY: ${val}`);
    setResult(res);
    storageSet("engagement:module3:summary", { grade: res.grade, timestamp: Date.now() });
  };

  return (
    <div>
      <div className="sec-eyebrow">Written Summary</div>
      <div className="sec-title">Synthesize What You Learned</div>
      <p className="prose">
        Before seeing your results, write a synthesis in your own words. Elaborative retrieval — forcing yourself to synthesize rather than recognize — produces dramatically stronger long-term retention than re-reading.
      </p>
      <div className="callout callout-insight">
        <div className="callout-label">What to cover</div>
        <p>In 3–5 sentences: walk through the process of writing a skill — how you choose the right task, what goes in the routing description, and what common mistake first-time authors make when building the body.</p>
      </div>
      <div className="recall-box" style={{ marginTop: 28 }}>
        <div className="recall-header">
          <div className="recall-icon">✍</div>
          <div>
            <div className="recall-title">Your Summary</div>
            <div className="recall-sub">3–5 sentences · no notes · your own words</div>
          </div>
        </div>
        <textarea
          className="recall-input"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="Write your summary here…"
          disabled={submitted && result && !result.loading}
          rows={5}
          style={{ minHeight: 110 }}
        />
        {(!submitted || (result && result.loading)) && (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!val.trim() || (submitted && result?.loading)}
          >
            {result?.loading ? <><Spinner /> Assessing…</> : "Submit Summary"}
          </button>
        )}
        <FeedbackBox result={result} />
      </div>
      {result && !result.loading && (
        <div className="sec-nav"><span />
          <button className="btn btn-next" onClick={onNext}>See Results →</button>
        </div>
      )}
    </div>
  );
}

function SectionComplete({ recallScores, quizScores }) {
  const recallList    = Object.values(recallScores);
  const quizList      = Object.values(quizScores);
  const recallCorrect = recallList.filter(g => g === "correct").length;
  const recallPartial = recallList.filter(g => g === "partial").length;
  const quizCorrect   = quizList.filter(Boolean).length;
  const total = recallCorrect * 2 + recallPartial * 1 + quizCorrect * 2;
  const max   = RECALL_QUESTIONS.length * 2 + QUIZ_QUESTIONS.length * 2;
  const pct   = Math.round((total / max) * 100);
  const color = pct >= 80 ? G.green : pct >= 55 ? G.amber : G.red;

  useEffect(() => {
    storageSet("engagement:module3:complete", { timestamp: Date.now(), score: pct });
  }, []);

  return (
    <div>
      <div className="sec-eyebrow">Module 3 Complete</div>
      <div className="sec-title">Results & Next Steps</div>

      <div className="score-card">
        <div className="score-big" style={{ color }}>{pct}%</div>
        <div className="score-label">Overall module score</div>
        <div style={{ fontSize: 13, color: G.textD }}>
          Recall: {recallCorrect} correct · {recallPartial} partial · Quiz: {quizCorrect}/{QUIZ_QUESTIONS.length} correct
        </div>
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
          <div className="callout-label">Level 1 complete</div>
          <p>You've completed all three Level 1 Foundation modules. You understand why skills exist, what's inside one, and how to write one. Module 4 introduces agentic contracts — engineering skills for autonomous agents that call them hundreds of times per session, where failures are amplified and the contract must be airtight.</p>
        </div>
      )}
      {pct >= 55 && pct < 80 && (
        <div className="callout callout-insight">
          <div className="callout-label">Good foundation — gaps to address</div>
          <p>You have the main ideas. Before moving to Level 2, review the sections where recall was partial — particularly the routing description ingredients and the refinement loop. These are operational skills you will use every time you write a skill.</p>
        </div>
      )}
      {pct < 55 && (
        <div className="callout callout-warning">
          <div className="callout-label">Re-read recommended before continuing</div>
          <p>The practical skills in this module — task selection, routing description authorship, and the refinement loop — are prerequisites for Level 2. Re-read sections 3.1–3.4, then revisit the recall check without looking at your previous answers.</p>
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <h3>Spaced Repetition Reminder</h3>
        <p className="prose" style={{ marginTop: 8 }}>
          Reviewing this material at <strong>24 hours</strong>, <strong>3 days</strong>, and <strong>1 week</strong> dramatically improves long-term retention. Return to this module's flashcard set at each of those intervals — active recall is far more effective than re-reading.
        </p>
      </div>

      <div style={{ marginTop: 28 }}>
        <h3>Key Concepts to Carry Forward</h3>
        <ul className="content-list">
          <li><strong>Skill candidate criteria</strong> — repetitive, structured inputs, deterministic output, high cost of silent failure</li>
          <li><strong>Routing description ingredients</strong> — trigger phrase(s) + artifact type + output shape, all on one line</li>
          <li><strong>Write description last</strong> — after the body, when you know exactly what the skill does</li>
          <li><strong>First-draft trap</strong> — numbered steps in the Reasoning Framework produce brittle skills; use declarative principles</li>
          <li><strong>Refinement loop</strong> — draft → test → identify failure type → fix the right layer → re-test; minimum 2-3 cycles</li>
          <li><strong>One passing test ≠ validation</strong> — test with varied phrasing and at least one documented edge case before deploying</li>
        </ul>
      </div>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [sectionIdx, setSectionIdx]     = useState(0);
  const [completed, setCompleted]       = useState(new Set());
  const [recallScores, setRecallScores] = useState({});
  const [quizScores, setQuizScores]     = useState({});
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [reviewMode, setReviewMode]     = useState(false);
  const [timerSecs, setTimerSecs]       = useState(25 * 60);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showBreak, setShowBreak]       = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    storageGet("engagement:module3:complete").then(data => {
      if (data && data.timestamp) setReviewMode(true);
    });
  }, []);

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

  const timerMins    = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const timerSec2    = String(timerSecs % 60).padStart(2, "0");
  const timerDisplay = `${timerMins}:${timerSec2}`;
  const timerClass   = timerExpired ? "timer-expired" : timerSecs < 300 ? "timer-warning" : "";

  const goTo = (idx) => {
    setSectionIdx(idx);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const next = () => {
    setCompleted(prev => new Set([...prev, SECTIONS[sectionIdx].id]));
    goTo(Math.min(sectionIdx + 1, SECTIONS.length - 1));
  };

  const progress = Math.round((sectionIdx / (SECTIONS.length - 1)) * 100);

  const renderSection = () => {
    const sec = SECTIONS[sectionIdx];
    switch (sec.id) {
      case "prediction":   return <SectionPrediction onNext={next} />;
      case "intro":        return <SectionIntro onNext={next} />;
      case "choose-task":  return <SectionChooseTask onNext={next} />;
      case "routing-desc": return <SectionRoutingDesc onNext={next} />;
      case "build-body":   return <SectionBuildBody onNext={next} />;
      case "validate":     return <SectionValidate onNext={next} />;
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
      case "summary":  return <SectionSummary onNext={next} />;
      case "complete": return <SectionComplete recallScores={recallScores} quizScores={quizScores} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="lesson-shell" style={{ gridTemplateColumns: sidebarOpen ? "260px 1fr" : "44px 1fr" }}>
        <header className="lesson-header">
          <span className="header-badge">Level 1</span>
          {reviewMode && <span className="header-badge-review">Review</span>}
          <span className="header-title">Module 3 — Writing Your First Skill</span>
          <span className={`timer-display ${timerClass}`}>⏱ {timerDisplay}</span>
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-label">{progress}%</span>
          </div>
        </header>

        <nav className={`lesson-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-toggle-row">
            {sidebarOpen && <span className="sidebar-section-label">Contents</span>}
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
