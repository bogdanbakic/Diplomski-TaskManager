import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface NotificationDto {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedTaskId: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  private apiUrl = `${environment.apiUrl}/Notifications`;

  private notificationsSignal = signal<NotificationDto[]>([]);
  readonly notifications = this.notificationsSignal.asReadonly();

  readonly unreadCount = computed(() =>
    this.notificationsSignal().filter(n => !n.isRead).length
  );

  constructor(private http: HttpClient) { }

  refresh(): void {
    this.http.get<NotificationDto[]>(this.apiUrl).subscribe({
      next: (result) => this.notificationsSignal.set(result),
      error: (err) => console.error('Error loading notifications: ', err)
    });
  }

  markAsRead(id: number): void {
    this.http.put(`${this.apiUrl}/${id}/read`, {}).subscribe({
      next: () => {
        this.notificationsSignal.update(list =>
          list.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
      },
      error: (err) => console.error('Error marking notification as read: ', err)
    });
  }
  deleteNotification(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.notificationsSignal.update(list => list.filter(n => n.id !== id));
      },
      error: (err) => console.error('Error deleting notification: ', err)
    });
  }

  clearAll(): void {
    this.http.delete(this.apiUrl).subscribe({
      next: () => {
        this.notificationsSignal.set([]);
      },
      error: (err) => console.error('Error clearing notifications: ', err)
    });
  }
}