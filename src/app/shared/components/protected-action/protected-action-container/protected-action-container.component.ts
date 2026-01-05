import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionService } from '../../../../core/services/permission.service';
import {
  ActionType,
  ResourceType,
} from '../../../../core/models/permission.model';

/**
 * ProtectedActionContainerComponent
 *
 * Advanced wrapper that provides both allowed and denied templates.
 * More powerful than ProtectedActionComponent for complex scenarios.
 *
 * @example
 * <app-protected-action-container resource="task" action="delete">
 *   <!-- Displayed if user has permission -->
 *   <ng-template appProtectedContent>
 *     <button (click)="deleteTask()">Delete</button>
 *   </ng-template>
 *
 *   <!-- Displayed if user doesn't have permission -->
 *   <ng-template appProtectedDenied>
 *     <button disabled class="btn-disabled">Delete (No Permission)</button>
 *   </ng-template>
 * </app-protected-action-container>
 */
@Component({
  selector: 'app-protected-action-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protected-action-container.component.html',
  styleUrls: ['./protected-action-container.component.css'],
})
export class ProtectedActionContainerComponent implements OnInit {
  /**
   * Resource type (task, project, user, team, settings)
   */
  @Input() resource!: ResourceType;

  /**
   * Action type (create, read, update, delete, export, share)
   */
  @Input() action!: ActionType;

  /**
   * Template to display when permission is granted
   */
  @Input() allowedTemplate!: TemplateRef<any>;

  /**
   * Template to display when permission is denied
   */
  @Input() deniedTemplate: TemplateRef<any> | null = null;

  hasPermission = false;

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    if (!this.resource || !this.action) {
      console.warn(
        'ProtectedActionContainerComponent: resource and action inputs are required'
      );
      return;
    }

    this.hasPermission = this.permissionService.hasPermission(
      this.resource,
      this.action
    );
  }
}
