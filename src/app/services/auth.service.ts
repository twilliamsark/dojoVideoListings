import { Injectable, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<User | null>(null);

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.user.set(user);
    });
  }

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  async signInAnonymous() {
    try {
      const result = await signInAnonymously(this.auth);
      return result;
    } catch (error) {
      throw error;
    }
  }

  isAdmin(): boolean {
    const u = this.user();
    return u !== null && u.email !== null; // Email/password users are admins
  }

  isAuthenticated(): boolean {
    return this.user() !== null;
  }
}
