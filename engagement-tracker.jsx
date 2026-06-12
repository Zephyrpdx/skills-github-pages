import { useState, useEffect } from "react";

// ── Design system — identical palette to all lesson modules ──────────────────
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
  body { background: ${G.navy}; color: ${G.text}; font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; }

  .shell { display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: ${G.navy}; }

  .hdr {
    background: ${G.navyM}; border-bottom: 1px solid ${G.border};
    display: flex; align-items: center; padding: 0 24px; gap: 16px;
    height: 56px; flex-shrink: 0;
  }
  .hdr-badge {
    background: ${G.amber}; color: ${G.navy};
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: .12em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px;
  }
  .hdr-title { font-family: 'Crimson Pro', serif; font-size: 18px; color: ${G.cream}; flex: 1; }
  .hdr-date  { font-size: 12px; color: ${G.textD}; }

  .main { flex: 1; overflow-y: auto; padding: 40px 48px 80px; max-width: 880px; }

  .sec-label {
    font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: ${G.amber}; margin-bottom: 16px;
  }

  .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 36px; }
  .stat-card { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 20px; }
  .stat-n { font-family: 'Crimson Pro', serif; font-size: 40px; line-height: 1; margin-bottom: 6px; }
  .stat-l { font-size: 11px; color: ${G.textD}; text-transform: uppercase; letter-spacing: .1em; }

  .rec-box { border-radius: 8px; padding: 20px; margin-bottom: 36px; border-left: 3px solid; }
  .rec-action { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 8px; }
  .rec-body { font-size: 14px; line-height: 1.65; }

  .mod-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 36px; }
  .mod-card {
    background: ${G.navyL}; border: 1px solid ${G.border};
    border-left: 3px solid ${G.border};
    border-radius: 8px; padding: 16px; transition: border-left-color .2s;
  }
  .mod-level { font-size: 10px; color: ${G.muted}; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 4px; }
  .mod-num   { font-family: 'Crimson Pro', serif; font-size: 28px; line-height: 1; }
  .mod-title { font-size: 12px; margin: 6px 0 10px; line-height: 1.3; }
  .mod-stat  { font-size: 11px; color: ${G.textD}; }
  .mod-pct   { font-family: 'Crimson Pro', serif; font-size: 22px; font-weight: 600; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 36px; }
  .panel { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 20px; }

  .sess-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid ${G.border}30; font-size: 13px;
  }
  .sess-row:last-child { border-bottom: none; }
  .sess-meta { color: ${G.textD}; font-size: 12px; margin-top: 1px; }
  .sess-dur  { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${G.amber}; }

  .lboxes { display: flex; gap: 8px; align-items: flex-end; margin: 12px 0; }
  .lbox {
    flex: 1; border-radius: 4px; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end; padding: 8px 4px;
    background: ${G.navy}; border: 1px solid ${G.border}; min-height: 48px;
    transition: background .2s, border-color .2s;
  }
  .lbox.occupied { background: ${G.slate}30; border-color: ${G.muted}; }
  .lbox.due      { background: ${G.amber}18; border-color: ${G.amber}80; }
  .lbox-n { font-family: 'Crimson Pro', serif; font-size: 22px; line-height: 1; }
  .lbox-l { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; margin-top: 3px; }

  .schema-box {
    background: ${G.code}; border: 1px solid ${G.border}; border-radius: 6px;
    padding: 16px 20px; margin-bottom: 36px; overflow-x: auto;
  }
  .schema-box pre {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: #8EC8F0; line-height: 1.8; white-space: pre;
  }

  .danger-zone {
    background: #2A1515; border: 1px solid ${G.red}30;
    border-radius: 8px; padding: 20px; margin-bottom: 60px;
  }
  .danger-ttl { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: ${G.red}; margin-bottom: 14px; }
  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; transition: all .15s; letter-spacing: .02em;
  }
  .btn:disabled { opacity: .45; cursor: not-allowed; }
  .btn-amber { background: ${G.amber}; color: ${G.navy}; }
  .btn-amber:hover:not(:disabled) { background: ${G.amberL}; }
  .btn-ghost { background: transparent; color: ${G.textD}; border: 1px solid ${G.border}; }
  .btn-ghost:hover:not(:disabled) { border-color: ${G.amber}60; color: ${G.text}; }
  .btn-red { background: transparent; color: ${G.red}; border: 1px solid ${G.red}40; }
  .btn-red:hover:not(:disabled) { background: ${G.red}12; }

  .empty { color: ${G.muted}; font-size: 13px; font-style: italic; line-height: 1.6; }

  .load-screen { display: flex; align-items: center; justify-content: center; height: 100vh; gap: 12px; background: ${G.navy}; }
  .spinner { width: 20px; height: 20px; border: 2px solid ${G.border}; border-top-color: ${G.amber}; border-radius: 50%; animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.slate}; border-radius: 3px; }
