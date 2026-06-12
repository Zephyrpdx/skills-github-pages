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
  ol.debug-list { padding: 0 0 0 20px; margin: 0 0 20px; }
  ol.debug-list li { padding: 8px 0 8px 8px; color: ${G.text}; font-size: 14px; line-height: 1.65; border-bottom: 1px solid ${G.border}; }
  ol.debug-list li:last-child { border-bottom: none; }
  ol.debug-list li strong { color: ${G.cream}; }
  ol.debug-list li em { color: ${G.textD}; font-style: normal; }
  .callout { border-radius: 6px; padding: 16px 20px; margin: 20px 0; border-left: 3px solid; }
  .callout-insight { background: ${G.navyL}; border-color: ${G.amber}; }
  .callout-warning { background: #2A1515; border-color: ${G.red}; }
  .callout-tip { background: #0F2A1D; border-color: ${G.green}; }
  .callout-title { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 6px; }
  .callout-insight .callout-title { color: ${G.amber}; }
  .callout-warning .callout-title { color: ${G.red}; }
  .callout-tip .callout-title { color: ${G.green}; }
  .callout p { font-size: 14px; line-height: 1.65; color: ${G.text}; }
  .failure-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
  .failure-table th { background: ${G.navyL}; color: ${G.amber}; font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; padding: 10px 14px; text-align: left; border: 1px solid ${G.border}; }
  .failure-table td { padding: 10px 14px; border: 1px solid ${G.border}; color: ${G.text}; vertical-align: top; line-height: 1.55; }
  .failure-table tr:nth-child(even) td { background: ${G.navyL}20; }
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
  .btn { padding: 10px 22px; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: background .15s, color .15s; }
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

async function assessWithClaude(systemPrompt, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages: [{ role: "user", content: userMessage }] }),
  });
  const data = await res.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch { return { grade: "partial", label: "Feedback", message: text }; }
}

const PREDICTION_SYSTEM = `You are a learning coach for the Agent-Readable Skills Infrastructure curriculum. The student is about to read Module 6: Debugging Failure Modes. Return ONLY a JSON object: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "2-3 sentences: note good intuition, hint at the lesson, encourage forward. Correct = identifies multiple failure types or diagnostic approaches. Partial = vaguely on topic. Incorrect = off-base." }`;

const RECALL_SYSTEM = `You are an expert instructor assessing a student's recall answer for Module 6: "Debugging Failure Modes." The module covers three failure types (Routing Failure, Output Drift, Pipeline Break), their symptoms and diagnostic targets, and a 7-step debugging checklist. Return ONLY a JSON object: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "2-4 sentences: affirm, correct gaps, reinforce key concept. Precise and direct." }`;

const QUIZ_SYSTEM = `You are an expert instructor explaining a quiz answer for Module 6: Debugging Failure Modes. Student answer was {{CORRECT_OR_NOT}}. Return ONLY a JSON object: { "message": "2-3 sentences: explain why correct answer is right and, if wrong, why their choice was incorrect. Specific to the failure-mode domain." }`;

const SUMMARY_SYSTEM = `You are assessing a student's summary of Module 6: "Debugging Failure Modes." A complete answer covers: (1) the three failure types and what distinguishes them; (2) at least 3 items from the 7-step debugging checklist; (3) what "output drift" means and its primary cause. Return ONLY a JSON object: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "3-4 sentences: affirm captured content, identify gaps, reinforce the key concept." }`;

function shuffleOptions(opts) { return [...opts].sort(() => Math.random() - 0.5); }

const moduleN = 6;

const SECTIONS = [
  { id: "prediction",  label: "Pre-Lesson Prediction",          type: "prediction" },
  { id: "intro",       label: "Introduction",                   type: "content"    },
  { id: "taxonomy",    label: "6.1 The Three Failure Types",    type: "content"    },
  { id: "routing",     label: "6.2 Diagnosing Routing Failures",type: "content"    },
  { id: "drift",       label: "6.3 Output Drift & Pipeline Break", type: "content" },
  { id: "checklist",   label: "6.4 The Debugging Checklist",    type: "content"    },
  { id: "recall",      label: "Recall Check",                   type: "recall"     },
  { id: "quiz",        label: "Mini-Quiz",                      type: "quiz"       },
  { id: "summary",     label: "Written Summary",                type: "summary"    },
  { id: "complete",    label: "Module Complete",                type: "complete"   },
];

