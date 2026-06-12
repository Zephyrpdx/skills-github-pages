import { useState, useRef, useEffect } from "react";

const G = {
  navy:"#0F1B2D", navyM:"#162236", navyL:"#1D2E45", slate:"#2A3F5C",
  muted:"#4A6080", border:"#2E4060", amber:"#E8A835", amberL:"#F5C055",
  cream:"#F5F0E8", creamD:"#E8E0D0", text:"#D8CFC0", textD:"#A09888",
  red:"#C44040", green:"#3A9E6E", white:"#FFFFFF", code:"#0D2030",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${G.navy}; color: ${G.text}; font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; }
  .lesson-shell { display: grid; grid-template-rows: 56px 1fr; height: 100vh; overflow: hidden; }
  .lesson-header { grid-column: 1/-1; background: ${G.navyM}; border-bottom: 1px solid ${G.border}; display: flex; align-items: center; padding: 0 24px; gap: 16px; }
  .header-badge { background: ${G.amber}; color: ${G.navy}; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; }
  .header-title { font-family: 'Crimson Pro', serif; font-size: 18px; color: ${G.cream}; flex: 1; }
  .progress-bar-wrap { display: flex; align-items: center; gap: 10px; }
  .progress-bar-track { width: 140px; height: 4px; background: ${G.slate}; border-radius: 2px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg,${G.amber},${G.amberL}); border-radius: 2px; transition: width .5s ease; }
  .progress-label { font-size: 12px; color: ${G.textD}; min-width: 36px; text-align: right; }
  .timer-display { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${G.textD}; background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 5px; padding: 3px 10px; flex-shrink: 0; }
  .timer-warning { color: ${G.amber}; border-color: ${G.amber}60; }
  .timer-expired { color: ${G.red}; border-color: ${G.red}60; animation: timerPulse 2s ease-in-out infinite; }
  @keyframes timerPulse { 0%,100%{opacity:1;} 50%{opacity:.6;} }
  .break-banner { background: #1A1000; border: 1px solid ${G.amber}60; border-radius: 6px; padding: 14px 20px; margin: 0 0 24px; display: flex; align-items: center; gap: 12px; font-size: 14px; }
  .lesson-sidebar { background: ${G.navyM}; border-right: 1px solid ${G.border}; overflow-y: auto; padding: 20px 0; transition: width .25s ease; overflow: hidden; }
  .sidebar-section-label { font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: ${G.muted}; padding: 8px 20px 6px; }
  .sidebar-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 0 12px 8px; }
  .sidebar-toggle { background: none; border: none; color: ${G.textD}; cursor: pointer; font-size: 16px; padding: 2px 6px; border-radius: 3px; }
  .sidebar-toggle:hover { color: ${G.amber}; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 8px 20px; cursor: pointer; transition: background .15s; border-left: 2px solid transparent; }
  .sidebar-item:hover { background: ${G.navyL}; }
  .sidebar-item.active { background: ${G.navyL}; border-left-color: ${G.amber}; }
  .sidebar-item.completed .si-dot { background: ${G.green}; }
  .si-dot { width: 8px; height: 8px; border-radius: 50%; background: ${G.slate}; flex-shrink: 0; transition: background .3s; }
  .si-label { font-size: 13px; color: ${G.textD}; line-height: 1.3; }
  .sidebar-item.active .si-label { color: ${G.cream}; }
  .lesson-main { background: ${G.navy}; overflow-y: auto; padding: 48px 56px 80px; }
  .lesson-main-inner { max-width: 820px; }
  .sec-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: ${G.amber}; margin-bottom: 10px; }
  .sec-title { font-family: 'Crimson Pro', serif; font-size: 34px; font-weight: 400; color: ${G.cream}; margin-bottom: 8px; line-height: 1.2; }
  .sec-sub { font-family: 'Crimson Pro', serif; font-size: 21px; color: ${G.text}; margin-bottom: 28px; line-height: 1.4; }
  .prose { font-size: 15px; color: ${G.text}; line-height: 1.75; margin-bottom: 20px; }
  .prose strong { color: ${G.cream}; }
  .prose em { color: ${G.amberL}; font-style: italic; }
  ul.content-list { list-style: none; padding: 0; margin: 0 0 20px; }
  ul.content-list li { padding: 6px 0 6px 20px; position: relative; color: ${G.text}; font-size: 15px; line-height: 1.65; }
  ul.content-list li::before { content: "›"; position: absolute; left: 0; color: ${G.amber}; font-weight: 700; }
  ul.content-list li strong { color: ${G.cream}; }
  .callout { border-radius: 6px; padding: 16px 20px; margin: 20px 0; border-left: 3px solid; }
  .callout-insight { background: ${G.navyL}; border-color: ${G.amber}; }
  .callout-warning { background: #2A1515; border-color: ${G.red}; }
  .callout-tip { background: #0F2A1D; border-color: ${G.green}; }
  .callout-title { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 6px; }
  .callout-insight .callout-title { color: ${G.amber}; }
  .callout-warning .callout-title { color: ${G.red}; }
  .callout-tip .callout-title { color: ${G.green}; }
  .callout p { font-size: 14px; line-height: 1.65; color: ${G.text}; }
  .rubric-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  .rubric-table th { background: ${G.navyL}; color: ${G.amber}; font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; padding: 10px 14px; text-align: left; border: 1px solid ${G.border}; }
  .rubric-table td { padding: 10px 14px; border: 1px solid ${G.border}; color: ${G.text}; vertical-align: top; line-height: 1.55; }
  .rubric-table .score-5 td:first-child { color: ${G.green}; font-weight: 700; }
  .rubric-table .score-4 td:first-child { color: ${G.amberL}; font-weight: 700; }
  .rubric-table .score-3 td:first-child { color: ${G.amber}; font-weight: 700; }
  .rubric-table .score-2 td:first-child { color: #E07840; font-weight: 700; }
  .rubric-table .score-1 td:first-child { color: ${G.red}; font-weight: 700; }
  .code-block { background: ${G.code}; border-radius: 6px; padding: 16px 18px; margin: 16px 0; overflow-x: auto; }
  .code-block pre { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #8EC8F0; line-height: 1.6; white-space: pre; }
  .recall-box { background: ${G.navyL}; border: 1px solid ${G.amber}50; border-radius: 8px; padding: 20px; margin: 24px 0; }
  .recall-label { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: ${G.amber}; margin-bottom: 8px; }
  .recall-prompt { font-size: 15px; color: ${G.cream}; margin-bottom: 12px; line-height: 1.5; }
  textarea.recall-input { width: 100%; background: ${G.navy}; border: 1px solid ${G.border}; border-radius: 6px; padding: 10px 14px; color: ${G.text}; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.6; resize: vertical; min-height: 90px; outline: none; transition: border-color .2s; }
  textarea.recall-input:focus { border-color: ${G.amber}60; }
  .feedback-box { border-radius: 6px; padding: 14px 18px; margin-top: 12px; font-size: 14px; line-height: 1.6; }
  .feedback-box.correct { background: #0C2016; border: 1px solid ${G.green}50; color: ${G.green}; }
  .feedback-box.partial { background: #1A1400; border: 1px solid ${G.amber}50; color: ${G.amberL}; }
  .feedback-box.incorrect { background: #1E0C0C; border: 1px solid ${G.red}50; color: ${G.red}; }
  .feedback-box.feedback-loading { background: ${G.navyL}; border: 1px solid ${G.border}; color: ${G.textD}; display: flex; align-items: center; gap: 10px; }
  .feedback-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 4px; }
  .quiz-box { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 20px; margin: 24px 0; }
  .quiz-label { font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: ${G.amber}; margin-bottom: 8px; }
  .quiz-q { font-size: 15px; color: ${G.cream}; margin-bottom: 16px; line-height: 1.5; }
  .quiz-options { display: flex; flex-direction: column; gap: 8px; }
  .quiz-option { display: flex; align-items: flex-start; gap: 12px; padding: 10px 14px; background: ${G.navy}; border: 1px solid ${G.border}; border-radius: 6px; cursor: pointer; transition: border-color .15s; }
  .quiz-option:hover:not(.locked) { border-color: ${G.amber}60; }
  .quiz-option.selected { border-color: ${G.amber}; background: ${G.navyL}; }
  .quiz-option.correct { border-color: ${G.green}; background: #0C2016; }
  .quiz-option.wrong { border-color: ${G.red}; background: #1E0C0C; }
  .quiz-option.locked { cursor: default; }
  .option-letter { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: ${G.textD}; padding-top: 2px; flex-shrink: 0; width: 16px; }
  .option-text { font-size: 14px; color: ${G.text}; line-height: 1.5; }
  .quiz-option.correct .option-text { color: ${G.green}; }
  .quiz-option.wrong .option-text { color: ${G.red}; }
  .btn { padding: 10px 22px; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: background .15s; }
  .btn-primary { background: ${G.amber}; color: ${G.navy}; font-weight: 600; }
  .btn-primary:hover { background: ${G.amberL}; }
  .btn-next { background: ${G.navyL}; color: ${G.amber}; border: 1px solid ${G.amber}50; }
  .btn-next:hover { background: ${G.slate}; }
  .btn-disabled { opacity: .4; cursor: default; }
  .spinner { width: 18px; height: 18px; border: 2px solid ${G.border}; border-top-color: ${G.amber}; border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .score-circle { width: 100px; height: 100px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px solid; margin: 0 auto 20px; }
  .score-n { font-family: 'Crimson Pro', serif; font-size: 34px; line-height: 1; }
  .score-label { font-size: 14px; color: ${G.textD}; margin-bottom: 24px; }
  .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; }
  .score-item { background: ${G.navy}; border-radius: 6px; padding: 12px; }
  .score-item-n { font-family: 'Crimson Pro', serif; font-size: 28px; color: ${G.cream}; }
  .score-item-l { font-size: 11px; color: ${G.textD}; margin-top: 2px; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.slate}; border-radius: 3px; }
`;

const storageSet = async (key, val) => {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
};

async function assessWithClaude(sys, msg) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: [{ role: "user", content: msg }] }),
  });
  const data = await res.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch { return { grade: "partial", label: "Feedback", message: text }; }
}

const PREDICTION_SYSTEM = `You are a learning coach. Student is about to read Module 8: Quantitative Testing. Return ONLY: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "2-3 sentences. Correct = understands why manual testing is insufficient for production skills. Partial = vaguely related. Incorrect = off-base. Warm, forward-looking." }`;

const RECALL_SYSTEM = `You are assessing a recall answer for Module 8: "Quantitative Testing." Module covers: transformer sensitivity (vocabulary changes cascade to adjacent skills), three harness components (static test cases, numeric scoring rubric, version comparison protocol), and the rubric design rule (no subjective criteria). Return ONLY: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "2-4 precise sentences." }`;

const QUIZ_SYSTEM = `Expert instructor explaining quiz answer for Module 8: Quantitative Testing. Answer was {{CORRECT_OR_NOT}}. Return ONLY: { "message": "2-3 sentences: why correct is right, if wrong why their choice was incorrect." }`;

const SUMMARY_SYSTEM = `Assessing student summary of Module 8: "Quantitative Testing." Complete answer covers: (1) why manual testing fails (transformer sensitivity, cross-skill cascades); (2) the three harness components; (3) why the scoring rubric must be objectively verifiable, not subjective. Return ONLY: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "3-4 precise sentences." }`;

function shuffleOptions(opts) { return [...opts].sort(() => Math.random() - 0.5); }

const moduleN = 8;

const SECTIONS = [
  { id: "prediction",   label: "Pre-Lesson Prediction",          type: "prediction" },
  { id: "intro",        label: "Introduction",                   type: "content"    },
  { id: "sensitivity",  label: "8.1 Transformer Sensitivity",    type: "content"    },
  { id: "harness",      label: "8.2 The Testing Harness",        type: "content"    },
  { id: "rubric",       label: "8.3 The Scoring Rubric",         type: "content"    },
  { id: "protocol",     label: "8.4 Version Comparison Protocol",type: "content"    },
  { id: "recall",       label: "Recall Check",                   type: "recall"     },
  { id: "quiz",         label: "Mini-Quiz",                      type: "quiz"       },
  { id: "summary",      label: "Written Summary",                type: "summary"    },
  { id: "complete",     label: "Module Complete",                type: "complete"   },
];

const RECALL_QUESTIONS = [
  {
    id: "r1",
    prompt: "Explain the transformer sensitivity problem in your own words. What's the mechanism that causes a small vocabulary change in one skill to affect an unrelated skill?",
    rubric: "Transformers process the entire skills context as a unified semantic field. Changing a single word shifts the probability distributions across all downstream token generation — the model's behavior is shaped by the full vocabulary of everything in context, not just the skill currently executing. A change in one skill's wording subtly shifts probability weights that affect how the model interprets adjacent skills. Manual testing catches only the changed skill; quantitative regression testing catches these cross-skill effects by running all skills against all test cases.",
  },
  {
    id: "r2",
    prompt: "Name the three components of a quantitative testing harness. For each one, describe its role in one sentence.",
    rubric: "(1) Static Test Cases — a fixed, unchanging set of input-output pairs representing happy paths, edge cases, and failure paths; the baseline for all version comparison. (2) Numeric Scoring Rubric (1–5 scale) — objective structural criteria for evaluating each test case output; every criterion must be verifiable by a parser, not a human reader. (3) Version Comparison Protocol — the procedure for running the full test basket against current (v1) and proposed (v2) versions, comparing score deltas to detect regressions before deployment.",
  },
  {
    id: "r3",
    prompt: "What makes a scoring rubric criterion objectively verifiable? Give an example of a bad criterion and rewrite it as a good one.",
    rubric: "An objectively verifiable criterion can be evaluated by a parser without human interpretation — it checks structural properties (field count, sort order, STATUS_CODE presence, schema validation). Bad: 'Score 5 if the output looks well-structured and professional.' This requires human judgment and introduces evaluator bias. Good: 'Score 5 if: output contains exactly 5 rows, each row contains 4 pipe-delimited fields, field 4 is a valid ISO 8601 date, zero parsing errors, no prose outside the table.' A machine can execute this check without reading for quality.",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "A developer changes 'concise' to 'brief' in a Tier 1 formatting skill. A week later, a completely unrelated Tier 2 data-parsing skill starts intermittently producing malformed output. What is the most likely cause?",
    options: [
      { text: "The developer accidentally edited both files at the same time without noticing.", correct: false },
      { text: "Transformer latent space sensitivity: the vocabulary change shifted probability distributions in the shared context, affecting the adjacent skill's output generation.", correct: true },
      { text: "The data-parsing skill exceeded the 150-line limit and was truncated.", correct: false },
      { text: "The Tier 2 skill's routing description was accidentally invalidated by the Tier 1 change.", correct: false },
    ],
    explanation: "Transformers process the entire skills context as a semantic field. Changing 'concise' to 'brief' modifies the probability distributions across all downstream token generation. A skill that wasn't touched can start producing different output because the vocabulary of everything in shared context shifted. This is exactly what quantitative regression testing — including adjacent skills — is designed to catch.",
  },
  {
    id: "q2",
    text: "A rubric criterion reads: 'Score 5 if the output looks well-structured and professional.' What is the critical design flaw?",
    options: [
      { text: "The criterion doesn't specify what 'professional' means in the context of this specific skill.", correct: false },
      { text: "The criterion is subjective — it cannot be objectively verified by a parser and introduces evaluator bias between test runs.", correct: true },
      { text: "The criterion should be on a 1–10 scale, not a 1–5 scale, for this level of precision.", correct: false },
      { text: "Score 5 should be reserved for perfect output; 'well-structured' doesn't guarantee perfection.", correct: false },
    ],
    explanation: "Every rubric criterion must be objectively verifiable by a parser — not a human reader. 'Looks professional' is an aesthetic judgment that two different evaluators (or the same evaluator on different days) may rate differently. This introduces evaluator bias that makes version comparison unreliable. The criterion must be structural: 'Schema validator passes. Row count matches expected. Zero parsing errors. No prose outside the table.'",
  },
  {
    id: "q3",
    text: "A static test basket has 6 test cases. You run v1, then make a change and run v2. TC-002 drops from score 5 to score 2. TC-006 (for an adjacent Tier 1 skill) drops from 5 to 4. What is the correct deployment decision?",
    options: [
      { text: "Deploy — TC-002's drop is severe but TC-006 only dropped 1 point, which is within the acceptable threshold.", correct: false },
      { text: "Do not deploy — TC-002 dropped by 3 points, which exceeds the 1-point maximum single-case drop threshold for deployment.", correct: true },
      { text: "Deploy with monitoring — the TC-002 issue may self-correct in production as the model adapts.", correct: false },
      { text: "Re-run the tests — a 3-point drop on TC-002 indicates a test harness error, not a real regression.", correct: false },
    ],
    explanation: "The Version Comparison Protocol's deployment gate: no test case scores may drop by more than 1 point, and no cross-skill regressions may exceed 2 points. TC-002 dropped by 3 points — this immediately fails the gate. Do not deploy. Investigate what change caused the TC-002 regression before proceeding.",
  },
  {
    id: "q4",
    text: "What is the correct set of test case types for a static test basket?",
    options: [
      { text: "Only happy-path cases — edge cases and failure paths are tested separately in production.", correct: false },
      { text: "Happy path, edge cases at documented constraint boundaries, and failure paths that should trigger STATUS_CODEs.", correct: true },
      { text: "A randomly sampled set of real production inputs from the past 30 days.", correct: false },
      { text: "One test case per documented edge case in the skill file — no happy path cases needed.", correct: false },
    ],
    explanation: "A complete static test basket requires three types: (1) Happy path — well-formed input producing clean output; (2) Edge cases — inputs at documented constraint boundaries (e.g., exactly 5,000 words, two names near the same verb); (3) Failure paths — inputs that must produce specific STATUS_CODEs (e.g., non-transcript input → STATUS: INPUT_NOT_MEETING_TRANSCRIPT). All three types must pass at their thresholds for the version comparison to be valid.",
  },
];

function Spinner() { return <div className="spinner" />; }
function FeedbackBox({ result }) {
  if (!result) return null;
  return <div className={`feedback-box ${result.grade}`}><div className="feedback-label">{result.label}</div><div>{result.message}</div></div>;
}

function SectionPrediction({ onNext }) {
  const [text, setText] = useState(""); const [loading, setLoading] = useState(false); const [result, setResult] = useState(null);
  const submit = async () => {
    if (!text.trim() || loading) return; setLoading(true);
    const res = await assessWithClaude(PREDICTION_SYSTEM, text.trim());
    setResult(res); setLoading(false);
    storageSet(`engagement:module${moduleN}:prediction`, { grade: res.grade, timestamp: Date.now() });
  };
  return (
    <div>
      <div className="sec-eyebrow">Before You Read</div>
      <div className="sec-title">What do you predict?</div>
      <div className="sec-sub">Module 8 — Quantitative Testing</div>
      <div className="prose">In production, a skill might work perfectly in manual testing but fail under specific conditions. Before reading, write one sentence about why you think manual testing alone might be insufficient for production skill quality assurance.</div>
      <div className="recall-box">
        <div className="recall-label">Your Prediction</div>
        <textarea className="recall-input" placeholder="Write one sentence…" value={text} onChange={e => setText(e.target.value)} disabled={!!result} />
        {!result && <button className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`} style={{ marginTop: "12px" }} onClick={submit} disabled={!text.trim() || loading}>{loading ? "Assessing…" : "Submit Prediction"}</button>}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Getting feedback…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>Start Module 8 →</button>}
    </div>
  );
}

