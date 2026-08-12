import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-reset-password-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogContent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-password-dialog.html',
  styleUrl: './reset-password-dialog.scss',
})
export class ResetPasswordDialog {
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ResetPasswordDialog>);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  newPassword = signal('');

  confirm() {
    if (this.newPassword().length < 6) {
      this.notificationService.error('Lozinka mora imati bar 6 karaktera.');
      return;
    }

    this.authService.resetPassword(this.data.userId, this.newPassword()).subscribe({
      next: () => {
        this.notificationService.success('Lozinka je uspešno promenjena!');
        this.dialogRef.close(true);
      },
      error: () => this.notificationService.error('Greška pri promeni lozinke.')
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}