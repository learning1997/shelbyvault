
🚀 **Project Showcase: ShelbyVault DApp is LIVE!** 🌌

Hey team! I’m incredibly excited to announce that I’ve successfully finished building and deploying **ShelbyVault**, our decentralized storage dashboard natively running on the Aptos and Shelby networks! 

🔗 **Live Deployment:** [https://shelbyvault.netlify.app/](https://shelbyvault.netlify.app/)
💻 **GitHub Repository:** [https://github.com/learning1997/shelbyvault](https://github.com/learning1997/shelbyvault)

### 🛠️ Architecture & Core Infrastructure
The application is a beautiful, highly-responsive React & Vite Single Page Application (SPA). It intricately interacts with the Shelby Protocol SDK to encrypt, shard, and upload physical files directly into the decentralized storage layer.

Here is a breakdown of the complex infrastructure I built under the hood:

**1. Seamless Multi-Wallet Integration (AIP-62 Standards)**
Rather than relying on deprecated or legacy API injections, I fully integrated the official `@aptos-labs/wallet-adapter-react`. It flawlessly detects standards-compliant wallets like Petra and creates a secure tunnel for users to seamlessly approve dynamic contract interactions. 

**2. Bulletproof 3-Tier Data Indexing Algorithm**
Web3 GraphQL Indexers are notoriously slow to sync. If a user uploads a file, I didn't want them waiting manually to see it appear on their dashboard. I engineered a highly-resilient, three-tier data tracking mechanism:
- **Tier 1:** Native Storage Node Pinging (`https://api.shelbynet...`)
- **Tier 2:** Official Aptos/Shelby GraphQL Data Indexer
- **Tier 3:** Deep Blockchain Extraction (The DApp can synchronously scan raw Aptos wallet transactions just like a block-explorer to extract custom `register_blob` payloads). This guarantees *zero* delays!

**3. Dynamic Multi-Network Routing**
The dashboard actively listens to the user's live wallet network connection (e.g., `Shelbynet` vs `Testnet`) and dynamically translates all storage endpoints, indexer lookups, and transaction executions in real-time so nothing is artificially hardcoded.

**4. Browser-Native WASM Hashing**
When a user drops a file into the Dropzone, the system utilizes embedded polyfilled `Buffer` environments safely within the browser to natively compute ClayCode chunksets and complex Merkle Root commitments locally before prompting the user to sign the transaction. 

**5. Clean UI & Enterprise Data-Tables**
I constructed an entirely custom design system featuring sleek tokenized dark-mode components (`glassmorphism` dropzones), fully orchestrated data-table pagination logic (10 blobs per page), and dynamic metric synchronization that cleanly handles unlimited file quantities. 

**6. Flawless CI/CD Netlify Pipelines**
Heavily optimized the Vite core bundling environments ([vite.config.js](cci:7://file:///c:/Users/MANHA/Downloads/shelby-dapp/shelby-dapp-clean/vite.config.js:0:0-0:0) and [.npmrc](cci:7://file:///c:/Users/MANHA/Downloads/shelby-dapp/shelby-dapp-clean/.npmrc:0:0-0:0)) to securely decouple massive Web3 chunk sizes and resolve strict peer-dependency overrides so that our continuous deployment on Netlify compiles completely free of warnings.

Feel free to connect your Petra wallet, upload a few test files, and inspect the code over on GitHub! Let me know what you guys think! 🔥