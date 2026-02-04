-- ============================================
-- SITE SETTINGS TABLE
-- Stores all editable site content as key-value pairs
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings (for public pages)
CREATE POLICY "Public can read settings" ON site_settings 
    FOR SELECT USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update settings" ON site_settings 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can insert settings" ON site_settings 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    quote TEXT NOT NULL,
    role TEXT DEFAULT 'Patient',
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Everyone can read active testimonials
CREATE POLICY "Public can read active testimonials" ON testimonials 
    FOR SELECT USING (is_active = true);

-- Admins can do everything with testimonials
CREATE POLICY "Admins full access to testimonials" ON testimonials 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

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

-- Seed testimonials
INSERT INTO testimonials (name, quote, role, rating) VALUES 
    ('Sarah J.', 'Dr. Priyanka''s treatments have completely transformed my health. The natural approach really works!', 'Patient', 5),
    ('Rahul M.', 'The yoga sessions are incredibly relaxing and therapeutic. Highly recommend for stress relief.', 'Yoga Enthusiast', 5),
    ('Anita D.', 'I found great relief from my chronic back pain through the massage therapies here.', 'Patient', 4)
ON CONFLICT DO NOTHING;

