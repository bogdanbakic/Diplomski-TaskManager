// src/app/components/user-management/user-management.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { NotificationService } from '../../services/notification-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSelectModule, MatFormFieldModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement {
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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

  goBack() {
    this.router.navigate(['/task-list']);
  }
}