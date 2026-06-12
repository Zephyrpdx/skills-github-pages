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
  .lesson-sidebar.collapsed { padding: 20px 0; }
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
  .divider { border: none; border-top: 1px solid ${G.border}; margin: 32px 0; }
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
The student is about to read Module 4: Agentic Contracts. Their prediction is an activation exercise — not a test.
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "2-3 sentences noting what shows good intuition, briefly hinting at what the lesson adds, and encouraging forward. Correct = understands agent-directed skills need stricter contracts than human-directed. Partial = vaguely related idea. Incorrect = off-base. Tone: warm, forward-looking."
}`;

const RECALL_SYSTEM = `You are an expert instructor assessing a student's recall answer for Module 4 of the Agent-Readable Skills Infrastructure curriculum: "Agentic Contracts."
The module covers: the shift from human-directed to agent-directed skills, the recipe vs API analogy, and the four SLA Contract blocks (Input Contract, Output Contract, Dependency Contract, Downstream Assumption Contract).
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "2-4 sentences affirming what was right, correcting or filling gaps, reinforcing the key concept. Precise and direct — not sycophantic."
}
Grading: correct = essential concept captured accurately. partial = got some but missed something important. incorrect = missed the concept or left blank.`;

const QUIZ_SYSTEM = `You are an expert instructor explaining a quiz answer for Module 4: Agentic Contracts (Agent-Readable Skills Infrastructure curriculum).
The student selected an answer that was {{CORRECT_OR_NOT}}.
Return ONLY a JSON object:
{ "message": "2-3 sentences explaining why the correct answer is right and, if the student was wrong, why their choice was incorrect. Be specific. Use concrete examples from the agentic skills domain." }`;

const SUMMARY_SYSTEM = `You are assessing a student's written summary of Module 4: "Agentic Contracts" from the Agent-Readable Skills Infrastructure curriculum.
A complete correct answer covers ALL THREE of: (1) the shift from human-directed to agent-directed (recipe vs API analogy); (2) the four SLA Contract blocks (Input, Output, Dependency, Downstream Assumption); (3) why STATUS_CODEs are required instead of prose failure messages.
Return ONLY a JSON object:
{
  "grade": "correct" | "partial" | "incorrect",
  "label": "short 2-4 word verdict",
  "message": "3-4 sentences: affirm what was captured, identify specifically what was missing or imprecise, reinforce the key concept. Precise and direct."
}`;

function shuffleOptions(options) { return [...options].sort(() => Math.random() - 0.5); }

const moduleN = 4;

const SECTIONS = [
  { id: "prediction",    label: "Pre-Lesson Prediction",       type: "prediction" },
  { id: "intro",         label: "Introduction",                type: "content"    },
  { id: "shift",         label: "4.1 Human vs Agent Skills",   type: "content"    },
  { id: "sla-contract",  label: "4.2 The Agentic SLA Contract",type: "content"    },
  { id: "contracts-2",   label: "4.3 Dep. & Downstream Contracts", type: "content" },
  { id: "worked-example",label: "4.4 Worked Example",          type: "content"    },
  { id: "recall",        label: "Recall Check",                type: "recall"     },
  { id: "quiz",          label: "Mini-Quiz",                   type: "quiz"       },
  { id: "summary",       label: "Written Summary",             type: "summary"    },
  { id: "complete",      label: "Module Complete",             type: "complete"   },
];

const RECALL_QUESTIONS = [
  {
    id: "r1",
    prompt: "Name the four blocks of an Agentic SLA Contract. For each one, describe in a sentence what it declares.",
    rubric: "Looking for: (1) Input Contract — required and optional input fields with types, formats, constraints; (2) Output Contract — all possible output schemas including success paths and STATUS_CODE failure states; (3) Dependency Contract — upstream preconditions required for the skill to function; (4) Downstream Assumption Contract — guarantees the calling agent can rely on from the output. Credit for capturing the essence of each.",
  },
  {
    id: "r2",
    prompt: "Explain the 'recipe vs. API' analogy. What does it illustrate about the difference between human-directed and agent-directed skills?",
    rubric: "Key points: a recipe says 'add salt to taste' — relies on human judgment. An API says 'salt: float, grams, range 0.0–5.0, default 2.0' — mechanically parseable, no judgment required. Human-directed skills can be flexible because a human reader applies context. Agent-directed skills must be machine-readable because an autonomous agent cannot apply judgment to ambiguous instructions.",
  },
  {
    id: "r3",
    prompt: "Why must agentic skill failure states be STATUS_CODEs rather than natural language explanations? What breaks if they aren't?",
    rubric: "Key points: automated pipelines parse output mechanically. Natural language failure messages ('I couldn't find any results because...') cannot be reliably detected by a downstream parser. If the downstream expects STATUS: NO_ITEMS_FOUND but gets prose, the pipeline either crashes or continues with corrupted data. STATUS_CODEs are machine-identifiable — the calling agent can route on them predictably.",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "An autonomous agent calls a skill that finds no matching results. The skill returns: 'I searched thoroughly but unfortunately could not locate any matching records. Please try different search terms.' What is the critical problem?",
    options: [
      { text: "Automated pipelines cannot mechanically detect a failure state in natural language prose — they expect a parseable STATUS_CODE.", correct: true },
      { text: "The response is too long and will exceed the agent's context window.", correct: false },
      { text: "The skill should have searched harder before returning a negative result.", correct: false },
      { text: "The response is missing a timestamp field required by the Input Contract.", correct: false },
    ],
    explanation: "Automated agents parse output mechanically. Natural language failure descriptions like this one cannot be reliably detected by a downstream routing rule. The correct pattern is STATUS: NO_RESULTS_FOUND — a predictable, machine-readable token the calling agent can act on.",
  },
  {
    id: "q2",
    text: "Which Agentic SLA Contract block declares that 'output rows are always sorted ascending by due date, and date format is always ISO 8601'?",
    options: [
      { text: "Output Contract — it specifies the output schema and structure.", correct: false },
      { text: "Downstream Assumption Contract — it declares guarantees the calling agent can rely on.", correct: true },
      { text: "Dependency Contract — it declares preconditions for the skill to run.", correct: false },
      { text: "Input Contract — it specifies what the skill receives.", correct: false },
    ],
    explanation: "The Downstream Assumption Contract declares what the calling agent can reliably expect from the output — sort order, date formats, encoding guarantees. The Output Contract declares the schema (field names, types), while the Downstream Assumption Contract makes behavioral guarantees that downstream logic can hard-code.",
  },
  {
    id: "q3",
    text: "A skill's Input Contract reads: 'Required: transcript_text (string, UTF-8, max 5,000 words). Optional: meeting_date (ISO 8601).' The calling agent sends a DOCX binary blob as transcript_text. What should the skill do?",
    options: [
      { text: "Attempt to parse the binary as text and extract what it can.", correct: false },
      { text: "Return STATUS: INVALID_INPUT_FORMAT as defined in the Output Contract.", correct: true },
      { text: "Ask the user to re-send the input in plain text.", correct: false },
      { text: "Skip the input validation and attempt to process it anyway.", correct: false },
    ],
    explanation: "The Input Contract specifies UTF-8 plain text. A binary DOCX violates this precondition. The correct agentic response is to emit the documented failure STATUS_CODE (INVALID_INPUT_FORMAT), not to attempt recovery or produce natural language guidance. The calling agent is responsible for routing on the STATUS_CODE.",
  },
  {
    id: "q4",
    text: "What best describes the difference between a human-directed skill and an agent-directed skill?",
    options: [
      { text: "Human-directed skills are longer; agent-directed skills must be under 150 lines.", correct: false },
      { text: "Human-directed skills rely on the reader applying judgment to flexible instructions; agent-directed skills are mechanical API specifications with no ambiguity.", correct: true },
      { text: "Human-directed skills use markdown; agent-directed skills use JSON.", correct: false },
      { text: "Human-directed skills have no edge cases; agent-directed skills document all edge cases.", correct: false },
    ],
    explanation: "The recipe vs. API analogy captures this precisely. A human reader can interpret 'add salt to taste' — an autonomous agent cannot. Agent-directed skills are strict API specifications: every field is typed, constrained, and documented; every failure state emits a parseable STATUS_CODE. No judgment is required from the consumer.",
  },
];

// ── Shared UI components ──────────────────────────────────────────────────────

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

// ── Section: Prediction ────────────────────────────────────────────────────────

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
      <div className="sec-sub">Module 4 — Agentic Contracts</div>
      <div className="prose">
        Level 2 shifts from building skills for humans to building skills for <strong>autonomous agents</strong>.
        Before reading, write one sentence about how you think a skill designed for an agent might differ
        from one written for a human reader.
      </div>
      <div className="recall-box">
        <div className="recall-label">Your Prediction</div>
        <textarea
          className="recall-input"
          placeholder="Write one sentence — there is no wrong answer here…"
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={!!result}
        />
        {!result && (
          <button
            className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`}
            style={{ marginTop: "12px" }}
            onClick={submit}
            disabled={!text.trim() || loading}
          >
            {loading ? "Assessing…" : "Submit Prediction"}
          </button>
        )}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Getting feedback…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && (
        <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>
          Start Module 4 →
        </button>
      )}
    </div>
  );
}

