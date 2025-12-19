import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthPayloadLogin, AuthPayloadRegister, AuthResponse, CurrentUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Authentication Service
 * 
 * Manages user authentication operations including registration, login, logout,
 * and token management. Maintains the current user state using RxJS BehaviorSubject
 * and persists authentication data to localStorage.
 * 
 * @class AuthService
 * @property {BehaviorSubject<CurrentUser | null>} currentUserSubject - Internal subject tracking current user state
 * @property {Observable<CurrentUser | null>} currentUser$ - Public observable stream of current user
 * @property {string} apiUrl - Base URL for authentication API endpoints
 */
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.getCurrentUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   * @param payload Registration data
   * @returns Observable of AuthResponse
   */
  register(payload: AuthPayloadRegister): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.storeUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }
  
  /**
   * Login user
   * @param payload Login data
   * @returns Observable of AuthResponse
   */
  login(payload: AuthPayloadLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.storeUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  /**
   * Logout user
   * @returns void
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  /**
   * Get current user
   * @return CurrentUser | null
   */
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null && !!this.getToken();
  }

  /**
   * Get authentication token
   * @returns string | null
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Store user data in localStorage
   * @param user CurrentUser
   */
  private storeUser(user: CurrentUser): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.token) {
      localStorage.setItem('authToken', user.token);
    }
  }

  /**
   * Retrieve current user from localStorage
   * @returns CurrentUser | null
   */
  private getCurrentUserFromStorage(): CurrentUser | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
