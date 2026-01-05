# Permission System (RBAC) - Hook usePermission

## Vue d'ensemble

Le système de permissions utilise le **Role-Based Access Control (RBAC)** pour gérer l'accès aux ressources et actions. Les utilisateurs ont des rôles (Admin, Manager, User, Guest) qui définissent leurs permissions.

## Fichiers concernés

1. **`permission.model.ts`** - Modèles et configuration des permissions
2. **`permission.service.ts`** - Service de gestion des permissions
3. **`can-access.directive.ts`** - Directive structurelle `*appCanAccess`
4. **`protected-action.component.ts`** - Composant wrapper simple
5. **`protected-action-container.component.ts`** - Composant wrapper avancé
6. **`protected-content.directive.ts`** - Directives pour templates

## Utilisation

### 1. Vérification synchrone dans les composants

```typescript
import { Component } from "@angular/core";
import { PermissionService } from "@core/services/permission.service";

@Component({
  selector: "app-task-manager",
  templateUrl: "./task-manager.component.html",
})
export class TaskManagerComponent {
  canDeleteTask: boolean;
  canCreateTask: boolean;

  constructor(private permissionService: PermissionService) {
    this.canDeleteTask = this.permissionService.hasPermission("task", "delete");
    this.canCreateTask = this.permissionService.hasPermission("task", "create");
  }

  deleteTask(id: string): void {
    if (this.permissionService.hasPermission("task", "delete")) {
      // Proceed with deletion
    }
  }
}
```

### 2. Vérification asynchrone (Observable)

```typescript
import { Component } from "@angular/core";
import { PermissionService } from "@core/services/permission.service";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
})
export class ProjectListComponent {
  canCreateProject$ = this.permissionService.hasPermission$("project", "create");
  canExportProjects$ = this.permissionService.hasPermission$("project", "export");

  constructor(private permissionService: PermissionService) {}
}
```

**Template:**

```html
<button [disabled]="!(canCreateProject$ | async)">Create Project</button>

<button [disabled]="!(canExportProjects$ | async)">Export Projects</button>
```

### 3. Directive `*appCanAccess` dans les templates

```html
<!-- Afficher un bouton seulement si l'utilisateur peut supprimer des tâches -->
<button *appCanAccess="'task'; action: 'delete'">Delete Task</button>

<!-- Afficher une section seulement pour les administrateurs -->
<div *appCanAccess="'settings'; action: 'delete'">
  <h3>Admin Settings</h3>
  <!-- Admin-only content -->
</div>

<!-- Créer un projet -->
<button *appCanAccess="'project'; action: 'create'">New Project</button>

<!-- Exporter les tâches -->
<button *appCanAccess="'task'; action: 'export'">Export Tasks</button>
```

### 4. Composant `<app-protected-action>` - Simple wrapper

Le composant wrapper simple affiche/cache le contenu selon les permissions:

```html
<!-- Afficher un bouton seulement si l'utilisateur peut supprimer -->
<app-protected-action resource="task" action="delete">
  <button (click)="deleteTask()">Delete Task</button>
</app-protected-action>

<!-- Avec message de secours par défaut -->
<app-protected-action resource="project" action="create" [showDefaultFallback]="true">
  <button>Create Project</button>
</app-protected-action>

<!-- Avec template personnalisé en fallback -->
<app-protected-action resource="settings" action="delete" [fallbackTemplate]="noPermission">
  <button>Delete Settings</button>
</app-protected-action>

<ng-template #noPermission>
  <p style="color: red;">Seuls les administrateurs peuvent supprimer les paramètres</p>
</ng-template>
```

**TypeScript:**

```typescript
import { Component } from "@angular/core";
import { ProtectedActionComponent } from "@shared/components/protected-action/protected-action.component";

@Component({
  selector: "app-task-list",
  imports: [ProtectedActionComponent],
  template: `
    <app-protected-action resource="task" action="delete" [showDefaultFallback]="true">
      <button>Delete Selected</button>
    </app-protected-action>
  `,
})
export class TaskListComponent {}
```

### 5. Composant `<app-protected-action-container>` - Template avancé

Pour plus de contrôle sur le contenu affiché/caché:

```html
<app-protected-action-container resource="task" action="delete">
  <!-- Contenu si l'utilisateur a la permission -->
  <ng-template appProtectedContent>
    <button class="btn-danger" (click)="deleteTask()">
      <svg><!-- delete icon --></svg>
      Delete Task
    </button>
  </ng-template>

  <!-- Contenu si l'utilisateur n'a PAS la permission -->
  <ng-template appProtectedDenied>
    <button class="btn-disabled" disabled>
      <svg><!-- lock icon --></svg>
      Delete (No Permission)
    </button>
  </ng-template>
</app-protected-action-container>
```

