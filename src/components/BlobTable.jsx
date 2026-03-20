import { useState } from 'react'
import { fmtBytes, fileEmoji, fmtDate } from '../lib/utils'

export default function BlobTable({ blobs, address, blobUrl, onDownload, activeNet }) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  
  if (!blobs || blobs.length === 0) return null

  const totalPages = Math.ceil(blobs.length / itemsPerPage)
  
  // Safety bounds
  const currentPage = Math.min(Math.max(1, page), totalPages)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBlobs = blobs.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="blob-table-container">
      <div className="blob-table-wrap">
        <table className="blob-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBlobs.map((b, i) => {
               const name = b.name || b.blob_name || '?'
               const size = b.size_bytes || b.size || 0
               const url  = blobUrl ? blobUrl(address, name) : `https://api.${activeNet || 'testnet'}.shelby.xyz/shelby/v1/blobs/${address}/${name}`
               return (
                 <tr key={startIndex + i}>
                   <td>
                     <div className="table-file-name" title={name}>
                       <span className="file-emoji">{fileEmoji(name)}</span>
                       {name}
                     </div>
                   </td>
                   <td>{fmtBytes(size)}</td>
                   <td className="tag">{fmtDate(b.expiration_micros)}</td>
                   <td>
                     <div className="file-card-actions">
                      <button className="icon-btn" title="Copy URL" onClick={() => navigator.clipboard.writeText(url)}>📋</button>
                      <button className="icon-btn" title="Download" onClick={() => onDownload(address, name)}>⬇</button>
                      <button className="icon-btn" title="Open in new tab" onClick={() => window.open(url, '_blank')}>↗</button>
                     </div>
                   </td>
                 </tr>
               )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setPage(currentPage - 1)}
            className="btn btn-sm btn-outline"
          >
            ← Prev
          </button>
          <span className="page-info">Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setPage(currentPage + 1)}
            className="btn btn-sm btn-outline"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
