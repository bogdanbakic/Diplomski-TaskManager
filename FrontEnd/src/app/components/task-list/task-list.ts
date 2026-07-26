import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TaskItem } from '../../models/task-item.model';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskService } from '../../services/task-service';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddOrUpdateTask } from '../add-or-update-task/add-or-update-task';
import { MatIconModule } from '@angular/material/icon';
import { DeleteTask } from '../delete-task/delete-task';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from "@angular/material/select";
import { TaskItemStatus } from '../../models/task-item-status';
import { NotificationService } from '../../services/notification-service';


@Component({
  selector: 'app-task-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, MatTableModule,
    MatDialogModule, MatIconModule, MatRadioModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})

export class TaskListComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);
  public TaskItemStatus = TaskItemStatus;

  StatusEnum = TaskItemStatus;
  statusList = Object.values(TaskItemStatus);

  selectedStatus = signal<TaskItemStatus>(TaskItemStatus.All);
  displayedColumns: string[] = ['name', 'description', 'status', 'start-date', 'end-date', 'actions'];

  taskResource = rxResource({
    stream: () => this.taskService.getAll(this.selectedStatus() == TaskItemStatus.All ? undefined : this.selectedStatus()),
    defaultValue: []
  });

  addTask() {
    this.router.navigate(['add-task'], { relativeTo: this.route });
    const dialogRef = this.dialog.open(AddOrUpdateTask, {
      panelClass: 'add-or-update-task.scss',
      data: null,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['./'], { relativeTo: this.route });
      this.taskResource.reload();
    });
  }

  editTask(task: any) {
    if (task?.id) {
      this.router.navigate(['edit-task', task.id], { relativeTo: this.route });
    }
    const dialogRef = this.dialog.open(AddOrUpdateTask, {
      data: task
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['./'], { relativeTo: this.route });
      this.taskResource.reload();
    });
  }

  deleteTask(task: TaskItem) {
    this.router.navigate(['delete-task', task.id], { relativeTo: this.route });
    const dialogRef = this.dialog.open(DeleteTask, {
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['./'], { relativeTo: this.route });
      if (result)
        this.taskResource.reload();
    });
  }

  markAsDone(row: any) {
    const payload = {
      name: row.name,
      description: row.description,
      status: TaskItemStatus.Done,
      startDate: row.startDate,
      endDate: row.endDate
    };

    this.taskService.updateTask(row.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Task done!');
        this.taskResource.reload();
      },
      error: (err: any) => console.error('Error while updating status: ', err)
    });
  }

  onStatusChange(newStatus: any) {
    this.selectedStatus.set(newStatus);
    this.taskService.getAll(this.selectedStatus() == TaskItemStatus.All ? undefined : this.selectedStatus()).subscribe({
      next: () => {
        this.taskResource.reload();
      },
      error: (err: any) => console.error('Error while filtering tasks! ', err)
    });
  }
}
