import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all settings
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('key, value');

        if (error) {
            console.error('Error fetching settings:', error);
            return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
        }

        // Convert array to object for easier consumption
        const settings: Record<string, any> = {};
        (data || []).forEach((row: { key: string; value: any }) => {
            settings[row.key] = row.value;
        });

        return NextResponse.json({ settings });

    } catch (error: any) {
        console.error('Settings API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT (bulk update) settings
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { settings } = body;

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json({ error: 'Settings object required' }, { status: 400 });
        }

        // Upsert each setting
        const updates = Object.entries(settings).map(([key, value]) => ({
            key,
            value: typeof value === 'string' ? JSON.stringify(value) : value,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabaseAdmin
            .from('site_settings')
            .upsert(updates, { onConflict: 'key' });

        if (error) {
            console.error('Error updating settings:', error);
            return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Settings update API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
