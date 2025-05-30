import { create } from 'zustand';
import axios from 'axios';
import { Board, Task } from '../types';

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  sharedBoards: Board[];
  isLoading: boolean;
  error: string | null;
  
  fetchBoards: () => Promise<void>;
  fetchSharedBoards: () => Promise<void>;
  createBoard: (name: string) => Promise<void>;
  shareBoard: (boardId: string, userEmail: string) => Promise<void>;
  getBoardById: (boardId: string) => Promise<void>;
  addTask: (boardId: string, task: Partial<Task>) => Promise<void>;
  updateTask: (boardId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (boardId: string, taskId: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  currentBoard: null,
  sharedBoards: [],
  isLoading: false,
  error: null,

  fetchBoards: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/boards`, getAuthHeader());
      set({ boards: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch boards',
        isLoading: false 
      });
    }
  },

  fetchSharedBoards: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/boards/shared`, getAuthHeader());
      set({ sharedBoards: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch shared boards',
        isLoading: false 
      });
    }
  },

  createBoard: async (name) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/boards`, { name }, getAuthHeader());
      set(state => ({ 
        boards: [...state.boards, response.data],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create board',
        isLoading: false 
      });
    }
  },

  shareBoard: async (boardId, userEmail) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post(
        `${API_URL}/boards/${boardId}/share`,
        { userEmail },
        getAuthHeader()
      );
      await get().fetchBoards();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to share board',
        isLoading: false 
      });
    }
  },

  getBoardById: async (boardId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/boards/${boardId}`, getAuthHeader());
      set({ currentBoard: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch board',
        isLoading: false 
      });
    }
  },

  addTask: async (boardId, task) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post(
        `${API_URL}/boards/${boardId}/tasks`,
        task,
        getAuthHeader()
      );
      await get().getBoardById(boardId);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add task',
        isLoading: false 
      });
    }
  },

  updateTask: async (boardId, taskId, updates) => {
    try {
      set({ isLoading: true, error: null });
      await axios.put(
        `${API_URL}/boards/${boardId}/tasks/${taskId}`,
        updates,
        getAuthHeader()
      );
      await get().getBoardById(boardId);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update task',
        isLoading: false 
      });
    }
  },

  deleteTask: async (boardId, taskId) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(
        `${API_URL}/boards/${boardId}/tasks/${taskId}`,
        getAuthHeader()
      );
      await get().getBoardById(boardId);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete task',
        isLoading: false 
      });
    }
  }
}));