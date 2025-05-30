import express from 'express';
import Board from '../models/Board.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all boards for current user
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user.userId })
      .populate('owner', 'username email')
      .populate('sharedWith', 'username email');
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shared boards
router.get('/shared', auth, async (req, res) => {
  try {
    const boards = await Board.find({ sharedWith: req.user.userId })
      .populate('owner', 'username email')
      .populate('sharedWith', 'username email');
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get board by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.userId },
        { sharedWith: req.user.userId }
      ]
    }).populate('owner', 'username email')
      .populate('sharedWith', 'username email');
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new board
router.post('/', auth, async (req, res) => {
  try {
    const board = new Board({
      name: req.body.name,
      owner: req.user.userId
    });
    
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Share board
router.post('/:id/share', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const userToShare = await User.findOne({ email: req.body.userEmail });
    if (!userToShare) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (board.sharedWith.includes(userToShare._id)) {
      return res.status(400).json({ message: 'Board already shared with this user' });
    }

    board.sharedWith.push(userToShare._id);
    await board.save();
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add task to board
router.post('/:id/tasks', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.userId },
        { sharedWith: req.user.userId }
      ]
    });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    board.tasks.push({
      title: req.body.title,
      description: req.body.description
    });
    
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:boardId/tasks/:taskId', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user.userId },
        { sharedWith: req.user.userId }
      ]
    });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const task = board.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, req.body);
    await board.save();
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:boardId/tasks/:taskId', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user.userId },
        { sharedWith: req.user.userId }
      ]
    });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    board.tasks.pull(req.params.taskId);
    await board.save();
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;