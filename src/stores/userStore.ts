import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  callId: string | null;
  callResult: any | null;
  
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  clearUser: () => void;
  setCallId: (id: string) => void;
  setCallResult: (result: any) => void;
  clearCallData: () => void;
  
  // Profile operations
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  callId: null,
  callResult: null,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  setProfile: (profile) => set({ profile }),
  
  clearUser: () => set({ 
    user: null,
    profile: null, 
    isAuthenticated: false 
  }),
  
  setCallId: (id) => set({ callId: id }),
  setCallResult: (result) => set({ callResult: result }),
  clearCallData: () => set({ callId: null, callResult: null }),
  
  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      // Refresh profile after update
      await get().fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      set({ profile });
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
}));

export default useUserStore;