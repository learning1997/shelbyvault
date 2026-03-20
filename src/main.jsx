import React, { StrictMode, Component } from 'react'
import { createRoot }  from 'react-dom/client'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#111', color: 'red', fontFamily: 'monospace', height: '100vh', overflow: 'auto' }}>
          <h2>React Application Crashed</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.stack || this.state.error?.message || String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AptosWalletAdapterProvider autoConnect={true}>
        <App />
      </AptosWalletAdapterProvider>
    </ErrorBoundary>
  </StrictMode>
)
