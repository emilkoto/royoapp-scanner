import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  showErrorMessage = false;
  showSuccessMessage = false;

  onSubmit() {
    this.showErrorMessage = false;
    if (this.loginForm.valid) {
      const { email } = this.loginForm.value;
      this.authService.requestPasswordReset(email ?? '').subscribe({
        next: () => {
          this.showSuccessMessage = true;
          this.showErrorMessage = false;
        },
        error: (error) => {
          this.showErrorMessage = true;
          this.showSuccessMessage = false;
        }
      });
    }
  }
}
