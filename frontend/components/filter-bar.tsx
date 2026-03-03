'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Filter, X } from 'lucide-react';
import type { TodoStatus } from '@/lib/types';

interface FilterBarProps {
  selectedStatus: TodoStatus | null;
  onStatusChange: (status: TodoStatus | null) => void;
}

const statuses: { value: TodoStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export function FilterBar({ selectedStatus, onStatusChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {selectedStatus ? statuses.find(s => s.value === selectedStatus)?.label : 'Filter by Status'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onStatusChange(null)}>
            All Statuses
          </DropdownMenuItem>
          {statuses.map((status) => (
            <DropdownMenuItem
              key={status.value}
              onClick={() => onStatusChange(status.value)}
              className={selectedStatus === status.value ? 'bg-accent' : ''}
            >
              {status.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedStatus && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusChange(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
