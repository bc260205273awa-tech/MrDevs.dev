import { createClient, SupabaseClient } from "@supabase/supabase-js";

// [NEW] Read public Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// [NEW] Singleton instance holder
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get or initialize the Supabase client instance.
 * Returns null if Supabase environment variables are not configured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  // Return cached client if available
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // If credentials are present, initialize the client
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  }

  return null;
}
