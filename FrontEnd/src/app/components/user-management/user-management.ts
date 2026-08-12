import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { NotificationService } from '../../services/notification-service';
import { AuthService } from '../../services/auth-service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteUserConfirm } from '../delete-user-confirm/delete-user-confirm';
import { ResetPasswordDialog } from '../reset-password-dialog/reset-password-dialog';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatInputModule, FormsModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<UserManagement>, { optional: true });

  availableRoles = ['Admin', 'User'];
  displayedColumns = ['fullName', 'email', 'role', 'password', 'delete'];

  currentUserId = this.authService.currentUserId;

  resetPasswordUserId = signal<string | null>(null);
  newPassword = signal('');

  usersResource = rxResource({
    stream: () => this.userService.getAll(),
    defaultValue: []
  });

  onRoleChange(userId: string, newRole: string) {
    this.userService.updateRole(userId, newRole).subscribe({
      next: () => {
        this.notificationService.success('Role updated successfully!');
        this.usersResource.reload();
      },
      error: () => this.notificationService.error('Failed to update role.')
    });
  }

  openResetPassword(user: any) {
  this.dialog.open(ResetPasswordDialog, {
    data: { userId: user.id, fullName: user.fullName },
    width: '420px'
  });
}

  cancelResetPassword() {
    this.resetPasswordUserId.set(null);
  }

  confirmResetPassword() {
    const userId = this.resetPasswordUserId();
    if (!userId || this.newPassword().length < 6) {
      this.notificationService.error('Lozinka mora imati bar 6 karaktera.');
      return;
    }

    this.authService.resetPassword(userId, this.newPassword()).subscribe({
      next: () => {
        this.notificationService.success('Lozinka je uspešno promenjena!');
        this.resetPasswordUserId.set(null);
      },
      error: () => this.notificationService.error('Greška pri promeni lozinke.')
    });
  }

  deleteUser(user: any) {
    const dialogRef = this.dialog.open(DeleteUserConfirm, {
      data: { fullName: user.fullName },
      width: '420px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.notificationService.success('Korisnik je uspešno obrisan.');
            this.usersResource.reload();
          },
          error: (err: any) => this.notificationService.error(err?.error ?? 'Greška pri brisanju korisnika.')
        });
      }
    });
  }

  close() {
    this.dialogRef?.close();
  }
}