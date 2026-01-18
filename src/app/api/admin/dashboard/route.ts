import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Run all queries in parallel
        const [
            todayAppointmentsResult,
            patientCountResult,
            pendingCountResult,
            recentAppointmentsResult,
            completedAppointmentsResult
        ] = await Promise.all([
            // 1. Today's Appointments Count
            supabaseAdmin
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .gte('start_time', `${today}T00:00:00`)
                .lte('start_time', `${today}T23:59:59`),

            // 2. Total Patients Count
            supabaseAdmin
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'patient'),

            // 3. Pending Requests Count
            supabaseAdmin
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending'),

            // 4. Recent Appointments with patient and service info
            supabaseAdmin
                .from('appointments')
                .select(`
                    id, 
                    start_time, 
                    status, 
                    patient_id,
                    service_id
                `)
                .order('created_at', { ascending: false })
                .limit(5),

            // 5. Completed appointments for revenue
            supabaseAdmin
                .from('appointments')
                .select('service_id')
                .eq('status', 'completed')
        ]);

        // Calculate Revenue
        let totalRevenue = 0;
        if (completedAppointmentsResult.data && completedAppointmentsResult.data.length > 0) {
            const serviceIds = [...new Set(completedAppointmentsResult.data.map(a => a.service_id).filter(Boolean))];

            if (serviceIds.length > 0) {
                const { data: services } = await supabaseAdmin
                    .from('services')
                    .select('id, price')
                    .in('id', serviceIds);

                const priceMap = new Map((services || []).map(s => [s.id, Number(s.price) || 0]));

                totalRevenue = completedAppointmentsResult.data.reduce((sum, apt) => {
                    return sum + (priceMap.get(apt.service_id) || 0);
                }, 0);
            }
        }

        // Fetch profile and service names for recent appointments
        let formattedRecent: any[] = [];
        if (recentAppointmentsResult.data && recentAppointmentsResult.data.length > 0) {
            const patientIds = [...new Set(recentAppointmentsResult.data.map(a => a.patient_id).filter(Boolean))];
            const serviceIds = [...new Set(recentAppointmentsResult.data.map(a => a.service_id).filter(Boolean))];

            const [profilesResult, servicesResult] = await Promise.all([
                patientIds.length > 0
                    ? supabaseAdmin.from('profiles').select('id, full_name').in('id', patientIds)
                    : Promise.resolve({ data: [] }),
                serviceIds.length > 0
                    ? supabaseAdmin.from('services').select('id, name').in('id', serviceIds)
                    : Promise.resolve({ data: [] })
            ]);

            const profilesMap = new Map((profilesResult.data || []).map(p => [p.id, p.full_name]));
            const servicesMap = new Map((servicesResult.data || []).map(s => [s.id, s.name]));

            formattedRecent = recentAppointmentsResult.data.map((apt: any) => {
                const date = new Date(apt.start_time);
                return {
                    id: apt.id,
                    patient: profilesMap.get(apt.patient_id) || "Unknown Patient",
                    service: servicesMap.get(apt.service_id) || "Service",
                    date: date.toLocaleDateString(),
                    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    datetime: `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, // Combined for display
                    status: apt.status
                };
            });
        }

        return NextResponse.json({
            stats: {
                todayAppointments: todayAppointmentsResult.count || 0,
                totalPatients: patientCountResult.count || 0,
                pendingRequests: pendingCountResult.count || 0,
                revenue: totalRevenue
            },
            recentAppointments: formattedRecent
        });

    } catch (error: any) {
        console.error('Dashboard data error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
