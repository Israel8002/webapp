import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';

@Component({
  selector: 'app-login',
  template: `
    <StackLayout class="p-4">
      <Label text="Login" class="text-2xl font-bold mb-4"></Label>
      <TextField [(ngModel)]="email" hint="Email" keyboardType="email" autocorrect="false" autocapitalizationType="none" class="mb-2 p-2 border rounded"></TextField>
      <TextField [(ngModel)]="password" hint="Password" secure="true" class="mb-4 p-2 border rounded"></TextField>
      <Button text="Login" (tap)="onLogin()" class="bg-blue-500 text-white p-2 rounded"></Button>
      <Button text="Register" (tap)="onRegister()" class="mt-2 bg-gray-300 p-2 rounded"></Button>
    </StackLayout>
  `
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(private routerExtensions: RouterExtensions) {}

  async onLogin() {
    try {
      const user = await firebase().auth().signInWithEmailAndPassword(this.email, this.password);
      console.log('User logged in:', user);
      this.routerExtensions.navigate(['/evaluation'], { clearHistory: true });
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  }

  onRegister() {
    this.routerExtensions.navigate(['/register']);
  }
}