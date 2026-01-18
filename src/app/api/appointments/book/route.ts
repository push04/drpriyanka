import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

import { cookies } from 'next/headers';

// Initialize Supabase Admin Client for database writes
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getAuthenticatedUser(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
            if (user && !error) return user;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { serviceId, date, time, name, email, phone, recurrence, sessions } = body;

        if (!serviceId || !date || !time || !name || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const recurrenceType = recurrence || 'none';
        const numSessions = sessions || 1;
        const recurringGroupId = numSessions > 1 ? uuidv4() : null;

        const appointmentsToInsert = [];
        let currentDate = new Date(`${date}T${time}:00`);

        // Check if user exists to link profile
        let patientId = null;

        // 1. Try secure auth first
        const user = await getAuthenticatedUser(req);
        if (user) {
            patientId = user.id;
        }
        // 2. Fallback to email match (if unauthenticated booking allowed)
        else if (email) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', email)
                .single();
            if (profile) patientId = profile.id;
        }

        // Generate Appointment Slots
        for (let i = 0; i < numSessions; i++) {
            // Check Availability logic would go here (omitted for MVP speed, but critical for prod)
            // For now, we assume availability or let Supabase constraints handle overlap if set.

            appointmentsToInsert.push({
                patient_id: patientId, // Link if exists
                patient_name: name,
                patient_email: email,
                patient_phone: phone,
                service_id: serviceId,
                start_time: currentDate.toISOString(),
                end_time: new Date(currentDate.getTime() + 60 * 60 * 1000).toISOString(), // Default 1 hour duration
                status: 'confirmed',
                recurring_group_id: recurringGroupId,
                notes: numSessions > 1 ? `Session ${i + 1} of ${numSessions} (${recurrenceType})` : 'Web Booking'
            });

            // Increment Date based on Recurrence
            if (recurrenceType === 'weekly') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (recurrenceType === 'monthly') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }

        // Batch Insert
        const { data, error } = await supabaseAdmin
            .from('appointments')
            .insert(appointmentsToInsert)
            .select();

        if (error) {
            console.error('Booking Error:', error);
            return NextResponse.json({ error: 'Failed to create appointment', details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: data.length, appointments: data });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
