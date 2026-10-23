// ==============================================================================
// Supabase Browser Client
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: SSR safe, singleton pattern, graceful mock fallback
// ==============================================================================

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return client;
}

export const supabase = getSupabaseClient();