function SectionIntro({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Module 8 · Level 3 — Advanced</div>
      <div className="sec-title">Quantitative Testing</div>
      <div className="sec-sub">Why manual testing fails and how to build a production testing harness</div>
      <div className="prose">Manual testing — running a skill against a few examples and checking whether the output looks right — misses the most important failure class in production skill management: <strong>cross-skill regressions</strong> caused by changes you didn't know would affect anything.</div>
      <div className="prose">This module introduces quantitative testing: static test baskets, numeric scoring rubrics with objectively verifiable criteria, and version comparison protocols that catch regressions before deployment.</div>
      <div className="callout callout-insight">
        <div className="callout-title">What You'll Learn</div>
        <p>Why transformer sensitivity makes manual testing insufficient · The three testing harness components · How to design objectively verifiable scoring rubrics · The version comparison protocol and its deployment gate</p>
      </div>
      <ul className="content-list">
        <li><strong>Estimated time:</strong> 50 minutes (2 Pomodoro sessions)</li>
        <li><strong>Prerequisites:</strong> Module 7 (Governance Tiers)</li>
      </ul>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Begin →</button>
    </div>
  );
}

function SectionSensitivity({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 8.1</div>
      <div className="sec-title">The Transformer Sensitivity Problem</div>
      <div className="prose">Consider this scenario: a developer changes a single adjective in a Tier 1 formatting skill — from <em>concise</em> to <em>brief</em> — to fix a minor layout issue. A week later, a completely unrelated data-parsing skill starts producing malformed output. How is this possible?</div>
      <div className="callout callout-warning">
        <div className="callout-title">Transformers Process Context as a Semantic Field</div>
        <p>Transformers process your <em>entire skills context</em> as a unified semantic field. A change in one part of the context shifts probability distributions across all downstream token generation. Small, seemingly isolated vocabulary changes can produce unpredictable cascading effects on skills that share context — even if those skills are never directly modified.</p>
      </div>
      <div className="prose"><strong>Manual testing catches only the skill you changed.</strong> You run the formatting skill against your examples, it looks fine, you deploy. But the probability shifts from "concise" → "brief" have subtly changed how the model interprets adjacent skills' instructions. The data-parsing skill starts behaving slightly differently — not always, which makes it even harder to diagnose.</div>
      <div className="callout callout-insight">
        <div className="callout-title">What Quantitative Testing Catches</div>
        <p>A quantitative test harness runs the <em>entire static test basket</em> — including test cases for adjacent skills — against both the current and proposed versions. Cross-skill regressions surface as score deltas on test cases you didn't expect to change.</p>
      </div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: The Testing Harness →</button>
    </div>
  );
}

