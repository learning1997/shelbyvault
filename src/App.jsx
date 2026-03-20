// ─────────────────────────────────────────────
//  App.jsx — root component
//  Tabs: Upload | My Files | Browse | Config
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { useWallet }   from './hooks/useWallet'
import { useShelby }   from './hooks/useShelby'
import { useToast }    from './components/Toast'
import { fmtBytes }    from './lib/utils'

import Header      from './components/Header'
import WalletPicker from './components/WalletPicker'
import UploadPanel  from './components/UploadPanel'
import FilesPanel   from './components/FilesPanel'
import BrowsePanel  from './components/BrowsePanel'
import ConfigPanel  from './components/ConfigPanel'
import Toast        from './components/Toast'

const TABS = [
  { id: 'upload', label: '⬆ Upload' },
  { id: 'files',  label: '📁 My Files' },
  { id: 'browse', label: '🔍 Browse' },
  { id: 'config', label: '⚙ Config' },
]

export default function App() {
  const [tab,    setTab]    = useState('upload')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sv_api_key') || '')

  const { toast, show: showToast } = useToast()

  const {
    wallets, activeWallet, address, connecting,
    showPicker, setShowPicker,
    connect, connectWith, disconnect, signAndSubmit,
    isConnected,
    network,
  } = useWallet()

  const {
    upload, uploading, uploadSteps,
    blobs, loadingBlobs, listBlobs, download, blobUrl
  } = useShelby({ address, apiKey, signAndSubmit, network })

  // ── Auto-refresh stats when connected ──
  useEffect(() => {
    if (isConnected && address) {
      listBlobs(address)
    }
  }, [isConnected, address, listBlobs])

  // ── handlers ──
  async function handleUpload(args) {
    try {
      const url = await upload(args)
      showToast('🎉 Uploaded to Shelby testnet!', 'success')
      if (address) listBlobs(address) // Refresh counts
      return url
    } catch (e) {
      showToast('Upload failed: ' + (e?.message?.slice(0, 50) ?? 'unknown'), 'error')
      throw e
    }
  }

  async function handleConnect() {
    try {
      await connect()
    } catch (e) {
      const msg = e?.message || ''
      if (msg === 'NO_WALLET') {
        showToast('No wallet detected — install Petra from petra.app', 'error')
      } else if (/reject|cancel/i.test(msg)) {
        showToast('Connection rejected', 'error')
      } else {
        showToast('Connect failed: ' + msg.slice(0, 50), 'error')
      }
    }
  }

  async function handleDownload(account, name) {
    try {
      await download(account, name)
      showToast('Download started ✓', 'success')
    } catch (e) {
      showToast('Download failed: ' + (e?.message ?? ''), 'error')
    }
  }

  function saveApiKey(key) {
    setApiKey(key)
    if (key) {
      localStorage.setItem('sv_api_key', key)
      showToast('API key saved ✓', 'success')
    } else {
      showToast('API key removed', 'success')
    }
  }

  // Total stats for stats bar
  const totalBytes = blobs.reduce((a, b) => a + (b.size_bytes || b.size || 0), 0)
  const activeNet = network?.name?.toLowerCase() === 'shelbynet' ? 'shelbynet' : 'testnet'

  return (
    <>
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="app">
        <Header
          address={address}
          activeWallet={activeWallet}
          connecting={connecting}
          onConnect={handleConnect}
          onDisconnect={disconnect}
        />

        {/* Stats bar — only when connected */}
        {isConnected && (
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-label">Files Stored</div>
              <div className="stat-value">{blobs.length || '—'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Size</div>
              <div className="stat-value" style={{ fontSize: '16px' }}>
                {blobs.length ? fmtBytes(totalBytes) : '—'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Network</div>
              <div className="stat-value stat-small accent3">
                {network?.name?.toUpperCase() || 'TESTNET'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Protocol</div>
              <div className="stat-value stat-small accent2">SHELBY</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="panel">
          {tab === 'upload' && (
            <UploadPanel
              address={address}
              onUpload={handleUpload}
              uploading={uploading}
              uploadSteps={uploadSteps}
            />
          )}
          {tab === 'files' && (
            <FilesPanel
              address={address}
              blobs={blobs}
              loading={loadingBlobs}
              onLoad={listBlobs}
              onDownload={handleDownload}
              blobUrl={blobUrl}
            />
          )}
          {tab === 'browse' && (
            <BrowsePanel 
              onDownload={handleDownload} 
              activeNet={activeNet} 
              blobUrl={blobUrl} 
            />
          )}
          {tab === 'config' && (
            <ConfigPanel apiKey={apiKey} onSave={saveApiKey} />
          )}
        </div>
      </div>

      {/* Wallet picker modal */}
      {showPicker && (
        <WalletPicker
          wallets={wallets}
          onSelect={connectWith}
          onClose={() => setShowPicker(false)}
        />
      )}

      <Toast toast={toast} />
    </>
  )
}
