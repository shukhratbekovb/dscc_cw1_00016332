'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TodoForm } from './todo-form';
import type { Todo } from '@/lib/types';

interface TodoModalProps {
  isOpen: boolean;
  projectId: number;
  todo?: Todo;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function TodoModal({
  isOpen,
  projectId,
  todo,
  onClose,
  onSave,
}: TodoModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (data: any) => {
    setIsLoading(true);
    try {
      await onSave(data);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 mx-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {todo ? 'Edit Todo' : 'Create New Todo'}
          </h2>
        </div>

        <TodoForm
          projectId={projectId}
          todo={todo}
          onSave={handleSave}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}
