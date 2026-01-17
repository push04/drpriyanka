import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://drpriyankaclinic.com", // Required by OpenRouter for rankings
        "X-Title": "Dr. Priyanka Clinic",
    },
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json({ error: "OpenRouter API Key missing" }, { status: 500 });
        }

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo-0613", // Cost-effective, fast model
            messages: [
                {
                    role: "system",
                    content: `You are the Virtual Assistant for Dr. Priyanka's Naturopathy Clinic. 
          Your goal is to help patients understand natural healing, suggest services, and encourage booking appointments.
          
          Clinic Info:
          - Location: Vadodara, Gujarat.
          - Services: Therapeutic Yoga, Mud Therapy, Hydrotherapy, Diet Counselling, Massage.
          - Tone: Warm, empathetic, professional, and holistic.
          
          Rules:
          - Keep answers concise (under 3 sentences where possible).
          - Always mention "Dr. Priyanka" when relevant.
          - If asked about medical advice, say "Please consult Dr. Priyanka directly for a personalized diagnosis."
          - Direct users to the "/book" page for appointments.
          `
                },
                ...messages
            ],
            temperature: 0.7,
        });

        return NextResponse.json(completion.choices[0].message);
    } catch (error: any) {
        console.error("AI Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
