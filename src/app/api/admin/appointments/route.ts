import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // Fetch all appointments
        const { data: appointments, error } = await supabaseAdmin
            .from('appointments')
            .select('*')
            .order('start_time', { ascending: false });

        if (error) {
            console.error('Error fetching appointments:', error);
            return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
        }

        // Get service names
        const serviceIds = [...new Set((appointments || []).map(a => a.service_id).filter(Boolean))];
        let servicesMap = new Map();

        if (serviceIds.length > 0) {
            const { data: services } = await supabaseAdmin
                .from('services')
                .select('id, name')
                .in('id', serviceIds);

            servicesMap = new Map((services || []).map(s => [s.id, s.name]));
        }

        // Format appointments
        const formattedAppointments = (appointments || []).map(apt => {
            const dateObj = new Date(apt.start_time);
            return {
                id: apt.id,
                patient_id: apt.patient_id, // Added for history lookup
                patient: apt.patient_name || "Guest Patient",
                service: servicesMap.get(apt.service_id) || "Service",
                date: dateObj.toLocaleDateString(),
                time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: apt.status,
                phone: apt.patient_phone || "N/A"
            };
        });

        return NextResponse.json({ appointments: formattedAppointments });

    } catch (error: any) {
        console.error('Appointments API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// CREATE new appointment
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            patient_name,
            patient_phone,
            patient_email,
            service_id,
            start_time,
            end_time,
            status = 'confirmed',
            notes
        } = body;

        // Validate required fields
        if (!patient_name || !service_id || !start_time) {
            return NextResponse.json({
                error: 'Missing required fields: patient_name, service_id, and start_time are required'
            }, { status: 400 });
        }

        // Calculate end_time if not provided (default 1 hour duration)
        const calculatedEndTime = end_time || new Date(new Date(start_time).getTime() + 60 * 60 * 1000).toISOString();

        const { data, error } = await supabaseAdmin
            .from('appointments')
            .insert({
                patient_name,
                patient_phone,
                patient_email,
                service_id,
                start_time: new Date(start_time).toISOString(),
                end_time: new Date(calculatedEndTime).toISOString(),
                status,
                notes
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating appointment:', error);
            return NextResponse.json({ error: 'Failed to create appointment', details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, appointment: data });

    } catch (error: any) {
        console.error('Appointment create API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// UPDATE appointment status
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status, patient_name, patient_phone, service_id, start_time, end_time, notes } = body;

        if (!id) {
            return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
        }

        // Build update object dynamically
        const updateData: any = {};
        if (status !== undefined) updateData.status = status;
        if (patient_name !== undefined) updateData.patient_name = patient_name;
        if (patient_phone !== undefined) updateData.patient_phone = patient_phone;
        if (service_id !== undefined) updateData.service_id = service_id;
        if (start_time !== undefined) updateData.start_time = new Date(start_time).toISOString();
        if (end_time !== undefined) updateData.end_time = new Date(end_time).toISOString();
        if (notes !== undefined) updateData.notes = notes;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('appointments')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating appointment:', error);
            return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
        }

        return NextResponse.json({ success: true, appointment: data });

    } catch (error: any) {
        console.error('Appointment update API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE appointment
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('appointments')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting appointment:', error);
            return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Appointment delete API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
