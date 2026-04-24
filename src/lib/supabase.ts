import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseEnabled = Boolean(url && anonKey);

if (!supabaseEnabled) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. Falling back to localStorage-only mode.'
  );
}

export const supabase = supabaseEnabled
  ? createClient(url!, anonKey!, {
      realtime: { params: { eventsPerSecond: 5 } },
    })
  : null;

export const IMAGE_BUCKET = 'images';
export const KV_TABLE = 'kv_store';
