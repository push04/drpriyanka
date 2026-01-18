import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        // Run queries in parallel
        const [profileResult, healthResult, appointmentsResult] = await Promise.all([
            // 1. Fetch Profile
            supabaseAdmin
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single(),

            // 2. Fetch Health Record (most recent)
            supabaseAdmin
                .from('patient_health_records')
                .select('*')
                .eq('patient_id', id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle(),

            // 3. Fetch Appointments
            supabaseAdmin
                .from('appointments')
                .select('*')
                .eq('patient_id', id)
                .order('start_time', { ascending: false })
        ]);

        if (profileResult.error || !profileResult.data) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        // Get service names for appointments
        let appointmentsWithServices = [];
        if (appointmentsResult.data && appointmentsResult.data.length > 0) {
            const serviceIds = [...new Set(appointmentsResult.data.map(a => a.service_id).filter(Boolean))];

            if (serviceIds.length > 0) {
                const { data: services } = await supabaseAdmin
                    .from('services')
                    .select('id, name')
                    .in('id', serviceIds);

                const servicesMap = new Map((services || []).map(s => [s.id, s.name]));

                appointmentsWithServices = appointmentsResult.data.map(apt => ({
                    ...apt,
                    services: { name: servicesMap.get(apt.service_id) || 'Consultation' }
                }));
            } else {
                appointmentsWithServices = appointmentsResult.data.map(apt => ({
                    ...apt,
                    services: { name: 'Consultation' }
                }));
            }
        }

        return NextResponse.json({
            patient: profileResult.data,
            healthRecord: healthResult.data,
            appointments: appointmentsWithServices
        });

    } catch (error: any) {
        console.error('Patient detail API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