function SectionHarness({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 8.2</div>
      <div className="sec-title">The Testing Harness</div>
      <div className="sec-sub">Three components that replace manual inspection</div>

      <div className="callout callout-insight">
        <div className="callout-title">Component 1 — Static Test Cases</div>
        <p>A fixed, unchanging set of inputs paired with their expected outputs. <strong>This set never changes between version comparisons</strong> — new test cases can be added, but existing ones cannot be modified. If you change the test cases, you lose the baseline.</p>
      </div>
      <div className="prose">Each test case represents a distinct category:</div>
      <ul className="content-list">
        <li><strong>Happy path:</strong> well-formed input that should produce clean output</li>
        <li><strong>Edge case:</strong> input at a documented constraint boundary (max word count, ambiguous ownership, missing date)</li>
        <li><strong>Failure path:</strong> input that should trigger a specific STATUS_CODE</li>
        <li><strong>Regression (adjacent):</strong> test cases for other skills sharing the same context — catches cross-skill effects</li>
      </ul>

      <div className="callout callout-insight">
        <div className="callout-title">Component 2 — Numeric Scoring Rubric (1–5 Scale)</div>
        <p>A rubric assigns each test case output a score from 1 to 5. <strong>Critical design rule: every criterion must be objectively verifiable by a parser — never subjective.</strong></p>
      </div>

      <div className="callout callout-insight">
        <div className="callout-title">Component 3 — Version Comparison Protocol</div>
        <p>Run the full static test basket against v1. Record scores. Make the change to create v2. Run again. Compare score deltas across all test cases. <strong>Deploy only if:</strong> no single test case drops by more than 1 point, and no cross-skill regression exceeds 2 points.</p>
      </div>

      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: The Scoring Rubric →</button>
    </div>
  );
}

