import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  usernameOrEmail = signal('');
  loading = signal(false);
  submitted = signal(false);

  onSubmit() {
    if (!this.usernameOrEmail().trim()) return;

    this.loading.set(true);
    this.authService.requestPasswordReset(this.usernameOrEmail()).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.submitted.set(true);
        this.notificationService.success(res.message);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Došlo je do greške. Pokušajte ponovo.');
      }
    });
  }
}