// ── Section: Intro ─────────────────────────────────────────────────────────────

function SectionIntro({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Module 4 · Level 2 — Intermediate</div>
      <div className="sec-title">Agentic Contracts</div>
      <div className="sec-sub">Building skills that autonomous agents can execute reliably</div>
      <div className="prose">
        In Level 1 you learned to build skills for human operators — people who can read,
        interpret, and apply judgment to your skill's output. Level 2 changes the consumer.
        When an <strong>autonomous agent</strong> calls your skill, it cannot apply judgment.
        It parses output mechanically, routes on specific tokens, and fails silently if the
        schema doesn't match its expectations.
      </div>
      <div className="prose">
        This module introduces the <strong>Agentic SLA Contract</strong> — four structural blocks
        added to a skill's body that transform it from a human-readable instruction set into a
        machine-executable API specification.
      </div>
      <div className="callout callout-insight">
        <div className="callout-title">What You'll Learn</div>
        <p>Why agent-directed skills need stricter contracts · The four SLA Contract blocks ·
        The Input / Output / Dependency / Downstream Assumption structure ·
        Why STATUS_CODEs replace natural language failure messages</p>
      </div>
      <ul className="content-list">
        <li><strong>Estimated time:</strong> 35 minutes (1–2 Pomodoro sessions)</li>
        <li><strong>Prerequisites:</strong> Modules 1–3 (Level 1 complete)</li>
        <li><strong>Sections:</strong> 4 content sections + Recall + Quiz + Summary</li>
      </ul>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>
        Begin →
      </button>
    </div>
  );
}

