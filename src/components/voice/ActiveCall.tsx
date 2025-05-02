import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mic, MicOff, AlertCircle } from 'lucide-react';
import VoiceVisualizer from './VoiceVisualizer';
import Button from '../ui/Button';
import useAssistantStore from '../../stores/assistantStore';
import useUserStore from '../../stores/userStore';

interface ActiveCallProps {
  onEndCall: () => void;
}

const ActiveCall: React.FC<ActiveCallProps> = ({ onEndCall }) => {
  const { isSpeaking, volumeLevel } = useAssistantStore();
  const { user } = useUserStore();
  
  if (!user) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isSpeaking ? Infinity : 0,
              repeatType: "reverse"
            }}
            className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center"
          >
            <Phone size={44} className="text-indigo-600" />
          </motion.div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800">
          Active Voice Session
        </h2>
        
        <p className="text-gray-600 mt-1">
          {user.firstName} {user.lastName}
        </p>
        
        <div className="mt-4 mb-2">
          <VoiceVisualizer isSpeaking={isSpeaking} volumeLevel={volumeLevel} />
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
          {isSpeaking ? (
            <>
              <Mic size={18} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">Assistant is speaking</span>
            </>
          ) : (
            <>
              <MicOff size={18} className="text-gray-500" />
              <span>Listening...</span>
            </>
          )}
        </div>
        
        <div className="mt-6">
          <Button 
            variant="danger" 
            size="lg"
            fullWidth
            onClick={onEndCall}
            icon={<Phone size={18} />}
          >
            End Call
          </Button>
        </div>
        
        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          <AlertCircle size={14} className="mr-1" />
          <span>Your voice is being processed to interact with the assistant</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActiveCall;