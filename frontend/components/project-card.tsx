import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Edit2, Trash2 } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: number) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {project.description || 'No description provided'}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Link href={`/projects/${project.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Todos
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onEdit(project);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onDelete(project.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </Card>
  );
}