function SectionRubric({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 8.3</div>
      <div className="sec-title">The Scoring Rubric</div>
      <div className="prose">The rubric is the most critically designed component of the harness. A poorly designed rubric introduces evaluator bias and makes version comparisons meaningless. Every criterion must be executable by a parser without human judgment.</div>
      <table className="rubric-table">
        <thead>
          <tr><th>Score</th><th>Structural Criterion</th><th>Verification Method</th></tr>
        </thead>
        <tbody>
          <tr className="score-5"><td>5</td><td>Output matches schema exactly. All fields present. Correct sort order. No extra text.</td><td>Schema validator passes. Zero parsing errors. Row count matches expected.</td></tr>
          <tr className="score-4"><td>4</td><td>Output matches schema. One minor deviation (whitespace, trailing newline).</td><td>Schema validator passes after normalization (strip/trim).</td></tr>
          <tr className="score-3"><td>3</td><td>Output has correct content but structural deviation (3 of 4 fields, or wrong delimiter).</td><td>Manual field extraction possible but automation requires additional handling.</td></tr>
          <tr className="score-2"><td>2</td><td>Output contains correct information in incorrect format. Schema unrecoverable by parser.</td><td>Human can read it. Automated pipeline cannot parse it.</td></tr>
          <tr className="score-1"><td>1</td><td>Output is a prose explanation, apology, or hallucinated content.</td><td>No structured data present. Pipeline cannot continue.</td></tr>
        </tbody>
      </table>
      <div className="callout callout-warning">
        <div className="callout-title">The Subjective Criterion Failure Mode</div>
        <p>"Score 5 if the output looks well-structured and professional" — this criterion cannot be executed by a parser. Two evaluators will score it differently. The same evaluator will score it differently on different days. Subjective criteria make version comparisons unreliable. Remove them.</p>
      </div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Version Comparison Protocol →</button>
    </div>
  );
}

