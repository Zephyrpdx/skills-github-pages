import { useState, useEffect } from 'react'

const G = {
  navy: '#0F1B2D', navyM: '#162236', navyL: '#1D2E45',
  slate: '#2A3F5C', muted: '#4A6080', border: '#2E4060',
  amber: '#E8A835', amberL: '#F5C055',
  cream: '#F5F0E8', creamD: '#E8E0D0',
  text: '#D8CFC0', textD: '#A09888',
  red: '#C44040', green: '#3A9E6E', white: '#FFFFFF',
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${G.navy}; color: ${G.text}; font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; }

  .dash-shell { display: flex; flex-direction: column; min-height: 100vh; background: ${G.navy}; }

  .dash-hdr {
    background: ${G.navyM}; border-bottom: 1px solid ${G.border};
    display: flex; align-items: center; padding: 0 28px; gap: 16px;
    height: 56px; flex-shrink: 0; position: sticky; top: 0; z-index: 10;
  }
  .dash-hdr-badge { background: ${G.amber}; color: ${G.navy}; font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; }
  .dash-hdr-title { font-family: 'Crimson Pro', serif; font-size: 18px; color: ${G.cream}; flex: 1; }
  .dash-hdr-btn { background: ${G.navyL}; border: 1px solid ${G.border}; color: ${G.textD}; font-family: 'DM Sans', sans-serif; font-size: 12px; padding: 5px 12px; border-radius: 5px; cursor: pointer; transition: color .15s, border-color .15s; }
  .dash-hdr-btn:hover { color: ${G.cream}; border-color: ${G.amber}; }

  .dash-main { flex: 1; padding: 48px 32px 80px; max-width: 1100px; margin: 0 auto; width: 100%; }

  .dash-hero { margin-bottom: 52px; }
  .dash-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: ${G.amber}; margin-bottom: 10px; }
  .dash-title { font-family: 'Crimson Pro', serif; font-size: 42px; font-weight: 300; color: ${G.cream}; line-height: 1.15; margin-bottom: 10px; }
  .dash-sub { font-family: 'Crimson Pro', serif; font-size: 20px; color: ${G.textD}; }

  .dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 48px; }
  .stat-card { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 20px 22px; }
  .stat-n { font-family: 'Crimson Pro', serif; font-size: 44px; line-height: 1; color: ${G.amber}; margin-bottom: 4px; }
  .stat-label { font-size: 12px; color: ${G.textD}; text-transform: uppercase; letter-spacing: .1em; }

  .dash-section-label { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: ${G.amber}; margin-bottom: 18px; }

  .action-card { background: ${G.navyL}; border: 1px solid ${G.amber}60; border-radius: 10px; padding: 22px 28px; margin-bottom: 40px; display: flex; align-items: center; gap: 20px; }
  .action-icon { font-size: 28px; flex-shrink: 0; }
  .action-body { flex: 1; }
  .action-title { font-family: 'Crimson Pro', serif; font-size: 20px; color: ${G.cream}; margin-bottom: 4px; }
  .action-desc { font-size: 13px; color: ${G.textD}; }
  .action-btn { background: ${G.amber}; color: ${G.navy}; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 9px 20px; border: none; border-radius: 6px; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: background .15s; }
  .action-btn:hover { background: ${G.amberL}; }

  .module-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 48px; }
  .module-card { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 10px; padding: 22px; cursor: pointer; transition: border-color .2s, transform .15s; }
  .module-card:hover { border-color: ${G.amber}80; transform: translateY(-1px); }
  .module-card.completed { border-color: ${G.green}60; }
  .module-card.locked { opacity: .5; cursor: default; }
  .mc-level { font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: ${G.muted}; margin-bottom: 8px; }
  .mc-num { font-family: 'Crimson Pro', serif; font-size: 13px; color: ${G.amber}; margin-bottom: 2px; }
  .mc-title { font-family: 'Crimson Pro', serif; font-size: 17px; color: ${G.cream}; line-height: 1.3; margin-bottom: 12px; }
  .mc-meta { font-size: 12px; color: ${G.textD}; }
  .mc-score { display: inline-block; background: ${G.navy}; border: 1px solid ${G.border}; border-radius: 4px; padding: 2px 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${G.amber}; margin-top: 8px; }
  .mc-score.passing { border-color: ${G.green}60; color: ${G.green}; }
  .mc-badge { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; padding: 2px 7px; border-radius: 3px; }
  .mc-badge.done { background: ${G.green}20; color: ${G.green}; border: 1px solid ${G.green}40; }
  .mc-badge.in-progress { background: ${G.amber}20; color: ${G.amber}; border: 1px solid ${G.amber}40; }
  .mc-badge.not-started { background: ${G.slate}; color: ${G.textD}; border: 1px solid ${G.border}; }

  .tools-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 48px; }
  .tool-card { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 10px; padding: 24px; cursor: pointer; transition: border-color .2s; display: flex; align-items: center; gap: 16px; }
  .tool-card:hover { border-color: ${G.amber}80; }
  .tool-icon { font-size: 26px; flex-shrink: 0; }
  .tool-title { font-family: 'Crimson Pro', serif; font-size: 18px; color: ${G.cream}; margin-bottom: 2px; }
  .tool-desc { font-size: 12px; color: ${G.textD}; }

  .leitner-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 48px; }
  .lbox { background: ${G.navyL}; border: 1px solid ${G.border}; border-radius: 8px; padding: 16px; text-align: center; }
  .lbox-num { font-family: 'Crimson Pro', serif; font-size: 30px; color: ${G.amber}; line-height: 1; margin-bottom: 4px; }
  .lbox-label { font-size: 11px; color: ${G.textD}; margin-bottom: 6px; }
  .lbox-freq { font-size: 10px; color: ${G.muted}; }

  @media (max-width: 800px) {
    .dash-stats { grid-template-columns: repeat(2, 1fr); }
    .module-grid { grid-template-columns: 1fr 1fr; }
    .tools-row { grid-template-columns: 1fr; }
    .leitner-row { grid-template-columns: repeat(3, 1fr); }
    .dash-main { padding: 32px 20px 60px; }
  }
  @media (max-width: 520px) {
    .module-grid { grid-template-columns: 1fr; }
    .dash-stats { grid-template-columns: repeat(2, 1fr); }
  }
