import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { AuthPayloadRegister } from "../../../core/models/auth.model";

/**
 * RegisterComponent
 * 
 * Component for user registration with form validation.
 * Handles user registration, form validation, password strength checking,
 * and automatic login upon successful registration.
 * 
 * @class RegisterComponent
 * @implements {OnInit}
 * 
 * @property {FormGroup} registerForm - Reactive form group for registration with fields:
 *   - firstName: required, minimum 2 characters
 *   - lastName: required, minimum 2 characters
 *   - email: required, valid email format
 *   - phoneNumber: required
 *   - password: required, minimum 8 characters, strong password validation
 *   - confirmPassword: required, must match password
 *   - role: default 'User', required
 * @property {boolean} submitted - Tracks whether the form has been submitted
 * @property {boolean} isLoading - Loading state during registration process
 * @property {string} successMessage - Success message displayed after registration
 * @property {string} errorMessage - Error message displayed on registration failure
 * 
 */
@Component({
    selector: "app-register",
    templateUrl: "register.component.html",
    styleUrl: "register.component.css",
    imports: [CommonModule, ReactiveFormsModule, RouterLink]
})



export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]],
      role: ['User', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return !passwordValid ? { passwordStrength: true } : null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire';
      return;
    }

    this.isLoading = true;

    const payload: AuthPayloadRegister = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      phoneNumber: this.f['phoneNumber'].value,
      password: this.f['password'].value,
      role: this.f['role'].value
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Inscription réussie! Redirection vers le tableau de bord...';
          this.authService.login({
            email: payload.email,
            password: payload.password
          }).subscribe({
            next: (loginResponse) => {
              if (loginResponse.success) {
                this.router.navigate(['/tasks']);
              }
          }});
        }
      },
      error: (error) => {
        console.log("error", error)
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
        console.error('Registration error:', error);
      }
    });
  }

  resetForm(): void {
    this.registerForm.reset({ role: 'User' });
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
  }
}