import { useState, useEffect } from "react";

const G = {
  navy:   "#0F1B2D", navyM:  "#162236", navyL:  "#1D2E45",
  slate:  "#2A3F5C", muted:  "#4A6080", border: "#2E4060",
  amber:  "#E8A835", amberL: "#F5C055",
  cream:  "#F5F0E8", creamD: "#E8E0D0",
  text:   "#D8CFC0", textD:  "#A09888",
  red:    "#C44040", green:  "#3A9E6E",
  white:  "#FFFFFF", code:   "#0D2030",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${G.navy}; color: ${G.text}; font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; }

  .shell { display: flex; flex-direction: column; min-height: 100vh; background: ${G.navy}; }

  .hdr {
    background: ${G.navyM}; border-bottom: 1px solid ${G.border};
    display: flex; align-items: center; padding: 0 24px; gap: 16px;
    height: 56px; flex-shrink: 0; position: sticky; top: 0; z-index: 10;
  }
  .hdr-badge { background: ${G.amber}; color: ${G.navy}; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; }
  .hdr-title { font-family: 'Crimson Pro', serif; font-size: 18px; color: ${G.cream}; flex: 1; }
  .hdr-mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${G.textD}; }

  .main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 48px 24px 80px; }
  .content { width: 100%; max-width: 600px; }

  .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: ${G.amber}; margin-bottom: 10px; }
  .page-title { font-family: 'Crimson Pro', serif; font-size: 36px; font-weight: 600; color: ${G.cream}; margin-bottom: 6px; line-height: 1.2; }
  .page-sub { font-family: 'Crimson Pro', serif; font-size: 19px; color: ${G.textD}; margin-bottom: 32px; }

  .sec-label { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: ${G.amber}; margin-bottom: 14px; }

  .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 32px; }
  .stat-card { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 18px; }
  .stat-n { font-family: 'Crimson Pro', serif; font-size: 40px; line-height: 1; margin-bottom: 4px; }
  .stat-l { font-size: 11px; color: ${G.textD}; text-transform: uppercase; letter-spacing: .1em; }

  .lbox-row { display: flex; gap: 8px; margin-bottom: 10px; }
  .lbox { flex: 1; background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 14px 10px; text-align: center; transition: border-color .2s, background .2s; }
  .lbox-due { border-color: ${G.amber}60; background: ${G.amber}08; }
  .lbox-n { font-family: 'Crimson Pro', serif; font-size: 28px; line-height: 1; }
  .lbox-l { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; margin-top: 4px; }
  .lbox-d { font-size: 9px; font-weight: 600; letter-spacing: .06em; margin-top: 4px; }
  .lbox-legend { font-size: 11px; color: ${G.muted}; margin-bottom: 32px; line-height: 1.7; }

  .callout { border-radius: 6px; padding: 14px 18px; margin: 20px 0; border-left: 3px solid; }
  .callout-amber { background: ${G.navyL}; border-color: ${G.amber}; }
  .callout-green { background: #0F2A1D; border-color: ${G.green}; }
  .callout-red   { background: #2A1515; border-color: ${G.red}; }
  .callout-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 5px; }
  .callout-amber .callout-label { color: ${G.amber}; }
  .callout-green .callout-label { color: ${G.green}; }
  .callout-red   .callout-label { color: ${G.red}; }
  .callout p { font-size: 13px; line-height: 1.65; margin: 0; }

  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; letter-spacing: .02em; }
  .btn:disabled { opacity: .4; cursor: not-allowed; }
  .btn-primary  { background: ${G.amber}; color: ${G.navy}; }
  .btn-primary:hover { background: ${G.amberL}; }
  .btn-ghost    { background: transparent; color: ${G.textD}; border: 1px solid ${G.border}; }
  .btn-ghost:hover { border-color: ${G.amber}60; color: ${G.text}; }
  .btn-next     { background: ${G.navyL}; color: ${G.amber}; border: 1px solid ${G.amber}40; }
  .btn-next:hover { background: ${G.amber}18; border-color: ${G.amber}; }

  .prog-wrap { margin-bottom: 28px; }
  .prog-info { display: flex; justify-content: space-between; font-size: 12px; color: ${G.textD}; margin-bottom: 8px; }
  .prog-track { height: 3px; background: ${G.slate}; border-radius: 2px; overflow: hidden; }
  .prog-fill { height: 100%; background: linear-gradient(90deg, ${G.amber}, ${G.amberL}); transition: width .4s ease; border-radius: 2px; }

  .card {
    background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 10px;
    padding: 44px 40px 36px; margin-bottom: 20px; text-align: center;
    min-height: 280px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; transition: border-color .3s;
  }
  .card.card-revealed { border-color: ${G.amber}30; }
  .card-badge { display: inline-block; background: ${G.amber}18; border: 1px solid ${G.amber}40; color: ${G.amber}; font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; padding: 3px 10px; border-radius: 4px; margin-bottom: 24px; }
  .card-term { font-family: 'Crimson Pro', serif; font-size: 38px; font-weight: 600; color: ${G.cream}; line-height: 1.15; }
  .card-hint { font-size: 11px; color: ${G.muted}; text-transform: uppercase; letter-spacing: .1em; margin-top: 14px; }
  .card-divider { width: 48px; height: 1px; background: ${G.border}; margin: 22px auto; }
  .card-def { font-family: 'Crimson Pro', serif; font-size: 20px; color: ${G.text}; line-height: 1.55; animation: fadeUp .3s ease; }
  .card-note { font-size: 11px; color: ${G.muted}; text-transform: uppercase; letter-spacing: .08em; margin-top: 14px; animation: fadeUp .3s ease .05s both; }

  .reveal-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: ${G.navy}; border: 1px solid ${G.border}; border-radius: 6px; color: ${G.textD}; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; margin-top: 24px; transition: all .15s; }
  .reveal-btn:hover { border-color: ${G.amber}60; color: ${G.cream}; }

  .grade-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 20px; animation: fadeUp .25s ease; }
  .grade-btn { padding: 14px 8px; border-radius: 8px; background: transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; text-align: center; transition: all .15s; line-height: 1.3; }
  .grade-btn-label { display: block; font-size: 13px; font-weight: 600; }
  .grade-btn-sub   { display: block; font-size: 10px; font-weight: 400; margin-top: 3px; opacity: .6; }
  .grade-miss   { border: 1px solid ${G.red}50;   color: ${G.red}; }
  .grade-miss:hover   { background: ${G.red}12;   border-color: ${G.red}; }
  .grade-almost { border: 1px solid ${G.amber}50; color: ${G.amber}; }
  .grade-almost:hover { background: ${G.amber}12; border-color: ${G.amber}; }
  .grade-know   { border: 1px solid ${G.green}50; color: ${G.green}; }
  .grade-know:hover   { background: ${G.green}12; border-color: ${G.green}; }

  .back-link { font-size: 12px; color: ${G.muted}; cursor: pointer; text-decoration: underline; margin-top: 10px; display: inline-block; transition: color .15s; }
  .back-link:hover { color: ${G.textD}; }

  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0 32px; }
  .sum-card { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 18px; text-align: center; }
  .sum-n { font-family: 'Crimson Pro', serif; font-size: 40px; line-height: 1; margin-bottom: 4px; }
  .sum-l { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; }

  .result-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid ${G.border}20; font-size: 14px; }
  .result-row:last-child { border-bottom: none; }
  .result-term { font-family: 'Crimson Pro', serif; font-size: 16px; color: ${G.cream}; flex: 1; min-width: 0; }
  .result-badge { flex-shrink: 0; font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; }
  .result-move { flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; }

  .load-screen { display: flex; align-items: center; justify-content: center; height: 60vh; gap: 12px; }
  .spinner { width: 20px; height: 20px; border: 2px solid ${G.border}; border-top-color: ${G.amber}; border-radius: 50%; animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.slate}; border-radius: 3px; }
