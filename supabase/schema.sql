-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  role text default 'patient' check (role in ('patient', 'admin', 'doctor')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- SERVICES (Treatments)
drop table if exists services cascade;
create table if not exists services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text,
  description text,
  price numeric,
  duration text,
  image text,
  tags text[],
  status text default 'active',
  created_at timestamptz default now()
);

-- APPOINTMENTS
create table if not exists appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references profiles(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz default now()
);

-- MEDICAL HISTORY
create table if not exists medical_history (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references profiles(id) on delete cascade unique,
  chief_complaint jsonb,
  current_medications jsonb,
  allergies jsonb,
  past_history jsonb,
  family_history jsonb,
  lifestyle_factors jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- HEALTH METRICS (Vitals)
create table if not exists health_metrics (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references profiles(id) on delete cascade,
  category text, -- e.g., 'Vitals', 'Lab Result'
  data jsonb, -- Stores flexible data like { bp_systolic: 120, bp_diastolic: 80 }
  recorded_at timestamptz default now()
);

-- WAITLIST
create table if not exists waitlist (
  id uuid default uuid_generate_v4() primary key,
  patient_name text,
  patient_email text,
  patient_phone text,
  service_id text, -- Can be a string ID or reference
  preferred_date date,
  notes text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- NEWSLETTER
create table if not exists newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  subscribed_at timestamptz default now()
);

-- CHAT LOGS
create table if not exists chat_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete set null,
  message text,
  response text,
  created_at timestamptz default now()
);

-- INVOICES
create table if not exists invoices (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references profiles(id) on delete cascade,
  amount numeric,
  status text default 'pending',
  pdf_url text,
  created_at timestamptz default now()
);

-- CONSULTATION NOTES
create table if not exists consultation_notes (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references profiles(id) on delete cascade,
  doctor_id uuid references profiles(id) on delete set null,
  note_content text,
  created_at timestamptz default now()
);

-- RLS POLICIES (Basic Security)
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

alter table services enable row level security;
create policy "Services are viewable by everyone" on services for select using (true);
create policy "Admins can insert services" on services for insert with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update services" on services for update using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

alter table appointments enable row level security;
create policy "Users can view own appointments" on appointments for select using (auth.uid() = patient_id);
create policy "Users can create appointments" on appointments for insert with check (auth.uid() = patient_id);
create policy "Admins can view all appointments" on appointments for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

alter table medical_history enable row level security;
create policy "Users can view own history" on medical_history for select using (auth.uid() = patient_id);
create policy "Users can update own history" on medical_history for update using (auth.uid() = patient_id);
create policy "Admins/Doctors can view history" on medical_history for select using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'doctor')));

-- SEED DATA FOR SERVICES
insert into services (name, description, image, price, duration, category, tags) values
('Therapeutic Yoga', 'Personalized yoga sessions focusing on physical and mental alignment.', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop', 500, '60 min', 'Yoga & Meditation', ARRAY['Stress', 'Anxiety', 'Back Pain', 'Cervical Spondylitis', 'Hypertension', 'PCOD', 'Menstrual Disorder', 'Thyroid', 'Mental Health']),
('Hydrotherapy', 'Water-based treatments to stimulate blood circulation and treat diseases.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop', 800, '45 min', 'Hydrotherapy', ARRAY['Skin Diseases', 'Detox', 'General Ailments', 'Chronic Cough', 'Asthma']),
('Ayurvedic Massage', 'Deep tissue massage using herbal oils to release toxins and stress.', 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070&auto=format&fit=crop', 1200, '60 min', 'Massage', ARRAY['Back Pain', 'Knee Pain', 'Frozen Shoulder', 'Stress', 'Body Pain', 'Paralysis', 'Facial Rejuvenation']),
('Acupuncture', 'Traditional therapy stimulating specific points to balance energy flow.', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop', 1000, '45 min', 'Therapy', ARRAY['Headache', 'Migraine', 'Chronic Cough', 'Asthma', 'Frozen Shoulder', 'Knee Pain', 'Sinusitis']),
('Nutritional Counseling', 'Dietary planning to restore health and prevent chronic diseases.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop', 700, '30 min', 'Diet & Nutrition', ARRAY['Weight Loss', 'Obesity', 'Diabetes', 'PCOD', 'Acidity', 'Constipation', 'Hypertension', 'Increased Immunity']),
('Mud Therapy', 'Application of medicinal mud to detoxify and cool the body.', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop', 600, '40 min', 'Hydrotherapy', ARRAY['Skin Diseases', 'Acidity', 'Constipation', 'Stomach Issues', 'Face Rejuvination']);
