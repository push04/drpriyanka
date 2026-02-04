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
        const cleanEmail = email.trim().toLowerCase();
        const loginEmail = cleanEmail === 'admin' ? 'admin@drpriyanka.com' : cleanEmail;

        console.log("Admin Login Attempt:", { email: cleanEmail, loginEmail });

        // 1. Authenticate user
        const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email: loginEmail,
            password,
        });

        if (authError) {
            console.error("Auth failed:", authError.message);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!authData.session) {
            console.error("No session returned");
            return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
        }

        const userId = authData.session.user.id;
        const userEmail = authData.session.user.email;
        console.log("Auth Success:", { userId, userEmail });

        // 2. Check admin role using service role (bypasses RLS)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('role, full_name')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            console.warn('Profile fetch error or missing:', profileError);

            // Should match what we just authenticated with
            const validAdminEmails = ['admin@drpriyanka.com', 'admin@dpnc.in'];
            const emailToCheck = userEmail?.toLowerCase() || loginEmail;

            console.log("Checking valid emails for profile creation:", { emailToCheck, valid: validAdminEmails.includes(emailToCheck), validList: validAdminEmails });

            if (validAdminEmails.includes(emailToCheck)) {
                console.log("Auto-creating admin profile...");
                // Create admin profile if it doesn't exist
                const { error: upsertError } = await supabaseAdmin.from('profiles').upsert({
                    id: userId,
                    email: emailToCheck,
                    full_name: 'Dr. Priyanka',
                    role: 'admin',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

                if (upsertError) console.error("Upsert failed:", upsertError);
            } else {
                return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
            }
        }

        // 3. Verify admin role (check again if we just created it)
        // If we survived the block above, we either had a profile or just created one.

        // Re-fetch profile to be sure? Or trust logic.
        // Let's trust logic but stricter.

        let isAdmin = false;
        // Check if explicitly authorized email OR has admin role
        if ((['admin@drpriyanka.com', 'admin@dpnc.in'].includes(userEmail?.toLowerCase() || '')) || profile?.role === 'admin') {
            isAdmin = true;
        }

        if (!isAdmin) {
            console.log("Role check failed:", { role: profile?.role, email: userEmail });
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
