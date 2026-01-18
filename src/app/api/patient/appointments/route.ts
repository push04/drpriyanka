import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Use service role to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to get current user from auth cookie or header
async function getAuthenticatedUser(req: NextRequest) {
    try {
        // 1. Check Authorization Header
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
            if (user && !error) return user;
        }

        // 2. Fallback to Cookies
        const cookieStore = await cookies();

        // Look for Supabase auth token in cookies
        const allCookies = cookieStore.getAll();

        for (const cookie of allCookies) {
            if (cookie.name.includes('auth-token') || cookie.name.includes('sb-')) {
                try {
                    // Try to parse the cookie value
                    let tokenData;
                    try {
                        tokenData = JSON.parse(cookie.value);
                    } catch {
                        // If it's not JSON, it might be a direct token
                        continue;
                    }

                    // Get access token from the parsed data
                    const accessToken = tokenData?.access_token || tokenData?.[0]?.access_token;

                    if (accessToken) {
                        const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
                        if (user && !error) {
                            return user;
                        }
                    }
                } catch (e) {
                    // Continue to next cookie
                }
            }
        }

        return null;
    } catch (error) {
        console.error('Error getting authenticated user:', error);
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        // Get current authenticated user
        const user = await getAuthenticatedUser(req);

        let appointments: any[] = [];

        if (user) {
            // Fetch appointments by patient_id OR patient_email
            const { data, error } = await supabaseAdmin
                .from('appointments')
                .select('*')
                .or(`patient_id.eq.${user.id},patient_email.eq.${user.email}`)
                .order('start_time', { ascending: false });

            if (error) {
                console.error('Error fetching patient appointments:', error);
            } else {
                appointments = data || [];
            }
        } else {
            // If no authenticated user, return empty
            return NextResponse.json({ appointments: [], message: 'Not authenticated' });
        }

        // Get service names
        const serviceIds = [...new Set(appointments.map(a => a.service_id).filter(Boolean))];
        let servicesMap = new Map();

        if (serviceIds.length > 0) {
            const { data: services } = await supabaseAdmin
                .from('services')
                .select('id, name, duration')
                .in('id', serviceIds);

            servicesMap = new Map((services || []).map(s => [s.id, { name: s.name, duration: s.duration }]));
        }

        // Format appointments
        const formattedAppointments = appointments.map(apt => {
            const service = servicesMap.get(apt.service_id);
            return {
                id: apt.id,
                service_id: apt.service_id,
                patient_id: apt.patient_id,
                patient_name: apt.patient_name,
                patient_email: apt.patient_email,
                start_time: apt.start_time,
                end_time: apt.end_time,
                status: apt.status,
                notes: apt.notes,
                service_name: service?.name || "Consultation",
                duration: service?.duration || "60 min"
            };
        });

        return NextResponse.json({ appointments: formattedAppointments });

    } catch (error: any) {
        console.error('Patient appointments API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Update appointment status (for cancellation by patient)
export async function PATCH(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
        }

        // Verify the appointment belongs to this user
        if (user) {
            const { data: apt } = await supabaseAdmin
                .from('appointments')
                .select('patient_id, patient_email')
                .eq('id', id)
                .single();

            if (apt && apt.patient_id !== user.id && apt.patient_email !== user.email) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        const { data, error } = await supabaseAdmin
            .from('appointments')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating appointment:', error);
            return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
        }

        return NextResponse.json({ success: true, appointment: data });

    } catch (error: any) {
        console.error('Patient appointment update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
