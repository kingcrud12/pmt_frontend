import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { AuthPayloadLogin } from "../../../core/models/auth.model";
import { FormMessageComponent } from "../../../shared/components/form/form-message/form-message";

/**
 * LoginComponent handles user authentication and login functionality.
 * 
 * This component provides a login form with email and password validation,
 * optional "remember me" functionality, and handles the authentication flow
 * including loading states and user feedback messages.
 * 
 * @class LoginComponent
 * @implements {OnInit}
 * 
 * @example
 * // Usage in routing module
 * {
 *   path: 'login',
 *   component: LoginComponent
 * }
 */
@Component({
    selector: "app-login",
    templateUrl: "login.component.html",
    styleUrl: "login.component.css",
    imports: [CommonModule, ReactiveFormsModule, RouterLink, FormMessageComponent]
})


export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire';
      return;
    }

    this.isLoading = true;

    const payload: AuthPayloadLogin = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          if (this.f['rememberMe'].value) {
            localStorage.setItem('rememberMe', 'true');
          }
          this.successMessage = 'Connexion réussie! Redirection vers le tableau de bord...';
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Email ou mot de passe incorrect. Veuillez réessayer.';
        console.error('Login error:', error);
      }
    });
  }

  resetForm(): void {
    this.loginForm.reset({ rememberMe: false });
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

}