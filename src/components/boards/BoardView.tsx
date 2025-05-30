import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useBoardStore } from '../../stores/boardStore';

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const { currentBoard, getBoardById, addTask, updateTask, deleteTask, shareBoard, isLoading } = useBoardStore();
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    if (id) {
      getBoardById(id);
    }
  }, [id, getBoardById]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await addTask(id!, newTask);
      setNewTask({ title: '', description: '' });
      toast.success('Task added successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add task');
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;

    try {
      await shareBoard(id!, shareEmail);
      setShareEmail('');
      toast.success('Board shared successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to share board');
    }
  };

  if (isLoading || !currentBoard) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{currentBoard.name}</h1>
        
        <form onSubmit={handleShare} className="flex gap-2">
          <input
            type="email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            placeholder="Share with email"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Share
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleAddTask} className="space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Task description"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add Task
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        <div className="space-y-4">
          {currentBoard.tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-white rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateTask(id!, task._id, { completed: !task.completed })}
                    className={`px-3 py-1 rounded-lg ${
                      task.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {task.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                  <button
                    onClick={() => deleteTask(id!, task._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="text-gray-600">{task.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardView;