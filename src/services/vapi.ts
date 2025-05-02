import Vapi from "@vapi-ai/web";

// Type extension specific to v1.4.2
declare module "@vapi-ai/web" {
  interface Vapi {
    /**
     * Remove event listener (available in @vapi-ai/web@1.4.2)
     * Note: This is the correct typing for version 1.4.2
     */
    removeListener(event: string, callback: (...args: any[]) => void): void;
  }
}

// Initialize Vapi
export const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);
const assistantId = import.meta.env.VITE_ASSISTANT_ID;
const API_BASE_URL =
  import.meta.env.VITE_DATABASE_URL || "http://localhost:8000";

// Event handler setup for v1.4.2
export const setupVapiEventHandlers = (handlers: {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onVolumeLevel?: (level: number) => void;
  onError?: (error: any) => void;
}) => {
  // Add event listeners
  if (handlers.onCallStart) vapi.on("call-start", handlers.onCallStart);
  if (handlers.onCallEnd) vapi.on("call-end", handlers.onCallEnd);
  if (handlers.onSpeechStart) vapi.on("speech-start", handlers.onSpeechStart);
  if (handlers.onSpeechEnd) vapi.on("speech-end", handlers.onSpeechEnd);
  if (handlers.onVolumeLevel) vapi.on("volume-level", handlers.onVolumeLevel);
  if (handlers.onError) vapi.on("error", handlers.onError);

  // Return cleanup function using removeListener
  return () => {
    if (handlers.onCallStart)
      vapi.removeListener("call-start", handlers.onCallStart);
    if (handlers.onCallEnd) vapi.removeListener("call-end", handlers.onCallEnd);
    if (handlers.onSpeechStart)
      vapi.removeListener("speech-start", handlers.onSpeechStart);
    if (handlers.onSpeechEnd)
      vapi.removeListener("speech-end", handlers.onSpeechEnd);
    if (handlers.onVolumeLevel)
      vapi.removeListener("volume-level", handlers.onVolumeLevel);
    if (handlers.onError) vapi.removeListener("error", handlers.onError);
  };
};

// Rest of your implementation...
export const startAssistant = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string
) => {
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

export const stopAssistant = () => {
  vapi.stop();
};

export const getCallDetails = async (callId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/call-details?call_id=${callId}`
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return await response.json();
};

export default {
  vapi,
  startAssistant,
  stopAssistant,
  getCallDetails,
  setupVapiEventHandlers,
};
