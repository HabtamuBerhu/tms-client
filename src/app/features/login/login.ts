import {
  Component,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  // =====================================================
  // FORM DATA
  // =====================================================

  email = '';

  password = '';


  // =====================================================
  // UI STATE
  // =====================================================

  loading = signal(false);

  errorMessage = signal('');

  showPassword = signal(false);


  // =====================================================
  // LOGIN
  // =====================================================

  async login(): Promise<void> {

    // Clear previous error
    this.errorMessage.set('');

    // Validate fields
    if (!this.email.trim()) {

      this.errorMessage.set(
        'Please enter your email.'
      );

      return;
    }

    if (!this.password) {

      this.errorMessage.set(
        'Please enter your password.'
      );

      return;
    }


    // Start loading
    this.loading.set(true);

    try {

      // Call API
      const user =
        await this.authService.login({
          email: this.email.trim(),
          password: this.password
        });


      console.log(
        'Login successful:',
        user
      );


      // Verify current session
      const currentUser =
        await this.authService.currentUser();


      console.log(
        'Current user:',
        currentUser
      );


      // Navigate to dashboard
      await this.router.navigate([
        '/dashboard'
      ]);

    } catch (error: any) {

      console.error(
        'Login failed:',
        error
      );


      // Invalid credentials
      if (error?.status === 401) {

        this.errorMessage.set(
          'Invalid email or password.'
        );

      }

      // Validation error
      else if (error?.status === 400) {

        this.errorMessage.set(
          'Please check your email and password.'
        );

      }

      // Server error
      else if (error?.status >= 500) {

        this.errorMessage.set(
          'Server error. Please try again later.'
        );

      }

      // Connection error
      else {

        this.errorMessage.set(
          'Unable to connect to the server.'
        );
      }

    } finally {

      this.loading.set(false);
    }
  }


  // =====================================================
  // TOGGLE PASSWORD
  // =====================================================

  togglePassword(): void {

    this.showPassword.update(
      value => !value
    );
  }
}