`;

// ── Card data ────────────────────────────────────────────────────────────────
const FC_CARDS = [
  {
    id: "fc-m1-01", module: 1, term: "skill.markdown",
    def: "A structured markdown file in a dedicated directory providing a deterministic, version-controlled behavioral contract for an LLM to execute.",
    note: "M1 · Core concept",
  },
  {
    id: "fc-m1-02", module: 1, term: "Routing Description",
    def: "The single-line frontmatter field an LLM gateway uses to match user intent to a skill. Must contain concrete trigger phrases and output shape.",
    note: "M1 · Skill anatomy",
  },
  {
    id: "fc-m1-03", module: 1, term: "Routing Failure",
    def: "Occurs when the model fails to invoke a skill despite a matching query — typically caused by a vague or multi-line description.",
    note: "M1 · Failure modes",
  },
  {
    id: "fc-m1-04", module: 1, term: "Reasoning Framework",
    def: "Declarative decision principles in the skill body that allow the model to generalize to unanticipated situations.",
    note: "M1 · Skill anatomy",
  },
  {
    id: "fc-m1-05", module: 1, term: "Deterministic Output Spec",
    def: "An explicit schema defining exact output structure — columns, fields, row counts — that downstream agents can parse reliably.",
    note: "M1 · Skill anatomy",
  },
  {
    id: "fc-m1-06", module: 1, term: "Edge Case Documentation",
    def: "Explicit instructions for constraint failure states replacing the model's default hallucinated behavior with defined policy.",
    note: "M1 · Skill anatomy",
  },
  {
    id: "fc-m1-07", module: 1, term: "Pattern-Matching Exemplar",
    def: "Static example output stored in the skill directory providing few-shot performance anchoring.",
    note: "M1 · Skill anatomy",
  },
  {
    id: "fc-m1-08", module: 1, term: "Contextual Economy",
    def: "The discipline of keeping skill files under 150 lines to prevent context window overrun in production gateways.",
    note: "M1 · Constraints",
  },
  {
    id: "fc-m1-09", module: 1, term: "150-Line Constraint",
    def: "Maximum recommended skill file length, enforced to maintain context efficiency and design discipline.",
    note: "M1 · Constraints",
  },
  {
    id: "fc-m1-10", module: 1, term: "Brittle Prompt",
    def: "A conversational, ad-hoc prompt lacking a deterministic contract — behaves inconsistently and cannot be reliably versioned or tested.",
    note: "M1 · Core concept",
  },
];

// ── Constants ────────────────────────────────────────────────────────────────
const BOX_DAYS = { 1: 0, 2: 2, 3: 4, 4: 7, 5: 14 };

const K = {
  flashcard: (id) => `engagement:flashcard:${id}`,
  sessions:  "engagement:sessions",
};

// ── Storage helpers ──────────────────────────────────────────────────────────
const sget = async (key) => {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
};
const sset = async (key, val) => {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
};

// ── Utilities ────────────────────────────────────────────────────────────────
const daysSince = (ts) => ts ? (Date.now() - ts) / 86400000 : 999;
const isDue     = (fc) => !fc || daysSince(fc.lastReviewed) >= (BOX_DAYS[fc.box || 1] ?? 0);
const shuffle   = (arr) => [...arr].sort(() => Math.random() - 0.5);

function nextDueIn(fc) {
  if (!fc) return 0;
  const box = fc.box || 1;
  const interval = BOX_DAYS[box] ?? 0;
  const elapsed  = daysSince(fc.lastReviewed);
  const remaining = interval - elapsed;
  return remaining > 0 ? Math.ceil(remaining) : 0;
}

// ── Sub-components ───────────────────────────────────────────────────────────
function Spinner() {
  return <div className="spinner" />;
}

function StatCard({ n, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-n" style={{ color: color || G.cream }}>{n}</div>
      <div className="stat-l">{label}</div>
    </div>
  );
}

function LeitnerBoxes({ cardData }) {
  const boxCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const boxDue    = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const card of FC_CARDS) {
    const fc  = cardData[card.id];
    const box = fc?.box || 1;
    boxCounts[box]++;
    if (isDue(fc)) boxDue[box]++;
  }

  return (
    <>
      <div className="lbox-row">
        {[1, 2, 3, 4, 5].map(box => {
          const cnt = boxCounts[box];
          const due = boxDue[box];
          return (
            <div key={box} className={`lbox ${due > 0 ? "lbox-due" : ""}`}>
              <div className="lbox-n" style={{ color: due > 0 ? G.amber : cnt > 0 ? G.cream : G.muted }}>
                {cnt}
              </div>
              <div className="lbox-l" style={{ color: due > 0 ? G.amber : G.textD }}>
                Box {box}
              </div>
              {due > 0 && (
                <div className="lbox-d" style={{ color: G.amber }}>{due} due</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="lbox-legend">
        Box 1 · every session &nbsp;·&nbsp; Box 2 · 2 days &nbsp;·&nbsp;
        Box 3 · 4 days &nbsp;·&nbsp; Box 4 · 7 days &nbsp;·&nbsp; Box 5 · 14 days
      </div>
    </>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase,        setPhase]        = useState("loading");
  const [cardData,     setCardData]     = useState({});
  const [sessionCards, setSessionCards] = useState([]);
  const [cardIdx,      setCardIdx]      = useState(0);
  const [revealed,     setRevealed]     = useState(false);
  const [results,      setResults]      = useState([]);
  const [sessionStart, setSessionStart] = useState(null);

  useEffect(() => { loadCards(); }, []);

  const loadCards = async () => {
    setPhase("loading");
    const data = {};
    for (const card of FC_CARDS) {
      const fc = await sget(K.flashcard(card.id));
      data[card.id] = fc || null;
    }
    setCardData(data);
    setPhase("home");
  };

  const dueCards = FC_CARDS.filter(c => isDue(cardData[c.id]));

  const startSession = (cards) => {
    setSessionStart(Date.now());
    setSessionCards(shuffle(cards));
    setCardIdx(0);
    setRevealed(false);
    setResults([]);
    setPhase("session");
  };

  const gradeCard = async (grade) => {
    const card       = sessionCards[cardIdx];
    const current    = cardData[card.id];
    const currentBox = current?.box || 1;

    const newBox =
      grade === "know"  ? Math.min(5, currentBox + 1) :
      grade === "almost" ? currentBox :
      Math.max(1, currentBox - 1);

    const updated = { box: newBox, lastReviewed: Date.now() };
    await sset(K.flashcard(card.id), updated);
    setCardData(prev => ({ ...prev, [card.id]: updated }));

    const newResults = [
      ...results,
      { id: card.id, term: card.term, grade, fromBox: currentBox, toBox: newBox },
    ];
    setResults(newResults);

    if (cardIdx + 1 >= sessionCards.length) {
      await writeSession(newResults);
      setPhase("summary");
    } else {
      setCardIdx(cardIdx + 1);
      setRevealed(false);
    }
  };

  const writeSession = async (finalResults) => {
    const sessions = (await sget(K.sessions)) || [];
    const correct  = finalResults.filter(r => r.grade === "know").length;
    const almost   = finalResults.filter(r => r.grade === "almost").length;
    sessions.push({
      id:            Date.now(),
      start:         sessionStart,
      end:           Date.now(),
      moduleId:      null,
      type:          "flashcards",
      cardsReviewed: finalResults.length,
      cardsCorrect:  correct,
      cardsAlmost:   almost,
      recallCorrect: correct,
      quizCorrect:   0,
    });
    await sset(K.sessions, sessions);
  };

  // ── Phase: home ────────────────────────────────────────────────────────────
  const renderHome = () => {
    const mastered = FC_CARDS.filter(c => cardData[c.id]?.box === 5).length;

    return (
      <div className="content">
        <div className="eyebrow">Phase 1 · Module 1</div>
        <div className="page-title">Flashcard Review</div>
        <div className="page-sub">10 cards · Leitner spaced repetition</div>

        <div className="stat-row">
          <StatCard
            n={dueCards.length}
            label="Cards due"
            color={dueCards.length > 0 ? G.amber : G.green}
          />
          <StatCard n={FC_CARDS.length} label="Total cards" />
          <StatCard
            n={mastered}
            label="Box 5 / mastered"
            color={mastered > 0 ? G.green : G.muted}
          />
        </div>

        <div className="sec-label">Leitner box distribution</div>
        <LeitnerBoxes cardData={cardData} />

        {dueCards.length > 0 ? (
          <div className="callout callout-amber">
            <div className="callout-label">Review due</div>
            <p>
              {dueCards.length} card{dueCards.length !== 1 ? "s are" : " is"} due based on
              your Leitner schedule. Start the session below.
            </p>
          </div>
        ) : (
          <div className="callout callout-green">
            <div className="callout-label">All current</div>
            <p>
              No cards are due today. Your retention schedule is up to date.
              Use "Review All" for additional practice if desired.
            </p>
          </div>
        )}

        <div className="btn-row" style={{ marginTop: 24 }}>
          {dueCards.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={() => startSession(dueCards)}
            >
              Start Review — {dueCards.length} due
            </button>
          )}
          <button
            className="btn btn-ghost"
            onClick={() => startSession(FC_CARDS)}
          >
            Review All 10 Cards
          </button>
        </div>

        {FC_CARDS.some(c => cardData[c.id]) && (
          <div style={{ marginTop: 40 }}>
            <div className="sec-label">Card status</div>
            {FC_CARDS.map(card => {
              const fc  = cardData[card.id];
              const box = fc?.box || 1;
              const due = isDue(fc);
              const daysLeft = nextDueIn(fc);
              const boxColor = due
                ? G.amber
                : box === 5
                ? G.green
                : G.textD;
              return (
                <div
                  key={card.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "9px 0", borderBottom: `1px solid ${G.border}20`,
                    fontSize: 13,
                  }}
                >
                  <div style={{ flex: 1, fontFamily: "'Crimson Pro', serif", fontSize: 15, color: G.cream }}>
                    {card.term}
                  </div>
                  <div
                    style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: ".1em",
                      textTransform: "uppercase", padding: "3px 8px",
                      borderRadius: 4, background: boxColor + "20",
                      color: boxColor, flexShrink: 0,
                    }}
                  >
                    Box {box}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: G.muted, width: 64, textAlign: "right", flexShrink: 0 }}>
                    {due ? "due now" : daysLeft > 0 ? `${daysLeft}d` : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ── Phase: session ─────────────────────────────────────────────────────────
  const renderSession = () => {
    const card     = sessionCards[cardIdx];
    const progress = Math.round((cardIdx / sessionCards.length) * 100);

    return (
      <div className="content">
        <div className="prog-wrap">
          <div className="prog-info">
            <span>Card {cardIdx + 1} of {sessionCards.length}</span>
            <span style={{ color: G.amber }}>{progress}%</span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={`card ${revealed ? "card-revealed" : ""}`}>
          <span className="card-badge">Module {card.module}</span>
          <div className="card-term">{card.term}</div>

          {!revealed && (
            <>
              <div className="card-hint">Recall the definition before revealing</div>
              <button className="reveal-btn" onClick={() => setRevealed(true)}>
                Reveal definition →
              </button>
            </>
          )}

          {revealed && (
            <>
              <div className="card-divider" />
              <div className="card-def">{card.def}</div>
              <div className="card-note">{card.note}</div>
            </>
          )}
        </div>

        {revealed && (
          <div className="grade-row">
            <button className="grade-btn grade-miss" onClick={() => gradeCard("miss")}>
              <span className="grade-btn-label">Didn't Know</span>
              <span className="grade-btn-sub">Box demoted ↓</span>
            </button>
            <button className="grade-btn grade-almost" onClick={() => gradeCard("almost")}>
              <span className="grade-btn-label">Almost</span>
              <span className="grade-btn-sub">Stays in box</span>
            </button>
            <button className="grade-btn grade-know" onClick={() => gradeCard("know")}>
              <span className="grade-btn-label">Know It</span>
              <span className="grade-btn-sub">Box promoted ↑</span>
            </button>
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <span
            className="back-link"
            onClick={loadCards}
          >
            ← End session and return home
          </span>
        </div>
      </div>
    );
  };

  // ── Phase: summary ─────────────────────────────────────────────────────────
  const renderSummary = () => {
    const correct = results.filter(r => r.grade === "know").length;
    const almost  = results.filter(r => r.grade === "almost").length;
    const missed  = results.filter(r => r.grade === "miss").length;
    const pct     = results.length > 0 ? Math.round((correct / results.length) * 100) : 0;
    const titleColor = pct >= 70 ? G.green : pct >= 40 ? G.amber : G.red;

    const missedCards = results
      .filter(r => r.grade === "miss")
      .map(r => FC_CARDS.find(c => c.id === r.id))
      .filter(Boolean);

    return (
      <div className="content">
        <div className="eyebrow">Session complete</div>
        <div className="page-title" style={{ color: titleColor }}>
          {pct}% — {correct}/{results.length} known
        </div>
        <div className="page-sub" style={{ marginBottom: 8 }}>
          {results.length} card{results.length !== 1 ? "s" : ""} reviewed
        </div>

        <div className="summary-grid">
          <div className="sum-card">
            <div className="sum-n" style={{ color: G.green }}>{correct}</div>
            <div className="sum-l" style={{ color: G.green }}>Know It</div>
          </div>
          <div className="sum-card">
            <div className="sum-n" style={{ color: G.amber }}>{almost}</div>
            <div className="sum-l" style={{ color: G.amber }}>Almost</div>
          </div>
          <div className="sum-card">
            <div className="sum-n" style={{ color: G.red }}>{missed}</div>
            <div className="sum-l" style={{ color: G.red }}>Missed</div>
          </div>
        </div>

        {missed > 0 && (
          <div className="callout callout-red">
            <div className="callout-label">{missed} card{missed !== 1 ? "s" : ""} to revisit</div>
            <p>
              {missed === 1 ? "This card was" : "These cards were"} demoted one box
              and will appear in your next due session. Review the definitions
              in Module 1 before the next session.
            </p>
          </div>
        )}
        {almost > 0 && missed === 0 && (
          <div className="callout callout-amber">
            <div className="callout-label">A few near-misses</div>
            <p>
              {almost} card{almost !== 1 ? "s" : ""} stayed in {almost !== 1 ? "their" : "its"} current
              box. {almost !== 1 ? "They" : "It"} will come up again on the same interval.
              If the same card lands "Almost" twice in a row, that term needs deliberate review.
            </p>
          </div>
        )}
        {correct === results.length && results.length > 0 && (
          <div className="callout callout-green">
            <div className="callout-label">Clean sweep</div>
            <p>
              All {results.length} cards known. Each has been promoted one box.
              The spaced repetition schedule will push these further out as they consolidate.
            </p>
          </div>
        )}

        <div className="sec-label" style={{ marginTop: 32 }}>Card-by-card breakdown</div>
        <div style={{ marginBottom: 32 }}>
          {results.map((r, i) => {
            const moved      = r.toBox - r.fromBox;
            const moveLabel  = moved > 0 ? `Box ${r.fromBox} → ${r.toBox} ↑` :
                               moved < 0 ? `Box ${r.fromBox} → ${r.toBox} ↓` :
                               `Box ${r.fromBox}`;
            const moveColor  = moved > 0 ? G.green : moved < 0 ? G.red : G.muted;
            const badgeBg    = r.grade === "know"   ? G.green + "22" :
                               r.grade === "almost" ? G.amber + "22" :
                               G.red + "22";
            const badgeColor = r.grade === "know"   ? G.green :
                               r.grade === "almost" ? G.amber :
                               G.red;
            const gradeLabel = r.grade === "know"   ? "Know It" :
                               r.grade === "almost" ? "Almost" :
                               "Missed";
            return (
              <div key={i} className="result-row">
                <div className="result-term">{r.term}</div>
                <span className="result-badge" style={{ background: badgeBg, color: badgeColor }}>
                  {gradeLabel}
                </span>
                <div className="result-move" style={{ color: moveColor }}>{moveLabel}</div>
              </div>
            );
          })}
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={loadCards}>
            Back to Home
          </button>
          {missedCards.length > 0 && (
            <button
              className="btn btn-ghost"
              onClick={() => startSession(missedCards)}
            >
              Re-drill {missedCards.length} missed
            </button>
          )}
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="shell">
        <header className="hdr">
          <span className="hdr-badge">SRS</span>
          <span className="hdr-title">Flashcard System — Agent-Readable Skills</span>
          {phase === "session" && (
            <span className="hdr-mono">
              {cardIdx + 1} / {sessionCards.length}
            </span>
          )}
          {phase === "home" && (
            <button
              className="btn btn-ghost"
              style={{ padding: "6px 12px", fontSize: 12 }}
              onClick={loadCards}
            >
              ↻ Refresh
            </button>
          )}
        </header>

        <main className="main">
          {phase === "loading" && (
            <div className="load-screen">
              <Spinner />
              <span style={{ color: G.textD, fontSize: 14 }}>Loading flashcard data…</span>
            </div>
          )}
          {phase === "home"    && renderHome()}
          {phase === "session" && renderSession()}
          {phase === "summary" && renderSummary()}
        </main>
      </div>
    </>
  );
}
