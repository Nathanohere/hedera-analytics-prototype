// scripts/deploy_contract.js
// Deploys the compiled hex bytecode to Hedera testnet using Hedera SDK's ContractCreateFlow

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, PrivateKey, ContractCreateFlow } = require('@hashgraph/sdk');

async function main() {
  const operatorId = process.env.OPERATOR_ID;
  const operatorKey = process.env.OPERATOR_KEY;
  if (!operatorId || !operatorKey) {
    console.error('Please set OPERATOR_ID and OPERATOR_KEY in .env');
    process.exit(1);
  }

  const client = Client.forTestnet();
  client.setOperator(operatorId, PrivateKey.fromStringECDSA(operatorKey));

  const hexPath = path.join(
    __dirname,
    '..',
    'contracts',
    'ComplianceBytecode.hex'
  );
  if (!fs.existsSync(hexPath)) {
    console.error(
      'ComplianceBytecode.hex not found. Run `npm run build:bytecode` first.'
    );
    process.exit(1);
  }

  const bytecodeHex = fs.readFileSync(hexPath, 'utf8').trim();
  if (!bytecodeHex) {
    console.error('Bytecode hex is empty');
    process.exit(1);
  }

  console.log(
    'Deploying contract (bytecode size:',
    bytecodeHex.length / 2,
    'bytes) ...'
  );

  // ContractCreateFlow expects the bytecode as Buffer
  const createTx = await new ContractCreateFlow()
    .setBytecode(Buffer.from(bytecodeHex, 'hex'))
    .setGas(300000)
    .execute(client);

  const receipt = await createTx.getReceipt(client);
  const contractId = receipt.contractId.toString();
  console.log('Contract deployed with ID:', contractId);
  console.log(
    'Save this contractId (e.g., in your .env as COMPLIANCE_CONTRACT_ID)'
  );
}

main().catch((err) => {
  console.error('Deploy error:', err);
  process.exit(1);
});
