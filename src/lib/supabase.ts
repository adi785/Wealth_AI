import { createClient } from '@supabase/supabase-js';

// Safe lazy extraction of client-side credentials
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Initialize client only if keys are present to avoid immediate initialization crashes
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helper to assert or explain how to connect Supabase
export function getSupabase() {
  if (!supabase) {
    console.warn(
      "Supabase Client is not fully initialized. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment secrets."
    );
  }
  return supabase;
}
