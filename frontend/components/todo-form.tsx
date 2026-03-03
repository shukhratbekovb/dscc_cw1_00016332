'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { tagsApi } from '@/lib/api';
import type { Todo, TodoStatus, Tag } from '@/lib/types';

interface TodoFormProps {
  projectId: number;
  todo?: Todo;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TodoForm({
  projectId,
  todo,
  onSave,
  onCancel,
  isLoading = false,
}: TodoFormProps) {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [status, setStatus] = useState<TodoStatus>(todo?.status || 'new');
  const [dueDate, setDueDate] = useState(todo?.due_date || '');
  const [selectedTags, setSelectedTags] = useState<Tag[]>(todo?.tags || []);
  const [error, setError] = useState('');

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await tagsApi.list();
      return response.data;
    },
  });

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.find((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        status,
        due_date: dueDate || null,
        tags: selectedTags.map((t) => t.id),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save todo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {error && (
        <div className="bg-destructive/10 text-destructive px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          disabled={isLoading}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TodoStatus)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="new">New</option>
          <option value="process">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Archived</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedTags.find((t) => t.id === tag.id)
                    ? 'opacity-100 ring-2 ring-offset-2'
                    : 'opacity-50 hover:opacity-75'
                }`}
                style={{
                  backgroundColor:
                    selectedTags.find((t) => t.id === tag.id) || false
                      ? tag.color
                      : `${tag.color}40`,
                  color: selectedTags.find((t) => t.id === tag.id)
                    ? 'white'
                    : tag.color,
                }}
              >
                {tag.name}
              </button>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No tags available</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : todo ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

