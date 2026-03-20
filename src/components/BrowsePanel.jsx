// ─────────────────────────────────────────────
//  BrowsePanel.jsx
//  Browse files of any Aptos address
// ─────────────────────────────────────────────
import { useState } from 'react'
import { fmtBytes, fileEmoji, fmtDate } from '../lib/utils'
import { fetchBlobsForAccount } from '../hooks/useShelby'
import BlobTable from './BlobTable'

export default function BrowsePanel({ onDownload, activeNet, blobUrl }) {
  const [input,   setInput]   = useState('')
  const [results, setResults] = useState(null) // null = not searched, [] = empty
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState('')

  async function search() {
    const addr = input.trim()
    if (!addr.startsWith('0x')) return
    setLoading(true)
    setResults(null)
    setSearched(addr)

    // Run the reliable 3-tier lookup using the imported function
    const list = await fetchBlobsForAccount(addr, activeNet || 'testnet')

    setResults(list)
    setLoading(false)
  }

  return (
    <div className="panel-content">
      <div className="browse-header">
        <div className="section-label">Lookup Any Address</div>
        <p className="browse-desc">
          All blobs on Shelby testnet are publicly accessible. Enter any Aptos wallet address.
        </p>
        <div className="browse-row">
          <input
            className="text-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="0x... Aptos address"
            onKeyDown={e => e.key === 'Enter' && search()}
          />
          <button
            className="btn btn-primary"
            onClick={search}
            disabled={loading || !input.startsWith('0x')}
          >
            {loading ? '⏳' : 'Search'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="empty-icon spin-slow">⏳</div>
          <div className="empty-sub">Querying Shelby testnet…</div>
        </div>
      )}

      {results !== null && !loading && results.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No files found</div>
          <div className="empty-sub">{searched.slice(0,16)}… has no blobs on testnet</div>
        </div>
      )}

      {results && results.length > 0 && (
        <>
          <div className="files-header">
            <span className="files-count">
              <span className="count-num">{results.length}</span> files for {searched.slice(0,10)}…
            </span>
          </div>
          <BlobTable 
            blobs={results} 
            address={searched} 
            activeNet={activeNet}
            blobUrl={blobUrl} 
            onDownload={onDownload} 
          />
        </>
      )}
    </div>
  )
}
