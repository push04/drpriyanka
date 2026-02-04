-- ============================================
-- DR. PRIYANKA CLINIC - COMPLETE DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE TABLES FIRST (before dropping policies)
-- ============================================

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    quote TEXT NOT NULL,
    role TEXT DEFAULT 'Patient',
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADD MISSING COLUMNS TO CONSULTATION_NOTES
-- ============================================
ALTER TABLE consultation_notes ADD COLUMN IF NOT EXISTS assessment TEXT;
ALTER TABLE consultation_notes ADD COLUMN IF NOT EXISTS diagnosis TEXT;
ALTER TABLE consultation_notes ADD COLUMN IF NOT EXISTS treatment_plan TEXT;
ALTER TABLE consultation_notes ADD COLUMN IF NOT EXISTS follow_up_date DATE;

-- ============================================
-- DROP EXISTING POLICIES (now tables exist)
-- ============================================
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "Admins can insert services" ON services;
DROP POLICY IF EXISTS "Admins can update services" ON services;
DROP POLICY IF EXISTS "Admins can delete services" ON services;
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can manage appointments" ON appointments;
DROP POLICY IF EXISTS "Users can view own history" ON medical_history;
DROP POLICY IF EXISTS "Users can update own history" ON medical_history;
DROP POLICY IF EXISTS "Admins/Doctors can view history" ON medical_history;
DROP POLICY IF EXISTS "Public can read settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON site_settings;
DROP POLICY IF EXISTS "Public can read active testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins full access to testimonials" ON testimonials;
DROP POLICY IF EXISTS "Categories viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Users can view own notes" ON consultation_notes;
DROP POLICY IF EXISTS "Admins/Doctors can manage notes" ON consultation_notes;

-- ============================================
-- ENABLE RLS ON TABLES
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE SECURITY DEFINER FUNCTION (avoids recursion)
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Public profiles are viewable by everyone" ON profiles 
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- SERVICES POLICIES
-- ============================================
CREATE POLICY "Services are viewable by everyone" ON services 
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert services" ON services 
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update services" ON services 
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete services" ON services 
    FOR DELETE USING (is_admin());

-- ============================================
-- CATEGORIES POLICIES
-- ============================================
CREATE POLICY "Categories viewable by everyone" ON categories 
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories 
    FOR ALL USING (is_admin());

-- ============================================
-- SITE SETTINGS POLICIES
-- ============================================
CREATE POLICY "Public can read settings" ON site_settings 
    FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON site_settings 
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can insert settings" ON site_settings 
    FOR INSERT WITH CHECK (is_admin());

-- ============================================
-- TESTIMONIALS POLICIES
-- ============================================
CREATE POLICY "Public can read active testimonials" ON testimonials 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins full access to testimonials" ON testimonials 
    FOR ALL USING (is_admin());

-- ============================================
-- APPOINTMENT POLICIES
-- ============================================
CREATE POLICY "Users can view own appointments" ON appointments 
    FOR SELECT USING (auth.uid() = patient_id OR is_admin());

CREATE POLICY "Users can create appointments" ON appointments 
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Admins can manage appointments" ON appointments 
    FOR ALL USING (is_admin());

-- ============================================
-- MEDICAL HISTORY POLICIES
-- ============================================
CREATE POLICY "Users can view own history" ON medical_history 
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can update own history" ON medical_history 
    FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Admins/Doctors can view history" ON medical_history 
    FOR SELECT USING (is_admin());

-- ============================================
-- CONSULTATION NOTES POLICIES
-- ============================================
CREATE POLICY "Users can view own notes" ON consultation_notes 
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Admins/Doctors can manage notes" ON consultation_notes 
    FOR ALL USING (is_admin());

-- ============================================
-- NEWSLETTER POLICIES
-- ============================================
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON newsletter_subscribers 
    FOR SELECT USING (is_admin());

-- ============================================
-- SEED DEFAULT SETTINGS
-- ============================================
INSERT INTO site_settings (key, value) VALUES 
    ('clinic_name', '"Dr. Priyanka''s Naturopathy Clinic"'),
    ('clinic_tagline', '"Restoring health naturally through the ancient wisdom of Nature Cure"'),
    ('contact_phone_1', '"+91 95862 39293"'),
    ('contact_phone_2', '"+91 88664 55269"'),
    ('contact_email', '"clinic@drpriyanka.com"'),
    ('contact_address', '"SF-209, Siddharth Magnum Plus, Next to Bansal Mall, Tarsali-390009"'),
    ('clinic_hours_morning', '"11:00 AM - 01:00 PM"'),
    ('clinic_hours_evening', '"06:00 PM - 08:00 PM"'),
    ('about_title', '"Dr. Priyanka"'),
    ('about_subtitle', '"Naturopathy & Herbal Medicine"'),
    ('about_description', '"At Dr. Priyanka Clinic & Institute, we provide alternative, safe, and effective treatments through the natural way. Dr. Priyanka specializes in treating chronic ailments by combining the ancient wisdom of Naturopathy with herbal medicine."'),
    ('about_mission', '"Our goal is to restore health naturally, boosting immunity and revitalizing the body without harmful side effects."'),
    ('social_facebook', '""'),
    ('social_instagram', '""'),
    ('social_youtube', '""')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SEED DEFAULT CATEGORIES
-- ============================================
INSERT INTO categories (name, description) VALUES 
    ('Naturopathy', 'Natural healing therapies using herbs and lifestyle changes'),
    ('Yoga & Meditation', 'Physical and mental wellness through yoga practices'),
    ('Hydrotherapy', 'Water-based treatments for healing and detoxification'),
    ('Massage', 'Therapeutic massage for pain relief and relaxation'),
    ('Therapy', 'Specialized therapeutic treatments like acupuncture'),
    ('Diet & Nutrition', 'Dietary counseling and nutritional planning'),
    ('Consultation', 'General health consultations and assessments'),
    ('Ayurveda', 'Traditional Ayurvedic treatments and practices')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SEED TESTIMONIALS
-- ============================================
INSERT INTO testimonials (name, quote, role, rating) VALUES 
    ('Sarah J.', 'Dr. Priyanka''s treatments have completely transformed my health. The natural approach really works!', 'Patient', 5),
    ('Rahul M.', 'The yoga sessions are incredibly relaxing and therapeutic. Highly recommend for stress relief.', 'Yoga Enthusiast', 5),
    ('Anita D.', 'I found great relief from my chronic back pain through the massage therapies here.', 'Patient', 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
