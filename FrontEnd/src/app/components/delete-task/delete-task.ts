import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { TaskService } from '../../services/task-service';
import { TaskItem } from '../../models/task-item.model';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-delete-task',
  imports: [MatDialogActions, MatDialogContent],
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
    status: this.data?.status ?? '',
    description: this.data?.description ?? '',
    startDate: this.data?.startDate ?? new Date(),
    endDate: this.data?.endDate ?? new Date(),
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