`;

// ══════════════════════════════════════════════════════════════════════════════
// STORAGE KEY SCHEMA — v1.0
// This is the cross-artifact contract. Every lesson module artifact (module1
// through module9) MUST use these exact key patterns when reading/writing data.
//
// HOW MODULES SHOULD WRITE:
//
//   // On recall submit:
//   await window.storage.set('engagement:module1:recall:r1',
//     JSON.stringify({ grade: 'partial', timestamp: Date.now() }));
//
//   // On quiz answer:
//   await window.storage.set('engagement:module1:quiz:q2',
//     JSON.stringify({ correct: true, timestamp: Date.now() }));
//
//   // On complete section load — append to session log:
//   const raw = await window.storage.get('engagement:sessions');
//   const sessions = raw ? JSON.parse(raw.value) : [];
//   sessions.push({ id: Date.now(), start: sessionStart, end: Date.now(),
//                   moduleId: 1, recallCorrect: 2, quizCorrect: 3 });
//   await window.storage.set('engagement:sessions', JSON.stringify(sessions));
//
//   // On complete section load — mark module done:
//   await window.storage.set('engagement:module1:completed',
//     JSON.stringify({ timestamp: Date.now(), score: 83 }));
//
//   // Flashcard system writes:
//   await window.storage.set('engagement:flashcard:fc-m1-01',
//     JSON.stringify({ box: 2, lastReviewed: Date.now() }));
// ══════════════════════════════════════════════════════════════════════════════
const K = {
  sessions:         'engagement:sessions',
  currentSession:   'engagement:session:current',
  moduleCompleted:  (n)     => `engagement:module${n}:completed`,
  moduleRecall:     (n, id) => `engagement:module${n}:recall:${id}`,
  moduleQuiz:       (n, id) => `engagement:module${n}:quiz:${id}`,
  moduleSummary:    (n)     => `engagement:module${n}:summary`,
  modulePrediction: (n)     => `engagement:module${n}:prediction`,
  flashcard:        (id)    => `engagement:flashcard:${id}`,
};

// ── Storage helpers ─────────────────────────────────────────────────────────
const sget = async (key) => {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
};
const sset = async (key, val) => {
  try { await window.storage.set(key, JSON.stringify(val)); return true; }
  catch { return false; }
};
const sdel = async (key) => { try { await window.storage.delete(key); } catch {} };

// ── Curriculum data ─────────────────────────────────────────────────────────
const MODULES = [
  { n: 1, title: "Why Skills Matter",             level: 1, built: true  },
  { n: 2, title: "Anatomy of a Skill Primitive",  level: 1, built: false },
  { n: 3, title: "Writing Your First Skill",      level: 1, built: false },
  { n: 4, title: "Agentic Contracts",             level: 2, built: false },
  { n: 5, title: "Composability & Pipelines",     level: 2, built: false },
  { n: 6, title: "Debugging Failure Modes",       level: 2, built: false },
  { n: 7, title: "Governance Tiers",              level: 3, built: false },
  { n: 8, title: "Quantitative Testing",          level: 3, built: false },
  { n: 9, title: "Enterprise Deployment",         level: 3, built: false },
];
const RECALL_IDS = ["r1", "r2", "r3"];
const QUIZ_IDS   = ["q1", "q2", "q3"];

const FC_TERMS = {
  "fc-m1-01": "skill.markdown",          "fc-m1-02": "Routing Description",
  "fc-m1-03": "Routing Failure",         "fc-m1-04": "Reasoning Framework",
  "fc-m1-05": "Deterministic Output Spec","fc-m1-06": "Edge Case Documentation",
  "fc-m1-07": "Pattern-Matching Exemplar","fc-m1-08": "Contextual Economy",
  "fc-m1-09": "150-Line Constraint",     "fc-m1-10": "Brittle Prompt",
};
const FC_IDS  = Object.keys(FC_TERMS);
const BOX_DAYS = { 1: 0, 2: 2, 3: 4, 4: 7, 5: 14 };

// ── Helpers ─────────────────────────────────────────────────────────────────
const daysSince = (ts) => ts ? (Date.now() - ts) / 86400000 : 999;
const isDue     = (fc) => !fc || daysSince(fc.lastReviewed) >= (BOX_DAYS[fc.box || 1] ?? 0);
const fmtDate   = (ts) =>
  ts ? new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";
const fmtDur = (ms) => {
  if (!ms || ms < 0) return "—";
  const m = Math.round(ms / 60000);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
};

function calcScore(n, recall, quiz) {
  let pts = 0;
  const max = RECALL_IDS.length * 2 + QUIZ_IDS.length * 2;
  for (const id of RECALL_IDS) {
    const r = recall[`${n}-${id}`];
    if (r?.grade === "correct") pts += 2;
    else if (r?.grade === "partial") pts += 1;
  }
  for (const id of QUIZ_IDS) {
    if (quiz[`${n}-${id}`]?.correct) pts += 2;
  }
  return Math.round((pts / max) * 100);
}

function scoreColor(pct) {
  if (pct >= 80) return G.green;
  if (pct >= 55) return G.amber;
  if (pct > 0)   return G.red;
  return G.muted;
}

// ── Data loader ──────────────────────────────────────────────────────────────
async function loadAll() {
  const recall = {}, quiz = {}, completed = {}, flashcards = {}, summaries = {};
  for (const mod of MODULES) {
    const c = await sget(K.moduleCompleted(mod.n));
    if (c) completed[mod.n] = c;
    for (const id of RECALL_IDS) {
      const r = await sget(K.moduleRecall(mod.n, id));
      if (r) recall[`${mod.n}-${id}`] = r;
    }
    for (const id of QUIZ_IDS) {
      const q = await sget(K.moduleQuiz(mod.n, id));
      if (q) quiz[`${mod.n}-${id}`] = q;
    }
    const s = await sget(K.moduleSummary(mod.n));
    if (s) summaries[mod.n] = s;
  }
  for (const id of FC_IDS) {
    const fc = await sget(K.flashcard(id));
    if (fc) flashcards[id] = fc;
  }
  const sessions = (await sget(K.sessions)) || [];
  return { recall, quiz, completed, flashcards, summaries, sessions };
}

// ── Recommendation engine ────────────────────────────────────────────────────
function recommend(data, scores) {
  const m1done   = !!data.completed[1];
  const m1score  = scores[1] || 0;
  const dueCards = FC_IDS.filter(id => isDue(data.flashcards[id])).length;
  const gap      = daysSince(data.completed[1]?.timestamp);

  if (!m1done) return {
    action: "Start Module 1",
    body: "No completed lesson detected. Open the Module 1 artifact and work through all sections end-to-end, including the recall check and quiz.",
    color: G.amber,
  };
  if (m1score < 55) return {
    action: "Re-read Module 1 — score below threshold",
    body: `Score of ${m1score}% is below the 55% floor to advance. Re-read sections 1.1–1.4 without referring to your prior answers, then redo the recall check from memory.`,
    color: G.red,
  };
  if (gap > 7) return {
    action: `Long gap — ${Math.round(gap)} days since last session`,
    body: "Before running flashcards, do a quick active recall: close all documents and write out the brittle prompt problem, the five skill subsystems, and why version control matters. Then open the flashcard system.",
    color: G.red,
  };
  if (dueCards > 0) return {
    action: `Flashcard review — ${dueCards} card${dueCards !== 1 ? "s" : ""} due`,
    body: `${dueCards} Module 1 card${dueCards !== 1 ? "s are" : " is"} due for spaced repetition. Open the flashcard system artifact. ~${Math.max(1, Math.round(dueCards * 0.5))} minute${dueCards > 2 ? "s" : ""} to complete.`,
    color: G.amber,
  };
  if (m1score >= 80) return {
    action: "On track — await Module 2",
    body: `Strong score (${m1score}%). Module 2 is not yet built. Keep flashcard reviews current. If more than 2 days pass without a review, run a brief active recall exercise before reopening the tracker.`,
    color: G.green,
  };
  return {
    action: "Strengthen Module 1 weak spots",
    body: `Score: ${m1score}%. Revisit the specific recall questions where you received partial credit and answer them again from memory before moving forward.`,
    color: G.amber,
  };
}

// ── Components ───────────────────────────────────────────────────────────────
function StatCard({ n, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-n" style={{ color: color || G.cream }}>{n}</div>
      <div className="stat-l">{label}</div>
    </div>
  );
}

function ModuleCard({ mod, score, completedData, inProgress }) {
  const color     = completedData ? scoreColor(score) : G.muted;
  const leftColor = completedData ? color : inProgress ? G.amber : G.border;
  return (
    <div className="mod-card" style={{ borderLeftColor: leftColor }}>
      <div className="mod-level">Lvl {mod.level} · M{mod.n}</div>
      <div className="mod-num" style={{ color: mod.built ? G.cream : G.muted }}>
        {mod.n < 10 ? `0${mod.n}` : mod.n}
      </div>
      <div className="mod-title" style={{ color: mod.built ? G.text : G.muted }}>
        {mod.title}
      </div>
      {completedData ? (
        <>
          <div className="mod-pct" style={{ color }}>{score}%</div>
          <div className="mod-stat">{fmtDate(completedData.timestamp)}</div>
        </>
      ) : inProgress ? (
        <div className="mod-stat" style={{ color: G.amber }}>In progress</div>
      ) : (
        <div className="mod-stat">{mod.built ? "Not started" : "Not built yet"}</div>
      )}
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [confirmReset, setConfirmReset] = useState(null);
  const [refreshKey, setRefreshKey]   = useState(0);

  useEffect(() => {
    setLoading(true);
    loadAll().then(d => { setData(d); setLoading(false); });
  }, [refreshKey]);

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="load-screen">
        <div className="spinner" />
        <span style={{ color: G.textD, fontSize: 14 }}>Loading engagement data…</span>
      </div>
    </>
  );

  // Derived values
  const scores        = Object.fromEntries(MODULES.map(m => [m.n, calcScore(m.n, data.recall, data.quiz)]));
  const completedNums = MODULES.filter(m => data.completed[m.n]).map(m => m.n);
  const bestScore     = completedNums.length > 0 ? Math.max(...completedNums.map(n => scores[n])) : null;
  const dueCards      = FC_IDS.filter(id => isDue(data.flashcards[id])).length;

  // Leitner box distribution
  const lboxCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const lboxDue   = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const id of FC_IDS) {
    const fc  = data.flashcards[id];
    const box = fc?.box || 1;
    lboxCount[box]++;
    if (isDue(fc)) lboxDue[box]++;
  }

  const rec = recommend(data, scores);

  const doReset = async (type) => {
    if (type === "all") {
      for (const mod of MODULES) {
        for (const id of RECALL_IDS) await sdel(K.moduleRecall(mod.n, id));
        for (const id of QUIZ_IDS)   await sdel(K.moduleQuiz(mod.n, id));
        await sdel(K.moduleCompleted(mod.n));
        await sdel(K.moduleSummary(mod.n));
        await sdel(K.modulePrediction(mod.n));
      }
      for (const id of FC_IDS) await sdel(K.flashcard(id));
      await sdel(K.sessions);
      await sdel(K.currentSession);
    } else if (type === "flashcards") {
      for (const id of FC_IDS) await sdel(K.flashcard(id));
    } else if (type === "sessions") {
      await sdel(K.sessions);
    }
    setConfirmReset(null);
    setRefreshKey(k => k + 1);
  };

  return (
    <>
      <style>{css}</style>
      <div className="shell">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="hdr">
          <span className="hdr-badge">Phase 1</span>
          <span className="hdr-title">Engagement & Progress Tracker</span>
          <span className="hdr-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short", month: "short", day: "numeric", year: "numeric"
            })}
          </span>
          <button className="btn btn-ghost" style={{ marginLeft: 8 }}
            onClick={() => setRefreshKey(k => k + 1)}>
            ↻ Refresh
          </button>
        </header>

        <main className="main">

          {/* ── Stats row ──────────────────────────────────────── */}
          <div className="sec-label">Overview</div>
          <div className="stat-row">
            <StatCard n={data.sessions.length} label="Sessions logged" />
            <StatCard n={completedNums.length}  label="Modules completed" />
            <StatCard
              n={bestScore !== null ? `${bestScore}%` : "—"}
              label="Best module score"
              color={bestScore !== null ? scoreColor(bestScore) : G.muted}
            />
            <StatCard
              n={`${dueCards}/10`}
              label="Flashcards due"
              color={dueCards > 0 ? G.amber : G.green}
            />
          </div>

          {/* ── Recommendation ─────────────────────────────────── */}
          <div className="sec-label">Recommended next action</div>
          <div className="rec-box" style={{ background: rec.color + "12", borderColor: rec.color }}>
            <div className="rec-action" style={{ color: rec.color }}>{rec.action}</div>
            <div className="rec-body">{rec.body}</div>
          </div>

          {/* ── Module grid ────────────────────────────────────── */}
          <div className="sec-label">Module progress — 9 modules across 3 levels</div>
          <div className="mod-grid">
            {MODULES.map(mod => {
              const hasAnyData =
                RECALL_IDS.some(id => data.recall[`${mod.n}-${id}`]) ||
                QUIZ_IDS.some(id => data.quiz[`${mod.n}-${id}`]);
              return (
                <ModuleCard
                  key={mod.n}
                  mod={mod}
                  score={scores[mod.n]}
                  completedData={data.completed[mod.n] || null}
                  inProgress={mod.built && hasAnyData && !data.completed[mod.n]}
                />
              );
            })}
          </div>

          {/* ── Sessions + Leitner ─────────────────────────────── */}
          <div className="two-col">

            {/* Sessions */}
            <div className="panel">
              <div className="sec-label" style={{ marginBottom: 14 }}>Session history</div>
              {data.sessions.length === 0 ? (
                <div className="empty">
                  No sessions logged yet. Sessions are written automatically when a module's
                  complete section loads. Finish Module 1 end-to-end to generate the first entry.
                </div>
              ) : (
                [...data.sessions].reverse().slice(0, 7).map((s, i) => (
                  <div className="sess-row" key={i}>
                    <div>
                      <div style={{ color: G.text, fontSize: 13 }}>
                        {s.moduleId ? `Module ${s.moduleId}` : "Study session"}
                        {s.recallCorrect != null && (
                          <span style={{ color: G.textD, fontSize: 11, marginLeft: 8 }}>
                            {s.recallCorrect}R · {s.quizCorrect}Q
                          </span>
                        )}
                      </div>
                      <div className="sess-meta">{fmtDate(s.start)}</div>
                    </div>
                    <div className="sess-dur">{fmtDur(s.end - s.start)}</div>
                  </div>
                ))
              )}
            </div>

            {/* Leitner boxes */}
            <div className="panel">
              <div className="sec-label" style={{ marginBottom: 14 }}>Flashcard Leitner boxes</div>
              <div className="lboxes">
                {[1, 2, 3, 4, 5].map(box => {
                  const cnt    = lboxCount[box];
                  const due    = lboxDue[box];
                  const hasDue = due > 0;
                  return (
                    <div key={box}
                      className={`lbox ${cnt > 0 ? (hasDue ? "due" : "occupied") : ""}`}
                      style={{ height: Math.max(48, 36 + cnt * 10) }}
                    >
                      <div className="lbox-n" style={{ color: hasDue ? G.amber : cnt > 0 ? G.cream : G.muted }}>
                        {cnt}
                      </div>
                      <div className="lbox-l" style={{ color: hasDue ? G.amber : G.textD }}>
                        Box {box}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 12, color: G.textD, marginTop: 8 }}>
                <span style={{ color: G.amber, marginRight: 4 }}>■</span>{dueCards} due
                <span style={{ color: G.muted, margin: "0 4px 0 12px" }}>■</span>
                {10 - dueCards} current · 10 total (Module 1)
              </div>
              <div style={{ fontSize: 12, color: G.muted, marginTop: 12, lineHeight: 1.6 }}>
                All cards start in Box 1. Correct → promoted one box. Incorrect → demoted one box.
                Box 5 = reviewed every 14 days.
              </div>
            </div>
          </div>

          {/* ── Storage key schema ─────────────────────────────── */}
          <div className="sec-label">Storage key schema — v1.0 (cross-artifact contract)</div>
          <div className="schema-box">
            <pre>{
`// Recall answer — written on each recall submission
engagement:module{n}:recall:{id}
  → { grade: "correct" | "partial" | "incorrect", timestamp: number }

