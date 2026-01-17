import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client dynamically to avoid build-time errors
export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error("OpenRouter API Key is missing");
            return NextResponse.json(
                { error: "OpenRouter API Key configuration missing" },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            defaultHeaders: {
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://drpriyankaclinic.com",
                "X-Title": "Dr. Priyanka Clinic",
            },
        });

        const { messages } = await req.json();

        // List of free models to try in order of preference
        const models = [
            "google/gemini-2.0-flash-exp:free",      // Fast & Intelligent
            "meta-llama/llama-3.3-70b-instruct:free", // Strong Reasoning
            "mistralai/mistral-small-24b-instruct-2501:free", // Balanced
            "qwen/qwen2.5-vl-7b-instruct:free",       // Good fallback
            "nvidia/llama-3.1-nemotron-70b-instruct:free" // Another robust option
        ];

        let lastError = null;

        for (const model of models) {
            try {
                // console.log(`Attempting with model: ${model}`); 
                const completion = await openai.chat.completions.create({
                    model: model,
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

                if (!completion.choices || completion.choices.length === 0) {
                    throw new Error("No completion choices returned");
                }

                // If successful, return immediately
                return NextResponse.json(completion.choices[0].message);
            } catch (error: any) {
                console.warn(`Model ${model} failed:`, error.message);
                lastError = error;
                // Continue to next model
            }
        }

        // If all models fail
        console.error("All AI models failed:", lastError);
        return NextResponse.json({ error: "Failed to generate response from all available models. Please try again later." }, { status: 500 });

    } catch (error: any) {
        console.error("AI Implementation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