const RECALL_QUESTIONS = [
  {
    id: "r1",
    prompt: "Name the three skill failure types from this module. For each one, describe its primary symptom in one sentence.",
    rubric: "Looking for: (1) Routing Failure — skill never invokes despite a matching user query; agent uses default behavior instead. (2) Output Drift — skill invokes correctly but output structure varies between runs; downstream parsing intermittently fails. (3) Pipeline Break — upstream skill succeeds; downstream skill receives input but fails silently or emits INVALID_INPUT. Any reasonable description of each symptom is correct.",
  },
  {
    id: "r2",
    prompt: "What is output drift? What is its primary cause, and how do you fix it?",
    rubric: "Output drift: when a skill invokes correctly but produces structurally variable output across runs. Primary cause: insufficiently deterministic output specification — prose-style output instructions instead of strict field/column/row-count specs. Fix: audit the Output Spec and remove any instruction that doesn't produce byte-identical structure every time. Replace prose descriptions with exact schema definitions. Ensure all failure paths emit STATUS_CODEs.",
  },
  {
    id: "r3",
    prompt: "List at least 4 of the 7 steps in the production debugging checklist. Why does the checklist start with the description (step 1) rather than the output spec?",
    rubric: "Any 4 of: (1) Is the description on exactly one line? (2) Do trigger phrases match the actual language the calling agent uses? (3) Is the Output Spec entirely deterministic? (4) Do all failure paths emit machine-parseable STATUS_CODEs? (5) Compare Alpha Output Contract field-by-field with Beta Input Contract. (6) Is the total file under 150 lines? (7) Does the Reasoning Framework contain procedural steps? Starting with the description: routing failure is the most common and simplest failure mode — if the skill never invokes, no other debugging is relevant.",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "A skill invokes correctly when tested manually, but in production the calling agent reports that 'the skill sometimes returns a table and sometimes returns a bullet list.' Which failure type is this?",
    options: [
      { text: "Routing Failure — the description is too vague for consistent invocation.", correct: false },
      { text: "Output Drift — the skill invokes but produces structurally variable output due to an insufficiently deterministic output specification.", correct: true },
      { text: "Pipeline Break — the upstream schema doesn't match the downstream Input Contract.", correct: false },
      { text: "Context Overrun — the skill exceeds 150 lines and the gateway truncates it.", correct: false },
    ],
    explanation: "Output Drift is defined as: skill invokes correctly but output structure varies between runs. The root cause is almost always a non-deterministic output specification — instructions like 'summarize the results clearly' instead of 'output exactly 5 rows with columns: Name | Tier | Gap'. Fix: audit the Output Contract and replace all prose instructions with exact structural specs.",
  },
  {
    id: "q2",
    text: "You open a skill file in a code editor that renders markdown. The routing description looks fine and fits on one line in the preview. You still have routing failures. What is the most likely root cause you haven't checked?",
    options: [
      { text: "The skill is too long and needs to be split into two files.", correct: false },
      { text: "The raw file has a multi-line description — the rendered view hides the line breaks that break the routing parser.", correct: true },
      { text: "The model used for routing is different from the model used for execution.", correct: false },
      { text: "The trigger phrases are too specific — try using shorter, broader phrases.", correct: false },
    ],
    explanation: "The debugging checklist specifically instructs: 'Open the raw file, not a rendered preview.' Markdown renderers collapse line breaks. A description that appears as one line in a preview may be two or three lines in the raw file. The LLM routing parser reads the raw file — and reads only the first line. Always check the raw file.",
  },
  {
    id: "q3",
    text: "Upstream Skill Alpha outputs pipe-delimited rows with 4 fields. Downstream Skill Beta emits STATUS: INVALID_INPUT_FORMAT on every run. The most focused debugging step is:",
    options: [
      { text: "Check whether Skill Alpha's description is on one line.", correct: false },
      { text: "Compare Skill Alpha's Output Contract field-by-field against Skill Beta's Input Contract, including field names, delimiter, and encoding.", correct: true },
      { text: "Increase max_tokens for Skill Beta to process longer inputs.", correct: false },
      { text: "Check whether Skill Alpha's Reasoning Framework is declarative instead of procedural.", correct: false },
    ],
    explanation: "This is a Pipeline Break — upstream succeeds, downstream fails. The debugging checklist step for this case is: 'Compare Alpha Output Contract field-by-field with Beta Input Contract — field names, delimiter, and encoding must match exactly.' INVALID_INPUT_FORMAT means Beta's parser cannot recognize the schema it received — a schema mismatch is the most likely cause.",
  },
  {
    id: "q4",
    text: "A skill's Reasoning Framework reads: 'Step 1: Read the input. Step 2: Find all names. Step 3: Match names to action verbs. Step 4: Extract due dates.' Why is this a design flaw according to the debugging checklist?",
    options: [
      { text: "It has too many steps — the framework should be limited to 3 instructions.", correct: false },
      { text: "Procedural step-by-step instructions fail at unanticipated edges — when the model hits an undocumented situation between steps, there's no guidance for generalization.", correct: true },
      { text: "The steps are too vague — each step needs a specific output format requirement.", correct: false },
      { text: "The framework should be in the frontmatter, not the body.", correct: false },
    ],
    explanation: "The 7th step in the debugging checklist: 'Does the Reasoning Framework contain step-by-step procedural instructions? Replace with declarative policies.' Procedural frameworks are brittle because they fail at unanticipated edges — if the model hits a situation between steps 2 and 3, there's no encoded guidance. Declarative frameworks give the model decision principles it can apply to any situation.",
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
      <div className="sec-sub">Module 6 — Debugging Failure Modes</div>
      <div className="prose">When a skill stops working in production, where do you start? Before reading, write one sentence about what you'd check first and why.</div>
      <div className="recall-box">
        <div className="recall-label">Your Prediction</div>
        <textarea className="recall-input" placeholder="Write one sentence…" value={text} onChange={e => setText(e.target.value)} disabled={!!result} />
        {!result && <button className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`} style={{ marginTop: "12px" }} onClick={submit} disabled={!text.trim() || loading}>{loading ? "Assessing…" : "Submit Prediction"}</button>}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Getting feedback…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>Start Module 6 →</button>}
    </div>
  );
}

function SectionIntro({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Module 6 · Level 2 — Intermediate</div>
      <div className="sec-title">Debugging Failure Modes</div>
      <div className="sec-sub">A systematic approach to diagnosing and fixing skills in production</div>
      <div className="prose">Skills fail in recognizable patterns. Once you know the three failure types and their symptoms, diagnosis becomes a structured process rather than guesswork.</div>
      <div className="prose">This module teaches you to identify failures by their observable symptoms — <strong>Routing Failure</strong>, <strong>Output Drift</strong>, and <strong>Pipeline Break</strong> — and work through a 7-step checklist that resolves the vast majority of production issues.</div>
      <div className="callout callout-insight">
        <div className="callout-title">What You'll Learn</div>
        <p>The three failure types and how to distinguish them by symptom · The 7-step production debugging checklist · Why the raw file view is essential · How to diagnose routing vs. drift vs. pipeline issues</p>
      </div>
      <ul className="content-list">
        <li><strong>Estimated time:</strong> 30 minutes (1 Pomodoro session)</li>
        <li><strong>Prerequisites:</strong> Modules 4 & 5 (Agentic Contracts + Composability)</li>
      </ul>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Begin →</button>
    </div>
  );
}

function SectionTaxonomy({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 6.1</div>
      <div className="sec-title">The Three Failure Types</div>
      <div className="prose">Every skill failure you'll encounter in production falls into one of three categories. Identifying the type from observable symptoms tells you where to focus your diagnosis.</div>
      <table className="failure-table">
        <thead>
          <tr>
            <th>Failure Type</th>
            <th>Observable Symptom</th>
            <th>Diagnostic Target</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style={{ color: G.red }}>Routing Failure</strong></td>
            <td>Skill never invokes despite a matching user query. Agent uses default behavior.</td>
            <td>Check: description is single-line. Trigger phrases match actual user language. Description is specific, not vague.</td>
          </tr>
          <tr>
            <td><strong style={{ color: G.amber }}>Output Drift</strong></td>
            <td>Skill invokes correctly but output structure varies between runs. Downstream parsing intermittently fails.</td>
            <td>Check: Output Spec is deterministic. No prose-style output instructions. Failure states emit STATUS_CODEs.</td>
          </tr>
          <tr>
            <td><strong style={{ color: G.red }}>Pipeline Break</strong></td>
            <td>Upstream skill succeeds. Downstream skill receives input but fails silently or emits INVALID_INPUT.</td>
            <td>Check: Alpha output schema maps exactly to Beta input schema. Field names, delimiter, and encoding match.</td>
          </tr>
        </tbody>
      </table>
      <div className="callout callout-tip">
        <div className="callout-title">Failure Type as a Diagnostic Filter</div>
        <p>Before opening any file, determine the failure type from its symptom. If the skill never invokes, you have a routing problem — checking the output spec wastes time. If the skill invokes but produces variable output, you have a drift problem — checking trigger phrases wastes time.</p>
      </div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Diagnosing Routing Failures →</button>
    </div>
  );
}

function SectionRouting({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 6.2</div>
      <div className="sec-title">Diagnosing Routing Failures</div>
      <div className="prose">Routing failures are the most common and often the simplest to fix. There are three root causes, in order of frequency:</div>
      <div className="callout callout-warning">
        <div className="callout-title">Root Cause 1 — Multi-Line Description</div>
        <p>The most frequent cause. An auto-formatter or text editor wrapped the routing description across multiple lines. The routing parser reads only the first line. <strong>Always check the raw file, not a rendered preview.</strong></p>
      </div>
      <div className="callout callout-warning">
        <div className="callout-title">Root Cause 2 — Trigger Phrase Mismatch</div>
        <p>The description says "Triggers on 'analyze competitors'" but the calling agent says "give me a competitor breakdown." Trigger phrases must match the actual language the calling system uses. Check both the skill description and the calling agent's prompt.</p>
      </div>
      <div className="callout callout-warning">
        <div className="callout-title">Root Cause 3 — Vague Description</div>
        <p>The description is generic: "Assists with business analysis tasks." No gateway can reliably route on this. Concrete trigger phrases and output shape are required for reliable invocation.</p>
      </div>
      <div className="prose">When you have a routing failure, work through these three checks in order. Most routing failures are resolved by checking the raw file for line breaks.</div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Output Drift & Pipeline Break →</button>
    </div>
  );
}

function SectionDrift({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 6.3</div>
      <div className="sec-title">Output Drift & Pipeline Break</div>
      <div className="prose"><strong>Output Drift</strong> occurs when a skill invokes correctly but produces structurally variable output across runs. The downstream pipeline fails intermittently — not always, which makes it harder to reproduce.</div>
      <div className="prose">The root cause is almost always a non-deterministic output specification. If the Output Spec says "write a clear summary" or "provide a helpful table," the model interprets these differently on different runs. The fix: replace all prose output instructions with exact structural specifications.</div>
      <div className="code-block">
        <pre>{`/* Causes drift — prose instruction */
## Output Format
Write a clear, well-organized summary of the action items.

/* Prevents drift — exact structural spec */
## Output Format
pipe-delimited rows: owner│action│due_date_iso│urgency_score
Exactly one row per action item. No preamble. No summary paragraph.
Failure: STATUS: NO_ITEMS_FOUND (single line, no other output)`}</pre>
      </div>
      <div className="prose" style={{ marginTop: "16px" }}><strong>Pipeline Break</strong> is diagnosed differently: the upstream skill succeeds (you can verify its output), but the downstream skill either fails silently or emits STATUS: INVALID_INPUT_FORMAT.</div>
      <div className="prose">The single most effective diagnostic step for pipeline breaks: compare the upstream Output Contract's field list against the downstream Input Contract's field list, character by character. Common mismatches: field name spelling (due_date vs dueDate), delimiter (pipe vs comma vs tab), field count (missing placeholder field), encoding (UTF-8 vs UTF-16).</div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: The Debugging Checklist →</button>
    </div>
  );
}

function SectionChecklist({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 6.4</div>
      <div className="sec-title">The 7-Step Debugging Checklist</div>
      <div className="prose">Work through this checklist in order when a skill fails in production. Most failures are resolved by steps 1–4. Steps 5–7 handle pipeline and design-level issues.</div>
      <ol className="debug-list">
        <li><strong>Is the description on exactly one line?</strong> <em>Open the raw file, not a rendered preview. Even a single hidden newline breaks routing.</em></li>
        <li><strong>Do the trigger phrases match the actual language the calling agent uses?</strong> <em>Check both the skill description and the calling system's query. Mismatches are the #2 routing failure cause.</em></li>
        <li><strong>Is the Output Spec entirely deterministic?</strong> <em>Remove any prose-style output instructions. Replace with exact field names, delimiters, row counts, and encoding specs.</em></li>
        <li><strong>Do all failure paths emit machine-parseable STATUS_CODEs?</strong> <em>Every edge case that can't produce a success output must emit a STATUS_CODE — not natural language.</em></li>
        <li><strong>If a pipeline skill: compare Alpha Output Contract field-by-field with Beta Input Contract.</strong> <em>Field names, delimiter, encoding, and field count must match exactly. This is the primary pipeline break diagnostic.</em></li>
        <li><strong>Is the total file under 150 lines?</strong> <em>If not, split the skill. Overlong skills degrade in production gateways that inject surrounding context.</em></li>
        <li><strong>Does the Reasoning Framework contain step-by-step procedural instructions?</strong> <em>Replace procedural steps with declarative decision policies that generalize to unanticipated situations.</em></li>
      </ol>
      <div className="callout callout-tip">
        <div className="callout-title">The 80% Rule</div>
        <p>In practice, steps 1–4 resolve approximately 80% of production skill failures. If you've worked through all 7 steps and the skill still fails, the issue is likely model-level (a recent provider update changed behavior) — which is addressed in Module 8: Quantitative Testing.</p>
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
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
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
    else if (idx === selected) base += " selected";
    return base;
  };
  return (
    <div className="quiz-box">
      <div className="quiz-label">Question</div>
      <div className="quiz-q">{q.text}</div>
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
      <div className="sec-eyebrow">Mini-Quiz</div>
      <div className="sec-title">Test Your Understanding</div>
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
      <div className="sec-eyebrow">Written Summary</div>
      <div className="sec-title">Synthesize Before You Move On</div>
      <div className="prose">In 3–5 sentences, describe the three skill failure types, their symptoms, and at least 3 steps from the debugging checklist.</div>
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
  const rec = pct >= 80 ? "Excellent. You've completed Level 2 — advance to Module 7: Governance Tiers."
    : pct >= 55 ? "Review the 7-step debugging checklist and output drift section before advancing to Level 3."
    : "Re-read Module 6, focusing on failure taxonomy and how to distinguish routing vs. drift vs. pipeline failures.";
  useEffect(() => { storageSet(`engagement:module${moduleN}:sessions`, [{ completed: true, score: pct, startTime: Date.now() }]); }, []);
  return (
    <div style={{ textAlign: "center", paddingTop: "32px" }}>
      <div className="sec-eyebrow" style={{ textAlign: "center" }}>Module Complete</div>
      <div className="sec-title" style={{ textAlign: "center", marginBottom: "4px" }}>Module 6 Finished</div>
      <div className="sec-sub" style={{ textAlign: "center", marginBottom: "32px" }}>Debugging Failure Modes</div>
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
      case "prediction": return <SectionPrediction onNext={next} />;
      case "intro":      return <SectionIntro onNext={next} />;
      case "taxonomy":   return <SectionTaxonomy onNext={next} />;
      case "routing":    return <SectionRouting onNext={next} />;
      case "drift":      return <SectionDrift onNext={next} />;
      case "checklist":  return <SectionChecklist onNext={next} />;
      case "recall":     return <SectionRecall onNext={next} onScore={(id, g) => setRecallScores(p => ({ ...p, [id]: g }))} />;
      case "quiz":       return <SectionQuiz onNext={next} onScore={(id, c) => setQuizScores(p => ({ ...p, [id]: c }))} />;
      case "summary":    return <SectionSummary onNext={next} />;
      case "complete":   return <SectionComplete recallScores={recallScores} quizScores={quizScores} />;
      default:           return null;
    }
  };
  return (
    <>
      <style>{css}</style>
      <div className="lesson-shell" style={{ gridTemplateColumns: sidebarOpen ? "260px 1fr" : "44px 1fr" }}>
        <header className="lesson-header">
          <div className="header-badge">Level 2</div>
          <div className="header-title">Module 6 — Debugging Failure Modes</div>
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
