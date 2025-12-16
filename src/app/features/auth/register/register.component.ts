import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-register",
    templateUrl: "register.component.html",
    styleUrl: "register.component.css",
    imports: [CommonModule, ReactiveFormsModule]
})

export class RegisterComponent {}