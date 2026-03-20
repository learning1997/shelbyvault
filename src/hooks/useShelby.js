import { useState, useCallback } from 'react'
import { Network, Aptos, AptosConfig } from '@aptos-labs/ts-sdk'

// ─────────────────────────────────────────────────────────────
//  useShelby — upload, list blobs, download
//  All Shelby testnet operations in one hook
// ─────────────────────────────────────────────────────────────

const SHELBY_RPC = 'https://api.testnet.shelby.xyz/shelby'

export async function fetchBlobsForAccount(account, activeNet) {
  if (!account) return []

  const isShelbyNet = activeNet === 'shelbynet'
  const graphQlUrl = isShelbyNet 
    ? "https://api.shelbynet.aptoslabs.com/nocode/v1/public/cmforrguw0042s601fn71f9l2/v1/graphql"
    : "https://api.testnet.aptoslabs.com/nocode/v1/public/cmlfqs5wt00qrs601zt5s4kfj/v1/graphql"

  let filesMap = new Map() // Deduplicate safely

  // 1. Try hitting the high-availability RPC blobs endpoint natively
  try {
    const baseUrl = `https://api.${activeNet}.shelby.xyz/shelby`
    const res = await fetch(`${baseUrl}/v1/blobs/${account}`)
    if (res.ok) {
      const json = await res.json()
      const rawList = Array.isArray(json) ? json : (json.blobs ?? [])
      rawList.forEach(b => filesMap.set(b.name || b.blob_name, {
        name: b.name || b.blob_name,
        size_bytes: b.size_bytes || b.size || 0,
        expiration_micros: b.expiration_micros || b.expirationMicros,
      }))
    }
  } catch (err) {}

  // 2. Fallback exactly to the Nocode DB GraphicQL directly (Bypasses local SDK filters)
  try {
    const resGql = await fetch(graphQlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-aptos-client': 'shelby-ts-sdk' },
      body: JSON.stringify({
        query: `query { blobs(where: { owner: { _eq: "${account}" } }) { blob_name size expires_at is_written } }`
      })
    })
    if (resGql.ok) {
      const json = await resGql.json()
      if (json?.data?.blobs) {
        json.data.blobs.forEach(b => filesMap.set(b.blob_name, {
          name: b.blob_name,
          size_bytes: b.size || 0,
          expiration_micros: b.expires_at || 0,
        }))
      }
    }
  } catch (err) {}

  // 3. ULTIMATE BULLETPROOF FALLBACK: Mine from Aptos Network Transactions directly!
  try {
    const aptosNetwork = isShelbyNet ? 'shelbynet' : Network.TESTNET
    const aptosClient = new Aptos(new AptosConfig({ network: aptosNetwork }))
    
    const txns = await aptosClient.getAccountTransactions({ accountAddress: account })
    txns.forEach(tx => {
      if (!tx.success) return
      const payload = tx.payload
      if (payload && payload.function && payload.function.includes('register_blob')) {
        const args = payload.arguments || payload.functionArguments
        if (args && args.length >= 5) {
          const bName = args[0]
          if (typeof bName === 'string' && !filesMap.has(bName)) {
            filesMap.set(bName, {
              name: bName,
              size_bytes: Number(args[4] || 0),
              expiration_micros: Number(args[1] || 0),
            })
          }
        }
      }
      if (payload && payload.function && payload.function.includes('register_multiple')) {
        const args = payload.arguments || payload.functionArguments
        if (args && args.length >= 5 && Array.isArray(args[0])) {
          args[0].forEach((bName, idx) => {
            if (typeof bName === 'string' && !filesMap.has(bName)) {
              filesMap.set(bName, {
                name: bName,
                size_bytes: Number(args[4]?.[idx] || 0),
                expiration_micros: Number(args[1] || 0),
              })
            }
          })
        }
      }
    })
  } catch (err) {}

  return Array.from(filesMap.values())
}