// ── Section 4.1: Human vs Agent Shift ─────────────────────────────────────────

function SectionShift({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 4.1</div>
      <div className="sec-title">The Shift: Human-Directed to Agent-Directed</div>
      <div className="prose">
        When a human reads your skill output, they can apply judgment to handle format variation.
        When an <strong>autonomous agent</strong> reads your skill output, it cannot.
        The shift is from <em>flexible instructions</em> to a <em>strict API specification</em>.
      </div>

      <div className="compare-grid" style={{ marginBottom: "24px" }}>
        <div className="compare-col bad">
          <div className="compare-header">Recipe (Human-Directed)</div>
          <p>"Add salt to taste"</p>
          <p style={{ marginTop: "10px" }}>"If the data looks thin, add a few more rows of context."</p>
          <p style={{ marginTop: "10px" }}>Relies on the reader applying judgment. Humans can do this. Agents cannot.</p>
        </div>
        <div className="compare-col good">
          <div className="compare-header">API Spec (Agent-Directed)</div>
          <p><code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>salt: float, grams, range 0.0–5.0, default 2.0</code></p>
          <p style={{ marginTop: "10px" }}>Output exactly 5 rows. Field count: 4. No additional prose.</p>
          <p style={{ marginTop: "10px" }}>Mechanically parseable. No ambiguity. No judgment required.</p>
        </div>
      </div>

      <div className="prose">
        This distinction shapes every decision in Level 2. Skills written for humans can be
        generous with interpretation. Skills written for agents must be{" "}
        <strong>deterministic API contracts</strong> — typed inputs, typed outputs, and machine-readable
        failure codes for every possible failure state.
      </div>

      <div className="callout callout-warning">
        <div className="callout-title">The Silent Failure Problem</div>
        <p>
          When a human encounters an unexpected output format, they notice and ask for clarification.
          When an agent encounters an unexpected output format, it either crashes or continues with
          corrupted data — silently producing wrong results downstream. The stakes of format ambiguity
          are much higher in agentic contexts.
        </p>
      </div>

      <div className="prose">
        The <strong>Agentic SLA Contract</strong> solves this by adding four explicit structural blocks
        to your skill body. These blocks turn implicit human-readable assumptions into explicit
        machine-readable guarantees.
      </div>

      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>
        Next: The SLA Contract →
      </button>
    </div>
  );
}

