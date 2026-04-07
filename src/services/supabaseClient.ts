/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://obbuizxayaqadeabwvni.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8dNN2huzTxyfn6JzeHGRRA_uimaFOuO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
