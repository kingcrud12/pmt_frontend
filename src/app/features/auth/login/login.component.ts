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
 * This component provides a modern, professional login form with:
 * - Email and password validation
 * - Password visibility toggle
 * - Optional "remember me" functionality
 * - Social login options (Google, Microsoft)
 * - Loading states and user feedback
 * - Responsive design with animations
 * - Security indicators
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
  showPassword = false;

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

    this.checkRememberMe();
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private checkRememberMe(): void {
    const rememberMe = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('savedEmail');
    
    if (rememberMe === 'true' && savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire';
      this.scrollToTop();
      return;
    }

    this.isLoading = true;

    const payload: AuthPayloadLogin = {
      email: this.f['email'].value.trim().toLowerCase(),
      password: this.f['password'].value
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          if (this.f['rememberMe'].value) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('savedEmail', payload.email);
          } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedEmail');
          }

          this.successMessage = 'Connexion réussie ! Redirection en cours...';
      
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1500);
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        // Handle different error scenarios
        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 429) {
          this.errorMessage = 'Trop de tentatives. Veuillez réessayer dans quelques minutes';
        } else if (error.status === 0) {
          this.errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet';
        } else {
          this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer';
        }
        
        console.error('Login error:', error);
        this.scrollToTop();
      }
    });
  }

  resetForm(): void {
    this.loginForm.reset({ 
      rememberMe: false 
    });
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.showPassword = false;
  }
  
  loginWithGoogle(): void {
    console.log('Google login clicked');
    // TODO: Implement Google OAuth
    // this.authService.loginWithGoogle().subscribe(...);
    
    this.errorMessage = 'La connexion Google sera bientôt disponible';
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  loginWithMicrosoft(): void {
    console.log('Microsoft login clicked');
    // TODO: Implement Microsoft OAuth
    // this.authService.loginWithMicrosoft().subscribe(...);
    
    this.errorMessage = 'La connexion Microsoft sera bientôt disponible';
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}