// server.js
require('dotenv').config();
const express = require('express');
const { Client, PrivateKey, ContractCallQuery, Hbar } = require('@hashgraph/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ Hedera Analytics Prototype API is running.');
});

app.get('/verify', async (req, res) => {
  try {
    const client = Client.forTestnet()
      .setOperator(process.env.OPERATOR_ID, PrivateKey.fromString(process.env.OPERATOR_KEY));

    const query = new ContractCallQuery()
      .setContractId(process.env.COMPLIANCE_CONTRACT_ID)
      .setGas(100000)
      .setFunction('getComplianceData')
      .setMaxQueryPayment(new Hbar(1));

    const result = await query.execute(client);
    res.json({
      status: 'success',
      contractId: process.env.COMPLIANCE_CONTRACT_ID,
      response: result.toString(),
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
