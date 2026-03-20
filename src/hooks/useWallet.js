import { useState, useCallback } from 'react'
import { useWallet as useAptosWallet } from '@aptos-labs/wallet-adapter-react'

// ─────────────────────────────────────────────────────────────
//  useWallet — now uses official @aptos-labs/wallet-adapter-react 
//  so it can properly connect to Petra and bypass window.petra deprecation
// ─────────────────────────────────────────────────────────────

export function useWallet() {
  const {
    account,
    connected,
    connecting,
    wallet,
    wallets: aptosWallets,
    connect: aptosConnect,
    disconnect: aptosDisconnect,
    signAndSubmitTransaction,
    network
  } = useAptosWallet();

  const [showPicker, setShowPicker] = useState(false);

  // Map to the format App.jsx expects
  const wallets = (aptosWallets || []).map(w => ({
    name: w.name,
    icon: w.name === 'Petra' ? '🔷' : '🟣',
    provider: w
  }));

  const activeWallet = wallet ? {
    name: wallet.name,
    icon: wallet.name === 'Petra' ? '🔷' : '🟣',
    provider: wallet
  } : null;

  const address = account?.address 
    ? String(account.address.toString ? account.address.toString() : account.address) 
    : null;

  const connect = useCallback(async (forcedWallet = null) => {
    try {
      if (forcedWallet) {
        await aptosConnect(forcedWallet.name);
      } else if (wallets.length === 1) {
        await aptosConnect(wallets[0].name);
      } else if (wallets.length > 0) {
        // Try connect Petra directly since user wants Petra
        const petra = wallets.find(w => w.name === 'Petra');
        if (petra) {
          await aptosConnect(petra.name);
        } else {
          setShowPicker(true);
        }
      } else {
        throw new Error('NO_WALLET');
      }
    } catch (err) {
      if (err?.name === 'WalletReadyStateError' || err?.message?.includes('Not Ready')) {
        throw new Error('NO_WALLET');
      }
      throw err;
    }
  }, [aptosConnect, wallets]);

  const connectWith = useCallback(async (selectedWallet) => {
    setShowPicker(false);
    await connect(selectedWallet);
  }, [connect]);

  const disconnect = useCallback(async () => {
    await aptosDisconnect();
  }, [aptosDisconnect]);

  const signAndSubmit = useCallback(async (payload) => {
    if (!connected) throw new Error('No wallet connected');
    
    // The new adapter requires { data: payload }
    const result = await signAndSubmitTransaction({
      data: payload
    });
    
    if (result?.status === 'Rejected') throw new Error('User rejected transaction');
    return result?.args ?? result;
  }, [connected, signAndSubmitTransaction]);

  return {
    wallets,
    activeWallet,
    address,
    connecting,
    showPicker,
    setShowPicker,
    connect,
    connectWith,
    disconnect,
    signAndSubmit,
    isConnected: connected,
    network,
  };
}
