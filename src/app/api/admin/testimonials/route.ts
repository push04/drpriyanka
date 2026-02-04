import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all testimonials
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching testimonials:', error);
            return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
        }

        return NextResponse.json({ testimonials: data || [] });

    } catch (error: any) {
        console.error('Testimonials API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new testimonial
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, quote, role = 'Patient', rating = 5 } = body;

        if (!name || !quote) {
            return NextResponse.json({ error: 'Name and quote are required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('testimonials')
            .insert({ name, quote, role, rating, is_active: true })
            .select()
            .single();

        if (error) {
            console.error('Error creating testimonial:', error);
            return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
        }

        return NextResponse.json({ success: true, testimonial: data });

    } catch (error: any) {
        console.error('Testimonial create error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update testimonial
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, name, quote, role, rating, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 });
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (quote !== undefined) updateData.quote = quote;
        if (role !== undefined) updateData.role = role;
        if (rating !== undefined) updateData.rating = rating;
        if (is_active !== undefined) updateData.is_active = is_active;

        const { data, error } = await supabaseAdmin
            .from('testimonials')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating testimonial:', error);
            return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
        }

        return NextResponse.json({ success: true, testimonial: data });

    } catch (error: any) {
        console.error('Testimonial update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Remove testimonial
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting testimonial:', error);
            return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Testimonial delete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
