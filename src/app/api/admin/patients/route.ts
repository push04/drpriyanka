import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('role', 'patient')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching patients:', error);
            return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
        }

        // Format the data
        const patients = (data || []).map(p => ({
            id: p.id,
            name: p.full_name || "Unknown",
            email: p.email,
            phone: p.phone || "N/A",
            status: 'Active',
            joined: new Date(p.created_at).toLocaleDateString()
        }));

        return NextResponse.json({ patients });

    } catch (error: any) {
        console.error('Patients API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
