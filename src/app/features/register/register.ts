import {
  Component,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './register.html',

  styleUrl: './register.scss'
})
export class Register {

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  // =====================================================
  // FORM DATA
  // =====================================================

  firstName = '';

  lastName = '';

  email = '';

  password = '';

  role = '';


  // =====================================================
  // UI STATE
  // =====================================================

  loading = signal(false);

  errorMessage = signal('');

  successMessage = signal('');

  showPassword = signal(false);


  // =====================================================
  // REGISTER
  // =====================================================

  async register(): Promise<void> {

    // Clear previous messages
    this.errorMessage.set('');

    this.successMessage.set('');


    // Validate first name
    if (!this.firstName.trim()) {

      this.errorMessage.set(
        'Please enter your first name.'
      );

      return;
    }


    // Validate last name
    if (!this.lastName.trim()) {

      this.errorMessage.set(
        'Please enter your last name.'
      );

      return;
    }


    // Validate email
    if (!this.email.trim()) {

      this.errorMessage.set(
        'Please enter your email.'
      );

      return;
    }


    // Validate password
    if (!this.password) {

      this.errorMessage.set(
        'Please enter your password.'
      );

      return;
    }


    // Validate role
    if (!this.role) {

      this.errorMessage.set(
        'Please select a role.'
      );

      return;
    }


    // Start loading
    this.loading.set(true);


    try {

      // Send registration request
      const user =
        await this.authService.register({

          email: this.email.trim(),

          password: this.password,

          firstName: this.firstName.trim(),

          lastName: this.lastName.trim(),

          role: this.role

        });


      console.log(
        'Registration successful:',
        user
      );


      this.successMessage.set(
        'Account created successfully.'
      );


      // Go to login after registration
      setTimeout(() => {

        this.router.navigate([
          '/login'
        ]);

      }, 1000);


    } catch (error: any) {

      console.error(
        'Registration failed:',
        error
      );


      // Validation error
      if (error?.status === 400) {

        this.errorMessage.set(
          error?.error?.message ||
          'Registration failed. Please check your information.'
        );

      }

      // Conflict - email already exists
      else if (error?.status === 409) {

        this.errorMessage.set(
          'An account with this email already exists.'
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
  // PASSWORD TOGGLE
  // =====================================================

  togglePassword(): void {

    this.showPassword.update(
      value => !value
    );

  }


  // =====================================================
  // GO TO LOGIN
  // =====================================================

  goToLogin(): void {

    this.router.navigate([
      '/login'
    ]);

  }
}