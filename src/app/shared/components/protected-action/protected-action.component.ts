import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionService } from '../../../core/services/permission.service';
import {
  ActionType,
  ResourceType,
} from '../../../core/models/permission.model';

/**
 * ProtectedActionComponent
 *
 * Wrapper component that conditionally displays/hides content based on user permissions.
 * More flexible than *appCanAccess directive - allows custom fallback UI.
 *
 * @example
 * <!-- Show button only if user has delete permission -->
 * <app-protected-action resource="task" action="delete">
 *   <button (click)="deleteTask()">Delete Task</button>
 * </app-protected-action>
 *
 * @example
 * <!-- With fallback message -->
 * <app-protected-action resource="project" action="create">
 *   <button>Create Project</button>
 *   <ng-template #fallback>
 *     <p>You don't have permission to create projects</p>
 *   </ng-template>
 * </app-protected-action>
 */
@Component({
  selector: 'app-protected-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "protected-action.component.html",
  styleUrls: ["protected-action.component.css"],
})
export class ProtectedActionComponent implements OnInit {
  /**
   * Resource type (task, project, user, team, settings)
   */
  @Input() resource!: ResourceType;

  /**
   * Action type (create, read, update, delete, export, share)
   */
  @Input() action!: ActionType;

  /**
   * Template to display when user doesn't have permission
   * If not provided and showDefaultFallback is true, displays default message
   */
  @Input() fallbackTemplate: any = null;

  /**
   * Show default permission denied message if no fallback template provided
   * Default: false
   */
  @Input() showDefaultFallback = false;

  hasPermission = false;

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    if (!this.resource || !this.action) {
      console.warn(
        'ProtectedActionComponent: resource and action inputs are required'
      );
      return;
    }

    this.hasPermission = this.permissionService.hasPermission(
      this.resource,
      this.action
    );
  }
}