`

const MODULES = [
  { id: 'm1', num: 'Module 1', title: 'Why Skills Matter: The Problem With Prompts', level: 'Level 1 — Foundations', time: '25 min' },
  { id: 'm2', num: 'Module 2', title: 'Anatomy of a Skill Primitive', level: 'Level 1 — Foundations', time: '50 min' },
  { id: 'm3', num: 'Module 3', title: 'Writing Your First Skill', level: 'Level 1 — Foundations', time: '50 min' },
  { id: 'm4', num: 'Module 4', title: 'Agentic Contracts', level: 'Level 2 — Intermediate', time: '35 min' },
  { id: 'm5', num: 'Module 5', title: 'Composability & Pipelines', level: 'Level 2 — Intermediate', time: '40 min' },
  { id: 'm6', num: 'Module 6', title: 'Debugging Failure Modes', level: 'Level 2 — Intermediate', time: '30 min' },
  { id: 'm7', num: 'Module 7', title: 'Governance Tiers', level: 'Level 3 — Advanced', time: '40 min' },
  { id: 'm8', num: 'Module 8', title: 'Quantitative Testing', level: 'Level 3 — Advanced', time: '50 min' },
  { id: 'm9', num: 'Module 9', title: 'Enterprise Deployment', level: 'Level 3 — Advanced', time: '40 min' },
]

const LEITNER_FREQS = ['Every session', 'Every 2 days', 'Every 4 days', 'Every 7 days', 'Every 14 days']

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem('skills:' + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch { return fallback }
}

export default function Dashboard({ onNavigate, onSettings }) {
  const [moduleData, setModuleData] = useState({})
  const [leitnerCounts, setLeitnerCounts] = useState([0, 0, 0, 0, 0])
  const [cardsDueToday, setCardsDueToday] = useState(0)

  useEffect(() => {
    const now = Date.now()
    const data = {}
    let totalDue = 0
    const lboxes = [0, 0, 0, 0, 0]

    for (let m = 1; m <= 9; m++) {
      const key = `module${m}:complete`
      const sessions = readStorage(`engagement:module${m}:sessions`, [])
      const completions = sessions.filter(s => s.completed)
      const bestScore = completions.reduce((best, s) => Math.max(best, s.score || 0), 0)
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null

      data[`m${m}`] = {
        completionCount: completions.length,
        bestScore,
        lastDate: lastSession ? new Date(lastSession.startTime).toLocaleDateString() : null,
        inProgress: sessions.length > 0 && completions.length === 0,
      }
    }

    // Leitner box counts
    const flashcardState = readStorage('flashcards:state', {})
    const leitnerIntervals = [0, 2, 4, 7, 14]

    Object.entries(flashcardState).forEach(([cardId, cardData]) => {
      const box = (cardData.box || 1) - 1
      if (box >= 0 && box < 5) lboxes[box]++

      const lastReview = cardData.lastReview || 0
      const interval = leitnerIntervals[cardData.box - 1] || 0
      const dueAt = lastReview + interval * 86400000
      if (now >= dueAt) totalDue++
    })

    setModuleData(data)
    setLeitnerCounts(lboxes)
    setCardsDueToday(totalDue)
  }, [])

  const completedCount = Object.values(moduleData).filter(d => d.completionCount > 0).length
  const inProgressCount = Object.values(moduleData).filter(d => d.inProgress).length
  const totalCards = leitnerCounts.reduce((a, b) => a + b, 0)

  // Determine recommended next action
  const getRecommendation = () => {
    if (cardsDueToday > 0) return {
      icon: '🃏', action: 'flashcards',
      title: `Review ${cardsDueToday} flashcard${cardsDueToday > 1 ? 's' : ''} due today`,
      desc: 'Spaced repetition: these cards are scheduled for review now.',
    }
    for (let i = 1; i <= 9; i++) {
      const d = moduleData[`m${i}`]
      if (!d) continue
      if (d.inProgress) return {
        icon: '▶', action: `m${i}`,
        title: `Continue Module ${i}`,
        desc: `You started Module ${i} — pick up where you left off.`,
      }
    }
    for (let i = 1; i <= 9; i++) {
      const d = moduleData[`m${i}`]
      if (d && d.completionCount === 0 && !d.inProgress) return {
        icon: '→', action: `m${i}`,
        title: `Start Module ${i}: ${MODULES[i - 1].title}`,
        desc: `Next module in your curriculum. Estimated time: ${MODULES[i - 1].time}.`,
      }
    }
    return {
      icon: '✓', action: 'flashcards',
      title: 'All modules complete — keep reviewing flashcards',
      desc: 'Use spaced repetition to maintain long-term retention.',
    }
  }

  const rec = getRecommendation()

  const getModuleStatus = (id) => {
    const d = moduleData[id]
    if (!d) return 'not-started'
    if (d.completionCount > 0) return 'done'
    if (d.inProgress) return 'in-progress'
    return 'not-started'
  }

  const statusLabel = { 'done': 'Complete', 'in-progress': 'In progress', 'not-started': 'Not started' }

  return (
    <div className="dash-shell">
      <style>{css}</style>

      <header className="dash-hdr">
        <div className="dash-hdr-badge">Skills Platform</div>
        <div className="dash-hdr-title">Agent-Readable Skills Infrastructure</div>
        <button className="dash-hdr-btn" onClick={onSettings}>⚙ API Key</button>
      </header>

      <main className="dash-main">
        <div className="dash-hero">
          <div className="dash-eyebrow">Learning Dashboard</div>
          <div className="dash-title">Your Progress</div>
          <div className="dash-sub">
            Three levels · Nine modules · Evidence-based learning science
          </div>
        </div>

        {/* Stats row */}
        <div className="dash-stats">
          <div className="stat-card">
            <div className="stat-n" style={{ color: completedCount > 0 ? G.green : G.amber }}>
              {completedCount}
            </div>
            <div className="stat-label">Modules complete</div>
          </div>
          <div className="stat-card">
            <div className="stat-n">{9 - completedCount}</div>
            <div className="stat-label">Remaining</div>
          </div>
          <div className="stat-card">
            <div className="stat-n" style={{ color: cardsDueToday > 0 ? G.amber : G.green }}>
              {cardsDueToday}
            </div>
            <div className="stat-label">Flashcards due today</div>
          </div>
          <div className="stat-card">
            <div className="stat-n">{totalCards}</div>
            <div className="stat-label">Total cards in deck</div>
          </div>
        </div>

        {/* Recommended next action */}
        <div className="dash-section-label">Recommended Next Action</div>
        <div className="action-card">
          <div className="action-icon">{rec.icon}</div>
          <div className="action-body">
            <div className="action-title">{rec.title}</div>
            <div className="action-desc">{rec.desc}</div>
          </div>
          <button className="action-btn" onClick={() => onNavigate(rec.action)}>
            Start →
          </button>
        </div>

        {/* Module grid */}
        <div className="dash-section-label">All Modules</div>
        <div className="module-grid">
          {MODULES.map((mod) => {
            const status = getModuleStatus(mod.id)
            const d = moduleData[mod.id] || {}
            return (
              <div
                key={mod.id}
                className={`module-card ${status === 'done' ? 'completed' : ''}`}
                onClick={() => onNavigate(mod.id)}
              >
                <div className="mc-level">{mod.level}</div>
                <div className="mc-num">{mod.num}</div>
                <div className="mc-title">{mod.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span className={`mc-badge ${status}`}>{statusLabel[status]}</span>
                  {d.bestScore > 0 && (
                    <span className={`mc-score ${d.bestScore >= 80 ? 'passing' : ''}`}>
                      {d.bestScore}%
                    </span>
                  )}
                </div>
                {d.lastDate && (
                  <div className="mc-meta" style={{ marginTop: '6px' }}>Last: {d.lastDate}</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Tools row */}
        <div className="dash-section-label">Tools</div>
        <div className="tools-row">
          <div className="tool-card" onClick={() => onNavigate('flashcards')}>
            <div className="tool-icon">🃏</div>
            <div>
              <div className="tool-title">Flashcard Review</div>
              <div className="tool-desc">
                Leitner spaced repetition — {cardsDueToday > 0 ? `${cardsDueToday} cards due` : 'all cards current'}
              </div>
            </div>
          </div>
          <div className="tool-card" onClick={() => onNavigate('tracker')}>
            <div className="tool-icon">📊</div>
            <div>
              <div className="tool-title">Engagement Tracker</div>
              <div className="tool-desc">Full session history, scores, and data management</div>
            </div>
          </div>
        </div>

        {/* Leitner box visualization */}
        <div className="dash-section-label">Leitner Box Retention</div>
        <div className="leitner-row">
          {leitnerCounts.map((count, i) => (
            <div className="lbox" key={i}>
              <div className="lbox-num" style={{ color: i === 4 ? G.green : G.amber }}>{count}</div>
              <div className="lbox-label">Box {i + 1}</div>
              <div className="lbox-freq">{LEITNER_FREQS[i]}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
