import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Check if email already exists in newsletter_subscribers table
        // First, try to create the table if it doesn't exist (this is handled by Supabase migrations usually)
        // For now, we'll store in a general 'newsletter_subscribers' table or fallback to 'waitlist'

        // Try to insert into newsletter_subscribers
        const { data, error } = await supabaseAdmin
            .from('newsletter_subscribers')
            .insert({
                email,
                subscribed_at: new Date().toISOString(),
                status: 'active'
            })
            .select()
            .single();

        if (error) {
            // If table doesn't exist or other error, try waitlist as fallback
            if (error.code === '42P01' || error.message.includes('does not exist')) {
                // Table doesn't exist - store in waitlist with newsletter flag
                const { data: waitlistData, error: waitlistError } = await supabaseAdmin
                    .from('waitlist')
                    .insert({
                        patient_email: email,
                        patient_name: 'Newsletter Subscriber',
                        service_id: null,
                        notes: 'Newsletter Subscription',
                        status: 'newsletter'
                    })
                    .select()
                    .single();

                if (waitlistError) {
                    console.error('Newsletter subscription error:', waitlistError);
                    return NextResponse.json({
                        error: 'Failed to subscribe. Please try again.'
                    }, { status: 500 });
                }

                return NextResponse.json({
                    success: true,
                    message: 'Successfully subscribed to newsletter!'
                });
            }

            // Check for duplicate email
            if (error.code === '23505' || error.message.includes('duplicate')) {
                return NextResponse.json({
                    error: 'This email is already subscribed to our newsletter.'
                }, { status: 409 });
            }

            console.error('Newsletter Error:', error);
            return NextResponse.json({
                error: 'Failed to subscribe. Please try again.'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to newsletter!'
        });

    } catch (error: any) {
        console.error('Newsletter API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
