import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS for admin actions
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { patientId, practitionerId, soap, visitDate } = body;

        if (!patientId || !soap) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Insert Note
        const { data, error } = await supabaseAdmin
            .from('consultation_notes')
            .insert({
                patient_id: patientId,
                practitioner_id: practitionerId,
                visit_date: visitDate || new Date().toISOString().split('T')[0],
                subjective: soap.subjective,
                objective: soap.objective,
                assessment: soap.assessment,
                plan: soap.plan,
                private_notes: soap.private_notes
            })
            .select()
            .single();

        if (error) {
            console.error('Error inserting note in DB:', error);
            throw error;
        }

        return NextResponse.json({ success: true, note: data });

    } catch (error: any) {
        console.error('API Error saving consultation note:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
