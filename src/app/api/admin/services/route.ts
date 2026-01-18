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
            .from('services')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching services:', error);
            return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
        }

        return NextResponse.json({ services: data || [] });

    } catch (error: any) {
        console.error('Services API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// CREATE new service
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description, price, duration, category, image, status = 'active' } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json({ error: 'Service name is required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('services')
            .insert({
                name,
                description,
                price: price || 0,
                duration: duration || '60 min',
                category,
                image,
                status
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating service:', error);
            return NextResponse.json({ error: 'Failed to create service', details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, service: data });

    } catch (error: any) {
        console.error('Service create API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// UPDATE service
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, name, description, price, duration, category, image, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
        }

        // Build update object dynamically
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (duration !== undefined) updateData.duration = duration;
        if (category !== undefined) updateData.category = category;
        if (image !== undefined) updateData.image = image;
        if (status !== undefined) updateData.status = status;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('services')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating service:', error);
            return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
        }

        return NextResponse.json({ success: true, service: data });

    } catch (error: any) {
        console.error('Service update API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('services')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting service:', error);
            return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Service delete API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

