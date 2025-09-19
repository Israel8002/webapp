import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';
import '@nativescript/firebase-firestore';
import { User, UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const user = firebase().auth().currentUser;
      if (user) {
        await this.loadUserProfile(user.uid);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await firebase().auth().signInWithEmailAndPassword(email, password);
      const user = await this.loadUserProfile(userCredential.user.uid);
      this.currentUserSubject.next(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  async register(email: string, password: string, userProfile: UserProfile): Promise<User> {
    try {
      const userCredential = await firebase().auth().createUserWithEmailAndPassword(email, password);
      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: `${userProfile.firstName} ${userProfile.lastName}`,
        role: 'technician',
        createdAt: new Date(),
        isActive: true
      };

      await this.saveUserProfile(user, userProfile);
      this.currentUserSubject.next(user);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await firebase().auth().signOut();
      this.currentUserSubject.next(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await firebase().auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private async loadUserProfile(uid: string): Promise<User> {
    try {
      const db = firebase().firestore();
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        return {
          uid,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role || 'technician',
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastLogin: new Date(),
          isActive: userData.isActive !== false
        };
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      throw error;
    }
  }

  private async saveUserProfile(user: User, profile: UserProfile): Promise<void> {
    try {
      const db = firebase().firestore();
      await db.collection('users').doc(user.uid).set({
        ...user,
        profile: {
          ...profile,
          uid: user.uid
        }
      });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  private handleAuthError(error: any): Error {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está en uso',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión'
    };

    const errorCode = error.code || 'unknown';
    const message = errorMessages[errorCode] || 'Error de autenticación';
    return new Error(message);
  }
}
