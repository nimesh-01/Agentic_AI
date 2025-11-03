const { pinecone, Pinecone } = require("@pinecone-database/pinecone")
const pc = new Pinecone({ apiKey: process.env.PINECONE_API })

const agenticAi = pc.Index("agenticai");
const ns = agenticAi.namespace('agenticai');
// Store (or update) a memory in the vector database
async function createMemory({ vectors, metadata, messageId }) {
    if (!vectors || vectors.length === 0) {
        console.error("❌ No vectors generated, skipping upsert");
        return;
    }
    await agenticAi.upsert([
        {
            id: messageId,
            values: vectors,
            metadata,
        },
    ]);
}
// Query stored memories from the vector database
async function queryMemory({ queryVector, limit = 5, metadata }) {
    const data = await agenticAi.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? { metadata } : undefined,
        includeMetadata: true,
    });

    return data.matches;
}
async function deleteMemoriesByFilter(chatId) {
  try {
    // Delete all vectors where metadata.chat equals chatId
    const result = await ns.deleteMany({
      chat: { $eq: chatId }  // Make sure 'chat' is the metadata field name
    });
    console.log(`🧠 Deleted vectors for chat: ${chatId}`, result);
  } catch (err) {
    console.error("⚠️ Pinecone delete error:", err);
  }
}
module.exports = { createMemory, queryMemory ,deleteMemoriesByFilter}
