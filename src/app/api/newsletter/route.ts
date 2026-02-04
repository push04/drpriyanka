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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('newsletter_subscribers')
            .insert({
                email
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505' || error.message.includes('duplicate')) {
                return NextResponse.json({
                    error: 'This email is already subscribed.'
                }, { status: 409 });
            }
            console.error('Newsletter Error:', error);
            return NextResponse.json({
                error: 'Failed to subscribe. Please try again later.'
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
