// server/ingest.js
require('dotenv').config();
const { Client, TopicCreateTransaction, TopicMessageSubmitTransaction, PrivateKey } = require("@hashgraph/sdk");
const fs = require('fs');
const csv = require('csv-parse');

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
    message: Buffer.from(JSON.stringify(message))
  }).execute(client);
  const receipt = await tx.getReceipt(client);
  return receipt;
}

async function run() {
  const topicId = await createTopic();
  console.log("Topic created:", topicId);

  // example: read CSV and publish each row
  fs.createReadStream('data/sample.csv')
    .pipe(csv({ columns: true }))
    .on('data', async (row) => {
      // transform to event (include a hash or id)
      const event = { id: row.id, payload: row, ts: Date.now() };
      await publish(topicId, event);
      console.log("Published event:", event.id);
    });
}

run();
