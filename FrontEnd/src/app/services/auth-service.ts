import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

interface DecodedToken {
  nameid: string;
  email: string;
  unique_name: string;
  role: string | string[];
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  private tokenSignal = signal<string | null>(null);

  isLoggedIn = computed(() => !!this.tokenSignal());
  currentUserId = computed(() => this.decodedToken()?.nameid ?? null);
  currentUserRoles = computed(() => {
    const roles = this.decodedToken()?.role;
    if (!roles) return [];
    return Array.isArray(roles) ? roles : [roles];
  });
  isAdmin = computed(() => this.currentUserRoles().includes('Admin'));

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, dto);
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dto).pipe(
      tap((response) => this.tokenSignal.set(response.token))
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private decodedToken(): DecodedToken | null {
    const token = this.tokenSignal();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch {
      return null;
    }
  }
}