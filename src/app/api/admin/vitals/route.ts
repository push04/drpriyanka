import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('health_metrics')
            .select('*')
            .order('recorded_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching health metrics:', error);
            return NextResponse.json({ error: 'Failed to fetch health metrics' }, { status: 500 });
        }

        // Get patient names for the records
        const patientIds = [...new Set((data || []).map(m => m.patient_id).filter(Boolean))];
        let profilesMap = new Map();

        if (patientIds.length > 0) {
            const { data: profiles } = await supabaseAdmin
                .from('profiles')
                .select('id, full_name, email')
                .in('id', patientIds);

            profilesMap = new Map((profiles || []).map(p => [p.id, { full_name: p.full_name, email: p.email }]));
        }

        // Add profile info to metrics
        const metricsWithProfiles = (data || []).map(m => ({
            ...m,
            profiles: profilesMap.get(m.patient_id) || null
        }));

        return NextResponse.json({ metrics: metricsWithProfiles });

    } catch (error: any) {
        console.error('Vitals API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
