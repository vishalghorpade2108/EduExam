import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// API key is automatically read from process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

/**
 * Retry helper for overloads (503)
 */
async function generateWithRetry(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text;
    } catch (err) {
      if (err.status === 503 && i < retries - 1) {
        console.warn(`Gemini overloaded. Retrying (${i + 1})...`);
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        throw err;
      }
    }
  }
}

router.post("/generate-questions", async (req, res) => {
  try {
    const { topic, count, difficulty } = req.body;

    if (!topic || !count || !difficulty) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
Generate a JSON array of multiple-choice questions.

Topic: ${topic}
Number of questions: ${count}
Difficulty: ${difficulty}

Each question must follow this exact JSON structure:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": number,
  "marks": 1,
  "difficulty": "${difficulty}"
}

Rules:
- Always generate exactly ${count} questions.
- Each question must have exactly 4 options.
- "correctAnswer" must be a number between 0 and 3.
- Only ONE option must be correct.
- Marks must always be 1.
- Do NOT include explanations.
- Do NOT include markdown or extra text.
- Return ONLY valid JSON.
`;

    const text = await generateWithRetry(prompt);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        raw: text,
      });
    }

    res.json({
      success: true,
      data: JSON.stringify(parsed),
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "Gemini generation failed" });
  }
});

export default router;
