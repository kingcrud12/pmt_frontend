import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  UserRole,
  ActionType,
  ResourceType,
  ROLE_PERMISSIONS,
} from '../models/permission.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * PermissionService
 *
 * Manages role-based access control (RBAC) for resources and actions.
 * Provides methods to check if a user has permission to perform specific actions.
 *
 * @example
 * // In a component
 * hasDeletePermission = this.permissionService.hasPermission('task', 'delete');
 *
 * @example
 * // In a template
 * <button *appCanAccess="'task'; action: 'delete'">Delete Task</button>
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private authService: AuthService) {}

  /**
   * Check if current user has permission for a resource-action pair
   * Synchronous version (for immediate checks)
   *
   * @param resource - The resource type (task, project, user, team, settings)
   * @param action - The action to perform (create, read, update, delete, export, share)
   * @returns boolean - True if user has permission, false otherwise
   *
   * @example
   * if (this.permissionService.hasPermission('task', 'delete')) {
   *   // Show delete button
   * }
   */
  hasPermission(resource: ResourceType, action: ActionType): boolean {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return false;
    }

    // Get user role (default to 'User' if not specified)
    const userRole = (currentUser.role as UserRole) || 'User';

    // Get allowed actions for this user's role and resource
    const allowedActions = ROLE_PERMISSIONS[userRole]?.[resource] ?? [];

    return allowedActions.includes(action);
  }

  /**
   * Check if current user has permission (Observable version)
   * Useful for reactive components and async operations
   *
   * @param resource - The resource type
   * @param action - The action to perform
   * @returns Observable<boolean> - Observable that emits permission status
   *
   * @example
   * canDelete$ = this.permissionService.hasPermission$('task', 'delete');
   *
   * <button [disabled]="!(canDelete$ | async)">Delete</button>
   */
  hasPermission$(
    resource: ResourceType,
    action: ActionType
  ): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user) => {
        if (!user) return false;

        const userRole = (user.role as UserRole) || 'User';
        const allowedActions = ROLE_PERMISSIONS[userRole]?.[resource] ?? [];

        return allowedActions.includes(action);
      })
    );
  }

  /**
   * Check if user has any permission for a resource
   *
   * @param resource - The resource type
   * @returns boolean - True if user has any action permission on resource
   */
  canAccessResource(resource: ResourceType): boolean {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return false;
    }

    const userRole = (currentUser.role as UserRole) || 'User';
    const allowedActions = ROLE_PERMISSIONS[userRole]?.[resource] ?? [];

    return allowedActions.length > 0;
  }

  /**
   * Get all allowed actions for a user on a specific resource
   *
   * @param resource - The resource type
   * @returns ActionType[] - Array of allowed actions
   */
  getAllowedActions(resource: ResourceType): ActionType[] {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const userRole = (currentUser.role as UserRole) || 'User';
    return ROLE_PERMISSIONS[userRole]?.[resource] ?? [];
  }

  /**
   * Get current user role
   *
   * @returns UserRole | null - Current user's role or null if not authenticated
   */
  getCurrentUserRole(): UserRole | null {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? (currentUser.role as UserRole) : null;
  }
}
