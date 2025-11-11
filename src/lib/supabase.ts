import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwdmusemrlavcehuslbb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZG11c2VtcmxhdmNlaHVzbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MzQ5MDksImV4cCI6MjA3ODQxMDkwOX0.4-a_63iOU6XRxWzs_ueUuKhRT0CKGevIQ9_jE3C5Vt8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
