import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET active testimonials (for public homepage)
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('testimonials')
            .select('id, name, quote, role, rating')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching public testimonials:', error);
            return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
        }

        return NextResponse.json({ testimonials: data || [] });

    } catch (error: any) {
        console.error('Public testimonials API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
