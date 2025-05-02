import Vapi from "@vapi-ai/web";

// Initialize Vapi with API key from environment variables
export const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);
const assistantId = import.meta.env.VITE_ASSISTANT_ID;

/**
 * Start the VAPI assistant with user information
 */
export const startAssistant = async (firstName: string, lastName: string, email: string, phone: string) => {
  const assistantOverrides = {
    variableValues: {
      firstName,
      lastName,
      email,
      phone,
    },
  };
  return await vapi.start(assistantId, assistantOverrides);
};

/**
 * Stop the VAPI assistant
 */
export const stopAssistant = () => {
  vapi.stop();
};

/**
 * Get call details from the backend
 */
export const getCallDetails = async (callId: string) => {
  try {
    const response = await fetch(
      `http://localhost:8000/call-details?call_id=${callId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching call details:", error);
    throw error;
  }
};

/**
 * Setup VAPI event handlers
 */
export const setupVapiEventHandlers = (handlers: {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onVolumeLevel?: (level: number) => void;
  onError?: (error: any) => void;
}) => {
  if (handlers.onCallStart) vapi.on('call-start', handlers.onCallStart);
  if (handlers.onCallEnd) vapi.on('call-end', handlers.onCallEnd);
  if (handlers.onSpeechStart) vapi.on('speech-start', handlers.onSpeechStart);
  if (handlers.onSpeechEnd) vapi.on('speech-end', handlers.onSpeechEnd);
  if (handlers.onVolumeLevel) vapi.on('volume-level', handlers.onVolumeLevel);
  if (handlers.onError) vapi.on('error', handlers.onError);
  
  // Return cleanup function
  return () => {
    if (handlers.onCallStart) vapi.off('call-start', handlers.onCallStart);
    if (handlers.onCallEnd) vapi.off('call-end', handlers.onCallEnd);
    if (handlers.onSpeechStart) vapi.off('speech-start', handlers.onSpeechStart);
    if (handlers.onSpeechEnd) vapi.off('speech-end', handlers.onSpeechEnd);
    if (handlers.onVolumeLevel) vapi.off('volume-level', handlers.onVolumeLevel);
    if (handlers.onError) vapi.off('error', handlers.onError);
  };
};

export default {
  vapi,
  startAssistant,
  stopAssistant,
  getCallDetails,
  setupVapiEventHandlers
};