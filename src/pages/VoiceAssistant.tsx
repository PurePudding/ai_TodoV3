import React, { useState, useEffect } from 'react';
import UserForm from '../components/voice/UserForm';
import ActiveCall from '../components/voice/ActiveCall';
import CallSummary from '../components/voice/CallSummary';
import useAssistantStore from '../stores/assistantStore';
import useUserStore from '../stores/userStore';
import { setupVapiEventHandlers } from '../services/vapi';

enum VoiceState {
  FORM,
  ACTIVE_CALL,
  CALL_SUMMARY
}

const VoiceAssistant: React.FC = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.FORM);
  const { 
    setSpeaking, 
    setVolumeLevel, 
    stopVoiceAssistant, 
    resetState 
  } = useAssistantStore();
  const { setCallResult, clearCallData } = useUserStore();
  
  useEffect(() => {
    // Set up VAPI event listeners
    const cleanup = setupVapiEventHandlers({
      onCallStart: () => {
        setVoiceState(VoiceState.ACTIVE_CALL);
      },
      onCallEnd: () => {
        setVoiceState(VoiceState.CALL_SUMMARY);
      },
      onSpeechStart: () => {
        setSpeaking(true);
      },
      onSpeechEnd: () => {
        setSpeaking(false);
      },
      onVolumeLevel: (level) => {
        setVolumeLevel(level);
      },
      onError: (error) => {
        console.error('VAPI error:', error);
        setVoiceState(VoiceState.FORM);
        resetState();
      }
    });
    
    return () => {
      cleanup();
      resetState();
    };
  }, [setSpeaking, setVolumeLevel, resetState]);
  
  const handleStartCall = () => {
    // Already handled by VAPI events
  };
  
  const handleEndCall = async () => {
    try {
      const result = await stopVoiceAssistant();
      setCallResult(result);
      setVoiceState(VoiceState.CALL_SUMMARY);
    } catch (error) {
      console.error('Error ending call:', error);
      resetState();
      setVoiceState(VoiceState.FORM);
    }
  };
  
  const handleNewCall = () => {
    resetState();
    clearCallData();
    setVoiceState(VoiceState.FORM);
  };
  
  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col items-center justify-center min-h-[90vh]">
      {voiceState === VoiceState.FORM && (
        <UserForm onStartCall={handleStartCall} />
      )}
      
      {voiceState === VoiceState.ACTIVE_CALL && (
        <ActiveCall onEndCall={handleEndCall} />
      )}
      
      {voiceState === VoiceState.CALL_SUMMARY && (
        <CallSummary onNewCall={handleNewCall} />
      )}
    </div>
  );
};

export default VoiceAssistant;