// ─────────────────────────────────────────────
//  Toast.jsx + useToast hook
// ─────────────────────────────────────────────
/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback, useEffect } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  const show = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  return { toast, show }
}

export default function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
      <span>{toast.msg}</span>
    </div>
  )
}
