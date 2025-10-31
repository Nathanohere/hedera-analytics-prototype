// server/ingest.js
require('dotenv').config();
const {
    Client,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    PrivateKey,
} = require('@hashgraph/sdk');

// --- Configuration ---

// **Crucial Check:** Determine if your key is ED25519 (standard) or ECDSA (Solidity-compatible)
// Use PrivateKey.fromString() for standard keys, or PrivateKey.fromStringECDSA() for EVM keys.
const operatorId = process.env.OPERATOR_ID;
// Assuming you are using a standard Hedera ED25519 key for a Testnet account:
const operatorKey = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY); 

// Initialize the Hedera client
const client = Client.forTestnet();
client.setOperator(operatorId, operatorKey);

// --- Hedera HCS Functions ---

async function createTopic() {
    console.log("Creating new HCS Topic...");
    // 1. Create the transaction
    const tx = await new TopicCreateTransaction().execute(client);
    
    // 2. Wait for the transaction to be finalized and get the receipt
    const receipt = await tx.getReceipt(client);
    
    const topicId = receipt.topicId.toString();
    console.log(`✅ Topic successfully created with ID: ${topicId}`);
    return topicId;
}

async function publish(topicId, message) {
    console.log(`Submitting message to topic ${topicId}...`);
    
    // 1. Create the transaction with the message as a Buffer (byte array)
    const tx = await new TopicMessageSubmitTransaction({
        topicId,
        // Convert the JavaScript object to a JSON string, then to a byte buffer
        message: Buffer.from(JSON.stringify(message)),
    }).execute(client);
    
    // 2. Wait for the transaction to be finalized and get the receipt
    const receipt = await tx.getReceipt(client);
    
    console.log(`✅ Message submitted. Status: ${receipt.status.toString()}`);
    return receipt;
}

// --- Main Execution Logic ---

// The main async function to run the process
async function run() {
    try {
        if (!operatorId || !process.env.OPERATOR_KEY) {
            console.error("❌ ERROR: OPERATOR_ID and OPERATOR_KEY must be set in your .env file.");
            return;
        }
        
        // 1. Create the Topic
        const newTopicId = await createTopic();

        // 2. Define a sample legacy data event
        const sampleEvent = {
            ShipmentID: 'S999',
            Location: 'DockingBayA',
            Temperature: 24.5,
            DataHash: '9a31e8d4c3f5b7a1d9e0f2c3a4b5d6e7f8a9b0c1', // SHA-256 of the data
            Note: 'This hash provides immutable proof of the data at time of ingestion.'
        };

        // 3. Publish the event to HCS
        await publish(newTopicId, sampleEvent);

        console.log("\n🚀 All operations completed successfully.");

    } catch (error) {
        console.error("\n❌ An error occurred during the Hedera transaction flow:");
        console.error(error);
        
        // Ensure the client is closed on error
        if (client) {
            client.close();
        }
    } finally {
        // Ensure the client is closed once the program finishes
        if (client) {
            client.close();
        }
    }
}

// **FIX:** Call the main asynchronous function to start the script.
run();