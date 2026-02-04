import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to read all settings
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET public site settings (for public pages)
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('key, value');

        if (error) {
            console.error('Error fetching public settings:', error);
            return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
        }

        // Convert array to object and parse JSON values
        const settings: Record<string, any> = {};
        (data || []).forEach((row: { key: string; value: any }) => {
            try {
                settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
            } catch {
                settings[row.key] = row.value;
            }
        });

        return NextResponse.json({ settings });

    } catch (error: any) {
        console.error('Public settings API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