function SectionProtocol({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 8.4</div>
      <div className="sec-title">Version Comparison Protocol</div>
      <div className="prose">The version comparison protocol is the systematic procedure for validating a proposed change before deployment. Run it every time you change any skill — not just the one you edited.</div>
      <div className="code-block">
        <pre>{`Version Comparison Protocol (5 steps)

1. Run full static test basket against current (v1) skill.
   Record all scores for all test cases.

2. Make the proposed change → create v2.

3. Run full static test basket against v2.
   Record all scores.

4. Compare score deltas:
   — Include ALL test cases, not just the skill you changed
   — Flag any test case where v2 score ≠ v1 score
   — Pay special attention to adjacent-skill test cases

5. Deployment gate:
   ✓ Deploy if: no single test case dropped by more than 1 point
               AND no cross-skill regression exceeded 2 points
   ✗ Block if: any test case dropped by ≥ 2 points
               OR any cross-skill regression > 2 points`}</pre>
      </div>
      <div className="prose">Example test matrix for the meeting-action-extractor skill:</div>
      <div className="code-block">
        <pre>{`TC-001  Happy Path      500-word transcript, 3 clear items  v1:5 / v2:5  Pass
TC-002  Edge/Ambiguous  Two names near same verb             v1:5 / v2:4  Pass (−1)
TC-003  Edge/No Date    Items with no time references        v1:4 / v2:5  Pass (+1)
TC-004  Failure Path    Recipe text, not a meeting           v1:5 / v2:5  Pass
TC-005  Edge/Truncate   6,000-word transcript                v1:5 / v2:4  Pass (−1)
TC-006  Regression      Adjacent Tier 1 brand voice skill    v1:5 / v2:5  Pass`}</pre>
      </div>
      <div className="callout callout-tip">
        <div className="callout-title">When the Gate Fails</div>
        <p>If the deployment gate fails, investigate the regression before retrying. A drop from 5 to 2 on a single test case is a signal that the change had a large unintended effect — not a reason to adjust the threshold. The gate exists to protect you from exactly this failure mode.</p>
      </div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Recall Check →</button>
    </div>
  );
}

