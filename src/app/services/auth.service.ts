import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../types/auth.type';
import { StateService } from './state.service';

const JWTParser = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};
const isTokenExpired = (token: string) => {
  const decodedToken = JWTParser(token);
  const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  return currentTime > expirationTime;
};
const isTokenValid = (token: string) => {
  const decodedToken = JWTParser(token);
  const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  return currentTime < expirationTime;
};
const isTokenAboutToExpire = (token: string) => {
  const decodedToken = JWTParser(token);
  const expirationTime = decodedToken.exp; // Convert to milliseconds
  const currentTime = Date.now();
  const nowEpoh = Math.floor(currentTime / 1000);
  const timeLeft = expirationTime - nowEpoh; // Time left in seconds
  const threshold = 60 * 60; // 24 hours in seconds
  // const threshold = 200; // 24 hours in seconds
  return timeLeft < threshold;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;
  readonly _httpClient: HttpClient = inject(HttpClient);
  readonly _stateService = inject(StateService);
  user$ = new BehaviorSubject<User | null>(null);

  set accessToken(token: string) {
    localStorage.setItem('appAccessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('appAccessToken') ?? '';
  }

  set user(user: User) {
    localStorage.setItem('appUser', JSON.stringify(user));
    this.user$.next(user);
  }

  get user(): User {
    return JSON.parse(localStorage.getItem('appUser') ?? '{}');
  }

  clean = () => {
    localStorage.removeItem('appAccessToken');
    localStorage.removeItem('appUser');
    this.user$.next(null);
  }

  signIn(email: string, password: string): Observable<boolean> {
    return this._httpClient.post(this.apiUrl + '/auth/login', { email, password }).pipe(
      map((response: any) => {
        this.accessToken = response.access_token;
        this.user = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          status: 'online',
        };
        this._stateService.setLoading(false);
        this.user$.next(this.user);
        return true;
      })
    );
  }

  me = () => {
    const lastCheck = localStorage.getItem('lastCheck');
    if (lastCheck && Date.now() - parseInt(lastCheck) < 60000) {
      return of(this.user);
    }
    localStorage.setItem('lastCheck', Date.now().toString());
    return this._httpClient.post<User>(this.apiUrl + '/auth/me', {}, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    })
  }

  requestPasswordReset(email: string): Observable<any> {
    return this._httpClient.post(this.apiUrl + '/auth/request-password-reset', { email });
  }

  passwordResetWithToken(token: string, password: string, password_confirmation: string): Observable<any> {
    return this._httpClient.post(this.apiUrl + '/auth/password-reset', { token, password, password_confirmation });
  }

  refreshToken(): Observable<any> {
    return this._httpClient.post(this.apiUrl + '/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    }).pipe(
      switchMap((response: any) => {
        this.accessToken = response.access_token;
        this.accessToken = response.access_token;
        return this.me();
      })
    );
  }

  isTokenAboutToExpire(): boolean {
    const token = this.accessToken;
    return isTokenAboutToExpire(token);
  }
  isTokenExpired(): boolean {
    const token = this.accessToken;
    return isTokenExpired(token);
  }
  isTokenValid(): boolean {
    const token = this.accessToken;
    return isTokenValid(token);
  }
}
