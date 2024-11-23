require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Define reusable methods for interacting with the API
const generateContent = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return result;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
};

module.exports = { generateContent };
