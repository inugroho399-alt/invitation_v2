import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local manually for the script
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [key, ...val] = line.split('=');
    env[key.trim()] = val.join('=').trim();
  }
});

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const key = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!url || !key) {
  console.log('Error: URL or Key is missing from .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  try {
    // Attempt to fetch 1 row from rsvps table (even if it doesn't exist, it will connect)
    const { data, error } = await supabase.from('rsvps').select('*').limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('SUCCESS_CONNECTED_BUT_TABLE_MISSING');
      } else {
        console.log('ERROR:', error.message);
      }
    } else {
      console.log('SUCCESS_CONNECTED');
      console.log('Data:', data);
    }
  } catch (err) {
    console.log('EXCEPTION:', err.message);
  }
}

testConnection();
