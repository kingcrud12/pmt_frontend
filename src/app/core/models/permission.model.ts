/**
 * Permission Model
 * Defines resource-action pairs and role-based access control
 */

export type UserRole = 'Admin' | 'Manager' | 'User' | 'Guest';

export type ResourceType = 'task' | 'project' | 'user' | 'team' | 'settings';

export type ActionType =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export'
  | 'share';

/**
 * Role-based permission matrix
 * Maps roles to allowed actions on specific resources
 */
export const ROLE_PERMISSIONS: Record<
  UserRole,
  Record<ResourceType, ActionType[]>
> = {
  Admin: {
    task: ['create', 'read', 'update', 'delete', 'export', 'share'],
    project: ['create', 'read', 'update', 'delete', 'export', 'share'],
    user: ['create', 'read', 'update', 'delete'],
    team: ['create', 'read', 'update', 'delete'],
    settings: ['create', 'read', 'update', 'delete'],
  },
  Manager: {
    task: ['create', 'read', 'update', 'delete', 'export', 'share'],
    project: ['create', 'read', 'update', 'export', 'share'],
    user: ['read'],
    team: ['read', 'update'],
    settings: ['read'],
  },
  User: {
    task: ['create', 'read', 'update', 'export', 'share'],
    project: ['read', 'export'],
    user: ['read'],
    team: ['read'],
    settings: ['read'],
  },
  Guest: {
    task: ['read'],
    project: ['read'],
    user: ['read'],
    team: ['read'],
    settings: [],
  },
};

/**
 * Permission interface for checking access
 */
export interface PermissionCheck {
  resource: ResourceType;
  action: ActionType;
}
