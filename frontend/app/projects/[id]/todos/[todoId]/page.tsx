'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { projectsApi, todosApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit2, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Todo } from '@/lib/types';

function TodoDetailContent() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const todoId = parseInt(params.todoId as string);

  const { data: todo, isLoading } = useQuery<Todo>({
    queryKey: ['todo', projectId, todoId],
    queryFn: async () => {
      const response = await todosApi.retrieve(todoId);
      const foundTodo = response.data;
      if (!foundTodo) throw new Error('Todo not found');
      return foundTodo;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Button>
        </Link>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : todo ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{todo.title}</h1>
                <div className="flex items-center gap-3">
                  <StatusBadge status={todo.status} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            {/* Description */}
            {todo.description && (
              <Card className="p-6 bg-muted/50">
                <h2 className="font-semibold mb-3">Description</h2>
                <p className="text-foreground whitespace-pre-wrap">{todo.description}</p>
              </Card>
            )}

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Due Date
                </h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-medium">
                    {todo.due_date
                      ? format(new Date(todo.due_date), 'EEEE, MMMM d, yyyy')
                      : 'No due date set'}
                  </span>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Status
                </h3>
                <div className="flex items-center gap-2">
                  <StatusBadge status={todo.status} />
                  <span className="text-lg font-medium capitalize">
                    {todo.status.replace('_', ' ')}
                  </span>
                </div>
              </Card>
            </div>

            {/* Tags */}
            {todo.tags.length > 0 && (
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {todo.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-4 py-2 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Timestamps */}
            <Card className="p-6 bg-muted/50">
              <h2 className="font-semibold mb-4">Information</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Created: {format(new Date(todo.created_at), 'PPpp')}
                </p>
                <p>
                  Last updated: {format(new Date(todo.updated_at), 'PPpp')}
                </p>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1">Edit Todo</Button>
              <Button variant="destructive" className="flex-1">
                Delete Todo
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Todo not found</p>
            <Link href={`/projects/${projectId}`}>
              <Button className="mt-4">Back to Project</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TodoDetailPage() {
  return (
    <ProtectedRoute>
      <TodoDetailContent />
    </ProtectedRoute>
  );
}
