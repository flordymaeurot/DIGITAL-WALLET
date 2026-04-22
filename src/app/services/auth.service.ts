import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token) {
      this.tokenSubject.next(token);
    }
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  register(email: string, username: string, password: string, firstName?: string, lastName?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      email,
      username,
      password,
      firstName,
      lastName,
    }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return this.tokenSubject.value !== null;
  }
}
