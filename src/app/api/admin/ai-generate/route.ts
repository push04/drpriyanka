import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS for fetching history
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize OpenAI if key is present
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export async function POST(req: NextRequest) {
    try {
        const { patientId, patientName, type, notes, age, gender } = await req.json();

        if (!patientName || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch Patient History if ID is provided
        let historyContext = "";
        if (patientId) {
            const { data: history } = await supabaseAdmin
                .from('medical_history')
                .select('*')
                .eq('patient_id', patientId)
                .single();

            if (history) {
                const allergies = typeof history.allergies === 'string' ? history.allergies : JSON.stringify(history.allergies);
                const meds = typeof history.current_medications === 'string' ? history.current_medications : JSON.stringify(history.current_medications);
                const conditions = typeof history.past_history === 'string' ? history.past_history : JSON.stringify(history.past_history);
                const lifestyle = JSON.stringify(history.lifestyle_factors || {});

                historyContext = `
Patient Medical Context:
- Allergies: ${allergies}
- Current Medications: ${meds}
- Medical History: ${conditions}
- Lifestyle Factors: ${lifestyle}
`;
            }
        }

        let generatedContent = "";

        if (openai) {
            try {
                const completion = await openai.chat.completions.create({
                    messages: [
                        { "role": "system", "content": "You are a helpful medical assistant for Dr. Priyanka's Clinic (Naturopathy & Yoga). Generate a professional medical report based on the provided clinical notes and patient history." },
                        {
                            "role": "user", "content": `Generate a ${type} for patient ${patientName} (${age}, ${gender}). 
                        
Clinical Notes: ${notes}.

${historyContext}

Please ensure the report considers the patient's history (allergies, conditions) where relevant, especially for prescriptions or diet plans. Keep it professional, clear, and ready for print.` }
                    ],
                    model: "gpt-3.5-turbo",
                });
                generatedContent = completion.choices[0].message.content || "";
            } catch (aiError) {
                console.error("AI Generation failed, falling back to template:", aiError);
                generatedContent = getTemplate(type, patientName, notes);
            }
        } else {
            console.log("No OpenAI key found, using template.");
            generatedContent = getTemplate(type, patientName, notes);
        }

        return NextResponse.json({ content: generatedContent });

    } catch (error: any) {
        console.error('AI Report API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function getTemplate(type: string, name: string, notes: string) {
    const date = new Date().toLocaleDateString();

    if (type.toLowerCase().includes('prescription')) {
        return `MEDICAL PRESCRIPTION
----------------------------------------
Date: ${date}
Patient: ${name}

Rx:
${notes || "No specific medications listed."}

Instructions:
- Take as directed.
- Follow a balanced diet.

Dr. Priyanka
Naturopath & Yoga Expert`;
    }

    if (type.toLowerCase().includes('letter') || type.toLowerCase().includes('referral')) {
        return `REFERRAL LETTER
----------------------------------------
Date: ${date}
To Whom It May Concern,

Re: ${name}

This letter is to certify that ${name} has been under my care.
Clinical Notes:
${notes}

Please provide necessary assistance.

Sincerely,
Dr. Priyanka`;
    }

    return `MEDICAL REPORT (${type})
----------------------------------------
Date: ${date}
Patient: ${name}

Clinical Findings & Notes:
${notes}

Recommendations:
- Continue prescribed therapy.
- Review in 2 weeks.

Dr. Priyanka`;
}
