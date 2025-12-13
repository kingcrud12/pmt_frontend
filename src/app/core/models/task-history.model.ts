export interface TaskHistory {
    id: string; // UUID
    task_id: string; // UUID
    modifier_id: string; // UUID
    change_type: string;
    old_value?: string;
    new_value?: string;
    modified_at?: string; // ISO timestamp
}