// ── Section 4.2: Input & Output Contracts ─────────────────────────────────────

function SectionSLA({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 4.2</div>
      <div className="sec-title">The Agentic SLA Contract (I)</div>
      <div className="sec-sub">Input Contract and Output Contract</div>
      <div className="prose">
        Level 2 skills add four structural blocks to the standard skill body. The first two define
        what the skill accepts and what it promises to produce.
      </div>

      <div className="callout callout-insight">
        <div className="callout-title">Block 1 — Input Contract</div>
        <p>Declares all required and optional input fields with their types, formats, and constraints.
        Every field the skill expects must be documented here.</p>
      </div>

      <div className="code-block">
        <pre>{`## Input Contract
Required: transcript_text (string, plain text, UTF-8, max 5,000 words)
Optional: meeting_date (string, ISO 8601 date, e.g. 2025-06-15)

Input validation: If transcript_text is absent or empty →
  emit STATUS: INVALID_INPUT_FORMAT and halt.`}</pre>
      </div>

      <div className="callout callout-insight">
        <div className="callout-title">Block 2 — Output Contract</div>
        <p>Declares all possible output schemas — success paths AND all STATUS_CODE failure states.
        A downstream agent must be able to enumerate every output this skill can produce.</p>
      </div>

      <div className="code-block">
        <pre>{`## Output Contract
Success: numbered list rows —
  [Owner] | [Action description] | [Due: YYYY-MM-DD or UNSCHEDULED]

Failure states:
  STATUS: NO_ITEMS_FOUND           (transcript contained no action items)
  STATUS: INPUT_NOT_MEETING_TRANSCRIPT  (input not recognized as a meeting)
  STATUS: INVALID_INPUT_FORMAT     (input violated Input Contract)
  STATUS: TRUNCATED_INPUT          (input exceeded 5,000-word limit)

Each STATUS is output as a single line. No other output on failure.`}</pre>
      </div>

      <div className="callout callout-warning">
        <div className="callout-title">Critical Rule — STATUS_CODEs Only</div>
        <p>
          Failure states must emit machine-parseable STATUS_CODEs — not natural language explanations.
          "I couldn't find any action items in this transcript" cannot be reliably detected by a
          downstream parser. <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>STATUS: NO_ITEMS_FOUND</code> can.
        </p>
      </div>

      <div className="prose">
        The Output Contract's failure states are the agent-directed equivalent of a function's
        exception types. Every downstream agent that calls this skill should handle each documented
        STATUS_CODE explicitly in its routing logic.
      </div>

      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>
        Next: Dep. & Downstream Contracts →
      </button>
    </div>
  );
}

// ── Section 4.3: Dependency & Downstream Contracts ────────────────────────────

