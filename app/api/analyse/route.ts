import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq SDK with environment variable
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { name, symptoms, specialty, bp, temp } = await req.json();

    // Call Groq AI model
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a clinical triage assistant in a Nigerian hospital. " +
            "Provide 3 short bullet points focusing on urgency and next steps. " +
            "Do NOT diagnose, only advise clinically."
        },
        {
          role: "user",
          content: `
Patient: ${name || "Unknown"}
Specialty: ${specialty}
BP: ${bp || "N/A"}
Temp: ${temp || "N/A"}
Symptoms: ${symptoms}
          `,
        },
      ],
      temperature: 0.2,
      max_tokens: 150,
    });

    return NextResponse.json({
      suggestion: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { suggestion: "AI temporarily unavailable." },
      { status: 500 }
    );
  }
}
