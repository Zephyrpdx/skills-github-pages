import { useState, useEffect } from 'react'
import ApiKeyModal from './ApiKeyModal.jsx'
import Dashboard from './Dashboard.jsx'
import Module1 from './module1-lesson.jsx'
import Module2 from './module2-lesson.jsx'
import Module3 from './module3-lesson.jsx'
import Module4 from './module4-lesson.jsx'
import Module5 from './module5-lesson.jsx'
import Module6 from './module6-lesson.jsx'
import Module7 from './module7-lesson.jsx'
import Module8 from './module8-lesson.jsx'
import Module9 from './module9-lesson.jsx'
import EngagementTracker from './engagement-tracker.jsx'
import FlashcardSystem from './flashcard-system.jsx'

const G = {
  navy: '#0F1B2D', navyM: '#162236', navyL: '#1D2E45',
  slate: '#2A3F5C', border: '#2E4060',
  amber: '#E8A835', cream: '#F5F0E8', text: '#D8CFC0', textD: '#A09888',
}

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`

// Views that have their own full-page shell — no chrome needed
const FULLPAGE_VIEWS = ['m1','m2','m3','m4','m5','m6','m7','m8','m9','tracker','flashcards']

export default function App() {
  const [view, setView] = useState('dashboard')
  const [showApiModal, setShowApiModal] = useState(false)

  // Check for API key on first mount
  useEffect(() => {
    const key = localStorage.getItem('anthropic-api-key')
    if (!key) setShowApiModal(true)
  }, [])

  // Each module component is a full-page artifact. Render it directly and
  // inject a "← Back" button overlay so the user can return to the dashboard.
  const renderView = () => {
    switch (view) {
      case 'dashboard':   return <Dashboard onNavigate={setView} onSettings={() => setShowApiModal(true)} />
      case 'm1':          return <Module1 />
      case 'm2':          return <Module2 />
      case 'm3':          return <Module3 />
      case 'm4':          return <Module4 />
      case 'm5':          return <Module5 />
      case 'm6':          return <Module6 />
      case 'm7':          return <Module7 />
      case 'm8':          return <Module8 />
      case 'm9':          return <Module9 />
      case 'tracker':     return <EngagementTracker />
      case 'flashcards':  return <FlashcardSystem />
      default:            return <Dashboard onNavigate={setView} onSettings={() => setShowApiModal(true)} />
    }
  }

  const isFullPage = FULLPAGE_VIEWS.includes(view)

  return (
    <>
      <style>{GOOGLE_FONTS}</style>

      {/* Back button overlay for full-page module views */}
      {isFullPage && (
        <button
          onClick={() => setView('dashboard')}
          title="Back to Dashboard"
          style={{
            position: 'fixed', top: '10px', right: '16px', zIndex: 9999,
            background: G.navyL, border: `1px solid ${G.border}`,
            borderRadius: '6px', padding: '5px 12px',
            color: G.textD, fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: '6px',
            transition: 'color .15s, border-color .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = G.cream; e.currentTarget.style.borderColor = G.amber }}
          onMouseLeave={e => { e.currentTarget.style.color = G.textD; e.currentTarget.style.borderColor = G.border }}
        >
          ← Dashboard
        </button>
      )}

      {renderView()}

      {showApiModal && (
        <ApiKeyModal
          existingKey={localStorage.getItem('anthropic-api-key') || ''}
          onSave={(key) => {
            localStorage.setItem('anthropic-api-key', key)
            setShowApiModal(false)
          }}
        />
      )}
    </>
  )
}
