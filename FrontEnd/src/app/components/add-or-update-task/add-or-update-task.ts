import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task-service';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TaskItem } from '../../models/task-item.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification-service';
import { TaskItemStatus } from '../../models/task-item-status';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user-service';


@Component({
  selector: 'app-add-or-update-task',
  standalone: true,
  imports: [
    MatDialogModule, MatButtonModule, MatSelectModule, MatInputModule, MatFormFieldModule,
    FormsModule, MatNativeDateModule, MatIconModule, MatDatepickerModule, ReactiveFormsModule,
    CommonModule, MatTimepickerModule, MatSnackBarModule],
  templateUrl: './add-or-update-task.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './add-or-update-task.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddOrUpdateTask {
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<AddOrUpdateTask>, { optional: true });
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  readonly dialogTitle = computed(() => this.data?.id ? `Editovanje zadatka: ${this.data.name}` : 'Kreiranje novog zadatka');

  data = inject(MAT_DIALOG_DATA, { optional: true });
  minDate = new Date();

  usersResource = rxResource({
    stream: () => this.userService.getAll(),
    defaultValue: []
  });

  taskForm = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    status: TaskItemStatus.ToDo,
    startDate: [new Date(), Validators.required],
    startTime: [new Date(), Validators.required],
    endDate: [new Date(), Validators.required],
    endTime: [new Date(), Validators.required],
    assignedToUserId: [null as string | null]
  });

  ngOnInit() {
    if (this.data) {
      const start = new Date(this.data.startDate + (this.data.startDate.endsWith('Z') ? '' : 'Z'));
      const end = new Date(this.data.endDate + (this.data.endDate.endsWith('Z') ? '' : 'Z'));

      this.taskForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        status: this.data.status,
        startDate: this.data.startDate,
        startTime: start,
        endDate: this.data.endDate,
        endTime: end,
        assignedToUserId: this.data.assignedToUserId ?? null
      })
    }
    if (this.data?.status === TaskItemStatus.Done) {
      this.taskForm.disable();
    }
  }

  saveTask() {
    if (this.taskForm.invalid) {
      this.notificationService.error('Please fill out all fields correctly.');
      return;
    }

    const rawValue = this.taskForm.getRawValue();

    const taskPayload: TaskItem = {
      id: rawValue.id ? rawValue.id : null,
      name: rawValue.name ?? '',
      description: rawValue.description ?? '',
      status: rawValue.status ?? TaskItemStatus.ToDo,
      startDate: this.combineDateAndTime(rawValue.startDate!, rawValue.startTime!)!,
      endDate: this.combineDateAndTime(rawValue.endDate!, rawValue.endTime!)!,
      assignedToUserId: rawValue.assignedToUserId ?? null
    };

    const request$ = this.data?.id
      ? this.taskService.updateTask(this.data.id, taskPayload)
      : this.taskService.createTask(taskPayload);

    request$.subscribe({
      next: (response) => {
        this.notificationService.success(`${this.data?.id ? 'Updated' : 'Created'} task successfully!`);
        this.dialogRef?.close(response);
      },
      error: (error) => {
        this.notificationService.error('Error occurred while updating task!');
      }
    });
  }

  private combineDateAndTime(date: Date, time: Date): Date | null {
    if (!date || !time) return null;
    const combined = new Date(date);
    combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return combined;
  }
}