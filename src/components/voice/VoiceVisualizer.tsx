import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VoiceVisualizerProps {
  volumeLevel: number;
  isSpeaking: boolean;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ volumeLevel, isSpeaking }) => {
  const MAX_BARS = 30;
  const bars = Array.from({ length: MAX_BARS });
  
  // Calculate bar heights based on volume level
  const calculateBarHeight = (index: number) => {
    const middleIndex = Math.floor(MAX_BARS / 2);
    const distanceFromMiddle = Math.abs(index - middleIndex);
    
    // Base height that increases with volume level (0-100)
    const baseHeight = Math.max(10, volumeLevel * 1.5);
    
    // Decrease height as you move away from the middle
    const heightModifier = 1 - (distanceFromMiddle / middleIndex) * 0.8;
    
    // Add some randomness
    const randomFactor = isSpeaking ? Math.random() * 20 - 10 : 0;
    
    return Math.max(5, baseHeight * heightModifier + randomFactor);
  };

  return (
    <div className="flex items-center justify-center h-20 w-full">
      <div className="flex items-center justify-center gap-1 h-full">
        {bars.map((_, index) => (
          <motion.div
            key={index}
            className={`w-1 rounded-full ${
              isSpeaking ? 'bg-indigo-500' : 'bg-gray-400'
            }`}
            initial={{ height: 5 }}
            animate={{ 
              height: isSpeaking ? calculateBarHeight(index) : 5,
              opacity: isSpeaking ? 0.8 : 0.4,
            }}
            transition={{
              type: 'spring',
              damping: 10,
              stiffness: 100,
              duration: 0.1
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VoiceVisualizer;