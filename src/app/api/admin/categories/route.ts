import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all categories
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
        }

        return NextResponse.json({ categories: data || [] });

    } catch (error: any) {
        console.error('Categories API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new category
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('categories')
            .insert({ name, description, is_active: true })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
            }
            console.error('Error creating category:', error);
            return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
        }

        return NextResponse.json({ success: true, category: data });

    } catch (error: any) {
        console.error('Category create error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update category
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, name, description, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (is_active !== undefined) updateData.is_active = is_active;

        const { data, error } = await supabaseAdmin
            .from('categories')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating category:', error);
            return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
        }

        return NextResponse.json({ success: true, category: data });

    } catch (error: any) {
        console.error('Category update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Remove category
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Category delete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
