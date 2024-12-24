import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { StateService } from './services/state.service';
import { catchError, switchMap, throwError } from 'rxjs';


// http interceptor
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const _authService = inject(AuthService);
  const _stateService = inject(StateService);
  const router = inject(Router);
  const token = _authService.accessToken;
  _stateService.setLoading(true);

  if (req.url.includes('auth/login') || req.url.includes('auth/me')) {
    return next(req);
  }

  return _authService.me().pipe(
    switchMap((user) => {
      if (user) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        })
        return next(authReq);
      } else {
        _authService.clean();
        router.navigate(['/login']);
        return throwError(() => new Error('Unauthorized'));
      }
    }),
    catchError((error) => {
      console.error('Token validation failed:', error);
      _authService.clean();
      router.navigate(['/login']);
      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync()
  ]
};
