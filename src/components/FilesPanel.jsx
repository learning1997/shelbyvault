// ─────────────────────────────────────────────
//  FilesPanel.jsx
//  Lists blobs for connected wallet
// ─────────────────────────────────────────────
import { useEffect } from 'react'
import { fmtBytes, fileEmoji, fmtDate } from '../lib/utils'
import BlobTable from './BlobTable'
import { SHELBY_RPC } from '../lib/theme'

export default function FilesPanel({ address, blobs, loading, onLoad, onDownload, blobUrl }) {

  useEffect(() => {
    if (address) onLoad(address)
  }, [address, onLoad])

  if (!address) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔒</div>
        <div className="empty-title">Wallet not connected</div>
        <div className="empty-sub">Connect your wallet to view your files</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-icon spin-slow">⏳</div>
        <div className="empty-sub">Loading from Shelby network…</div>
      </div>
    )
  }

  if (!blobs.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🌌</div>
        <div className="empty-title">No files yet</div>
        <div className="empty-sub">Upload your first file to see it here</div>
        <button className="btn btn-outline" onClick={() => onLoad(address)}>↺ Refresh</button>
      </div>
    )
  }

  return (
    <div className="panel-content">
      <div className="files-header">
        <span className="files-count">
          <span className="count-num">{blobs.length}</span> files stored
        </span>
        <button className="btn btn-sm btn-outline" onClick={() => onLoad(address)}>↺ Refresh</button>
      </div>

      <BlobTable 
        blobs={blobs} 
        address={address} 
        blobUrl={blobUrl} 
        onDownload={onDownload} 
      />
    </div>
  )
}
