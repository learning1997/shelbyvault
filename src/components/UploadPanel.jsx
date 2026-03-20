// ─────────────────────────────────────────────
//  UploadPanel.jsx
//  Drag-drop upload with 3-step progress
// ─────────────────────────────────────────────
import { useState, useRef } from 'react'
import { fmtBytes, fileEmoji } from '../lib/utils'

const STEP_ICONS = { idle: null, active: '◌', done: '✓', error: '✕' }

export default function UploadPanel({ address, onUpload, uploading, uploadSteps }) {
  const [file,     setFile]     = useState(null)
  const [blobName, setBlobName] = useState('')
  const [dragging, setDragging] = useState(false)
  const [result,   setResult]   = useState(null) // URL after success
  const fileRef = useRef()

  function handleFile(f) {
    setFile(f)
    setBlobName(f.name)
    setResult(null)
  }

  async function handleUpload() {
    if (!file || !blobName.trim() || uploading) return
    try {
      const url = await onUpload({ file, blobName: blobName.trim() })
      setResult(url)
    } catch (e) {
      console.error(e)
    }
  }

  function reset() {
    setFile(null)
    setBlobName('')
    setResult(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const showProgress = uploading

  return (
    <div className="panel-content">

      {/* Drop zone */}
      {!result && (
        <>
          <div
            className={`drop-zone ${dragging ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
            onClick={() => !file && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault(); setDragging(false)
              const f = e.dataTransfer.files[0]; if (f) handleFile(f)
            }}
          >
            <input
              ref={fileRef}
              type="file"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files[0]; if (f) handleFile(f) }}
            />

            {!file ? (
              <>
                <div className="drop-icon">🗂</div>
                <div className="drop-title">Drop file here</div>
                <div className="drop-sub">or click to browse · any format</div>
                <button
                  className="btn btn-primary"
                  onClick={e => { e.stopPropagation(); fileRef.current?.click() }}
                >
                  Choose File
                </button>
              </>
            ) : (
              <div className="selected-file">
                <div className="sel-icon">{fileEmoji(file.name)}</div>
                <div className="sel-meta">
                  <div className="sel-name">{file.name}</div>
                  <div className="sel-size">{fmtBytes(file.size)}</div>
                </div>
                <button className="btn btn-sm btn-outline" onClick={e => { e.stopPropagation(); reset() }}>
                  ✕ Clear
                </button>
              </div>
            )}
          </div>

          {/* Blob name + upload button */}
          {file && !showProgress && (
            <div className="upload-row">
              <div className="field">
                <label className="field-label">Blob name / path</label>
                <input
                  className="text-input"
                  value={blobName}
                  onChange={e => setBlobName(e.target.value)}
                  placeholder="e.g. docs/report.pdf"
                />
              </div>
              <button
                className="btn btn-primary upload-btn"
                onClick={handleUpload}
                disabled={!address || uploading || !blobName.trim()}
              >
                {!address ? '🔒 Connect wallet first' : '⬆ Upload to Shelby'}
              </button>
              {!address && (
                <div className="upload-hint">Connect your wallet to upload files</div>
              )}
            </div>
          )}
        </>
      )}

      {/* Progress steps */}
      {showProgress && (
        <div className="progress-wrap">
          <div className="section-label">Upload Progress</div>
          <div className="steps">
            {uploadSteps.map((step, i) => (
              <div key={step.id} className={`step step-${step.status}`}>
                <div className="step-num">
                  {step.status === 'done'   ? '✓'
                 : step.status === 'error'  ? '✕'
                 : step.status === 'active' ? <span className="spin">◌</span>
                 : i + 1}
                </div>
                <div className="step-body">
                  <div className="step-label-text">{step.label}</div>
                  <div className="step-detail">{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="upload-result">
          <div className="result-header">✅ Uploaded to Shelby testnet!</div>
          <div className="field-label">Direct URL</div>
          <div className="result-url">{result}</div>
          <div className="result-actions">
            <button
              className="btn btn-ghost"
              onClick={() => navigator.clipboard.writeText(result)}
            >
              📋 Copy URL
            </button>
            <button className="btn btn-outline" onClick={reset}>
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
