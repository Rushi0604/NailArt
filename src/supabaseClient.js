import { createClient } from "@supabase/supabase-js";

// Supabase project public connection configuration with safe client fallback
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://sezinafbskcwsokffvfu.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlemluYWZic2tjd3Nva2ZmdmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NjQ1MjMsImV4cCI6MjEwMzM0MDUyM30.6UEqDJv1OGw8w5lbyOwJoPuAjPNDjM1gDbqiJ74_F0k";

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
