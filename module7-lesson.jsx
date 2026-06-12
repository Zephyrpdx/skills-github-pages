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
  .tier-card { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 20px 22px; margin: 16px 0; }
  .tier-label { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 6px; }
  .tier-title { font-family: 'Crimson Pro', serif; font-size: 20px; margin-bottom: 8px; }
  .tier-owner { font-size: 12px; color: ${G.textD}; margin-bottom: 10px; }
  .tier-detail { font-size: 14px; color: ${G.text}; line-height: 1.65; }
  .tier-detail strong { color: ${G.cream}; }
  .callout { border-radius: 6px; padding: 16px 20px; margin: 20px 0; border-left: 3px solid; }
  .callout-insight { background: ${G.navyL}; border-color: ${G.amber}; }
  .callout-warning { background: #2A1515; border-color: ${G.red}; }
  .callout-tip { background: #0F2A1D; border-color: ${G.green}; }
  .callout-title { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 6px; }
  .callout-insight .callout-title { color: ${G.amber}; }
  .callout-warning .callout-title { color: ${G.red}; }
  .callout-tip .callout-title { color: ${G.green}; }
  .callout p { font-size: 14px; line-height: 1.65; color: ${G.text}; }
  .promotion-step { display: flex; gap: 14px; margin: 12px 0; align-items: flex-start; }
  .promo-num { font-family: 'Crimson Pro', serif; font-size: 24px; color: ${G.amber}; line-height: 1; min-width: 28px; padding-top: 2px; }
  .promo-content strong { color: ${G.cream}; display: block; font-size: 14px; margin-bottom: 2px; }
  .promo-content span { font-size: 13px; color: ${G.textD}; line-height: 1.6; }
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

const PREDICTION_SYSTEM = `You are a learning coach for the Agent-Readable Skills Infrastructure curriculum. The student is about to read Module 7: Governance Tiers. Return ONLY a JSON object: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "2-3 sentences. Correct = understands skills need different ownership/access levels at different organizational scales. Partial = vaguely on topic. Incorrect = off-base. Tone: warm, forward-looking." }`;

const RECALL_SYSTEM = `You are assessing a student's recall for Module 7: "Governance Tiers" (three-tier hierarchy: Tier 1 org/IT, Tier 2 team/domain, Tier 3 personal). Key concepts: who owns each tier, Tier 2 must be authored by domain experts not IT, Tier 3 continuity risk, tier promotion process. Return ONLY: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "2-4 precise sentences." }`;

const QUIZ_SYSTEM = `You are an expert instructor explaining a quiz answer for Module 7: Governance Tiers. Student answer was {{CORRECT_OR_NOT}}. Return ONLY: { "message": "2-3 sentences explaining why the correct answer is right and, if wrong, why their choice was incorrect." }`;

const SUMMARY_SYSTEM = `You are assessing a student's summary of Module 7: "Governance Tiers." Complete answer covers: (1) the three tiers and who owns each; (2) why Tier 2 must be authored by domain experts not IT; (3) Tier 3 continuity risk and how to mitigate it. Return ONLY: { "grade": "correct"|"partial"|"incorrect", "label": "2-4 word verdict", "message": "3-4 precise sentences." }`;

function shuffleOptions(opts) { return [...opts].sort(() => Math.random() - 0.5); }

const moduleN = 7;

const SECTIONS = [
  { id: "prediction",  label: "Pre-Lesson Prediction",       type: "prediction" },
  { id: "intro",       label: "Introduction",                type: "content"    },
  { id: "why",         label: "7.1 Why Governance Matters",  type: "content"    },
  { id: "tiers",       label: "7.2 The Three Tiers",         type: "content"    },
  { id: "tier3-risk",  label: "7.3 Tier 3 Continuity Risk",  type: "content"    },
  { id: "promotion",   label: "7.4 Tier Promotion",          type: "content"    },
  { id: "recall",      label: "Recall Check",                type: "recall"     },
  { id: "quiz",        label: "Mini-Quiz",                   type: "quiz"       },
  { id: "summary",     label: "Written Summary",             type: "summary"    },
  { id: "complete",    label: "Module Complete",             type: "complete"   },
];

const RECALL_QUESTIONS = [
  {
    id: "r1",
    prompt: "Name the three governance tiers. For each one, identify who owns it and give one example of a skill that belongs there.",
    rubric: "Tier 1 (Enterprise/IT): org-wide skills — brand voice profiles, regulatory compliance parameters, M365 template schemas, data classification rules. Tier 2 (Business-Unit Teams / Senior Practitioners): domain methodology — deal analysis frameworks, security audit methodologies, sales qualification criteria. Tier 3 (Individual Contributors): personal workflow — custom report templates, individual research workflows, personal formatting preferences.",
  },
  {
    id: "r2",
    prompt: "Why can't an IT administrator author a Tier 2 methodology skill? What specifically goes wrong?",
    rubric: "Tier 2 skills encode institutional methodology — the 'how we do things here' knowledge that exists in practitioners' heads. An IT administrator writing a due-diligence skill without M&A domain expertise produces a technically valid skill file (correct syntax, proper structure) but operationally useless content — the reasoning framework won't capture the actual decision criteria the team uses. The fix: Tier 2 skills must be authored or heavily reviewed by senior practitioners in the relevant domain.",
  },
  {
    id: "r3",
    prompt: "Describe the tier promotion process in your own words. Why is quarterly review an important part of it?",
    rubric: "Tier promotion: (1) Team lead identifies a Tier 3 skill with shared value during quarterly review. (2) The skill is generalized — personal idiosyncrasies removed, edge cases that only apply to one person's workflow removed. (3) The domain expert who used the skill validates the generalized version for correctness. (4) The skill moves to the team repository under Tier 2 governance controls. Quarterly review matters because Tier 3 skills accumulate over time and their promotion potential isn't visible until someone looks systematically.",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "Your company's M&A team has a proprietary deal analysis framework built up over 15 years of transactions. An IT administrator offers to encode this into a skill during their next sprint. What tier should this skill be, and what is the critical risk?",
    options: [
      { text: "Tier 1; the risk is that it will be changed too frequently without proper version control.", correct: false },
      { text: "Tier 2; the risk is that the IT administrator lacks the domain expertise to correctly encode the methodology.", correct: true },
      { text: "Tier 3; the risk is that only the individual practitioners will have access to it.", correct: false },
      { text: "Tier 2; the risk is that the skill will be too long and exceed the 150-line limit.", correct: false },
    ],
    explanation: "This is a textbook Tier 2 skill — it encodes institutional methodology owned by a business unit. The critical risk: an IT administrator does not possess M&A domain expertise. They may produce a syntactically correct skill that captures none of the actual deal-evaluation criteria that make the framework valuable. Tier 2 skills must be authored or heavily reviewed by the practitioners who hold the underlying knowledge.",
  },
  {
    id: "q2",
    text: "An individual contributor builds a sophisticated research workflow skill over 6 months. It's stored only in a folder on their local machine. They accept a position at another company. What risk does this represent?",
    options: [
      { text: "A Tier 1 security failure — personal skills shouldn't exist without IT oversight.", correct: false },
      { text: "A Tier 3 continuity failure — the skill leaves with the employee because it was never committed to a version-controlled repository.", correct: true },
      { text: "An output drift risk — without the original author, the skill will produce inconsistent results.", correct: false },
      { text: "A licensing risk — individually-authored skills may have unclear IP ownership.", correct: false },
    ],
    explanation: "This is the canonical Tier 3 continuity failure. The skill represents months of productivity optimization — essentially a piece of organizational intellectual property. When it lives only on a local machine and the employee leaves, the organization loses it permanently. Mitigation: enforce a policy that all skills must be committed to a version-controlled team repository, enforced via offboarding checklist.",
  },
  {
    id: "q3",
    text: "Which of the following is a Tier 1 skill rather than a Tier 2 skill?",
    options: [
      { text: "A securities firm's proprietary equity valuation methodology.", correct: false },
      { text: "A consulting firm's client deliverable formatting standard (letterhead, font, color palette).", correct: true },
      { text: "A sales team's qualification criteria for enterprise prospects.", correct: false },
      { text: "An engineering team's security audit checklist for code review.", correct: false },
    ],
    explanation: "Formatting standards — letterhead, fonts, color palettes — are universally applicable organizational parameters that don't require domain expertise to author or use. They belong in Tier 1 under enterprise administrator control. The other three examples encode domain-specific methodology that only practitioners in those fields can correctly author — they belong in Tier 2.",
  },
  {
    id: "q4",
    text: "A team lead does a quarterly review and finds that three different individual contributors have independently built very similar research workflow skills. The correct governance action is:",
    options: [
      { text: "Delete the duplicates and keep the most recently updated version.", correct: false },
      { text: "Initiate tier promotion: identify the best elements of each, generalize into one skill, have the domain experts validate it, and promote it to the team Tier 2 repository.", correct: true },
      { text: "Leave the duplicates in place — individual contributors should be allowed to maintain their own personal variations.", correct: false },
      { text: "Move all three to Tier 1 so IT can manage the duplication centrally.", correct: false },
    ],
    explanation: "Three similar skills in Tier 3 is the signal that a shared pattern has been independently discovered — the highest-value tier promotion trigger. The correct response is to generalize (merge the best elements), validate with the practitioners who built them, and promote to Tier 2. This captures the shared pattern as organizational IP without losing the individual insights that drove the independent creation.",
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
      <div className="sec-sub">Module 7 — Governance Tiers</div>
      <div className="prose">When hundreds of people in an organization all have the ability to create and modify skills, what problems emerge? Before reading, write one sentence about a governance challenge you'd anticipate.</div>
      <div className="recall-box">
        <div className="recall-label">Your Prediction</div>
        <textarea className="recall-input" placeholder="Write one sentence…" value={text} onChange={e => setText(e.target.value)} disabled={!!result} />
        {!result && <button className={`btn btn-primary ${(!text.trim() || loading) ? "btn-disabled" : ""}`} style={{ marginTop: "12px" }} onClick={submit} disabled={!text.trim() || loading}>{loading ? "Assessing…" : "Submit Prediction"}</button>}
        {loading && <div className="feedback-box feedback-loading"><Spinner /><span style={{ color: G.textD }}>Getting feedback…</span></div>}
        <FeedbackBox result={result} />
      </div>
      {result && <button className="btn btn-next" style={{ marginTop: "20px" }} onClick={onNext}>Start Module 7 →</button>}
    </div>
  );
}

function SectionIntro({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Module 7 · Level 3 — Advanced</div>
      <div className="sec-title">Governance Tiers</div>
      <div className="sec-sub">Ownership, access control, and continuity for skills at organizational scale</div>
      <div className="prose">Level 3 assumes you can build, compose, and debug skills. The advanced challenge is different: <strong>how do you manage hundreds of skills across hundreds of contributors without losing control, quality, or continuity?</strong></div>
      <div className="prose">The answer is a three-tier governance hierarchy that answers one question for every skill: who owns it, who can change it, and where does it live?</div>
      <div className="callout callout-insight">
        <div className="callout-title">What You'll Learn</div>
        <p>Why governance matters at scale · The three-tier hierarchy (Tier 1: Org, Tier 2: Team, Tier 3: Personal) · Critical limitations of each tier · Tier 3 continuity risk · The tier promotion process</p>
      </div>
      <ul className="content-list">
        <li><strong>Estimated time:</strong> 40 minutes (1–2 Pomodoro sessions)</li>
        <li><strong>Prerequisites:</strong> Modules 1–6 (Levels 1 & 2 complete)</li>
      </ul>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Begin →</button>
    </div>
  );
}

function SectionWhy({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 7.1</div>
      <div className="sec-title">Why Governance Matters</div>
      <div className="prose">A single skills repository shared across a 500-person organization without governance is a liability. Without structure:</div>
      <ul className="content-list">
        <li>Skills conflict — two teams author competing versions of the same skill with different output schemas</li>
        <li>Skills override each other — a Tier 3 personal skill accidentally shadows an enterprise-wide Tier 1 skill</li>
        <li>Skills go stale — no one is responsible for keeping them current after the original author leaves</li>
        <li>Skills become single points of failure — critical methodology encoded by one person with no successor knowledge</li>
      </ul>
      <div className="callout callout-insight">
        <div className="callout-title">The Governance Question</div>
        <p>For every skill in your organization, governance answers: <strong>who owns it, who can change it, and where does it live?</strong> Without answers to all three, you don't have governance — you have a shared folder with aspirations.</p>
      </div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: The Three Tiers →</button>
    </div>
  );
}

function SectionTiers({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 7.2</div>
      <div className="sec-title">The Three Tiers</div>

      <div className="tier-card" style={{ borderLeft: `3px solid ${G.red}` }}>
        <div className="tier-label" style={{ color: G.red }}>Tier 1 — Standard Organizational Skills</div>
        <div className="tier-title" style={{ color: G.cream }}>Enterprise Administrator Owned</div>
        <div className="tier-owner">Examples: Brand voice profiles · Regulatory compliance parameters · M365 template schemas · Data classification rules</div>
        <div className="tier-detail">Universally applicable. Managed centrally with formal change control. Versioned with mandatory regression testing before deployment. <strong>Least frequently updated — stability is paramount.</strong><br/><br/><strong>Critical limitation:</strong> Tier 1 skills cannot capture institutional methodology. They can enforce company letterhead. They cannot encode the specific due-diligence framework your M&A team uses. That knowledge lives in Tier 2.</div>
      </div>

      <div className="tier-card" style={{ borderLeft: `3px solid ${G.amber}` }}>
        <div className="tier-label" style={{ color: G.amber }}>Tier 2 — Team Methodology Skills</div>
        <div className="tier-title" style={{ color: G.cream }}>Business-Unit Team Owned (Senior Practitioners)</div>
        <div className="tier-owner">Examples: Domain-specific technical review frameworks · Deal analysis protocols · Security audit methodologies · Sales qualification criteria</div>
        <div className="tier-detail">High institutional value — encodes "how we do things here" knowledge. <strong>Must be authored or heavily reviewed by senior practitioners, not IT administrators.</strong><br/><br/><strong>Critical limitation:</strong> Tier 2 skills cannot be engineered top-down by IT. An enterprise administrator writing a due-diligence skill without M&A domain expertise produces a technically valid but operationally useless skill. <em>This is the most strategically valuable tier — losing these skills means losing institutional alpha.</em></div>
      </div>

      <div className="tier-card" style={{ borderLeft: `3px solid ${G.green}` }}>
        <div className="tier-label" style={{ color: G.green }}>Tier 3 — Personal Workflow Skills</div>
        <div className="tier-title" style={{ color: G.cream }}>Individual Contributor Owned</div>
        <div className="tier-owner">Examples: Personal formatting preferences · Individual research workflows · Custom report templates · Shortcuts for repetitive tasks</div>
        <div className="tier-detail">Edge productivity automations tailored to individual work styles. Fastest to create and most rapidly iterated.<br/><br/><strong>Critical failure mode:</strong> When the skill lives only on one person's laptop and they leave the organization, the skill — and all the productivity it enabled — leaves with them.</div>
      </div>

      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Tier 3 Continuity Risk →</button>
    </div>
  );
}

function SectionTier3Risk({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 7.3</div>
      <div className="sec-title">Tier 3 Continuity Risk</div>
      <div className="prose">Tier 3 skills are the most valuable per-person and the most organizationally invisible. They're built rapidly, iterated privately, and almost never committed to shared repositories. This creates a specific risk pattern:</div>
      <div className="callout callout-warning">
        <div className="callout-title">The Departure Problem</div>
        <p>A skilled individual contributor has automated 40% of their daily workflow through six Tier 3 skills built up over two years. They accept a position at another company. Their replacement starts from scratch — not because institutional knowledge wasn't transferable, but because no mechanism existed to capture it. The skills lived in a folder on the departing employee's laptop.</p>
      </div>
      <div className="prose"><strong>Mitigation strategy:</strong> Policy mandate that all skills — including Tier 3 personal skills — must be committed to a version-controlled team repository. This is enforced through the offboarding checklist: before a departing employee's access is terminated, confirm all skills have been committed.</div>
      <div className="callout callout-tip">
        <div className="callout-title">The Flywheel Effect</div>
        <p>Organizations that consistently enforce version control for Tier 3 skills accumulate a growing inventory of individual workflows. Over time, quarterly review of this inventory reveals tier promotion candidates — personal skills that have shared value and belong in Tier 2. The version control policy is not just a loss-prevention measure; it's the feedstock for the tier promotion process.</p>
      </div>
      <button className="btn btn-next" style={{ marginTop: "24px" }} onClick={onNext}>Next: Tier Promotion →</button>
    </div>
  );
}

function SectionPromotion({ onNext }) {
  return (
    <div>
      <div className="sec-eyebrow">Section 7.4</div>
      <div className="sec-title">Tier Promotion</div>
      <div className="sec-sub">When personal skills become organizational assets</div>
      <div className="prose">Tier promotion is the process of elevating a Tier 3 personal skill to Tier 2 team ownership. It is one of the highest-value governance activities because it converts individual productivity insight into durable institutional knowledge.</div>
      <div style={{ margin: "24px 0" }}>
        {[
          { n: "1", t: "Identify", d: "Team leads review Tier 3 skills quarterly for patterns that indicate shared value — similar skills built independently, or skills addressing problems the whole team faces." },
          { n: "2", t: "Generalize", d: "The skill is rewritten to remove personal idiosyncrasies and edge cases specific to one person's workflow. The output schema is made consistent with adjacent team skills." },
          { n: "3", t: "Validate", d: "The domain expert who used the skill reviews the generalized version for correctness. This step is mandatory — only the practitioner can verify that the generalized version preserves the original's operational value." },
          { n: "4", t: "Promote", d: "The skill moves to the team repository under Tier 2 governance controls: version history, change-control process, and designated ownership." },
        ].map(s => (
          <div key={s.n} className="promotion-step">
            <div className="promo-num">{s.n}</div>
            <div className="promo-content"><strong>{s.t}</strong><span>{s.d}</span></div>
          </div>
        ))}
      </div>
      <div className="callout callout-insight">
        <div className="callout-title">The Three-Similar-Skills Signal</div>
        <p>When three or more individual contributors have independently built variations of the same skill, this is the strongest possible signal that tier promotion is warranted. Independent invention confirms genuine shared value — no one was told to build it, they all needed it. Generalize and promote.</p>
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
      <div className="prose">In 3–5 sentences: describe the three tiers, explain why Tier 2 requires domain-expert authorship, and explain the Tier 3 continuity risk.</div>
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
  const rec = pct >= 80 ? "Strong performance. Advance to Module 8: Quantitative Testing."
    : pct >= 55 ? "Review the Tier 2 authorship requirement and Tier 3 continuity risk sections before advancing."
    : "Re-read Module 7, focusing on the three tiers, their ownership structures, and the promotion process.";
  useEffect(() => { storageSet(`engagement:module${moduleN}:sessions`, [{ completed: true, score: pct, startTime: Date.now() }]); }, []);
  return (
    <div style={{ textAlign: "center", paddingTop: "32px" }}>
      <div className="sec-eyebrow" style={{ textAlign: "center" }}>Module Complete</div>
      <div className="sec-title" style={{ textAlign: "center", marginBottom: "4px" }}>Module 7 Finished</div>
      <div className="sec-sub" style={{ textAlign: "center", marginBottom: "32px" }}>Governance Tiers</div>
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
      case "why":        return <SectionWhy onNext={next} />;
      case "tiers":      return <SectionTiers onNext={next} />;
      case "tier3-risk": return <SectionTier3Risk onNext={next} />;
      case "promotion":  return <SectionPromotion onNext={next} />;
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
          <div className="header-title">Module 7 — Governance Tiers</div>
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
