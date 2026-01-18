import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Use service role to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to get current user from auth cookie or header
async function getAuthenticatedUser(req: NextRequest) {
    try {
        // 1. Check Authorization Header first (More robust for API calls)
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
            if (user && !error) return user;
        }

        // 2. Fallback to Cookies
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();

        for (const cookie of allCookies) {
            if (cookie.name.includes('auth-token') || cookie.name.includes('sb-')) {
                try {
                    let tokenData;
                    try {
                        tokenData = JSON.parse(cookie.value);
                    } catch {
                        continue;
                    }

                    const accessToken = tokenData?.access_token || tokenData?.[0]?.access_token;

                    if (accessToken) {
                        const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
                        if (user && !error) {
                            return user;
                        }
                    }
                } catch (e) {
                    // Continue to next cookie
                }
            }
        }

        return null;
    } catch (error) {
        console.error('Error getting authenticated user:', error);
        return null;
    }
}

// GET - Fetch patient's health profile
export async function GET(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('medical_history') // CORRECT TABLE NAME
            .select('*')
            .eq('patient_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching health profile:', error);
            return NextResponse.json({ error: 'Failed to fetch health profile' }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ profile: null });
        }

        // Parse JSON fields back to frontend structure
        const cc = data.chief_complaint ? JSON.parse(data.chief_complaint) : {};
        const meds = data.current_medications ? JSON.parse(data.current_medications) : {};
        const history = data.past_history ? JSON.parse(data.past_history) : {};
        const lifestyle = data.lifestyle_factors || {}; // Already JSONB

        const profile = {
            // Basic
            chief_complaint: cc.complaint || "",
            primary_concerns: cc.primary_concerns || [],
            condition_duration: cc.condition_duration || "",
            pain_level: cc.pain_level || 0,

            // Meds
            current_medications: meds.medications || [],
            supplements: meds.supplements || "",
            previous_treatments: meds.previous_treatments || "",

            // Allergies
            allergies: data.allergies ? JSON.parse(data.allergies) : { drug: [], food: [], environmental: [], skin: [] },

            // History
            surgeries: history.surgeries || [],
            hospitalizations: history.hospitalizations || [],
            chronic_conditions: history.chronic_conditions || [],
            mental_health_history: history.mental_health || "",
            menstrual_history: history.womens_health || { cycle_regularity: "na", issues: [] },

            // Family
            family_history: data.family_history ? JSON.parse(data.family_history) : {},

            // Lifestyle
            dietary_preferences: lifestyle.diet || "",
            meal_pattern: lifestyle.meal_pattern || "",
            hydration_liters: lifestyle.hydration || 0,
            habits: lifestyle.habits || { smoking: "never", alcohol: "never", caffeine: "none" },
            activity_level: lifestyle.activity || "sedentary",
            sleep_pattern: lifestyle.sleep || { hours_per_night: 7, quality: "good", issues: [] },
            stress_level: lifestyle.stress || 1,
            occupation_details: lifestyle.occupation || { job_title: "", schedule_type: "9-5", screen_time_hours: 0 },

            consent_agreed: true // If they saved it, they agreed
        };

        return NextResponse.json({ profile });

    } catch (error: any) {
        console.error('Health profile API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create or update health profile
export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await req.json();

        // 1. Map form data to schema columns
        // Schema: chief_complaint (text), current_medications (text/json), allergies (text/json), past_history (text), family_history (text), lifestyle_factors (jsonb)

        const medicalHistoryData = {
            patient_id: user.id,
            chief_complaint: JSON.stringify({
                complaint: body.chief_complaint,
                primary_concerns: body.primary_concerns,
                condition_duration: body.condition_duration,
                pain_level: body.pain_level
            }),
            current_medications: JSON.stringify({
                medications: body.current_medications,
                supplements: body.supplements,
                previous_treatments: body.previous_treatments
            }),
            allergies: JSON.stringify(body.allergies),
            past_history: JSON.stringify({
                surgeries: body.surgeries,
                hospitalizations: body.hospitalizations,
                chronic_conditions: body.chronic_conditions,
                mental_health: body.mental_health_history,
                womens_health: body.menstrual_history
            }),
            family_history: JSON.stringify(body.family_history),
            lifestyle_factors: {
                diet: body.dietary_preferences,
                meal_pattern: body.meal_pattern,
                hydration: body.hydration_liters,
                habits: body.habits,
                activity: body.activity_level,
                sleep: body.sleep_pattern,
                stress: body.stress_level,
                occupation: body.occupation_details
            },
            updated_at: new Date().toISOString()
        };

        // Check if record exists
        const { data: existingRecord } = await supabaseAdmin
            .from('medical_history') // CORRECT TABLE NAME
            .select('id')
            .eq('patient_id', user.id)
            .single();

        let result;
        if (existingRecord) {
            // Update existing record
            const { data, error } = await supabaseAdmin
                .from('medical_history')
                .update(medicalHistoryData)
                .eq('patient_id', user.id)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            // Insert new record
            const { data, error } = await supabaseAdmin
                .from('medical_history')
                .insert([{
                    ...medicalHistoryData,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        return NextResponse.json({ success: true, profile: result });

    } catch (error: any) {
        console.error('Health profile save error:', error);
        return NextResponse.json({
            error: 'Failed to save health profile',
            details: error.message
        }, { status: 500 });
    }
}
