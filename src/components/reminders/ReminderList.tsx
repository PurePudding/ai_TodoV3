import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, Plus } from 'lucide-react';
import Button from '../ui/Button';
import useDataStore from '../../stores/dataStore';

const ReminderList: React.FC = () => {
  const { reminders, isLoading, addReminder, deleteReminder } = useDataStore();
  const [newReminder, setNewReminder] = useState('');
  const [importance, setImportance] = useState('medium');

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.trim()) return;
    
    addReminder(newReminder, importance);
    setNewReminder('');
  };

  const getImportanceStyle = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Reminders</h2>
      
      <form onSubmit={handleAddReminder} className="mb-4">
        <div className="flex mb-2">
          <input
            type="text"
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            placeholder="Add a new reminder..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Importance:</span>
            {['Low', 'Medium', 'High'].map((level) => (
              <label
                key={level}
                className={`
                  inline-flex items-center px-2 py-1 rounded-md text-xs font-medium cursor-pointer
                  ${importance.toLowerCase() === level.toLowerCase()
                    ? getImportanceStyle(level)
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }
                `}
              >
                <input
                  type="radio"
                  name="importance"
                  value={level.toLowerCase()}
                  checked={importance === level.toLowerCase()}
                  onChange={() => setImportance(level.toLowerCase())}
                  className="sr-only"
                />
                {level}
              </label>
            ))}
          </div>
          
          <Button
            type="submit"
            variant="primary"
            disabled={!newReminder.trim() || isLoading}
            icon={<Plus size={18} />}
          >
            Add
          </Button>
        </div>
      </form>
      
      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {reminders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 text-gray-500"
            >
              No reminders yet. Add one above!
            </motion.div>
          ) : (
            <ul className="space-y-2">
              {reminders.map((reminder) => (
                <motion.li
                  key={reminder.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-300"
                >
                  <div className="flex items-center flex-1">
                    <div className="mr-3 text-indigo-500">
                      <Bell className="h-5 w-5" />
                    </div>
                    <span className="flex-1 text-gray-700">
                      {reminder.reminder_text}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${getImportanceStyle(
                        reminder.importance
                      )}`}
                    >
                      {reminder.importance.charAt(0).toUpperCase() + reminder.importance.slice(1)}
                    </span>
                    
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ReminderList;