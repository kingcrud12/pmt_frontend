export interface ProjectMember {
    id: string; // UUID
    project_id: string; // UUID
    user_id: string; // UUID
    role: 'Observer' | 'Member' | 'Admin';
}
