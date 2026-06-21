import { createClient } from '@supabase/supabase-js';

// ⚠️ Eta SHUDHU API route (server) e use korben - kono client component
// ('use client') e import korben na. SUPABASE_SERVICE_ROLE_KEY ekta secret
// key ja RLS bypass kore - leak hole shob data (password hash shoho)
// exposed hoye jabe. Supabase Dashboard -> Settings -> API -> "service_role"
// theke ai key ta paben. .env.local + Vercel env variables e
// SUPABASE_SERVICE_ROLE_KEY name e add korun.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
