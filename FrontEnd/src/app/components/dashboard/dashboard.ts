// src/app/components/dashboard/dashboard.ts
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../services/dashboard-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);

  isAdmin = this.authService.isAdmin;
  dashboardData = this.dashboardService.data;

  ngOnInit() {
    this.dashboardService.refresh();
  }

  statusChartData = computed<ChartData<'pie'>>(() => {
    const data = this.dashboardData();
    if (!data) return { labels: [], datasets: [] };

    return {
      labels: data.tasksByStatus.map(s => s.status),
      datasets: [{
        data: data.tasksByStatus.map(s => s.count),
        backgroundColor: ['#42A5F5', '#FFA726', '#66BB6A']
      }]
    };
  });

  statusChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed}`
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 14 },
        formatter: (value: number) => value
      }
    }
  };

  ownershipChartData = computed<ChartData<'bar'>>(() => {
    const data = this.dashboardData();
    if (!data) return { labels: [], datasets: [] };

    return {
      labels: ['Kreirao sam', 'Dodeljeno meni'],
      datasets: [{
        data: [data.createdByMeCount, data.assignedToMeCount],
        backgroundColor: ['#42A5F5', '#AB47BC']
      }]
    };
  });

  ownershipChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'top',
        font: { weight: 'bold' }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  usersChartData = computed<ChartData<'bar'>>(() => {
    const data = this.dashboardData();
    if (!data || !data.tasksByUser) return { labels: [], datasets: [] };

    return {
      labels: data.tasksByUser.map(u => u.fullName),
      datasets: [
        { label: 'Ukupno', data: data.tasksByUser.map(u => u.totalTasks), backgroundColor: '#42A5F5' },
        { label: 'Zavrseno', data: data.tasksByUser.map(u => u.completedTasks), backgroundColor: '#66BB6A' }
      ]
    };
  });

  usersChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'top',
        font: { weight: 'bold', size: 11 }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };
}