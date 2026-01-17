-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  role text check (role in ('patient', 'admin', 'practitioner', 'receptionist')) default 'patient',
  avatar_url text,
  gender text,
  dob date,
  address text,
  city text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Services Catalog
create table services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  description text,
  detailed_description text,
  duration_minutes integer not null,
  price numeric not null,
  image_url text,
  is_active boolean default true,
  is_group_session boolean default false,
  max_participants integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Practitioners
create table practitioners (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references profiles(id) on delete cascade,
  specialization text,
  bio text,
  credentials text,
  availability jsonb, -- Store working hours structure
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Appointments
create table appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references profiles(id) on delete set null,
  service_id uuid references services(id) on delete restrict,
  practitioner_id uuid references practitioners(id) on delete set null,
  appointment_date timestamp with time zone not null,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'noshow')) default 'pending',
  notes text,
  payment_status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Medical History (Private)
create table medical_history (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references profiles(id) on delete cascade not null,
  chief_complaint text,
  current_medications text,
  allergies text,
  past_history text,
  family_history text,
  lifestyle_factors jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table services enable row level security;
alter table practitioners enable row level security;
alter table appointments enable row level security;
alter table medical_history enable row level security;

-- Profiles: 
-- Patients can view/edit their own profile. 
-- Staff can view all profiles.
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Services:
-- Viewable by everyone.
-- Editable only by admins.
create policy "Services are viewable by everyone" on services for select using (true);

-- Appointments:
-- Patients can view their own.
-- Staff can view all.
create policy "Patients can view own appointments" on appointments for select using (auth.uid() = patient_id OR exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'practitioner', 'receptionist')));
create policy "Patients can insert own appointments" on appointments for insert with check (auth.uid() = patient_id);

-- Storage Buckets Setup (Run via Dashboard or Storage API, SQL implies policy only)
-- Bucket: 'avatars', 'service-images', 'documents'
