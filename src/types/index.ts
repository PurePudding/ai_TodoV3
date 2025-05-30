export interface User {
  _id: string;
  email: string;
  username: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  owner: string;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  _id: string;
  name: string;
  tasks: Task[];
  owner: string;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}