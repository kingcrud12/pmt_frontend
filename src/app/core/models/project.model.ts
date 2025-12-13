export interface Project {
    id: string; // UUID
    name: string;
    description?: string;
    author_id: string; // UUID of User
    created_at?: string; // ISO timestamp
}
