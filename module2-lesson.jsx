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
  .code-block .ck { color: #E8A835; }

  /* ── divider ── */
  .divider { border: none; border-top: 1px solid ${G.border}; margin: 36px 0; }

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
The student is about to read Module 2: Anatomy of a Skill Primitive. Their prediction is an activation exercise — not a test.
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "2-3 sentences: (1) note what shows good intuition or prior knowledge, (2) briefly hint at what the lesson adds or clarifies, (3) encourage forward. Correct = identified structural differences, the frontmatter/body distinction, or the routing signal concept. Partial = touched something related but vague. Incorrect = off-base. Tone: warm, forward-looking."
}`;

const RECALL_SYSTEM = `You are an expert instructor assessing a student's recall answer for Module 2 of the Agent-Readable Skills Infrastructure curriculum, titled "Anatomy of a Skill Primitive."
The module covers: the frontmatter block (name, description, license), the single-line routing description constraint, and the five body subsystems (Reasoning Framework, Deterministic Output Spec, Explicit Boundary Edge Cases, Pattern-Matching Exemplars, Contextual Economy).
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "2-4 sentences: (1) affirm what was right, (2) correct or fill in what was missing, (3) reinforce the key concept. Tone: precise and direct. Not sycophantic."
}
Grading: correct = essential concept captured accurately. partial = got some but missed something important. incorrect = missed the concept or left blank.`;

const QUIZ_SYSTEM = `You are an expert instructor explaining a quiz answer for Module 2: Anatomy of a Skill Primitive (Agent-Readable Skills Infrastructure curriculum).
The student selected an answer that was {{CORRECT_OR_NOT}}.
Return ONLY a JSON object:
{
  "message": "2-3 sentences: explain why the correct answer is right and, if the student was wrong, why their choice was incorrect. Be specific. Use concrete examples from the skill.markdown domain. Tone: clear, informative."
}`;

const SUMMARY_SYSTEM = `You are assessing a student's written summary of Module 2: "Anatomy of a Skill Primitive" from the Agent-Readable Skills Infrastructure curriculum.
A complete correct answer covers ALL THREE of: (1) the frontmatter block (description is a single-line routing signal); (2) the five body subsystems (Reasoning Framework, Deterministic Output Spec, Edge Cases, Exemplars, Contextual Economy — need not name all five perfectly); (3) the routing description deserves the most engineering effort (the 80/20 rule).
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
  { id: "prediction",   label: "Pre-Lesson Prediction",     type: "prediction" },
  { id: "intro",        label: "Introduction",              type: "content"    },
  { id: "frontmatter",  label: "2.1 The Frontmatter Block", type: "content"    },
  { id: "five-systems", label: "2.2 The Five Subsystems",   type: "content"    },
  { id: "full-skill",   label: "2.3 Reading a Full Skill",  type: "content"    },
  { id: "eighty-twenty",label: "2.4 The 80/20 Rule",        type: "content"    },
  { id: "recall",       label: "Recall Check",              type: "recall"     },
  { id: "quiz",         label: "Mini-Quiz",                 type: "quiz"       },
  { id: "summary",      label: "Written Summary",           type: "summary"    },
  { id: "complete",     label: "Module Complete",           type: "complete"   },
];

