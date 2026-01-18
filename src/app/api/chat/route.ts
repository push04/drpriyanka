import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client safely
let supabaseAdmin: any = null;
try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
        supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    } else {
        console.warn("⚠️ AI Agent: Missing Supabase Service Key. Booking capabilities will be disabled.");
    }
} catch (configError) {
    console.error("⚠️ AI Agent: Failed to initialize Supabase Admin:", configError);
}

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error("❌ OpenRouter API Key is missing");
            return NextResponse.json({ error: "Configuration Error: OpenRouter API Key missing." }, { status: 500 });
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            defaultHeaders: {
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://drpriyankaclinic.com",
                "X-Title": "Dr. Priyanka Clinic",
            },
        });

        const body = await req.json();
        const { messages, userId, sessionId } = body;

        if (!messages) {
            return NextResponse.json({ error: "Bad Request: No messages provided." }, { status: 400 });
        }

        const latestUserMessage = messages[messages.length - 1];

        // 0. LOG USER MESSAGE (Async, don't block)
        if (supabaseAdmin && (userId || sessionId) && latestUserMessage.role === 'user') {
            supabaseAdmin.from('chat_logs').insert({
                user_id: userId || null,
                session_id: sessionId || 'unknown',
                role: 'user',
                content: latestUserMessage.content
            }).then(({ error }: any) => {
                if (error) console.error("Failed to log user message:", error);
            });
        }

        // 1. Enhanced System Prompt & FAQs
        const systemPrompt = `You are Dr. Priyanka's Intelligent Receptionist.
        Your Goal: Help patients understand services, answer FAQs, and BOOK APPOINTMENTS autonomously.

        Services: 
        - Therapeutic Yoga (60 mins)
        - Mud Therapy (45 mins)
        - Hydrotherapy (60 mins)
        - Diet Counselling (30 mins)
        - Massage (60 mins)

        FAQs:
        - "Do you take insurance?" -> "We currently do not accept direct insurance billing, but we can provide an invoice for you to submit."
        - "What should I bring?" -> "Please bring any recent medical reports and wear comfortable clothing."
        - "Where are you located?" -> "We are located at [Clinic Address, City]. We are open Mon-Sat 9AM-7PM."
        - "Is Naturopathy safe?" -> "Yes, it is a non-invasive, drug-less system of medicine focusing on natural healing."
        
        PROTOCOL:
        1. Answer questions about health/services/FAQs warmly.
        2. If a user wants to book, you MUST ask for these details one by one if missing:
           - Patient Name
           - Service Name
           - Preferred Date (YYYY-MM-DD format if possible, or "tomorrow")
           - Preferred Time (e.g., 10:00 or 14:00 - USE 24-HOUR FORMAT)
           - Phone Number

        3. **CRITICAL**: Once you have ALL 5 details, output a JSON block strictly in this format:
           
           \`\`\`json
           {
             "action": "BOOK_APPOINTMENT",
             "data": {
               "patient_name": "NAME",
               "service_name": "SERVICE",
               "date": "YYYY-MM-DD",
               "time": "HH:MM",
               "phone": "PHONE"
             }
           }
           \`\`\`
           
        4. If you lack details, continue chatting normally. Do not output JSON until ready.
        `;

        // 2. Prioritized Free Models (Based on User Research - Agentic & High Performance)
        const models = [
            "xiaomi/mimo-v2-flash",                   // Tier 1: Top #1 Open Source, Agentic support
            "deepseek/deepseek-r1-0528",              // Tier 1: O1-level performance
            "google/gemma-3-27b-it",                  // Tier 2: Strong structured output (Instruction Tuned)
            "meta-llama/llama-3.3-70b-instruct:free", // Tier 2: Reliable fallback
        ];

        let completionResponse = null;
        let usedModel = "";
        let rateLimitHit = false;

        // 3. Fallback Loop
        for (const model of models) {
            try {
                const completion = await openai.chat.completions.create({
                    model: model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages
                    ],
                    temperature: 0.3,
                });

                if (completion.choices?.length > 0) {
                    completionResponse = completion.choices[0].message;
                    usedModel = model;
                    break;
                }
            } catch (err: any) {
                console.warn(`Model ${model} failed:`, err.message || err);
                if (err?.status === 429) {
                    rateLimitHit = true;
                }
            }
        }

        // Handle Safe Failure
        if (!completionResponse) {
            if (rateLimitHit) {
                return NextResponse.json({
                    role: "assistant",
                    content: "⚠️ **System Notice**: My daily interaction limit has been reached. Please call the clinic directly at +91 98765 43210 to book your appointment."
                });
            }
            return NextResponse.json({ error: "All AI models failed." }, { status: 503 });
        }

        let aiContent = completionResponse.content || "";
        let actionMetadata = {};

        // 4. "Agentic" Action: Detect JSON Action
        // We use a broader regex to catch partial code blocks
        const jsonMatch = aiContent.match(/```json\s*({[\s\S]*?})\s*```/);

        if (jsonMatch) {
            console.log("🤖 AI Agent: Action Detected");

            // If Supabase is NOT configured, we cannot book.
            if (!supabaseAdmin) {
                console.error("❌ Agent Error: Cannot book. Supabase Admin client is null.");
                aiContent = "I have all your details, but our booking system is currently undergoing maintenance. Please call the clinic directly to confirm this appointment.";
            } else {
                try {
                    const actionBlock = JSON.parse(jsonMatch[1]);

                    if (actionBlock.action === "BOOK_APPOINTMENT") {
                        const booking = actionBlock.data;
                        actionMetadata = { action: "BOOK_APPOINTMENT", booking_data: booking };

                        // Find Service ID (Loose match)
                        const { data: serviceData } = await supabaseAdmin
                            .from('services')
                            .select('id')
                            .ilike('name', `%${booking.service_name}%`)
                            .limit(1)
                            .maybeSingle();

                        // SANITIZATION: Clean up time format
                        let cleanTime = booking.time.toUpperCase().replace(/(AM|PM)/g, '').trim();
                        if (cleanTime.split(':').length === 1) cleanTime += ":00"; // Handle "10" -> "10:00"
                        if (cleanTime.length === 4) cleanTime = "0" + cleanTime; // Handle "9:00" -> "09:00"

                        const { error: insertError } = await supabaseAdmin
                            .from('appointments')
                            .insert({
                                patient_name: booking.patient_name,
                                patient_phone: booking.phone,
                                service_id: serviceData?.id || null,
                                start_time: `${booking.date}T${cleanTime}:00`,
                                end_time: `${booking.date}T${cleanTime}:00`,
                                status: 'confirmed',
                                notes: `Booked by AI Agent (${usedModel})`
                            });

                        if (insertError) {
                            console.error("❌ Agent DB Write Failed:", insertError);
                            aiContent = `I attempted to book, but encountered an error. Please call us. (System Error: ${insertError.message})`;
                            actionMetadata = { ...actionMetadata, success: false, error: insertError.message };
                        } else {
                            aiContent = `✅ **Appointment Confirmed!**\n\nI have successfully booked **${booking.service_name}** for **${booking.patient_name}** on **${booking.date} at ${booking.time}**.\n\nConfirmation sent to **${booking.phone}**.`;
                            actionMetadata = { ...actionMetadata, success: true };
                        }
                    }
                } catch (e) {
                    console.error("❌ Agent JSON Parse/Execute Error:", e);
                    aiContent = "I encountered an error processing your booking request. Please check your details.";
                }
            }
        } else {
            // Cleanup any stray backticks just in case
            aiContent = aiContent.replace(/```json/g, "").replace(/```/g, "");
        }

        // 5. LOG ASSISTANT RESPONSE
        if (supabaseAdmin && (userId || sessionId)) {
            await supabaseAdmin.from('chat_logs').insert({
                user_id: userId || null,
                session_id: sessionId || 'unknown',
                role: 'assistant',
                content: aiContent,
                metadata: {
                    model: usedModel,
                    ...actionMetadata
                }
            });
        }

        return NextResponse.json({ role: "assistant", content: aiContent });

    } catch (error: any) {
        console.error("❌ General AI Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
