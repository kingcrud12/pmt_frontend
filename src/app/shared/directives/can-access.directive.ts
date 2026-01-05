import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';
import { ActionType, ResourceType } from '../../core/models/permission.model';

/**
 * CanAccessDirective
 *
 * Structural directive to conditionally render elements based on user permissions.
 * Shows/hides elements if user has required permission.
 *
 * @example
 * <!-- Show button only if user can delete tasks -->
 * <button *appCanAccess="'task'; action: 'delete'">Delete Task</button>
 *
 * @example
 * <!-- Show div only if user can create projects -->
 * <div *appCanAccess="'project'; action: 'create'">
 *   Create New Project
 * </div>
 */
@Directive({
  selector: '[appCanAccess]',
  standalone: true,
})
export class CanAccessDirective implements OnInit {
  private resource!: ResourceType;
  private action!: ActionType;
  private hasPermission = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  /**
   * Set the resource for permission check
   * @param resource - Resource type (task, project, user, team, settings)
   */
  @Input()
  set appCanAccess(resource: ResourceType) {
    this.resource = resource;
    this.updateView();
  }

  /**
   * Set the action for permission check
   * @param action - Action type (create, read, update, delete, export, share)
   */
  @Input()
  set appCanAccessAction(action: ActionType) {
    this.action = action;
    this.updateView();
  }

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    // Only check permission if both resource and action are set
    if (!this.resource || !this.action) {
      return;
    }

    this.hasPermission = this.permissionService.hasPermission(
      this.resource,
      this.action
    );

    if (this.hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
