import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trash2, Circle, Plus } from 'lucide-react';
import Button from '../ui/Button';
import useDataStore from '../../stores/dataStore';

const TodoList: React.FC = () => {
  const { todos, isLoading, addTodo, completeTodo, deleteTodo } = useDataStore();
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    addTodo(newTodo);
    setNewTodo('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
      
      <form onSubmit={handleAddTodo} className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Button
          type="submit"
          variant="primary"
          className="rounded-l-none"
          disabled={!newTodo.trim() || isLoading}
          icon={<Plus size={18} />}
        >
          Add
        </Button>
      </form>
      
      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {todos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 text-gray-500"
            >
              No tasks yet. Add one above!
            </motion.div>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <motion.li
                  key={todo.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => !todo.completed && completeTodo(todo.id)}
                      disabled={todo.completed}
                      className="mr-3 text-gray-400 hover:text-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {todo.completed ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <span
                      className={`flex-1 ${
                        todo.completed ? 'text-gray-500 line-through' : 'text-gray-700'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default TodoList;