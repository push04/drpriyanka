import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // Allow "admin" username shorthand
        const loginEmail = email.toLowerCase() === 'admin' ? 'admin@drpriyanka.com' : email;

        // 1. Authenticate user
        const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email: loginEmail,
            password,
        });

        if (authError) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!authData.session) {
            return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
        }

        // 2. Check admin role using service role (bypasses RLS)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('role, full_name')
            .eq('id', authData.session.user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            // If profile doesn't exist, check if this is the admin email
            if (loginEmail === 'admin@drpriyanka.com') {
                // Create admin profile if it doesn't exist
                await supabaseAdmin.from('profiles').upsert({
                    id: authData.session.user.id,
                    email: loginEmail,
                    full_name: 'Dr. Priyanka',
                    role: 'admin',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            } else {
                return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
            }
        }

        // 3. Verify admin role (check again if we just created it)
        const role = profile?.role || 'admin'; // If we just created it, it's admin
        if (loginEmail !== 'admin@drpriyanka.com' && role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized: Access restricted to administrators' }, { status: 403 });
        }

        // 4. Return success with session info
        return NextResponse.json({
            success: true,
            session: {
                access_token: authData.session.access_token,
                refresh_token: authData.session.refresh_token,
                user: {
                    id: authData.session.user.id,
                    email: authData.session.user.email,
                    name: profile?.full_name || 'Dr. Priyanka'
                }
            }
        });

    } catch (error: any) {
        console.error('Admin login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
