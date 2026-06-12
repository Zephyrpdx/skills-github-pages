import { useState } from 'react'

const G = {
  navy: '#0F1B2D', navyM: '#162236', navyL: '#1D2E45',
  slate: '#2A3F5C', muted: '#4A6080', border: '#2E4060',
  amber: '#E8A835', amberL: '#F5C055',
  cream: '#F5F0E8', text: '#D8CFC0', textD: '#A09888',
  red: '#C44040', green: '#3A9E6E',
}

export default function ApiKeyModal({ onSave, existingKey }) {
  const [value, setValue] = useState(existingKey || '')
  const [error, setError] = useState('')

  const handleSave = () => {
    const trimmed = value.trim()
    if (!trimmed.startsWith('sk-ant-')) {
      setError('Key should start with sk-ant-  — paste your full Anthropic API key.')
      return
    }
    localStorage.setItem('anthropic-api-key', trimmed)
    onSave(trimmed)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '24px',
    }}>
      <div style={{
        background: G.navyM, border: `1px solid ${G.border}`,
        borderRadius: '12px', padding: '40px 48px', maxWidth: '520px', width: '100%',
      }}>
        <div style={{
          fontFamily: "'Crimson Pro', serif", fontSize: '28px',
          color: G.cream, marginBottom: '8px', fontWeight: 400,
        }}>
          Connect your Anthropic API key
        </div>
        <p style={{ color: G.textD, fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
          This platform uses Claude to assess your recall answers and quiz responses.
          Your key is stored only in your browser's localStorage and is never sent
          anywhere except directly to api.anthropic.com.
        </p>

        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600,
          letterSpacing: '.12em', textTransform: 'uppercase', color: G.amber,
          marginBottom: '8px' }}>
          Anthropic API Key
        </label>
        <input
          type="password"
          placeholder="sk-ant-api03-..."
          value={value}
          onChange={e => { setValue(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: G.navy, border: `1px solid ${error ? G.red : G.border}`,
            borderRadius: '6px', padding: '10px 14px',
            color: G.cream, fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px', outline: 'none', letterSpacing: '.04em',
          }}
        />
        {error && (
          <p style={{ color: G.red, fontSize: '12px', marginTop: '6px' }}>{error}</p>
        )}

        <p style={{ color: G.textD, fontSize: '12px', marginTop: '12px', lineHeight: 1.5 }}>
          Get a key at{' '}
          <span style={{ color: G.amber }}>console.anthropic.com</span>
          {' '}→ API Keys. Standard API usage charges apply.
        </p>

        <button
          onClick={handleSave}
          style={{
            marginTop: '28px', width: '100%', padding: '12px',
            background: G.amber, color: G.navy, border: 'none',
            borderRadius: '6px', fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            letterSpacing: '.04em',
          }}
        >
          Save Key &amp; Continue
        </button>

        {existingKey && (
          <button
            onClick={() => onSave(existingKey)}
            style={{
              marginTop: '10px', width: '100%', padding: '10px',
              background: 'transparent', color: G.textD, border: `1px solid ${G.border}`,
              borderRadius: '6px', fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
