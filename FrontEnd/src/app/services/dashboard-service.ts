// src/app/services/dashboard-service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface StatusCountDto {
  status: string;
  count: number;
}

export interface UserTaskCountDto {
  userId: string;
  fullName: string;
  totalTasks: number;
  completedTasks: number;
}

export interface DashboardDto {
  tasksByStatus: StatusCountDto[];
  createdByMeCount: number;
  assignedToMeCount: number;
  overdueCount: number;
  totalActiveCount: number;
  tasksByUser: UserTaskCountDto[] | null;
  totalUsersCount: number | null;
  totalTasksInSystemCount: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/Dashboard`;

  private dataSignal = signal<DashboardDto | null>(null);
  readonly data = this.dataSignal.asReadonly();

  constructor(private http: HttpClient) { }

  refresh(): void {
    this.http.get<DashboardDto>(this.apiUrl).subscribe({
      next: (result) => this.dataSignal.set(result),
      error: (err) => console.error('Error loading dashboard: ', err)
    });
  }
}