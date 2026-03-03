'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { projectsApi, todosApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';
import { TodoCard } from '@/components/todo-card';
import { FilterBar } from '@/components/filter-bar';
import { TodoModal } from '@/components/todo-modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Project, Todo, TodoStatus } from '@/lib/types';

function ProjectContent() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await projectsApi.retrieve(projectId);
      return response.data;
    },
  });

  const { data: todos, isLoading: todosLoading, error, refetch } = useQuery<Todo[]>({
    queryKey: ['todos', projectId],
    queryFn: async () => {
      const response = await todosApi.listByProject(projectId);
      return response.data;
    },
  });

  const filteredTodos = selectedStatus
    ? todos?.filter((todo) => todo.status === selectedStatus)
    : todos;

  const handleCreateTodo = () => {
    setSelectedTodo(undefined);
    setIsModalOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleDeleteTodo = (todoId: number) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      console.log('[v0] Deleting todo:', todoId);
      todosApi.delete(todoId).then(() => {
        refetch();
      });
    }
  };

  const handleSaveTodo = async (data: any) => {
    setIsLoading(true);
    console.log('[v0] Saving todo:', data);
    try {
      if (selectedTodo) {
        await todosApi.update(selectedTodo.id, data);
      } else {
        await todosApi.create(projectId, data);
      }
      await refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error('[v0] Error saving todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        {projectLoading ? (
          <Skeleton className="h-12 w-64 mb-6" />
        ) : (
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{project?.name}</h1>
            {project?.description && (
              <p className="text-muted-foreground mt-2">{project.description}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredTodos?.length || 0} todo{filteredTodos?.length !== 1 ? 's' : ''}
            </span>
            <FilterBar
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>
          <Button onClick={handleCreateTodo}>
            <Plus className="h-4 w-4 mr-2" />
            New Todo
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-6">
            Failed to load todos. Please try again.
          </div>
        )}

        {todosLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : filteredTodos && filteredTodos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {selectedStatus ? 'No todos with this status' : 'No todos yet'}
            </p>
            <Button onClick={handleCreateTodo}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Todo
            </Button>
          </div>
        )}
      </main>

      <TodoModal
        isOpen={isModalOpen}
        projectId={projectId}
        todo={selectedTodo}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTodo(undefined);
        }}
        onSave={handleSaveTodo}
      />
    </div>
  );
}

export default function ProjectPage() {
  return (
    <ProtectedRoute>
      <ProjectContent />
    </ProtectedRoute>
  );
}
