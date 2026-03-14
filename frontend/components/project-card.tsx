import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, SquarePen, Trash } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: number) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-200">
      
      {/* Project info */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{project.name}</h3>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {project.description || 'No description provided'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* View Todos */}
        <Link href={`/projects/${project.id}`} className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <ClipboardList className="h-4 w-4" />
            View Todos
          </Button>
        </Link>

        {/* Edit */}
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onEdit(project);
            }}
          >
            <SquarePen className="h-4 w-4" />
          </Button>
        )}

        {/* Delete */}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onDelete(project.id);
            }}
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </Card>
  );
}