export function useShelby({ address, apiKey, signAndSubmit, network }) {
  const [uploading, setUploading] = useState(false)
  const [uploadSteps, setUploadSteps] = useState([]) // [{ id, label, status, detail }]
  const [blobs, setBlobs] = useState([])
  const [loadingBlobs, setLoadingBlobs] = useState(false)

  // Derive the active network safely using Petra's standardized network object
  const activeNet = network?.name?.toLowerCase() === 'shelbynet' ? 'shelbynet' : 'testnet'

  // ── helpers ──
  function setStep(id, status, detail) {
    setUploadSteps(prev =>
      prev.map(s => s.id === id ? { ...s, status, detail } : s)
    )
  }

  function blobUrl(account, name) {
    return `https://api.${activeNet}.shelby.xyz/shelby/v1/blobs/${account}/${name}`
  }

  // ── Upload ──
  const upload = useCallback(async ({ file, blobName }) => {
    if (!address) throw new Error('Wallet not connected')

    setUploading(true)
    setUploadSteps([
      { id: 'encode', label: 'Encode File', status: 'idle', detail: 'Waiting...' },
      { id: 'register', label: 'On-Chain Registration', status: 'idle', detail: 'Waiting...' },
      { id: 'upload', label: 'RPC Upload', status: 'idle', detail: 'Waiting...' },
    ])

    try {
      // Lazy-load WASM SDK safely, but statically resolve Aptos
      const [{ ShelbyClient, generateCommitments, createDefaultErasureCodingProvider, expectedTotalChunksets, ShelbyBlobClient }] =
        await Promise.all([
          import('@shelby-protocol/sdk/browser')
        ])

      const aptosNetwork = activeNet === 'shelbynet' ? 'shelbynet' : Network.TESTNET

      // Step 1 — Encode
      setStep('encode', 'active', 'Computing erasure codes & Merkle commitments...')
      const buf = new Uint8Array(await file.arrayBuffer())
      const provider = await createDefaultErasureCodingProvider()
      const commitments = await generateCommitments(provider, buf)
      setStep('encode', 'done', `Root: ${commitments.blob_merkle_root?.toString?.()?.slice(0, 16) ?? '✓'}`)

      // Step 2 — On-chain register
      setStep('register', 'active', 'Sign transaction in wallet...')
      const payload = ShelbyBlobClient.createRegisterBlobPayload({
        account: address,
        blobName,
        blobMerkleRoot: commitments.blob_merkle_root,
        numChunksets: expectedTotalChunksets(commitments.raw_data_size),
        expirationMicros: (Date.now() + 30 * 24 * 60 * 60 * 1000) * 1000,
        blobSize: commitments.raw_data_size,
        encoding: 0,
      })

      const txPending = await signAndSubmit(payload)
      const txHash = txPending?.hash || txPending

      const aptosClient = new Aptos(new AptosConfig({
        network: aptosNetwork,
        ...(apiKey ? { clientConfig: { API_KEY: apiKey } } : {}),
      }))
      await aptosClient.waitForTransaction({ transactionHash: txHash })
      setStep('register', 'done', `Tx confirmed: ${String(txHash).slice(0, 14)}…`)

      // Step 3 — RPC upload
      setStep('upload', 'active', `Sending data to Shelby ${activeNet} nodes...`)
      const shelby = new ShelbyClient({ 
        network: aptosNetwork, 
        ...(apiKey ? { apiKey } : {}) 
      })
      await shelby.rpc.putBlob({
        account: address,
        blobName,
        blobData: new Uint8Array(await file.arrayBuffer()),
      })
      setStep('upload', 'done', 'Stored by all providers ✓')

      return blobUrl(address, blobName)

    } catch (e) {
      setUploadSteps([])
      throw e
    } finally {
      setUploading(false)
    }
  }, [address, apiKey, signAndSubmit, activeNet])

  // ── List blobs for an address ──
  const listBlobs = useCallback(async (account) => {
    if (!account) return
    setLoadingBlobs(true)
    setBlobs([])

    const finalArray = await fetchBlobsForAccount(account, activeNet)

    setBlobs(finalArray)
    setLoadingBlobs(false)
    return finalArray
  }, [activeNet])

  // ── Download ──
  const download = useCallback(async (account, name) => {
    const url = blobUrl(account, name)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = name.split('/').pop()
    a.click()
    URL.revokeObjectURL(a.href)
  }, [activeNet])

  return {
    upload,
    uploading,
    uploadSteps,
    blobs,
    loadingBlobs,
    listBlobs,
    download,
    blobUrl,
  }
}
