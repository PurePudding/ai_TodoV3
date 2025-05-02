import { create } from 'zustand';
import { vapi, startAssistant, stopAssistant, getCallDetails } from '../services/vapi';

interface AssistantState {
  isStarted: boolean;
  isLoading: boolean;
  isSpeaking: boolean;
  volumeLevel: number;
  callId: string | null;
  error: string | null;
  
  startVoiceAssistant: (firstName: string, lastName: string, email: string, phone: string) => Promise<void>;
  stopVoiceAssistant: () => Promise<any>;
  setVolumeLevel: (level: number) => void;
  setSpeaking: (isSpeaking: boolean) => void;
  resetState: () => void;
}

const useAssistantStore = create<AssistantState>((set, get) => ({
  isStarted: false,
  isLoading: false,
  isSpeaking: false,
  volumeLevel: 0,
  callId: null,
  error: null,
  
  startVoiceAssistant: async (firstName, lastName, email, phone) => {
    try {
      set({ isLoading: true, error: null });
      
      const result = await startAssistant(firstName, lastName, email, phone);
      set({ 
        isStarted: true, 
        isLoading: false,
        callId: result.id 
      });
      
      return result;
    } catch (error) {
      console.error('Error starting assistant:', error);
      set({ 
        error: 'Failed to start voice assistant', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  stopVoiceAssistant: async () => {
    try {
      stopAssistant();
      set({ isStarted: false });
      
      if (get().callId) {
        const result = await getCallDetails(get().callId);
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error stopping assistant:', error);
      set({ error: 'Failed to stop voice assistant' });
      throw error;
    }
  },
  
  setVolumeLevel: (level) => set({ volumeLevel: level }),
  
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  
  resetState: () => set({
    isStarted: false,
    isLoading: false,
    isSpeaking: false,
    volumeLevel: 0,
    callId: null,
    error: null
  })
}));

export default useAssistantStore;