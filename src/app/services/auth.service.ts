
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TmsUser {
  email: string;
  displayName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:5273/api/auth';

  // Store JWT access token in memory
  private readonly accessToken =
    signal<string | null>(null);

  // Current logged-in user
  currentUser =
    signal<TmsUser | null>(null);


  // ==========================================
  // GET ACCESS TOKEN
  // ==========================================

  getAccessToken(): string | null {
    return this.accessToken();
  }


  // ==========================================
  // CHECK USER ROLE
  // ==========================================

  hasRole(role: string): boolean {

    const user = this.currentUser();

    return (
      user?.role === role ||
      user?.role === 'Admin'
    );
  }


  // ==========================================
  // LOGIN
  // ==========================================

  async login(
    credentials: LoginRequest
  ): Promise<void> {

    const res = await firstValueFrom(
      this.http.post<AuthResponse>(
        `${this.baseUrl}/login`,
        credentials
      )
    );

    // Store JWT access token
    this.accessToken.set(
      res.accessToken
    );


    // Decode JWT payload
    const payload = JSON.parse(
      atob(
        res.accessToken.split('.')[1]
      )
    );


    // Get role from JWT
    const role =
      payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ]
      || payload.role
      || 'Student';


    // Store current user
    this.currentUser.set({
      email:
        payload.email ||
        payload.sub ||
        '',

      displayName:
        payload.name ||
        payload.email ||
        'User',

      role: role
    });
  }


  // ==========================================
  // REGISTER
  // ==========================================

  async register(
    data: RegisterRequest
  ): Promise<void> {

    await firstValueFrom(
      this.http.post(
        `${this.baseUrl}/register`,
        data
      )
    );
  }


  // ==========================================
  // GET CURRENT USER
  // ==========================================

  async loadCurrentUser(): Promise<TmsUser | null> {

    const token =
      this.getAccessToken();

    if (!token) {
      return null;
    }

    const payload = JSON.parse(
      atob(
        token.split('.')[1]
      )
    );


    const role =
      payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ]
      || payload.role
      || 'Student';


    const user: TmsUser = {

      email:
        payload.email ||
        payload.sub ||
        '',

      displayName:
        payload.name ||
        payload.email ||
        'User',

      role: role
    };


    this.currentUser.set(user);

    return user;
  }


  // ==========================================
  // LOGOUT
  // ==========================================

  async logout(): Promise<void> {

    try {

      await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/logout`,
          {}
        )
      );

    } catch (error) {

      console.error(
        'Logout error:',
        error
      );

    } finally {

      // Remove JWT from memory
      this.accessToken.set(null);

      // Remove current user
      this.currentUser.set(null);
    }
  }
}
