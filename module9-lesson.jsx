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
  .risk-card { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 18px 20px; margin: 12px 0; }
  .risk-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .risk-badge { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; padding: 3px 9px; border-radius: 3px; }
  .risk-badge.high { background: ${G.red}20; color: ${G.red}; border: 1px solid ${G.red}50; }
  .risk-badge.med  { background: ${G.amber}20; color: ${G.amber}; border: 1px solid ${G.amber}50; }
  .risk-card-title { font-family: 'Crimson Pro', serif; font-size: 18px; color: ${G.cream}; }
  .risk-card p { font-size: 14px; line-height: 1.65; color: ${G.text}; }
  .code-block { background: ${G.code}; border-radius: 6px; padding: 16px 18px; margin: 16px 0; overflow-x: auto; }
  .code-block pre { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #8EC8F0; line-height: 1.6; white-space: pre; }
  .capstone-phase { border: 1px solid ${G.border}; border-radius: 8px; overflow: hidden; margin: 16px 0; }
  .capstone-phase-header { background: ${G.navyL}; padding: 12px 18px; display: flex; align-items: center; gap: 12px; }
  .capstone-num { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: ${G.amber}; background: ${G.navy}; border: 1px solid ${G.amber}50; border-radius: 4px; padding: 2px 8px; flex-shrink: 0; }
  .capstone-phase-title { font-family: 'Crimson Pro', serif; font-size: 17px; color: ${G.cream}; }
  .capstone-phase-body { padding: 14px 18px; }
  .capstone-phase-body ul { list-style: none; padding: 0; margin: 0; }
  .capstone-phase-body ul li { padding: 5px 0 5px 18px; position: relative; font-size: 14px; color: ${G.text}; line-height: 1.6; }
  .capstone-phase-body ul li::before { content: "·"; position: absolute; left: 0; color: ${G.amber}; font-weight: 700; }
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
  .capstone-complete-banner { background: linear-gradient(135deg, ${G.navyL} 0%, #0F2A1D 100%); border: 1px solid ${G.green}50; border-radius: 10px; padding: 28px 32px; margin: 24px 0 32px; text-align: center; }
  .capstone-complete-banner h2 { font-family: 'Crimson Pro', serif; font-size: 28px; color: ${G.green}; margin-bottom: 8px; }
  .capstone-complete-banner p { font-size: 14px; color: ${G.text}; line-height: 1.65; max-width: 520px; margin: 0 auto; }
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

const PREDICTION_SYSTEM = `You are a learning coach. Student is about to read Module 9: Enterprise Deployment. Return ONLY: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "2-3 sentences. Correct = understands that deploying skills at scale requires governance, versioning, and continuity planning. Partial = mentions version control or deployment without the enterprise context. Incorrect = off-base. Warm, forward-looking." }`;

const RECALL_SYSTEM = `You are assessing a recall answer for Module 9: "Enterprise Deployment." Module covers: version control imperative (org-skills repository, semantic versioning, change-log mandatory), three continuity risks (skill orphaning, silent regression, tier-3 loss), and the capstone framework. Return ONLY: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "2-4 precise sentences." }`;

const QUIZ_SYSTEM = `Expert instructor explaining quiz answer for Module 9: Enterprise Deployment. Answer was {{CORRECT_OR_NOT}}. Return ONLY: { "message": "2-3 sentences: why correct is right, if wrong why their choice was incorrect." }`;

const SUMMARY_SYSTEM = `Assessing student summary of Module 9: "Enterprise Deployment." Complete answer covers: (1) why a centralized org-skills repository is required (auditable single source of truth); (2) the three continuity risks and how to mitigate them; (3) what the capstone demonstrates. Return ONLY: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "3-4 precise sentences." }`;

function shuffleOptions(opts) { return [...opts].sort(() => Math.random() - 0.5); }

const moduleN = 9;

const SECTIONS = [
  { id: "prediction",  label: "Pre-Lesson Prediction",          type: "prediction" },
  { id: "intro",       label: "Introduction",                   type: "content"    },
  { id: "version",     label: "9.1 Version Control",            type: "content"    },
  { id: "continuity",  label: "9.2 Continuity Planning",        type: "content"    },
  { id: "capstone",    label: "9.3 Capstone Assignment",        type: "content"    },
  { id: "recall",      label: "Recall Check",                   type: "recall"     },
  { id: "quiz",        label: "Mini-Quiz",                      type: "quiz"       },
  { id: "summary",     label: "Written Summary",                type: "summary"    },
  { id: "complete",    label: "Curriculum Complete",            type: "complete"   },
];

const RECALL_QUESTIONS = [
  {
    id: "r1",
    prompt: "Why does an enterprise skills deployment require a centralized version-controlled repository rather than ad hoc file management? Describe what the repository structure looks like.",
    rubric: "Ad hoc management (shared drives, email attachments, local copies) creates multiple sources of truth — no one knows which version is actually deployed. A centralized version-controlled repository (org-skills-repo) is the single source of truth. Structure: tier-1/ (org-level), tier-2/ (team-level directories), tier-3/ (experimental). Each skill file follows semantic versioning (v1.0.0 → v1.0.1 for patch, v1.1.0 for minor behavioral change, v2.0.0 for breaking change). Every commit must include a change-log entry with: date, author, version, what changed, why it changed, and which downstream skills may be affected.",
  },
  {
    id: "r2",
    prompt: "Describe the three enterprise continuity risks introduced in Module 9. For each, describe the failure mode and one mitigation.",
    rubric: "(1) Skill Orphaning: a skill's author leaves, no one understands the design rationale, so when it breaks it cannot be reliably repaired. Mitigation: designate a primary owner + backup for every skill, stored in the skill file's Owner field. (2) Silent Regression: a routine infrastructure update (model version, API change) degrades skill performance without any explicit change to skill files. Mitigation: run the quantitative test harness (Module 8) on a scheduled cadence — weekly minimum for Tier 1. (3) Tier-3 Loss: a departing team member's Tier-3 skills disappear with them, breaking pipelines that depended on undocumented local skills. Mitigation: enforce a promotion review — any Tier-3 skill depended upon by team processes must be promoted to Tier-2 before the author offboards.",
  },
  {
    id: "r3",
    prompt: "What is the purpose of the capstone assignment? What three things must the capstone demonstrate to be considered complete?",
    rubric: "The capstone synthesizes everything from the 9-module curriculum — it requires the student to produce an actual enterprise-grade skill, not an exercise. It must demonstrate: (1) a correctly structured skill.md file with a complete YAML front-matter (skill-id, owner, tier, version, synopsis), deterministic output format, and all required constraint fields; (2) a governance tier assignment with written justification of the tier choice; (3) a quantitative test basket with at least one happy-path, one edge-case, and one failure-path test case, each scored with an objectively verifiable rubric. All three must be present — a well-structured skill without the test basket is incomplete.",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "A team stores their skills in a shared drive folder. Copies exist in different employees' personal folders, with no version numbers. An incident is reported: 'The meeting-action-extractor is producing incorrect output.' Which problem does the version control imperative directly solve?",
    options: [
      { text: "The team cannot identify which version is actually deployed or compare it against known-good prior versions.", correct: true },
      { text: "The meeting-action-extractor skill was not promoted from Tier 3 to Tier 2.", correct: false },
      { text: "The skill lacks a quantitative test basket, so the regression was not detected before deployment.", correct: false },
      { text: "The shared drive does not support semantic versioning natively.", correct: false },
    ],
    explanation: "The version control imperative solves the 'which version is deployed?' problem. When multiple personal copies exist without version numbers, you cannot audit what changed, who changed it, when, or why. The centralized org-skills-repo with semantic versioning and mandatory change-log entries provides the audit trail needed to isolate regressions — you compare the currently deployed version against the last known-good version.",
  },
  {
    id: "q2",
    text: "Three months after a team member offboards, their team discovers a Tier-2 pipeline that calls a skill they never formally transferred. The skill file is gone. Which continuity risk materialized?",
    options: [
      { text: "Silent Regression — the skill degraded without anyone changing the file.", correct: false },
      { text: "Skill Orphaning — no one documented the design rationale or was assigned as backup owner.", correct: false },
      { text: "Tier-3 Loss — an undocumented or unpromotable skill disappeared with the departing author.", correct: true },
      { text: "Routing Failure — the pipeline could not find the skill's trigger description after the author left.", correct: false },
    ],
    explanation: "Tier-3 Loss is the failure mode where a departing team member's Tier-3 skills disappear with them, breaking pipelines that depended on them. The mitigation is a pre-offboarding review: any Tier-3 skill depended upon by team processes must be promoted to Tier-2 and merged into the org-skills-repo before the author's last day.",
  },
  {
    id: "q3",
    text: "Which of the following represents a complete version bump from v1.0.0 to v2.0.0 (major version)?",
    options: [
      { text: "Adding a new OUTPUT_FORMAT field that returns additional data, but existing output fields remain unchanged.", correct: false },
      { text: "Fixing a typo in the skill description that was causing ambiguity in routing.", correct: false },
      { text: "Changing the output format from a pipe-delimited table to a JSON array — breaking existing downstream parser integrations.", correct: true },
      { text: "Updating the OWNER field after a team handover, with no change to skill behavior.", correct: false },
    ],
    explanation: "A major version bump (v1.0.0 → v2.0.0) is required only for breaking changes — changes that break downstream integrations without modification. Changing the output format from pipe-delimited to JSON is a breaking change: every downstream parser expecting pipe-delimited input must be updated. Adding optional fields is a minor version (v1.1.0). Typo fixes and metadata updates are patch versions (v1.0.1).",
  },
  {
    id: "q4",
    text: "A student submits a capstone with a perfectly structured skill.md file and a correct tier assignment, but no test basket. Is the capstone complete?",
    options: [
      { text: "Yes — the skill structure and tier assignment are the core deliverables. Testing is optional for lower-tier skills.", correct: false },
      { text: "No — the capstone is incomplete without a quantitative test basket including at least one happy-path, edge-case, and failure-path test case.", correct: true },
      { text: "Yes — a test basket is only required for Tier 1 skills with 100+ downstream dependencies.", correct: false },
      { text: "Partial — the student passes but must submit a test basket separately within 30 days.", correct: false },
    ],
    explanation: "The capstone must demonstrate all three competencies: a correctly structured skill, a governance tier assignment with justification, and a quantitative test basket. All three are required — a well-structured skill without a test basket leaves the core Module 8 competency (quantitative testing) undemonstrated. The capstone is the integration test of the entire 9-module curriculum.",
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
      <div className="sec-sub">Module 9 — Enterprise Deployment</div>
      <div className="prose">This is the final module. Before reading, write one sentence describing what you think is the most important operational challenge when deploying LLM skills across a large organization.</div>
      <div className="recall-box">
        <div className="recall-label">Your Prediction</div>
        <textarea className="recall-input" placeholder="Write one sentence…" value={text} onChange={e => setText(e.target.value)} disabled={!!result} />
        {!result && <button className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`} style={{ marginTop: "12px" }} onClick={submit} disabled={!text.trim() || loading}>{loading ? "Assessing…" : "Submit Prediction"}</button>}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Getting feedback…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>Start Module 9 →</button>}
    </div>
  );
}

function SectionIntro({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Module 9 · Level 3 — Advanced</div>
      <div className="sec-title">Enterprise Deployment</div>
      <div className="sec-sub">Version control, continuity planning, and the capstone</div>
      <div className="prose">Individual skills that work correctly in isolation can fail catastrophically at enterprise scale. When dozens of teams maintain hundreds of skills — across governance tiers, with personnel changes, API updates, and model version changes — operational infrastructure matters as much as skill quality.</div>
      <div className="prose">This final module covers the three enterprise deployment essentials: centralized version control for skills, continuity planning against three major failure modes, and your capstone assignment integrating everything from the curriculum.</div>
      <div className="callout callout-insight">
        <div className="callout-title">What You'll Learn</div>
        <p>The org-skills repository structure and semantic versioning rules · Three enterprise continuity risks and their mitigations · The capstone assignment criteria integrating all nine modules</p>
      </div>
      <ul className="content-list">
        <li><strong>Estimated time:</strong> 55 minutes + capstone project time</li>
        <li><strong>Prerequisites:</strong> Modules 1–8 complete</li>
      </ul>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Begin →</button>
    </div>
  );
}

function SectionVersion({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 9.1</div>
      <div className="sec-title">The Version Control Imperative</div>
      <div className="prose">Skills stored in personal folders, shared drives, or email attachments create multiple sources of truth. When an incident occurs, you cannot answer the three questions that matter: <em>What version is deployed? When did it change? Why did it change?</em></div>
      <div className="callout callout-warning">
        <div className="callout-title">Without a Central Repository</div>
        <p>Every team member has a slightly different version. No one knows which is authoritative. Incident investigation requires interviewing people instead of reading a log. Rollbacks require guessing. Compliance audits fail.</p>
      </div>
      <div className="prose">The solution is a single <strong>org-skills-repo</strong> — a centralized, version-controlled repository that is the only authoritative source for deployed skills.</div>
      <div className="code-block">
        <pre>{`org-skills-repo/
├── tier-1/                     # Org-level governance
│   ├── brand-voice.skill.md    v2.1.0
│   └── data-classification.skill.md  v1.4.2
├── tier-2/                     # Team-level
│   ├── sales-team/
│   │   └── crm-data-formatter.skill.md  v1.0.1
│   └── eng-team/
│       └── pr-description-generator.skill.md  v3.0.0
├── tier-3/                     # Experimental (author-owned)
│   └── rodney/
│       └── meeting-prep-brief.skill.md  v0.2.0
└── CHANGELOG.md`}</pre>
      </div>
      <div className="prose"><strong>Semantic versioning rules:</strong></div>
      <ul className="content-list">
        <li><strong>Patch (v1.0.0 → v1.0.1):</strong> typo fix, metadata update, clarification that doesn't change behavior</li>
        <li><strong>Minor (v1.0.0 → v1.1.0):</strong> new optional field, non-breaking behavioral change, additional edge-case handling</li>
        <li><strong>Major (v1.0.0 → v2.0.0):</strong> breaking change — output format change, removed field, changed STATUS_CODE values</li>
      </ul>
      <div className="callout callout-insight">
        <div className="callout-title">Mandatory Change-Log Entry</div>
        <p>Every commit to the org-skills-repo must include a CHANGELOG.md entry: date, author, skill affected, version (old → new), what changed, why it changed, and which downstream skills or pipelines may need review.</p>
      </div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Continuity Planning →</button>
    </div>
  );
}

function SectionContinuity({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 9.2</div>
      <div className="sec-title">Continuity Planning</div>
      <div className="prose">Three failure modes threaten enterprise skill deployments over time — not because skills are poorly written, but because organizations change around them.</div>
      <div className="risk-card">
        <div className="risk-card-header">
          <div className="risk-badge high">High Risk</div>
          <div className="risk-card-title">Skill Orphaning</div>
        </div>
        <p><strong>Failure mode:</strong> A skill's author leaves. No one understands the design rationale — the non-obvious constraint choices, the edge-case decisions, the downstream assumptions. When the skill breaks, it cannot be reliably repaired without reverse-engineering.</p>
        <p style={{ marginTop: "10px" }}><strong>Mitigation:</strong> Every skill file must have a designated <code>PRIMARY_OWNER</code> and <code>BACKUP_OWNER</code> in its YAML front-matter. The backup must have read the skill's design rationale and be capable of modifying it independently.</p>
      </div>
      <div className="risk-card">
        <div className="risk-card-header">
          <div className="risk-badge high">High Risk</div>
          <div className="risk-card-title">Silent Regression</div>
        </div>
        <p><strong>Failure mode:</strong> No one changes any skill files. But a routine infrastructure event — a model version upgrade, an API parameter change, a dependency update — silently degrades skill performance. The skills haven't changed; the context they run in has.</p>
        <p style={{ marginTop: "10px" }}><strong>Mitigation:</strong> Run the quantitative test harness (Module 8) on a scheduled cadence. Tier 1: weekly minimum. Tier 2: monthly minimum. Tier 3: author's discretion. Any score delta triggers an investigation before the next production deployment.</p>
      </div>
      <div className="risk-card">
        <div className="risk-card-header">
          <div className="risk-badge med">Medium Risk</div>
          <div className="risk-card-title">Tier-3 Loss</div>
        </div>
        <p><strong>Failure mode:</strong> A team member builds a Tier-3 skill used by team pipelines. It exists only in their personal folder. When they leave, the skill disappears — and the pipelines that depended on it break silently until someone investigates the failures.</p>
        <p style={{ marginTop: "10px" }}><strong>Mitigation:</strong> Pre-offboarding promotion review. Any Tier-3 skill depended upon by team processes must be promoted to Tier-2 and merged into the org-skills-repo before the author offboards. If promotion is declined, the dependency must be removed first.</p>
      </div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Capstone Assignment →</button>
    </div>
  );
}

function SectionCapstone({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 9.3</div>
      <div className="sec-title">Capstone Assignment</div>
      <div className="sec-sub">Synthesize the full curriculum in one enterprise-grade deliverable</div>
      <div className="prose">The capstone requires you to produce an actual enterprise-grade skill — not an exercise or a template. It must demonstrate competency across all nine modules. A complete capstone has three required components:</div>

      <div className="capstone-phase">
        <div className="capstone-phase-header"><div className="capstone-num">Part 1</div><div className="capstone-phase-title">The Skill File</div></div>
        <div className="capstone-phase-body">
          <ul>
            <li>Choose a real task from your work context (or a convincing simulation)</li>
            <li>Complete YAML front-matter: skill-id, version (semver), tier, owner, synopsis, last-updated</li>
            <li>Deterministic output format — no prose descriptions, only executable structure</li>
            <li>All required fields: ROUTING_DESCRIPTION, INPUT_FORMAT, OUTPUT_FORMAT, EDGE_CASES, STATUS_CODES</li>
            <li>At least 3 CONSTRAINT fields covering input limits, scope exclusions, or downstream assumptions</li>
            <li>Lines ≤ 150, file size ≤ 8KB — no information padding</li>
          </ul>
        </div>
      </div>

      <div className="capstone-phase">
        <div className="capstone-phase-header"><div className="capstone-num">Part 2</div><div className="capstone-phase-title">Governance Tier Assignment</div></div>
        <div className="capstone-phase-body">
          <ul>
            <li>Assign a governance tier (1, 2, or 3) for this skill</li>
            <li>Write a justification paragraph (4–6 sentences) explaining why this tier is correct</li>
            <li>Justify against the promotion criteria from Module 7: who can modify, who can override, scope of deployment</li>
            <li>If Tier 1 or 2: identify who owns the approval workflow for future changes</li>
          </ul>
        </div>
      </div>

      <div className="capstone-phase">
        <div className="capstone-phase-header"><div className="capstone-num">Part 3</div><div className="capstone-phase-title">Quantitative Test Basket</div></div>
        <div className="capstone-phase-body">
          <ul>
            <li>Minimum 3 test cases: one happy-path, one edge-case, one failure-path</li>
            <li>Each test case: ID, type, input description, expected output summary, expected STATUS_CODE (if failure)</li>
            <li>Numeric scoring rubric (1–5 scale) with objectively verifiable criteria — no subjective language</li>
            <li>Baseline scores (v1.0.0) documented for each test case</li>
          </ul>
        </div>
      </div>

      <div className="callout callout-tip">
        <div className="callout-title">Completion Criteria</div>
        <p>All three parts required. A perfect skill file without a test basket is incomplete. A test basket with subjective rubric criteria does not satisfy Part 3. The capstone is the integration test of all nine modules.</p>
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
      <div className="sec-eyebrow">Written Summary</div><div className="sec-title">Synthesize Before You Finish</div>
      <div className="prose">In 3–5 sentences: explain why a centralized org-skills-repo is required, describe the three continuity risks, and explain what the capstone assignment demonstrates.</div>
      <div className="recall-box">
        <div className="recall-label">Your Summary</div>
        <textarea className="recall-input" style={{ minHeight: "120px" }} placeholder="Write 3–5 sentences from memory…" value={text} onChange={e => setText(e.target.value)} disabled={!!result} />
        {!result && <button className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`} style={{ marginTop: "12px" }} onClick={submit} disabled={!text.trim() || loading}>{loading ? "Assessing…" : "Submit Summary"}</button>}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Assessing…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>See Your Final Score →</button>}
    </div>
  );
}

function SectionComplete({ recallScores, quizScores }) {
  const rp = Object.values(recallScores).reduce((t, g) => t + (g === "correct" ? 2 : g === "partial" ? 1 : 0), 0);
  const qp = Object.values(quizScores).reduce((t, c) => t + (c ? 2 : 0), 0);
  const max = RECALL_QUESTIONS.length * 2 + QUIZ_QUESTIONS.length * 2;
  const pct = max > 0 ? Math.round(((rp + qp) / max) * 100) : 0;
  const sc = pct >= 80 ? G.green : pct >= 55 ? G.amber : G.red;
  useEffect(() => { storageSet(`engagement:module${moduleN}:sessions`, [{ completed: true, score: pct, startTime: Date.now() }]); }, []);
  return (
    <div style={{ textAlign: "center", paddingTop: "32px" }}>
      <div className="capstone-complete-banner">
        <h2>Curriculum Complete</h2>
        <p>You have completed all 9 modules of the Agent-Readable Skills Infrastructure curriculum. You now have the foundational knowledge to design, govern, test, and deploy enterprise-grade skill.md files for LLM-based systems.</p>
      </div>
      <div className="sec-eyebrow" style={{ textAlign: "center" }}>Module 9 Score</div>
      <div className="sec-title" style={{ textAlign: "center", marginBottom: "4px" }}>Module 9 Finished</div>
      <div className="sec-sub" style={{ textAlign: "center", marginBottom: "32px" }}>Enterprise Deployment</div>
      <div className="score-circle" style={{ borderColor: sc }}><div className="score-n" style={{ color: sc }}>{pct}%</div><div style={{ fontSize: "11px", color: G.textD }}>score</div></div>
      <div className="score-label">{rp + qp} / {max} points</div>
      <div className="callout callout-tip" style={{ textAlign: "left", maxWidth: "520px", margin: "0 auto 28px" }}>
        <div className="callout-title">Next Step: The Capstone</div>
        <p>Complete the capstone assignment from Section 9.3. Choose a real task, write a skill.md file that meets all structural requirements, assign and justify a governance tier, and build a quantitative test basket with objectively verifiable rubric criteria.</p>
      </div>
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
      case "version":    return <SectionVersion onNext={next} />;
      case "continuity": return <SectionContinuity onNext={next} />;
      case "capstone":   return <SectionCapstone onNext={next} />;
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
          <div className="header-badge">Level 3</div>
          <div className="header-title">Module 9 — Enterprise Deployment</div>
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
                <span>⏸</span>
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
