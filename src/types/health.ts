export interface PatientHealthProfile {
    id: string;
    patient_id: string;

    // Section 1: Chief Complaints
    chief_complaint: string | null;
    primary_concerns: string[];
    health_goals: string[];
    condition_duration: string | null;
    pain_level: number | null; // 0-10

    // Section 2: Medical History
    surgeries: SurgeryRecord[];
    hospitalizations: HospitalizationRecord[];
    chronic_conditions: string[];
    current_medications: MedicationRecord[];
    supplements: string | null;
    previous_treatments: string | null;

    // Section 3: Allergies
    allergies: AllergyProfile;

    // Section 4: Family History
    family_history: Record<string, string>; // { condition: relationship }

    // Section 5: Lifestyle
    dietary_preferences: string | null;
    meal_pattern: string | null;
    hydration_liters: number | null;
    habits: LifestyleHabits;
    activity_level: string | null;
    sleep_pattern: SleepPattern;
    stress_level: number | null; // 1-10
    mental_health_history: string | null;
    occupation_details: OccupationDetails;

    // Section 6: Women's Health
    menstrual_history: MenstrualHistory;

    // Meta
    consent_agreed: boolean;
    completion_percentage: number;
    reviewed_by_practitioner: boolean;

    created_at: string;
    updated_at: string;
}

export interface SurgeryRecord {
    procedure: string;
    year: string;
    notes?: string;
}

export interface HospitalizationRecord {
    reason: string;
    year: string;
    duration?: string;
}

export interface MedicationRecord {
    name: string;
    dosage: string;
    frequency: string;
}

export interface AllergyProfile {
    drug: string[];
    food: string[];
    environmental: string[];
    skin: string[];
    severity?: string;
}

export interface LifestyleHabits {
    smoking: string; // 'never', 'past', 'current'
    alcohol: string; // 'never', 'occasional', 'regular'
    caffeine: string; // 'none', '1-2', '3+'
    drugs?: string;
}

export interface SleepPattern {
    hours_per_night: number;
    quality: 'good' | 'fair' | 'poor';
    issues: string[]; // 'insomnia', 'apnea', etc.
}

export interface OccupationDetails {
    job_title: string;
    schedule_type: string; // '9-5', 'shift', 'night'
    screen_time_hours: number;
}

export interface MenstrualHistory {
    cycle_regularity: 'regular' | 'irregular' | 'menopause' | 'na';
    cycle_length_days?: number;
    flow_quality?: string;
    last_period_date?: string;
    issues: string[]; // 'pcos', 'endometriosis', etc.
}

export type HealthProfileSection =
    | 'basic'
    | 'medical'
    | 'lifestyle'
    | 'allergies'
    | 'family'
    | 'womens_health';
