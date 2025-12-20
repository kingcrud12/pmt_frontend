import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { AuthPayloadRegister } from "../../../core/models/auth.model";
import { FormMessageComponent } from "../../../shared/components/form/form-message/form-message";

/**
 * RegisterComponent
 * 
 * Comprehensive user registration component with advanced features:
 * - Real-time password strength indicator
 * - Visual password requirements validation
 * - Toggle password visibility
 * - Social registration (Google, Microsoft)
 * - Terms and conditions acceptance
 * - Responsive design with animations
 * - Comprehensive form validation
 * - Security features display
 * 
 * @class RegisterComponent
 * @implements {OnInit}
 * 
 * @example
 * // Usage in routing module
 * {
 *   path: 'register',
 *   component: RegisterComponent
 * }
 */
@Component({
    selector: "app-register",
    templateUrl: "register.component.html",
    styleUrl: "register.component.css",
    imports: [CommonModule, ReactiveFormsModule, RouterLink, FormMessageComponent]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  showPassword = false;
  showConfirmPassword = false;

  passwordStrength = 0;
  hasMinLength = false;
  hasUpperCase = false;
  hasLowerCase = false;
  hasNumber = false;
  hasSpecialChar = false;

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
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        this.passwordValidator.bind(this)
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
      role: ['User', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.updatePasswordStrength();
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  /**
   * Custom validator for password complexity
   * Ensures password contains:
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
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

  updatePasswordStrength(): void {
    const password = this.f['password'].value;
    
    if (!password) {
      this.passwordStrength = 0;
      this.resetPasswordRequirements();
      return;
    }

    this.hasMinLength = password.length >= 8;
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasLowerCase = /[a-z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 0;
    if (this.hasMinLength) strength++;
    if (this.hasUpperCase) strength++;
    if (this.hasLowerCase) strength++;
    if (this.hasNumber) strength++;
    if (this.hasSpecialChar) strength++;

    // Normalize to 4-point scale
    this.passwordStrength = Math.min(Math.floor(strength * 4 / 5), 4);
  }

  private resetPasswordRequirements(): void {
    this.hasMinLength = false;
    this.hasUpperCase = false;
    this.hasLowerCase = false;
    this.hasNumber = false;
    this.hasSpecialChar = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire';
      this.scrollToTop();
      return;
    }

    this.isLoading = true;

    const payload: AuthPayloadRegister = {
      firstName: this.f['firstName'].value.trim(),
      lastName: this.f['lastName'].value.trim(),
      email: this.f['email'].value.trim().toLowerCase(),
      phoneNumber: this.f['phoneNumber'].value.trim(),
      password: this.f['password'].value,
      role: this.f['role'].value
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = 'Inscription réussie ! Connexion automatique en cours...';
          this.scrollToTop()
          
          // Auto-login after successful registration
          this.authService.login({
            email: payload.email,
            password: payload.password
          }).subscribe({
            next: (loginResponse) => {
              if (loginResponse.success) {
                setTimeout(() => {
                  this.router.navigate(['/tasks']);
                }, 500);
              }
            },
            error: (loginError) => {
              // Registration succeeded but auto-login failed
              console.error('Auto-login error:', loginError);
              this.successMessage = 'Inscription réussie ! Veuillez vous connecter.';
              setTimeout(() => {
                this.router.navigate(['/auth/login']);
              }, 2000);
            }
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        // Handle different error scenarios
        if (error.status === 409) {
          this.errorMessage = 'Un compte existe déjà avec cet email';
        } else if (error.status === 422) {
          this.errorMessage = 'Données invalides. Veuillez vérifier vos informations';
        } else if (error.status === 0) {
          this.errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet';
        } else {
          this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer';
        }
        
        console.error('Registration error:', error);
        this.scrollToTop();
      }
    });
  }

  resetForm(): void {
    this.registerForm.reset({ 
      role: 'User',
      acceptTerms: false
    });
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.passwordStrength = 0;
    this.resetPasswordRequirements();
  }

  registerWithGoogle(): void {
    console.log('Google registration clicked');
    // TODO: Implement Google OAuth
    // this.authService.registerWithGoogle().subscribe(...);
    
    this.errorMessage = 'L\'inscription avec Google sera bientôt disponible';
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  registerWithMicrosoft(): void {
    console.log('Microsoft registration clicked');
    // TODO: Implement Microsoft OAuth
    // this.authService.registerWithMicrosoft().subscribe(...);
    
    this.errorMessage = 'L\'inscription avec Microsoft sera bientôt disponible';
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}