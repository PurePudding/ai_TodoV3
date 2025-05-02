import { create } from 'zustand';

interface UserState {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  isAuthenticated: boolean;
  callId: string | null;
  callResult: any | null;
  setUser: (user: { firstName: string; lastName: string; email: string; phone: string }) => void;
  clearUser: () => void;
  setCallId: (id: string) => void;
  setCallResult: (result: any) => void;
  clearCallData: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  callId: null,
  callResult: null,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: true 
  }),
  
  clearUser: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
  
  setCallId: (id) => set({ 
    callId: id 
  }),
  
  setCallResult: (result) => set({ 
    callResult: result 
  }),
  
  clearCallData: () => set({ 
    callId: null, 
    callResult: null 
  })
}));

export default useUserStore;