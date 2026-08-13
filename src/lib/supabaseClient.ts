import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client only if credentials exist
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface RSVPData {
  id?: string;
  name: string;
  group_name?: string;
  whatsapp?: string;
  attendance: string;
  comment: string;
  created_at?: string;
}

// Fallback services for local storage
const LOCAL_STORAGE_KEY = 'wedding_rsvps';

export const rsvpService = {
  async getRSVPs(): Promise<RSVPData[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('rsvps')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.error('Error fetching from Supabase, falling back to local storage:', err);
      }
    }
    
    // Local storage fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [
      {
        id: '1',
        name: 'M Hasan',
        attendance: 'Hadir',
        comment: 'Semoga SAMAWA tuntung patang sampai kakek nenek, dilancarkan acaranya kak!',
        created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString() // 3 days ago
      }
    ];
  },

  async addRSVP(rsvp: RSVPData): Promise<RSVPData> {
    const newRSVP = {
      ...rsvp,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('rsvps')
          .insert([rsvp])
          .select();
        if (!error && data && data[0]) return data[0];
      } catch (err) {
        console.error('Error inserting to Supabase, saving locally:', err);
      }
    }

    // Local storage fallback
    if (typeof window !== 'undefined') {
      const current = await this.getRSVPs();
      const updated = [newRSVP, ...current];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
    return newRSVP;
  }
};
