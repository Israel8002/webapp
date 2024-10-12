import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';

@Component({
  selector: 'app-register',
  template: `
    <StackLayout class="p-4">
      <Label text="Register" class="text-2xl font-bold mb-4"></Label>
      <TextField [(ngModel)]="email" hint="Email" keyboardType="email" autocorrect="false" autocapitalizationType="none" class="mb-2 p-2 border rounded"></TextField>
      <TextField [(ngModel)]="password" hint="Password" secure="true" class="mb-4 p-2 border rounded"></TextField>
      <Button text="Register" (tap)="onRegister()" class="bg-blue-500 text-white p-2 rounded"></Button>
      <Button text="Back to Login" (tap)="onBackToLogin()" class="mt-2 bg-gray-300 p-2 rounded"></Button>
    </StackLayout>
  `
})
export class RegisterComponent {
  email: string;
  password: string;

  constructor(private routerExtensions: RouterExtensions) {}

  async onRegister() {
    try {
      const user = await firebase().auth().createUserWithEmailAndPassword(this.email, this.password);
      console.log('User registered:', user);
      this.routerExtensions.navigate(['/evaluation'], { clearHistory: true });
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }

  onBackToLogin() {
    this.routerExtensions.back();
  }
}