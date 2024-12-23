import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../types/auth.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;
  _httpClient: HttpClient = inject(HttpClient);
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
        this.user$.next(this.user);
        return true;
      })
    );
  }
}
