export function fmtBytes(b) {
  if (!b) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(b) / Math.log(1024))
  return (b / Math.pow(1024, i)).toFixed(1) + ' ' + u[Math.min(i, 3)]
}

export function shortAddr(addr) {
  if (!addr) return ''
  const s = String(addr?.toString ? addr.toString() : addr)
  if (s.length < 14) return s
  return s.slice(0, 8) + '...' + s.slice(-6)
}

export function fileEmoji(name = '') {
  const ext = name.split('.').pop().toLowerCase()
  const map = {
    pdf: '📄', png: '🖼', jpg: '🖼', jpeg: '🖼', gif: '🖼', webp: '🖼', svg: '🎨',
    mp4: '🎬', webm: '🎬', mov: '🎬', mp3: '🎵', wav: '🎵', ogg: '🎵',
    json: '📋', txt: '📝', md: '📝', csv: '📊', xlsx: '📊',
    zip: '🗜', tar: '🗜', gz: '🗜', html: '🌐', js: '⚙', ts: '⚙', py: '🐍',
  }
  return map[ext] || '📁'
}

export function fmtDate(micros) {
  if (!micros) return '—'
  return new Date(micros / 1000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
