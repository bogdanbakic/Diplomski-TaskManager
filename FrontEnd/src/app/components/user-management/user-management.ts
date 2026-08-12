// src/app/components/user-management/user-management.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { NotificationService } from '../../services/notification-service';
import { AuthService } from '../../services/auth-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatSelectModule,
    MatFormFieldModule, MatButtonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement {
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<UserManagement>, { optional: true });

  availableRoles = ['Admin', 'User'];
  displayedColumns = ['fullName', 'email', 'role'];

  currentUserId = this.authService.currentUserId;

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

  close() {
    this.dialogRef?.close();
  }
}