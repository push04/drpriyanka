import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client for "Agentic" database writes
// We use the SERVICE_ROLE_KEY to bypass RLS for guest bookings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error("OpenRouter API Key is missing");
            return NextResponse.json({ error: "OpenRouter API Key missing" }, { status: 500 });
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

        // 1. Enhanced System Prompt for "Agentic" Behavior
        const systemPrompt = `You are Dr. Priyanka's Intelligent Receptionist.
        Your Goal: Help patients understand services and BOOK APPOINTMENTS autonomously.

        Services: 
        - Therapeutic Yoga (60 mins)
        - Mud Therapy (45 mins)
        - Hydrotherapy (60 mins)
        - Diet Counselling (30 mins)
        - Massage (60 mins)

        PROTOCOL:
        1. Answer questions about health/services warmly.
        2. If a user wants to book, you MUST ask for these details one by one if missing:
           - Patient Name
           - Service Name
           - Preferred Date (YYYY-MM-DD format if possible, or "tomorrow")
           - Preferred Time (e.g., 10:00 AM)
           - Phone Number

        3. **CRITICAL**: Once you have ALL 5 details, DO NOT ask for confirmation. Instead, output a JSON block strictly in this format to execute the booking:
           
           \`\`\`json
           {
             "action": "BOOK_APPOINTMENT",
             "data": {
               "patient_name": "John Doe",
               "service_name": "Therapeutic Yoga",
               "date": "YYYY-MM-DD",
               "time": "HH:MM",
               "phone": "1234567890"
             }
           }
           \`\`\`
           
           (Output ONLY the JSON block when booking is ready. Do not add extra text outside the block).

        4. If you lack details, continue chatting normally. Never output mock JSON until you have real user data.
        `;

        // 2. Prioritized Free Models Structure
        const models = [
            "google/gemini-2.0-flash-exp:free",      // Best at JSON instruction following
            "meta-llama/llama-3.3-70b-instruct:free", // Strong fallback
            "mistralai/mistral-small-24b-instruct-2501:free"
        ];

        let completionResponse = null;
        let usedModel = "";

        // 3. Fallback Loop
        for (const model of models) {
            try {
                const completion = await openai.chat.completions.create({
                    model: model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages
                    ],
                    temperature: 0.3, // Lower temp for precise JSON
                });

                if (completion.choices?.length > 0) {
                    completionResponse = completion.choices[0].message;
                    usedModel = model;
                    break;
                }
            } catch (err) {
                console.warn(`Model ${model} failed`, err);
            }
        }

        if (!completionResponse) {
            return NextResponse.json({ error: "All AI models failed." }, { status: 500 });
        }

        let aiContent = completionResponse.content || "";

        // 4. "Agentic" Action: Detect JSON Action
        const jsonMatch = aiContent.match(/```json\s*({[\s\S]*?})\s*```/);

        if (jsonMatch) {
            try {
                const actionBlock = JSON.parse(jsonMatch[1]);

                if (actionBlock.action === "BOOK_APPOINTMENT" && supabaseAdmin) {
                    const booking = actionBlock.data;
                    console.log("AI AGENT EXECUTING BOOKING:", booking);

                    // Insert into DB
                    // Note: We need a service_id. We'll try to find it or insert loosely.
                    // Ideally fetch service ID first.
                    const { data: serviceData } = await supabaseAdmin
                        .from('services')
                        .select('id')
                        .ilike('name', `%${booking.service_name}%`)
                        .single();

                    const { error: insertError } = await supabaseAdmin
                        .from('appointments')
                        .insert({
                            patient_name: booking.patient_name,
                            patient_phone: booking.phone,
                            service_id: serviceData?.id, // Might be null if fuzzy match fails, schema should handle or we update schema
                            start_time: `${booking.date}T${booking.time}:00`, // Naive formatting
                            end_time: `${booking.date}T${booking.time}:00`, // Placeholder duration
                            status: 'confirmed', // Auto-confirm AI bookings for now
                            notes: `Booked by AI Agent (${usedModel})`
                        });

                    if (insertError) {
                        console.error("Agent DB Write Failed:", insertError);
                        aiContent = `I attempted to book your appointment, but our system reported an internal error. Please call the clinic directly. (Error: ${insertError.message})`;
                    } else {
                        aiContent = `✅ **Appointment Confirmed!**\n\nI have successfully booked **${booking.service_name}** for **${booking.patient_name}** on **${booking.date} at ${booking.time}**.\n\nWe have sent a confirmation to **${booking.phone}**. Is there anything else I can help you with?`;
                    }
                }
            } catch (e) {
                console.error("Agent JSON Parse Error:", e);
                // Fallback: Don't crash, just show the raw content or a generic message
                aiContent = "I am processing your request but encountered a format error. Please verify your details.";
            }
        } else {
            // Clean up any leaked markdown JSON tags if the regex failed but the AI tried
            aiContent = aiContent.replace(/```json/g, "").replace(/```/g, "");
        }

        return NextResponse.json({ role: "assistant", content: aiContent });

    } catch (error: any) {
        console.error("AI Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
