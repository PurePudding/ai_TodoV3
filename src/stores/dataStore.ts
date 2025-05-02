import { create } from 'zustand';
import { todoApi, reminderApi, calendarApi } from '../services/api';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

interface Reminder {
  id: number;
  reminder_text: string;
  importance: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  event_from: string;
  event_to: string;
}

interface DataState {
  todos: Todo[];
  reminders: Reminder[];
  calendarEvents: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  
  // Fetch operations
  fetchTodos: () => Promise<void>;
  fetchReminders: () => Promise<void>;
  fetchCalendarEvents: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  
  // Todo operations
  addTodo: (title: string, description?: string) => Promise<void>;
  completeTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  
  // Reminder operations
  addReminder: (text: string, importance: string) => Promise<void>;
  deleteReminder: (id: number) => Promise<void>;
  
  // Calendar operations
  addCalendarEvent: (title: string, description: string, from: string, to: string) => Promise<void>;
  deleteCalendarEvent: (id: number) => Promise<void>;
}

const useDataStore = create<DataState>((set, get) => ({
  todos: [],
  reminders: [],
  calendarEvents: [],
  isLoading: false,
  error: null,
  
  fetchTodos: async () => {
    try {
      set({ isLoading: true, error: null });
      const todos = await todoApi.getTodos();
      set({ todos, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch todos', isLoading: false });
      console.error('Error fetching todos:', error);
    }
  },
  
  fetchReminders: async () => {
    try {
      set({ isLoading: true, error: null });
      const reminders = await reminderApi.getReminders();
      set({ reminders, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch reminders', isLoading: false });
      console.error('Error fetching reminders:', error);
    }
  },
  
  fetchCalendarEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      const calendarEvents = await calendarApi.getCalendarEntries();
      set({ calendarEvents, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch calendar events', isLoading: false });
      console.error('Error fetching calendar events:', error);
    }
  },
  
  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    await Promise.all([
      get().fetchTodos(),
      get().fetchReminders(),
      get().fetchCalendarEvents()
    ]);
    set({ isLoading: false });
  },
  
  addTodo: async (title, description = '') => {
    try {
      set({ isLoading: true, error: null });
      await todoApi.createTodo(title, description);
      await get().fetchTodos();
    } catch (error) {
      set({ error: 'Failed to add todo', isLoading: false });
      console.error('Error adding todo:', error);
    }
  },
  
  completeTodo: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await todoApi.completeTodo(id);
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === id ? { ...todo, completed: true } : todo
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to complete todo', isLoading: false });
      console.error('Error completing todo:', error);
    }
  },
  
  deleteTodo: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await todoApi.deleteTodo(id);
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete todo', isLoading: false });
      console.error('Error deleting todo:', error);
    }
  },
  
  addReminder: async (reminder_text, importance) => {
    try {
      set({ isLoading: true, error: null });
      await reminderApi.addReminder(reminder_text, importance);
      await get().fetchReminders();
    } catch (error) {
      set({ error: 'Failed to add reminder', isLoading: false });
      console.error('Error adding reminder:', error);
    }
  },
  
  deleteReminder: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await reminderApi.deleteReminder(id);
      set(state => ({
        reminders: state.reminders.filter(reminder => reminder.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete reminder', isLoading: false });
      console.error('Error deleting reminder:', error);
    }
  },
  
  addCalendarEvent: async (title, description, event_from, event_to) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.addCalendarEntry(title, description, event_from, event_to);
      await get().fetchCalendarEvents();
    } catch (error) {
      set({ error: 'Failed to add calendar event', isLoading: false });
      console.error('Error adding calendar event:', error);
    }
  },
  
  deleteCalendarEvent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.deleteCalendarEntry(id);
      set(state => ({
        calendarEvents: state.calendarEvents.filter(event => event.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete calendar event', isLoading: false });
      console.error('Error deleting calendar event:', error);
    }
  }
}));

export default useDataStore;