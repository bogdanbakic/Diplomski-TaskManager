import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-user-confirm',
  standalone: true,
  imports: [MatDialogActions, MatDialogContent, MatIconModule, MatButtonModule],
  templateUrl: './delete-user-confirm.html',
  styleUrl: './delete-user-confirm.scss',
})
export class DeleteUserConfirm {
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<DeleteUserConfirm>);

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}