// ─────────────────────────────────────────────
//  Header.jsx
// ─────────────────────────────────────────────
import { shortAddr } from '../lib/utils'

export default function Header({ address, activeWallet, connecting, onConnect, onDisconnect }) {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-mark">SV</div>
        <div>
          <div className="logo-text">ShelbyVault</div>
          <div className="logo-sub">Decentralized Storage</div>
        </div>
      </div>

      <div className="header-right">
        <div className="network-badge">
          <span className="net-dot" />
          SHELBY TESTNET
        </div>

        {address ? (
          <div className="wallet-connected">
            <span className="wallet-icon">{activeWallet?.icon ?? '🔗'}</span>
            <span className="wallet-addr">{shortAddr(address)}</span>
            <button className="btn btn-sm btn-ghost-danger" onClick={onDisconnect}>
              ✕
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={onConnect}
            disabled={connecting}
          >
            {connecting ? '⏳ Connecting…' : '🔗 Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  )
}
