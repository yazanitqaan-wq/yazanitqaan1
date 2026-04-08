/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://obbuizxayaqadeabwvni.supabase.co';
const supabaseAnonKey = 'sb_publishable_8dNN2huzTxyfn6JzeHGRRA_uimaFOuO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
