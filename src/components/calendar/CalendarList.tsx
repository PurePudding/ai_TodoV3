import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Trash2, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Button from '../ui/Button';
import useDataStore from '../../stores/dataStore';

const CalendarList: React.FC = () => {
  const { calendarEvents, isLoading, addCalendarEvent, deleteCalendarEvent } = useDataStore();
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    fromDate: '',
    fromTime: '',
    toDate: '',
    toTime: ''
  });
  
  const [formVisible, setFormVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.fromDate || !newEvent.fromTime || !newEvent.toDate || !newEvent.toTime) {
      return;
    }
    
    const fromDateTime = `${newEvent.fromDate}T${newEvent.fromTime}:00`;
    const toDateTime = `${newEvent.toDate}T${newEvent.toTime}:00`;
    
    addCalendarEvent(
      newEvent.title,
      newEvent.description,
      fromDateTime,
      toDateTime
    );
    
    setNewEvent({
      title: '',
      description: '',
      fromDate: '',
      fromTime: '',
      toDate: '',
      toTime: ''
    });
    
    setFormVisible(false);
  };

  const formatEventTime = (dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Calendar Events</h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFormVisible(!formVisible)}
          icon={formVisible ? undefined : <Plus size={16} />}
        >
          {formVisible ? 'Cancel' : 'Add Event'}
        </Button>
      </div>
      
      <AnimatePresence>
        {formVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <form onSubmit={handleAddEvent} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add title..."
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add description..."
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={newEvent.fromDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Time
                  </label>
                  <input
                    type="time"
                    name="fromTime"
                    value={newEvent.fromTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={newEvent.toDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Time
                  </label>
                  <input
                    type="time"
                    name="toTime"
                    value={newEvent.toTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Event'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {calendarEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 text-gray-500"
            >
              No events scheduled. Add one above!
            </motion.div>
          ) : (
            <ul className="space-y-3">
              {calendarEvents.map((event) => (
                <motion.li
                  key={event.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-lg border border-gray-300"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    
                    <button
                      onClick={() => deleteCalendarEvent(event.id)}
                      className="text-gray-400 hover:text-red-500 focus:outline-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                      <span>
                        {formatEventTime(event.event_from)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                      <span>
                        to {formatEventTime(event.event_to)}
                      </span>
                    </div>
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

export default CalendarList;