import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email = signal('');
  username = signal('');
  password = signal('');
  confirmPassword = signal('');
  firstName = signal('');
  lastName = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.email() || !this.username() || !this.password() || !this.confirmPassword()) {
      this.errorMessage.set('All fields are required');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.password().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(
      this.email(),
      this.username(),
      this.password(),
      this.firstName(),
      this.lastName()
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.error || 'Registration failed. Please try again.');
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
