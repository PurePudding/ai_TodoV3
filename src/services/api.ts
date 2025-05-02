import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_DATABASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to format tool call for the API
const formatToolCall = (
  functionName: string,
  args: Record<string, any> = {},
  id: string = "tool-call-1"
) => {
  return {
    message: {
      toolCalls: [
        {
          id,
          function: {
            name: functionName,
            arguments: JSON.stringify(args),
          },
        },
      ],
    },
  };
};

// Todo API
export const todoApi = {
  getTodos: async () => {
    const response = await api.post("/get_todos/", formatToolCall("getTodos"));
    return response.data.results[0].result;
  },

  createTodo: async (title: string, description: string = "") => {
    const response = await api.post(
      "/create_todo/",
      formatToolCall("createTodo", { title, description })
    );
    return response.data.results[0].result;
  },

  completeTodo: async (id: number) => {
    const response = await api.post(
      "/complete_todo/",
      formatToolCall("completeTodo", { id })
    );
    return response.data.results[0].result;
  },

  deleteTodo: async (id: number) => {
    const response = await api.post(
      "/delete_todo/",
      formatToolCall("deleteTodo", { id })
    );
    return response.data.results[0].result;
  },
};

// Reminder API
export const reminderApi = {
  getReminders: async () => {
    const response = await api.post(
      "/get_reminders/",
      formatToolCall("getReminders")
    );
    return response.data.results[0].result;
  },

  addReminder: async (reminder_text: string, importance: string) => {
    const response = await api.post(
      "/add_reminder/",
      formatToolCall("addReminder", { reminder_text, importance })
    );
    return response.data.results[0].result;
  },

  deleteReminder: async (id: number) => {
    const response = await api.post(
      "/delete_reminder/",
      formatToolCall("deleteReminder", { id })
    );
    return response.data.results[0].result;
  },
};

// Calendar API
export const calendarApi = {
  getCalendarEntries: async () => {
    const response = await api.post(
      "/get_calendar_entries/",
      formatToolCall("getCalendarEntries")
    );
    return response.data.results[0].result;
  },

  addCalendarEntry: async (
    title: string,
    description: string,
    event_from: string,
    event_to: string
  ) => {
    const response = await api.post(
      "/add_calendar_entry/",
      formatToolCall("addCalendarEntry", {
        title,
        description,
        event_from,
        event_to,
      })
    );
    return response.data.results[0].result;
  },

  deleteCalendarEntry: async (id: number) => {
    const response = await api.post(
      "/delete_calendar_entry/",
      formatToolCall("deleteCalendarEntry", { id })
    );
    return response.data.results[0].result;
  },
};

export default api;
