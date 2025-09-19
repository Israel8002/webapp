import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <ScrollView>
      <StackLayout class="login-container">
        <!-- Header -->
        <StackLayout class="header">
          <Label text="🔐" class="header-icon"></Label>
          <Label text="Iniciar Sesión" class="header-title"></Label>
          <Label text="Accede a tu cuenta para continuar" class="header-subtitle"></Label>
        </StackLayout>

        <!-- Login Form -->
        <StackLayout class="form-container">
          <TextField 
            [(ngModel)]="loginForm.get('email')?.value"
            (ngModelChange)="loginForm.patchValue({email: $event})"
            hint="Correo electrónico" 
            keyboardType="email" 
            autocorrect="false" 
            autocapitalizationType="none" 
            class="form-input"
            [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
          </TextField>
          <Label *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                 text="Ingresa un correo válido" class="error-message"></Label>

          <TextField 
            [(ngModel)]="loginForm.get('password')?.value"
            (ngModelChange)="loginForm.patchValue({password: $event})"
            hint="Contraseña" 
            secure="true" 
            class="form-input"
            [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
          </TextField>
          <Label *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                 text="La contraseña es requerida" class="error-message"></Label>

          <Button text="¿Olvidaste tu contraseña?" (tap)="onForgotPassword()" class="forgot-password"></Button>

          <Button text="Iniciar Sesión" 
                  (tap)="onLogin()" 
                  [isEnabled]="!isLoading && loginForm.valid"
                  class="login-button"
                  [class.loading]="isLoading">
          </Button>

          <StackLayout orientation="horizontal" class="divider">
            <Label text="─────────────" class="divider-line"></Label>
            <Label text="o" class="divider-text"></Label>
            <Label text="─────────────" class="divider-line"></Label>
          </StackLayout>

          <Button text="Crear Cuenta" (tap)="onRegister()" class="register-button"></Button>
        </StackLayout>

        <!-- Loading -->
        <app-loading [isLoading]="isLoading" message="Iniciando sesión..."></app-loading>
        
        <!-- Error Message -->
        <app-error-message [error]="errorMessage" [showRetry]="false"></app-error-message>
      </StackLayout>
    </ScrollView>
  `,
  styles: [`
    .login-container {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100%;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-top: 40px;
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
    .forgot-password {
      color: #667eea;
      font-size: 14px;
      text-align: right;
      margin-bottom: 20px;
      background-color: transparent;
      border-width: 0;
    }
    .login-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 18px;
      border-radius: 10px;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .login-button:disabled {
      opacity: 0.6;
    }
    .login-button.loading {
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
    .register-button {
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private routerExtensions: RouterExtensions,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    }
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = null;

      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      
      this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    } catch (error) {
      this.errorMessage = error.message || 'Error al iniciar sesión';
    } finally {
      this.isLoading = false;
    }
  }

  onRegister() {
    this.routerExtensions.navigate(['/register']);
  }

  async onForgotPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      alert('Por favor ingresa tu correo electrónico primero');
      return;
    }

    try {
      await this.authService.resetPassword(email);
      alert('Se ha enviado un enlace de recuperación a tu correo electrónico');
    } catch (error) {
      alert(error.message || 'Error al enviar el enlace de recuperación');
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}