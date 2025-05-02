import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, FileText, Info } from 'lucide-react';
import Button from '../ui/Button';
import useUserStore from '../../stores/userStore';

interface CallSummaryProps {
  onNewCall: () => void;
}

const CallSummary: React.FC<CallSummaryProps> = ({ onNewCall }) => {
  const { callResult, user } = useUserStore();
  
  if (!callResult || !user) return null;
  
  const isQualified = callResult.analysis?.structuredData?.is_qualified === true;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Call Summary</h2>
          <div className="flex items-center">
            {isQualified ? (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center">
                <CheckCircle size={14} className="mr-1" />
                Qualified
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center">
                <XCircle size={14} className="mr-1" />
                Not Qualified
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <FileText size={18} className="text-indigo-600 mr-2" />
            <h3 className="font-medium text-gray-800">Call Details</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Call ID</p>
              <p className="font-medium">{callResult.id || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Info size={18} className="text-indigo-600 mr-2" />
            <h3 className="font-medium text-gray-800">Summary</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
            {callResult.summary || "No summary available"}
          </div>
        </div>
        
        <Button
          variant="primary"
          fullWidth
          onClick={onNewCall}
        >
          Start New Call
        </Button>
      </div>
    </motion.div>
  );
};

export default CallSummary;