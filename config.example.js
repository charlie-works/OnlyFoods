// Supabase Configuration Example
// Copy this file to config.js and fill in your actual values
// DO NOT commit config.js with real keys to git

const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_PROJECT_URL', // e.g., 'https://xxxxx.supabase.co'
  anonKey: 'YOUR_SUPABASE_ANON_KEY' // Your Supabase anonymous key
};

// Supabase Edge Functions base URL
const SUPABASE_FUNCTIONS_URL = `${SUPABASE_CONFIG.url}/functions/v1`;
