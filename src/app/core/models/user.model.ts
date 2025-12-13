export interface User {
    id: string; // UUID
    first_name: string;
    last_name: string;
    email: string;
    role: 'User'; // Global role default
    created_at?: string; // ISO timestamp
}
