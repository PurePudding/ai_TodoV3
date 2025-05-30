import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useBoardStore } from '../../stores/boardStore';

const Dashboard = () => {
  const { boards, sharedBoards, fetchBoards, fetchSharedBoards, createBoard, isLoading } = useBoardStore();
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    fetchBoards();
    fetchSharedBoards();
  }, [fetchBoards, fetchSharedBoards]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    try {
      await createBoard(newBoardName);
      setNewBoardName('');
      toast.success('Board created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create board');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Board</h2>
        <form onSubmit={handleCreateBoard} className="flex gap-2">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Enter board name"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Board
          </button>
        </form>
      </div>

      <div className="grid gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">My Boards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boards.map((board) => (
              <Link
                key={board._id}
                to={`/board/${board._id}`}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{board.name}</h3>
                <p className="text-gray-600">
                  {board.tasks.length} tasks · {board.sharedWith.length} collaborators
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Shared With Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sharedBoards.map((board) => (
              <Link
                key={board._id}
                to={`/board/${board._id}`}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{board.name}</h3>
                <p className="text-gray-600">
                  Owned by {board.owner.username} · {board.tasks.length} tasks
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;