function SectionContracts2({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 4.3</div>
      <div className="sec-title">The Agentic SLA Contract (II)</div>
      <div className="sec-sub">Dependency Contract and Downstream Assumption Contract</div>
      <div className="prose">
        The second pair of contract blocks addresses the skill's environment: what must be true
        <em> before</em> the skill runs, and what can downstream agents <em>guarantee</em> about the output.
      </div>

      <div className="callout callout-insight">
        <div className="callout-title">Block 3 — Dependency Contract</div>
        <p>Declares upstream preconditions that must hold for the skill to function correctly.
        This is where you document encoding requirements, upstream service dependencies,
        or format prerequisites that are not obvious from the Input Contract alone.</p>
      </div>

      <div className="code-block">
        <pre>{`## Dependency Contract
Input must be UTF-8 encoded plain text.
HTML, DOCX, PDF, or binary input will emit STATUS: INVALID_INPUT_FORMAT.

Upstream caller must ensure transcript_text has been stripped
of speaker-labeling timestamps (e.g., "[00:04:23] Sarah:") before
passing to this skill, or named-entity extraction accuracy degrades.`}</pre>
      </div>

      <div className="callout callout-insight">
        <div className="callout-title">Block 4 — Downstream Assumption Contract</div>
        <p>Declares guarantees the calling agent can hard-code into its own logic. Sort order,
        date formats, field encoding — any behavioral property that downstream logic might
        depend on must be explicitly promised here.</p>
      </div>

      <div className="code-block">
        <pre>{`## Downstream Assumption Contract
Output rows are always sorted ascending by due date.
Items with no due date always appear last.
Date format is always ISO 8601 (YYYY-MM-DD). Never a localized
date string ("June 15" or "15/06/25") — regardless of input locale.
Owner field is always present. Unknown owners are always "UNASSIGNED".
Row count: minimum 0 (on NO_ITEMS_FOUND). No maximum.`}</pre>
      </div>

      <div className="prose">
        The Downstream Assumption Contract is the most often omitted block, and its absence causes
        the most subtle bugs. When a downstream agent assumes ISO 8601 dates but the skill occasionally
        emits localized strings, the pipeline fails intermittently — only when meeting notes use
        relative date references. These failures are hard to reproduce and hard to diagnose.
      </div>

      <div className="callout callout-tip">
        <div className="callout-title">Full Four-Block Structure</div>
        <p>
          Every agentic skill should have all four blocks: <strong>Input Contract</strong> (what I accept),{" "}
          <strong>Output Contract</strong> (what I can produce), <strong>Dependency Contract</strong>{" "}
          (what must be true before I run), <strong>Downstream Assumption Contract</strong> (what you can
          always count on). Together they form the complete API specification.
        </p>
      </div>

      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>
        Next: Worked Example →
      </button>
    </div>
  );
}

// ── Section 4.4: Worked Example ───────────────────────────────────────────────

function SectionWorkedExample({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 4.4</div>
      <div className="sec-title">Worked Example</div>
      <div className="sec-sub">Comparing a human-directed skill to its agentic upgrade</div>
      <div className="prose">
        The most revealing way to understand agentic contracts is to compare the same skill feature
        written for humans vs. written for agents. Read both versions below, then cover the page
        and try to identify the differences from memory.
      </div>

      <div className="compare-grid" style={{ marginBottom: "24px" }}>
        <div className="compare-col bad">
          <div className="compare-header">Human-Directed Edge Case</div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
            If no action items are found, politely explain that the transcript contained no action items
            and suggest that the meeting may not have produced any decisions.
          </p>
        </div>
        <div className="compare-col good">
          <div className="compare-header">Agent-Directed Edge Case</div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
            If no action items found: output "STATUS: NO_ITEMS_FOUND" on a single line. No other output.
          </p>
        </div>
      </div>

      <div className="prose">
        The human-friendly version produces natural language that is pleasant for a person to read.
        The agentic version produces a predictable STATUS_CODE that a calling agent can route on.
        The difference is not about quality — it's about the consumer's capabilities.
      </div>

      <div className="prose" style={{ marginTop: "8px" }}>
        Here is the same difference applied to the date field in the Output Contract:
      </div>

      <div className="compare-grid" style={{ marginBottom: "24px" }}>
        <div className="compare-col bad">
          <div className="compare-header">Ambiguous Output Spec</div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
            Include the due date in a readable format.
          </p>
        </div>
        <div className="compare-col good">
          <div className="compare-header">Deterministic Output Spec</div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
            Due: YYYY-MM-DD (ISO 8601). Never a localized string. If no date: output "UNSCHEDULED".
          </p>
        </div>
      </div>

      <div className="callout callout-insight">
        <div className="callout-title">The Upgrade Checklist</div>
        <p>To convert a human-directed skill to an agentic skill, add these four blocks and review
        each existing instruction through the lens of: "Can a downstream parser act on this output
        without human interpretation?" If the answer is no, rewrite until it is yes.</p>
      </div>

      <div className="code-block">
        <pre>{`## Input Contract
## Output Contract     ← includes all STATUS_CODE failure states
## Dependency Contract
## Downstream Assumption Contract`}</pre>
      </div>

      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>
        Next: Recall Check →
      </button>
    </div>
  );
}

// ── Section: Recall ────────────────────────────────────────────────────────────

