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
            .from('invoices')
            .select('*')
            .order('issued_date', { ascending: false });

        if (error) {
            console.error('Error fetching invoices:', error);
            return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
        }

        // Calculate stats
        const invoices = data || [];
        const revenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0);
        const pending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + Number(i.amount), 0);

        return NextResponse.json({
            invoices,
            stats: { revenue, pending, count: invoices.length }
        });

    } catch (error: any) {
        console.error('Invoices API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { error } = await supabaseAdmin.from('invoices').insert({
            patient_name: body.patient_name || "Demo Patient",
            service_name: body.service_name || "General Checkup",
            amount: body.amount || 1500,
            status: body.status || "pending",
            issued_date: body.issued_date || new Date().toISOString().split('T')[0]
        });

        if (error) {
            console.error('Error creating invoice:', error);
            return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Invoice create API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