function SectionRecall({ onNext, onScore }) {
  const [answers, setAnswers] = useState({ r1: "", r2: "", r3: "" });
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [allDone, setAllDone] = useState(false);
  const submit = async (id) => {
    const q = RECALL_QUESTIONS.find(q => q.id === id);
    if (!answers[id].trim() || loading[id]) return;
    setLoading(p => ({ ...p, [id]: true }));
    const res = await assessWithClaude(RECALL_SYSTEM + `\n\nRubric: ${q.rubric}`, `Question: ${q.prompt}\n\nAnswer: ${answers[id].trim()}`);
    setResults(prev => { const n = { ...prev, [id]: res }; if (Object.keys(n).length === RECALL_QUESTIONS.length) setAllDone(true); return n; });
    setLoading(p => ({ ...p, [id]: false }));
    onScore(id, res.grade);
    storageSet(`engagement:module${moduleN}:recall:${id}`, { grade: res.grade, timestamp: Date.now() });
  };
  return (
    <div>
      <div className="sec-eyebrow">Recall Check</div>
      <div className="sec-title">Retrieve Before You Advance</div>
      <div className="prose">Cover your notes and answer from memory.</div>
      {RECALL_QUESTIONS.map(q => (
        <div key={q.id} className="recall-box">
          <div className="recall-label">Question {q.id.toUpperCase()}</div>
          <div className="recall-prompt">{q.prompt}</div>
          <textarea className="recall-input" value={answers[q.id]} onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))} disabled={!!results[q.id]} placeholder="Write your answer here…" />
          {!results[q.id] && <button className={`btn btn-primary ${(!answers[q.id].trim() || loading[q.id]) ? "btn-disabled" : ""}`} style={{ marginTop: "10px" }} onClick={() => submit(q.id)} disabled={!answers[q.id].trim() || loading[q.id]}>{loading[q.id] ? "Assessing…" : "Submit"}</button>}
          {loading[q.id] && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Assessing…</span></div>}
          <FeedbackBox result={results[q.id]} />
        </div>
      ))}
      {allDone && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>Next: Mini-Quiz →</button>}
    </div>
  );
}

