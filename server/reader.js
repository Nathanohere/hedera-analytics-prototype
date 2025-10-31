// server/reader.js
const { MirrorConsensusTopicQuery } = require("@hashgraph/sdk");
const client = Client.forTestnet();

new MirrorConsensusTopicQuery()
  .setTopicId("0.0.xxx")
  .subscribe(client, (response) => {
     const msg = Buffer.from(response.message).toString();
     const parsed = JSON.parse(msg);
     console.log("Received:", parsed);
     // store to SQLite/Postgres for analytics
  });
