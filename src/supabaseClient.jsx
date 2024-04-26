import { createClient } from '@supabase/supabase-js'
const supabase_url=import.meta.env.VITE_supabase_url;
const anon_key=import.meta.env.VITE_anon_key;
let supabaseClient;
try { supabaseClient = createClient(supabase_url, anon_key);
} catch(error){
     supabaseClient=undefined;
}
export default supabaseClient;