function QuizQuestion({ q, onResult }) {
  const [shuffled] = useState(() => ({ ...q, options: shuffleOptions(q.options) }));
  const [selected, setSelected] = useState(null); const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState(null); const [loading, setLoading] = useState(false);
  const handleSelect = async (idx) => {
    if (locked) return; setSelected(idx); setLocked(true);
    const correct = shuffled.options[idx].correct; setLoading(true);
    const sys = QUIZ_SYSTEM.replace("{{CORRECT_OR_NOT}}", correct ? "correct" : "incorrect");
    const res = await assessWithClaude(sys, `Q: ${q.text}\nCorrect: ${q.options.find(o => o.correct).text}\nSelected: ${shuffled.options[idx].text}\nHint: ${q.explanation}`);
    setFeedback(res.message || q.explanation); setLoading(false);
    onResult(correct); storageSet(`engagement:module${moduleN}:quiz:${q.id}`, { correct, timestamp: Date.now() });
  };
  const optClass = (idx) => {
    let base = "quiz-option"; if (locked) base += " locked";
    if (idx === selected && shuffled.options[idx]?.correct) base += " correct";
    else if (idx === selected && !shuffled.options[idx]?.correct) base += " wrong";
    else if (locked && shuffled.options[idx]?.correct) base += " correct";
    return base;
  };
  return (
    <div className="quiz-box">
      <div className="quiz-label">Question</div><div className="quiz-q">{q.text}</div>
      <div className="quiz-options">
        {shuffled.options.map((opt, idx) => (
          <div key={idx} className={optClass(idx)} onClick={() => handleSelect(idx)}>
            <div className="option-letter">{String.fromCharCode(65 + idx)}</div>
            <div className="option-text">{opt.text}</div>
          </div>
        ))}
      </div>
      {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Getting explanation…</span></div>}
      {!loading && feedback && <div className={`feedback-box ${shuffled.options[selected]?.correct ? "correct" : "partial"}`}><div className="feedback-label">Explanation</div><div>{feedback}</div></div>}
    </div>
  );
}

function SectionQuiz({ onNext, onScore }) {
  const [scores, setScores] = useState([]);
  return (
    <div>
      <div className="sec-eyebrow">Mini-Quiz</div><div className="sec-title">Test Your Understanding</div>
      <div className="prose">Select the best answer. Click once to lock in.</div>
      {QUIZ_QUESTIONS.map(q => <QuizQuestion key={q.id} q={q} onResult={(c) => { setScores(p => [...p, c]); onScore(q.id, c); }} />)}
      {scores.length === QUIZ_QUESTIONS.length && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>Next: Written Summary →</button>}
    </div>
  );
}

