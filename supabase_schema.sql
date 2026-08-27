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
  ('8', 'Clean Girl', 'Simple', 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85'),
  ('9', 'Velvet Champagne', 'Luxury', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85'),
  ('10', 'Glazed Donut', 'Chrome', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85'),
  ('11', 'Emerald Luxe', 'Luxury', 'https://images.unsplash.com/photo-1599847996307-e37b46842399?auto=format&fit=crop&w=900&q=85'),
  ('12', 'Rose Gold Shimmer', 'Glitter', 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=900&q=85'),
  ('13', 'Lavender Mist', 'Ombre', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85'),
  ('14', 'Abstract Swirl', 'Custom', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85'),
  ('15', 'Golden Hour', 'Glitter', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85'),
  ('16', 'Peachy Keen', 'Cute', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85'),
  ('17', 'Milky Way', 'Minimal', 'https://images.unsplash.com/photo-1610992015762-45dca7c1a0b8?auto=format&fit=crop&w=900&q=85'),
  ('18', 'Ruby Velvet', 'Luxury', 'https://images.unsplash.com/photo-1601924928376-7e4b5a1e4c8f?auto=format&fit=crop&w=900&q=85'),
  ('19', 'Celestial Stars', 'Cute', 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85'),
  ('20', 'Opal Shimmer', 'Bridal', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85'),
  ('21', 'Vanilla Glaze', 'Minimal', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85'),
  ('22', 'Pastel Daisy', 'Floral', 'https://images.unsplash.com/photo-1599847996307-e37b46842399?auto=format&fit=crop&w=900&q=85'),
  ('23', 'Golden Chrome', 'Chrome', 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=900&q=85'),
  ('24', 'Mocha Cream', 'Simple', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85'),
  ('25', 'Electric Sapphire', 'Custom', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85'),
  ('26', 'Diamond Accent', 'Bridal', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85'),
  ('27', 'Sage Botanica', 'Floral', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85'),
  ('28', 'Metallic Pearl', 'Chrome', 'https://images.unsplash.com/photo-1610992015762-45dca7c1a0b8?auto=format&fit=crop&w=900&q=85'),
  ('29', 'Sunset Gradient', 'Ombre', 'https://images.unsplash.com/photo-1601924928376-7e4b5a1e4c8f?auto=format&fit=crop&w=900&q=85'),
  ('30', 'Minimalist Line Art', 'Minimal', 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85'),
  ('31', 'Pink Quartz', 'Luxury', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85'),
  ('32', 'Glitter Ombre', 'Glitter', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85'),
  ('33', 'Terracotta Touch', 'Simple', 'https://images.unsplash.com/photo-1599847996307-e37b46842399?auto=format&fit=crop&w=900&q=85'),
  ('34', 'Vintage Lace', 'Bridal', 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=900&q=85'),
  ('35', 'Honey Glow', 'Cute', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85'),
  ('36', 'Platinum Mirror', 'Chrome', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85'),
  ('37', 'Coral Dream', 'Floral', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85'),
  ('38', 'Berry Mousse', 'Simple', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85'),
  ('39', 'Crystal Cascade', 'Bridal', 'https://images.unsplash.com/photo-1610992015762-45dca7c1a0b8?auto=format&fit=crop&w=900&q=85'),
  ('40', 'Cosmic Dust', 'Glitter', 'https://images.unsplash.com/photo-1601924928376-7e4b5a1e4c8f?auto=format&fit=crop&w=900&q=85'),
  ('41', 'Butter Yellow', 'Cute', 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85'),
  ('42', 'Frosted Lilac', 'Ombre', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85'),
  ('43', 'Gothic Rose', 'Custom', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85'),
  ('44', 'Pearl Tips', 'French', 'https://images.unsplash.com/photo-1599847996307-e37b46842399?auto=format&fit=crop&w=900&q=85'),
  ('45', 'Satin Silk', 'Minimal', 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=900&q=85'),
  ('46', 'Aura Glow', 'Ombre', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85'),
  ('47', 'Bronze Foil', 'Luxury', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85'),
  ('48', 'Minimal Dot', 'Minimal', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85'),
  ('49', 'Platinum Sparkle', 'Glitter', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85'),
  ('50', 'Royal Velvet', 'Luxury', 'https://images.unsplash.com/photo-1610992015762-45dca7c1a0b8?auto=format&fit=crop&w=900&q=85')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (id, name, price, text) VALUES
  ('1', 'Classic Manicure', '₹499', 'Clean, shape, cuticle care and a polished finish.'),
  ('2', 'Gel Nails', '₹799', 'Long-lasting gel colour with a glossy salon finish.'),
  ('3', 'Nail Extensions', '₹1,299', 'Elegant extensions shaped to complement your hands.'),
  ('4', 'Custom Nail Art', '₹999+', 'A personalised design created around your style.'),
  ('5', 'Bridal Nails', '₹1,499+', 'Pearls, shimmer and delicate details for your special day.'),
  ('6', 'Removal + Care', '₹299', 'Gentle removal followed by nourishing nail care.'),
  ('7', 'BIAB Gel Overlay', '₹999', 'Strong protective Builder-in-a-Bottle gel layer to nourish & lengthen natural nails.'),
  ('8', 'Cat Eye Magnetic Gel', '₹1,199', 'Mesmerizing 3D velvet shimmer effect created with magnetic gel polish.'),
  ('9', 'Chrome Illusion', '₹1,099', 'Ultra-reflective mirror chrome powder finish in silver, rose gold, or pearl.'),
  ('10', 'French Tip Extensions', '₹1,499', 'Timeless white, pastel, or deep accent French tips extended with gel or acrylic.'),
  ('11', 'Express Polish Change', '₹599', 'Quick nail shape, buffing, and fresh long-wear gel polish application.'),
  ('12', 'Russian Dry Manicure', '₹899', 'Precision e-file cuticle detailing for seamless, flawless polish alignment.'),
  ('13', 'Luxury Hand Spa & Polish', '₹799', 'Exfoliating botanical scrub, intense hydrating mask, relaxing massage & finish.'),
  ('14', 'Nail Repair & Structuring', '₹199/nail', 'Seamless repair for broken, split, or damaged natural nails.'),
  ('15', 'Ombre Airbrush', '₹1,299', 'Ultra-smooth gradient color transitions applied with micro airbrush technology.'),
  ('16', 'Press-On Application & Prep', '₹699', 'Professional nail sizing, prep, and long-wear adhesive application for custom press-ons.')
ON CONFLICT (id) DO NOTHING;
