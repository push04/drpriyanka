import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, serviceId, preferredDate, notes } = body;

        if (!name || !email || !serviceId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('waitlist')
            .insert({
                patient_name: name,
                patient_email: email,
                patient_phone: phone,
                service_id: serviceId,
                preferred_date: preferredDate,
                notes: notes,
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            console.error('Waitlist Error:', error);
            return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
        }

        return NextResponse.json({ success: true, entry: data });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
