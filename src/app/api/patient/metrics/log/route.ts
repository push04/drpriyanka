import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { patientId, category, metricName, valueNumeric, unit, notes } = body;

        if (!patientId || !category || !metricName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('health_metrics')
            .insert({
                patient_id: patientId,
                category,
                metric_name: metricName,
                value_numeric: valueNumeric,
                unit,
                notes,
                entered_by: patientId // Self-logged
            })
            .select()
            .single();

        if (error) {
            console.error('Metrics Error:', error);
            return NextResponse.json({ error: 'Failed to log metric' }, { status: 500 });
        }

        return NextResponse.json({ success: true, metric: data });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
