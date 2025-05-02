import React, { useEffect } from 'react';
import TodoList from '../components/todo/TodoList';
import ReminderList from '../components/reminders/ReminderList';
import CalendarList from '../components/calendar/CalendarList';
import useDataStore from '../stores/dataStore';
import useUserStore from '../stores/userStore';

const Dashboard: React.FC = () => {
  const { fetchAllData, isLoading } = useDataStore();
  const { user } = useUserStore();
  
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  
  if (!user) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user.firstName}!
        </h1>
        <p className="text-gray-600">
          Manage your tasks, reminders, and calendar
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TodoList />
          <ReminderList />
        </div>
        
        <div>
          <CalendarList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;