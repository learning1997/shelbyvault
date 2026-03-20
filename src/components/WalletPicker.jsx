// ─────────────────────────────────────────────
//  WalletPicker.jsx
//  Modal that lets user choose which wallet to connect
// ─────────────────────────────────────────────

export default function WalletPicker({ wallets, onSelect, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Select Wallet</div>
        <div className="modal-sub">Choose which wallet to connect</div>

        <div className="wallet-list">
          {wallets.map(w => (
            <button
              key={w.name}
              className="wallet-option"
              onClick={() => onSelect(w)}
            >
              <span className="wallet-option-icon">{w.icon}</span>
              <span className="wallet-option-name">{w.name}</span>
              <span className="wallet-option-arrow">→</span>
            </button>
          ))}
        </div>

        <button className="modal-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
