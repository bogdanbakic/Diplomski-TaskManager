import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { TaskService } from '../../services/task-service';
import { TaskItem } from '../../models/task-item.model';
import { NotificationService } from '../../services/notification-service';
import { TaskItemStatus } from '../../models/task-item-status';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-task',
  imports: [MatDialogActions, MatDialogContent, MatIconModule, MatButtonModule],
  templateUrl: './delete-task.html',
  styleUrl: './delete-task.scss',
})

export class DeleteTask {
  private readonly taskService = inject(TaskService);
  private readonly notificationService = inject(NotificationService);
  private dialogRef = inject(MatDialogRef<DeleteTask>, { optional: true });
  data = inject(MAT_DIALOG_DATA, { optional: true });

  model = signal<TaskItem>({
    id: this.data?.id ?? 0,
    name: this.data?.name ?? '',
    status: this.data?.status ?? TaskItemStatus.ToDo,
    description: this.data?.description ?? '',
    startDate: this.data?.startDate ?? new Date(),
    endDate: this.data?.endDate ?? new Date(),
    assignedToUserId: this.data?.assignedToUserId ?? null,
  });

  closeDelete() {
    this.dialogRef?.close()
  }

  confirmDelete() {
    this.taskService.deleteById(this.data.id!).subscribe({
      next: () => {
        this.notificationService.success('Deleted task successfully!');
        this.dialogRef?.close(true);
      },
      error: (error: any) => this.notificationService.error(error)
    });
  }

}