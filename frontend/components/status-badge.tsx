import { Badge } from '@/components/ui/badge';
import type { TodoStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: TodoStatus;
}

const statusConfig: Record<TodoStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new: { label: 'New', variant: 'outline' },
  process: { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  canceled: { label: 'Archived', variant: 'outline' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
