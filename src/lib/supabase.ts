import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://nfhvqadlmexyplcedlmf.supabase.co';
const supabaseAnonKey = 'sb_publishable_ADe7GWeUPWoMo_oxFtVb2Q_YLpZQ61F';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
    },
  },
});