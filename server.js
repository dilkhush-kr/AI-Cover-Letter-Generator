import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { name, role, company, skills } = req.body;

  const prompt = `
You are a professional HR writer.

Write a UNIQUE and HUMAN-LIKE cover letter using the details below.

Candidate Name: ${name}
Job Role: ${role}
Company Name: ${company}
Skills: ${skills}

Rules:
- Do NOT use generic or repeated sentences
- Connect skills with job role
- Keep professional tone
- Write 3 short paragraphs
- End with candidate name
- Make it different every time
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("\n");

    if (!text) throw new Error("No Gemini response");

    res.json({ text });
  } catch (error) {
    res.json({
      text: `Dear Hiring Manager,

I am excited to apply for the ${role} role at ${company}. My skills in ${skills} make me confident in contributing effectively to your team.

I am eager to learn, grow, and add value to your organization.

Sincerely,
${name}`,
    });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
