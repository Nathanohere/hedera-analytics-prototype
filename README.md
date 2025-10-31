# Hedera Analytics Prototype


This repository is a scaffold to demonstrate how Hedera DLT (HCS, HTS, HSCS) can integrate with traditional analytics workflows. It contains:


- `server/ingest.js` — ingest legacy CSV rows and publish them to an HCS topic.
- `server/reader.js` — subscribe to the HCS mirror and persist ordered events to a local SQLite analytics DB.
- `server/token.js` — create a simple HTS token (DataAccessToken) as an example of tokenized access.
- `contracts/Compliance.sol` — a simple Solidity contract used to anchor dataset hashes (for verification).
- `server/deploy_contract.js` — helper script to deploy the compiled contract using Hedera SDK (requires compiled bytecode).
- `ui/index.html` — a small front-end showing events, aggregated analytics and an on-chain verification button.


## Quickstart (development / testnet)


1. Clone the repo
```bash
git clone <your-repo-url>
cd hedera-analytics-prototype