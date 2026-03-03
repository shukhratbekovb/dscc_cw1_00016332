// Authentication
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

// Projects
export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Tags
export interface Tag {
  id: number;
  name: string;
  color: string;
}

// Todos
export type TodoStatus = 'new' | 'process' | 'completed' | 'canceled';

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  project: number;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  status?: TodoStatus;
  due_date?: string | null;
  tags?: number[];
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: TodoStatus;
  due_date?: string | null;
  tags?: number[];
}

// API Errors
export interface ApiError {
  detail?: string;
  [key: string]: any;
}