**Exemple complet avec condition sur le rôle:**

```html
<app-protected-action-container resource="user" action="delete">
  <ng-template appProtectedContent>
    <div class="user-actions">
      <button (click)="editUser()">Edit User</button>
      <button class="danger" (click)="deleteUser()">Delete User</button>
    </div>
  </ng-template>

  <ng-template appProtectedDenied>
    <div class="permission-restricted">
      <span class="badge">Admin Only</span>
      <p>This action is restricted to administrators</p>
    </div>
  </ng-template>
</app-protected-action-container>
```

### 6. Récupérer les actions autorisées

```typescript
export class TaskActionsComponent {
  allowedActions: ActionType[];

  constructor(private permissionService: PermissionService) {
    // Get all actions this user can perform on tasks
    this.allowedActions = this.permissionService.getAllowedActions("task");
  }

  canPerformAction(action: ActionType): boolean {
    return this.allowedActions.includes(action);
  }
}
```

### 7. Vérifier l'accès à une ressource

```typescript
export class ResourceGuardComponent {
  hasTaskAccess: boolean;
  hasSettingsAccess: boolean;

  constructor(private permissionService: PermissionService) {
    this.hasTaskAccess = this.permissionService.canAccessResource("task");
    this.hasSettingsAccess = this.permissionService.canAccessResource("settings");
  }
}
```

## Matrice de permissions par rôle

### Admin

- **task**: create, read, update, delete, export, share ✅
- **project**: create, read, update, delete, export, share ✅
- **user**: create, read, update, delete ✅
- **team**: create, read, update, delete ✅
- **settings**: create, read, update, delete ✅

```typescript
export class TaskActionsComponent {
  allowedActions: ActionType[];

  constructor(private permissionService: PermissionService) {
    // Get all actions this user can perform on tasks
    this.allowedActions = this.permissionService.getAllowedActions("task");
  }

  canPerformAction(action: ActionType): boolean {
    return this.allowedActions.includes(action);
  }
}
```

### 5. Vérifier l'accès à une ressource

```typescript
export class ResourceGuardComponent {
  hasTaskAccess: boolean;
  hasSettingsAccess: boolean;

  constructor(private permissionService: PermissionService) {
    this.hasTaskAccess = this.permissionService.canAccessResource("task");
    this.hasSettingsAccess = this.permissionService.canAccessResource("settings");
  }
}
```

## Matrice de permissions par rôle

### Admin

- **task**: create, read, update, delete, export, share ✅
- **project**: create, read, update, delete, export, share ✅
- **user**: create, read, update, delete ✅
- **team**: create, read, update, delete ✅
- **settings**: create, read, update, delete ✅

### Manager

- **task**: create, read, update, delete, export, share ✅
- **project**: create, read, update, export, share ✅
- **user**: read ✅
- **team**: read, update ✅
- **settings**: read ✅

### User

- **task**: create, read, update, export, share ✅
- **project**: read, export ✅
- **user**: read ✅
- **team**: read ✅
- **settings**: read ✅

### Guest

- **task**: read ✅
- **project**: read ✅
- **user**: read ✅
- **team**: read ✅
- **settings**: ❌

## Types disponibles

### ResourceType

- `'task'`
- `'project'`
- `'user'`
- `'team'`
- `'settings'`

### ActionType

- `'create'`
- `'read'`
- `'update'`
- `'delete'`
- `'export'`
- `'share'`

### UserRole

- `'Admin'`
- `'Manager'`
- `'User'`
- `'Guest'`

## Intégration avec Angular Guards

Pour protéger les routes en fonction des permissions:

```typescript
import { Injectable } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { PermissionService } from "@core/services/permission.service";
import { inject } from "@angular/core";

export const canAccessResourceGuard: CanActivateFn = (route) => {
  const permissionService = inject(PermissionService);
  const resource = route.data["resource"];
  const action = route.data["action"];

  return permissionService.hasPermission(resource, action);
};

// Usage in routes:
// {
//   path: 'tasks/:id/edit',
//   component: TaskEditComponent,
//   canActivate: [canAccessResourceGuard],
//   data: { resource: 'task', action: 'update' }
// }
```

## Notes

- Les permissions sont vérifiées basées sur le rôle de l'utilisateur connecté
- Le service consulte `AuthService` pour obtenir l'utilisateur actuel
- Si aucun utilisateur n'est connecté, aucune permission n'est accordée
- Les rôles peuvent être étendus en modifiant `ROLE_PERMISSIONS` dans `permission.model.ts`
