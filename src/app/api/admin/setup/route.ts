import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const email = 'admin@drpriyanka.com';
        const password = 'priyanka'; // User requested password
        const name = 'Dr. Priyanka';

        // 1. Check if user exists in Auth
        const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        let userId = users?.users.find(u => u.email === email)?.id;

        if (!userId) {
            // Create Auth User
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true
            });

            if (createError) throw createError;
            userId = newUser.user.id;
        }

        // 2. Ensure Profile exists and is Admin
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: userId,
                email,
                full_name: name,
                role: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

        if (profileError) throw profileError;

        return NextResponse.json({
            success: true,
            message: `Admin setup complete. Login with ${email}`
        });

    } catch (error: any) {
        console.error('Admin Setup Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
