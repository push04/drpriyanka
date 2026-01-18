import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin.from('conditions').select('*').order('created_at', { ascending: false });
        if (error) {
            // Check if error is 'relation does not exist' - this means table is missing.
            // We can return empty array to prevent UI crash if table doesn't exist yet (user needs to run migration)
            if (error.code === '42P01') {
                return NextResponse.json({ conditions: [] });
            }
            throw error;
        }
        return NextResponse.json({ conditions: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, service_id } = body;

        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        const { data, error } = await supabaseAdmin
            .from('conditions')
            .insert([{ name, service_id: service_id || null }])
            .select();

        if (error) throw error;
        return NextResponse.json({ condition: data[0] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
