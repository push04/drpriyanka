import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('medical_history')
            .select('*')
            .eq('patient_id', patientId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching patient history:', error);
            return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
        }

        return NextResponse.json({ history: data || null });

    } catch (error: any) {
        console.error('Admin patient history API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
