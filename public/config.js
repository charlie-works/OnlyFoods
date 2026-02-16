// Supabase Configuration
// Replace these with your actual Supabase project URL
// You can find these in your Supabase project settings
const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_PROJECT_URL', // e.g., 'https://xxxxx.supabase.co'
  anonKey: 'YOUR_SUPABASE_ANON_KEY' // Your Supabase anonymous key
};

// Supabase Edge Functions base URL
const SUPABASE_FUNCTIONS_URL = `${SUPABASE_CONFIG.url}/functions/v1`;
