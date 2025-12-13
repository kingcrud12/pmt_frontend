import { TaskHistory } from './task-history.model';

export interface Task {
    id: string; // UUID
    project_id: string; // UUID

    status: 'todo' | 'inprogress' | 'overdue' | 'completed';
    priority: 'Low' | 'Medium' | 'High';

    assignee_id: string; // UUID
    name: string;
    description?: string;
    due_date?: string; // Date string (YYYY-MM-DD)
    completion_date?: string; // Date string (YYYY-MM-DD)
    created_at?: string; // ISO timestamp
}

export interface TaskDetail extends Task {
    history: TaskHistory[];
}
