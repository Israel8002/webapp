import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../models/user.model';

@Component({
  selector: 'app-register',
  template: `
    <ScrollView>
      <StackLayout class="register-container">
        <!-- Header -->
        <StackLayout class="header">
          <Label text="👤" class="header-icon"></Label>
          <Label text="Crear Cuenta" class="header-title"></Label>
          <Label text="Completa tus datos para comenzar" class="header-subtitle"></Label>
        </StackLayout>

        <!-- Registration Form -->
        <StackLayout class="form-container">
          <!-- Personal Information -->
          <Label text="Información Personal" class="section-title"></Label>
          
          <StackLayout orientation="horizontal" class="name-row">
            <TextField 
              [(ngModel)]="registerForm.get('firstName')?.value"
              (ngModelChange)="registerForm.patchValue({firstName: $event})"
              hint="Nombre" 
              class="form-input name-input"
              [class.error]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
            </TextField>
            <TextField 
              [(ngModel)]="registerForm.get('lastName')?.value"
              (ngModelChange)="registerForm.patchValue({lastName: $event})"
              hint="Apellido" 
              class="form-input name-input"
              [class.error]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
            </TextField>
          </StackLayout>

          <TextField 
            [(ngModel)]="registerForm.get('email')?.value"
            (ngModelChange)="registerForm.patchValue({email: $event})"
            hint="Correo electrónico" 
            keyboardType="email" 
            autocorrect="false" 
            autocapitalizationType="none" 
            class="form-input"
            [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
          </TextField>
          <Label *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" 
                 text="Ingresa un correo válido" class="error-message"></Label>

          <TextField 
            [(ngModel)]="registerForm.get('phone')?.value"
            (ngModelChange)="registerForm.patchValue({phone: $event})"
            hint="Teléfono (opcional)" 
            keyboardType="phone" 
            class="form-input">
          </TextField>

          <!-- Professional Information -->
          <Label text="Información Profesional" class="section-title"></Label>
          
          <TextField 
            [(ngModel)]="registerForm.get('company')?.value"
            (ngModelChange)="registerForm.patchValue({company: $event})"
            hint="Empresa (opcional)" 
            class="form-input">
          </TextField>

          <TextField 
            [(ngModel)]="registerForm.get('department')?.value"
            (ngModelChange)="registerForm.patchValue({department: $event})"
            hint="Departamento (opcional)" 
            class="form-input">
          </TextField>

          <!-- Security -->
          <Label text="Seguridad" class="section-title"></Label>
          
          <TextField 
            [(ngModel)]="registerForm.get('password')?.value"
            (ngModelChange)="registerForm.patchValue({password: $event})"
            hint="Contraseña" 
            secure="true" 
            class="form-input"
            [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
          </TextField>
          <Label *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" 
                 text="La contraseña debe tener al menos 6 caracteres" class="error-message"></Label>

          <TextField 
            [(ngModel)]="registerForm.get('confirmPassword')?.value"
            (ngModelChange)="registerForm.patchValue({confirmPassword: $event})"
            hint="Confirmar contraseña" 
            secure="true" 
            class="form-input"
            [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
          </TextField>
          <Label *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" 
                 text="Las contraseñas no coinciden" class="error-message"></Label>

          <!-- Terms and Conditions -->
          <StackLayout orientation="horizontal" class="terms-container">
            <CheckBox [(checked)]="acceptTerms" class="terms-checkbox"></CheckBox>
            <Label text="Acepto los términos y condiciones" class="terms-text" (tap)="toggleTerms()"></Label>
          </StackLayout>

          <Button text="Crear Cuenta" 
                  (tap)="onRegister()" 
                  [isEnabled]="!isLoading && registerForm.valid && acceptTerms"
                  class="register-button"
                  [class.loading]="isLoading">
          </Button>

          <StackLayout orientation="horizontal" class="divider">
            <Label text="─────────────" class="divider-line"></Label>
            <Label text="o" class="divider-text"></Label>
            <Label text="─────────────" class="divider-line"></Label>
          </StackLayout>

          <Button text="Ya tengo cuenta" (tap)="onBackToLogin()" class="login-button"></Button>
        </StackLayout>

        <!-- Loading -->
        <app-loading [isLoading]="isLoading" message="Creando cuenta..."></app-loading>
        
        <!-- Error Message -->
        <app-error-message [error]="errorMessage" [showRetry]="false"></app-error-message>
      </StackLayout>
    </ScrollView>
  `,
  styles: [`
    .register-container {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100%;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-top: 20px;
    }
    .header-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    .header-title {
      color: white;
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .header-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 16px;
    }
    .form-container {
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 20px 0 15px 0;
      padding-bottom: 5px;
      border-bottom-width: 2px;
      border-bottom-color: #667eea;
    }
    .name-row {
      margin-bottom: 10px;
    }
    .name-input {
      flex: 1;
      margin: 0 5px;
    }
    .form-input {
      padding: 15px;
      border-width: 2px;
      border-color: #e0e0e0;
      border-radius: 10px;
      margin-bottom: 10px;
      font-size: 16px;
      background-color: #f8f9fa;
    }
    .form-input.error {
      border-color: #dc3545;
      background-color: #fff5f5;
    }
    .error-message {
      color: #dc3545;
      font-size: 14px;
      margin-bottom: 15px;
      margin-left: 5px;
    }
    .terms-container {
      margin: 20px 0;
      align-items: center;
    }
    .terms-checkbox {
      margin-right: 10px;
    }
    .terms-text {
      flex: 1;
      color: #666;
      font-size: 14px;
    }
    .register-button {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      padding: 18px;
      border-radius: 10px;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .register-button:disabled {
      opacity: 0.6;
    }
    .register-button.loading {
      opacity: 0.8;
    }
    .divider {
      margin: 20px 0;
      align-items: center;
    }
    .divider-line {
      color: #ccc;
      flex: 1;
    }
    .divider-text {
      color: #666;
      margin: 0 15px;
      font-weight: bold;
    }
    .login-button {
      background-color: transparent;
      color: #667eea;
      padding: 15px;
      border-width: 2px;
      border-color: #667eea;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  acceptTerms: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private routerExtensions: RouterExtensions,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      department: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    }
  }

  async onRegister() {
    if (this.registerForm.invalid || !this.acceptTerms) {
      this.markFormGroupTouched();
      if (!this.acceptTerms) {
        alert('Debes aceptar los términos y condiciones');
      }
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = null;

      const formValue = this.registerForm.value;
      const userProfile: UserProfile = {
        uid: '', // Will be set by auth service
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone,
        company: formValue.company,
        department: formValue.department
      };

      await this.authService.register(formValue.email, formValue.password, userProfile);
      
      this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    } catch (error) {
      this.errorMessage = error.message || 'Error al crear la cuenta';
    } finally {
      this.isLoading = false;
    }
  }

  onBackToLogin() {
    this.routerExtensions.back();
  }

  toggleTerms() {
    this.acceptTerms = !this.acceptTerms;
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}