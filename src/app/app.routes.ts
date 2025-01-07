import { CanActivateFn, Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

const AuthGuard: CanActivateFn = () => {
  const _authSercvice = inject(AuthService);
  if (!_authSercvice.accessToken || _authSercvice.accessToken.length === 0) {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }
  _authSercvice.user$.next(_authSercvice.user);
  return true;
}

const LoginAuthGuard: CanActivateFn = () => {
  const _authSercvice = inject(AuthService);
  if (_authSercvice.accessToken && _authSercvice.accessToken.length > 0) {
    const router = inject(Router);
    router.navigate(['/']);
  }
  return true;
}

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginAuthGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoginAuthGuard] },
  { path: '**', redirectTo: '' }
];
