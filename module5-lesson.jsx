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
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid ${G.border}; border-radius: 8px; overflow: hidden; margin: 20px 0; }
  .compare-col { padding: 16px 18px; }
  .compare-col.bad { background: #1E1010; }
  .compare-col.good { background: #0F1E15; }
  .compare-header { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 10px; }
  .compare-col.bad .compare-header { color: ${G.red}; }
  .compare-col.good .compare-header { color: ${G.green}; }
  .compare-col p { font-size: 13px; line-height: 1.6; color: ${G.text}; }
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
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await res.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch { return { grade: "partial", label: "Feedback", message: text }; }
}

const PREDICTION_SYSTEM = `You are a learning coach for the Agent-Readable Skills Infrastructure curriculum.
The student is about to read Module 5: Composability & Pipelines. Prediction is an activation exercise — not a test.
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "2-3 sentences: note what shows good intuition, hint at what the lesson adds, encourage forward. Correct = understands multi-skill handoff requires output-to-input schema matching. Partial = vaguely related. Incorrect = off-base. Tone: warm, forward-looking."
}`;

const RECALL_SYSTEM = `You are an expert instructor assessing a student's recall answer for Module 5: "Composability & Pipelines" of the Agent-Readable Skills Infrastructure curriculum.
The module covers: composability (output natively serves as next skill's input), the output-first design rule, placeholder fields for schema consistency, the Deterministic Script Rule, and silent pipeline failures.
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "2-4 sentences: affirm what was right, correct or fill gaps, reinforce the key concept. Precise and direct."
}`;

const QUIZ_SYSTEM = `You are an expert instructor explaining a quiz answer for Module 5: Composability & Pipelines (Agent-Readable Skills Infrastructure curriculum).
The student selected an answer that was {{CORRECT_OR_NOT}}.
Return ONLY a JSON object:
{ "message": "2-3 sentences explaining why the correct answer is right and, if wrong, why their choice was incorrect. Specific, concrete examples from the pipeline domain." }`;

const SUMMARY_SYSTEM = `You are assessing a student's written summary of Module 5: "Composability & Pipelines" from the Agent-Readable Skills Infrastructure curriculum.
A complete correct answer covers: (1) composability definition (output natively serves as next input without human intervention); (2) the placeholder field strategy and why it prevents silent schema failures; (3) the Deterministic Script Rule (when NOT to use a skill).
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "3-4 sentences: affirm what was captured, identify what was missing or imprecise, reinforce the key concept."
}`;

function shuffleOptions(options) { return [...options].sort(() => Math.random() - 0.5); }

const moduleN = 5;

const SECTIONS = [
  { id: "prediction",    label: "Pre-Lesson Prediction",       type: "prediction" },
  { id: "intro",         label: "Introduction",                type: "content"    },
  { id: "composability", label: "5.1 What Is Composability?",  type: "content"    },
  { id: "handoff",       label: "5.2 Designing for Handoff",   type: "content"    },
  { id: "dataflow",      label: "5.3 The Data Flow Diagram",   type: "content"    },
  { id: "script-rule",   label: "5.4 The Script Rule",         type: "content"    },
  { id: "recall",        label: "Recall Check",                type: "recall"     },
  { id: "quiz",          label: "Mini-Quiz",                   type: "quiz"       },
  { id: "summary",       label: "Written Summary",             type: "summary"    },
  { id: "complete",      label: "Module Complete",             type: "complete"   },
];

const RECALL_QUESTIONS = [
  {
    id: "r1",
    prompt: "Define composability in one sentence. What is the specific condition that makes a pipeline \"composable\"?",
    rubric: "Key points: composability is the property of a skill pipeline where each skill's output natively serves as the next skill's input without human intervention, data transformation, or re-prompting. The critical condition: the output schema of skill N must exactly match the input contract of skill N+1 without any manual bridging step.",
  },
  {
    id: "r2",
    prompt: "What is the 'placeholder field' strategy? Give a concrete example and explain why leaving out the placeholder causes a silent failure.",
    rubric: "Placeholder field: when designing a multi-skill pipeline, upstream skill Alpha adds a field to its output that it cannot yet populate, initialized to a neutral value (e.g., urgency_score = 0), so that downstream skill Beta always receives a consistent schema. Without the placeholder: Alpha outputs 3-field rows when Beta expects 4-field rows. Beta's parser doesn't crash visibly — it silently misreads column positions or drops rows, producing wrong results that look correct.",
  },
  {
    id: "r3",
    prompt: "What is the Deterministic Script Rule? Give two examples of tasks that should be hardwired scripts instead of LLM skills.",
    rubric: "Deterministic Script Rule: any pipeline step requiring absolute, zero-variance execution must be implemented as a hardwired script (Python, Bash, etc.) rather than an LLM skill. Examples: (1) inserting a row into a database; (2) sending an email via SMTP; (3) converting a date string from one known format to another; (4) renaming files according to a fixed naming convention; (5) parsing a known CSV format with fixed columns. All of these require exact, deterministic execution that LLMs cannot guarantee.",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "Skill Alpha outputs: 'owner│action│due_date' (3 fields). Skill Beta's Input Contract expects: 'owner│action│due_date│urgency_score' (4 fields). The pipeline runs without crashing. What is the most likely outcome?",
    options: [
      { text: "Beta silently misreads column positions — urgency_score reads the next row's owner field as the score, producing plausible but wrong output.", correct: true },
      { text: "Beta correctly identifies that urgency_score is missing and emits STATUS: INVALID_INPUT_FORMAT.", correct: false },
      { text: "The pipeline halts and the orchestrator retries with the correct schema.", correct: false },
      { text: "Beta fills in urgency_score = 0 automatically using its default value logic.", correct: false },
    ],
    explanation: "Silent pipeline failures are the most dangerous composability failure mode. When the schema doesn't match, the pipeline continues — Beta's parser reads the 3rd field as urgency_score and has no 4th field, silently corrupting downstream logic. The fix is the placeholder: Alpha always outputs 4 fields, with urgency_score = 0 until Beta scores it.",
  },
  {
    id: "q2",
    text: "A workflow must insert validated records into a production database with zero tolerance for errors. Should this step be an LLM skill or a hardwired script?",
    options: [
      { text: "An LLM skill with a strict Output Contract specifying the exact INSERT format.", correct: false },
      { text: "A hardwired script, because database insertion requires absolute deterministic execution with no reasoning latitude.", correct: true },
      { text: "An LLM skill with STATUS_CODE failure states for each insertion error type.", correct: false },
      { text: "Either is acceptable — the Deterministic Output Spec makes any skill deterministic enough.", correct: false },
    ],
    explanation: "Database insertion, SMTP email sending, file renaming, and date format conversion are all absolute-determinism tasks. LLM inference introduces token-level probability that is incompatible with operations requiring byte-perfect execution. The Deterministic Script Rule exists precisely for these cases — use a Python/Bash script, not a skill.",
  },
  {
    id: "q3",
    text: "What is the correct design sequence when building a composable multi-skill pipeline?",
    options: [
      { text: "Design the Reasoning Frameworks first — output structure follows naturally from the logic.", correct: false },
      { text: "Design Output Contracts first, then work backwards to design the Reasoning Frameworks that produce them.", correct: true },
      { text: "Design Input Contracts first, then forward-engineer what output each skill can produce.", correct: false },
      { text: "Build each skill independently and connect them with transformation middleware.", correct: false },
    ],
    explanation: "Output-first design is the correct pipeline architecture approach. When you define what each skill must output before defining how it reasons, the handoff schema is established before any implementation begins. Forward-engineering from inputs leads to schema mismatches at the handoff point — the most expensive bug to diagnose in production pipelines.",
  },
  {
    id: "q4",
    text: "Why are silent composability failures described as more dangerous than crashes?",
    options: [
      { text: "Because crashes are more visible — engineers notice and fix them immediately; silent failures persist undetected.", correct: true },
      { text: "Because silent failures corrupt the model's weights permanently.", correct: false },
      { text: "Because composability failures always cause data loss in the upstream skill's output.", correct: false },
      { text: "Because crashes require a full pipeline restart, which is more expensive.", correct: false },
    ],
    explanation: "A crash is conspicuous — it produces an error message, stops execution, and demands attention. A silent failure produces plausible-looking output that passes downstream validation while containing systematically corrupted data. It may propagate through multiple systems before anyone detects it, and the root cause is obscured by layers of downstream processing.",
  },
];

function Spinner() { return <div className="spinner" />; }
function FeedbackBox({ result }) {
  if (!result) return null;
  return (
    <div className={`feedback-box ${result.grade}`}>
      <div className="feedback-label">{result.label}</div>
      <div>{result.message}</div>
    </div>
  );
}

function SectionPrediction({ onNext }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    const res = await assessWithClaude(PREDICTION_SYSTEM, text.trim());
    setResult(res);
    setLoading(false);
    storageSet(`engagement:module${moduleN}:prediction`, { grade: res.grade, timestamp: Date.now() });
  };
  return (
    <div>
      <div className="sec-eyebrow">Before You Read</div>
      <div className="sec-title">What do you predict?</div>
      <div className="sec-sub">Module 5 — Composability & Pipelines</div>
      <div className="prose">
        This module covers building skills that connect to each other — where one skill's output feeds the
        next skill's input. Before reading, write one sentence: what do you think needs to be true about
        a skill's output for another skill to use it without human intervention?
      </div>
      <div className="recall-box">
        <div className="recall-label">Your Prediction</div>
        <textarea className="recall-input" placeholder="Write one sentence…" value={text} onChange={e => setText(e.target.value)} disabled={!!result} />
        {!result && (
          <button className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`} style={{ marginTop: "12px" }} onClick={submit} disabled={!text.trim() || loading}>
            {loading ? "Assessing…" : "Submit Prediction"}
          </button>
        )}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Getting feedback…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>Start Module 5 →</button>}
    </div>
  );
}

function SectionIntro({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Module 5 · Level 2 — Intermediate</div>
      <div className="sec-title">Composability & Pipelines</div>
      <div className="sec-sub">Connecting skills into autonomous multi-step workflows</div>
      <div className="prose">
        A single skill is powerful. A <strong>pipeline of skills</strong> — where each skill's output
        automatically feeds the next — is transformative. But pipelines introduce a new class of failure:
        the <em>silent composability failure</em>, where the pipeline continues running with corrupted
        data and no error is ever raised.
      </div>
      <div className="prose">
        This module teaches you how to design skills that connect reliably: the output-first design rule,
        the placeholder field strategy, data flow documentation, and the Deterministic Script Rule —
        knowing when NOT to use a skill at all.
      </div>
      <div className="callout callout-insight">
        <div className="callout-title">What You'll Learn</div>
        <p>What composability means and why it fails silently · Output-first pipeline design ·
        Placeholder fields for schema consistency · Data flow diagrams · The Deterministic Script Rule</p>
      </div>
      <ul className="content-list">
        <li><strong>Estimated time:</strong> 40 minutes (1–2 Pomodoro sessions)</li>
        <li><strong>Prerequisites:</strong> Module 4 (Agentic Contracts)</li>
        <li><strong>Sections:</strong> 4 content sections + Recall + Quiz + Summary</li>
      </ul>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Begin →</button>
    </div>
  );
}

function SectionComposability({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 5.1</div>
      <div className="sec-title">What Is Composability?</div>
      <div className="prose">
        <strong>Composability</strong> is the property of a skill pipeline where each skill's output
        natively serves as the next skill's input <em>without human intervention, data transformation,
        or re-prompting</em>.
      </div>
      <div className="prose">
        This definition has a strict implication: every field in skill Alpha's output must appear in
        exactly the form that skill Beta's Input Contract expects. No adapter, no cleanup script, no
        manual review step. Native handoff.
      </div>
      <div className="callout callout-warning">
        <div className="callout-title">Silent Composability Failures</div>
        <p>
          Composability failures are among the most expensive failure modes in multi-agent systems
          because they are <strong>silent</strong>. The pipeline does not crash — it continues running
          with subtly corrupted data, producing plausible but wrong results. A crash is conspicuous.
          A silent failure can propagate through downstream systems for days before anyone detects it.
        </p>
      </div>
      <div className="prose">
        Consider a pipeline where Skill Alpha extracts action items from a meeting transcript and
        Skill Beta scores them by urgency. If Alpha's output schema is:{" "}
        <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>owner│action│due_date</code>{" "}
        but Beta's Input Contract expects:{" "}
        <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>owner│action│due_date│urgency_score</code>,
        Beta doesn't crash. It reads <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>due_date</code>{" "}
        as <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>urgency_score</code> and the next row's{" "}
        <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>owner</code> as{" "}
        <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>due_date</code>.
        Everything looks plausible. Nothing flags an error.
      </div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Designing for Handoff →</button>
    </div>
  );
}

function SectionHandoff({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 5.2</div>
      <div className="sec-title">Designing for Handoff</div>
      <div className="sec-sub">The output-first design rule and placeholder fields</div>
      <div className="callout callout-insight">
        <div className="callout-title">The Output-First Design Rule</div>
        <p>Design Output Contracts first, then work backwards to design the Reasoning Frameworks that produce them. When you define what each skill must output before defining how it reasons, the handoff schema is established before any implementation begins.</p>
      </div>
      <div className="prose">
        When building a two-skill pipeline, start by agreeing on the pipe-delimited schema that will
        travel between them. Only then design each skill's internals.
      </div>

      <div className="code-block">
        <pre>{`## Output Contract (Skill Alpha — Action Extractor)
pipe-delimited rows: owner│action│due_date_iso│urgency_score
urgency_score: integer 1–5 (5 = most urgent)
STATUS: NO_ITEMS_FOUND if transcript contains no action items

Note: Alpha outputs urgency_score = 0 for all rows.
      urgency_score = 0 means "unscored" — reserved for Beta.`}</pre>
      </div>

      <div className="callout callout-insight">
        <div className="callout-title">The Placeholder Field Strategy</div>
        <p>
          Skill Alpha adds an <strong>urgency_score</strong> field populated with <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>0</code> even though
          it cannot score urgency. This placeholder is critical: it ensures the schema is
          always 4 fields, whether or not prior scoring occurred. Without it, Beta receives
          3-field rows when it expects 4 — a silent parse failure.
        </p>
      </div>

      <div className="code-block">
        <pre>{`## Input Contract (Skill Beta — Urgency Scorer)
Required: action_rows (pipe-delimited string)
Format: owner│action│due_date_iso│urgency_score
Each row: urgency_score field must be present
  (0 = unscored, 1–5 = already scored, skip re-scoring)

## Output Contract (Skill Beta)
Same pipe-delimited format, urgency_score populated: 1–5
Sorted descending by urgency_score, then ascending by due_date_iso
STATUS: INVALID_INPUT_FORMAT if pipe structure does not match`}</pre>
      </div>

      <div className="compare-grid">
        <div className="compare-col bad">
          <div className="compare-header">Without Placeholder</div>
          <p>Alpha: <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>owner│action│due_date</code></p>
          <p style={{ marginTop: "8px" }}>Beta expects 4 fields. Gets 3. Reads due_date as urgency_score. Silent corruption.</p>
        </div>
        <div className="compare-col good">
          <div className="compare-header">With Placeholder</div>
          <p>Alpha: <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>owner│action│due_date│0</code></p>
          <p style={{ marginTop: "8px" }}>Beta gets 4 fields. Reads urgency_score = 0, knows this is unscored. Scores it. Clean handoff.</p>
        </div>
      </div>

      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Data Flow Diagram →</button>
    </div>
  );
}

function SectionDataflow({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 5.3</div>
      <div className="sec-title">The Data Flow Diagram</div>
      <div className="prose">
        Every multi-skill pipeline must be documented with a data flow diagram. This is not optional
        documentation — it is the specification that prevents schema drift as the pipeline evolves.
      </div>

      <div className="code-block">
        <pre>{`┌─────────────────────────────────────────────────────────┐
│  INPUT: Raw meeting transcript (plain text, UTF-8)      │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  SKILL ALPHA: meeting-action-extractor-v2               │
│  Input:  transcript_text (UTF-8, max 5,000 words)       │
│  Output: owner│action│due_date_iso│urgency_score(=0)    │
└──────────────────────────┬──────────────────────────────┘
                           │  pipe-delimited rows
                           ▼
┌─────────────────────────────────────────────────────────┐
│  SKILL BETA: urgency-scorer                             │
│  Input:  owner│action│due_date_iso│urgency_score        │
│  Output: same schema, urgency_score 1–5, sorted desc    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  FINAL OUTPUT: Prioritized action item list             │
└─────────────────────────────────────────────────────────┘`}</pre>
      </div>

      <div className="prose">
        The diagram forces you to make explicit decisions about encoding, field names, and failure
        routing <em>before</em> you build. Every arrow in the diagram is a schema contract.
        Every box is a skill with a documented Input Contract and Output Contract.
      </div>

      <div className="callout callout-tip">
        <div className="callout-title">What the Diagram Must Show</div>
        <p>Input source and format · Each skill with its input and output schema · The exact
        format passed between skills (encoding, delimiter, field names, field order) ·
        STATUS_CODE routing (what happens on each failure state) · Final output consumer</p>
      </div>

      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: The Script Rule →</button>
    </div>
  );
}

function SectionScriptRule({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 5.4</div>
      <div className="sec-title">The Deterministic Script Rule</div>
      <div className="sec-sub">Knowing when NOT to use a skill</div>
      <div className="prose">
        Not every pipeline step belongs in a skill. If a workflow step requires <strong>absolute,
        non-negotiable deterministic execution</strong> — implement it as a hardwired script
        (Python, Bash, SQL, etc.), not an LLM skill.
      </div>

      <div className="compare-grid">
        <div className="compare-col good">
          <div className="compare-header">Use a Skill When…</div>
          <p>Extracting structured data from unstructured text</p>
          <p style={{ marginTop: "8px" }}>Scoring or classifying items using judgment</p>
          <p style={{ marginTop: "8px" }}>Summarizing variable-length content</p>
          <p style={{ marginTop: "8px" }}>Generating narrative from structured data</p>
          <p style={{ marginTop: "8px" }}>Identifying entities in natural language</p>
        </div>
        <div className="compare-col bad">
          <div className="compare-header">Use a Script When…</div>
          <p>Parsing a known CSV with fixed columns</p>
          <p style={{ marginTop: "8px" }}>Converting a date between two known formats</p>
          <p style={{ marginTop: "8px" }}>Renaming files per a naming convention</p>
          <p style={{ marginTop: "8px" }}>Sending email via SMTP</p>
          <p style={{ marginTop: "8px" }}>Inserting a row into a database</p>
        </div>
      </div>

      <div className="prose" style={{ marginTop: "8px" }}>
        The distinguishing criterion: does this step require <em>reasoning</em> or just
        <em> execution</em>? LLMs are probabilistic. Every output carries a small probability
        of variance. For steps that must execute byte-perfectly every time, that variance is
        unacceptable. Use deterministic code.
      </div>

      <div className="callout callout-warning">
        <div className="callout-title">The Temptation to Skill Everything</div>
        <p>
          It's tempting to build every step as a skill — it feels consistent. Resist this.
          A skill that converts "June 15, 2025" to ISO 8601 will work 99.7% of the time.
          In a pipeline that runs 10,000 times, it will silently produce wrong dates roughly
          30 times. A two-line Python function has a 100% success rate.
        </p>
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
    setLoading(prev => ({ ...prev, [id]: true }));
    const sys = RECALL_SYSTEM + `\n\nRubric: ${q.rubric}`;
    const res = await assessWithClaude(sys, `Question: ${q.prompt}\n\nAnswer: ${answers[id].trim()}`);
    setResults(prev => {
      const next = { ...prev, [id]: res };
      if (Object.keys(next).length === RECALL_QUESTIONS.length) setAllDone(true);
      return next;
    });
    setLoading(prev => ({ ...prev, [id]: false }));
    onScore(id, res.grade);
    storageSet(`engagement:module${moduleN}:recall:${id}`, { grade: res.grade, timestamp: Date.now() });
  };

  return (
    <div>
      <div className="sec-eyebrow">Recall Check</div>
      <div className="sec-title">Retrieve Before You Advance</div>
      <div className="prose">Cover your notes and answer from memory. The struggle to retrieve is where the learning happens.</div>
      {RECALL_QUESTIONS.map(q => (
        <div key={q.id} className="recall-box">
          <div className="recall-label">Question {q.id.toUpperCase()}</div>
          <div className="recall-prompt">{q.prompt}</div>
          <textarea className="recall-input" value={answers[q.id]} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))} disabled={!!results[q.id]} placeholder="Write your answer here…" />
          {!results[q.id] && (
            <button className={`btn btn-primary ${(!answers[q.id].trim() || loading[q.id]) ? "btn-disabled" : ""}`} style={{ marginTop: "10px" }} onClick={() => submit(q.id)} disabled={!answers[q.id].trim() || loading[q.id]}>
              {loading[q.id] ? "Assessing…" : "Submit"}
            </button>
          )}
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
    if (locked) return;
    setSelected(idx);
    setLocked(true);
    const correct = shuffled.options[idx].correct;
    setLoading(true);
    const sys = QUIZ_SYSTEM.replace("{{CORRECT_OR_NOT}}", correct ? "correct" : "incorrect");
    const res = await assessWithClaude(sys, `Question: ${q.text}\nCorrect: ${q.options.find(o => o.correct).text}\nSelected: ${shuffled.options[idx].text}\nHint: ${q.explanation}`);
    setFeedback(res.message || q.explanation);
    setLoading(false);
    onResult(correct);
    storageSet(`engagement:module${moduleN}:quiz:${q.id}`, { correct, timestamp: Date.now() });
  };

  const optClass = (idx) => {
    let base = "quiz-option";
    if (locked) base += " locked";
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
      {!loading && feedback && (
        <div className={`feedback-box ${shuffled.options[selected]?.correct ? "correct" : "partial"}`}>
          <div className="feedback-label">Explanation</div>
          <div>{feedback}</div>
        </div>
      )}
    </div>
  );
}

function SectionQuiz({ onNext, onScore }) {
  const [scores, setScores] = useState([]);
  const allDone = scores.length === QUIZ_QUESTIONS.length;
  return (
    <div>
      <div className="sec-eyebrow">Mini-Quiz</div>
      <div className="sec-title">Test Your Understanding</div>
      <div className="prose">Select the best answer. Click once to lock in.</div>
      {QUIZ_QUESTIONS.map(q => (
        <QuizQuestion key={q.id} q={q} onResult={(correct) => { setScores(prev => [...prev, correct]); onScore(q.id, correct); }} />
      ))}
      {allDone && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>Next: Written Summary →</button>}
    </div>
  );
}

function SectionSummary({ onNext }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    const res = await assessWithClaude(SUMMARY_SYSTEM, text.trim());
    setResult(res);
    setLoading(false);
    storageSet(`engagement:module${moduleN}:summary`, { grade: res.grade, timestamp: Date.now() });
  };
  return (
    <div>
      <div className="sec-eyebrow">Written Summary</div>
      <div className="sec-title">Synthesize Before You Move On</div>
      <div className="prose">
        In 3–5 sentences, summarize what composability means, how the placeholder field strategy
        prevents silent failures, and when you should use a script instead of a skill.
      </div>
      <div className="recall-box">
        <div className="recall-label">Your Summary</div>
        <textarea className="recall-input" style={{ minHeight: "120px" }} placeholder="Write 3–5 sentences from memory…" value={text} onChange={e => setText(e.target.value)} disabled={!!result} />
        {!result && (
          <button className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`} style={{ marginTop: "12px" }} onClick={submit} disabled={!text.trim() || loading}>
            {loading ? "Assessing…" : "Submit Summary"}
          </button>
        )}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Assessing…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>See Your Score →</button>}
    </div>
  );
}

