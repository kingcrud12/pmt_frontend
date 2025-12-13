export type TaskStatus = 'todo' | 'inprogress' | 'completed' | 'overdue';

export type TaskPriority = 'low' | 'medium' | 'high';

export type ProjectRole = 'admin' | 'member' | 'observer';

export interface User {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo?: string;
    assignedToId?: number;
    author: string;
    authorId?: number;
    project: string;
    projectId?: number;
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
    color: string;
}

export interface TaskDetail extends Task {
    createdAt: string;
    history: HistoryEntry[];
}


export interface HistoryEntry {
    id?: number;
    date: string;
    user: string;
    userId?: number;
    action: string;
    field?: string;
    oldValue?: string;
    newValue?: string;
}


export interface Project {
    id: number;
    name: string;
    description?: string;
    progress: number;
    color: string;
    authorId?: number;
    createdAt?: string;
    updatedAt?: string;
    role?: ProjectRole | string;
    tasks?: Task[];
    members?: Member[];
    observers?: Observer[];
}


export interface Member {
    id: number;
    name: string;
    email?: string;
    role: ProjectRole;
    joinedAt?: string;
    avatar?: string;
}


export interface Observer extends Member {
    role: 'observer';
}