function SectionRecall({ onNext, onScore }) {
  const [answers, setAnswers] = useState({ r1: "", r2: "", r3: "" });
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [allDone, setAllDone] = useState(false);

  const submit = async (id) => {
    const q = RECALL_QUESTIONS.find(q => q.id === id);
    if (!answers[id].trim() || loading[id]) return;
    setLoading(prev => ({ ...prev, [id]: true }));
    const sys = RECALL_SYSTEM + `\n\nRubric for this question: ${q.rubric}`;
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
      <div className="prose">
        Cover your notes and answer from memory. Struggling to retrieve is the learning — don't skip it.
      </div>
      {RECALL_QUESTIONS.map(q => (
        <div key={q.id} className="recall-box">
          <div className="recall-label">Question {q.id.toUpperCase()}</div>
          <div className="recall-prompt">{q.prompt}</div>
          <textarea
            className="recall-input"
            value={answers[q.id]}
            onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
            disabled={!!results[q.id]}
            placeholder="Write your answer here…"
          />
          {!results[q.id] && (
            <button
              className={`btn btn-primary ${(!answers[q.id].trim() || loading[q.id]) ? "btn-disabled" : ""}`}
              style={{ marginTop: "10px" }}
              onClick={() => submit(q.id)}
              disabled={!answers[q.id].trim() || loading[q.id]}
            >
              {loading[q.id] ? "Assessing…" : "Submit"}
            </button>
          )}
          {loading[q.id] && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Assessing…</span></div>}
          <FeedbackBox result={results[q.id]} />
        </div>
      ))}
      {allDone && (
        <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>
          Next: Mini-Quiz →
        </button>
      )}
    </div>
  );
}

// ── Section: Quiz ──────────────────────────────────────────────────────────────

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
    const res = await assessWithClaude(sys, `Question: ${q.text}\nCorrect answer: ${q.options.find(o => o.correct).text}\nStudent selected: ${shuffled.options[idx].text}\nExplanation hint: ${q.explanation}`);
    setFeedback(res.message || q.explanation);
    setLoading(false);
    onResult(correct);
    storageSet(`engagement:module${moduleN}:quiz:${q.id}`, { correct, timestamp: Date.now() });
  };

  const optClass = (idx) => {
    let base = "quiz-option";
    if (locked) base += " locked";
    if (idx === selected && shuffled.options[idx]?.correct)  base += " correct";
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
      <div className="prose">Select the best answer. Click once to lock in — there is no confirmation step.</div>
      {QUIZ_QUESTIONS.map((q, i) => (
        <QuizQuestion key={q.id} q={q} onResult={(correct) => {
          setScores(prev => [...prev, correct]);
          onScore(q.id, correct);
        }} />
      ))}
      {allDone && (
        <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>
          Next: Written Summary →
        </button>
      )}
    </div>
  );
}

