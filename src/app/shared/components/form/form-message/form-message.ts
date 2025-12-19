import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-form-message",
    templateUrl: "form-message.html",
    styleUrl: "form-message.css",
    standalone: true,
    imports: [CommonModule]
})

export class FormMessageComponent {
  /**
   * Message to display in the form message component.
   * Can be an error or success message.
   */
  @Input() message: string = '';

  /**
   * Type of the message: 'error' | 'success'.
   * Determines the styling of the message.
   */
  @Input() type: 'error' | 'success' = 'error';
}