function SectionSummary({ onNext }) {
  const [text, setText] = useState(""); const [loading, setLoading] = useState(false); const [result, setResult] = useState(null);
  const submit = async () => {
    if (!text.trim() || loading) return; setLoading(true);
    const res = await assessWithClaude(SUMMARY_SYSTEM, text.trim());
    setResult(res); setLoading(false);
    storageSet(`engagement:module${moduleN}:summary`, { grade: res.grade, timestamp: Date.now() });
  };
  return (
    <div>
      <div className="sec-eyebrow">Written Summary</div><div className="sec-title">Synthesize Before You Move On</div>
      <div className="prose">In 3–5 sentences: explain why manual testing fails, describe the three testing harness components, and explain what makes a scoring rubric criterion objectively verifiable.</div>
      <div className="recall-box">
        <div className="recall-label">Your Summary</div>
        <textarea className="recall-input" style={{ minHeight: "120px" }} placeholder="Write 3–5 sentences from memory…" value={text} onChange={e => setText(e.target.value)} disabled={!!result} />
        {!result && <button className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`} style={{ marginTop: "12px" }} onClick={submit} disabled={!text.trim() || loading}>{loading ? "Assessing…" : "Submit Summary"}</button>}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Assessing…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>See Your Score →</button>}
    </div>
  );
}

function SectionComplete({ recallScores, quizScores }) {
  const rp = Object.values(recallScores).reduce((t, g) => t + (g === "correct" ? 2 : g === "partial" ? 1 : 0), 0);
  const qp = Object.values(quizScores).reduce((t, c) => t + (c ? 2 : 0), 0);
  const max = RECALL_QUESTIONS.length * 2 + QUIZ_QUESTIONS.length * 2;
  const pct = max > 0 ? Math.round(((rp + qp) / max) * 100) : 0;
  const sc = pct >= 80 ? G.green : pct >= 55 ? G.amber : G.red;
  const rec = pct >= 80 ? "Excellent. One module remaining — advance to Module 9: Enterprise Deployment."
    : pct >= 55 ? "Review the scoring rubric design rules and version comparison protocol before the final module."
    : "Re-read Module 8 with focus on the transformer sensitivity problem and harness component design.";
  useEffect(() => { storageSet(`engagement:module${moduleN}:sessions`, [{ completed: true, score: pct, startTime: Date.now() }]); }, []);
  return (
    <div style={{ textAlign: "center", paddingTop: "32px" }}>
      <div className="sec-eyebrow" style={{ textAlign: "center" }}>Module Complete</div>
      <div className="sec-title" style={{ textAlign: "center", marginBottom: "4px" }}>Module 8 Finished</div>
      <div className="sec-sub" style={{ textAlign: "center", marginBottom: "32px" }}>Quantitative Testing</div>
      <div className="score-circle" style={{ borderColor: sc }}><div className="score-n" style={{ color: sc }}>{pct}%</div><div style={{ fontSize: "11px", color: G.textD }}>score</div></div>
      <div className="score-label">{rp + qp} / {max} points</div>
      <div className="callout callout-insight" style={{ textAlign: "left", maxWidth: "480px", margin: "0 auto 28px" }}><div className="callout-title">Recommendation</div><p>{rec}</p></div>
      <div className="score-grid" style={{ maxWidth: "420px", margin: "0 auto" }}>
        <div className="score-item"><div className="score-item-n">{rp}</div><div className="score-item-l">Recall points</div></div>
        <div className="score-item"><div className="score-item-n">{qp}</div><div className="score-item-l">Quiz points</div></div>
        <div className="score-item"><div className="score-item-n" style={{ color: sc }}>{pct}%</div><div className="score-item-l">Final score</div></div>
      </div>
    </div>
  );
}

export default function App() {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [recallScores, setRecallScores] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timerSecs, setTimerSecs] = useState(25 * 60);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const mainRef = useRef(null);
  const goTo = (idx) => { setSectionIdx(idx); if (mainRef.current) mainRef.current.scrollTop = 0; };
  useEffect(() => {
    if (timerExpired) return;
    const id = setInterval(() => setTimerSecs(s => { if (s <= 1) { clearInterval(id); setTimerExpired(true); setShowBreak(true); return 0; } return s - 1; }), 1000);
    return () => clearInterval(id);
  }, [timerExpired]);
  const timerMins = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const timerSec2 = String(timerSecs % 60).padStart(2, "0");
  const timerClass = timerExpired ? "timer-expired" : timerSecs < 300 ? "timer-warning" : "";
  const next = () => { setCompleted(p => new Set([...p, SECTIONS[sectionIdx].id])); goTo(Math.min(sectionIdx + 1, SECTIONS.length - 1)); };
  const progress = Math.round((sectionIdx / (SECTIONS.length - 1)) * 100);
  const renderSection = () => {
    switch (SECTIONS[sectionIdx].id) {
      case "prediction":  return <SectionPrediction onNext={next} />;
      case "intro":       return <SectionIntro onNext={next} />;
      case "sensitivity": return <SectionSensitivity onNext={next} />;
      case "harness":     return <SectionHarness onNext={next} />;
      case "rubric":      return <SectionRubric onNext={next} />;
      case "protocol":    return <SectionProtocol onNext={next} />;
      case "recall":      return <SectionRecall onNext={next} onScore={(id, g) => setRecallScores(p => ({ ...p, [id]: g }))} />;
      case "quiz":        return <SectionQuiz onNext={next} onScore={(id, c) => setQuizScores(p => ({ ...p, [id]: c }))} />;
      case "summary":     return <SectionSummary onNext={next} />;
      case "complete":    return <SectionComplete recallScores={recallScores} quizScores={quizScores} />;
      default:            return null;
    }
  };
  return (
    <>
      <style>{css}</style>
      <div className="lesson-shell" style={{ gridTemplateColumns: sidebarOpen ? "260px 1fr" : "44px 1fr" }}>
        <header className="lesson-header">
          <div className="header-badge">Level 3</div>
          <div className="header-title">Module 8 — Quantitative Testing</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
            <div className="progress-label">{progress}%</div>
          </div>
          <div className={`timer-display ${timerClass}`}>{timerMins}:{timerSec2}</div>
        </header>
        <nav className={`lesson-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-toggle-row">
            {sidebarOpen && <span className="sidebar-section-label">Contents</span>}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>{sidebarOpen ? "←" : "→"}</button>
          </div>
          {SECTIONS.map((sec, idx) => (
            <div key={sec.id} className={`sidebar-item ${idx === sectionIdx ? "active" : ""} ${completed.has(sec.id) ? "completed" : ""}`} onClick={() => goTo(idx)} title={!sidebarOpen ? sec.label : undefined}>
              <div className="si-dot" />{sidebarOpen && <div className="si-label">{sec.label}</div>}
            </div>
          ))}
        </nav>
        <main className="lesson-main" ref={mainRef}>
          <div className="lesson-main-inner">
            {showBreak && (
              <div className="break-banner">
                <span className="break-banner-icon">⏸</span>
                <span><strong>Pomodoro complete.</strong> Take a 5-minute break.
                  <button onClick={() => { setShowBreak(false); setTimerSecs(25 * 60); setTimerExpired(false); }} style={{ marginLeft: "12px", background: "none", border: `1px solid ${G.amber}60`, color: G.amber, borderRadius: "4px", padding: "2px 10px", cursor: "pointer", fontSize: "12px" }}>Start New Pomodoro</button>
                </span>
              </div>
            )}
            {renderSection()}
          </div>
        </main>
      </div>
    </>
  );
}
