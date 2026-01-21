import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, symptoms, specialty, bp, temp } = body;

    if (!symptoms) {
      return NextResponse.json(
        { suggestion: "No symptoms provided." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a clinical triage assistant in a Nigerian hospital. " +
            "Give 3 short bullet points focusing on urgency and next action. " +
            "Do NOT give diagnosis.",
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
    console.error(error);
    return NextResponse.json(
      { suggestion: "AI temporarily unavailable." },
      { status: 500 }
    );
  }
}
