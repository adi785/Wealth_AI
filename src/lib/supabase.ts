import { createClient } from '@supabase/supabase-js';

// Safe lazy extraction of client-side credentials
let supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
let supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Clean surrounding quotes if they are present literally in the environment
if (supabaseUrl.startsWith('"') && supabaseUrl.endsWith('"')) {
  supabaseUrl = supabaseUrl.slice(1, -1);
}
if (supabaseUrl.startsWith("'") && supabaseUrl.endsWith("'")) {
  supabaseUrl = supabaseUrl.slice(1, -1);
}
if (supabaseAnonKey.startsWith('"') && supabaseAnonKey.endsWith('"')) {
  supabaseAnonKey = supabaseAnonKey.slice(1, -1);
}
if (supabaseAnonKey.startsWith("'") && supabaseAnonKey.endsWith("'")) {
  supabaseAnonKey = supabaseAnonKey.slice(1, -1);
}

// Check if the URL is valid and not a default placeholder
const isValidSupabaseUrl = (url: string): boolean => {
  if (!url || url.includes('your-supabase-project.supabase.co')) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Initialize client only if keys are present and URL is valid to avoid immediate initialization crashes
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && isValidSupabaseUrl(supabaseUrl));

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
