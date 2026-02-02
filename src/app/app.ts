import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('dojoVideoListings');

  private authService = inject(AuthService);

  user = computed(() => this.authService.user());
  isAdmin = computed(() => this.authService.isAdmin());

  async login(email: string, password: string) {
    try {
      await this.authService.login(email, password);
    } catch (error) {
      alert('Login failed');
    }
  }

  async signInAnonymous() {
    try {
      await this.authService.signInAnonymous();
    } catch (error) {
      alert('Anonymous sign-in failed');
    }
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      alert('Logout failed');
    }
  }
}