// ── Section: Summary ───────────────────────────────────────────────────────────

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
        In 3–5 sentences, summarize what an Agentic SLA Contract is and why it matters.
        Aim to cover: (1) what changes when skills serve agents instead of humans;
        (2) the four contract blocks; (3) why STATUS_CODEs are required.
      </div>
      <div className="recall-box">
        <div className="recall-label">Your Summary</div>
        <textarea
          className="recall-input"
          style={{ minHeight: "120px" }}
          placeholder="Write 3–5 sentences from memory…"
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={!!result}
        />
        {!result && (
          <button
            className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`}
            style={{ marginTop: "12px" }}
            onClick={submit}
            disabled={!text.trim() || loading}
          >
            {loading ? "Assessing…" : "Submit Summary"}
          </button>
        )}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Assessing…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && (
        <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>
          See Your Score →
        </button>
      )}
    </div>
  );
}

// ── Section: Complete ──────────────────────────────────────────────────────────

function SectionComplete({ recallScores, quizScores }) {
  const recallPoints = Object.values(recallScores).reduce((t, g) =>
    t + (g === "correct" ? 2 : g === "partial" ? 1 : 0), 0);
  const quizPoints = Object.values(quizScores).reduce((t, c) => t + (c ? 2 : 0), 0);
  const maxPoints = RECALL_QUESTIONS.length * 2 + QUIZ_QUESTIONS.length * 2;
  const pct = maxPoints > 0 ? Math.round(((recallPoints + quizPoints) / maxPoints) * 100) : 0;
  const scoreColor = pct >= 80 ? G.green : pct >= 55 ? G.amber : G.red;

  const recommendation = pct >= 80
    ? "Strong performance. Advance to Module 5: Composability & Pipelines."
    : pct >= 55
    ? "Solid foundation with gaps. Review sections on STATUS_CODEs and the four contract blocks before advancing."
    : "Consider re-reading Module 4 before continuing. Focus on the recipe vs. API analogy and all four SLA contract blocks.";

  useEffect(() => {
    storageSet(`engagement:module${moduleN}:sessions`, [{ completed: true, score: pct, startTime: Date.now() }]);
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: "32px" }}>
      <div className="sec-eyebrow" style={{ textAlign: "center" }}>Module Complete</div>
      <div className="sec-title" style={{ textAlign: "center", marginBottom: "4px" }}>Module 4 Finished</div>
      <div className="sec-sub" style={{ textAlign: "center", marginBottom: "32px" }}>Agentic Contracts</div>
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
        <div className="score-item">
          <div className="score-item-n">{recallPoints}</div>
          <div className="score-item-l">Recall points</div>
        </div>
        <div className="score-item">
          <div className="score-item-n">{quizPoints}</div>
          <div className="score-item-l">Quiz points</div>
        </div>
        <div className="score-item">
          <div className="score-item-n" style={{ color: scoreColor }}>{pct}%</div>
          <div className="score-item-l">Final score</div>
        </div>
      </div>
      <div className="prose" style={{ marginTop: "28px", maxWidth: "480px", margin: "28px auto 0", textAlign: "left" }}>
        <strong>Spaced repetition reminder:</strong> Review Module 4 flashcards now,
        then again in 24 hours and 3 days to lock in the SLA Contract structure.
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────

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
      setTimerSecs(s => {
        if (s <= 1) { clearInterval(id); setTimerExpired(true); setShowBreak(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerExpired]);

  const timerMins = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const timerSec2 = String(timerSecs % 60).padStart(2, "0");
  const timerClass = timerExpired ? "timer-expired" : timerSecs < 300 ? "timer-warning" : "";

  const next = () => {
    setCompleted(prev => new Set([...prev, SECTIONS[sectionIdx].id]));
    goTo(Math.min(sectionIdx + 1, SECTIONS.length - 1));
  };

  const progress = Math.round((sectionIdx / (SECTIONS.length - 1)) * 100);

  const renderSection = () => {
    const sec = SECTIONS[sectionIdx];
    switch (sec.id) {
      case "prediction":     return <SectionPrediction onNext={next} />;
      case "intro":          return <SectionIntro onNext={next} />;
      case "shift":          return <SectionShift onNext={next} />;
      case "sla-contract":   return <SectionSLA onNext={next} />;
      case "contracts-2":    return <SectionContracts2 onNext={next} />;
      case "worked-example": return <SectionWorkedExample onNext={next} />;
      case "recall":         return <SectionRecall onNext={next} onScore={(id, g) => setRecallScores(p => ({ ...p, [id]: g }))} />;
      case "quiz":           return <SectionQuiz onNext={next} onScore={(id, c) => setQuizScores(p => ({ ...p, [id]: c }))} />;
      case "summary":        return <SectionSummary onNext={next} />;
      case "complete":       return <SectionComplete recallScores={recallScores} quizScores={quizScores} />;
      default:               return null;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="lesson-shell" style={{ gridTemplateColumns: sidebarOpen ? "260px 1fr" : "44px 1fr" }}>
        <header className="lesson-header">
          <div className="header-badge">Level 2</div>
          <div className="header-title">Module 4 — Agentic Contracts</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-label">{progress}%</div>
          </div>
          <div className={`timer-display ${timerClass}`}>{timerMins}:{timerSec2}</div>
        </header>

        <nav className={`lesson-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-toggle-row">
            {sidebarOpen && <span className="sidebar-section-label">Contents</span>}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>
          {SECTIONS.map((sec, idx) => (
            <div key={sec.id}
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
                <span className="break-banner-icon">⏸</span>
                <span>
                  <strong>Pomodoro complete.</strong> Take a 5-minute break before continuing — your brain consolidates learning during rest.
                  <button onClick={() => { setShowBreak(false); setTimerSecs(25 * 60); setTimerExpired(false); }}
                    style={{ marginLeft: "12px", background: "none", border: `1px solid ${G.amber}60`, color: G.amber, borderRadius: "4px", padding: "2px 10px", cursor: "pointer", fontSize: "12px" }}>
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