// Quiz answer — written on each quiz selection
engagement:module{n}:quiz:{id}
  → { correct: boolean, timestamp: number }

// Module completion — written when complete section loads
engagement:module{n}:completed
  → { timestamp: number, score: number }

// Written summary assessment (Phase 3)
engagement:module{n}:summary
  → { grade: "correct" | "partial" | "incorrect", timestamp: number }

// Pre-lesson prediction prompt (Phase 3)
engagement:module{n}:prediction
  → { grade: "correct" | "partial" | "incorrect", timestamp: number }

// Session log — append-only array shared across all modules
engagement:sessions
  → [{ id, start, end, moduleId, recallCorrect, quizCorrect }]

// Flashcard Leitner state — written by flashcard system (Phase 2)
engagement:flashcard:{cardId}
  → { box: 1–5, lastReviewed: number }`
            }</pre>
          </div>

          {/* ── Data management ────────────────────────────────── */}
          <div className="sec-label">Data management</div>
          <div className="danger-zone">
            <div className="danger-ttl">Reset options — all destructive and irreversible</div>
            {confirmReset ? (
              <>
                <div style={{ fontSize: 13, color: G.text, marginBottom: 14 }}>
                  Confirm: permanently delete{" "}
                  <strong style={{ color: G.cream }}>
                    {confirmReset === "all"        ? "all engagement data"
                      : confirmReset === "flashcards" ? "all flashcard progress"
                      : "session history"}
                  </strong>? This cannot be undone.
                </div>
                <div className="btn-row">
                  <button className="btn btn-red"   onClick={() => doReset(confirmReset)}>Yes, delete</button>
                  <button className="btn btn-ghost" onClick={() => setConfirmReset(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <div className="btn-row">
                <button className="btn btn-red" onClick={() => setConfirmReset("sessions")}>
                  Clear sessions
                </button>
                <button className="btn btn-red" onClick={() => setConfirmReset("flashcards")}>
                  Reset flashcard boxes
                </button>
                <button className="btn btn-red" onClick={() => setConfirmReset("all")}>
                  Reset all data
                </button>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
}
