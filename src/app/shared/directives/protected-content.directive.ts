import { Directive, Input } from '@angular/core';

/**
 * ProtectedContentDirective
 *
 * Used within ProtectedActionContainerComponent to mark the template
 * that should be displayed when user HAS permission.
 *
 * @example
 * <ng-template appProtectedContent>
 *   <button>Delete</button>
 * </ng-template>
 */
@Directive({
  selector: '[appProtectedContent]',
  standalone: true,
})
export class ProtectedContentDirective {
  constructor() {}
}

/**
 * ProtectedDeniedDirective
 *
 * Used within ProtectedActionContainerComponent to mark the template
 * that should be displayed when user DOESN'T have permission.
 *
 * @example
 * <ng-template appProtectedDenied>
 *   <button disabled>No Permission</button>
 * </ng-template>
 */
@Directive({
  selector: '[appProtectedDenied]',
  standalone: true,
})
export class ProtectedDeniedDirective {
  constructor() {}
}
