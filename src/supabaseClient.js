import { createClient } from "@supabase/supabase-js";

// Supabase project connection configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://sezinafbskcwsokffvfu.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
