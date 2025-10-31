// server/ingest.js
require('dotenv').config();
const {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  PrivateKey,
} = require('@hashgraph/sdk');

const operatorId = process.env.OPERATOR_ID;
const operatorKey = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY);
const client = Client.forTestnet(); // or Client.forMainnet()
client.setOperator(operatorId, operatorKey);

async function createTopic() {
  const tx = await new TopicCreateTransaction().execute(client);
  const receipt = await tx.getReceipt(client);
  return receipt.topicId.toString();
}

async function publish(topicId, message) {
  const tx = await new TopicMessageSubmitTransaction({
    topicId,
    message: Buffer.from(JSON.stringify(message)),
  }).execute(client);
  const receipt = await tx.getReceipt(client);
  return receipt;
}

run();
