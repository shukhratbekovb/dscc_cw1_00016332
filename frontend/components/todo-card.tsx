import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { format } from 'date-fns';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import type { Todo } from '@/lib/types';

interface TodoCardProps {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
  onDelete?: (todoId: number) => void;
  onStatusChange?: (todoId: number, status: string) => void;
}

export function TodoCard({ todo, onEdit, onDelete }: TodoCardProps) {
  const dueDate = todo.due_date ? format(new Date(todo.due_date), 'MMM d, yyyy') : null;

  return (
    <Link href={`/projects/${todo.project}/todos/${todo.id}`}>
      <Card className="p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold flex-1 line-clamp-2">{todo.title}</h3>
          <div className="flex items-center gap-1">
            <StatusBadge status={todo.status} />
            {(onEdit || onDelete) && (
              <div className="flex gap-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.preventDefault();
                      onEdit(todo);
                    }}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(todo.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {todo.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {todo.description}
          </p>
        )}

        {dueDate && (
          <span className="text-xs text-muted-foreground">
            Due: {dueDate}
          </span>
        )}

        {todo.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {todo.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-auto pt-2 border-t">
          <ExternalLink className="h-3 w-3" />
          <span>View details</span>
        </div>
      </Card>
    </Link>
  );
}

