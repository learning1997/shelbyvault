const FEATURES = [
  {
    icon: '⬆',
    title: 'Upload Files',
    desc: 'Upload any file to the Shelby decentralized storage network. Files are split into blobs and stored across the network.',
  },
  {
    icon: '📁',
    title: 'My Files',
    desc: 'View, download, and manage all your uploaded files. Track file sizes, timestamps, and blob counts at a glance.',
  },
  {
    icon: '🔍',
    title: 'Browse Network',
    desc: 'Explore blobs stored on the Shelby testnet by any account. Search, paginate, and download public files.',
  },
  {
    icon: '⚙',
    title: 'API & Config',
    desc: 'Manage your API key, configure network settings, and customize your vault experience.',
  },
]

export default function LandingPage({ onEnter }) {
  return (
    <div className="landing">
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* ── Hero ── */}
      <section className="hero hero-visible">
        <div className="hero-badge">⚡ DECENTRALIZED STORAGE</div>
        <h1 className="hero-title">
          <span className="hero-shelby">Shelby</span>
          <span className="hero-vault">Vault</span>
        </h1>
        <p className="hero-sub">
          Store, browse, and share files on the <strong>Shelby</strong> network
          <br />
          — secure, decentralized, and built on Aptos.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-hero" onClick={onEnter}>
            Enter the Vault →
          </button>
          <a href="https://shelby.xyz" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            About Shelby
          </a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">Shelby</span>
            <span className="hero-stat-label">Network</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">Aptos</span>
            <span className="hero-stat-label">Blockchain</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">Blob</span>
            <span className="hero-stat-label">Storage</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features features-visible">
        <h2 className="section-title">Everything you need</h2>
        <p className="section-sub">A complete toolkit for decentralized file storage</p>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Network ── */}
      <section className="network-section network-visible">
        <h2 className="section-title">Powered by Shelby</h2>
        <p className="section-sub">Decentralized blob storage on Aptos testnet</p>
        <div className="network-cards">
          <div className="network-card">
            <span className="network-card-icon">🔗</span>
            <div>
              <div className="network-card-title">Wallet Connection</div>
              <div className="network-card-desc">Connect with Petra or any Aptos wallet</div>
            </div>
          </div>
          <div className="network-card">
            <span className="network-card-icon">🧩</span>
            <div>
              <div className="network-card-title">Blob Splitting</div>
              <div className="network-card-desc">Files are split into blobs for efficient storage</div>
            </div>
          </div>
          <div className="network-card">
            <span className="network-card-icon">🔐</span>
            <div>
              <div className="network-card-title">On-Chain Verify</div>
              <div className="network-card-desc">Verify file integrity on the Aptos blockchain</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section cta-visible">
        <h2 className="cta-title">Ready to vault your files?</h2>
        <p className="cta-sub">Connect your wallet and start storing on the decentralized web.</p>
        <button className="btn btn-primary btn-hero" onClick={onEnter}>
          Enter the Vault →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="footer-links">
          <a href="https://shelby.xyz" target="_blank" rel="noopener noreferrer">Shelby Protocol</a>
          <span className="footer-dot">·</span>
          <a href="https://aptoslabs.com" target="_blank" rel="noopener noreferrer">Aptos</a>
          <span className="footer-dot">·</span>
          <a href="https://github.com/shelby-protocol" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <p className="footer-copy">ShelbyVault &mdash; Decentralized Storage on Aptos</p>
      </footer>
    </div>
  )
}
