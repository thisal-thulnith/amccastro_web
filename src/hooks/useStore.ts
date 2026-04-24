import { useEffect, useState } from 'react';
import { dataStore } from '@/store/dataStore';

// Subscribes the component to the data cache. Any save/delete (local or
// realtime from Supabase) triggers a re-render.
export function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => setTick((t) => t + 1));
    return unsubscribe;
  }, []);
  return dataStore.getData();
}