function SectionComplete({ recallScores, quizScores }) {
  const recallPoints = Object.values(recallScores).reduce((t, g) => t + (g === "correct" ? 2 : g === "partial" ? 1 : 0), 0);
  const quizPoints = Object.values(quizScores).reduce((t, c) => t + (c ? 2 : 0), 0);
  const maxPoints = RECALL_QUESTIONS.length * 2 + QUIZ_QUESTIONS.length * 2;
  const pct = maxPoints > 0 ? Math.round(((recallPoints + quizPoints) / maxPoints) * 100) : 0;
  const scoreColor = pct >= 80 ? G.green : pct >= 55 ? G.amber : G.red;
  const recommendation = pct >= 80
    ? "Strong performance. Advance to Module 6: Debugging Failure Modes."
    : pct >= 55
    ? "Solid foundation with gaps. Review the placeholder field strategy and Deterministic Script Rule before advancing."
    : "Consider re-reading Module 5. Focus on what makes a pipeline composable and the output-first design rule.";
  useEffect(() => {
    storageSet(`engagement:module${moduleN}:sessions`, [{ completed: true, score: pct, startTime: Date.now() }]);
  }, []);
  return (
    <div style={{ textAlign: "center", paddingTop: "32px" }}>
      <div className="sec-eyebrow" style={{ textAlign: "center" }}>Module Complete</div>
      <div className="sec-title" style={{ textAlign: "center", marginBottom: "4px" }}>Module 5 Finished</div>
      <div className="sec-sub" style={{ textAlign: "center", marginBottom: "32px" }}>Composability & Pipelines</div>
      <div className="score-circle" style={{ borderColor: scoreColor }}>
        <div className="score-n" style={{ color: scoreColor }}>{pct}%</div>
        <div style={{ fontSize: "11px", color: G.textD }}>score</div>
      </div>
      <div className="score-label">{recallPoints + quizPoints} / {maxPoints} points</div>
      <div className="callout callout-insight" style={{ textAlign: "left", maxWidth: "480px", margin: "0 auto 28px" }}>
        <div className="callout-title">Recommendation</div>
        <p>{recommendation}</p>
      </div>
      <div className="score-grid" style={{ maxWidth: "420px", margin: "0 auto" }}>
        <div className="score-item"><div className="score-item-n">{recallPoints}</div><div className="score-item-l">Recall points</div></div>
        <div className="score-item"><div className="score-item-n">{quizPoints}</div><div className="score-item-l">Quiz points</div></div>
        <div className="score-item"><div className="score-item-n" style={{ color: scoreColor }}>{pct}%</div><div className="score-item-l">Final score</div></div>
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
    const id = setInterval(() => {
      setTimerSecs(s => { if (s <= 1) { clearInterval(id); setTimerExpired(true); setShowBreak(true); return 0; } return s - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [timerExpired]);

  const timerMins = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const timerSec2 = String(timerSecs % 60).padStart(2, "0");
  const timerClass = timerExpired ? "timer-expired" : timerSecs < 300 ? "timer-warning" : "";
  const next = () => { setCompleted(prev => new Set([...prev, SECTIONS[sectionIdx].id])); goTo(Math.min(sectionIdx + 1, SECTIONS.length - 1)); };
  const progress = Math.round((sectionIdx / (SECTIONS.length - 1)) * 100);

  const renderSection = () => {
    const sec = SECTIONS[sectionIdx];
    switch (sec.id) {
      case "prediction":    return <SectionPrediction onNext={next} />;
      case "intro":         return <SectionIntro onNext={next} />;
      case "composability": return <SectionComposability onNext={next} />;
      case "handoff":       return <SectionHandoff onNext={next} />;
      case "dataflow":      return <SectionDataflow onNext={next} />;
      case "script-rule":   return <SectionScriptRule onNext={next} />;
      case "recall":        return <SectionRecall onNext={next} onScore={(id, g) => setRecallScores(p => ({ ...p, [id]: g }))} />;
      case "quiz":          return <SectionQuiz onNext={next} onScore={(id, c) => setQuizScores(p => ({ ...p, [id]: c }))} />;
      case "summary":       return <SectionSummary onNext={next} />;
      case "complete":      return <SectionComplete recallScores={recallScores} quizScores={quizScores} />;
      default:              return null;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="lesson-shell" style={{ gridTemplateColumns: sidebarOpen ? "260px 1fr" : "44px 1fr" }}>
        <header className="lesson-header">
          <div className="header-badge">Level 2</div>
          <div className="header-title">Module 5 — Composability & Pipelines</div>
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
              <div className="si-dot" />
              {sidebarOpen && <div className="si-label">{sec.label}</div>}
            </div>
          ))}
        </nav>
        <main className="lesson-main" ref={mainRef}>
          <div className="lesson-main-inner">
            {showBreak && (
              <div className="break-banner">
                <span className="break-banner-icon">⏸</span>
                <span>
                  <strong>Pomodoro complete.</strong> Take a 5-minute break before continuing.
                  <button onClick={() => { setShowBreak(false); setTimerSecs(25 * 60); setTimerExpired(false); }} style={{ marginLeft: "12px", background: "none", border: `1px solid ${G.amber}60`, color: G.amber, borderRadius: "4px", padding: "2px 10px", cursor: "pointer", fontSize: "12px" }}>
                    Start New Pomodoro
                  </button>
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
