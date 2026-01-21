import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq SDK with env variable
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { name, symptoms, specialty, bp, temp } = await req.json();

    console.log("Received request:", { name, symptoms, specialty, bp, temp });
    console.log("GROQ API Key exists?", !!process.env.GROQ_API_KEY);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a clinical triage assistant in a Nigerian hospital. " +
            "Provide 3 short bullet points focusing on urgency and next steps. " +
            "Do NOT diagnose, only advise clinically.",
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

    console.log("AI Response:", completion.choices[0].message.content);

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
