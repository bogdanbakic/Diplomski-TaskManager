import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationApiService } from '../../services/notification-api-service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.scss',
})
export class NotificationBell implements OnInit {
  private readonly notificationApiService = inject(NotificationApiService);

  notifications = this.notificationApiService.notifications;
  unreadCount = this.notificationApiService.unreadCount;

  ngOnInit() {
    this.notificationApiService.refresh();
  }

  onNotificationClick(id: number) {
    this.notificationApiService.markAsRead(id);
  }
}