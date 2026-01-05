# Permission System (RBAC) - Hook usePermission

## Vue d'ensemble

Le système de permissions utilise le **Role-Based Access Control (RBAC)** pour gérer l'accès aux ressources et actions. Les utilisateurs ont des rôles (Admin, Manager, User, Guest) qui définissent leurs permissions.

## Fichiers concernés

1. **`permission.model.ts`** - Modèles et configuration des permissions
2. **`permission.service.ts`** - Service de gestion des permissions
3. **`can-access.directive.ts`** - Directive structurelle pour templates

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

### 4. Récupérer les actions autorisées

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
