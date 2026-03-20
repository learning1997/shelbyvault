// ─────────────────────────────────────────────
//  ConfigPanel.jsx
// ─────────────────────────────────────────────
import { useState } from 'react'

export default function ConfigPanel({ apiKey, onSave }) {
  const [input,  setInput]  = useState('')
  const [saved,  setSaved]  = useState(false)

  function save() {
    if (!input.trim()) return
    onSave(input.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function clear() {
    onSave('')
    setInput('')
    localStorage.removeItem('sv_api_key')
  }

  return (
    <div className="panel-content">

      <div className="config-card">
        <h3>🔑 Aptos / Geomi API Key</h3>
        <p>
          Get a free API key from{' '}
          <a href="https://geomi.dev" target="_blank" rel="noreferrer">geomi.dev</a>
          {' '}— create a Testnet resource and generate a <strong>client key</strong>.
          Improves rate limits for Aptos node calls.
        </p>
        <div className="config-row">
          <input
            className="text-input"
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="aptoslabs_xxx..."
          />
          <button className="btn btn-primary" onClick={save}>
            {saved ? '✓ Saved!' : 'Save'}
          </button>
        </div>
        {apiKey && (
          <div className="key-display">
            <span className="key-val">{apiKey.slice(0, 12)}…{apiKey.slice(-4)}</span>
            <span className="key-badge">✓ ACTIVE</span>
            <button className="btn btn-sm btn-ghost-danger" onClick={clear}>Remove</button>
          </div>
        )}
      </div>

      <div className="config-card">
        <h3>🌐 Shelby RPC</h3>
        <p>The official testnet endpoint — no changes needed.</p>
        <div className="key-display">
          <span className="key-val" style={{ color: 'var(--accent3)' }}>
            https://api.testnet.shelby.xyz/shelby
          </span>
        </div>
      </div>

      <div className="config-card">
        <h3>💰 Getting Tokens</h3>
        <p>
          Uploads cost <strong>1 ShelbyUSD</strong> per file.<br />
          • ShelbyUSD → join{' '}
          <a href="https://discord.gg/shelbyprotocol" target="_blank" rel="noreferrer">
            Shelby Discord
          </a>{' '}
          → #faucet<br />
          • APT (gas) →{' '}
          <a href="https://aptos.dev/network/faucet" target="_blank" rel="noreferrer">
            Aptos Testnet Faucet
          </a>
        </p>
      </div>

      <div className="config-card">
        <h3>🦊 Wallet Setup</h3>
        <p>
          Install{' '}
          <a href="https://petra.app" target="_blank" rel="noreferrer">Petra Wallet</a>
          {' '}(Chrome extension) and switch to <strong>Aptos Testnet</strong>.<br />
          Bitget, Martian, and Pontem wallets also work.
        </p>
      </div>

    </div>
  )
}