const RECALL_QUESTIONS = [
  {
    id: "r1",
    prompt: "Name the five subsystems of a resilient skill body. You don't need perfect wording — describe what each one does in your own terms.",
    rubric: "Looking for: (1) Reasoning Framework — declarative principles that let the model generalize; (2) Deterministic Output Spec — exact output schema (columns, fields, counts); (3) Explicit Boundary Edge Cases — documented failure states that override default model behavior; (4) Pattern-Matching Exemplars — example output files in the skill directory for few-shot anchoring; (5) Contextual Economy — 150-line constraint for context window discipline. Credit for capturing the essence of each, not exact names.",
  },
  {
    id: "r2",
    prompt: "Why must a routing description occupy exactly one continuous line? What goes wrong if it spans multiple lines?",
    rubric: "Key points: the description is parsed by the LLM gateway as the primary routing signal. Multi-line descriptions — typically caused by code auto-formatters — break execution parsers. The parser reads only the first line, leaving constraints and trigger phrases unread. Result: routing failures (skill not invoked) or degraded execution (skill fires but without key constraints).",
  },
  {
    id: "r3",
    prompt: "What is the difference between a procedural instruction set and a declarative reasoning framework in a skill body? Which makes a skill more resilient?",
    rubric: "Procedural = numbered steps (Step 1, 2, 3...) that fail at unanticipated edge cases — if the model hits step 2.5, there's no guidance. Declarative = encoded decision principles, quality criteria, domain mental models that let the model generalize to situations not explicitly listed. Declarative reasoning frameworks produce more resilient skills.",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "A developer writes a routing description: 'This skill helps enterprise teams with market research, competitive intelligence, and industry trend analysis across various business functions.' What is the most likely failure this introduces?",
    options: [
      { text: "The skill will fail to route because the description is too abstract — no concrete trigger phrases for the gateway to match against user intent.", correct: true  },
      { text: "The skill will execute too slowly because the description is too long.", correct: false },
      { text: "The skill will only work on certain operating systems.", correct: false },
      { text: "The skill file will exceed the 150-line limit.", correct: false },
    ],
    explanation: "Abstract descriptions cause under-triggering: the routing description has no concrete trigger phrases or artifact types to anchor on. When a user types 'analyze competitors,' the gateway's router cannot match that intent to a description that only talks about 'market research and competitive intelligence' in abstract terms. The fix is to replace the summary with explicit trigger phrases, artifact type, and output shape.",
  },
  {
    id: "q2",
    text: "Which of the following correctly describes what a 'Deterministic Output Specification' does in a skill body?",
    options: [
      { text: "It specifies the exact output structure — column names, field labels, row counts — so downstream agents can parse results reliably without interpretation.", correct: true  },
      { text: "It lists step-by-step instructions for the model to follow in sequence.", correct: false },
      { text: "It defines the reasoning principles the model should use when encountering edge cases.", correct: false },
      { text: "It provides example input files for the model to learn from.", correct: false },
    ],
    explanation: "The Deterministic Output Spec is a machine-readable contract about the shape of what the skill returns — not about the process of producing it. If a downstream agent knows it will receive exactly 5 rows with columns named 'Competitor Name | Pricing Tier | Market Share Estimate | Key Technical Gap,' it can parse and act on that result without further interpretation. That predictability is what makes skills composable in agent pipelines.",
  },
  {
    id: "q3",
    text: "According to the 80/20 rule of skill design, where should the majority of engineering effort go?",
    options: [
      { text: "Crafting the single-line routing description with concrete trigger phrases and output shape.", correct: true  },
      { text: "Writing detailed step-by-step procedural instructions in the skill body.", correct: false },
      { text: "Creating comprehensive pattern-matching exemplars in the skill directory.", correct: false },
      { text: "Documenting every possible edge case in exhaustive detail.", correct: false },
    ],
    explanation: "The routing description is the entire gateway interface for your skill — it determines whether the skill is ever invoked at all. A perfectly engineered body is invisible if the router never calls it. Most practitioners invest effort in the wrong direction: elaborate body sections with a vague one-line description that routes inconsistently. Write the description last, after you fully understand what the skill does, and treat it as the highest-leverage work in the file.",
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
    if (idx === selected && shuffled[idx]?.correct)  base += " correct";
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
    storageSet("engagement:module2:prediction", { grade: res.grade, timestamp: Date.now() });
  };

  return (
    <div>
      <div className="sec-eyebrow">Before You Read</div>
      <div className="sec-title">Pre-Lesson Prediction</div>
      <p className="prose">
        Before you encounter the lesson's arguments, activate what you already think. This is not a test — there is no penalty for being wrong. Writing a prediction before reading measurably improves how well new ideas consolidate in memory.
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
          In one sentence: what do you think are the key structural differences between a skill.markdown file and an ordinary text prompt?
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
      <div className="sec-eyebrow">Level 1 · Module 2</div>
      <div className="sec-title">Anatomy of a Skill Primitive</div>
      <div className="sec-sub">Inside the File That Replaces a Prompt</div>
      <p className="prose">
        Module 1 established <em>why</em> skills exist. This module opens the file and shows you what's actually inside one — the two structural regions, the five operational subsystems, and the engineering principle that governs how effort should be allocated when you write one.
      </p>
      <p className="prose">
        By the end of this module you will be able to: <strong>identify the two structural regions of a skill.markdown file</strong>, name and describe the five body subsystems, read an annotated complete skill and explain what each section does, and apply the 80/20 rule when planning skill authorship.
      </p>
      <div className="callout callout-tip">
        <div className="callout-label">How to use this lesson</div>
        <p>Read each section fully before moving on. When you reach the Recall Check, look away from the screen and try to reconstruct each answer from memory. The act of retrieval — not re-reading — is what builds durable understanding.</p>
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

function SectionFrontmatter({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 2.1</div>
      <div className="sec-title">The Frontmatter Block</div>
      <div className="sec-sub">The Gateway to Your Skill</div>
      <p className="prose">
        A <strong>skill.markdown</strong> file has two structural regions separated by the frontmatter delimiter <code style={{fontFamily:"'JetBrains Mono',monospace",background:G.code,padding:"2px 6px",borderRadius:3,fontSize:13,color:"#8EC8F0"}}>---</code>. The top region is the <strong>frontmatter block</strong>. The bottom is the <strong>skill body</strong>. The frontmatter is what the LLM gateway reads first — and for routing purposes, it's the only part that must be machine-parseable in a strict sense.
      </p>
      <div className="code-block">
        <pre>{`---
name: competitor-analysis
description: "Triggers on 'analyze competitors' or 'market players' to output
              a 4-column markdown matrix: Competitor Name | Pricing Tier |
              Market Share | Key Technical Gap. Always 5 rows."
license: Proprietary
---

## Reasoning Framework
...

## Output Specification
...`}</pre>
      </div>
      <div className="callout callout-warning">
        <div className="callout-label">The above example contains a critical flaw</div>
        <p>Look at the <code style={{fontFamily:"'JetBrains Mono',monospace",background:"#1A0808",padding:"1px 5px",borderRadius:3,fontSize:13,color:"#C08080"}}>description</code> field. It spans three lines. <strong>This breaks routing.</strong> LLM gateways parse the description as a single routing signal string. A multi-line description — commonly introduced by a code auto-formatter — causes the parser to read only the first line, leaving constraints and trigger phrases invisible. The corrected version occupies exactly one line.</p>
      </div>
      <h3>The three frontmatter fields</h3>
      <ul className="content-list">
        <li><strong>name</strong> — the skill's identifier; must match its directory name; used in logs, dashboards, and version control history</li>
        <li><strong>description</strong> — the routing signal; <em>exactly one line</em>; this is what the gateway's router reads to decide whether to invoke the skill</li>
        <li><strong>license</strong> — ownership and usage rights; essential for enterprise governance; determines who can modify and deploy the skill</li>
      </ul>
      <div className="callout callout-insight">
        <div className="callout-label">The description field does most of the work</div>
        <p>The gateway's routing logic works by matching user query semantics against skill descriptions. A description that says "helps with analysis tasks" gives the router almost nothing to anchor on. A description that says "Triggers on 'analyze competitors' or 'market players' to output a 4-column markdown matrix" gives the router concrete phrases, output shape, and artifact type — everything it needs to match reliably.</p>
      </div>
      <h3>What a good routing description contains</h3>
      <ul className="content-list">
        <li><strong>Trigger phrase(s)</strong> — exact phrases that identify this skill's domain, in quotes</li>
        <li><strong>Artifact type</strong> — what kind of output: markdown table, Excel layout, PDF block, JSON object</li>
        <li><strong>Output shape</strong> — specific constraints: column names, row counts, field labels, exclusion rules</li>
      </ul>
      <div className="compare-grid">
        <div className="cg-header cg-bad-h">❌  Vague description</div>
        <div className="cg-header cg-good-h">✅  Compliant description</div>
        <div className="cg-bad">
          "Assists enterprise analysts with evaluating and running competitive analysis market overviews."
        </div>
        <div className="cg-good">
          "Triggers on 'analyze competitors' or 'market players' to output a 4-column markdown matrix: Competitor Name | Pricing Tier | Market Share | Key Technical Gap. Always 5 rows."
        </div>
        <div className="cg-note-bad">Abstract. No trigger phrases. No artifact type. Router cannot anchor on this — skill under-triggers.</div>
        <div className="cg-note-good">Concrete trigger phrases. Named artifact type. Named columns. Row constraint. All on one line.</div>
      </div>
      <div className="sec-nav"><span />
        <button className="btn btn-next" onClick={onNext}>Next: The Five Subsystems →</button>
      </div>
    </div>
  );
}

function SectionFiveSystems({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 2.2</div>
      <div className="sec-title">The Five Subsystems</div>
      <div className="sec-sub">What a Resilient Skill Body Contains</div>
      <p className="prose">
        The skill body — everything below the frontmatter delimiter — is not a procedure. It does not list Step 1, Step 2, Step 3. It is a <strong>declarative system</strong> organized into five structural components, each addressing a different failure mode.
      </p>
      <div className="callout callout-warning">
        <div className="callout-label">Why procedural steps fail</div>
        <p>A numbered step list creates a brittle skill: if the model encounters step 2.5 — a situation between steps — it has no framework to fall back on. It either hallucinates an answer or stops. Declarative reasoning frameworks allow the model to generalize. This is the most common first-draft mistake.</p>
      </div>
      <h3>1 — Reasoning Framework</h3>
      <p className="prose">
        Declarative decision principles, quality criteria, and domain mental models. Not instructions — <em>principles</em>. The Reasoning Framework tells the model <strong>how to think</strong> about ambiguous situations and out-of-distribution inputs, so it can handle cases you never explicitly anticipated.
      </p>
      <div className="callout callout-insight">
        <div className="callout-label">Example</div>
        <p>"Prioritize verifiable market data over estimates. When pricing is unavailable, note 'Unverified' — do not extrapolate. Evaluate technical gaps from the requester's assumed product category unless explicitly specified."</p>
      </div>
      <h3>2 — Deterministic Output Specification</h3>
      <p className="prose">
        The exact structure of what the skill returns: column names, field labels, row counts, format types. This is a machine-readable contract. Downstream agents — and human readers — depend on this structure never varying between runs.
      </p>
      <ul className="content-list">
        <li>Name every column or field by its exact label</li>
        <li>Specify row count or section count exactly ("always 5 rows," "exactly 3 sections")</li>
        <li>Include format constraints ("markdown table," "JSON array," "bullet list")</li>
      </ul>
      <h3>3 — Explicit Boundary Edge Cases</h3>
      <p className="prose">
        Documented failure states — the scenarios where human practitioners rely on intuition but the model would otherwise hallucinate. Edge case documentation replaces default model behavior with <strong>defined policy</strong>.
      </p>
      <p className="prose">
        Rule of thumb: <strong>every skill needs at least three documented edge cases</strong>. If you can't identify three, you don't understand your own skill well enough yet.
      </p>
      <h3>4 — Pattern-Matching Exemplars</h3>
      <p className="prose">
        Static example output files stored in the skill's directory (e.g., <code style={{fontFamily:"'JetBrains Mono',monospace",background:G.code,padding:"2px 6px",borderRadius:3,fontSize:13,color:"#8EC8F0"}}>example-output.md</code>). These serve as few-shot anchors — when the model sees what a correct output looks like, it produces structurally consistent results far more reliably than without the example. One good exemplar file is worth several paragraphs of output instructions.
      </p>
      <h3>5 — Contextual Economy</h3>
      <p className="prose">
        The discipline of keeping the entire skill file under <strong>150 lines</strong>. This is not a soft suggestion — it is an engineering constraint. LLM context windows in production gateways handle the skill file, the user input, and the model's working space simultaneously. A bloated skill competes with its own execution.
      </p>
      <div className="callout callout-tip">
        <div className="callout-label">Treat the 150-line limit as a design constraint, not a ceiling</div>
        <p>Most well-designed skills stay under 80 lines. If you can't say what the skill does in 80 lines, it's doing too much — split it into two skills with narrower scope.</p>
      </div>
      <div className="sec-nav"><span />
        <button className="btn btn-next" onClick={onNext}>Next: Reading a Full Skill →</button>
      </div>
    </div>
  );
}

function SectionFullSkill({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 2.3</div>
      <div className="sec-title">Reading a Complete Skill</div>
      <div className="sec-sub">Every Part in Its Place</div>
      <p className="prose">
        Below is a complete, production-grade <code style={{fontFamily:"'JetBrains Mono',monospace",background:G.code,padding:"2px 6px",borderRadius:3,fontSize:13,color:"#8EC8F0"}}>skill.markdown</code> file. Read it carefully, then read the annotations beneath each section. Notice what is <em>not</em> present: no numbered steps, no verbose explanations, no conversational tone.
      </p>
      <div className="code-block">
        <pre>{`---
name: competitor-analysis
description: "Triggers on 'analyze competitors' or 'market players' to output a 4-column markdown matrix: Competitor Name | Pricing Tier | Market Share Estimate | Key Technical Gap. Always 5 rows. Excludes companies under $10M revenue."
license: Proprietary
---

## Reasoning Framework
Prioritize verifiable market data over estimates. When pricing data is
unavailable, note "Unverified" in the Pricing Tier field rather than
extrapolating. Evaluate technical gaps from the perspective of the
requester's assumed product category unless explicitly specified.
When multiple data points conflict, prefer the most recent source.

## Output Specification
Return exactly one markdown table with these four columns:
| Competitor Name | Pricing Tier | Market Share Estimate | Key Technical Gap |
Always output exactly 5 rows. If fewer than 5 verifiable competitors
exist, populate remaining rows with "Insufficient Data" entries.

## Edge Cases
- No industry context provided: ask one clarifying question before output.
- Company has no public pricing: use "Undisclosed" — do not guess a number.
- Company under $10M revenue: respond "Below revenue threshold for analysis."

## Pattern-Matching Exemplar
See competitor-analysis/example-output.md for a correctly formatted
5-row matrix with all required fields populated.`}</pre>
      </div>
      <h3>Annotations</h3>
      <ul className="content-list">
        <li><strong>Frontmatter description (line 3)</strong> — single line, trigger phrases in quotes, artifact type named, column count specified, constraint stated. Everything the router needs is here.</li>
        <li><strong>Reasoning Framework</strong> — four decision principles that handle ambiguity. No steps. No "first, then, finally." Each sentence answers: what do I do when the data is imperfect?</li>
        <li><strong>Output Specification</strong> — exact column labels (not "name" but "Competitor Name"). Row count stated absolutely. Fallback behavior for sparse data defined. Downstream agents can rely on this structure.</li>
        <li><strong>Edge Cases</strong> — three documented failure states. Each replaces a default model behavior (guessing, hallucinating, continuing without clarification) with defined policy.</li>
        <li><strong>Pattern-Matching Exemplar</strong> — a pointer to the example file, not the example itself, to preserve context economy.</li>
      </ul>
      <div className="callout callout-insight">
        <div className="callout-label">What this file does NOT contain</div>
        <p>No numbered procedure. No "you are a helpful assistant." No vague goals like "be comprehensive." No verbose explanation of the business context. Every line serves a structural purpose — routing, reasoning, output contract, failure handling, or exemplar anchoring.</p>
      </div>
      <div className="sec-nav"><span />
        <button className="btn btn-next" onClick={onNext}>Next: The 80/20 Rule →</button>
      </div>
    </div>
  );
}

function SectionEightyTwenty({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 2.4</div>
      <div className="sec-title">The 80/20 Rule</div>
      <div className="sec-sub">Most Effort Goes Where Most Practitioners Don't Look</div>
      <p className="prose">
        The original curriculum source states this directly: allocate <strong>80% of development effort to the single-line routing description</strong> and 20% to the foundational reasoning mechanics of the body.
      </p>
      <p className="prose">
        This ratio surprises most practitioners. Their instinct is to invest in the body — the reasoning framework, the output spec, the edge cases. Those elements are important. But a perfectly engineered body is invisible if the routing description fails to invoke the skill in the first place.
      </p>
      <div className="callout callout-warning">
        <div className="callout-label">The invisible skill problem</div>
        <p>The most common failure mode in skill deployment is not a broken body — it's a vague description that causes the router to never fire the skill. Teams spend hours refining edge cases for a skill that their users never encounter because the gateway doesn't know when to call it. The description is the entire interface.</p>
      </div>
      <h3>Why the description is harder than it looks</h3>
      <ul className="content-list">
        <li>It must compress the full behavioral contract into one line — no room for ambiguity</li>
        <li>It must contain trigger phrases that match how real users phrase queries, not how you think about the skill</li>
        <li>It must specify artifact type and output shape without exceeding the single-line limit</li>
        <li>It must be "pushy and explicit" — abstract systemic summaries actively harm routing precision</li>
      </ul>
      <div className="callout callout-tip">
        <div className="callout-label">Write the description last</div>
        <p>The best time to write the routing description is after you have drafted the body. By then you understand exactly what the skill does, what it returns, and what triggers it. Many practitioners write the description first and then discover their body doesn't match it — or write a description so vague they can't validate it against any output.</p>
      </div>
      <h3>Testing your description</h3>
      <p className="prose">
        Before deploying, ask: if a colleague typed the phrases in my description into the gateway, would they clearly expect to get exactly what my Output Specification returns? If the answer requires explanation, the description needs revision.
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
              <RecallItem q={q} moduleN={2} onSubmit={(grade) => handleScore(q.id, grade)} />
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
      <p className="prose">Three questions on Module 2 content. Select the best answer — you'll receive an explanation for each one regardless of whether you're right or wrong.</p>
      {QUIZ_QUESTIONS.map(q => (
        <QuizItem key={q.id} q={q} moduleN={2} onResult={(c) => handleResult(q.id, c)} />
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
    storageSet("engagement:module2:summary", { grade: res.grade, timestamp: Date.now() });
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
        <p>In 3–5 sentences: describe the anatomy of a skill.markdown file, name what the five body subsystems do (you don't need to name all five perfectly), and explain why the routing description deserves the most engineering effort.</p>
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
  const recallList   = Object.values(recallScores);
  const quizList     = Object.values(quizScores);
  const recallCorrect = recallList.filter(g => g === "correct").length;
  const recallPartial = recallList.filter(g => g === "partial").length;
  const quizCorrect   = quizList.filter(Boolean).length;
  const total = recallCorrect * 2 + recallPartial * 1 + quizCorrect * 2;
  const max   = RECALL_QUESTIONS.length * 2 + QUIZ_QUESTIONS.length * 2;
  const pct   = Math.round((total / max) * 100);
  const color = pct >= 80 ? G.green : pct >= 55 ? G.amber : G.red;

  useEffect(() => {
    storageSet("engagement:module2:complete", { timestamp: Date.now(), score: pct });
  }, []);

  return (
    <div>
      <div className="sec-eyebrow">Module 2 Complete</div>
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
          <div className="callout-label">Strong result</div>
          <p>You've demonstrated solid understanding of skill anatomy. You're ready for Module 3: Writing Your First Skill, where you'll apply these structural principles by building a complete skill from scratch.</p>
        </div>
      )}
      {pct >= 55 && pct < 80 && (
        <div className="callout callout-insight">
          <div className="callout-label">Good foundation — gaps to address</div>
          <p>You have the main ideas. Before moving on, review the sections where recall was partial — particularly the five subsystems and the 80/20 rule. These are prerequisite knowledge for Module 3.</p>
        </div>
      )}
      {pct < 55 && (
        <div className="callout callout-warning">
          <div className="callout-label">Re-read recommended before continuing</div>
          <p>The structural concepts in this module are the foundation for everything in Modules 3–9. Re-read sections 2.1–2.4, then revisit the recall check without looking at your previous answers.</p>
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <h3>Spaced Repetition Reminder</h3>
        <p className="prose" style={{ marginTop: 8 }}>
          Reviewing this material at <strong>24 hours</strong>, <strong>3 days</strong>, and <strong>1 week</strong> dramatically improves long-term retention. Return to this module's flashcard set at each of those intervals — even 5 minutes of active recall is worth more than an hour of re-reading.
        </p>
      </div>

      <div style={{ marginTop: 28 }}>
        <h3>Key Concepts to Carry Forward</h3>
        <ul className="content-list">
          <li><strong>Frontmatter block</strong> — name, description (single-line routing signal), license</li>
          <li><strong>Five subsystems</strong> — Reasoning Framework, Output Spec, Edge Cases, Exemplars, Contextual Economy</li>
          <li><strong>Single-line constraint</strong> — multi-line descriptions break execution parsers; always one continuous line</li>
          <li><strong>Declarative over procedural</strong> — principles generalize; step lists fail at edge cases</li>
          <li><strong>80/20 rule</strong> — most effort on the routing description; a perfect body with a bad description produces an invisible skill</li>
        </ul>
      </div>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [sectionIdx, setSectionIdx]   = useState(0);
  const [completed, setCompleted]     = useState(new Set());
  const [recallScores, setRecallScores] = useState({});
  const [quizScores, setQuizScores]   = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reviewMode, setReviewMode]   = useState(false);
  const [timerSecs, setTimerSecs]     = useState(25 * 60);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showBreak, setShowBreak]     = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    storageGet("engagement:module2:complete").then(data => {
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

  const timerMins = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const timerSec2 = String(timerSecs % 60).padStart(2, "0");
  const timerDisplay = `${timerMins}:${timerSec2}`;
  const timerClass = timerExpired ? "timer-expired" : timerSecs < 300 ? "timer-warning" : "";

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
      case "prediction":    return <SectionPrediction onNext={next} />;
      case "intro":         return <SectionIntro onNext={next} />;
      case "frontmatter":   return <SectionFrontmatter onNext={next} />;
      case "five-systems":  return <SectionFiveSystems onNext={next} />;
      case "full-skill":    return <SectionFullSkill onNext={next} />;
      case "eighty-twenty": return <SectionEightyTwenty onNext={next} />;
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
          <span className="header-title">Module 2 — Anatomy of a Skill Primitive</span>
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
