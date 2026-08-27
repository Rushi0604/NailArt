-- ====================================================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA FOR LUNA NAILS STUDIO
-- Project Host: db.sezinafbskcwsokffvfu.supabase.co
-- ====================================================================

-- 1. Create Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 4. Create Bookings Table & RLS
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for Anon & Authenticated Roles
-- Gallery Policies
CREATE POLICY "Allow public read gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert gallery" ON public.gallery FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update gallery" ON public.gallery FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete gallery" ON public.gallery FOR DELETE TO anon, authenticated USING (true);

-- Services Policies
CREATE POLICY "Allow public read services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert services" ON public.services FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update services" ON public.services FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete services" ON public.services FOR DELETE TO anon, authenticated USING (true);

-- Bookings Policies
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT TO anon, authenticated USING (true);

-- 5. Insert Initial Default Seed Data
INSERT INTO public.gallery (id, title, category, image) VALUES
  ('1', 'Blush Pearl', 'Luxury', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85'),
  ('2', 'French Bloom', 'Floral', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85'),
  ('3', 'Soft Nude', 'Simple', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85'),
  ('4', 'Rose Detail', 'Floral', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85'),
  ('5', 'Bridal Pearl', 'Bridal', 'https://images.unsplash.com/photo-1610992015762-45dca7c1a0b8?auto=format&fit=crop&w=900&q=85'),
  ('6', 'Cherry Charm', 'Cute', 'https://images.unsplash.com/photo-1601924928376-7e4b5a1e4c8f?auto=format&fit=crop&w=900&q=85'),
  ('7', 'Midnight Gloss', 'Custom', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85'),
  ('8', 'Clean Girl', 'Simple', 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (id, name, price, text) VALUES
  ('1', 'Classic Manicure', '₹499', 'Clean, shape, cuticle care and a polished finish.'),
  ('2', 'Gel Nails', '₹799', 'Long-lasting gel colour with a glossy salon finish.'),
  ('3', 'Nail Extensions', '₹1,299', 'Elegant extensions shaped to complement your hands.'),
  ('4', 'Custom Nail Art', '₹999+', 'A personalised design created around your style.'),
  ('5', 'Bridal Nails', '₹1,499+', 'Pearls, shimmer and delicate details for your special day.'),
  ('6', 'Removal + Care', '₹299', 'Gentle removal followed by nourishing nail care.')
ON CONFLICT (id) DO NOTHING;
