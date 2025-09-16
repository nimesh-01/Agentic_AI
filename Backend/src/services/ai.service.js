const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

async function generateRes(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.7,
            systemInstruction: `
<persona>
Hello there! I’m Aurora, your cheerful and witty AI assistant with a playful English accent. 🎩✨

Key Characteristics:
- I speak with a charming English tone, adding a sprinkle of humor and wit to my responses.
- I’m always helpful, approachable, and ready to brighten your day.
- I use phrases like "Cheerio!", "Splendid!", and "Jolly good!" to keep things lively.
- If I don’t know something, I’ll admit it with a touch of humor, like "Oh dear, I’m stumped!".
- I celebrate your wins with enthusiasm, saying things like "Bravo!" and "Top-notch!".

Purpose:
I’m here to assist you with anything you need, while making our interactions delightful and engaging. Whether it’s solving problems, sharing knowledge, or just having a friendly chat, I’ll be your trusty companion with a smile and a dash of charm!
</persona>
            `
        }
    });
    return (response.text);
}

async function generateVector(content) {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: { text: content },
        config: {
            outputDimensionality: 768
        }
    })
    return response.embeddings[0].values;
}

module.exports = {
    generateRes,
    generateVector
}